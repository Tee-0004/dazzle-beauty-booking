import { useState } from 'react';

function AvailabilityCalendar({ selectedDate, onDateSelect }) {
  const today = new Date();

  // Start the calendar at the current month.
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const monthName = visibleMonth.toLocaleDateString('en-ZA', {
    month: 'long',
    year: 'numeric',
  });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const todayString = formatDate(today);

  const goToPreviousMonth = () => {
    setVisibleMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setVisibleMonth(new Date(year, month + 1, 1));
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Add empty spaces so dates line up with the correct weekdays.
  const calendarCells = Array.from(
    { length: firstDayOfMonth },
    (_, index) => ({
      type: 'empty',
      id: `empty-${index}`,
    })
  );

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const dateString = formatDate(date);
    const weekday = date.getDay();

    calendarCells.push({
      type: 'day',
      day,
      dateString,
      isPast: dateString < todayString,
      isClosed: weekday === 0 || weekday === 1,
    });
  }

  return (
    <section className="w-full">
      {/* Calendar heading */}
      <div className="mb-5 border-b border-neutral-300 pb-3">
        <h2 className="text-lg font-normal text-neutral-900 sm:text-xl">
          Select a Date and Time
        </h2>
      </div>

      {/* Month navigation */}
      <div className="mb-5 flex items-center justify-between px-2">
        <button
          type="button"
          onClick={goToPreviousMonth}
          aria-label="Previous month"
          className="flex h-9 w-9 items-center justify-center text-2xl text-neutral-800 transition hover:bg-neutral-100"
        >
          ‹
        </button>

        <h3 className="text-base font-medium text-neutral-900 sm:text-lg">
          {monthName}
        </h3>

        <button
          type="button"
          onClick={goToNextMonth}
          aria-label="Next month"
          className="flex h-9 w-9 cursor-pointer items-center justify-center text-2xl text-neutral-800 transition hover:bg-neutral-100"
        >
          ›
        </button>
      </div>

      {/* Weekday names */}
      <div className="grid grid-cols-7 gap-y-2">
        {weekdays.map((weekday) => (
          <div
            key={weekday}
            className="flex h-8 items-center justify-center text-xs text-neutral-700 sm:text-sm"
          >
            {weekday}
          </div>
        ))}

        {/* Calendar dates */}
        {calendarCells.map((cell) => {
          if (cell.type === 'empty') {
            return <div key={cell.id} aria-hidden="true" />;
          }

          const isSelected = selectedDate === cell.dateString;
          const isDisabled = cell.isPast || cell.isClosed;

          return (
            <button
              key={cell.dateString}
              type="button"
              disabled={isDisabled}
              onClick={() => onDateSelect(cell.dateString)}
              aria-label={`${cell.day} ${monthName}`}
              aria-pressed={isSelected}
              title={
                cell.isClosed
                  ? 'The studio is closed on Sundays and Mondays'
                  : cell.isPast
                    ? 'Past dates cannot be booked'
                    : `Select ${cell.day} ${monthName}`
              }
              className={`mx-auto flex h-9 w-9 items-center justify-center text-sm transition sm:h-10 sm:w-10 ${
                isSelected
                  ? 'bg-neutral-950 text-white'
                  : isDisabled
                    ? 'cursor-not-allowed text-neutral-300'
                    : 'cursor-pointer text-neutral-800 hover:bg-neutral-100'
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-neutral-500">
        The studio is open Tuesday to Saturday.
      </p>
    </section>
  );
}

export default AvailabilityCalendar;