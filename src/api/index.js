import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import { asyncMiddleware } from '../middleware';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	//graphql resources
	api.use('/graphql', asyncMiddleware, (req, res) => {
		res.json({test: req.githubResponse});
	});

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
