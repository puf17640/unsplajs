const http = require('./utils/http'),
	{ User, Photo } = require('./models');

class Unsplash {
	constructor(accessKey) {
		this.http = http;
		http.setAuth(accessKey);
	}

	async getUser(username) {
		const user = await http.get(`/users/${username}`);
		return new User(user);
	}

	async getPhoto(id) {
		const photo = await http.get(`/photos/${id}`);
		return new Photo(photo);
	}

	async getRandomPhoto() {
		const photo = await http.get('/photos/random');
		return new Photo(photo);
	}

}

module.exports = Unsplash;