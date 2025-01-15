import {
  BlockStack,
  Box,
  InlineGrid,
  RadioButton,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DateTimeTextField from "app/common-components/date-time-textfield";
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
              // const getOffset = currentDate.getTimezoneOffset();
              // const isPM = hours >= 12;
              // hours = hours % 12 || 12; // Convert to 12-hour format

              // const formattedDate = `${currentDate.getFullYear()}-${
              //   currentDate.getMonth() + 1
              // }-${currentDate.getDate()}`;

              console.log("currentDate", currentDate.toISOString());

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
            label="Never"
            checked={
              announcement?.settings?.endDateTimeType ===
              AnnouncementDateTimeType.NEVER
            }
            onChange={(val: boolean) => {
              dispatch(
                setAnnouncementSettings({
                  endDateTimeType: AnnouncementDateTimeType.NEVER,
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

              dispatch(
                setAnnouncementSettings({
                  endDateTimeType: AnnouncementDateTimeType.SPECIFIC_DATE,
                  endDate: currentDate.toISOString(),
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
  console.log("LOG", announcement?.settings?.[`${type}Date`]);

  const dispatch = useDispatch();

  const handleDateChange = (value: string) => {
    dispatch(setAnnouncementSettings({ [`${type}Date`]: value }));
  };

  const handleHoursChange = (value: string) => {
    let hours = parseInt(value);
    if (hours > 12) {
      hours = 12;
    }
    if (hours < 1) {
      hours = 1;
    }
    const date = new Date(announcement?.settings?.[`${type}Date`]);
    const { minutes, period } = getHoursMinutesPeriod(
      announcement?.settings?.[`${type}Date`]
    );
    let newHours = hours;
    if (period === "PM") {
      newHours = hours === 12 ? 12 : hours + 12;
    } else {
      newHours = hours === 12 ? 0 : hours;
    }
    date.setHours(newHours);
    date.setMinutes(minutes);
    dispatch(setAnnouncementSettings({ [`${type}Date`]: date.toISOString() }));
  };

  const handleMinutesChange = (value: string) => {
    let minutes = parseInt(value);
    if (minutes > 59) {
      minutes = 59;
    }
    if (minutes < 0) {
      minutes = 0;
    }
    const date = new Date(announcement?.settings?.[`${type}Date`]);
    const { hours, period } = getHoursMinutesPeriod(
      announcement?.settings?.[`${type}Date`]
    );
    let newHours = hours;
    if (period === "PM") {
      newHours = hours === 12 ? 12 : hours + 12;
    } else {
      newHours = hours === 12 ? 0 : hours;
    }
    date.setHours(newHours);
    date.setMinutes(minutes);
    dispatch(setAnnouncementSettings({ [`${type}Date`]: date.toISOString() }));
  };

  const handlePeriodChange = (value: string) => {
    const date = new Date(announcement?.settings?.[`${type}Date`]);
    const { hours } = getHoursMinutesPeriod(
      announcement?.settings?.[`${type}Date`]
    );
    let newHours = hours;
    if (value === "PM") {
      newHours = hours === 12 ? 12 : hours + 12;
    } else {
      newHours = hours === 12 ? 0 : hours;
    }
    date.setHours(newHours);
    dispatch(setAnnouncementSettings({ [`${type}Date`]: date.toISOString() }));
  };

  const getHoursMinutesPeriod = useCallback((date: string) => {
    const startDate = new Date(date);
    let dateString = startDate.toDateString();
    let hours = startDate.getHours();
    const minutes = startDate.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    return { dateString, hours, minutes, period };
  }, []);

  return (
    <BlockStack gap="200">
      <DateTimeTextField
        label=""
        value={announcement?.settings?.[`${type}Date`]}
        onChange={handleDateChange}
      />

      <InlineGrid gap="200" columns={3}>
        <TextField
          label="Hours"
          labelHidden={true}
          autoComplete="off"
          value={`${
            getHoursMinutesPeriod(announcement?.settings?.[`${type}Date`])
              ?.hours
          }`}
          min={1}
          max={12}
          type="number"
          onChange={(value: string) => handleHoursChange(value)}
          onBlur={() => {
            if (announcement?.settings?.[`${type}Date`] < 1) {
              dispatch(setAnnouncementSettings({ [`${type}Date`]: 1 }));
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
          value={`${
            getHoursMinutesPeriod(announcement?.settings?.[`${type}Date`])
              ?.minutes
          }`}
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
          value={
            getHoursMinutesPeriod(announcement?.settings?.[`${type}Date`])
              ?.period
          }
          onChange={(value: string) => handlePeriodChange(value)}
        />
      </InlineGrid>
    </BlockStack>
  );
};

export default AnnouncementSchedulingComponent;
