import {
  BlockStack,
  Box,
  FormLayout,
  Grid,
  InlineGrid,
  RadioButton,
  RangeSlider,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { useDispatch, useSelector } from "react-redux";
import ColorPickerComponent from "app/common-components/color-picker-component";
import { setAnnouncementStyles } from "app/store/slices/announcement-slice";
import { BackgroundType } from "app/utils/enums/background-types-enum";

const AnnouncementCardDesign = () => {
  const announcement = useSelector((state: any) => state.announcement);
  const dispatch = useDispatch();

  return (
    <Box padding="400">
      <BlockStack gap="300">
        <Text as="h2" variant="headingMd">
          Card Design
        </Text>
        <BlockStack gap="400">
          <RadioButton
            name="announcement-background"
            label="Single color background"
            checked={
              announcement?.styles?.backgroundType ===
              BackgroundType.SINGLE_COLOR
            }
            onChange={(val: boolean) => {
              dispatch(
                setAnnouncementStyles({
                  backgroundType: BackgroundType.SINGLE_COLOR,
                })
              );
            }}
          />

          <ColorPickerComponent
            label="Single color background"
            id="single-color-background"
            currentHexColor={announcement?.styles?.singleColor}
            disabled={
              announcement?.styles?.backgroundType !==
              BackgroundType.SINGLE_COLOR
            }
            onChange={(val: string) => {
              dispatch(setAnnouncementStyles({ singleColor: val }));
            }}
          />

          <RadioButton
            name="announcement-background"
            label="Gradient background"
            checked={
              announcement?.styles?.backgroundType === BackgroundType.GRADIENT
            }
            onChange={(val: boolean) => {
              dispatch(
                setAnnouncementStyles({
                  backgroundType: BackgroundType.GRADIENT,
                })
              );
            }}
          />

          <RangeSlider
            label="Gradient turn"
            output
            min={0}
            max={360}
            disabled={
              announcement?.styles?.backgroundType !== BackgroundType.GRADIENT
            }
            value={announcement?.styles?.gradientTurn}
            onChange={(val: number) => {
              dispatch(setAnnouncementStyles({ gradientTurn: val }));
            }}
          />

          <ColorPickerComponent
            label="Gradient start color"
            id="gradient-start-color"
            currentHexColor={announcement?.styles?.gradientStart}
            disabled={
              announcement?.styles?.backgroundType !== BackgroundType.GRADIENT
            }
            onChange={(val: string) => {
              dispatch(setAnnouncementStyles({ gradientStart: val }));
            }}
          />

          <ColorPickerComponent
            label="Gradient end color"
            id="gradient-end-color"
            currentHexColor={announcement?.styles?.gradientEnd}
            disabled={
              announcement?.styles?.backgroundType !== BackgroundType.GRADIENT
            }
            onChange={(val: string) => {
              dispatch(setAnnouncementStyles({ gradientEnd: val }));
            }}
          />

          <InlineGrid columns={2} gap={"300"}>
            <TextField
              autoComplete="off"
              label="Border radius"
              type="number"
              id="border-radius"
              value={announcement?.styles?.borderRadius}
              onChange={(val: string) => {
                dispatch(setAnnouncementStyles({ borderRadius: val }));
              }}
            />
            <TextField
              autoComplete="off"
              label="Border size"
              id="border-size"
              type="number"
              value={announcement?.styles?.borderSize}
              onChange={(val: string) => {
                dispatch(setAnnouncementStyles({ borderSize: val }));
              }}
            />
          </InlineGrid>

          <ColorPickerComponent
            label="Border color"
            id="border-color"
            currentHexColor={announcement?.styles?.borderColor}
            onChange={(val: string) => {
              dispatch(setAnnouncementStyles({ borderColor: val }));
            }}
          />
        </BlockStack>
      </BlockStack>
    </Box>
  );
};

export default AnnouncementCardDesign;
