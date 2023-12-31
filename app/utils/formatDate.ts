import { Locale, format, parseISO } from "date-fns"
import I18n from "i18n-js"

import ar from "date-fns/locale/ar-SA"
import ko from "date-fns/locale/ko"
import en from "date-fns/locale/en-US"
import moment from "moment"

type Options = Parameters<typeof format>[2]

const getLocale = (): Locale => {
  const locale = I18n.currentLocale().split("-")[0]
  return locale === "ar" ? ar : locale === "ko" ? ko : en
}

export const formatDate = (date: string, dateFormat?: string, options?: Options) => {
  const locale = getLocale()
  const dateOptions = {
    ...options,
    locale,
  }
  return format(parseISO(date), dateFormat ?? "MMM dd, yyyy", dateOptions)
}

export const getTimeFromDateString = (datetimeString: string) => {
  const dateObject = parseISO(datetimeString)
  const timeString = format(dateObject, "h:mm a")
  return timeString
}

export const getFormattedDate = (datetimeString: string) => {
  const date = moment(datetimeString)
  const formattedDate = date.format("dddd D MMMM YYYY  HH:mm")
  return formattedDate
}
