import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
})

// Module-level cache — lives for the browser session
const CACHE = new Map()

function cached(key, fetcher) {
  if (CACHE.has(key)) return Promise.resolve(CACHE.get(key))
  return fetcher().then((data) => { CACHE.set(key, data); return data })
}

const unwrap = (res) => res.data
const list = (res) => {
  const d = res.data
  return Array.isArray(d) ? d : d.results ?? []
}

export const getMemories    = () => cached('memories',    () => api.get('/memories/').then(list))
export const getCommits     = (type) => cached(`commits:${type||''}`, () => api.get('/commits/', { params: type ? { type } : {} }).then(list))
export const getMessages    = () => api.get('/messages/').then(list)
export const postMessage    = (data) => api.post('/messages/', data).then(unwrap)
export const getWishes      = () => api.get('/wishes/').then(list)
export const postWish       = (data) => api.post('/wishes/', data).then(unwrap)
export const getPins        = () => api.get('/pins/').then(list)
export const postPin        = (data) => api.post('/pins/', data).then(unwrap)
export const getJournal     = () => cached('journal',     () => api.get('/journal/').then(list))
export const getJournalEntry= (id) => api.get(`/journal/${id}/`).then(unwrap)
export const getScrapbook   = (cat) => api.get('/scrapbook/', { params: cat ? { category: cat } : {} }).then(list)
export const getRoadmap     = () => cached('roadmap',     () => api.get('/roadmap/').then(unwrap))
export const getStats       = () => cached('stats',       () => api.get('/stats/').then(unwrap))
