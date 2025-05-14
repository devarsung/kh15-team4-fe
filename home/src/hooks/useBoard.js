import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { userAccessTokenState, userNoState } from "../utils/storage";
import { connectWebSocket, subscribeWebSocket, unsubscribeWebSocket, publishWebSocket, disconnectWebSocket } from '../utils/webSocketClient222.js';

export const useBoard = (boardNo) => {
    const userAccessToken = useRecoilValue(userAccessTokenState);

    

    
    
    

    return { usersSubscribe, updateSubscribe };
};