import { Box, Button, Card, Divider, TextField } from "@shopify/polaris";
import AnnouncementTypeComponent from "./announcement-type";
import AnnouncementSchedulingComponent from "./announcement-scheduling";
import { useDispatch, useSelector } from "react-redux";
import { setAnnouncementName } from "app/store/slices/announcement-slice";
import AnnouncementSettingsComponent from "./announcement-settings";

const ContentTabIndex = () => {
  const announcement = useSelector((state: any) => state.announcement);
  const dispatch = useDispatch();
  return (
    <Card padding={"0"}>
      <Box padding="400">
        <TextField
          id="announcement-content"
          autoComplete="off"
          label="Announcement name"
          helpText="Only visible to you. For your own internal reference."
          value={announcement?.name}
          onChange={(value: string) => {
            dispatch(setAnnouncementName(value));
          }}
        />
      </Box>
      <Divider />
      <AnnouncementTypeComponent />
      <Divider />
      <AnnouncementSettingsComponent />
      <Divider />
      <AnnouncementSchedulingComponent />
      <Divider />
      <Box padding="400">
        <Button fullWidth>Continue to Design</Button>
      </Box>
    </Card>
  );
};

export default ContentTabIndex;
