import { useState } from "react";
import * as styled from "./calendarStyles.js";

const Calendar = ({
  selectedDay,
  onDaySelect,
  single = true,
  allowFuture = false,
  minDate = null,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sa"];
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const today = new Date();

  const parseMinDate = (minDateString) => {
    const day = minDateString.slice(0, 2);
    const month = minDateString.slice(2, 4);
    const year = minDateString.slice(4, 8);
    return new Date(`${year}-${month}-${day}`);
  };

  const minDateParsed = minDate ? parseMinDate(minDate) : null;

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    if (newDate.getMonth() === 0) {
      newDate.setFullYear(newDate.getFullYear() - 1);
      newDate.setMonth(11);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    if (newDate.getMonth() === 11) {
      newDate.setFullYear(newDate.getFullYear() + 1);
      newDate.setMonth(0);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentMonth(newDate);
  };

  const renderCalendarDays = () => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();

    const numDays = daysInMonth(month, year);
    const firstDayIndex = firstDayOfMonth(month, year);

    const daysArray = [];
    for (let i = 0; i < firstDayIndex; i++) {
      daysArray.push(null);
    }

    for (let day = 1; day <= numDays; day++) {
      daysArray.push(day);
    }

    return daysArray;
  };

  const calendarDays = renderCalendarDays();

  const formatKey = (day, month, year) => {
    return `${String(day).padStart(2, "0")}${String(month + 1).padStart(
      2,
      "0"
    )}${year}`;
  };

  const formatDate = (date) => {
    const dateString = new Date(
      date.replace(/(\d{2})(\d{2})(\d{4})/, "$3-$2-$1")
    );
    return Date.parse(dateString);
  };

  const handleDaySelect = (dayKey) => {
    if (single) {
      onDaySelect(dayKey);
    } else {
      if (selectedDay.includes(dayKey)) {
        const newSelectedDays = selectedDay.filter((day) => day !== dayKey);
        onDaySelect(newSelectedDays);
      } else {
        if (selectedDay.length === 0) {
          onDaySelect([dayKey]);
        } else if (selectedDay.length <= 2) {
          if (formatDate(selectedDay[0]) > formatDate(dayKey)) {
            onDaySelect([dayKey, selectedDay[0]]);
          } else {
            onDaySelect([selectedDay[0], dayKey]);
          }
        }
      }
    }
  };

  const isNextDisabled =
    !allowFuture &&
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth();

  const isSelected = (dayKey) => {
    if (single) {
      return selectedDay === dayKey;
    } else {
      return selectedDay.includes(dayKey);
    }
  };

  const isBetween = (dateKey) => {
    if (single) {
      return false;
    } else {
      if (dateKey === null) return false;
      if (selectedDay.length < 2) return false;
      const startKey = selectedDay[0];
      const endKey = selectedDay[1];
      const startDate = new Date(
        `${startKey.slice(4, 8)}-${startKey.slice(2, 4)}-${startKey.slice(
          0,
          2
        )}`
      );
      const endDate = new Date(
        `${endKey.slice(4, 8)}-${endKey.slice(2, 4)}-${endKey.slice(0, 2)}`
      );
      const currentDate = new Date(
        `${dateKey.slice(4, 8)}-${dateKey.slice(2, 4)}-${dateKey.slice(0, 2)}`
      );

      return currentDate > startDate && currentDate < endDate;
    }
  };

  const isBeforeMinDate = (day, month, year) => {
    if (!minDateParsed) return false;

    const min = new Date(minDateParsed);
    const currentDate = new Date(year, month, day);

    return currentDate < min;
  };

  return (
    <styled.calendarContainer>
      <styled.calendarHeader>
        <styled.prevNextButton onClick={handlePrevMonth}>
          {"<"}
        </styled.prevNextButton>
        <div>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </div>
        <styled.prevNextButton
          onClick={handleNextMonth}
          disabled={isNextDisabled}
        >
          {">"}
        </styled.prevNextButton>
      </styled.calendarHeader>
      <styled.calendarGrid>
        {daysOfWeek.map((day) => (
          <styled.calendarDay key={day} $isDayOfWeek>
            {day}
          </styled.calendarDay>
        ))}
        {calendarDays.map((day, index) => {
          const dayKey = day
            ? formatKey(
                day,
                currentMonth.getMonth(),
                currentMonth.getFullYear()
              )
            : null;

          const isFutureDay =
            day &&
            !allowFuture &&
            (currentMonth.getFullYear() > today.getFullYear() ||
              (currentMonth.getFullYear() === today.getFullYear() &&
                currentMonth.getMonth() > today.getMonth()) ||
              (currentMonth.getFullYear() === today.getFullYear() &&
                currentMonth.getMonth() === today.getMonth() &&
                day > today.getDate()));

          const isDayDisabled =
            !day ||
            (isFutureDay && !allowFuture) ||
            isBeforeMinDate(
              day,
              currentMonth.getMonth(),
              currentMonth.getFullYear()
            );

          return (
            <styled.calendarDay
              key={index}
              $isDisabled={isDayDisabled}
              $isBetween={isBetween(dayKey)}
              $isSelected={isSelected(dayKey)}
              onClick={() => !isDayDisabled && day && handleDaySelect(dayKey)}
            >
              {day}
            </styled.calendarDay>
          );
        })}
      </styled.calendarGrid>
    </styled.calendarContainer>
  );
};

export default Calendar;
