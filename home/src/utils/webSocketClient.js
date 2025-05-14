import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let subscriptions = [];

export const connectWebSocket = (accessToken) => {
    if (stompClient && stompClient.connected) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        const socket = new SockJS("http://localhost:8080/ws");
        stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { accessToken: accessToken },
            onConnect: resolve,
        });
        stompClient.activate();
    });
};

export const subscribeWebSocket = async (destination, callback, accessToken) => {
    if (!stompClient) {
        console.warn("connect 먼저 호출필요");
        return;
    }

    if (subscriptions[destination]) return;

    const subscription = stompClient.subscribe(destination, (message) => {
        callback(JSON.parse(message.body));
    }, {accessToken:accessToken});

    subscriptions[destination] = subscription
};

export const unsubscribeWebSocket = (destination) => {
    subscriptions[destination]?.unsubscribe();
    delete subscriptions[destination];
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
        subscriptions = [];
    }
};

export const publishWebSocket = async (destination, object, accessToken) => {
    await connectWebSocket(accessToken);

    if (!stompClient || !stompClient.connected) {
        console.warn("연결되지 않았습니다.");
        return;
    }

    const stompMessage = {
        destination: destination,
        headers: { accessToken },
        body: JSON.stringify(object),
    };

    stompClient.publish(stompMessage);
};
