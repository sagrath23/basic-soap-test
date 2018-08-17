import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import { 
	asyncUsingBasicModelMiddleware,
	asyncUsingSearchMiddleware } from '../middleware';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	//graphql using default model resources
	api.use('/graphql/model', asyncUsingBasicModelMiddleware, (req, res) => {
		res.json({test: req.githubResponse});
	});

	//graphql using search resources
	api.use('/graphql/search', asyncUsingSearchMiddleware, (req, res) => {
		res.json({test: req.githubResponse});
	});

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
