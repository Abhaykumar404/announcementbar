import {
  BlockStack,
  Button,
  InlineStack,
  Text,
  TextField,
} from "@shopify/polaris";
import { useState } from "react";
import TranslationModal from "./translation-modal";

const TranslationTextField = ({
  id,
  label,
  helpText,
  value,
  onChange,
  initialTranslations,
  onModalSave,
  modalTitle = "Add translations",
  multiline = 1,
}: {
  id: string;
  label: string;
  helpText?: string;
  value: string;
  onChange: (value: string) => void;
  initialTranslations: any;
  onModalSave: (value: any) => void;
  modalTitle?: string;
  multiline?: number;
}) => {
  const [active, setActive] = useState(false);

  return (
    <div>
      <BlockStack>
        <InlineStack align="space-between">
          <Text variant="bodyMd" as="p">
            {label}
          </Text>
          <Button
            variant="plain"
            onClick={() => {
              setActive(true);
            }}
          >
            {initialTranslations && initialTranslations.length > 0
              ? `Edit Translations (${initialTranslations.length})`
              : "Add Translations"}
          </Button>
        </InlineStack>
        <div style={{ height: 4 }} />
        <TextField
          id={id}
          autoComplete="false"
          label=""
          multiline={multiline}
          helpText={helpText}
          onChange={onChange}
          value={value}
        />
      </BlockStack>

      {active && (
        <TranslationModal
          active={active}
          setActive={setActive}
          modalTitle={modalTitle}
          initialTranslations={initialTranslations}
          onModalSave={onModalSave}
        />
      )}
    </div>
  );
};

export default TranslationTextField;
