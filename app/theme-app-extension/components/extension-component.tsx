import AnnouncementBar from "../../routes/preview/announcement-bar";
import "../../routes/preview/announcement-bar.css";

declare global {
  interface Window {
    Shopify: any;
    shopLocale: any;
    $crisp: any;
    jdgm: any;
    incredibleCartCurrencyFormat: string;
    CRISP_WEBSITE_ID: any;
  }
}

const ExtensionComponent = ({
  listOfPublishedAnnouncements,
}: {
  listOfPublishedAnnouncements: any;
}) => {
  const shopLocale = window?.shopLocale?.shop_locale?.locale ?? "en-us";

  return (
    <>
      {listOfPublishedAnnouncements?.map((announcement: any) => (
        <AnnouncementBar
          key={announcement.id}
          isPreview={false}
          announcementModule={announcement}
          shopLocale={shopLocale}
        />
      ))}
    </>
  );
};

export default ExtensionComponent;
