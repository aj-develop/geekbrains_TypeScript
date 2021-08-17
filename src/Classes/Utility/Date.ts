export function dateStringToUnixStamp(dateString : string) : number {
  return dateToUnixStamp(new Date(dateString))
}

export function dateToUnixStamp(date: Date) : number {
  return date.getTime() / 1000
}

export function convertStringToDate(dateString : string) :Date
{
  return new Date(dateString)
}
