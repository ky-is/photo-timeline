/* globals CMS, exifr */

async function updatePhotoMetadataIfNeededFor({ entry }) {
	// console.log(entry) //SAMPLE

	if (entry.collection === 'person') {
		const birthDate = entry.data.date_birth
		if (birthDate) {
			entry.data.date_birth = new Date(birthDate).toISOString().split('T')[0] + 'T00:00:00'
		}
	} else if (entry.collection === 'photo') {
		const data = entry.data
		const originalDateString = data.date ? new Date(data.date).toISOString() : null
		let newDateString = originalDateString
		let dataLocationString = data.location
		const needsDate = !originalDateString
		const needsLocation = !dataLocationString
		const imagePath = data.image
		const mediaFiles = entry.mediaFiles
		for (const mediaFile of mediaFiles) {
			if (mediaFile.path.replace('site/public/', '/') === imagePath) {
				const response = await fetch(mediaFile.url)
				const imageBuffer = await response.blob()
				const exif = await exifr.parse(imageBuffer)
				if (needsDate) {
					const exifDate = exif.DateTimeOriginal || exif.CreateDate
					if (exifDate) {
						newDateString = new Date(exifDate).toISOString()
					}
				}
				if (needsLocation && exif.longitude) {
					dataLocationString = JSON.stringify({ type: 'Point', coordinates: [exif.longitude, exif.latitude] })
				}
				break
			}
		}
		if (newDateString !== originalDateString && entry.newRecord) {
			const resultDateString = window.prompt('Found a new date from the photo metadata. Modify if needed, and press OK. Press Cancel to ignore.', newDateString)
			newDateString = originalDateString
			if (resultDateString) {
				const resultDate = new Date(resultDateString)
				if (resultDate) {
					newDateString = resultDate.toISOString()
				}
			}
		}
		entry.data.date = newDateString
		entry.data.location = dataLocationString
	}

	return entry.data
}

CMS.registerEventListener({
	name: 'preSave',
	handler: updatePhotoMetadataIfNeededFor,
})
