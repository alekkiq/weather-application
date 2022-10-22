'use strict';
//noden kirjastot           
//TÄÄ ON VÄHÄ OUTO HOMMA JOS SE SIIS EES TOIMIS. YEE
const http = require('http');
const path = require('path');

//asetukset
const {
    port,
    host,
    verkkosivu,
    varastokansio } = require('./palvelinconfig.json');

//omat kirjastot
const kirjastopolku = path.join(__dirname, varastokansio);
const { lue } = require(path.join(__dirname, "kirjasto", "tiedostokasittelija.js"));
const { laheta, onJoukossa, lahetaJson, lahetaStatus } = require(path.join(__dirname, "kirjasto", "apufunktiot.js"));


const resurssiReitit = ['/favicon', '/tyylit/', "/js/"];

const valikkoPolku = path.join(__dirname, "pylvaat", "pylvaat.html")

const palvelin = http.createServer(async (req, res) => {
    const { pathname } = new URL(`http://${host}:${port}${req.url}`);
    const reitti = decodeURIComponent(pathname);

    const metodi = req.method.toUpperCase();

    if (metodi === 'GET') {
        try {
            if (reitti === '/') {
                laheta(res, await lue(valikkoPolku));
            }
            else if (onJoukossa(reitti, ...resurssiReitit)) {
                laheta(res, await lue(path.join(__dirname, reitti)));
            }
            else {
                lahetaStatus(res, 'Resurssi ei ole käytössä');
            }
        }
        catch (virhe) {
            console.log(virhe);
            lahetaStatus(res, 'Virhe luettaessa resurssia');
        }
    }
}); //palvelimen loppu

palvelin.listen(port, host,
    () => console.log(`palvelin ${host}:${port} kuuntelee`));
