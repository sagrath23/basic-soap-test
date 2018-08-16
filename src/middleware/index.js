import { Router } from 'express';
import { searchComponentsBasicInfoFromGithub } from '../lib/util';

export const asyncMiddleware = async (req, res, next) => {
  
  // req.githubResponse = await getBasicInfoFromGithub();
  req.githubResponse = await searchComponentsBasicInfoFromGithub();
  next();
};

export default ({ config, db }) => {
  let routes = Router();

  // add middleware here

  return routes;
}
