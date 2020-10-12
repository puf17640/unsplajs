const request = require('@aero/centra'),
	baseUrl = 'https://api.unsplash.com/',
	headers = { 'Accept-Version': 'v1' },
	ratelimit = { limit: -1, remaining: -1 };

const req = async (route, method, body) => {
	if (!route.startsWith(baseUrl)) 
		route = `${baseUrl}${route}`;
	const res = await request(route, method).header(headers).body(body).send();
	if (res.statusCode >= 200 && res.statusCode < 300) {
		try {
			ratelimit.limit = res.headers['x-ratelimit-limit'];
			ratelimit.remaining = res.headers['x-ratelimit-remaining'];
			return res.json;
		} catch(err) {
			throw [res, err];
		}
	} else if (res.statusCode >= 400 && res.statusCode < 500) {
		throw res.errors;
	} else {
		console.log(`reattempting, status code: ${res.statusCode}`);
		return await req(route, method, body);
	}
};

module.exports = {
	get: async (route) => await req(route),
	post: async (route, body) => await req(route, 'POST', body),
	put: async (route, body) => await req(route, 'PUT', body),
	delete: async (route) => await req(route, 'DELETE'),
	setAuth: (accessKey) => headers.Authorization = `Client-ID ${accessKey}`,
	request
};
