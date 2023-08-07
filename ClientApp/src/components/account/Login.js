import React, { useContext, useState, useRef } from 'react';
import UserContext from '../context/UserContext';

export const Login = () => {
    const { setCurrentUserEmail, setCurrentUserNickName, setCurrentUserUid } = useContext(UserContext);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleNavigateRegister = () => {
        window.history.pushState(null, '', '/register');
        window.dispatchEvent(new Event('popstate'));
    }

    const handleLoginClick = async () => {
        login();
    }

    const handleUserEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleUserPasswordKeyDown = async (event) => {
        if (event.keyCode === 13) {
            login();
        }
    }

    async function login() {
        setShowMessage(false);
        setMessage("");

        if (email === "") {
            setMessage("ID를 입력해주세요");
            setShowMessage(true);
            return;
        } else if (password === "") {
            setMessage("비밀번호를 입력해주세요.");
            setShowMessage(true);
            return;
        }

        const response = await fetch("api/account/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (response.status === 200) {
            var data = await response.json();
            setCurrentUserEmail(data.email);
            setCurrentUserNickName(data.nickname);
            setCurrentUserUid(data.uid);
            window.history.pushState(null, '', '/');
            window.dispatchEvent(new Event('popstate'));
        } else {
            setMessage("로그인에 실패하였습니다.");
            setShowMessage(true);
        }
    }

    return (
        <>
            <div className="login-wrap">
                <input type="text" className="form-control login-input" placeholder="Email입력.." value={email} onChange={handleUserEmailChange} />
                <input type="password" className="form-control login-input" placeholder="비밀번호입력.." value={password} onChange={handlePasswordChange} onKeyDown={handleUserPasswordKeyDown} />
                <button className="btn btn-primary btn-login" onClick={handleLoginClick}>로그인</button>
                <button className="btn btn-success btn-register" onClick={handleNavigateRegister}>회원가입</button>
            </div>

            {showMessage &&
                <div className="login-message">
                    {message}
                </div>
            }
        </>
    )
}

