export interface DateData {
	time: number,
	year: number
	month: number
	day: number | null
	string: string
}

export interface CollectionData {
	href: string
}

export interface EventData extends CollectionData {
	title: string
	major: boolean
	dateStart: DateData
	dateEnd?: DateData
	additionalAttendees: string[]
}

export interface PersonData extends CollectionData {
	name: string
	nicknames: string[]
	dateBirth?: DateData
}

export interface PhotoData extends CollectionData {
	title: string
	image: string
	event?: string
	photographer?: string
	subjects: string[]
	date?: DateData
	location?: [number, number]
}
