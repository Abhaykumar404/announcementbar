// import { type Translations } from "@prisma/client";

interface Translation {
  language: string | null;
  translation: string | null;
}

interface LocalizedTextProps {
  translations: Translation[] | null | any;
  shopLocale: string | null;
  fallbackText: string | null | undefined;
}

export const getLocalizedText = ({
  translations,
  shopLocale,
  fallbackText,
}: LocalizedTextProps) => {
  // Find the translation for the shop's locale
  const shopTranslation = translations?.find(
    (translation: any) => translation.language === shopLocale
  );

  // Render the shop translation if available, otherwise render fallback text
  const textToDisplay = shopTranslation
    ? shopTranslation.translation
    : fallbackText;

  return textToDisplay;
};
