import { useCallback, useEffect, useState } from "react";

export default function Avatar(props) {
    const { 
        nickname = '', size = 80, classes = ''} = props;
    const [initials, setInitials] = useState("");
    const [bgColor, setBgColor] = useState("");

    useEffect(()=>{
        setInitials(createInitials(nickname))
        setBgColor(createBgColor(nickname));
    },[nickname]);

    const createInitials = useCallback((nickname)=>{
        const maxLength = getMaxLength(nickname);
        const trimmed = nickname.trim();
        if(trimmed.length >= maxLength) {
            return trimmed.slice(0, maxLength);
        }
        return trimmed;
    },[]);

    const createBgColor = useCallback((nickname)=>{
        let hash = 0;
        for(let i = 0; i < nickname.length; i++) {
            hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `hsl(${hash % 360}, 60%, 70%)`;
    },[]);

    const getMaxLength = useCallback((nickname)=>{
        const isKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(nickname);
        const maxLength = isKorean ? 3 : 4;
        return maxLength;
    },[]);

    return (<>
        <div
            className={classes}
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: bgColor,
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: size * 0.35,
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}
        >
            {initials}
        </div>
    </>)
}