import { AnnouncementType } from "./enums/announcement-type-enum";
import { v4 as uuidv4 } from "uuid";
import { CTAType } from "./enums/cta-type-enum";
import { AnnouncementPlacement } from "./enums/announcement-placement-enum";
import { BackgroundType } from "./enums/background-types-enum";
import { AnnouncementPosition } from "./enums/announcement-position-enum";
import { AnnouncementDateTimeType } from "./enums/announcement-datetime-enum";
import { AnnouncementGeoTargetingLocation } from "./enums/announcement-geo-targeting-location-enum";
import { AnnouncementPageType } from "./enums/announcement-page-type-enum";

export const incredibleAnnouncementMetafieldKey = "announcementBar";
export const incredibleAnnouncementMetafieldNamespace = "incredibleApp";
export const activateAppId = "6530ce8d-ed01-4851-967c-3af484bd329d";
// PRODUCTION
export const BACKEND_URL = "https://lithuania-catering-imports-hash.trycloudflare.com";

// DEVELOPMENT
// export const BACKEND_URL =
//   "https://bones-teddy-pushing-modem.trycloudflare.com";

export const initialAnnouncementData = {
  hasUnsavedChanges: false,
  id: "",
  name: "Announcement name",
  shop: "",
  published: false,
  announcementPageType: AnnouncementPageType.TOP_BOTTOM_BAR,
  type: AnnouncementType.SIMPLE,
  settings: {
    position: AnnouncementPosition.TOP,
    positionSticky: false,
    autoRotateMultipleAnnouncementText: true,
    rotatingAnimationDuration: "4",
    showNavigationArrows: true,
    showCloseButton: false,
    runningLineAnnouncementSpeed: "8",
    runningLineAnnouncementTextGap: "30",
    startDateTimeType: AnnouncementDateTimeType.RIGHT_NOW,
    startDate: null,
    startHours: null,
    startMinutes: null,
    startPeriod: null,
    endDateTimeType: AnnouncementDateTimeType.NEVER,
    endDate: null,
    endHours: null,
    endMinutes: null,
    endPeriod: null,
  },
  singleAnnouncementText: {
    id: uuidv4(),
    iconUrl: "",
    announcementTitle: "Enjoy a 20% discount on all our products!",
    announcementTitleTranslations: [],
    announcementSubheading: "SINGLE SUBHEADING",
    announcementSubheadingTranslations: [],
    CTAType: CTAType.BUTTON,
    CTAUrl: "",
    buttonText: "Shop now!",
    buttonTextTranslations: [],
  },
  multipleAnnouncementTexts: [
    {
      id: uuidv4(),
      iconUrl: "",
      announcementTitle: "Enjoy a 20% discount on all our products!",
      announcementTitleTranslations: [],
      announcementSubheading: "",
      announcementSubheadingTranslations: [],
      CTAType: CTAType.BUTTON,
      CTAUrl: "",
      buttonText: "Shop now!",
      buttonTextTranslations: [],
    },
    {
      id: uuidv4(),
      iconUrl: "",
      announcementTitle: "Special offer for our loyal customers!",
      announcementTitleTranslations: [],
      announcementSubheading: "",
      announcementSubheadingTranslations: [],
      CTAType: CTAType.BUTTON,
      CTAUrl: "https://www.google.com",
      buttonText: "Shop now!",
      buttonTextTranslations: [],
    },
  ],
  placement: {
    placementPosition: AnnouncementPlacement.EVERY_PAGE,
    showOnProducts: [],
    showOnCollections: [],
    showOnProductsInCollections: [],
    geolocationTargetingLocationType:
      AnnouncementGeoTargetingLocation.WHOLE_WORLD,
    specificCountries: [],
  },
  styles: {
    selectedTemplate: "Dawn",
    backgroundType: BackgroundType.SINGLE_COLOR,
    singleColor: "FFFFFF",
    gradientTurn: 90,
    gradientStart: "DDDDDD",
    gradientEnd: "FFFFFF",
    borderRadius: "0",
    borderSize: "0",
    borderColor: "C5C8D1",
    titleSize: "18",
    titleColor: "202223",
    fontFamily: "inherit",
    subheadingSize: "14",
    subheadingColor: "202223",
    buttonBackgroundColor: "202223",
    buttonFontSize: "14",
    buttonFontColor: "ffffff",
    buttonBorderRadius: "4",
    closeIconColor: "6d7175",
    arrowIconColor: "6d7175",
    spacing: {
      insideTop: 10,
      insideBottom: 10,
      outsideTop: 0,
      outsideBottom: 10,
    },
    // icon: {
    //   size: "32",
    //   originalColor: true,
    //   color: {
    //     iconColor: "333333",
    //   },
    //   background: {
    //     hex: "910505",
    //     alpha: 1,
    //   },
    //   cornerRadius: "13",
    // },
  },
};

export const globalStateInitialData = {
  discardState: initialAnnouncementData,
  listOfErrors: {},
};
