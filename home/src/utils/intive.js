import { atom } from "recoil";

const newInviteState = atom({
    key: "newInviteState",
    default: false
});

export {newInviteState};