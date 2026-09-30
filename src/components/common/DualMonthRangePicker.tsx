import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

export interface DateRangeValue {
  startDate: Date;
  endDate: Date;
  presetId?: string;
  label?: string;
}

interface DualMonthRangePickerProps {
  value: DateRangeValue;
  onChange: (newValue: DateRangeValue) => void;
  onClose?: () => void;
  className?: string;
}

const PRESETS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'this_week', label: 'This week' },
  { id: 'last_1_week', label: 'Last 1 week' },
  { id: 'last_2_weeks', label: 'Last 2 weeks' },
  { id: 'this_month', label: 'This month' },
  { id: 'last_1_month', label: '1 bulan terakhir' }
];

export const DualMonthRangePicker: React.FC<DualMonthRangePickerProps> = ({
  value,
  onChange,
  onClose,
  className = ''
}) => {
  // Base month navigation state (left calendar month)
  // Default to September 2026 based on the provided screenshot
  const initialYear = value.startDate.getFullYear() || 2026;
  const initialMonth = value.startDate.getMonth(); // 0-indexed (8 = September)

  const [leftMonthDate, setLeftMonthDate] = useState<Date>(
    new Date(initialYear, initialMonth, 1)
  );

  // Range selection intermediate state
  const [rangeStart, setRangeStart] = useState<Date | null>(value.startDate);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(value.endDate);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [activePreset, setActivePreset] = useState<string>(value.presetId || 'this_month');

  // Month navigation helpers
  const prevMonth = () => {
    setLeftMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setLeftMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Right month is always left month + 1
  const rightMonthDate = new Date(leftMonthDate.getFullYear(), leftMonthDate.getMonth() + 1, 1);

  // Format month and year label (e.g., "Sep 2026")
  const formatMonthHeader = (date: Date) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.getMonth()]}  ${date.getFullYear()}`;
  };

  // Preset calculation
  const handleSelectPreset = (presetId: string) => {
    setActivePreset(presetId);
    // Base reference date (September 2026)
    const ref = new Date(2026, 8, 30); // 30 Sep 2026
    let start = new Date(ref);
    let end = new Date(ref);
    let label = 'Custom';

    switch (presetId) {
      case 'today':
        start = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
        end = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
        label = 'Today';
        break;
      case 'yesterday':
        start = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - 1);
        end = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - 1);
        label = 'Yesterday';
        break;
      case 'this_week':
        // Monday to Sunday of current week
        const dayOfWeek = (ref.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
        start = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - dayOfWeek);
        end = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + (6 - dayOfWeek));
        label = 'This week';
        break;
      case 'last_1_week':
        start = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - 7);
        end = new Date(ref);
        label = 'Last 1 week';
        break;
      case 'last_2_weeks':
        start = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - 14);
        end = new Date(ref);
        label = 'Last 2 weeks';
        break;
      case 'this_month':
        start = new Date(2026, 8, 1);
        end = new Date(2026, 8, 30);
        label = 'This month';
        break;
      case 'last_1_month':
        start = new Date(2026, 7, 31);
        end = new Date(2026, 8, 30);
        label = '1 bulan terakhir';
        break;
    }

    setRangeStart(start);
    setRangeEnd(end);
    setLeftMonthDate(new Date(start.getFullYear(), start.getMonth(), 1));
    onChange({
      startDate: start,
      endDate: end,
      presetId,
      label
    });
  };

  // Day grid generator (Monday to Sunday)
  const getMonthDays = (year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Day of week: 0 = Sunday, 1 = Monday ... 6 = Saturday
    // We want 0 = Monday, 6 = Sunday
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days: { date: Date; isCurrentMonth: boolean; dayNumber: number }[] = [];

    // Leading days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date: d, isCurrentMonth: false, dayNumber: d.getDate() });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true, dayNumber: i });
    }

    // Trailing days from next month to complete 5 or 6 rows (multiple of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    const targetLength = days.length + remaining < 35 ? 35 : days.length + remaining;
    const nextDaysNeeded = targetLength - days.length;
    for (let i = 1; i <= nextDaysNeeded; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false, dayNumber: i });
    }

    return days;
  };

  // Comparison helper
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const isBetween = (d: Date, start: Date, end: Date) => {
    const t = d.getTime();
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return t >= s && t <= e;
  };

  const handleDayClick = (dayDate: Date) => {
    setActivePreset('custom');
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(dayDate);
      setRangeEnd(null);
    } else if (rangeStart && !rangeEnd) {
      if (dayDate.getTime() < rangeStart.getTime()) {
        setRangeStart(dayDate);
        setRangeEnd(rangeStart);
        onChange({
          startDate: dayDate,
          endDate: rangeStart,
          presetId: 'custom',
          label: `${dayDate.getDate()}/${dayDate.getMonth() + 1} - ${rangeStart.getDate()}/${rangeStart.getMonth() + 1}`
        });
      } else {
        setRangeEnd(dayDate);
        onChange({
          startDate: rangeStart,
          endDate: dayDate,
          presetId: 'custom',
          label: `${rangeStart.getDate()}/${rangeStart.getMonth() + 1} - ${dayDate.getDate()}/${dayDate.getMonth() + 1}`
        });
      }
    }
  };

  // Render month calendar helper
  const renderMonthCalendar = (monthDate: Date, onPrev?: () => void, onNext?: () => void) => {
    const days = getMonthDays(monthDate.getFullYear(), monthDate.getMonth());
    const weekHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    const effectiveEnd = rangeEnd || hoverDate;

    return (
      <div className="flex-1 min-w-[270px] px-3 py-2">
        {/* Month Header with Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onPrev || prevMonth}
            className="p-1.5 text-sky-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
            title="Bulan sebelumnya"
          >
            <span className="font-extrabold text-lg leading-none">&larr;</span>
          </button>

          <span className="font-bold text-slate-800 text-base tracking-tight">
            {formatMonthHeader(monthDate)}
          </span>

          <button
            type="button"
            onClick={onNext || nextMonth}
            className="p-1.5 text-sky-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
            title="Bulan berikutnya"
          >
            <span className="font-extrabold text-lg leading-none">&rarr;</span>
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-2 text-center">
          {weekHeaders.map((dh) => (
            <div key={dh} className="text-xs font-bold text-slate-800 py-1">
              {dh}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
          {days.map((item, idx) => {
            const isStart = rangeStart && isSameDay(item.date, rangeStart);
            const isEnd = rangeEnd && isSameDay(item.date, rangeEnd);
            const inRange = rangeStart && effectiveEnd && (
              (rangeStart.getTime() <= effectiveEnd.getTime() && isBetween(item.date, rangeStart, effectiveEnd)) ||
              (rangeStart.getTime() > effectiveEnd.getTime() && isBetween(item.date, effectiveEnd, rangeStart))
            );

            // Light cyan/blue span in screenshot: #bde4f4
            let bgClass = '';
            let textClass = item.isCurrentMonth ? 'text-slate-800' : 'text-slate-400 font-normal';
            let roundedClass = '';

            if (isStart && isEnd) {
              bgClass = 'bg-[#0095d9] text-white font-bold rounded-full';
            } else if (isStart) {
              bgClass = 'bg-[#0095d9] text-white font-bold rounded-full';
            } else if (isEnd) {
              bgClass = 'bg-[#0095d9] text-white font-bold rounded-full';
            } else if (inRange) {
              bgClass = 'bg-[#bde4f4] text-slate-800 font-medium';
            }

            return (
              <div
                key={idx}
                className={`relative h-9 flex items-center justify-center cursor-pointer transition-colors ${
                  inRange && !isStart && !isEnd ? 'bg-[#bde4f4]' : ''
                } ${isStart && effectiveEnd && effectiveEnd > rangeStart ? 'rounded-l-full' : ''} ${
                  isEnd && rangeStart && effectiveEnd && rangeStart < effectiveEnd ? 'rounded-r-full' : ''
                }`}
                onClick={() => handleDayClick(item.date)}
                onMouseEnter={() => rangeStart && !rangeEnd && setHoverDate(item.date)}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center text-xs sm:text-sm transition-all ${
                    (isStart || isEnd)
                      ? 'bg-[#0095d9] text-white font-bold rounded-full shadow-xs'
                      : textClass
                  }`}
                >
                  {item.dayNumber}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden select-none flex flex-col md:flex-row text-slate-700 animate-in fade-in duration-150 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. LEFT SIDEBAR: Presets list */}
      <div className="w-full md:w-44 bg-white border-b md:border-b-0 md:border-r border-slate-100 p-3 sm:py-5 sm:px-4 flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar shrink-0">
        {PRESETS.map((preset) => {
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className={`text-left px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-[#00875a] md:text-sky-600 font-bold bg-sky-50/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* 2. RIGHT DUAL CALENDARS */}
      <div className="flex-1 p-3 sm:p-5 flex flex-col lg:flex-row items-start justify-center gap-2 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Left Month Calendar */}
        {renderMonthCalendar(leftMonthDate, prevMonth, () => setLeftMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)))}

        {/* Right Month Calendar */}
        {renderMonthCalendar(rightMonthDate, () => setLeftMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)), nextMonth)}
      </div>
    </div>
  );
};
