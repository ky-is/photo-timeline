export const TESTING = process.env.NODE_ENV !== 'production'

export const baseURL = TESTING ? 'https://photo-timeline.netlify.app' : ''
