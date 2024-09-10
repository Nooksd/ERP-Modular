import { useState } from "react";
import * as styled from "./calendarStyles.js";

const Calendar = ({ selectedDay, onDaySelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sa"];
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const today = new Date();

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

  const isNextDisabled =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth();

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
        <styled.prevNextButton onClick={handleNextMonth} disabled={isNextDisabled}>
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
            (currentMonth.getFullYear() > today.getFullYear() ||
              (currentMonth.getFullYear() === today.getFullYear() &&
                currentMonth.getMonth() > today.getMonth()) ||
              (currentMonth.getFullYear() === today.getFullYear() &&
                currentMonth.getMonth() === today.getMonth() &&
                day > today.getDate()));

          return (
            <styled.calendarDay
              key={index}
              $isDisabled={!day || isFutureDay}
              $isSelected={selectedDay === dayKey}
              onClick={() => !isFutureDay && day && onDaySelect(dayKey)}
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
