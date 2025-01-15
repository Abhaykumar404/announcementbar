import db from "../db.server";
import { type Announcement, type StoreUser } from "@prisma/client";

// Create or update data in backend
export async function upsertAnnouncementDataInDb(
  announcementData: Announcement
): Promise<Announcement> {
  try {
    if (
      announcementData.id === undefined ||
      announcementData.id === null ||
      announcementData.id === ""
    ) {
      const { id, ...dataToSend } = announcementData;
      const announcementCreated = await db.announcement.create({
        data: dataToSend,
      });

      return announcementCreated;
    } else {
      const announcementFromDB = await db.announcement.findFirst({
        where: { id: announcementData.id },
      });

      // if not in db then create new cart drawer else update it
      if (announcementFromDB === null || announcementFromDB === undefined) {
        const { id, ...dataToSend } = announcementData;
        const announcementCreated = await db.announcement.create({
          data: dataToSend,
        });

        return announcementCreated;
      } else {
        const { id, ...dataToSend } = announcementData;
        const announcementUpdated = await db.announcement.update({
          where: { id },
          data: dataToSend,
        });

        return announcementUpdated;
      }
    }

    // return announcementData;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get Announcement data from backend
export async function getAllAnnouncementsOfShopFromDb(
  shop: string
): Promise<Announcement[]> {
  const announcementFromDB = await db.announcement.findMany({
    where: { shop },
  });

  return announcementFromDB;
}

// get announcement data by id
export async function getAnnouncementByIdFromDb(
  id: string
): Promise<Announcement | null> {
  const announcementFromDB = await db.announcement.findUnique({
    where: { id },
  });

  return announcementFromDB;
}

// upsert Shop data in backend
export async function upsertShopDataInDb(storeUser: StoreUser): Promise<void> {
  try {
    const existingShop = await db.storeUser.findFirst({
      where: { shop: storeUser.shop },
    });

    // if not in db then create new shop else update it
    if (existingShop === null || existingShop === undefined) {
      await db.storeUser.create({ data: storeUser });
    } else {
      await db.storeUser.update({
        where: { shop: storeUser.shop },
        data: storeUser,
      });
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

// Create or update data in backend
export async function deleteAnnouncementDataInDb(
  announcementId: string
): Promise<boolean> {
  try {
    if (
      announcementId === undefined ||
      announcementId === null ||
      announcementId === ""
    ) {
      throw new Error("Announcement id is required");
    } else {
      const announcementFromDB = await db.announcement.findFirst({
        where: { id: announcementId },
      });

      if (announcementFromDB === null || announcementFromDB === undefined) {
        throw new Error("Announcement not found");
      } else {
        await db.announcement.delete({ where: { id: announcementId } });
        return true;
      }
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

// get Shop data from backend
export async function getStoreUserDataFromDb(
  shop: string
): Promise<StoreUser | null> {
  try {
    const existingShop = await db.storeUser.findFirst({
      where: { shop },
    });

    return existingShop;
  } catch (error: any) {
    throw new Error(error);
  }
}
