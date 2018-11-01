import { version } from '../../package.json';
import { Router } from 'express';
import { asyncUsingEmitirComprobanteMiddleware } from '../middleware';

// aquí es donde se definen las rutas en las que responden los servicios creados con express.js
export default ({ config, db }) => {
	let api = Router();

	// aquí definimos el endpoint que usarémos para lanzar la petición al servicio SOAP
	// cuando se envía la petición desde el browser, express.js la recibe, la parsea y verifica que 
	// endpoint debe atenderla, cuando lo identifica, ejecuta el middleware (que es el que lanza la 
	// petición al servicio SOAP) y cuando recibe la respuesta, ejecuta la tercera función recibida 
	// como parámetro por api.use
	api.use('/soap/emitirComprobante', asyncUsingEmitirComprobanteMiddleware, (req, res) => {
		// aquí, simplemente, parseamos a JSON el resultado que recibimos del servicio SOAP
		res.json({ response: req.soapResponse});
	});

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
