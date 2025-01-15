import { getLocalizedText } from "../../utils/localized-text";

const SimpleAnnouncementComponent = ({
  isPreview,
  shopLocale,
  announcementModule,
  title,
  titleTranslations,
  subtitle,
  subtitleTranslations,
}: {
  isPreview: boolean;
  shopLocale: string;
  announcementModule: any;
  title?: string | null;
  titleTranslations?: any;
  subtitle?: string | null;
  subtitleTranslations?: any;
}) => {
  console.log("announcementModule", announcementModule);

  return (
    <div className="ia-announcement-titles-container">
      <div className="ia-announcement-titles">
        <div
          id="ia-announcement-title"
          className="ia-announcement-title"
          style={{
            // @ts-ignore
            "--font-size": `${announcementModule?.styles?.titleSize}px`,
            "--color": `#${announcementModule?.styles?.titleColor}`,
          }}
        >
          {getLocalizedText({
            shopLocale: shopLocale,
            translations:
              title && title !== ""
                ? titleTranslations
                : announcementModule?.singleAnnouncementText
                    ?.announcementTitleTranslations,
            fallbackText:
              title && title !== ""
                ? title
                : announcementModule?.singleAnnouncementText?.announcementTitle,
          })}
        </div>
        <p
          className="ia-announcement-subtitle"
          style={{
            // @ts-ignore
            "--font-size": `${announcementModule?.styles?.subheadingSize}px`,
            "--color": `#${announcementModule?.styles?.subheadingColor}`,
          }}
        >
          {getLocalizedText({
            shopLocale: shopLocale,
            translations:
              subtitle && subtitle !== ""
                ? subtitleTranslations
                : announcementModule?.singleAnnouncementText
                    ?.announcementSubheadingTranslations,
            fallbackText:
              subtitle && subtitle !== ""
                ? subtitle
                : announcementModule?.singleAnnouncementText
                    ?.announcementSubheading,
          })}
        </p>
      </div>
    </div>
  );
};

export default SimpleAnnouncementComponent;
