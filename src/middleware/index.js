import { Router } from 'express';
import { getBasicInfoFromGithub } from '../lib/util';

export const asyncMiddleware = async (req, res, next) => {
  
  req.githubResponse = await getBasicInfoFromGithub();

  next();
};

export default ({ config, db }) => {
  let routes = Router();

  // add middleware here

  return routes;
}
