import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import * as req from 'superagent';

// promisifico la función fs.readFile para no tener que pasar un callback
// y usar async/await sin problemas
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// defino el path donde se va a colocar la respuesta del servicio SOAP
const responseFilePath = path.join(__dirname,  `respuesta${new Date().getTime()}.txt`);


export const emitirComprobante = async (soapService, filePath) => {
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
    console.log('enviando archivo...');
    const response = await req.post(soapService).set('Access-Control-Allow-Origin', '*').set('Content-Type', 'text/xml').send(soapRequest).withCredentials();
    console.log('respuesta recibida!!!');
    console.log('guardando respuesta en archivo...');
    const some = await writeFile(responseFilePath, new Uint8Array(Buffer.from(response.text)));
    console.log('respuesta guardada en archivo plano');

		return response.text;
	} catch (err) {
		console.log(err);
		return err;
	}
};

const [, , soapService, filePath] = process.argv;

const promise = emitirComprobante(soapService, filePath);

promise.then(() => {
  console.log('finish!!!');
}).catch((err) => {
  console.err(err);
})
