import { useRecoilState, useRecoilValue } from 'recoil';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useCallback, useEffect, useRef } from 'react';
import { userAccessTokenState } from '../utils/storage.js';

let stompClient = null;
let subscriptions = [];
let connectPromise = null;
let pendingSubscriptions = [];

export const useWebSocketClient = () => {
    const userAccessToken = useRecoilValue(userAccessTokenState);

    const connect = useCallback(() => {
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
                    //대기 중인 구독처리하기
                    pendingSubscriptions.forEach((pending) => pending());
                    pendingSubscriptions = [];
                    resolve();
                },
                onDisconnect: () => {
                    //console.log('웹소켓 연결 해제')
                },
                //debug: (str) => console.log(str),
            });
            stompClient.activate();
        });
        return connectPromise;
    }, [userAccessToken]);

    const subscribe = useCallback(async (subscribeObject) => {
        await connect();
        const { destination, callback } = subscribeObject;

        //이미 구독이 되어있는가?
        const existing = subscriptions.find((sub)=>sub.destination === destination);
        if(existing) {
            console.log(`이미 구독 중: ${destination}`);
            return existing.subscription;
        }

        //연결되어있으면 바로 구독하기
        if (stompClient.connected) {
            const subscription = stompClient.subscribe(destination, (message) => {
                const json = JSON.parse(message.body);
                callback(json);
            });
            subscriptions.push({ destination, subscription });
            console.log(`${destination} 구독 완료`);
            return subscription;
        }

        //연결 중 or 아직 연결안되어있으면 대기자로
        return new Promise((resolve)=>{
            pendingSubscriptions.push(()=>{
                const subscription = stompClient.subscribe(destination, (message) => {
                    const json = JSON.parse(message.body);
                    callback(json);
                });
                subscriptions.push({ destination, subscription });
                console.log(`${destination} 구독완료(대기자에서 꺼내온녀석)`);
                resolve(subscription);
            });
        });
    }, [connect]);

    const unsubscribe = (destination) => {
        const index = subscriptions.findIndex((sub) => sub.destination === destination);
        console.log(subscriptions);

        if (index !== -1) {
            subscriptions[index].subscription.unsubscribe();
            subscriptions.splice(index, 1);
            console.log(`${destination} 구독 해제`);
        }
        else {
            console.log(`${destination} 라는 구독이 존재하지 않습니다`);
        }
    };

    const disconnect = useCallback(() => {
        if (stompClient) {
            stompClient.deactivate();
            stompClient = null;
            subscriptions = [];
            connectPromise = null;
            pendingSubscriptions = [];
            console.log("disconnect");
        }
    }, []);

    const publish = useCallback(async (messageData) => {
        await connect();
        const { destination, object } = messageData;
        //const json = {content: input};

        const stompMessage = {
            destination: destination || `/app/group/${roomNo}`,
            headers: { accessToken: userAccessToken },
            body: JSON.stringify(object)
        };

        stompClient.publish(stompMessage);
    }, [userAccessToken]);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    return { connect, subscribe, unsubscribe, disconnect, publish };
};
