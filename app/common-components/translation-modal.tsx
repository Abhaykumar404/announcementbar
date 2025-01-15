import {
  BlockStack,
  Box,
  Button,
  Icon,
  InlineStack,
  Modal,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { DeleteIcon, PlusCircleIcon } from "@shopify/polaris-icons";

const TranslationModal = ({
  active,
  setActive,
  modalTitle = "Add translations",
  initialTranslations,
  onModalSave,
}: {
  active: boolean;
  setActive: (value: boolean) => void;
  modalTitle?: string;
  initialTranslations: any;
  onModalSave: (value: any) => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [listOfTranslations, setListOfTranslations] =
    useState<any>(initialTranslations);
  const [listOfShopLocalesOptions, setListOfShopLocalesOptions] = useState<any>(
    [],
  );

  // Fetch list of all shop locales
  const fetchListOfAllShopLocales = async () => {
    const response = await fetch(`/api/translation-text-field`);
    const data = await response.json();

    const options = data.listOfShopLocales.map((locale: any) => {
      return {
        label: `${locale.locale} - ${locale.name}`,
        value: locale.locale,
      };
    });

    setListOfShopLocalesOptions(options);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchListOfAllShopLocales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteTranslation = (index: number) => {
    const updatedTranslations = [...listOfTranslations];
    updatedTranslations.splice(index, 1);
    setListOfTranslations(updatedTranslations);
  };

  const handleTextFieldChange = (newValue: string, index: number) => {
    // const updatedTranslations = [...listOfTranslations];

    const updatedTranslations = listOfTranslations.map(
      (translation: any, i: number) => {
        if (i === index) {
          return { ...translation, translation: newValue };
        }
        return translation;
      },
    );

    updatedTranslations[index].translation = newValue;
    setListOfTranslations(updatedTranslations);
  };

  const handleSelectChange = (value: string, index: number) => {
    // const updatedTranslations = [...listOfTranslations];

    const updatedTranslations = listOfTranslations.map(
      (translation: any, i: number) => {
        if (i === index) {
          return { ...translation, language: value };
        }
        return translation;
      },
    );

    updatedTranslations[index].language = value;
    setListOfTranslations(updatedTranslations);
  };

  // const handleTextFieldChange = (newValue: string, index: number) => {
  //   // Create a copy of the translation object at the specified index
  //   const updatedTranslation = { ...listOfTranslations[index] };

  //   // Update the translation property of the copied translation object
  //   updatedTranslation.translation = newValue;

  //   // Create a new array with the updated translation object at the specified index
  //   const updatedTranslations = [
  //     ...listOfTranslations.slice(0, index),
  //     updatedTranslation,
  //     ...listOfTranslations.slice(index + 1),
  //   ];

  //   // Update the state with the new array of translations
  //   setListOfTranslations(updatedTranslations);
  // };

  // const handleSelectChange = (value: string, index: number) => {
  //   // Create a copy of the translation object at the specified index
  //   const updatedTranslation = { ...listOfTranslations[index] };

  //   // Update the language property of the copied translation object
  //   updatedTranslation.language = value;

  //   // Create a new array with the updated translation object at the specified index
  //   const updatedTranslations = [
  //     ...listOfTranslations.slice(0, index),
  //     updatedTranslation,
  //     ...listOfTranslations.slice(index + 1),
  //   ];

  //   // Update the state with the new array of translations
  //   setListOfTranslations(updatedTranslations);
  // };

  const handleDone = () => {
    const formattedData = listOfTranslations.map(
      ({
        language,
        translation,
      }: {
        language: string;
        translation: string;
      }) => ({
        language,
        translation,
      }),
    );
    onModalSave(formattedData);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setActive(false);
  };

  return (
    <Modal
      open={active}
      onClose={handleCloseModal}
      title={modalTitle}
      primaryAction={{
        content: "Done",
        onAction: handleDone,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleCloseModal,
        },
      ]}
    >
      {isLoading ? (
        <Modal.Section>
          <BlockStack align="center" inlineAlign="center">
            <span className="loader" />
          </BlockStack>
        </Modal.Section>
      ) : (
        <Modal.Section>
          <BlockStack gap={"400"}>
            {listOfTranslations.map((translation: any, index: number) => {
              return (
                <InlineStack key={index} gap={"200"}>
                  <Select
                    label=""
                    options={listOfShopLocalesOptions}
                    onChange={(value) => handleSelectChange(value, index)}
                    value={translation.language}
                  />
                  <div style={{ flex: "1 1 0%" }}>
                    <TextField
                      label=""
                      value={translation.translation}
                      onChange={(newValue) => {
                        handleTextFieldChange(newValue, index);
                      }}
                      autoComplete="off"
                    />
                  </div>
                  <Button onClick={() => handleDeleteTranslation(index)}>
                    <Icon source={DeleteIcon} tone="base" />
                  </Button>
                </InlineStack>
              );
            })}

            <Box>
              <Button
                variant="plain"
                onClick={() => {
                  setListOfTranslations([
                    ...listOfTranslations,
                    {
                      language: listOfShopLocalesOptions[0].value,
                      translation: "",
                    },
                  ]);
                }}
              >
                <InlineStack blockAlign="center">
                  <Icon source={PlusCircleIcon} tone="interactive" />
                  <Text variant="headingXs" as="h6">
                    Add Translation
                  </Text>
                </InlineStack>
              </Button>
            </Box>
          </BlockStack>
        </Modal.Section>
      )}
    </Modal>
  );
};

export default TranslationModal;
