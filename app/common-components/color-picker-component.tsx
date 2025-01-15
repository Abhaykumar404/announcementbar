import {
  BlockStack,
  Card,
  ColorPicker,
  InlineStack,
  Modal,
  Popover,
  Text,
} from "@shopify/polaris";
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListOfErrors } from "app/store/slices/global-state-slice";
import CommonTextField, { isValidHexColor } from "./common-text-field";

export const hsvToHsl = (h: any, s: any, v: any) => {
  // both hsv and hsl values are in [0, 1]
  const l = ((2 - s) * v) / 2;

  if (l !== 0) {
    if (l === 1) {
      s = 0;
    } else if (l < 0.5) {
      s = (s * v) / (l * 2);
    } else {
      s = (s * v) / (2 - l * 2);
    }
  }

  return [h, s, l];
};

export const hslToHex = (h: any, s: any, l: any) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: any) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `${f(0)}${f(8)}${f(4)}`;
};

const ColorPickerComponent = ({
  id,
  label,
  labelHidden,
  onChange,
  currentHexColor,
  helpText = "",
  placeholder,
  disabled,
}: {
  id?: string;
  label?: string;
  labelHidden?: boolean;
  onChange?: (color: string) => void;
  currentHexColor?: string;
  helpText?: string;
  placeholder?: string;
  disabled?: boolean;
}) => {
  const [color, setColor] = useState({
    hue: 120,
    saturation: 1,
    brightness: 1,
    alpha: 1,
  });

  const [popoverActive, setPopoverActive] = useState(false);
  const dispatch = useDispatch();
  const listOfTextFieldErrors = useSelector(
    (state: any) => state.globalState.listOfErrors
  );

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const handleSetColor = (newColor: any, id: any) => {
    setColor(newColor);
    const cc = hsvToHsl(newColor.hue, newColor.saturation, newColor.brightness);
    const hexColorCode = hslToHex(cc[0], cc[1] * 100, cc[2] * 100);
    if (onChange !== undefined && onChange !== null) onChange(hexColorCode);

    if (hexColorCode === "") {
      console.log("empty");
    }
    // Check for invalid hex code error
    else if (hexColorCode !== "" && !isValidHexColor(hexColorCode)) {
      console.log("invalid");
    }
    // Remove errors if no issues
    else {
      const cloneOfListOfErrors = { ...listOfTextFieldErrors };
      if (cloneOfListOfErrors[id]) {
        delete cloneOfListOfErrors[id];
        dispatch(setListOfErrors(cloneOfListOfErrors));
      }
    }
  };

  const handleHexColorChange = (hexColorCode: any) => {
    if (onChange !== undefined && onChange !== null) onChange(hexColorCode);
  };

  const activator = (
    <div
      style={{
        height: "24px",
        width: "24px",
        border: "1px solid #d3d3d3",
        borderRadius: "4px",
        cursor: "pointer",
        backgroundColor: `#${currentHexColor}`,
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={() => {
        if (!disabled) togglePopoverActive();
      }}
    />
  );

  return (
    <CommonTextField
      id={id ?? ""}
      prefix="#"
      label={label}
      value={`${currentHexColor}`}
      onChange={(val: string) => handleHexColorChange(val)}
      autoComplete="off"
      helpText={helpText}
      showEmtpyTextError={true}
      showInvalidHexCodeError={true}
      labelHidden={labelHidden}
      placeholder={placeholder}
      disabled={disabled}
      suffix={
        <Popover
          active={popoverActive}
          activator={activator}
          onClose={togglePopoverActive}
        >
          <Card>
            <ColorPicker
              onChange={(color: any) => {
                handleSetColor(color, id);
              }}
              color={color}
            />
          </Card>
        </Popover>
        //   <ColorSelectorModal
        //   id={id ?? ""}
        // color={color}
        // handleSetColor={handleSetColor}
        // popoverActive={popoverActive}
        // togglePopoverActive={togglePopoverActive}
        //   activator={activator}
        // />
      }
    />
  );
};

export default ColorPickerComponent;

export const ColorSelectorModal = ({
  id,
  color,
  handleSetColor,
  popoverActive,
  togglePopoverActive,
  activator,
}: {
  id: string;
  color: any;
  handleSetColor: (color: any, id: string) => void;
  popoverActive: boolean;
  togglePopoverActive: () => void;
  activator: any;
}) => {
  return (
    <Modal
      size="small"
      title="Color Picker"
      key={`color-picker-popover_${id}`}
      open={popoverActive}
      activator={activator}
      onClose={togglePopoverActive}
      primaryAction={{
        content: "Done",
        onAction: () => {
          togglePopoverActive();
        },
      }}
    >
      <Modal.Section>
        <InlineStack gap={"200"} align="space-around">
          <ColorPicker
            onChange={(color: any) => {
              handleSetColor(color, id);
            }}
            color={color}
          />
          <BlockStack gap={"300"} align="center">
            <BlockStack>
              <Text variant="bodyMd" as="h6">
                Selected Color HEX
              </Text>
              <Text variant="headingLg" as="p">
                #{getHexCodeFromHue(color)}
              </Text>
            </BlockStack>
          </BlockStack>
        </InlineStack>
      </Modal.Section>
    </Modal>
  );
};

export const getHexCodeFromHue = (color: any) => {
  const cc = hsvToHsl(color.hue, color.saturation, color.brightness);
  return hslToHex(cc[0], cc[1] * 100, cc[2] * 100);
};
