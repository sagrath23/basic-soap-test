import { Router } from 'express';
import { GraphQLClient } from 'graphql-request';
import config from '../config.json';


const endpoint = `https://api.github.com/graphql?access_token=${config.githubToken}`;

export const asyncMiddleware = async (req, res, next) => {
  const client = new GraphQLClient(endpoint,{
    headers: {
      Authorization: `bearer ${config.githubToken}`
    }
  } );

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

  req.githubResponse = await client.request(query);

  next();
};

export default ({ config, db }) => {
  let routes = Router();

  // add middleware here

  return routes;
}
