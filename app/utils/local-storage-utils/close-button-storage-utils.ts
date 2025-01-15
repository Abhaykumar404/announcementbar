class CloseButtonStorageUtils {
  static hideAnnouncementBarKey = "hideAnnouncementBar";

  static setHideAnnouncementBar(announcementId: string, value: boolean) {
    window.localStorage.setItem(
      `${this.hideAnnouncementBarKey}_${announcementId}`,
      value.toString()
    );
  }

  static getHideAnnouncementBar(announcementId: string) {
    return window.localStorage.getItem(
      `${this.hideAnnouncementBarKey}_${announcementId}`
    );
  }
}

export default CloseButtonStorageUtils;
