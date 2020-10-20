const http = require('../utils/http');

class User {
	#links;
	constructor(user) {
		this.id = user.id;
		this.lastUpdated = new Date(user.updated_at);
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
		this.likes = user.total_likes;
		this.collectionsCount = user.total_collections;
		this.photosCount = user.total_photos;
		this.acceptedTos = user.accepted_tos;
		this.isFollowing = user.followed_by_user;
		if (user.badge)
			this.badge = user.badge;
		if (user.tags)
			this.tags = Object.fromEntries(Object.entries(user.tags).map(([k, v]) => [k, v.map(t => new Tag(t))]));
		this.followers = user.followers_count;
		this.following = user.following_count;
		this.allowsMessages = user.allowsMessages;
		this.downloads = user.downloads;
		this.meta = user.meta;
	}

	async getPhotos(opts = { page: 1, perPage: 10, orderBy: 'latest' }) {
		const photos = await http.get(`${this.#links.photos}?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return photos.map(p => new Photo(p));
	}

	async getLikes(opts = { page: 1, perPage: 10, orderBy: 'latest' }) {
		const likes = await http.get(`${this.#links.likes}?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return likes.map(l => new Photo(l));
	}

	async getFollowing(opts = { page: 1, perPage: 10 }) {
		const following = await http.get(`${this.#links.following}?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return following.map(f => new PartialUser(f));
	}

	async getFollowers(opts = { page: 1, perPage: 10 }) {
		const followers = await http.get(`${this.#links.followers}?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return followers.map(f => new PartialUser(f));
	}

	async getCollections(opts = { page: 1, perPage: 10 }) {
		const collections = await http.get(`/users/${this.username}/collections?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return collections.map(col => new Collection(col));
	}

	async getStatistics(opts = { resolution: 'days', quantity: 30 }) {
		const statistics = await http.get(`/users/${this.username}/statistics?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return new Statistics(statistics);
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

class PartialUser {
	#links;
	constructor(user) {
		this.id = user.id;
		this.lastUpdated = new Date(user.updated_at);
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
		this.likes = user.total_likes;
		this.collectionsCount = user.total_collections;
		this.photosCount = user.total_photos;
		this.acceptedTos = user.accepted_tos;
		this.isFollowing = user.followed_by_user;
	}

	async getPhotos(opts = { page: 1, perPage: 10, orderBy: 'latest' }) {
		const photos = await http.get(`${this.#links.photos}?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return photos.map(p => new Photo(p));
	}

	async getLikes(opts = { page: 1, perPage: 10, orderBy: 'latest' }) {
		const likes = await http.get(`${this.#links.likes}?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return likes.map(l => new Photo(l));
	}

	async getFollowing(opts = { page: 1, perPage: 10 }) {
		const following = await http.get(`${this.#links.following}?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return following.map(f => new PartialUser(f));
	}

	async getFollowers(opts = { page: 1, perPage: 10 }) {
		const followers = await http.get(`${this.#links.followers}?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return followers.map(f => new PartialUser(f));
	}

	async getCollections(opts = { page: 1, perPage: 10 }) {
		const collections = await http.get(`/users/${this.username}/collections?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return collections.map(col => new Collection(col));
	}

	async getStatistics(opts = { resolution: 'days', quantity: 30 }) {
		const statistics = await http.get(`/users/${this.username}/statistics?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return new Statistics(statistics);
	}

	async load() {
		return this.loadedUser ?? (this.loadedUser = new User(await http.get(`/users/${this.username}`)));
	}
}

class Photo {
	constructor(photo) {
		this.id = photo.id;
		this.created = new Date(photo.created_at);
		this.lastUpdated = new Date(photo.updated_at);
		if (photo.promoted_at) 
			this.promoted = new Date(photo.promoted_at);
		if (photo.tags)
			this.tags = photo.tags.map(t => new Tag(t));
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
	
	async getStatistics(opts = { quantity: 30, resolution: 'days' }) {
		const statistics = await http.get(`/photos/${this.id}/statistics?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return new Statistics(statistics);
	}

	async getUser() {
		const user = await http.get(`/users/${this.username}`);
		return new User(user);
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
	constructor(urls, links = {}) {
		this.rawLink = urls.raw;
		this.fullLink = urls.full;
		this.regularLink = urls.regular;
		this.smallLink = urls.small;
		this.thumbLink = urls.thumb;
		this.htmlLink = links.html;
		this.downloadLink = links.download;
	}

	getCustomLink(opts = {}) {
		return `${this.rawLink}${Object.entries(opts).map(([k, v]) => `&${k}=${v}`).join('')}`
	}

	#getImage = (url) => http.request(url).raw();

	async getCustomImage(opts = {}) {
		return await this.#getImage(this.getCustomLink(opts));
	}

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
		if (this.downloadLink)
			await http.get(this.downloadLink);
	}
}

class Collection {
	#links;
	constructor(col) {
		this.id = col.id;
		this.title = col.title;
		this.description = col.description;
		this.published = new Date(col.published_at);
		this.lastCollected = new Date(col.last_collected_at);
		this.lastUpdated = new Date(col.last_updated_at);
		this.curated = col.curated;
		this.featured = col.featured;
		this.photoCount = col.total_photos;
		this.private = col.private;
		this.shareKey = col.shareKey;
		this.tags = col.tags.map(t => new Tag(t));
		this.#links = col.links;
		this.username = col.user.username;
		this.coverPhoto = new Photo(col.cover_photo);
		this.previewPhotos = col.preview_photos.map(p => new PreviewPhoto(p));
	}

	async getPhotos(opts = { page: 1, perPage: 10 }) {
		const photos = await http.get(`${this.#links.photos}?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return photos.map(p => new Photo(p));
	}

	async getRelatedCollections() {
		const collections = await http.get(this.#links.related);
		return collections.map(c => new Collection(c));
	}
}

class PreviewPhoto {
	constructor(photo) {
		this.id = photo.id;
		this.created = new Date(photo.created_at);
		this.lastUpdated = new Date(photo.updated_at);
		this.links = new PhotoLinks(photo.urls);
	}

	async load() {
		return this.loadedPhoto ?? (this.loadedPhoto = new Photo(await http.get(`/photos/${this.id}`)));
	}
}

class Statistics {
	constructor(stats) {
		this.id = stats.id;
		if (stats.username)
			this.username = stats.username;
		this.downloads = stats.downloads;
		this.views = stats.views;
		this.likes = stats.likes;
	}
}

class UnsplashStatistics extends Statistics{
	constructor(stats) {
		super(stats);
		this.photoCount = stats.photos || stats.new_photos;
		this.photographers = stats.photographers || stats.new_photographers;
		this.pixels = stats.pixels || stats.new_pixels;
		if (stats.downloads_per_second) 
			this.downloadsPerSecond = stats.downloads_per_second;
		if (stats.views_per_second)
			this.viewsPerSecond = stats.views_per_second;
		this.developers = stats.developers || stats.new_developers;
		this.applications = stats.applications || stats.new_applications;
		this.requests = stats.requests || stats.new_requests;
	}
}

class Topic {
	#links;
	constructor(topic) {
		this.id = topic.id;
		this.slug = topic.slug;
		this.title = topic.title;
		this.description = topic.description;
		this.published = new Date(topic.published_at);
		this.lastUpdated = new Date(topic.published_at);
		this.startDate = new Date(topic.starts_at);
		if (topic.ends_at) 
			this.endDate = new Date(topic.ends_at);
		this.featured = topic.featured;
		this.photoCount = topic.total_photos;
		this.#links = topic.links;
		this.status = topic.status;
		this.owners = topic.owners.map(u => new PartialUser(u));
		this.currentUserContributions = topic.current_user_contributions;
		this.coverPhoto = new Photo(topic.cover_photo);
		this.previewPhotos = topic.preview_photos.map(p => new PreviewPhoto(p));
	}

	async getPhotos(opts = { page: 1, perPage: 10, orderBy: 'latest' }) {
		const photos = await http.get(`${this.#links.photos}?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return photos.map(p => new Photo(p));
	}
}

class Tag {
	constructor(tag) {
		this.title = tag.title;
		this.type = tag.type;
		if (this.type === 'landing_page')
			this.source = new TagSource(tag.source);
	}
}

class TagSource {
	constructor(source) {
		this.ancestry = Object.fromEntries(Object.entries(source.ancestry).map(([k, v]) => [k, { slug: v.slug, prettySlug: v.pretty_slug }]));
		this.title = source.title;
		this.subtitle = source.subtitle;
		this.description = source.description;
		this.metaTitle = source.meta_title;
		this.metaDescription = source.meta_description;
		this.coverPhoto = new Photo(source.cover_photo);
	}
}

class SearchResult {
	constructor(search) {
		this.count = search.total;
		this.pageCount = search.total_pages;
	}
}

class PhotoSearchResult extends SearchResult {
	constructor(search){
		super(search);
		this.photos = search.results.map(p => new SearchPhoto(p));
	}
}

class SearchPhoto {
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
		this.user = new PartialUser(photo.user);
	}

	async getStatistics(opts = { quantity: 30, resolution: 'days' }) {
		const statistics = await http.get(`/photos/${this.id}/statistics?${Object.entries(opts).map(([k, v]) => `${k}=${v}`).join('&')}`);
		return new Statistics(statistics);
	}

	async getUser() {
		const user = await http.get(`/users/${this.username}`);
		return new User(user);
	}

	async load() {
		return this.loadedPhoto ?? (this.loadedPhoto = new Photo(await http.get(`/photos/${this.id}`)));
	}
}

class CollectionSearchResult extends SearchResult {
	constructor(search){
		super(search);
		this.collections = search.results.map(c => new SearchCollection(c));
	}
}

class SearchCollection {
	#links;
	constructor(col) {
		this.id = col.id;
		this.title = col.title;
		this.description = col.description;
		this.published = new Date(col.published_at);
		this.lastCollected = new Date(col.last_collected_at);
		this.lastUpdated = new Date(col.last_updated_at);
		this.featured = col.featured;
		this.photoCount = col.total_photos;
		this.private = col.private;
		this.shareKey = col.shareKey;
		this.#links = col.links;
		this.username = col.user.username;
		this.coverPhoto = new Photo(col.cover_photo);
	}

	async getPhotos() {
		const photos = await http.get(this.#links.photos);
		return photos.map(p => new Photo(p));
	}

	async getRelatedCollections() {
		const collections = await http.get(this.#links.related);
		return collections.map(c => new Collection(c));
	}

	async load() {
		return this.loadedCollection ?? (this.loadedCollection = new Collection(await http.get(`/collections/${this.id}`)));
	}
}

class UserSearchResult extends SearchResult {
	constructor(search){
		super(search);
		this.users = search.results.map(u => new PartialUser(u));
	}
}

module.exports = { 
	User, 
	Photo, 
	Collection, 
	Statistics, 
	Topic, 
	UnsplashStatistics, 
	PhotoSearchResult, 
	CollectionSearchResult, 
	UserSearchResult,
	PartialUser
};