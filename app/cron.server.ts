import cron from "node-cron";
import { getStoreUserData } from "./backend/db-backend.server";
import { UsagePlanDifferenceConfig } from "./utils/plans-config";
import db from "./db.server";

// Define your cron job function
async function runShopifyCronJob() {
  try {
    // get access token from session table using shop

    const allSessions = await db.session.findMany();

    // fetch the api to get the billing_on date
    for (let i = 0; i < allSessions.length; i++) {
      const session = allSessions[i];
      const accessToken = session.accessToken;
      const shop = session.shop;

      await handlePostBilling({ shop, accessToken });
      await handleUsageRecordPricing({ shop, accessToken });
    }

    // Perform any other tasks or operations related to Shopify
    // ...
  } catch (error) {
    console.error("Error running Shopify cron job:", error);
  }
}

// THis function fetch the active subscription of the store for our app
const fetchActiveSubscriptionData = async ({
  shop,
  accessToken,
}: {
  shop: string;
  accessToken: string;
}) => {
  const url = `https://${shop}/admin/api/2024-04/graphql.json`;
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": accessToken,
  };
  const query = `
    query {
      app {
        installation {
          activeSubscriptions {
            id
            name
            status
            currentPeriodEnd
            lineItems {
              id
              plan {
                pricingDetails {
                  __typename
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Shopify data:", data);
    // Process the retrieved data as needed
    return data;
  } catch (error) {
    console.error("Error fetching Shopify data:", error);
  }
};

// This function check if the billing on date is changed then we reset the orders to 0
const handlePostBilling = async ({
  shop,
  accessToken,
}: {
  shop: string;
  accessToken: string;
}) => {
  try {
    const storeUserData = await getStoreUserData(shop);

    if (storeUserData) {
      // get the active subscription data from shopify graphql
      const activeSubscriptionData = await fetchActiveSubscriptionData({
        shop,
        accessToken,
      });

      // billing on Date from shopify graphql
      const billingOnDate =
        activeSubscriptionData?.data?.app?.installation?.activeSubscriptions[0]
          ?.currentPeriodEnd;

      const lineItems =
        activeSubscriptionData?.data?.app.installation?.activeSubscriptions[0]
          ?.lineItems;

      let recurringSubscriptionIdFromShopify = null;
      let usageSubscriptionIdFromShopify = null;

      if (lineItems && lineItems.length > 0) {
        for (const lineItem of lineItems) {
          const pricingDetails = lineItem.plan.pricingDetails;

          if (pricingDetails.__typename === "AppRecurringPricing") {
            recurringSubscriptionIdFromShopify = lineItem.id;
          } else if (pricingDetails.__typename === "AppUsagePricing") {
            usageSubscriptionIdFromShopify = lineItem.id;
          }
        }

        const dateFromShopify = new Date(billingOnDate);
        const dateInDb = new Date(storeUserData.billingOn ?? "");

        // if the billing on date is changed (Means Billing occured) then we reset the orders to 0
        if (dateFromShopify.getTime() !== dateInDb.getTime()) {
          const storeUser = {
            billingOn: billingOnDate,
            totalOrdersCountForBillingCycle: 0,
            usagePriceRecordForBillingCycle: [],
            recurringPricingSubscriptionId: recurringSubscriptionIdFromShopify,
            usagePricingSubscriptionId: usageSubscriptionIdFromShopify,
          };

          await db.storeUser.update({
            where: { shop },
            data: storeUser,
          });
        }
      }
    }
  } catch (error) {
    console.log("Error in handlePostBilling", error);
  }
};

const createAppUsageRecordInBackground = async ({
  shop,
  accessToken,
  subscriptionLineItemId,
  amount,
  description,
}: {
  shop: string;
  accessToken: string;
  subscriptionLineItemId: string;
  amount: number;
  description: string;
}) => {
  const url = `https://${shop}/admin/api/2024-04/graphql.json`;
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": accessToken,
  };

  const query = `
  mutation appUsageRecordCreate(
    $description: String!,
    $price: MoneyInput!,
    $subscriptionLineItemId: ID!
  ) {
    appUsageRecordCreate(
      description: $description,
      price: $price,
      subscriptionLineItemId: $subscriptionLineItemId
    ) {
      userErrors {
        field
        message
      }
      appUsageRecord {
        id
      }
    }
  }
`;

  const variables = {
    subscriptionLineItemId,
    price: {
      amount,
      currencyCode: "USD",
    },
    description,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Shopify data:", data);
    // Process the retrieved data as needed
    return data;
  } catch (error) {
    console.error("Error fetching Shopify data:", error);
  }
};

