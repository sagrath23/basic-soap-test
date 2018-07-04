import { Router } from 'express';
import fetch from 'node-fetch';


const endpoint = 'https://api.github.com/graphql';

export const asyncMiddleware = async () => {
    const { status, body } = await fetch(endpoint, {
        method: 'POST',
        headers: { 
			'Content-Type': 'application/json',
        body: JSON.stringify({query: `viewer {
            repositories(first: 100) {
              edges {
                repository:node {
                  name
        
                  issues(first: 100) {
                    totalCount
                    edges {
                      node {
                        title
                        bodyHTML
                      }
                    }
                  }
                }
              }
            }
          }`})
	});
	console.log(status, 'status in middleware');
    console.log(body, 'body in middleware');
    return {status, body};
};

export default ({ config, db }) => {
	let routes = Router();

	// add middleware here

	return routes;
}
