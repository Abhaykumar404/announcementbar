import "vite/modulepreload-polyfill";
import React from "react";
import ReactDOM from "react-dom/client";
import "./theme.css";
import AnnouncementBar from "../../routes/preview/announcement-bar";
import "../../routes/preview/announcement-bar.css";
import { AnnouncementPosition } from "../../utils/enums/announcement-position-enum";
import { AnnouncementPlacement } from "../../utils/enums/announcement-placement-enum";
import { AnnouncementGeoTargetingLocation } from "../../utils/enums/announcement-geo-targeting-location-enum";
import { AnnouncementDateTimeType } from "../../utils/enums/announcement-datetime-enum";
import CloseButtonStorageUtils from "../../utils/local-storage-utils/close-button-storage-utils";

const renderAnnouncementBars = async () => {
  const shopLocale =
    window?.shopLocaleForAnnouncementBar?.shop_locale?.locale ?? "en-us";

  const listOfPublishedIncredibleAnnouncements =
    window.listOfPublishedIncredibleAnnouncements;

  // const countryCode = await fetchGeolocationFromEssentialServer();
  const countryCode = window.Shopify.country;

  listOfPublishedIncredibleAnnouncements.forEach((announcement) => {
    // If the announcement is not published, then skip the announcement
    if (!announcement?.published) {
      return;
    }

    // Close Button - Check if the announcement is hidden by the user by clicking the close button
    if (CloseButtonStorageUtils.getHideAnnouncementBar(announcement.id)) {
      return;
    }

    // GEO TARGETTING - If the announcement is not targeting the whole world and the country code is not in the list of specific countries, then skip the announcement
    if (
      announcement?.placement?.geolocationTargetingLocationType ===
        AnnouncementGeoTargetingLocation.SPECIFIC_COUNTRIES &&
      !announcement.placement.specificCountries.includes(countryCode)
    ) {
      return;
    }

    // // SCHEDULING - If the announcement is not scheduled to be displayed right now, then skip the announcement
    if (!isAnnouncementActive(announcement)) {
      return;
    }

    // This variable keeps a check whether the timer is app block or not
    let isAppBlock = false;

    // the element for announcement bar
    let parentElementForAnnouncementBar = document.createElement("div");

    // Finding if the owner is using app block
    const appBlockElement = document.getElementById(
      `ia-announcement-block-${announcement.id}`
    );

    if (appBlockElement) {
      parentElementForAnnouncementBar = appBlockElement;
      isAppBlock = true;
    } else {
      parentElementForAnnouncementBar.setAttribute("id", announcement.id);
      parentElementForAnnouncementBar.style.zIndex = "2147483";
      isAppBlock = false;
    }

    console.log(
      "parentElementForAnnouncementBar",
      parentElementForAnnouncementBar
    );

    // Prepending the announcement bar to the body if it is not an app block
    if (!isAppBlock) {
      if (announcement.settings.positionSticky) {
        parentElementForAnnouncementBar.style.position = "sticky";
      }

      if (announcement.settings.position === AnnouncementPosition.TOP) {
        parentElementForAnnouncementBar.style.top = "0";
        document.body.prepend(parentElementForAnnouncementBar);
      } else {
        parentElementForAnnouncementBar.style.bottom = "0";
        document.body.append(parentElementForAnnouncementBar);
      }
    }

    switch (announcement.placement.placementPosition) {
      case AnnouncementPlacement.EVERY_PAGE:
        createAnnouncementBar(
          parentElementForAnnouncementBar,
          announcement,
          shopLocale
        );
        break;
      case AnnouncementPlacement.HOME_PAGE_ONLY:
        if (window.location.pathname === "/") {
          createAnnouncementBar(
            parentElementForAnnouncementBar,
            announcement,
            shopLocale
          );
        }
        break;
      case AnnouncementPlacement.ALL_PRODUCT_PAGES:
        if (window.location.pathname.includes("/products")) {
          createAnnouncementBar(
            parentElementForAnnouncementBar,
            announcement,
            shopLocale
          );
        }
        break;
      case AnnouncementPlacement.ALL_PRODUCTS_IN_SPECIFIC_COLLECTIONS:
        // Add logic for ALL_PRODUCTS_IN_SPECIFIC_COLLECTIONS placement if needed
        break;
      case AnnouncementPlacement.SPECIFIC_PRODUCT_PAGE:
        const listOfProductsToShow = announcement.placement.showOnProducts;
        console.log("listOfProductsToShow", listOfProductsToShow);

        const isCorrectProduct = listOfProductsToShow.find((e) => {
          return window.location.pathname.endsWith(`products/${e.handle}`);
        });
        if (isCorrectProduct) {
          createAnnouncementBar(
            parentElementForAnnouncementBar,
            announcement,
            shopLocale
          );
        }
        break;
      case AnnouncementPlacement.ALL_COLLECTIONS_PAGE:
        if (window.location.pathname.includes("/collections")) {
          createAnnouncementBar(
            parentElementForAnnouncementBar,
            announcement,
            shopLocale
          );
        }
        break;
      case AnnouncementPlacement.SPECIFIC_COLLECTION_PAGE:
        const listOfCollectionsToShow =
          announcement.placement.showOnCollections;
        const isCorrectCollection = listOfCollectionsToShow.find((e) => {
          return window.location.pathname.endsWith(`collections/${e.handle}`);
        });
        if (isCorrectCollection) {
          createAnnouncementBar(
            parentElementForAnnouncementBar,
            announcement,
            shopLocale
          );
        }
        break;
      case AnnouncementPlacement.CUSTOM_POSITION:
        if (isAppBlock) {
          createAnnouncementBar(
            parentElementForAnnouncementBar,
            announcement,
            shopLocale
          );
        }
        break;
      default:
        createAnnouncementBar(
          parentElementForAnnouncementBar,
          announcement,
          shopLocale
        );
        break;
    }
  });
};

