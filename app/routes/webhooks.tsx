import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log(request);

  const { topic, shop, session, admin, payload } = await authenticate.webhook(
    request
  );

  console.log("TOPIC", topic, payload);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      try {
        if (session) {
          // const storeUser = await getStoreUserData(shop);
          // if (storeUser) {
          //   await db.storeUser.delete({ where: { shop } });
          //   // Add user to MailerLite group
          //   const storeUserEmail = storeUser.email ?? "";
          //   const mailerLiteAppInstalledGroupId =
          //     process.env.MAILERLITE_APP_UNINSTALLED_GROUP_ID ??
          //     "115892848029599566";
          //   // await upsertSubscriberInMailerLite(
          //   //   storeUserEmail,
          //   //   mailerLiteAppInstalledGroupId
          //   // );
          // }
          if (session) {
            await db.session.deleteMany({ where: { shop } });
          }
        }
        return new Response("APP UNINSTALLED", {
          status: 200,
        });
      } catch (error) {
        return new Response("APP UNINSTALLED", {
          status: 200,
        });
      }

      break;
    case "CUSTOMERS_DATA_REQUEST":
      return new Response("CUSTOMERS DATA REQUEST WEBHOOK WAS SUCCESSFUL", {
        status: 200,
      });
      break;
    case "CUSTOMERS_REDACT":
      return new Response("CUSTOMERS REDACT WAS SUCCESSFUL", { status: 200 });
      break;
    case "SHOP_REDACT":
      return new Response("SHOP REDACT WAS SUCCESSFUL", { status: 200 });
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
