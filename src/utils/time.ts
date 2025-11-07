import { DateTime } from "luxon";

/**
 * Helper function to create DateTime from various input types
 * @param time - Date object, timestamp number, date string, or undefined
 * @param timezone - Target timezone
 * @returns DateTime object in the specified timezone
 */
function datetime(time?: Date | number | string, timezone: string = Time.defaultTimezone): DateTime {
	if (time === undefined) {
		return DateTime.now().setZone(timezone);
	} else if (typeof time === "number") {
		return DateTime.fromMillis(time).setZone(timezone);
	} else if (time instanceof Date) {
		return DateTime.fromJSDate(time).setZone(timezone);
	} else {
		return DateTime.fromJSDate(new Date(time)).setZone(timezone);
	}
}

/**
 * Main Time function - formats a date/time with timezone support
 * @param time - Date object, timestamp number, date string, or undefined (defaults to current time)
 * @param timezone - Timezone string (defaults to configured default timezone)
 * @returns Formatted date-time string in "yyyy/MM/dd-HH:mm:ss" format
 */
function Time(time?: Date | number | string, timezone: string = Time.defaultTimezone): string {
	return datetime(time, timezone).toFormat("yyyy/MM/dd-HH:mm:ss");
}

// Time namespace containing various date/time formatting and manipulation utilities
namespace Time {
	// Default timezone from environment configuration
	export const defaultTimezone = import.meta.env.PUBLIC_TIMEZONE;
	// User's local timezone detected from browser/system
	export const userTimezone = DateTime.local().zoneName;

	/**
	 * Format date only (without time) in yyyy/MM/dd format
	 * @param time - Date object, timestamp number, date string, or undefined (defaults to current time)
	 * @param timezone - Timezone string (defaults to configured default timezone)
	 * @returns Formatted date string in "yyyy/MM/dd" format
	 */
	export function date(time?: Date | number | string, timezone: string = defaultTimezone): string {
		return datetime(time, timezone).toFormat("yyyy/MM/dd");
	}

	// Nested namespace for date-specific formatting functions
	export namespace date {
		/**
		 * Format date in localized format based on user's locale
		 * @param time - Date object, timestamp number, date string, or undefined (defaults to current time)
		 * @param locale - Locale string (defaults to browser's navigator.language)
		 * @param timezone - Timezone string (defaults to configured default timezone)
		 * @returns Localized date string in medium format (e.g., "Jan 15, 2024")
		 */
		export function locale(time?: Date | number | string, locale: string = navigator.language, timezone: string = defaultTimezone): string {
			return datetime(time, timezone).setLocale(locale).toLocaleString(DateTime.DATE_MED);
		}

		/**
		 * Format date for HTML input elements (date picker compatible)
		 * @param time - Date object, timestamp number, date string, or undefined (defaults to current time)
		 * @param timezone - Timezone string (defaults to configured default timezone)
		 * @returns Date string in "yyyy-MM-dd" format (HTML5 date input format)
		 */
		export function input(time?: Date | number | string, timezone: string = defaultTimezone): string {
			return datetime(time, timezone).toFormat("yyyy-MM-dd");
		}
	}

	/**
	 * Format time only (without date) in HH:mm:ss format
	 * @param time - Date object, timestamp number, date string, or undefined (defaults to current time)
	 * @param timezone - Timezone string (defaults to configured default timezone)
	 * @returns Formatted time string in "HH:mm:ss" format
	 */
	export function time(time?: Date | number | string, timezone: string = defaultTimezone): string {
		return datetime(time, timezone).toFormat("HH:mm:ss");
	}

	/**
	 * Format full date-time with timezone information
	 * @param time - Date object, timestamp number, date string, or undefined (defaults to current time)
	 * @param timezone - Timezone string (defaults to configured default timezone)
	 * @returns Formatted date-time string with timezone offset (e.g., "2024/01/15-14:30:00 UTC+09:00")
	 */
	export function full(time?: Date | number | string, timezone: string = defaultTimezone): string {
		return datetime(time, timezone).toFormat("yyyy/MM/dd-HH:mm:ss 'UTC'ZZ");
	}

	/**
	 * Format date-time in localized format based on user's locale
	 * @param time - Date object, timestamp number, date string, or undefined (defaults to current time)
	 * @param locale - Locale string (defaults to browser's navigator.language)
	 * @param timezone - Timezone string (defaults to configured default timezone)
	 * @returns Localized date-time string in medium format
	 */
	export function locale(time?: Date | number | string, locale: string = navigator.language, timezone: string = defaultTimezone): string {
		return datetime(time, timezone).setLocale(locale).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
	}

	/**
	 * Get the day of the week for a given date in the specified timezone
	 * @param date - The date to get the weekday for
	 * @param timezone - Timezone string (defaults to configured default timezone)
	 * @returns Day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
	 */
	export function weekday(date: Date, timezone: string = defaultTimezone): number {
		return DateTime.fromJSDate(date).setZone(timezone).weekday % 7;
	}

	/**
	 * Add specified number of days to a date
	 * @param date - Base date to add days to
	 * @param days - Number of days to add (can be negative to subtract)
	 * @param timezone - Timezone for calculation (defaults to configured default timezone)
	 * @returns New Date object with added days
	 */
	export function addDays(date: Date, days: number): Date {
		return DateTime.fromJSDate(date).plus({ days }).toJSDate();
	}

	/**
	 * Subtract specified number of days from a date
	 * @param date - Base date to subtract days from
	 * @param days - Number of days to subtract (positive number)
	 * @param timezone - Timezone for calculation (defaults to configured default timezone)
	 * @returns New Date object with subtracted days
	 */
	export function subtractDays(date: Date, days: number): Date {
		return DateTime.fromJSDate(date).minus({ days }).toJSDate();
	}

	/**
	 * Calculate the difference in days between two dates
	 * @param date1 - First date (minuend)
	 * @param date2 - Second date (subtrahend)
	 * @param timezone - Timezone for calculation (defaults to configured default timezone)
	 * @returns Number of days difference (positive if date1 is later than date2)
	 */
	export function diffDays(date1: Date, date2: Date, timezone: string = defaultTimezone): number {
		const day1 = DateTime.fromJSDate(date1).setZone(timezone).startOf("day");
		const day2 = DateTime.fromJSDate(date2).setZone(timezone).startOf("day");

		return Math.floor(day1.diff(day2, "days").days);
	}
}

export default Time;
