import {atom, selector} from "recoil";

const userNoState = atom({
    key: "userNoState",
    default: null
});

const userEmailState = atom({
    key: "userEmailState",
    default: null
});

const loginState = selector({
    key: "loginState",
    get: (state)=>{
        const userNo = state.get(userNoState);
        const userEmail = state.get(userEmailState);
        return userNo !== null && userEmail !== null;
    }
})

export {userNoState, userEmailState, loginState}