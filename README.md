This project is inspired by the official Socket.IO tutorial https://socket.io/get-started/chat and implements the
additional improvements:

- Broadcast a message to connected users when someone connects or disconnects.
- Add support for nicknames.
- Don’t send the same message to the user that sent it. Instead, append the message directly as soon as he/she presses
  enter.
  
- TODO Add “{user} is typing” functionality.
- TODO Show who’s online.
- TODO Add private messaging.

## How to run
- `npm install`
- `npm run start`
- visit `http://localhost:3002`
