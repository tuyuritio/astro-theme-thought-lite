import { DateTime } from "luxon";

/**
 * Helper function to create DateTime from various input types
 * @param time - Date object, timestamp number, or undefined
 * @param timezone - Target timezone
 * @returns DateTime object in the specified timezone
 */
function datetime(time?: Date | number, timezone: string = Time.default_timezone): DateTime {
	if (time === undefined) {
		return DateTime.now().setZone(timezone);
	} else if (typeof time === 'number') {
		return DateTime.fromMillis(time).setZone(timezone);
	} else if (time instanceof Date) {
		return DateTime.fromJSDate(time).setZone(timezone);
	} else {
		return DateTime.fromJSDate(new Date(time)).setZone(timezone);
	}
}

/**
 * Main Time function - formats a date/time with timezone support
 * @param time - Date object, timestamp number, or undefined (defaults to current time)
 * @param timezone - Timezone string (defaults to configured default timezone)
 * @returns Formatted date-time string in "yyyy/MM/dd-HH:mm:ss" format
 */
function Time(time?: Date | number, timezone: string = Time.default_timezone): string {
	return datetime(time, timezone).toFormat("yyyy/MM/dd-HH:mm:ss");
}

// Time namespace containing various date/time formatting and manipulation utilities
namespace Time {
	// Default timezone from environment configuration
	export const default_timezone = import.meta.env.PUBLIC_TIMEZONE;
	// User's local timezone detected from browser/system
	export const user_timezone = DateTime.local().zoneName;

	/**
	 * Get the day of the week for a given date in the specified timezone
	 * @param date - The date to get the weekday for
	 * @param timezone - Timezone string (defaults to configured default timezone)
	 * @returns Day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
	 */
	export function weekday(date: Date, timezone: string = default_timezone): number {
		return DateTime.fromJSDate(date).setZone(timezone).weekday % 7;
	}

	/**
	 * Format date only (without time) in yyyy/MM/dd format
	 * @param time - Date object, timestamp number, or undefined (defaults to current time)
	 * @param timezone - Timezone string (defaults to configured default timezone)
	 * @returns Formatted date string in "yyyy/MM/dd" format
	 */
	export function date(time?: Date | number, timezone: string = default_timezone): string {
		return datetime(time, timezone).toFormat("yyyy/MM/dd");
	}

	// Nested namespace for date-specific formatting functions
	export namespace date {
		/**
		 * Format date in localized format based on user's locale
		 * @param time - Date object, timestamp number, or undefined (defaults to current time)
		 * @param locale - Locale string (defaults to browser's navigator.language)
		 * @param timezone - Timezone string (defaults to configured default timezone)
		 * @returns Localized date string in medium format (e.g., "Jan 15, 2024")
		 */
		export function locale(time?: Date | number, locale: string = navigator.language, timezone: string = default_timezone): string {
			return datetime(time, timezone).setLocale(locale).toLocaleString(DateTime.DATE_MED);
		}

		/**
		 * Format date for HTML input elements (date picker compatible)
		 * @param time - Date object, timestamp number, or undefined (defaults to current time)
		 * @param timezone - Timezone string (defaults to configured default timezone)
		 * @returns Date string in "yyyy-MM-dd" format (HTML5 date input format)
		 */
		export function input(time?: Date | number, timezone: string = default_timezone): string {
			return datetime(time, timezone).toFormat("yyyy-MM-dd");
		}
	}

	/**
	 * Format time only (without date) in HH:mm:ss format
	 * @param time - Date object, timestamp number, or undefined (defaults to current time)
	 * @param timezone - Timezone string (defaults to configured default timezone)
	 * @returns Formatted time string in "HH:mm:ss" format
	 */
	export function time(time?: Date | number, timezone: string = default_timezone): string {
		return datetime(time, timezone).toFormat("HH:mm:ss");
	}

	/**
	 * Format full date-time with timezone information
	 * @param time - Date object, timestamp number, or undefined (defaults to current time)
	 * @param timezone - Timezone string (defaults to configured default timezone)
	 * @returns Formatted date-time string with timezone offset (e.g., "2024/01/15-14:30:00 UTC+09:00")
	 */
	export function full(time?: Date | number, timezone: string = default_timezone): string {
		return datetime(time, timezone).toFormat("yyyy/MM/dd-HH:mm:ss 'UTC'ZZ");
	}

	/**
	 * Format date-time in localized format based on user's locale
	 * @param time - Date object, timestamp number, or undefined (defaults to current time)
	 * @param locale - Locale string (defaults to browser's navigator.language)
	 * @param timezone - Timezone string (defaults to configured default timezone)
	 * @returns Localized date-time string in medium format
	 */
	export function locale(time?: Date | number, locale: string = navigator.language, timezone: string = default_timezone): string {
		return datetime(time, timezone).setLocale(locale).toLocaleString(DateTime.DATETIME_MED);
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
	 * @param date_1 - First date (minuend)
	 * @param date_2 - Second date (subtrahend)
	 * @param timezone - Timezone for calculation (defaults to configured default timezone)
	 * @returns Number of days difference (positive if date_1 is later than date_2)
	 */
	export function diffDays(date_1: Date, date_2: Date, timezone: string = default_timezone): number {
		const day_1 = DateTime.fromJSDate(date_1).setZone(timezone).startOf("day");
		const day_2 = DateTime.fromJSDate(date_2).setZone(timezone).startOf("day");

		return Math.floor(day_1.diff(day_2, "days").days);
	}
}

export default Time;
