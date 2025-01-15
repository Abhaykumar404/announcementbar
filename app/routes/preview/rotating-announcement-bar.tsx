import React, { useCallback, useEffect, useState } from "react";
import SimpleAnnouncementComponent from "./simple-component";
import { type Announcement } from "@prisma/client";
import { getLocalizedText } from "../../utils/localized-text";
import { CTAType } from "../../utils/enums/cta-type-enum";

const RotatingAnnouncementBar = ({
  isPreview,
  shopLocale,
  announcementModule,
}: {
  isPreview: boolean;
  shopLocale: string;
  announcementModule: Announcement;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHoveringOnNavigationArrow, setIsHoveringOnNavigationArrow] =
    useState(false);

  const nextSlide = useCallback(() => {
    if (!announcementModule?.multipleAnnouncementTexts?.length) return;
    if (announcementModule?.multipleAnnouncementTexts?.length < 2) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, [announcementModule?.multipleAnnouncementTexts?.length, setCurrentIndex]);

  const prevSlide = useCallback(() => {
    if (!announcementModule?.multipleAnnouncementTexts?.length) return;
    if (announcementModule?.multipleAnnouncementTexts?.length < 2) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  }, [announcementModule?.multipleAnnouncementTexts?.length, setCurrentIndex]);

  useEffect(() => {
    if (isTransitioning) {
      setTimeout(() => {
        if (
          currentIndex === announcementModule?.multipleAnnouncementTexts.length
        ) {
          setCurrentIndex(0);
        } else if (currentIndex === -1) {
          setCurrentIndex(
            announcementModule?.multipleAnnouncementTexts.length - 1
          );
        }
        setIsTransitioning(false);
      }, 500); // duration of the transition
    }
  }, [
    isTransitioning,
    announcementModule?.multipleAnnouncementTexts.length,
    currentIndex,
  ]);

  // USED for auto rotating the slides
  useEffect(() => {
    if (!announcementModule?.multipleAnnouncementTexts?.length) return;

    if (!announcementModule?.settings?.autoRotateMultipleAnnouncementText)
      return;

    const rotatingAnimationDuration =
      (parseFloat(
        announcementModule?.settings?.rotatingAnimationDuration ?? "4"
      ) *
        1000) /
      announcementModule?.multipleAnnouncementTexts?.length;

    const interval = setInterval(() => {
      if (!isHoveringOnNavigationArrow) {
        nextSlide();
      }
    }, rotatingAnimationDuration);

    return () => {
      clearInterval(interval);
    };
  }, [
    nextSlide,
    announcementModule?.multipleAnnouncementTexts?.length,
    isHoveringOnNavigationArrow,
    announcementModule?.settings?.autoRotateMultipleAnnouncementText,
    announcementModule?.settings?.rotatingAnimationDuration,
  ]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [announcementModule.multipleAnnouncementTexts.length]);

  return (
    <div className="ia-announcement-carousel">
      {announcementModule?.settings?.showNavigationArrows && (
        <div
          className="ia-announcement-carousel-control-prev"
          style={{
            // @ts-ignore
            "--color": `#${announcementModule?.styles?.arrowIconColor}`,
            // "--background-color": `#${announcementModule?.styles?.arrowIconColor}`,
          }}
          onMouseEnter={() => setIsHoveringOnNavigationArrow(true)}
          onMouseLeave={() => setIsHoveringOnNavigationArrow(false)}
          onClick={prevSlide}
        >
          &#10094;
        </div>
      )}
      <div
        className="ia-announcement-carousel-inner"
        onClick={() => {
          if (
            !isPreview &&
            announcementModule?.multipleAnnouncementTexts[currentIndex]
              ?.CTAType === CTAType.BAR_CLICKABLE
          ) {
            window.open(
              announcementModule?.multipleAnnouncementTexts[currentIndex]
                ?.CTAUrl ?? "#"
            );
          }
        }}
        style={{
          transform: `translateX(-${(currentIndex + 1) * 100}%)`,
          transition: isTransitioning ? "transform 0.5s ease" : "none",
          cursor:
            announcementModule?.multipleAnnouncementTexts[currentIndex]
              ?.CTAType === CTAType.BAR_CLICKABLE
              ? "pointer"
              : "default",
        }}
      >
        {/* Clone the last slide and place it at the beginning */}
        <div className="ia-annoucement-carousel-item">
          <div className="ia-announcement-content">
            <SimpleAnnouncementComponent
              isPreview={isPreview}
              shopLocale={shopLocale}
              announcementModule={announcementModule}
              title={
                announcementModule?.multipleAnnouncementTexts[
                  announcementModule?.multipleAnnouncementTexts.length - 1
                ]?.announcementTitle
              }
              titleTranslations={
                announcementModule?.multipleAnnouncementTexts[
                  announcementModule?.multipleAnnouncementTexts.length - 1
                ]?.announcementTitleTranslations
              }
              subtitle={
                announcementModule?.multipleAnnouncementTexts[
                  announcementModule?.multipleAnnouncementTexts.length - 1
                ]?.announcementSubheading
              }
              subtitleTranslations={
                announcementModule?.multipleAnnouncementTexts[
                  announcementModule?.multipleAnnouncementTexts.length - 1
                ]?.announcementSubheadingTranslations
              }
            />

            {announcementModule?.multipleAnnouncementTexts[
              announcementModule?.multipleAnnouncementTexts.length - 1
            ]?.CTAType === CTAType.BUTTON && (
              <a
                className="ia-announcement-cta"
                href={
                  isPreview
                    ? "#"
                    : announcementModule?.multipleAnnouncementTexts[
                        announcementModule?.multipleAnnouncementTexts.length - 1
                      ]?.CTAUrl ?? "#"
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
                    announcementModule?.multipleAnnouncementTexts[
                      announcementModule?.multipleAnnouncementTexts.length - 1
                    ]?.buttonTextTranslations,
                  fallbackText:
                    announcementModule?.multipleAnnouncementTexts[
                      announcementModule?.multipleAnnouncementTexts.length - 1
                    ]?.buttonText,
                })}
              </a>
            )}
          </div>
        </div>

        {announcementModule?.multipleAnnouncementTexts.map(
          (slide: any, index: number) => (
            <div className="ia-annoucement-carousel-item" key={index}>
              <div className="ia-announcement-content">
                <SimpleAnnouncementComponent
                  isPreview={isPreview}
                  shopLocale={shopLocale}
                  announcementModule={announcementModule}
                  title={slide?.announcementTitle}
                  titleTranslations={slide?.announcementTitleTranslations}
                  subtitle={slide?.announcementSubheading}
                  subtitleTranslations={
                    slide?.announcementSubheadingTranslations
                  }
                />

                {slide?.CTAType === CTAType.BUTTON && (
                  <a
                    className="ia-announcement-cta"
                    href={isPreview ? "#" : slide?.CTAUrl ?? "#"}
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
                      translations: slide?.buttonTextTranslations,
                      fallbackText: slide?.buttonText,
                    })}
                  </a>
                )}
              </div>
            </div>
          )
        )}

        {/* Clone the first slide and place it at the end */}
        <div className="ia-annoucement-carousel-item">
          <div className="ia-announcement-content">
            <SimpleAnnouncementComponent
              isPreview={isPreview}
              shopLocale={shopLocale}
              announcementModule={announcementModule}
              title={
                announcementModule?.multipleAnnouncementTexts[0]
                  ?.announcementTitle
              }
              titleTranslations={
                announcementModule?.multipleAnnouncementTexts[0]
                  ?.announcementTitleTranslations
              }
              subtitle={
                announcementModule?.multipleAnnouncementTexts[0]
                  ?.announcementSubheading
              }
              subtitleTranslations={
                announcementModule?.multipleAnnouncementTexts[0]
                  ?.announcementSubheadingTranslations
              }
            />

            {announcementModule?.multipleAnnouncementTexts[0]?.CTAType ===
              CTAType.BUTTON && (
              <a
                className="ia-announcement-cta"
                href={
                  isPreview
                    ? "#"
                    : announcementModule?.multipleAnnouncementTexts[0]
                        ?.CTAUrl ?? "#"
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
                    announcementModule?.multipleAnnouncementTexts[0]
                      ?.buttonTextTranslations,
                  fallbackText:
                    announcementModule?.multipleAnnouncementTexts[0]
                      ?.buttonText,
                })}
              </a>
            )}
          </div>
        </div>
      </div>
      {announcementModule?.settings?.showNavigationArrows && (
        <div
          className="ia-announcement-carousel-control-next"
          style={{
            // @ts-ignore
            "--color": `#${announcementModule?.styles?.arrowIconColor}`,
            // "--background-color": `#${announcementModule?.styles?.arrowIconColor}`,
          }}
          onMouseEnter={() => setIsHoveringOnNavigationArrow(true)}
          onMouseLeave={() => setIsHoveringOnNavigationArrow(false)}
          onClick={nextSlide}
        >
          &#10095;
        </div>
      )}
    </div>
  );
};

export default RotatingAnnouncementBar;
