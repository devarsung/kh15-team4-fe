import {atom, selector} from "recoil";

const userNoState = atom({key: "userNoState",default: null});
const userEmailState = atom({key: "userEmailState",default: null});
const userNicknameState = atom({key: "userNicknameState",default: null});
const userAccessTokenState = atom({key: "accessTokenState", default: null});

const authCheckedState  = atom({key: "userLoadedState",default: false});//refresh()가 비동기로 진행되기에 둔 플래그
const loginState = selector({//로그인 상태
    key: "loginState",
    get: (state)=>{
        const userNo = state.get(userNoState);
        const userEmail = state.get(userEmailState);
        const authChecked = state.get(authCheckedState);
        return authChecked && userNo !== null && userEmail !== null;
    }
});

export {userNoState, userEmailState, userNicknameState, userAccessTokenState, authCheckedState, loginState}