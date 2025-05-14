import axios from "axios";
import { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {newInviteState} from "../utils/intive";
import { userAccessTokenState, userNoState } from "../utils/storage";
import {connectWebSocket,subscribeWebSocket,unsubscribeWebSocket,publishWebSocket,disconnectWebSocket} from '../utils/webSocketClient.js';

export const useInvite = () => {
    const userNo = useRecoilValue(userNoState);
    const userAccessToken = useRecoilValue(userAccessTokenState);
    const [newInvite, setNewInvite] = useRecoilState(newInviteState);

    const inviteSubscribe = useCallback(async () => {
        connectWebSocket(userAccessToken);
        const destination = `/private/invite/${userNo}`;
        const callback = (result) => {
            setNewInvite(result.hasInvitation);
            console.log("초대장");
        };

        subscribeWebSocket(destination, callback);     
    }, [userNo]);

    const unreadInviteCount = useCallback(async () => {
        const { data } = await axios.get(`/invite/unreadInviteCount`);
        setNewInvite(data > 0);
    }, [newInvite]);

    const readInvite = useCallback(async ()=>{
        if(newInvite === false) {
            return;
        }
        await axios.get(`/invite/readInvite`);
        setNewInvite(false);
    },[newInvite]);

    return {
        newInvite, inviteSubscribe, unreadInviteCount, readInvite
    };
}