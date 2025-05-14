// websocketClient.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let subscriptions = [];
let connectPromise = null;
let pendingSubscriptions = [];

export const connectWebSocket = (userAccessToken) => {
    if (stompClient && stompClient.connected) {
        console.log("이미 연결됨");
        return Promise.resolve();
    }

    if (connectPromise) {
        console.log("이미 연결 시도 중");
        return connectPromise;
    }

    connectPromise = new Promise((resolve, reject) => {
        const socket = new SockJS("http://localhost:8080/ws");
        stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { userAccessToken },
            onConnect: () => {
                console.log('웹소켓 연결됨');
                pendingSubscriptions.forEach((pending) => pending());
                pendingSubscriptions = [];
                resolve();
            },
            onDisconnect: () => {
                //console.log('웹소켓 연결 해제');
            },
        });
        stompClient.activate();
    });
    return connectPromise;
};

export const subscribeWebSocket = async (destination, callback) => {
    if (!stompClient) {
        console.warn("connect 먼저 호출필요");
        return;
    }

    const existing = subscriptions.find((sub) => sub.destination === destination);
    if (existing) {
        console.log(`이미 구독 중: ${destination}`);
        return existing.subscription;
    }

    if (stompClient.connected) {
        const subscription = stompClient.subscribe(destination, (message) => {
            const json = JSON.parse(message.body);
            callback(json);
        });
        subscriptions.push({ destination, subscription });
        console.log(`${destination} 구독 완료`);
        return subscription;
    }

    // 아직 연결 중이면 대기자로 등록
    return new Promise((resolve) => {
        pendingSubscriptions.push(() => {
            const subscription = stompClient.subscribe(destination, (message) => {
                const json = JSON.parse(message.body);
                callback(json);
            });
            subscriptions.push({ destination, subscription });
            console.log(`${destination} 구독완료(대기자에서 꺼내온녀석)`);
            resolve(subscription);
        });
    });
};

export const unsubscribeWebSocket = (destination) => {
    const index = subscriptions.findIndex((sub) => sub.destination === destination);

    if (index !== -1) {
        subscriptions[index].subscription.unsubscribe();
        subscriptions.splice(index, 1);
        console.log(`${destination} 구독 해제`);
    } else {
        console.log(`${destination} 구독이 존재하지 않음`);
    }
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
        subscriptions = [];
        connectPromise = null;
        pendingSubscriptions = [];
        console.log("disconnect");
    }
};

export const publishWebSocket = async (destination, object, userAccessToken) => {
    await connectWebSocket(userAccessToken);

    if (!stompClient || !stompClient.connected) {
        console.warn("연결되지 않았습니다.");
        return;
    }

    const stompMessage = {
        destination: destination,
        headers: { userAccessToken },
        body: JSON.stringify(object),
    };

    stompClient.publish(stompMessage);
};
