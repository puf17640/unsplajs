const http = require('./utils/http'),
	{ User, Photo, Collection, Topic, UnsplashStatistics } = require('./models');

class Unsplash {
	#http;
	constructor(accessKey) {
		this.#http = http;
		http.setAuth(accessKey);
	}

	async getUser(username) {
		const user = await this.#http.get(`/users/${username}`);
		return new User(user);
	}

	async getPhoto(id) {
		const photo = await this.#http.get(`/photos/${id}`);
		return new Photo(photo);
	}

	async getCollection(id) {
		const collection = await this.#http.get(`/collections/${id}`);
		return new Collection(collection);
	}

	async getRandomPhoto() {
		const photo = await this.#http.get('/photos/random');
		return new Photo(photo);
	}

	async getTopic(slugOrId) {
		const topic = await this.#http.get(`/topics/${slugOrId}`);
		return new Topic(topic);
	}

	async getTopics() {
		const topics = await this.#http.get('/topics');
		return topics.map(t => new Topic(t));
	}

	async getStatistics(monthly = false) {
		const stats = await this.#http.get(`/stats/${monthly ? 'month' : 'total'}`);
		return new UnsplashStatistics(stats);
	}
}

module.exports = Unsplash;