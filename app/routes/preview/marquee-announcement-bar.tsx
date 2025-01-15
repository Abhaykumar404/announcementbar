// MarqueeAnnouncementBar.jsx
import { type Announcement } from "@prisma/client";
import { getLocalizedText } from "../../utils/localized-text";

const MarqueeAnnouncementBar = ({
  isPreview,
  announcementModule,
  shopLocale,
}: {
  isPreview: boolean;
  announcementModule: Announcement;
  shopLocale: string;
}) => {
  return (
    <div
      className="ia-marquee-parent ia-announcement-title"
      style={{
        // @ts-ignore
        "--font-size": `${announcementModule?.styles?.titleSize}px`,
        "--color": `#${announcementModule?.styles?.titleColor}`,
        "--animation-speed": `${
          announcementModule?.settings?.runningLineAnnouncementSpeed ??
          announcementModule?.settings?.runningLineAnnouncementSpeed
        }s`,
        "--gap": `${
          announcementModule?.settings?.runningLineAnnouncementTextGap ??
          announcementModule?.settings?.runningLineAnnouncementTextGap
        }px`,
      }}
    >
      {[...Array(40)].map((_, index) => {
        return (
          <span key={index}>
            {getLocalizedText({
              shopLocale: shopLocale,
              translations:
                announcementModule?.singleAnnouncementText
                  ?.announcementTitleTranslations,
              fallbackText:
                announcementModule?.singleAnnouncementText?.announcementTitle,
            })}
          </span>
        );
      })}
    </div>
  );
};

export default MarqueeAnnouncementBar;
