export const TESTING = process.env.NODE_ENV === 'development'

export const baseURL = TESTING ? 'https://photo-timeline.netlify.app' : ''
