import { BlockStack, Box, Checkbox, Select, Text } from "@shopify/polaris";
import { AnnouncementPosition } from "app/utils/enums/announcement-position-enum";
import { useDispatch, useSelector } from "react-redux";
import { setAnnouncementSettings } from "app/store/slices/announcement-slice";

const AnnouncementPositioningComponent = () => {
  const announcement = useSelector((state: any) => state.announcement);
  const dispatch = useDispatch();

  return (
    <Box padding="400">
      <BlockStack gap="300">
        <Text as="h2" variant="headingMd">
          Positioning
        </Text>
        <BlockStack gap="400">
          <Select
            label="Position"
            labelHidden={true}
            options={[
              { label: "Top Page", value: AnnouncementPosition.TOP },
              { label: "Bottom Page", value: AnnouncementPosition.BOTTOM },
            ]}
            onChange={(val: string) => {
              dispatch(
                setAnnouncementSettings({
                  position: val,
                })
              );
            }}
            value={announcement.settings.position}
          />
          <Checkbox
            label="Sticky bar"
            helpText="Always visible while scrolling"
            checked={announcement.settings.positionSticky}
            onChange={(val: boolean) => {
              dispatch(setAnnouncementSettings({ positionSticky: val }));
            }}
          />
        </BlockStack>
      </BlockStack>
    </Box>
  );
};

export default AnnouncementPositioningComponent;
