import { type Announcement } from "@prisma/client";
import SimpleAnnouncementComponent from "./simple-component";
import { CTAType } from "../../utils/enums/cta-type-enum";
import { getLocalizedText } from "../../utils/localized-text";
import { AnnouncementType } from "../../utils/enums/announcement-type-enum";
import RotatingAnnouncementBar from "./rotating-announcement-bar";
import MarqueeAnnouncementBar from "./marquee-announcement-bar";
import { BackgroundType } from "../../utils/enums/background-types-enum";
import CloseButtonStorageUtils from "../../utils/local-storage-utils/close-button-storage-utils";

const AnnouncementBar = ({
  isPreview,
  shopLocale,
  announcementModule,
}: {
  isPreview: boolean;
  shopLocale: string;
  announcementModule: Announcement;
}) => {
  return (
    <div
      className="ia-announcement-bar"
      onClick={() => {
        if (
          !isPreview &&
          announcementModule?.singleAnnouncementText?.CTAType ===
            CTAType.BAR_CLICKABLE &&
          (announcementModule?.type === AnnouncementType.SIMPLE ||
            announcementModule?.type === AnnouncementType.RUNNING_LINE)
        ) {
          window.open(
            announcementModule?.singleAnnouncementText?.CTAUrl ?? "#"
          );
        }
      }}
      style={{
        cursor:
          announcementModule?.singleAnnouncementText?.CTAType ===
          CTAType.BAR_CLICKABLE
            ? "pointer"
            : "default",
        // @ts-ignore
        "--background":
          announcementModule?.styles?.backgroundType ===
          BackgroundType.SINGLE_COLOR
            ? `#${announcementModule?.styles?.singleColor}`
            : `linear-gradient(${announcementModule?.styles?.gradientTurn}deg, #${announcementModule?.styles?.gradientStart}, #${announcementModule?.styles?.gradientEnd})`,
        "--border": `${announcementModule?.styles?.borderSize}px solid #${announcementModule?.styles?.borderColor}`,
        "--border-radius": `${announcementModule?.styles?.borderRadius}px`,
        "--font-family": announcementModule?.styles?.fontFamily,
      }}
    >
      {/* ============= Simple ============= */}
      {announcementModule?.type === AnnouncementType.SIMPLE && (
        <div className="ia-announcement-content">
          <SimpleAnnouncementComponent
            isPreview={isPreview}
            shopLocale={shopLocale}
            announcementModule={announcementModule}
          />
          {announcementModule?.singleAnnouncementText?.CTAType ===
            CTAType.BUTTON && (
            <a
              className="ia-announcement-cta"
              href={
                isPreview
                  ? "#"
                  : announcementModule?.singleAnnouncementText?.CTAUrl ?? "#"
              }
              style={{
                // @ts-ignore
                "--background": `#${announcementModule?.styles?.buttonBackgroundColor}`,
                "--color": `#${announcementModule?.styles?.buttonFontColor}`,
                "--font-size": `${announcementModule?.styles?.buttonFontSize}px`,
                "--border-radius": `${announcementModule?.styles?.buttonBorderRadius}px`,
              }}
            >
              {getLocalizedText({
                shopLocale: shopLocale,
                translations:
                  announcementModule?.singleAnnouncementText
                    ?.buttonTextTranslations,
                fallbackText:
                  announcementModule?.singleAnnouncementText?.buttonText,
              })}
            </a>
          )}
        </div>
      )}

      {/* ============= Rotating ============= */}
      {announcementModule?.type === AnnouncementType.ROTATING && (
        <RotatingAnnouncementBar
          isPreview={isPreview}
          announcementModule={announcementModule}
          shopLocale={shopLocale}
        />
      )}

      {/* ============= Marquee ============= */}
      {announcementModule?.type === AnnouncementType.RUNNING_LINE && (
        <MarqueeAnnouncementBar
          isPreview={isPreview}
          announcementModule={announcementModule}
          shopLocale={shopLocale}
        />
      )}

      {announcementModule?.type === AnnouncementType.RUNNING_LINE &&
        announcementModule?.singleAnnouncementText?.CTAType ===
          CTAType.BUTTON && (
          <a
            className="ia-announcement-cta"
            href={
              isPreview
                ? "#"
                : announcementModule?.singleAnnouncementText?.CTAUrl ?? "#"
            }
            style={{
              // @ts-ignore
              "--background": `#${announcementModule?.styles?.buttonBackgroundColor}`,
              "--color": `#${announcementModule?.styles?.buttonFontColor}`,
              "--font-size": `${announcementModule?.styles?.buttonFontSize}px`,
              "--border-radius": `${announcementModule?.styles?.buttonBorderRadius}px`,
            }}
          >
            {getLocalizedText({
              shopLocale: shopLocale,
              translations:
                announcementModule?.singleAnnouncementText
                  ?.buttonTextTranslations,
              fallbackText:
                announcementModule?.singleAnnouncementText?.buttonText,
            })}
          </a>
        )}

      {/* ============= Close Button ============= */}
      {announcementModule?.settings?.showCloseButton && (
        <button
          className="ia-announcement-close-button"
          onClick={() => {
            if (!isPreview) {
              CloseButtonStorageUtils.setHideAnnouncementBar(
                announcementModule?.id,
                true
              );

              try {
                // hide the announcement bar
                document.getElementById(`${announcementModule?.id}`)?.remove();
              } catch (error) {
                console.error("Error hiding announcement bar", error);
              }
            }
          }}
        >
          <svg
            width="12"
            height="12"
            fill="none"
            className="ia-announcement-close-icon"
          >
            <path
              d="m7.414 6 4.293-4.293A.999.999 0 1 0 10.293.293L6 4.586 1.707.293A.999.999 0 1 0 .293 1.707L4.586 6 .293 10.293a.999.999 0 1 0 1.414 1.414L6 7.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L7.414 6Z"
              fill={`#${announcementModule?.styles?.closeIconColor}`}
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AnnouncementBar;
