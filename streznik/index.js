const net = require('net');
const PORT = 1234;
const crypto = require("crypto");
const server = net.createServer();

function encrypt(message, key) {
    const cipher = crypto.createCipher('des-ede3', key);
    let crypted = cipher.update(message, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function fenToBoard(fen) {
    const rows = fen.split("/");
    const board = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const newRow = [];
        for (let j = 0; j < row.length; j++) {
            const char = row[j];
            if (isNaN(char)) {
                newRow.push(char);
            } else {
                for (let k = 0; k < parseInt(char); k++) {
                    newRow.push(" ");
                }
            }
        }
        board.push(newRow);
    }
    return board;
}


server.on('connection', function(socket) {
    socket.on('error',function(error){
        console.log('Napaka : ' + error);
    });

    socket.on('timeout',function(){
        console.log('Odjemalec timout !');
    });

    socket.on('end',function(data){
        console.log('Odjemalec je končal povezavo!');
    });

    socket.on('close',function(){
        console.log('Konec povezave!');
    });

    socket.on('data',function(data){
        try{
            console.log('Prejeto sporočilo: ');
            const {header,payload} = JSON.parse(data)
            console.log("------------------------");
            console.log("Header:", header);
            console.log("Payload:", payload);
            switch (header){
                case "A":
                    // print ip of client
                    console.log("IP naslov odjemalca:", socket.remoteAddress, ":", socket.remotePort);
                    socket.write(JSON.stringify({header: "A", payload: "IP naslov odjemalca: " + socket.remoteAddress + ":" + socket.remotePort}));
                    break;
                case "B":
                    // log current date and time formatted as DD.MM.YYYY HH:MM:SS
                    console.log("Trenutni datum in čas:", new Date().toLocaleString());
                    socket.write(JSON.stringify({header: "B", payload: "Trenutni datum in čas: " + new Date().toLocaleString()}));
                    break;
                case "C":
                    // print current working directory
                    console.log("Trenutni delovni direktorij:", process.cwd());
                    socket.write(JSON.stringify({header: "C", payload: "Trenutni delovni direktorij: " + process.cwd()}));
                    break;
                case "D":
                    console.log("Sporočilo, ki ga je pravkar prejel:", payload);
                    socket.write(JSON.stringify({header: "D", payload: payload}));
                    break;
                case "E":
                    console.log("Sistemske informacije (ime računalnika in verzija operacijskega sistema):", process.env.COMPUTERNAME, process.env.OS);
                    socket.write(JSON.stringify({header: "E", payload: "Sistemske informacije (ime računalnika in verzija operacijskega sistema): " + process.env.COMPUTERNAME + " " + process.env.OS}));
                    break;
                case "F":
                    console.log("FEN notacija:", payload);
                    console.log("Šahovnica:");

                    socket.write(JSON.stringify({header: "F", payload: board}));
                    break;
                case "G":
                    console.log("šifrirano sporočilo:"+ payload, encrypt(payload, "skrivnogeslo"));
                    socket.write(JSON.stringify({header: "G", payload: encrypt(payload, "skrivnogeslo")}));
                    break;
                default:
                    socket.write(JSON.stringify({header:"ERR",payload:"Napačni header!"}))
            }
        }catch (err){
            socket.write(JSON.stringify({header:"ERR",payload:"Napaka"}))
        }


    });
});


server.listen(PORT, function() {
    console.log('Poslušam na naslovu: 127.0.0.1:'+ server.address().port);
});










