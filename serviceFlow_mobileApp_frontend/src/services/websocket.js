import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WS_URL = 'http://10.0.2.2:8080';

export const connectWebSocket = async (onMessage) => {
    const token = await AsyncStorage.getItem('userToken');
    // For SockJS fallback simulation with socket.io-client on React Native
    const socket = io(WS_URL, {
        transportOptions: {
            polling: {
                extraHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            },
        },
    });

    socket.on('connect', () => {
        console.log('connected to websocket');
    });

    return socket;
};
