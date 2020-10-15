const Unsplash = require('./index'),
	{ User, Photo, Collection, Topic } = require('./models'),
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
		user.should.be.an.instanceof(User);
	});

	it('getPhoto', async () => {
		const photo = await unsplash.getPhoto('RnCPiXixooY');
		should().exist(photo);
		photo.should.be.an.instanceof(Photo);
	});

	it('getCollection', async () => {
		const collection = await unsplash.getCollection(51837822);
		should().exist(collection);
		collection.should.be.an.instanceof(Collection);
	});

	it('getRandomPhoto', async () => {
		const photo = await unsplash.getRandomPhoto();
		should().exist(photo);
		photo.should.be.an.instanceof(Photo);
	});

	it('getTopic', async () => {
		const topic = await unsplash.getTopic('nature');
		should().exist(topic);
		topic.should.be.an.instanceof(Topic);
	});

	it('getTopics', async () => {
		const topics = await unsplash.getTopics();
		should().exist(topics);
		topics.forEach(topic => topic.should.be.an.instanceof(Topic));
	});
});

describe('User', () => {
	it('getPhotos', async () => {

	});

	it('getLikes', async () => {

	});

	it('getFollowing', async () => {

	});

	it('getFollowers', async () => {

	});

	it('getCollections', async () => {

	});

	it('getStatistics', async () => {

	});
});