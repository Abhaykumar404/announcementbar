import { BlockStack, InlineGrid, Text, TextField } from "@shopify/polaris";
import ColorPickerComponent from "./color-picker-component";

const TextWithColorPickerComponent = ({
  title,
  textFieldValue,
  textFieldOnChange,
  colorPickerCurrentHexColor,
  colorPickerOnChange,
}: {
  title: string;
  textFieldValue: string;
  textFieldOnChange: (value: string) => void;
  colorPickerCurrentHexColor: string;
  colorPickerOnChange: (value: string) => void;
}) => {
  return (
    <BlockStack gap="100">
      <Text variant="bodyLg" as="p">
        {title}
      </Text>
      <InlineGrid columns={["oneThird", "twoThirds"]} gap={"200"}>
        <TextField
          label=""
          labelHidden
          autoComplete="off"
          value={textFieldValue}
          onChange={textFieldOnChange}
          type="number"
        />
        <ColorPickerComponent
          onChange={colorPickerOnChange}
          currentHexColor={colorPickerCurrentHexColor}
          label=""
        />
      </InlineGrid>
    </BlockStack>
  );
};

export default TextWithColorPickerComponent;
