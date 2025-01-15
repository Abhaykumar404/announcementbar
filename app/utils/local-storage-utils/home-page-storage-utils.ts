export class HomePageStorageUtils {
  static replacePTagWithSpan(htmlString: string) {
    // Use a regular expression to find all <p> tags
    const regex = /<p([^>]*)>/gi;

    // Replace each <p> tag with a <span> tag
    const modifiedHtmlString = htmlString.replace(
      regex,
      (match, attributes) => {
        return `<span${attributes}>`;
      }
    );

    // Replace each </p> closing tag with </span>
    const finalHtmlString = modifiedHtmlString.replace(/<\/p>/gi, "</span>");

    return finalHtmlString;
  }

  private static isUserComingForFirstTimeKey = "isUserComingForFirstTimeKey";

  // function to set the last added item id in the local storage
  static setIsUserComingForFirstTimeKey(value: string) {
    try {
      window.sessionStorage.setItem(this.isUserComingForFirstTimeKey, value);
    } catch (error) {
      console.error("Error setting session storage item:", error);
    }
  }

  // function to get the last added item id from the local storage
  static getIsUserComingForFirstTimeKey() {
    try {
      return (
        window.sessionStorage.getItem(this.isUserComingForFirstTimeKey) ?? ""
      );
    } catch (error) {
      console.error("Error getting session storage item:", error);
      return "";
    }
  }

  // HIDE REVIEW BANNER ON HOME PAGE
  private static doNotShowReviewBannerHomePageKey =
    "doNotShowReviewBannerHomePageKey";
  private static doNotShowSetupGuideHomePageKey =
    "doNotShowSetupGuideHomePageKey";
  private static doNotShowShippinProtectionBannerKey =
    "doNotShowShippinProtectionBannerKey";
  private static doNotShowAppRecommndationOnHomePageKey =
    "doNotShowAppRecommndationOnHomePageKey";

  // function to set the last added item id in the local storage
  static setDoNotShowReviewBannerHomePage(value: string) {
    try {
      window.sessionStorage.setItem(
        this.doNotShowReviewBannerHomePageKey,
        value
      );
    } catch (error) {
      console.error("Error setting session storage item:", error);
    }
  }

  // function to get the last added item id from the local storage
  static getDoNotShowReviewBannerHomePage() {
    try {
      return (
        window.sessionStorage.getItem(this.doNotShowReviewBannerHomePageKey) ??
        ""
      );
    } catch (error) {
      console.error("Error getting session storage item:", error);
      return "";
    }
  }

  // function to set the last added item id in the local storage
  static setDoNotShowSetupGuideHomePage(value: string) {
    try {
      window.sessionStorage.setItem(this.doNotShowSetupGuideHomePageKey, value);
    } catch (error) {
      console.error("Error setting session storage item:", error);
    }
  }

  // function to get the last added item id from the local storage
  static getDoNotShowSetupGuideHomePage() {
    try {
      return (
        window.sessionStorage.getItem(this.doNotShowSetupGuideHomePageKey) ?? ""
      );
    } catch (error) {
      console.error("Error getting session storage item:", error);
      return "";
    }
  }

  // function to set the last added item id in the local storage
  static setDoNotShowShippinProtectionBanner(value: string) {
    try {
      window.sessionStorage.setItem(
        this.doNotShowShippinProtectionBannerKey,
        value
      );
    } catch (error) {
      console.error("Error setting session storage item:", error);
    }
  }

  // function to get the last added item id from the local storage
  static getDoNotShowShippinProtectionBanner() {
    try {
      return (
        window.sessionStorage.getItem(
          this.doNotShowShippinProtectionBannerKey
        ) ?? ""
      );
    } catch (error) {
      console.error("Error getting session storage item:", error);
      return "";
    }
  }

  // function to set the last added item id in the local storage
  static setDoNotShowAppRecommndationOnHomePage(value: string) {
    try {
      window.localStorage.setItem(
        this.doNotShowAppRecommndationOnHomePageKey,
        value
      );
    } catch (error) {
      console.error("Error setting local storage item:", error);
    }
  }

  // function to get the last added item id from the local storage
  static getDoNotShowAppRecommndationOnHomePage() {
    try {
      return (
        window.localStorage.getItem(
          this.doNotShowAppRecommndationOnHomePageKey
        ) ?? ""
      );
    } catch (error) {
      console.error("Error getting local storage item:", error);
      return "";
    }
  }
}
