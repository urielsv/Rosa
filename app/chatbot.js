// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const AppointmentManager = require("./AppointmentManager");
const PropertiesReader = require("properties-reader");
const properties = PropertiesReader("messages.properties");
const venom = require("venom-bot");

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyB0jCuqK-gQd2XDbwL4lZCW16kDsZJ6bwk");

// Create an instance of the AppointmentManager class
const appointmentManager = new AppointmentManager();
appointmentManager.loadAppointments();

// Create a bot new session
venom
    .create({
        session: "rosa", //name of session
    })
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

let sintomasText; // String, descripcion con los sintomas
let molestiasText; // Int, del 1 (leve) al 5 (fuerte) molestia
let nombreText; // String, Nombre Apellido

//let recomText = ""; // String, recomendacion de ir al medico

let lastMessageTime = new Map();

let clientMap = new Map();

let welcomeSent = false;
let appointmentGiven = false;

let cancelarGiven = false;

let prompt;

function sendWelcomeMessage(client, message) {
    sendTextTl(client, message, "bienvenida");
    welcomeSent = true;
    nameGiven = true;

    cancelarGiven = false;
}

// for link
let joinUrl;

const getMeetingLink = async (chatId) => {
    const response = await fetch("http://localhost:80/create-meeting", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            chatId: chatId,
        }),
    });

    if (!response.ok) {
        console.log(response);
        throw new Error("Network response was not ok");
    }

    const data = await response.json();
    joinUrl = data.joinUrl;
    console.log("this" + joinUrl);

    // Use the joinUrl here
    return joinUrl;
};

function start(client) {
    console.log("Bot started successfully");

    client.onMessage(async (message) => {
        console.log("Bot received message successfully");

        if (clientMap.has(message.chatId)) {
            clientMap.set(message.chatId, clientMap.get(message.chatId) + 1);
        } else {
            clientMap.set(message.chatId, 0);
        }

        let now = Date.now();
        let sixHours = 120000; // 2 minutes TEMP //6* 60 * 60 * 1000; // 6 hours in milliseconds

        if (clientMap.get(message.chatId) == 5) {
            // Luego de preguntar si quiere un turno virtual
            appointmentGiven = false;
            console.log("entro al if");
            url = await getMeetingLink(message.chatId);
            //console.log(url)
            sendTextTl(client, message, "meeting-url");
            client.sendText(message.chatId, url);
            appointmentManager.createAppointment(
                message.chatId,
                url,
                nombreText,
                sintomasText,
                molestiasText,
                "DESDE BOT"
            );

			clientMap.set(message.chatId, 0);
        }

		if (clientMap.get(message.chatId) == 4) {
			// Luego de recibir la recomendacion
			
			sendTextTl(client, message, "recomendacion");
		}

        if (clientMap.get(message.chatId) == 3) {
            // Luego de recibir las molestias
            molestiasText = parseInt(message.body);
            console.log("Molestias: " + molestiasText);
            if (molestiasText < 1 || molestiasText > 5 || isNaN(molestiasText)) {
                sendTextTl(client, message, "molestias");
                return;
            }

            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt =
                "Me recomendas ir al medico presencial o virtual con los siguientes sintomas (responde de manera aleatoria entre presencial o virtual):" +
                sintomasText +
                "con una molestia de " +
                molestiasText.toString() +
                "(siendo la escala de1 muy poca molestia, a 5 una muy fuerte molestia)" +
                ", dame una respuesta de minimo 20 palabras y con emojis."

            const result = await model.generateContent(prompt);

            const response = await result.response;
            const recomText = response.text();
            console.log("[SENT]" + recomText);
            client.sendText(message.chatId, recomText);
          
        }

        if (clientMap.get(message.chatId) == 2) {
            // Luego de recibir los sintomas
            sintomasText = message.body;
            console.log("[RECIEVED]" + sintomasText);

            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt =
                "Si " + sintomasText + " no tiene relacion con sintomas de alguna enfermedad, responder con un mensaje que diga \"false\" " + 
        		" Si" +sintomasText + " corresponde a un sintoma de una enfermedad, que el mensaje diga \"true\"";
            
            const result = await model.generateContent(prompt);

            const response = await result.response;
            const recomText = response.text();
            console.log("[SENT]" + recomText);
            if (recomText === "false") { 
                 clientMap.set(message.chatId, clientMap.get(message.chatId) - 1);
				 sendTextTl(client, message, "sintomas");
				 return;
                 
            } else { 
              sendTextTl(client, message, "molestias")
            }

        }

        if (clientMap.get(message.chatId) == 1) {
            // Luego de recibir el nombre

			
            nombreText = message.body;

            sendTextTl(client, message, "sintomas");
        }

        if (lastMessageTime.has(message.chatId)) {
            let lastTime = lastMessageTime.get(message.chatId);
            if (now - lastTime > sixHours) {
                sendWelcomeMessage(client, message);
            } else {
                console.log("Waiting for welcome delay");
            }
        } else {
            sendWelcomeMessage(client, message);
        }

        if (message.body === "Cancelar" && appointmentGiven) {
            sendTextTl(client, message, "turnocancelado");
        }

        lastMessageTime.set(message.chatId, now);
    });
}

function sendTextTl(client, message, token) {
    if (message.isGroupMsg === false) {
        console.log("[SENT] message: " + token);
        const messageToSend = properties.get(token);
        client.sendText(message.chatId, messageToSend);
    }
}
