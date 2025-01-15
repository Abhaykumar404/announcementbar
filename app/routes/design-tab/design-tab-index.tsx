import { Card, Divider } from "@shopify/polaris";
import AnnouncementPositioningComponent from "./announcement-positioning";
import AnnouncementTemplateComponent from "./announcement-template";
import AnnouncementTypography from "./annuncement-typography";
import AnnouncementCardDesign from "./annuncement-card-design";
import AnnouncementButtonDesign from "./announcement-button-design";
import AnnouncementNavigationIcons from "./announcement-navigation-icons";

const DesignTabIndex = () => {
  return (
    <Card padding={"0"}>
      <AnnouncementPositioningComponent />
      <Divider />
      {/* <AnnouncementTemplateComponent />
      <Divider /> */}
      <AnnouncementCardDesign />
      <Divider />
      <AnnouncementTypography />
      <Divider />
      <AnnouncementButtonDesign />
      <Divider />
      <AnnouncementNavigationIcons />

      {/* <Box padding="400">
        <Button fullWidth>Continue to Placement</Button>
      </Box> */}
    </Card>
  );
};

export default DesignTabIndex;
