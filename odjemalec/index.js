const net = require('net');
const prompt =  require('prompt-sync')({sigint: true});
const PORT = 1234;
const crypto = require("crypto");
const HOST = '127.0.0.1';


function objToBuffer(obj) {
    const str = JSON.stringify(obj);
    return Buffer.from(str);
}

// write a function to decrypt the message
function decrypt(message, key) {
    var decipher = crypto.createDecipher('des-ede3', key);
    var dec = decipher.update(message, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

const getDataFromUser = async () => {
    console.log("A) Niz \"Pozdravljen [IP NASLOV ODJEMALCA:VRATA ODJEMALCA]\"");
    console.log("B) Trenutni datum in čas");
    console.log("C) Trenutni delovni direktorij");
    console.log("D) Sporočilo, ki ga je pravkar prejel");
    console.log("E) Sistemske informacije (ime računalnika in verzija operacijskega sistema)");
    console.log("F) Obdelava in lep izpis Forsyth-Edwards notacije (FEN)  stanja šahovskih figur na šahovnici");
    console.log("Q) Izhod");
    let header = prompt("Vnesite izbiro: ");
    let payload = "";
    header = header.toUpperCase();
    switch(header){
        case "A":
            break;
        case "B":
            break;
        case "C":
            break;
        case "D":
            payload = prompt("Vnesite sporočilo: ");
            break;
        case "E":
            break;
        case "F":
            payload = prompt("Vnesite FEN notacijo: ");
            break;
        case "G":
            payload = prompt("Vnesite sporočilo: ");
            break;
        default:
            console.log("Napačna izbira!");
            break;
    }
    return {header, payload};

}





const client = new net.Socket();
client.on('data', (data) => {

    console.log("Odgovor strežnika: ", JSON.parse(data).payload);
    if (JSON.parse(data).header === "G") {
        console.log("Dešifrirano sporočilo:", decrypt(JSON.parse(data).payload, "skrivnogeslo"));
    }
});



getDataFromUser().then((data) => {
    client.connect(PORT,  () => {
            console.log("connected");
            client.write(objToBuffer({header:data.header, payload: data.payload}));
            // wait for server to respond
            setTimeout(() => {
                client.end();
            }, 1000);
        })
    })















