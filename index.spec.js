const Unsplash = require('./index'),
	{ User, Photo, Collection, Topic, UnsplashStatistics, PartialUser, Statistics, UserSearchResult,
		PhotoSearchResult, CollectionSearchResult } = require('./models'),
	{ describe, it } = require('mocha'),
	{ should } = require('chai');
const config = require('dotenv').config();

if(config.error || !process.env.ACCESS_KEY)
	return !console.log('An error occured while parsing .env file, please check if it has any problems and try again.') 
		&& process.exit(1);

let unsplash;

describe('General', () => {
	it('new Unsplash', (done) => {
		unsplash = new Unsplash(process.env.ACCESS_KEY);
		done();
	});

	it('getUser', async () => {
		const user = await unsplash.getUser('impatrickt');
		should().exist(user);
		console.log(unsplash.requestsRemaining)
		user.should.be.an.instanceof(User);
	});

	it('searchUsers', async () => {
		const search = await unsplash.searchUsers({ query: 'julian' });
		should().exist(search);
		search.should.be.an.instanceof(UserSearchResult);
	});

	it('getPhotos', async () => {
		const photos = await unsplash.getPhotos();
		should().exist(photos);
		photos.forEach(photo => photo.should.be.an.instanceof(Photo));
	});

	it('getPhoto', async () => {
		const photo = await unsplash.getPhoto('RnCPiXixooY');
		should().exist(photo);
		photo.should.be.an.instanceof(Photo);
	});

	it('searchPhotos', async () => {
		const search = await unsplash.searchPhotos({ query: 'nature' });
		should().exist(search);
		search.should.be.an.instanceof(PhotoSearchResult);
	});

	it('getCollections', async () => {
		const collections = await unsplash.getCollections();
		should().exist(collections);
		collections.forEach(collection => collection.should.be.an.instanceof(Collection));
	});

	it('getCollection', async () => {
		const collection = await unsplash.getCollection(51837822);
		should().exist(collection);
		collection.should.be.an.instanceof(Collection);
	});

	it('searchCollections', async () => {
		const search = await unsplash.searchCollections({ query: 'office' });
		should().exist(search);
		search.should.be.an.instanceof(CollectionSearchResult);
	});

	it('getRandomPhoto', async () => {
		const photo = await unsplash.getRandomPhoto();
		should().exist(photo);
		photo.should.be.an.instanceof(Photo);
	});
	
	it('getTopics', async () => {
		const topics = await unsplash.getTopics();
		should().exist(topics);
		topics.forEach(topic => topic.should.be.an.instanceof(Topic));
	});

	it('getTopic', async () => {
		const topic = await unsplash.getTopic('nature');
		should().exist(topic);
		topic.should.be.an.instanceof(Topic);
	});

	it('getStats (monthly)', async () => {
		const stats = await unsplash.getStatistics(true);
		should().exist(stats);
		stats.should.be.an.instanceof(UnsplashStatistics);
	});

	it('getStats (total)', async () => {
		const stats = await unsplash.getStatistics();
		should().exist(stats);
		stats.should.be.an.instanceof(UnsplashStatistics);
	});
});

describe('User', () => {
	let user;

	before(async () => {
		user = await unsplash.getUser('impatrickt');
		should().exist(user);
		user.should.be.an.instanceof(User);
	});

	it('getPhotos', async () => {
		const photos = await user.getPhotos();
		should().exist(photos);
		photos.forEach(photo => photo.should.be.an.instanceof(Photo));
	});

	it('getLikes', async () => {
		const likes = await user.getLikes();
		should().exist(likes);
		likes.forEach(like => like.should.be.an.instanceof(Photo));
	});

	it('getFollowing', async () => {
		const following = await user.getFollowing();
		should().exist(following);
		following.forEach(user => user.should.be.an.instanceof(PartialUser));
	});

	it('getFollowers', async () => {
		const followers = await user.getFollowers();
		should().exist(followers);
		followers.forEach(user => user.should.be.an.instanceof(PartialUser));
	});

	it('getCollections', async () => {
		const collections = await user.getCollections();
		should().exist(collections);
		collections.forEach(collection => collection.should.be.an.instanceof(Collection));
	});

	it('getStatistics', async () => {
		const statistics = await user.getStatistics();
		should().exist(statistics);
		statistics.should.be.an.instanceof(Statistics);
	});
});

describe('Photo', () => {
	let photo;

	before(async () => {
		photo = await unsplash.getPhoto('RnCPiXixooY');
		should().exist(photo);
		photo.should.be.an.instanceof(Photo);
	});

	it('getStatistics', async () => {
		const statistics = await photo.getStatistics();
		should().exist(statistics);
		statistics.should.be.an.instanceof(Statistics);
	});

	it('getUser', async () => {
		const user = await photo.getUser();
		should().exist(user);
		user.should.be.an.instanceof(User);
	});
});

describe('Collection', () => {
	let collection;

	before(async () => {
		collection = await unsplash.getCollection(51837822);
		should().exist(collection);
		collection.should.be.an.instanceof(Collection);
	});

	it('getPhotos', async () => {
		const photos = await collection.getPhotos();
		should().exist(photos);
		photos.forEach(photo => photo.should.be.an.instanceof(Photo));
	});

	it('getRelatedCollections', async () => {
		const collections = await collection.getRelatedCollections();
		should().exist(collections);
		collections.forEach(collection => collection.should.be.an.instanceof(Collection));
	});
});

describe('Topic', () => {
	let topic;

	before(async () => {
		topic = await unsplash.getTopic('people');
		should().exist(topic);
		topic.should.be.an.instanceof(Topic);
	});

	it('getPhotos', async () => {
		const photos = await topic.getPhotos();
		should().exist(photos);
		photos.forEach(photo => photo.should.be.an.instanceof(Photo));
	});
});

describe('Topic', () => {
	let topic;

	before(async () => {
		topic = await unsplash.getTopic('people');
		should().exist(topic);
		topic.should.be.an.instanceof(Topic);
	});

	it('getPhotos', async () => {
		const photos = await topic.getPhotos();
		should().exist(photos);
		photos.forEach(photo => photo.should.be.an.instanceof(Photo));
	});
});