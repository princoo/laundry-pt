import { HOTEL_TIMEZONE } from "@/lib/constants/timezone";

// Dates in the hotel's timezone, for everything that is a wall-clock fact
// rather than an instant: return deadlines, "delivered today", which day a
// request counts toward on a report, and the bounds of a date range someone
// picked in a date field.
//
// Nothing here reads the host's timezone. `new Date().getHours()` answers a
// question about the server, which on a UTC container is two hours behind the
// hotel- enough to turn a 7:00 p.m. promise into 9:00 p.m. and to file the
// first two hours of a Kigali evening under the previous day's revenue.
//
// The offset is derived from Intl for the instant in question rather than
// hardcoded at +02:00, so this stays correct if the constant is ever pointed at
// a timezone that observes DST. Rwanda does not, so today every path through
// here resolves to a flat two hours.

interface HotelParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

const PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: HOTEL_TIMEZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const pad = (value: number) => String(value).padStart(2, "0");

// What the hotel's clocks read at a given instant.
export function hotelParts(instant: Date): HotelParts {
  const parts = PARTS.formatToParts(instant);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  };
}

// How far ahead of UTC the hotel is at that instant, in milliseconds.
function offsetMs(instant: Date): number {
  const p = hotelParts(instant);
  return (
    Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) -
    instant.getTime()
  );
}

// The instant at which the hotel's clocks read the given wall time.
//
// Resolved twice because the offset has to be sampled at some instant, and the
// first sample is taken at the wrong one. The second pass corrects it- which
// only ever matters within an hour of a DST change, and never for Kigali.
// Out-of-range values normalise the way Date.UTC does, so `day + 1` on the last
// of the month rolls into the next month.
export function hotelWallTime(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): Date {
  const asIfUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  const firstPass = new Date(asIfUtc - offsetMs(new Date(asIfUtc)));
  return new Date(asIfUtc - offsetMs(firstPass));
}

// Midnight at the start of the hotel day containing `instant`.
export function startOfHotelDay(instant: Date = new Date()): Date {
  const p = hotelParts(instant);
  return hotelWallTime(p.year, p.month, p.day);
}

// A given hour of the hotel day containing `instant`- e.g. 19 for the 7:00 p.m.
// return deadline.
export function hotelDateAtHour(
  instant: Date,
  hour: number,
  dayOffset = 0,
): Date {
  const p = hotelParts(instant);
  return hotelWallTime(p.year, p.month, p.day + dayOffset, hour);
}

// 'YYYY-MM-DD' as the hotel would date it. The key reports group by.
export function hotelDateKey(instant: Date): string {
  const p = hotelParts(instant);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export function isSameHotelDay(a: Date, b: Date): boolean {
  return hotelDateKey(a) === hotelDateKey(b);
}

// The two ends of a 'YYYY-MM-DD' a person picked in a date field. They meant a
// day at the hotel, so the range has to start and end at the hotel's midnights
//- not the server's, and not UTC's.
export function parseHotelDayStart(date: string): Date | null {
  const parsed = splitDate(date);
  return (
    parsed && hotelWallTime(parsed.year, parsed.month, parsed.day, 0, 0, 0)
  );
}

export function parseHotelDayEnd(date: string): Date | null {
  const parsed = splitDate(date);
  if (!parsed) return null;
  // One millisecond before the next hotel midnight, so the range is inclusive
  // of the whole chosen day however long that day is.
  return new Date(
    hotelWallTime(parsed.year, parsed.month, parsed.day + 1).getTime() - 1,
  );
}

function splitDate(
  date: string,
): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!match) return null;
  const [, year, month, day] = match;
  return { year: Number(year), month: Number(month), day: Number(day) };
}
