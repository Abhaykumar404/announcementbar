import { BlockStack, Box, Select, Text } from "@shopify/polaris";
import { useDispatch, useSelector } from "react-redux";
import { setAnnouncementStyles } from "app/store/slices/announcement-slice";
import announcementThemeOptions from "../../utils/enums/announcement-themes";

const AnnouncementTemplateComponent = () => {
  const announcement = useSelector((state: any) => state.announcement);
  const dispatch = useDispatch();

  return (
    <Box padding="400">
      <BlockStack gap="300">
        <Text as="h2" variant="headingMd">
          Template
        </Text>
        <BlockStack gap="400">
          <Select
            label="Call to action"
            labelHidden={true}
            options={announcementThemeOptions}
            onChange={(val: string) => {
              dispatch(setAnnouncementStyles({ theme: val }));
            }}
            value={announcement.styles.theme}
          />
        </BlockStack>
      </BlockStack>
    </Box>
  );
};

export default AnnouncementTemplateComponent;
