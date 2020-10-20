const http = require('./utils/http'),
	{ User, Photo, Collection, Topic, UnsplashStatistics, UserSearchResult, PhotoSearchResult, CollectionSearchResult } = require('./models');

class Unsplash {
	#http;
	constructor(accessKey) {
		this.#http = http;
		this.#http.setAuth(accessKey);
	}

	async getUser(username) {
		const user = await this.#http.get(`/users/${username}`);
		return new User(user);
	}

	async searchUsers(opts = {}) {
		const search = await this.#http.get(`/search/users?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return new UserSearchResult(search);
	}

	async getPhotos(opts = { page: 1, perPage: 10, orderBy: 'latest' }) {
		const photos = await this.#http.get(`/photos?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return photos.map(p => new Photo(p));
	}

	async getPhoto(id) {
		const photo = await this.#http.get(`/photos/${id}`);
		return new Photo(photo);
	}

	async searchPhotos(opts = {}) {
		const search = await this.#http.get(`/search/photos?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return new PhotoSearchResult(search);
	}

	async getCollections(opts = { page: 1, perPage: 10 }) {
		const collections = await this.#http.get(`/collections?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return collections.map(p => new Collection(p));
	}

	async getCollection(id) {
		const collection = await this.#http.get(`/collections/${id}`);
		return new Collection(collection);
	}

	async searchCollections(opts = {}) {
		const search = await this.#http.get(`/search/collections?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return new CollectionSearchResult(search);
	}

	async getRandomPhoto(opts = {}) {
		const res = await this.#http.get(`/photos/random?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return Array.isArray(res) ? res.map(p => new Photo(p)) : new Photo(res);
	}

	async getTopics(opts = { page: 1, perPage: 10, orderBy: 'position' }) {
		const topics = await this.#http.get(`/topics?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return topics.map(t => new Topic(t));
	}

	async getTopic(slugOrId) {
		const topic = await this.#http.get(`/topics/${slugOrId}`);
		return new Topic(topic);
	}

	async getStatistics(monthly = false) {
		const stats = await this.#http.get(`/stats/${monthly ? 'month' : 'total'}`);
		return new UnsplashStatistics(stats);
	}

	get requestsRemaining() {
		return this.#http.ratelimit.remaining;
	}
}

module.exports = Unsplash;