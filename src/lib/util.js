import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import * as req from 'superagent';
import config from '../config.json';

// defino el path donde se va a colocar el formato del archivo
const filePath = path.join(__dirname, 'formatos', 'FACTURAPRUEBA.txt');
// y promisifico la función fs.readFile para no tener que pasar un callback
// y usar async/await sin problemas
const readFile = promisify(fs.readFile);

export const emitirComprobante = async () => {
	try {
		const formatoFactura = await readFile(filePath);
		//este es el formato XML en el que se debe wrappear los parámetros que recibe el servicio SOAP
		const soapRequest = `<?xml version="1.0" encoding="UTF-8"?>
		<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://tempuri.org/">
			<SOAP-ENV:Body>
				<ns1:EmitirComprobante>
					<ns1:LayOut>${formatoFactura}</ns1:LayOut>
				</ns1:EmitirComprobante>
			</SOAP-ENV:Body>
		</SOAP-ENV:Envelope>
		`;

		// usando magia de JS, se envía la petición vía POST al servicio SOAP, seteando en los headers de la petición
		// que se va a enviar un XML, y en el payload de la peticiòn la cadena XML que contiene los parámetros que necesita el 
		// servicio SOAP.
		const response = await req.post(config.soapEndpoint).set('Content-Type', 'text/xml').send(soapRequest);

		return response.text;
	} catch (err) {
		console.log(err);
		return err;
	}
};