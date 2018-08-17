import { Router } from 'express';
import { 
  getBasicInfoFromGithub,
  searchComponentsBasicInfoFromGithub } from '../lib/util';

export const asyncUsingSearchMiddleware = async (req, res, next) => {
  req.githubResponse = await searchComponentsBasicInfoFromGithub();
  next();
};

export const asyncUsingBasicModelMiddleware = async (req, res, next) =>{
  req.githubResponse = await getBasicInfoFromGithub();
  next();
}; 

export default ({ config, db }) => {
  let routes = Router();

  // add middleware here

  return routes;
}
