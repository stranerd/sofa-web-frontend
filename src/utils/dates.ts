export enum TIMES {
	minute = 60,
	hour = 60 * 60,
	day = 60 * 60 * 24,
	month = 60 * 60 * 24 * 30,
	year = 60 * 60 * 24 * 30 * 12,
}

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
export const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const getTwoDigits = (digit: number): string => digit.toString().padStart(2, '0')
const formatTimeAsDigits = (date: Date) => `${getTwoDigits(date.getHours())}:${getTwoDigits(date.getMinutes())}`
export const formatDateAsDigits = (date: Date, showYear = true) =>
	`${months[date.getMonth()]} ${getTwoDigits(date.getDate())}` + (showYear ? `, ${date.getFullYear()}` : '')

export const formatTime = (time: number, withoutTime = false) => {
	const date = new Date(time)
	const now = new Date()
	const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
	const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
	const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
	if (date >= tomorrow) return formatDateAsDigits(date)
	if (date > today) return withoutTime ? 'Today' : formatTimeAsDigits(date)
	else if (date > yesterday) return 'Yesterday'
	else if (date > lastWeek) return weekDays[date.getDay()]
	else if (date > oneYearAgo) return formatDateAsDigits(date, false)
	else return formatDateAsDigits(date)
}

export const getTimeFormatted = (timeInSecs: number) => {
	if (timeInSecs < TIMES.minute) return `${timeInSecs} sec${timeInSecs > 1 ? 's' : ''}`
	else if (timeInSecs < TIMES.hour) {
		const minutes = Math.floor(timeInSecs / TIMES.minute)
		return `${minutes} min${minutes > 1 ? 's' : ''}`
	} else if (timeInSecs < TIMES.day) {
		const hours = Math.floor(timeInSecs / TIMES.hour)
		return `${hours} hr${hours > 1 ? 's' : ''}`
	} else if (timeInSecs < TIMES.month) {
		const days = Math.floor(timeInSecs / TIMES.day)
		return `${days} day${days > 1 ? 's' : ''}`
	} else if (timeInSecs < TIMES.year) {
		const months = Math.floor(timeInSecs / TIMES.month)
		return `${months} mon${months > 1 ? 's' : ''}`
	}
	const year = Math.floor(timeInSecs / TIMES.year)
	return `${year} yr${year > 1 ? 's' : ''}`
}

export const getDigitalTime = (timeInSecs: number) => {
	const hours = Math.floor(timeInSecs / 3600)
	const minutes = Math.floor((timeInSecs % 3600) / 60)
	const seconds = Math.floor(timeInSecs % 60)
	const hr = hours ? `${getTwoDigits(hours)}:` : ''
	const rest = `${getTwoDigits(minutes)}:${getTwoDigits(seconds)}`
	return hr + rest
}

export const getDateString = (date: Date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(getTwoDigits).join('-')
export const getTimeString = (date: Date) => [date.getHours(), date.getMinutes()].map(getTwoDigits).join(':')
export const getDateTimeString = (date: Date) => `${getDateString(date)}T${getTimeString(date)}`
export const getMonthYear = (date: Date) => `${months[date.getMonth()]} ${date.getFullYear()}`
export const getStartOfMonth = (year: number, month: number) => new Date(year, month, 1)
export const getEndOfMonth = (year: number, month: number) => new Date(year, month + 1, 0)
export const getStartOfDay = (year: number, month: number, date: number) => new Date(year, month, date)