// This create a app usage record if the totalOrdersCountForBillingCycle exceeds certain limit
// and charges the user by usage pricing
const handleUsageRecordPricing = async ({
  shop,
  accessToken,
}: {
  shop: string;
  accessToken: string;
}) => {
  try {
    const storeUserFromDB = await getStoreUserData(shop);

    if (storeUserFromDB) {
      // get the totalOrdersCountForBillingCycle from the database
      let totalOrdersCountForBillingCycle =
        storeUserFromDB.totalOrdersCountForBillingCycle ?? 0;

      // get the usagePriceForBillingCycle from the database
      let usagePriceRecordForBillingCycle =
        storeUserFromDB.usagePriceRecordForBillingCycle ?? [];

      // get the usagePricingSubscriptionId from the database
      const usagePricingSubscriptionId =
        storeUserFromDB.usagePricingSubscriptionId;

      let listOfUsageRecord = [];

      const oldPlanPrice = 19.99;

      if (
        totalOrdersCountForBillingCycle > 50 &&
        parseFloat(`${storeUserFromDB.recurringPlanPrice}`) !== oldPlanPrice
      ) {
        const usageRecord = {
          ordersCrossed: 50,
          amount: UsagePlanDifferenceConfig[51].toFixed(2),
          description: "Store has crossed 50 orders for the billing cycle",
        };
        listOfUsageRecord.push(usageRecord);
      }
      if (totalOrdersCountForBillingCycle > 200) {
        const usageRecord = {
          ordersCrossed: 200,
          amount: UsagePlanDifferenceConfig[201].toFixed(2),
          description: "Store has crossed 200 orders for the billing cycle",
        };
        listOfUsageRecord.push(usageRecord);
      }
      if (totalOrdersCountForBillingCycle > 500) {
        const usageRecord = {
          ordersCrossed: 500,
          amount: UsagePlanDifferenceConfig[501].toFixed(2),
          description: "Store has crossed 500 orders for the billing cycle",
        };
        listOfUsageRecord.push(usageRecord);
      }
      if (totalOrdersCountForBillingCycle > 1000) {
        const usageRecord = {
          ordersCrossed: 1000,
          amount: UsagePlanDifferenceConfig[1001].toFixed(2),
          description: "Store has crossed 1000 orders for the billing cycle",
        };
        listOfUsageRecord.push(usageRecord);
      }
      if (totalOrdersCountForBillingCycle > 2000) {
        const usageRecord = {
          ordersCrossed: 2000,
          amount: UsagePlanDifferenceConfig[2001].toFixed(2),
          description: "Store has crossed 2000 orders for the billing cycle",
        };
        listOfUsageRecord.push(usageRecord);
      }
      if (totalOrdersCountForBillingCycle > 3000) {
        const usageRecord = {
          ordersCrossed: 3000,
          amount: UsagePlanDifferenceConfig[3001].toFixed(2),
          description: "Store has crossed 3000 orders for the billing cycle",
        };
        listOfUsageRecord.push(usageRecord);
      }

      const usedOrdersCrossed = usagePriceRecordForBillingCycle.map(
        (record: any) => record.ordersCrossed
      );

      console.log("usedOrdersCrossed", usedOrdersCrossed, shop);

      // Filter out the usage records from listOfUsageRecord that are not in usedOrdersCrossed
      const unusedRecords = listOfUsageRecord.filter(
        (record: any) => !usedOrdersCrossed.includes(record.ordersCrossed)
      );

      console.log("unusedRecords", unusedRecords, shop);

      // If we have not already charged for the usageRecord, then we charge the user
      if (unusedRecords && unusedRecords.length > 0) {
        for (const usageRecord of unusedRecords) {
          if (usagePricingSubscriptionId) {
            await createAppUsageRecordInBackground({
              shop,
              accessToken,
              subscriptionLineItemId: usagePricingSubscriptionId,
              amount: parseFloat(usageRecord.amount),
              description: usageRecord.description,
            });
          }
        }
      }

      // saving the new usagePriceForBillingCycle and totalOrdersCountForBillingCycle in the database
      const storeUser: StoreUser = {
        shop: shop,
        usagePriceRecordForBillingCycle: listOfUsageRecord,
      };

      // saving the new usagePriceForBillingCycle and totalOrdersCountForBillingCycle in the database
      await db.storeUser.update({
        where: { shop },
        data: storeUser,
      });
    }
  } catch (error) {
    console.log("Error in handleUsageRecordPricing", error);
  }
};

// Schedule the cron job to run every hour
cron.schedule("0 * * * *", runShopifyCronJob);
