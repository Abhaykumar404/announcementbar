import { FormLayout } from "@shopify/polaris";
import PlacementSelectionComponent from "./placement-selection-card";
import GeolocationTargetingComponent from "./geolocation-targeting-card";
const PlacementTabIndex = () => {
  return (
    <FormLayout>
      <PlacementSelectionComponent />
      <GeolocationTargetingComponent />
    </FormLayout>
  );
};

export default PlacementTabIndex;
