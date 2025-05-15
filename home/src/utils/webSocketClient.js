import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { v4 as uuidv4 } from 'uuid';

let stompClient = null;
let subscriptions = new Map();
let connectionPromise = null;

export const connectWebSocket = (accessToken) => {
    if (stompClient && stompClient.connected) {
        return Promise.resolve();
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    connectionPromise = new Promise((resolve, reject) => {
        const socket = new SockJS("http://localhost:8080/ws");
        stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { accessToken },
            onConnect: () => {
                connectionPromise = null;
                resolve();
            },
            onStompError: (frame) => {
                connectionPromise = null;
                reject(new Error(frame.body));
            },
            onWebSocketError: (event) => {
                connectionPromise = null;
                reject(event);
            }
        });
        stompClient.activate();
    });

    return connectionPromise;
};

export const subscribeWebSocket = async (destination, callback, accessToken) => {
    if (!stompClient || !stompClient.connected) {
        console.warn("connect 먼저 호출필요");
        return;
    }

    // destination 기준 중복 방지 (원하면 subId 기준만 사용도 가능)
    const existingSub = [...subscriptions.values()].find(sub => sub.destination === destination);
    if (existingSub) return existingSub.id;

    const uniqueSubId = uuidv4();
    const subscription = stompClient.subscribe(destination, (message) => {
        callback(JSON.parse(message.body));
    }, { accessToken, id: uniqueSubId });

    subscriptions.set(uniqueSubId, { subscription, destination });
    return uniqueSubId;
};

export const unsubscribeWebSocket = (subId) => {
    const record = subscriptions.get(subId);
    if (record) {
        record.subscription.unsubscribe();
        subscriptions.delete(subId);
    }
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        subscriptions.forEach(({ subscription }) => subscription.unsubscribe());
        subscriptions.clear();
        stompClient.deactivate();
        stompClient = null;
    }
};

export const publishWebSocket = async (destination, object, accessToken) => {
    await connectWebSocket(accessToken);

    if (!stompClient || !stompClient.connected) {
        console.warn("연결되지 않았습니다.");
        return;
    }

    stompClient.publish({
        destination,
        headers: { accessToken },
        body: JSON.stringify(object),
    });
};
