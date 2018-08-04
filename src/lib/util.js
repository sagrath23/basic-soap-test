import { GraphQLClient } from 'graphql-request';
import config from '../config.json';

/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
export function toRes(res, status = 200) {
	return (err, thing) => {
		if (err) return res.status(500).send(err);

		if (thing && typeof thing.toObject === 'function') {
			thing = thing.toObject();
		}
		res.status(status).json(thing);
	};
}

const endpoint = `https://api.github.com/graphql`;

export const getBasicInfoFromGithub = async () => {
	const client = new GraphQLClient(endpoint, {
		headers: {
			Authorization: `bearer ${config.githubToken}`
		}
	});

	const query = `
	  {query: 
		viewer {
		  repositories(first: 100) {
			nodes {
			  name
			}
		  }
		}
	  }`;
	
	return await client.request(query);
};
