import { BlockStack, Box, RadioButton, Text } from "@shopify/polaris";
import { useSelector, useDispatch } from "react-redux";
import { setAnnouncementType } from "app/store/slices/announcement-slice";
import { AnnouncementType } from "app/utils/enums/announcement-type-enum";

const AnnouncementTypeComponent = () => {
  const announcement = useSelector((state: any) => state.announcement);
  const dispatch = useDispatch();

  return (
    <Box padding="400">
      <BlockStack gap="300">
        <Text as="h2" variant="headingMd">
          Announcement Type
        </Text>
        <BlockStack gap="300">
          <RadioButton
            name="announcement-type"
            label="Simple announcement"
            checked={announcement?.type === AnnouncementType.SIMPLE}
            onChange={(val: boolean) => {
              dispatch(setAnnouncementType(AnnouncementType.SIMPLE));
            }}
          />
          <RadioButton
            name="announcement-type"
            label="Running line announcement"
            checked={announcement?.type === AnnouncementType.RUNNING_LINE}
            onChange={(val: boolean) => {
              dispatch(setAnnouncementType(AnnouncementType.RUNNING_LINE));
            }}
          />
          <RadioButton
            name="announcement-type"
            label="Multiple rotating announcements"
            checked={announcement?.type === AnnouncementType.ROTATING}
            onChange={(val: boolean) => {
              dispatch(setAnnouncementType(AnnouncementType.ROTATING));
            }}
          />
        </BlockStack>
      </BlockStack>
    </Box>
  );
};

export default AnnouncementTypeComponent;
