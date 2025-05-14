import axios from "axios";
import { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {newInviteState} from "../utils/intive";
import { userAccessTokenState, userNoState } from "../utils/storage";
import {connectWebSocket,subscribeWebSocket} from '../utils/webSocketClient.js';

export const useInvite = () => {
    const userNo = useRecoilValue(userNoState);
    const userAccessToken = useRecoilValue(userAccessTokenState);
    const [newInvite, setNewInvite] = useRecoilState(newInviteState);
    return {
        newInvite, inviteSubscribe, unreadInviteCount, readInvite
    };
}