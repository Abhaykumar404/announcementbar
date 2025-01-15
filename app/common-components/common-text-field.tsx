import { TextField } from "@shopify/polaris";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListOfErrors } from "app/store/slices/global-state-slice";

const CommonTextField = ({
  prefix,
  suffix,
  placeholder,
  value,
  helpText,
  label,
  labelHidden,
  disabled,
  autoFocus,
  multiline,
  showEmtpyTextError,
  showInvalidHexCodeError,
  type,
  name,
  id,
  autoComplete,
  onChange,
  onBlur,
  min,
  max,
  verticalContent,
  error,
}: {
  id: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  placeholder?: string;
  value: string;
  helpText?: React.ReactNode;
  label: React.ReactNode;
  labelHidden?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  multiline?: boolean | number;
  showEmtpyTextError?: boolean;
  showInvalidHexCodeError?: boolean;
  type?: any;
  name?: string;
  autoComplete: string;
  variant?: "standard" | "compact";
  size?: "small" | "medium" | "large";
  onChange?: (value: string) => void;
  onBlur?: any;
  min?: number;
  max?: number;
  verticalContent?: any;
  error?: any;
}) => {
  const [active, setActive] = useState(false);

  const dispatch = useDispatch();
  const listOfTextFieldErrors = useSelector(
    (state: any) => state.globalState.listOfErrors
  );

  const errorMessage = () => {
    if (error) {
      return error;
    } else {
      if (
        !active &&
        showEmtpyTextError &&
        showInvalidHexCodeError &&
        value === ""
      ) {
        return "Value can’t be blank";
      } else if (
        !active &&
        showInvalidHexCodeError &&
        value !== "" &&
        !isValidHexColor(value)
      ) {
        return "Invalid hex code";
      }
      return "";
    }
  };

  return (
    <TextField
      id={id}
      prefix={prefix}
      suffix={suffix}
      placeholder={placeholder}
      value={value}
      helpText={helpText}
      label={label}
      labelHidden={labelHidden}
      disabled={disabled}
      min={min}
      max={max}
      autoFocus={autoFocus}
      multiline={multiline}
      type={type}
      name={name}
      autoComplete={autoComplete}
      verticalContent={verticalContent}
      onChange={(value) => {
        if (onChange !== undefined && onChange !== null) onChange(value);
      }}
      error={errorMessage()}
      onFocus={() => setActive(true)}
      onBlur={() => {
        const cloneOfListOfErrors = { ...listOfTextFieldErrors };
        // Check for empty error
        if (value === "" && showInvalidHexCodeError && showEmtpyTextError) {
          cloneOfListOfErrors[id] = ErrorTextFieldType.Empty;
          dispatch(setListOfErrors(cloneOfListOfErrors));
        }
        // Check for invalid hex code error
        else if (
          showInvalidHexCodeError &&
          value !== "" &&
          !isValidHexColor(value)
        ) {
          cloneOfListOfErrors[id] = ErrorTextFieldType.InvalidHexCode;
          dispatch(setListOfErrors(cloneOfListOfErrors));
        }
        // Remove errors if no issues
        else {
          if (cloneOfListOfErrors[id]) {
            delete cloneOfListOfErrors[id];
            dispatch(setListOfErrors(cloneOfListOfErrors));
          }
        }
        setActive(false); // Set active to false regardless of validation
      }}
    />
  );
};

export default CommonTextField;

export const ErrorTextFieldType = {
  Empty: "Empty",
  InvalidHexCode: "InvalidHexCode",
};

export const isValidHexColor = (hex: string) => {
  const hexRegex =
    /^#?([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
  return hexRegex.test(hex);
};
