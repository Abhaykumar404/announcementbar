import { BlockStack, Box, Select, Text } from "@shopify/polaris";
import { useDispatch, useSelector } from "react-redux";
import TextWithColorPickerComponent from "app/common-components/text-with-color-picker-component";
import { setAnnouncementStyles } from "app/store/slices/announcement-slice";

const AnnouncementTypography = () => {
  const announcement = useSelector((state: any) => state.announcement);
  const dispatch = useDispatch();

  return (
    <Box padding="400">
      <BlockStack gap="300">
        <Text as="h2" variant="headingMd">
          Typography
        </Text>
        <BlockStack gap="400">
          <Select
            label="Font"
            value={announcement.styles.fontFamily}
            options={[
              {
                label: "Use your theme fonts",
                value: "inherit",
              },
              {
                label: "Helvetica",
                value: "Helvetica",
              },
              {
                label: "Arial",
                value: "Arial",
              },
              {
                label: "Times New Roman",
                value: "Times New Roman",
              },
              {
                label: "Georgia",
                value: "Georgia",
              },
              {
                label: "Trebuchet MS",
                value: "Trebuchet MS",
              },
              {
                label: "Tahoma",
                value: "Tahoma",
              },
              {
                label: "Garamond",
                value: "Garamond",
              },
              {
                label: "Courier New",
                value: "Courier New",
              },
            ]}
            onChange={(val: string) => {
              dispatch(
                setAnnouncementStyles({
                  fontFamily: val,
                })
              );
            }}
          />

          <TextWithColorPickerComponent
            title="Title size and color"
            textFieldValue={announcement.styles.titleSize}
            textFieldOnChange={(val: string) => {
              dispatch(
                setAnnouncementStyles({
                  titleSize: val,
                })
              );
            }}
            colorPickerCurrentHexColor={announcement.styles.titleColor}
            colorPickerOnChange={(val: string) => {
              dispatch(
                setAnnouncementStyles({
                  titleColor: val,
                })
              );
            }}
          />

          <TextWithColorPickerComponent
            title="Subheading size and color"
            textFieldValue={announcement.styles.subheadingSize}
            textFieldOnChange={(val: string) => {
              dispatch(
                setAnnouncementStyles({
                  subheadingSize: val,
                })
              );
            }}
            colorPickerCurrentHexColor={announcement.styles.subheadingColor}
            colorPickerOnChange={(val: string) => {
              dispatch(
                setAnnouncementStyles({
                  subheadingColor: val,
                })
              );
            }}
          />
        </BlockStack>
      </BlockStack>
    </Box>
  );
};

export default AnnouncementTypography;
