/* global CMS, exifr */

async function updatePhotoMetadataIfNeededFor({ entry }) {
	const collectionName = entry.get('collection')

	if (collectionName === 'person') {
		const birthDate = entry.get('data').get('date_birth')
		if (birthDate) {
			return entry.get('data').set('date_birth', birthDate.toISOString().split('T')[0] + 'T00:00:00')
		}
	}

	if (collectionName === 'photo') {
		const data = entry.get('data')
		const originalDateString = data.get('date') ? data.get('date').toISOString() : null
		let newDateString = originalDateString
		let dataLocationString = data.get('location')
		const needsDate = !originalDateString
		const needsLocation = !dataLocationString
		const imagePath = data.get('image')
		const mediaFiles = entry.get('mediaFiles')
		for (const mediaFile of mediaFiles) {
			if (mediaFile.get('path').replace('site/public/', '/') === imagePath) {
				const response = await fetch(mediaFile.get('url'))
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
		if (newDateString !== originalDateString && entry.get('newRecord')) {
			const resultDateString = window.prompt('Found a new date from the photo metadata. Modify if needed, and press OK. Press Cancel to ignore.', newDateString)
			newDateString = originalDateString
			if (resultDateString) {
				const resultDate = new Date(resultDateString)
				if (resultDate) {
					newDateString = resultDate.toISOString()
				}
			}
		}
		return entry.get('data').set('date', newDateString).set('location', dataLocationString)
	}

	return entry.get('data')
}

CMS.registerEventListener({
	name: 'preSave',
	handler: updatePhotoMetadataIfNeededFor,
})
