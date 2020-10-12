const http = require('../utils/http'),
	[Photo] = [require('./Photo')];

class User {
	#links;
	constructor(user) {
		this.id = user.id;
		this.lastUpdated = user.updated_at;
		this.username = user.username;
		this.name = user.name;
		this.firstName = user.first_name;
		this.lastName = user.last_name;
		this.twitter = user.twitter_username;
		this.portfolioUrl = user.portfolio_url;
		this.bio = user.bio;
		this.location = user.location;
		this.#links = user.links;
		this.profileImage = new ProfileImage(user.profile_image);
		this.instagram = user.instagram_username;
		this.collections = user.total_collections;
		this.likes = user.total_likes;
		this.photosCount = user.total_photos;
		this.acceptedTos = user.accepted_tos;
		this.isFollowing = user.followed_by_user;
		this.tags = user.tags;
		this.followers = user.followers_count;
		this.following = user.following_count;
		this.allowsMessages = user.allowsMessages;
		this.downloads = user.downloads;
		this.meta = user.meta;
	}

	async getPhotos() {
		const photos = await http.get(this.#links.photos);
		console.log(photos[0])
		return photos.map(p => new Photo(p));
	}

	async getLikes() {
		const likes = await http.get(this.#links.likes);
		return likes.map(l => new Photo(l));
	}

	async getFollowing() {
		const following = await http.get(this.#links.following);
		return following
	}

	async getFollowers() {
		const followers = await http.get(this.#links.followers);
		return followers
	}

	async getCollections() {
		const collections = await http.get(`/users/${this.username}/collections`);
		return collections
	}

	async getStatistics() {
		const statistics = await http.get(`/users/${this.username}/statistics`);
		return statistics
	}
}

class ProfileImage {
	constructor(images) {
		this.smallLink = images.small;
		this.mediumLink = images.medium;
		this.largeLink = images.large;
	}

	#getImage = (url) => http.request(url).raw();

	async getSmallImage() {
		return await this.#getImage(this.smallLink);
	}

	async getMediumImage() {
		return await this.#getImage(this.mediumLink);
	}

	async getLargeImage() {
		return await this.#getImage(this.largeLink);
	}
}

module.exports = User;