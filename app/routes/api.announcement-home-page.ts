import { type Announcement } from "@prisma/client";
import { json } from "@remix-run/node";
import { getAllAnnouncementsOfShopFromDb } from "../backend/db-backend.server";
import { authenticate } from "../shopify.server";

// For GET requests
export const loader = async ({ request }: { request: Request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  // Extract query parameters using URLSearchParams
  let getListOfAnnouncements: Announcement[] =
    await getAllAnnouncementsOfShopFromDb(`${shop}`);

  if (getListOfAnnouncements === null || getListOfAnnouncements === undefined) {
    getListOfAnnouncements = [];
  }

  return json({
    success: true,
    message: "API GET Response",
    listOfAnnouncements: getListOfAnnouncements,
  });
};
