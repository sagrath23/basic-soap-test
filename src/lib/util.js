import * as req from 'superagent';
import { formatoFactura } from './format';
import config from '../config.json';

export const emitirComprobante = async () => {
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
	return await req.post(config.soapEndpoint).set('Content-Type', 'text/xml').send(soapRequest);

};