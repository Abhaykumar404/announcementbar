// File: routes/api/cart.ts

import { json } from "@remix-run/node";
import { deleteAnnouncementDataInDb } from "../backend/db-backend.server";
import { authenticate } from "../shopify.server";
import {
  incredibleAnnouncementMetafieldKey,
  incredibleAnnouncementMetafieldNamespace,
} from "../utils/constants";

// For POST requests
export const action = async ({ request }: { request: Request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    const requestBody = await request.json();
    const announcementId = requestBody.id;

    const shopall = await admin.rest.resources.Shop.all({ session });
    const shopId = shopall.data[0]?.id;

    // getting the metafield of announcement
    const responseOfGetMetafieldOfAnnouncement = await admin.graphql(
      `#graphql
          query ShopMetafield($namespace: String!, $key: String!) {
            shop {
              metafield(namespace: $namespace, key: $key) {
                value
              }
            }
          }`,
      {
        variables: {
          key: incredibleAnnouncementMetafieldKey,
          namespace: incredibleAnnouncementMetafieldNamespace,
        },
      }
    );

    // getting the data of metafield of announcement
    const dataOfGetMetafieldOfAnnouncement =
      await responseOfGetMetafieldOfAnnouncement.json();

    // parsing the data of metafield of announcement
    const dataOfGetMetafieldOfAnnouncementJson = JSON.parse(
      dataOfGetMetafieldOfAnnouncement?.data?.shop?.metafield?.value ?? "{}"
    );

    // getting the list of published announcements
    let listOfPublishedAnnouncements =
      dataOfGetMetafieldOfAnnouncementJson ?? [];

    // if the announcement is not published, then remove it from the list of published announcements
    listOfPublishedAnnouncements = listOfPublishedAnnouncements.filter(
      (announcement: any) => announcement.id !== announcementId
    );

    // setting the metafields
    const responseOfMetafieldsSet = await admin.graphql(
      `#graphql
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            key
            namespace
            value
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
            code
          }
        }
      }`,
      {
        variables: {
          metafields: [
            {
              key: incredibleAnnouncementMetafieldKey,
              namespace: incredibleAnnouncementMetafieldNamespace,
              ownerId: `gid://shopify/Shop/${shopId}`,
              type: "json",
              value: JSON.stringify(listOfPublishedAnnouncements),
            },
          ],
        },
      }
    );

    // removing the data of metafields set
    await responseOfMetafieldsSet.json();

    // deleting the announcement data from db
    const isDeleted = await deleteAnnouncementDataInDb(announcementId);

    return json({
      success: true,
      message: "API POST Response",
      isDeleted,
    });
  } catch (error) {
    return json({
      success: false,
      message: "API POST Response",
      error: error,
    });
  }
};