// Create announcement bar
const createAnnouncementBar = (
  parentElementForAnnouncementBar,
  announcement,
  shopLocale
) => {
  ReactDOM.createRoot(parentElementForAnnouncementBar).render(
    <AnnouncementBar
      key={announcement.id}
      isPreview={false}
      announcementModule={announcement}
      shopLocale={shopLocale}
    />
  );
};

// // Fetch location of the user
// const fetchGeolocationFromEssentialServer = async () => {
//   let clientCountry;
//   try {
//     const geolocationUrl =
//       "https://essential-announcement-bar.cc/api/geolocation";
//     const response = await fetch(geolocationUrl);

//     if (response.headers.has("country")) {
//       clientCountry = response.headers.get("country");
//     }
//   } catch (error) {
//     console.error("Error fetching geolocation", error);
//   }
//   return clientCountry;
// };

// Check if the announcement is scheduled i.e the current date is before the start date
const isAnnouncementScheduled = (announcement) => {
  if (
    announcement?.settings?.startDateTimeType ===
    AnnouncementDateTimeType.RIGHT_NOW
  ) {
    return false;
  }

  const startDate = new Date(announcement.settings.startDate);
  console.log("startDate", startDate.getTime());
  const startDateTime = startDate.getTime();

  const currentDate = new Date().getTime();
  console.log("currentDate", currentDate);
  return currentDate < startDateTime;
};

const hasAnnouncementEnded = (announcement) => {
  if (
    announcement?.settings?.endDateTimeType === AnnouncementDateTimeType.NEVER
  ) {
    return false;
  }

  const currentDate = new Date().getTime();
  const endDate = new Date(announcement.settings.endDate);
  const endDateTime = endDate.getTime();

  return currentDate >= endDateTime;
};

const isAnnouncementActive = (announcement) => {
  return (
    !isAnnouncementScheduled(announcement) &&
    !hasAnnouncementEnded(announcement)
  );
};

renderAnnouncementBars();
