import { BlockStack, Box, Text } from "@shopify/polaris";
import { useDispatch, useSelector } from "react-redux";
import ColorPickerComponent from "app/common-components/color-picker-component";
import { setAnnouncementStyles } from "app/store/slices/announcement-slice";

const AnnouncementNavigationIcons = () => {
  const announcement = useSelector((state: any) => state.announcement);
  const dispatch = useDispatch();

  return (
    <Box padding="400">
      <BlockStack gap="300">
        <Text as="h2" variant="headingMd">
          Icons
        </Text>
        <BlockStack gap="400">
          <ColorPickerComponent
            label="Close icon color"
            currentHexColor={announcement.styles.closeIconColor}
            onChange={(val: string) => {
              dispatch(setAnnouncementStyles({ closeIconColor: val }));
            }}
          />
          <ColorPickerComponent
            label="Navigation icon color"
            currentHexColor={announcement.styles.arrowIconColor}
            onChange={(val: string) => {
              dispatch(setAnnouncementStyles({ arrowIconColor: val }));
            }}
          />
        </BlockStack>
      </BlockStack>
    </Box>
  );
};

export default AnnouncementNavigationIcons;
