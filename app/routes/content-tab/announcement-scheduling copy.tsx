import {
  BlockStack,
  Box,
  InlineGrid,
  RadioButton,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import DateTimeTextField from "app/common-components/date-time-textfield";
import { useDispatch, useSelector } from "react-redux";
import { setAnnouncementSettings } from "app/store/slices/announcement-slice";
import { AnnouncementDateTimeType } from "app/utils/enums/announcement-datetime-enum";

const AnnouncementSchedulingComponent = () => {
  const announcement = useSelector((state: any) => state.announcement);
  const dispatch = useDispatch();

  return (
    <Box padding="400">
      <BlockStack gap="300">
        <Text as="h2" variant="headingMd">
          Scheduling
        </Text>
        <BlockStack gap="050">
          <Text variant="bodyMd" as="p">
            Starts
          </Text>
          <div />
          <RadioButton
            name="announcement-start-time"
            label="Right now"
            checked={
              announcement?.settings?.startDateTimeType ===
              AnnouncementDateTimeType.RIGHT_NOW
            }
            onChange={(val: boolean) => {
              dispatch(
                setAnnouncementSettings({
                  startDateTimeType: AnnouncementDateTimeType.RIGHT_NOW,
                })
              );
            }}
          />
          <RadioButton
            name="announcement-start-time"
            label="Specific date"
            checked={
              announcement?.settings?.startDateTimeType ===
              AnnouncementDateTimeType.SPECIFIC_DATE
            }
            onChange={(val: boolean) => {
              const currentDate = new Date();
              // let hours = currentDate.getHours();
              // const minutes = currentDate.getMinutes();
              // const isPM = hours >= 12;
              // hours = hours % 12 || 12; // Convert to 12-hour format

              // const formattedDate = `${currentDate.getFullYear()}-${
              //   currentDate.getMonth() + 1
              // }-${currentDate.getDate()}`;

              // console.log("currentDate", formattedDate);

              dispatch(
                setAnnouncementSettings({
                  startDateTimeType: AnnouncementDateTimeType.SPECIFIC_DATE,
                  startDate: currentDate.toISOString(),
                  // startHours: hours,
                  // startMinutes: minutes,
                  // startPeriod: isPM ? "PM" : "AM",
                })
              );
            }}
          />
          <div style={{ height: "8px", width: 1 }} />
          {announcement?.settings?.startDateTimeType ===
            AnnouncementDateTimeType.SPECIFIC_DATE && (
            <DateTimeFields type="start" />
          )}
        </BlockStack>
        <BlockStack gap="050">
          <Text variant="bodyMd" as="p">
            Ends
          </Text>
          <div />
          <RadioButton
            label="Right now"
            checked={
              announcement?.settings?.endDateTimeType ===
              AnnouncementDateTimeType.RIGHT_NOW
            }
            onChange={(val: boolean) => {
              dispatch(
                setAnnouncementSettings({
                  endDateTimeType: AnnouncementDateTimeType.RIGHT_NOW,
                })
              );
            }}
          />
          <RadioButton
            label="Specific date"
            checked={
              announcement?.settings?.endDateTimeType ===
              AnnouncementDateTimeType.SPECIFIC_DATE
            }
            onChange={(val: boolean) => {
              const currentDate = new Date();
              let hours = currentDate.getHours();
              const minutes = currentDate.getMinutes();
              const isPM = hours >= 12;
              hours = hours % 12 || 12; // Convert to 12-hour format

              dispatch(
                setAnnouncementSettings({
                  endDateTimeType: AnnouncementDateTimeType.SPECIFIC_DATE,
                  endDate: currentDate,
                  endHours: hours,
                  endMinutes: minutes,
                  endPeriod: isPM ? "PM" : "AM",
                })
              );
            }}
          />
          <div style={{ height: "8px", width: 1 }} />
          {announcement?.settings?.endDateTimeType ===
            AnnouncementDateTimeType.SPECIFIC_DATE && (
            <DateTimeFields type="end" />
          )}
        </BlockStack>
      </BlockStack>
    </Box>
  );
};

const DateTimeFields = ({ type }: { type: string }) => {
  const announcement = useSelector((state: any) => state.announcement);
  const dispatch = useDispatch();

  const handleDateChange = (value: string) => {
    dispatch(setAnnouncementSettings({ [`${type}Date`]: value }));
  };

  const handleHoursChange = (value: string) => {
    let hours = parseInt(value);
    if (hours > 12) {
      hours = 12;
    }
    dispatch(setAnnouncementSettings({ [`${type}Hours`]: hours }));
  };

  const handleMinutesChange = (value: string) => {
    let minutes = parseInt(value);
    if (minutes > 59) {
      minutes = 59;
    }
    dispatch(setAnnouncementSettings({ [`${type}Minutes`]: minutes }));
  };

  const handlePeriodChange = (value: string) => {
    dispatch(setAnnouncementSettings({ [`${type}Period`]: value }));
  };

  return (
    <BlockStack gap="200">
      <DateTimeTextField
        label=""
        value={announcement?.settings?.[`${type}Date`]}
        initialDate={announcement?.settings?.[`${type}Date`] ?? new Date()}
        onChange={handleDateChange}
      />

      <InlineGrid gap="200" columns={3}>
        <TextField
          label="Hours"
          labelHidden={true}
          autoComplete="off"
          value={`${announcement?.settings?.[`${type}Hours`]}`}
          min={1}
          max={12}
          type="number"
          onChange={(value: string) => handleHoursChange(value)}
          onBlur={() => {
            if (announcement?.settings?.[`${type}Hours`] < 1) {
              dispatch(setAnnouncementSettings({ [`${type}Hours`]: 1 }));
            }
          }}
        />
        <TextField
          label="Minutes"
          labelHidden={true}
          autoComplete="off"
          min={0}
          max={59}
          type="number"
          value={`${announcement?.settings?.[`${type}Minutes`]}`}
          onChange={(value: string) => handleMinutesChange(value)}
          onBlur={() => {
            if (announcement?.settings?.[`${type}Minutes`] < 0) {
              dispatch(setAnnouncementSettings({ [`${type}Minutes`]: 0 }));
            }
          }}
        />
        <Select
          label="AM/PM"
          labelHidden={true}
          options={[
            {
              label: "AM",
              value: "AM",
            },
            {
              label: "PM",
              value: "PM",
            },
          ]}
          value={announcement?.settings?.[`${type}Period`]}
          onChange={(value: string) => handlePeriodChange(value)}
        />
      </InlineGrid>
    </BlockStack>
  );
};

export default AnnouncementSchedulingComponent;
