import {
  Badge,
  BlockStack,
  Box,
  Card,
  InlineStack,
  List,
  RadioButton,
  Text,
} from "@shopify/polaris";
import SelectCountriesModal from "./select-countries-modal";
import { AnnouncementGeoTargetingLocation } from "app/utils/enums/announcement-geo-targeting-location-enum";
import { useDispatch, useSelector } from "react-redux";
import { setAnnouncementPlacement } from "app/store/slices/announcement-slice";

const PlacementSelectionComponent = () => {
  const announcement = useSelector((state: any) => state.announcement);
  const dispatch = useDispatch();

  return (
    <Card padding={"0"}>
      <Box padding="400">
        <BlockStack gap="300">
          <Text as="h2" variant="headingMd">
            Geolocation targeting
          </Text>
          <BlockStack gap="400">
            <RadioButton
              label="Whole World"
              checked={
                announcement?.placement?.geolocationTargetingLocationType ===
                AnnouncementGeoTargetingLocation.WHOLE_WORLD
              }
              name="geolocation-targeting"
              onChange={() => {
                dispatch(
                  setAnnouncementPlacement({
                    geolocationTargetingLocationType:
                      AnnouncementGeoTargetingLocation.WHOLE_WORLD,
                  })
                );
              }}
            />
            <RadioButton
              label="Specific countries"
              name="geolocation-targeting"
              checked={
                announcement?.placement?.geolocationTargetingLocationType ===
                AnnouncementGeoTargetingLocation.SPECIFIC_COUNTRIES
              }
              onChange={() => {
                dispatch(
                  setAnnouncementPlacement({
                    geolocationTargetingLocationType:
                      AnnouncementGeoTargetingLocation.SPECIFIC_COUNTRIES,
                  })
                );
              }}
            />

            {announcement?.placement?.geolocationTargetingLocationType ===
              AnnouncementGeoTargetingLocation.SPECIFIC_COUNTRIES &&
              announcement?.placement?.specificCountries.length > 0 && (
                <InlineStack gap="200">
                  {announcement?.placement?.specificCountries.map(
                    (country: string) => (
                      <Badge tone="info" key={country}>
                        {country}
                      </Badge>
                    )
                  )}
                </InlineStack>
              )}

            <SelectCountriesModal
              onSelect={(countries) => {
                dispatch(
                  setAnnouncementPlacement({
                    specificCountries: countries,
                  })
                );
              }}
              selectedCountries={
                announcement?.placement?.specificCountries || []
              }
              disabled={
                announcement?.placement?.geolocationTargetingLocationType !==
                AnnouncementGeoTargetingLocation.SPECIFIC_COUNTRIES
              }
            />
          </BlockStack>
        </BlockStack>
      </Box>
    </Card>
  );
};

export default PlacementSelectionComponent;
