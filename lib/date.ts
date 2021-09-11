import { DateTime } from 'luxon'

export function ConvertToLocalDate(date) {
    return DateTime.fromISO(date).setLocale('id').toLocaleString(DateTime.DATE_FULL)
}

export function ConvertToISO(date) {
    return DateTime.fromJSDate(date).toISO()
}