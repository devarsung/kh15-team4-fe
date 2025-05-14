import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { userNoState } from "../utils/storage";
import { connectWebSocket, subscribeWebSocket, unsubscribeWebSocket, publishWebSocket, disconnectWebSocket } from '../utils/webSocketClient.js';

export const useBoard = (boardNo) => {
    useEffect(() => {
        return () => {
            unsubscribeWebSocket(`/private/users/${boardNo}`);
            unsubscribeWebSocket(`/private/update/${boardNo}`);
        };
    }, []);

    //접속자 채널 구독
    const usersSubscribe = useCallback(async (boardNo) => {
        const destination = `/private/users/${boardNo}`;
        const callback = (result) => {
            console.log("실시간 유저들은");
        };

        subscribeWebSocket(destination, callback);
    }, []);

    //보드 업데이트 채널 구독
    const updateSubscribe = useCallback(async (boardNo) => {
        const destination = `/private/update/${boardNo}`;
        const callback = (result) => {
            console.log("업데이트는");
        };

        subscribeWebSocket(destination, callback);
        
        // try {
        //     const subscription = await subscribeWebSocket({
        //         destination: `/private/update/${boardNo}`,
        //         callback: (result) => {
        //             console.log("보드의 업데이트는");
        //         }
        //     });
        //     return subscription;
        // } catch (error) {
        //     console.error("소켓 연결/구독 실패", error);
        // }
    }, []);

    //레인,카드 데이터 비동기로 가져오기
    const selectLaneFullList = useCallback(async (boardNo) => {
        const { data } = await axios.get(`/lane/lanefull/${boardNo}`);
        return data;
    }, []);

    return { usersSubscribe, updateSubscribe, selectLaneFullList };
};