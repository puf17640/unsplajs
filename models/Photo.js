const http = require('../utils/http');

class Photo {
	constructor(photo) {
		this.id = photo.id;
		this.created = new Date(photo.created_at);
		this.lastUpdated = new Date(photo.updated_at);
		if (photo.promoted_at) 
			this.promoted = new Date(photo.promoted_at);
		this.width = photo.width;
		this.height = photo.height;
		this.color = photo.color;
		this.blurHash = photo.blur_hash;
		this.description = photo.description;
		this.alternateDescription = photo.alt_description;
		this.links = new PhotoLinks(photo.urls, photo.links);
		this.categories = photo.categories;
		this.likes = photo.likes;
		this.isLiked = photo.liked_by_user;
		this.currentCollections = photo.current_user_collections;
		if (photo.sponsorship)
			this.sponsorship = new Sponsorship(photo.sponsorship);
		this.username = photo.user.username;
	}
	
	async getStatistics() {
		const statistics = await http.get(`/photos/${this.id}/statistics`);
		return statistics
	}
}

class Sponsorship {
	constructor(sponsorship) {
		this.impressions = sponsorship.impression_urls;
		this.tagline = sponsorship.tagline;
		this.taglineUrl = sponsorship.tagline_url;
		this.sponsorUsername = sponsorship.sponsor.username;
	}
}

class PhotoLinks {
	constructor(urls, links) {
		this.rawLink = urls.raw;
		this.fullLink = urls.full;
		this.regularLink = urls.regular;
		this.smallLink = urls.small;
		this.thumbLink = urls.thumb;
		this.htmlLink = links.html;
		this.downloadLink = links.download;
	}

	#getImage = (url) => http.request(url).raw();

	async getRawImage() {
		return await this.#getImage(this.rawLink);
	}

	async getFullImage() {
		return await this.#getImage(this.fullLink);
	}

	async getSmallImage() {
		return await this.#getImage(this.smallLink);
	}

	async getRegularImage() {
		return await this.#getImage(this.regularLink);
	}

	async getThumbImage() {
		return await this.#getImage(this.thumbLink);
	}

	async triggerDownload() {
		return await this.#getImage(this.downloadLink);
	}
}

module.exports = Photo;