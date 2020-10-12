const Unsplash = require('./index');
require('dotenv').config();

const unsplash = new Unsplash(process.env.ACCESS_KEY);

const start = async () => {
	const user = await unsplash.getUser('chewy');
	//console.log(user)//await user.getLikes());
	console.log((await user.getPhotos())[0]);
};

start();