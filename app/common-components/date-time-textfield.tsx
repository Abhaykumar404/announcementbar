import { DatePicker, Popover, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";

const DateTimeTextField = ({
  label,
  value,
  // initialDate,
  onChange,
}: {
  label: string;
  value: string;
  // initialDate: string;
  onChange: (value: string) => void;
}) => {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const initialDateObj = new Date(value);
  const [{ month, year }, setDate] = useState({
    month: initialDateObj.getMonth(),
    year: initialDateObj.getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState(initialDateObj);

  const handleMonthChange = useCallback(
    (month: number, year: number) => setDate({ month, year }),
    []
  );

  return (
    <Popover
      active={popoverActive}
      activator={
        <TextField
          onFocus={togglePopoverActive}
          autoComplete="off"
          label={label}
          value={`${selectedDates.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`}
          onChange={() => {}}
        />
      }
      autofocusTarget="first-node"
      onClose={togglePopoverActive}
    >
      <div style={{ width: "280px", padding: "12px" }}>
        <DatePicker
          month={month}
          year={year}
          onChange={(date) => {
            const selectedDate = new Date(date.start);
            console.log("LOG selectedDate", selectedDate);

            const currentDate = new Date(value);
            console.log("LOG currentDate", currentDate);

            // Keep the existing hours and minutes from currentDate
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();

            // Set the date components from selectedDate
            selectedDate.setHours(hours);
            selectedDate.setMinutes(minutes);
            selectedDate.setSeconds(0);
            selectedDate.setMilliseconds(0);

            setSelectedDates(selectedDate);
            onChange(selectedDate.toISOString());
            togglePopoverActive();
          }}
          onMonthChange={handleMonthChange}
          selected={selectedDates}
          allowRange={false}
        />
      </div>
    </Popover>
  );
};

export default DateTimeTextField;
