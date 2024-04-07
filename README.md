# Rosa
Rosa, el bot de whatsapp que te permite sacar turnos en guardia medica desde la comodiad de tu hogar.

## Requerimientos
Requiere SO: MacOS aarch64, Nodejs v20+ y npm v10+.

## Instalacion
Para comenzar con la instalacion puede `chmox u+x build.sh`, luego ejecutarlo con `./build.sh`
Luego de la instalacion, puedes terminar la instalacion de Rosa con `chmod u+x start.sh` para agregarle permisos de ejecucion al archivo de ejecucion.

## Ejecucion
Luego, para comenzar a utilizar a Rosa, escribir: 
```./start.sh```

Para poder gestionar los turnos de forma virtual (con zoom) se debe iniciar sesion con una cuenta adherida al sistema. Para el MVP la unica cuenta posible es urielsosavazquez@gmail.com como anfitrion.

# Contenido
- /app: Chatbot de Rosa
- /manager: Portal web para los doctores, donde recibiran y administraran los turnos
- /backend: API y conexiones

Al correr el programa (./start.sh), se recibira por stdout el URL para el portal (este suele ser localhost:3000).
