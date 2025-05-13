import axios from "axios";
import { useCallback, useState } from "react";
import { useWebSocketClient } from "./useWebSocketClient";
import { useRecoilState, useRecoilValue } from "recoil";
import {newInviteState} from "../utils/intive";
import { userNoState } from "../utils/storage";

export const useInvite = () => {
    const { connect, subscribe, disconnect } = useWebSocketClient();
    const userNo = useRecoilValue(userNoState);
    const [newInvite, setNewInvite] = useRecoilState(newInviteState);

    const inviteSubscribe = useCallback(async () => {
        try {
            await subscribe({
                destination: `/private/invite/${userNo}`,
                callback: (result) => {
                    setNewInvite(result.hasInvitation);
                    console.log("초대장");
                },
            });
        } catch (error) {
            console.error("소켓 연결/구독 실패", error);
        }
    }, [userNo]);

    const unreadInviteCount = useCallback(async () => {
        const { data } = await axios.get(`/invite/unreadInviteCount`);
        setNewInvite(data > 0);
    }, []);

    const readInvite = useCallback(async ()=>{
        const {data} = await axios.get(`/invite/readInvite`);
        setNewInvite(false);
    },[]);

    return {
        newInvite, inviteSubscribe, unreadInviteCount, readInvite
    };
}