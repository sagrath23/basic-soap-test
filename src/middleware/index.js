import { Router } from 'express';
import { emitirComprobante } from '../lib/util';

// en esta función es donde se realiza la petición al servicio SOAP, y se agrega el resultado 
// como propieadad del parámetro req (esto es parte del andamiaje de express.js para manejar peticiones)
export const asyncUsingEmitirComprobanteMiddleware = async (req, res, next) => {
  req.soapResponse = await emitirComprobante();
  next();
};

export default ({ config, db }) => {
  let routes = Router();

  // add middleware here

  return routes;
}
