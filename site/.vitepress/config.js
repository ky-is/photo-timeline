// @ts-check
const { getEvents, getPeople, getPhotos } = require('./getCollections')

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
	title: 'photo-timeline',
	description: 'A timeline of photos.',
	customData: {
		events: getEvents(),
		people: getPeople(),
		photos: getPhotos(),
	},
}
