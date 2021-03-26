const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

function getCollectionMatterByFile(name) {
	const postDir = path.resolve(__dirname, `../${name}`)
	if (!fs.existsSync(postDir)) {
		return []
	}
	return fs
		.readdirSync(postDir)
		.map(file => {
			const filePath = path.join(postDir, file)
			const src = fs.readFileSync(filePath, 'utf-8')
			const { data } = matter(src)
			const href = `/${name}/${formatName(file)}`
			return { href, data }
		})
}

exports.getEvents = () => {
	return getCollectionMatterByFile('events')
		.map(({ href, data }) => {
			return {
				href,
				title: data.title,
				major: data.major,
				dateStart: formatDate(data.date_start, data.inexact_date),
				dateEnd: formatDate(data.date_end, data.inexact_date),
				additionalAttendees: data.subjects || [],
			}
		})
		.sort((a, b) => b.dateStart.time - a.dateStart.time)
}

exports.getPeople = () => {
	return getCollectionMatterByFile('people')
		.map(({ href, data }) => {
			return {
				href,
				name: data.name,
				nicknames: data.nicknames,
				dateBirth: formatDate(data.date_birth),
			}
		})
		.sort((a, b) => (b.dateBirth ? b.dateBirth.time : 0) - (a.dateBirth ? a.dateBirth.time : 0))
}

exports.getPhotos = () => {
	const events = getCollectionMatterByFile('events') //TODO dedup
	return getCollectionMatterByFile('photos')
		.map(({ href, data }) => {
			let date = data.date
			if (!date) {
				const photoEventObject = events.find(eventObject => eventObject.data.title === data.event)
				if (photoEventObject) {
					date = photoEventObject.data.date_start
				}
			}
			return {
				href,
				title: data.title,
				image: data.image,
				event: data.event,
				photographer: data.photographer,
				subjects: data.subjects,
				description: data.description,
				date: formatDate(date, data.inexact_date),
				location: formatLocation(data.location),
			}
		})
		.sort((a, b) => (b.date ? b.date.time : 0) - (a.date ? a.date.time : 0))
}

function formatLocation(locationString) {
	return locationString ? JSON.parse(locationString).coordinates : null
}

function formatName(fileName) {
	return fileName.replace(/\.md$/, '.html')
}

function formatDate(date, inexact) {
	if (!date) {
		return null
	}
	if (!(date instanceof Date)) {
		date = new Date(date)
	}
	date.setUTCHours(12)
	return {
		time: +date,
		year: date.getFullYear(),
		month: date.getMonth(),
		day: inexact ? date.getDate() : null,
		string: date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: !inexact ? 'numeric' : undefined,
		}),
	}
}
