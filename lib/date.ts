import { DateTime } from 'luxon'

export function ConvertToLocalDate(date) {
    return DateTime.fromJSDate(date).setLocale('id').toLocaleString(DateTime.DATE_FULL)
}