/** biome-ignore-all lint/suspicious/noShadowRestrictedNames: Local function namespace */

import { Temporal } from "temporal-polyfill";

/**
 * Get ZonedDateTime in specified timezone
 * @param time ISO string or Date object
 * @param userTimezone Whether to use user's local timezone
 * @returns ZonedDateTime object
 */
function Time(time?: string | Date, userTimezone: boolean = false) {
	if (time instanceof Date) time = time.toISOString();

	const instant = time ? Temporal.Instant.from(time) : Temporal.Now.instant();
	const timezone = userTimezone ? Temporal.Now.timeZoneId() : import.meta.env.PUBLIC_TIMEZONE || "UTC";

	return instant.toZonedDateTimeISO(timezone);
}

/**
 * Time utility functions
 */
namespace Time {
	/**
	 * Format date-time as "YYYY/MM/DD-HH:MM:SS"
	 * @param time ISO string or Date object
	 * @param userTimezone Whether to use user's local timezone
	 * @returns Formatted date-time string
	 */
	export function toString(time?: string | Date, userTimezone: boolean = false): string {
		const datetime = Time(time, userTimezone);
		return datetime.toString().replace(/-/g, "/").replace("T", "-").split("+")[0];
	}

	/**
	 * Format date-time in localized format based on user's locale
	 * @param time ISO string or Date object
	 * @param locale Locale string, defaults to browser's language setting
	 * @param userTimezone Whether to use user's local timezone
	 * @returns Localized date-time string
	 */
	export function toLocaleString(time?: string | Date, locale: string = navigator.language, userTimezone: boolean = false): string {
		const datetime = Time(time, userTimezone);
		return datetime.toLocaleString(locale, { dateStyle: "medium", timeStyle: "medium" });
	}

	/**
	 * Format date as "YYYY/MM/DD"
	 * @param time ISO string or Date object
	 * @param userTimezone Whether to use user's local timezone
	 * @returns Formatted date string
	 */
	export function toDateString(time?: string | Date, userTimezone: boolean = false): string {
		const date = Time(time, userTimezone).toPlainDate();
		return date.toString().replace(/-/g, "/");
	}

	/**
	 * Format date in localized format based on user's locale
	 * @param time ISO string or Date object
	 * @param locale Locale string, defaults to browser's language setting
	 * @param userTimezone Whether to use user's local timezone
	 * @returns Localized date string
	 */
	export function toLocaleDateString(time?: string | Date, locale: string = navigator.language, userTimezone: boolean = false): string {
		const date = Time(time, userTimezone).toPlainDate();
		return date.toLocaleString(locale, { year: "numeric", month: "short", day: "numeric" });
	}
}

export default Time;
