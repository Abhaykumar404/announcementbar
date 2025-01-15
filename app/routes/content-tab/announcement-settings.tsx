import {
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  InlineStack,
  RangeSlider,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import TranslationTextField from "app/common-components/translation-text-field";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import {
  setAnnouncementSettings,
  setMultipleAnnouncementTexts,
  setSingleAnnouncementButtonTextTranslations,
  setSingleAnnouncementSubheadingTranslations,
  setSingleAnnouncementText,
  setSingleAnnouncementTitleTranslations,
} from "app/store/slices/announcement-slice";
import { AnnouncementType } from "app/utils/enums/announcement-type-enum";
import cloneDeep from "lodash/cloneDeep";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  PlusIcon,
} from "@shopify/polaris-icons";
import { CTAType } from "app/utils/enums/cta-type-enum";

const AnnouncementSettingsComponent = () => {
  const announcement = useSelector((state: any) => state.announcement);
  const dispatch = useDispatch();

  const handleTitleChange = (value: string) => {
    dispatch(setSingleAnnouncementText({ announcementTitle: value }));
  };

  const handleSubheadingChange = (value: string) => {
    dispatch(setSingleAnnouncementText({ announcementSubheading: value }));
  };

  const handleButtonTextChange = (value: string) => {
    dispatch(setSingleAnnouncementText({ buttonText: value }));
  };

  const handleTitleTranslationsSave = (translations: any) => {
    dispatch(setSingleAnnouncementTitleTranslations(translations));
  };

  const handleSubheadingTranslationsSave = (translations: any) => {
    dispatch(setSingleAnnouncementSubheadingTranslations(translations));
  };

  const handleButtonTextTranslationsSave = (translations: any) => {
    dispatch(setSingleAnnouncementButtonTextTranslations(translations));
  };

  const renderRotatingAnnouncement = (announcementData: any, index: number) => (
    <Box
      key={index}
      background="bg-fill-disabled"
      padding={"300"}
      borderRadius="200"
    >
      <BlockStack gap="300">
        <Text as="h2" variant="headingMd">
          Announcement #{index + 1}
        </Text>
        <BlockStack gap="400">
          <TranslationTextField
            id="announcement-title"
            label="Title"
            value={announcementData?.announcementTitle}
            multiline={3}
            onChange={(value: string) => {
              const multipleAnnouncementTextsClone = cloneDeep(
                announcement?.multipleAnnouncementTexts
              );
              multipleAnnouncementTextsClone[index].announcementTitle = value;
              dispatch(
                setMultipleAnnouncementTexts(multipleAnnouncementTextsClone)
              );
            }}
            initialTranslations={
              announcementData?.announcementTitleTranslations
            }
            onModalSave={(translations: any) => {
              const multipleAnnouncementTextsClone = cloneDeep(
                announcement?.multipleAnnouncementTexts
              );

              multipleAnnouncementTextsClone[
                index
              ].announcementTitleTranslations = translations;

              dispatch(
                setMultipleAnnouncementTexts(multipleAnnouncementTextsClone)
              );
            }}
          />

          <TranslationTextField
            id="announcement-subheading"
            label="Subheading"
            value={announcementData?.announcementSubheading}
            multiline={2}
            onChange={(value: string) => {
              const multipleAnnouncementTextsClone = cloneDeep(
                announcement?.multipleAnnouncementTexts
              );
              multipleAnnouncementTextsClone[index].announcementSubheading =
                value;
              dispatch(
                setMultipleAnnouncementTexts(multipleAnnouncementTextsClone)
              );
            }}
            initialTranslations={
              announcementData?.announcementSubheadingTranslations
            }
            onModalSave={(translations: any) => {
              const multipleAnnouncementTextsClone = cloneDeep(
                announcement?.multipleAnnouncementTexts
              );

              multipleAnnouncementTextsClone[
                index
              ].announcementSubheadingTranslations = translations;

              dispatch(
                setMultipleAnnouncementTexts(multipleAnnouncementTextsClone)
              );
            }}
          />

          <Select
            label="Call to action"
            options={[
              { label: "No Call to action", value: CTAType.NONE },
              { label: "Button", value: CTAType.BUTTON },
              {
                label: "Make entire bar clickable",
                value: CTAType.BAR_CLICKABLE,
              },
            ]}
            onChange={(value: string) => {
              const multipleAnnouncementTextsClone = cloneDeep(
                announcement?.multipleAnnouncementTexts
              );
              multipleAnnouncementTextsClone[index].CTAType = value;
              dispatch(
                setMultipleAnnouncementTexts(multipleAnnouncementTextsClone)
              );
            }}
            value={announcementData?.CTAType}
          />
          {announcementData?.CTAType === CTAType.BUTTON && (
            <TranslationTextField
              id="announcement-cta-button-text"
              label="Button text"
              value={announcementData?.buttonText}
              onChange={(value: string) => {
                const multipleAnnouncementTextsClone = cloneDeep(
                  announcement?.multipleAnnouncementTexts
                );
                multipleAnnouncementTextsClone[index].buttonText = value;
                dispatch(
                  setMultipleAnnouncementTexts(multipleAnnouncementTextsClone)
                );
              }}
              initialTranslations={announcementData?.buttonTextTranslations}
              onModalSave={(translations: any) => {
                const multipleAnnouncementTextsClone = cloneDeep(
                  announcement?.multipleAnnouncementTexts
                );

                multipleAnnouncementTextsClone[index].buttonTextTranslations =
                  translations;

                dispatch(
                  setMultipleAnnouncementTexts(multipleAnnouncementTextsClone)
                );
              }}
            />
          )}

          {(announcementData?.CTAType === CTAType.BAR_CLICKABLE ||
            announcementData?.CTAType === CTAType.BUTTON) && (
            <TextField
              id="announcement-cta-url"
              autoComplete="off"
              label="Call to action URL"
              value={announcementData?.CTAUrl}
              onChange={(value: string) => {
                const multipleAnnouncementTextsClone = cloneDeep(
                  announcement?.multipleAnnouncementTexts
                );
                multipleAnnouncementTextsClone[index].CTAUrl = value;
                dispatch(
                  setMultipleAnnouncementTexts(multipleAnnouncementTextsClone)
                );
              }}
            />
          )}
          <InlineStack align="space-between">
            <ButtonGroup variant="segmented">
              <Button
                icon={ChevronUpIcon}
                disabled={index === 0}
                onClick={() => {
                  const multipleAnnouncementTextsClone = cloneDeep(
                    announcement?.multipleAnnouncementTexts
                  );
                  if (index > 0) {
                    const temp = multipleAnnouncementTextsClone[index - 1];
                    multipleAnnouncementTextsClone[index - 1] =
                      multipleAnnouncementTextsClone[index];
                    multipleAnnouncementTextsClone[index] = temp;
                    dispatch(
                      setMultipleAnnouncementTexts(
                        multipleAnnouncementTextsClone
                      )
                    );
                  }
                }}
              />
              <Button
                icon={ChevronDownIcon}
                disabled={
                  index === announcement?.multipleAnnouncementTexts.length - 1
                }
                onClick={() => {
                  const multipleAnnouncementTextsClone = cloneDeep(
                    announcement?.multipleAnnouncementTexts
                  );
                  if (index < multipleAnnouncementTextsClone.length - 1) {
                    const temp = multipleAnnouncementTextsClone[index + 1];
                    multipleAnnouncementTextsClone[index + 1] =
                      multipleAnnouncementTextsClone[index];
                    multipleAnnouncementTextsClone[index] = temp;
                    dispatch(
                      setMultipleAnnouncementTexts(
                        multipleAnnouncementTextsClone
                      )
                    );
                  }
                }}
              />
            </ButtonGroup>
            <Button
              icon={DeleteIcon}
              tone="critical"
              onClick={() => {
                const multipleAnnouncementTextsClone = cloneDeep(
                  announcement?.multipleAnnouncementTexts
                );
                multipleAnnouncementTextsClone.splice(index, 1);
                dispatch(
                  setMultipleAnnouncementTexts(multipleAnnouncementTextsClone)
                );
              }}
            />
          </InlineStack>
        </BlockStack>
      </BlockStack>
    </Box>
  );

  return (
    <Box padding="400">
      <BlockStack gap="300">
        <Text as="h2" variant="headingMd">
          Announcement Settings
        </Text>
        <BlockStack gap="400">
          {announcement?.type !== AnnouncementType.ROTATING && (
            <TranslationTextField
              id="announcement-title"
              label="Title"
              value={announcement?.singleAnnouncementText?.announcementTitle}
              multiline={3}
              onChange={handleTitleChange}
              initialTranslations={
                announcement?.singleAnnouncementText
                  ?.announcementTitleTranslations ?? []
              }
              onModalSave={handleTitleTranslationsSave}
            />
          )}

          {announcement?.type === AnnouncementType.SIMPLE && (
            <TranslationTextField
              id="announcement-subheading"
              label="Subheading"
              value={
                announcement?.singleAnnouncementText?.announcementSubheading
              }
              multiline={2}
              onChange={handleSubheadingChange}
              initialTranslations={
                announcement?.singleAnnouncementText
                  ?.announcementSubheadingTranslations ?? []
              }
              onModalSave={handleSubheadingTranslationsSave}
            />
          )}

          {announcement?.type === AnnouncementType.RUNNING_LINE && (
            <>
              <RangeSlider
                label="Moving line speed (seconds)"
                helpText="The time required for sentence to move from one end to another"
                output
                min={1}
                max={50}
                onChange={(value: number) => {
                  dispatch(
                    setAnnouncementSettings({
                      runningLineAnnouncementSpeed: `${value}`,
                    })
                  );
                }}
                value={announcement?.settings?.runningLineAnnouncementSpeed}
              />
              <TextField
                autoComplete="off"
                label="Gap between two text"
                onChange={(value: string) => {
                  dispatch(
                    setAnnouncementSettings({
                      runningLineAnnouncementTextGap: value,
                    })
                  );
                }}
                value={announcement?.settings?.runningLineAnnouncementTextGap}
              />
            </>
          )}

          {announcement?.type === AnnouncementType.ROTATING && (
            <RangeSlider
              label="Announcement display duration"
              output
              min={2}
              max={20}
              onChange={(value: number) => {
                dispatch(
                  setAnnouncementSettings({
                    rotatingAnimationDuration: `${value}`,
                  })
                );
              }}
              value={announcement?.settings?.rotatingAnimationDuration}
            />
          )}

          {announcement?.type === AnnouncementType.ROTATING && (
            <Checkbox
              label="Auto rotate multiple announcement text"
              checked={
                announcement?.settings?.autoRotateMultipleAnnouncementText
              }
              onChange={(value: boolean) => {
                dispatch(
                  setAnnouncementSettings({
                    autoRotateMultipleAnnouncementText: value,
                  })
                );
              }}
            />
          )}

          {announcement?.type !== AnnouncementType.ROTATING && (
            <>
              <Select
                label="Call to action"
                options={[
                  { label: "No Call to action", value: CTAType.NONE },
                  { label: "Button", value: CTAType.BUTTON },
                  {
                    label: "Make entire bar clickable",
                    value: CTAType.BAR_CLICKABLE,
                  },
                ]}
                onChange={(value: string) => {
                  dispatch(setSingleAnnouncementText({ CTAType: value }));
                }}
                value={announcement?.singleAnnouncementText?.CTAType}
              />
              {announcement?.singleAnnouncementText?.CTAType ===
                CTAType.BUTTON && (
                <TranslationTextField
                  id="announcement-button-text"
                  label="Button text"
                  value={announcement?.singleAnnouncementText?.buttonText}
                  onChange={handleButtonTextChange}
                  initialTranslations={
                    announcement?.singleAnnouncementText
                      ?.buttonTextTranslations ?? []
                  }
                  onModalSave={handleButtonTextTranslationsSave}
                />
              )}
              {(announcement?.singleAnnouncementText?.CTAType ===
                CTAType.BAR_CLICKABLE ||
                announcement?.singleAnnouncementText?.CTAType ===
                  CTAType.BUTTON) && (
                <TextField
                  id="announcement-cta-url"
                  autoComplete="off"
                  label="Call to action URL"
                  value={announcement?.singleAnnouncementText?.CTAUrl}
                  onChange={(value: string) => {
                    dispatch(setSingleAnnouncementText({ CTAUrl: value }));
                  }}
                />
              )}
            </>
          )}

          {announcement?.type === AnnouncementType.ROTATING && <Divider />}

          {announcement?.type === AnnouncementType.ROTATING &&
            announcement?.multipleAnnouncementTexts.map(
              renderRotatingAnnouncement
            )}

          {announcement?.type === AnnouncementType.ROTATING && (
            <>
              <Button
                icon={PlusIcon}
                onClick={() => {
                  const multipleAnnouncementTextsClone = cloneDeep(
                    announcement?.multipleAnnouncementTexts
                  );
                  multipleAnnouncementTextsClone.push({
                    id: uuidv4(),
                    iconUrl: "",
                    announcementTitle:
                      "Enjoy a 20% discount on all our products!",
                    announcementTitleTranslations: [],
                    announcementSubheading: "",
                    announcementSubheadingTranslations: [],
                    CTAType: CTAType.BUTTON,
                    CTAUrl: "",
                    buttonText: "Shop now!",
                    buttonTextTranslations: [],
                  });
                  dispatch(
                    setMultipleAnnouncementTexts(multipleAnnouncementTextsClone)
                  );
                }}
              >
                Add Announcement
              </Button>
              <Divider />
            </>
          )}

          <Checkbox
            label="Show Close Icon"
            checked={announcement?.settings?.showCloseButton}
            onChange={() => {
              dispatch(
                setAnnouncementSettings({
                  showCloseButton: !announcement?.settings?.showCloseButton,
                })
              );
            }}
          />
        </BlockStack>
      </BlockStack>
    </Box>
  );
};

export default AnnouncementSettingsComponent;
