import { BlockStack, Box, InlineGrid, Text, TextField } from "@shopify/polaris";
import { useDispatch, useSelector } from "react-redux";
import ColorPickerComponent from "app/common-components/color-picker-component";
import TextWithColorPickerComponent from "app/common-components/text-with-color-picker-component";
import { setAnnouncementStyles } from "app/store/slices/announcement-slice";

const AnnouncementButtonDesign = () => {
  const announcement = useSelector((state: any) => state.announcement);
  const dispatch = useDispatch();

  return (
    <Box padding="400">
      <BlockStack gap="300">
        <Text as="h2" variant="headingMd">
          Button
        </Text>
        <BlockStack gap="400">
          <ColorPickerComponent
            label="Button color"
            currentHexColor={announcement.styles.buttonBackgroundColor}
            onChange={(val: string) => {
              dispatch(setAnnouncementStyles({ buttonBackgroundColor: val }));
            }}
          />

          <TextWithColorPickerComponent
            title="Button text size and color"
            textFieldValue={announcement.styles.buttonFontSize}
            textFieldOnChange={(val: string) => {
              dispatch(
                setAnnouncementStyles({
                  buttonFontSize: val,
                })
              );
            }}
            colorPickerCurrentHexColor={announcement.styles.buttonFontColor}
            colorPickerOnChange={(val: string) => {
              dispatch(
                setAnnouncementStyles({
                  buttonFontColor: val,
                })
              );
            }}
          />

          <InlineGrid columns={["oneThird", "twoThirds"]} gap={"200"}>
            <TextField
              label="Border radius"
              autoComplete="off"
              type="number"
              value={announcement.styles.buttonBorderRadius}
              onChange={(val: string) => {
                dispatch(setAnnouncementStyles({ buttonBorderRadius: val }));
              }}
            />
          </InlineGrid>
        </BlockStack>
      </BlockStack>
    </Box>
  );
};

export default AnnouncementButtonDesign;
