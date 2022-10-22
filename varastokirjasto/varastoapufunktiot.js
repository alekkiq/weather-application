/*
####
REST
####
*/

"use strict";
const path = require("path");

function luoVarastokerros(varastoKansioPolku) {
    const varastoConfigPolku = path.join(varastoKansioPolku, "vconfig.json");
    const {
        varastotiedosto,
        perusavain,
        varastokasittelija } = require(varastoConfigPolku);

    const varastoPolku = path.join(varastoKansioPolku, varastotiedosto);

    const {
        luevarasto,
        kirjoitavarasto
    } = require(path.join(varastoKansioPolku, varastokasittelija));

    async function haeKaikkiVarastosta() {
        return luevarasto(varastoPolku);
    }
    async function haeYksiVarastosta(arvo, avain) {
        const kuudata = (await luevarasto(varastoPolku)).find(olio => olio[perusavain] == arvo);
        if (kuudata) {
            const datataulukko = [];
            for (let paiva of kuudata.data) {
                if (avain === "lampo") {
                    datataulukko.push(paiva.lampo);
                }
                else if (avain === "sade") {
                    datataulukko.push(paiva.sade);
                }
                else if (avain === "pilvisyys") {
                    datataulukko.push(paiva.pilvisyys);
                }
                else {
                    return kuudata;
                }
            }
            return datataulukko;
        }
        return [];
    }
    return {
        haeKaikkiVarastosta,
        haeYksiVarastosta,
        perusavain
    }
}

module.exports = { luoVarastokerros };
