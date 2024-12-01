import { io } from 'socket.io-client';

let socket ; 
export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };

    if(!socket){
        socket = io(process.env.REACT_APP_BACKEND_URL, options);
        socket.connect() ; 
    }
    return socket ; 
};