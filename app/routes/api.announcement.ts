// File: routes/api/cart.ts

import { type Announcement } from "@prisma/client";
import { json } from "@remix-run/node";
import {
  getAnnouncementByIdFromDb,
  upsertAnnouncementDataInDb,
} from "../backend/db-backend.server";
import { authenticate } from "../shopify.server";
import {
  incredibleAnnouncementMetafieldKey,
  incredibleAnnouncementMetafieldNamespace,
  initialAnnouncementData,
} from "../utils/constants";

// For GET requests
export const loader = async ({ request }: { request: Request }) => {
  await authenticate.admin(request);

  // Parse the URL from the request
  const url = new URL(request.url);

  // Extract query parameters using URLSearchParams
  const queryParams = new URLSearchParams(url.search);

  // Access specific query parameter, e.g., 'shop'
  const id = queryParams.get("id");

  if (!id || id === "" || id === null || id === undefined || id === "new") {
    return json({
      success: true,
      message: "API GET Response",
      announcementData: initialAnnouncementData,
    });
  }

  let announcementData: Announcement = await getAnnouncementByIdFromDb(`${id}`);

  if (announcementData === null || announcementData === undefined) {
    announcementData = initialAnnouncementData;
  }

  return json({
    success: true,
    message: "API GET Response",
    announcementData,
  });
};

// For POST requests
export const action = async ({ request }: { request: Request }) => {
  try {
    console.log("JAYANT REQUEST ==== ");

    const { admin, session } = await authenticate.admin(request);
    console.log("JAYANT AdMIN ==== ");
    console.log("JAYANT SESSION ==== ");

    const requestBody = await request.json();

    // saving in prisma db
    const announcementResultFromDb = await upsertAnnouncementDataInDb(
      requestBody
    );

    console.log(
      "JAYANT announcementResultFromDb ==== ",
      announcementResultFromDb
    );

    const shopall = await admin.rest.resources.Shop.all({ session });
    console.log("JAYANT shopall ==== ", shopall);
    const shopId = shopall.data[0]?.id;

    console.log("JAYANT SHOP ID ====", shopId);

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
      dataOfGetMetafieldOfAnnouncement?.data?.shop?.metafield?.value ?? "[]"
    );

    console.log(
      "JAYANT DATA OF GET METAFIELD OF ANNOUNCEMENT JSON ==== ",
      dataOfGetMetafieldOfAnnouncementJson
    );

    // getting the list of published announcements
    let listOfPublishedAnnouncements =
      dataOfGetMetafieldOfAnnouncementJson ?? [];

    console.log(
      "JAYANT LIST OF PUBLISHED ANNOUNCEMENTS ==== ",
      listOfPublishedAnnouncements
    );

    // if the announcement is published, then add it to the list of published announcements
    if (announcementResultFromDb.published) {
      // check if the announcement is already in the list of published announcements
      const isAnnouncementAlreadyInList = listOfPublishedAnnouncements?.some(
        (announcement: any) => announcement.id === announcementResultFromDb.id
      );

      if (!isAnnouncementAlreadyInList) {
        listOfPublishedAnnouncements.push(announcementResultFromDb);
      } else {
        // update the announcement in the list of published announcements
        listOfPublishedAnnouncements = listOfPublishedAnnouncements.map(
          (announcement: any) =>
            announcement.id === announcementResultFromDb.id
              ? announcementResultFromDb
              : announcement
        );
      }
    } else {
      // if the announcement is not published, then remove it from the list of published announcements
      listOfPublishedAnnouncements = listOfPublishedAnnouncements.filter(
        (announcement: any) => announcement.id !== announcementResultFromDb.id
      );
    }

    console.log(
      "JAYANT GET METAFIELD OF dataOfGetMetafieldOfAnnouncementJson ==== ",
      announcementResultFromDb.published,
      listOfPublishedAnnouncements?.length,
      dataOfGetMetafieldOfAnnouncementJson
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

    const dataOfMetafieldsSet = await responseOfMetafieldsSet.json();

    console.log("JAYANT METAFIELDS SET ==== ", dataOfMetafieldsSet);

    return json({
      success: true,
      message: "API POST Response",
      data: announcementResultFromDb,
    });
  } catch (error: any) {
    console.log("JAYANT ERROR RESPONSE ==== ", error);

    throw new Error(error);
  }
};
