"use strict";
(function () {
    document.addEventListener("DOMContentLoaded", alusta);
    async function alusta() {
        document.getElementById("myselect").addEventListener("change", paivita);

        // x akselin näkyminen
        let suora = document.getElementById("suora");
        if (suora.style.display === "none") {
            suora.style.display = "block";
        } else {
            suora.style.display = "none";
        }
    }

    function piirraPylvaat(data) {
        const piirtoalue = document.getElementById("piirtoalue");
        const konteksti = piirtoalue.getContext("2d");
        konteksti.clearRect(0, 0, piirtoalue.width, piirtoalue.height);
        konteksti.save();
        konteksti.translate(10, 200);
        konteksti.fillStyle = "blue";
        let x = 30;
        for (let arvo of data) {
            piirraPylvas(konteksti, x, arvo);
            x += 50;
        }
        konteksti.restore();
    }
    function piirraPylvas(konteksti, x, arvo) {
        konteksti.save();
        konteksti.fillRect(x, -arvo, 25, arvo);
        konteksti.fillStyle = "black";
        konteksti.fillText(arvo, x + 7, -arvo - 45);
        konteksti.restore();
    }

    async function paivita() {
        const kuukausi = document.getElementById("myselect").value;
        const valittu = document.getElementById("valittu").value;
        const saadata = await fetch(`http://localhost:4000/api/${valittu}/kuukausi/${kuukausi}`, { mode: "cors" });
        const jsondata = await saadata.json();
        suora.style.display = "block";

        //minimi
        async function minimi() {
            const minimi = Math.min(...jsondata);
            let arvovalinta;
            if (valittu === "sade") {
                arvovalinta = "sademäärä";
            }
            else if (valittu === "lampo") {
                arvovalinta = "lämpötila";
            }
            else {
                arvovalinta = "pilvisyys";
            }
            document.getElementById("min").innerHTML = `Pienin ${arvovalinta}: ${minimi}`;
        }

        //maksimi
        async function maksimi() {
            const maksimi = Math.max(...jsondata);
            let arvovalinta;
            if (valittu === "sade") {
                arvovalinta = "sademäärä";
            }
            else if (valittu === "lampo") {
                arvovalinta = "lämpötila";
            }
            else {
                arvovalinta = "pilvisyys";
            }
            document.getElementById("max").innerHTML = `Suurin ${arvovalinta}: ${maksimi}`;
        }

        //keskiarvo
        async function keskiarvo() {
            let summa = 0;
            for (let i = 0; i < jsondata.length; i++) {
                summa += jsondata[i];
            }
            let ka = summa / jsondata.length;
            let arvovalinta;
            if (valittu === "sade") {
                arvovalinta = "Sademäärien";
            }
            else if (valittu === "lampo") {
                arvovalinta = "Lämpötilojen";
            }
            else if (valittu === "pilvisyys") {
                arvovalinta = "Pilvisyyksien";
            }
            else {
                prompt("Valitse haluttu hakusana!");
            }
            document.getElementById("keskiarvo").innerHTML = `${arvovalinta} keskiarvo: ${ka.toFixed()}`;
        }

        //mediaani
        async function mediaani(jsondata) {
            const jarjestetty = jsondata.slice().sort((a, b) => a - b);
            const keski = Math.floor(jarjestetty.length / 2);

            if (jarjestetty.length % 2 === 0) {
                return (jarjestetty[keski - 1] + jarjestetty[keski]) / 2;
            }
            const tulos = jarjestetty[keski];
            let arvovalinta;
            if (valittu === "sade") {
                arvovalinta = "Sademäärien";
            }
            else if (valittu === "lampo") {
                arvovalinta = "Lämpötilojen";
            }
            else {
                arvovalinta = "Pilvisyyksien";
            }
            document.getElementById("mediaani").innerHTML = `${arvovalinta} mediaani: ${tulos}`;
        }

        piirraPylvaat(jsondata);
        mediaani(jsondata);
        minimi();
        maksimi();
        keskiarvo();
    }

})();
