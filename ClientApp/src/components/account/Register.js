import React, { useState } from 'react';

export const Register = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [nickName, setNickName] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [successRegist, setSuccessRegist] = useState(false);

    const handleEmailChange = (event) => { setEmail(event.target.value); }
    const handleNickNameChange = (event) => { setNickName(event.target.value); }
    const handlePasswordChange = (event) => { setPassword(event.target.value); }
    const handlePassword2Change = (event) => { setPassword2(event.target.value); }


    const handleRegisterClick = async () => {
        setMessage("");
        setShowMessage(false);

        if (!isValid('email', email)) {
            setMessage("올바른 이메일주소를 입력해주세요.");
            setShowMessage(true);
            return;
        } else if (!isValid('nickname', nickName)) {
            setMessage("6글자 이내의 한글, 영문, 숫자로 조합된 닉네임을 입력해주세요.");
            setShowMessage(true);
            return;
        } else if (!isValid('password', password)) {
            setMessage("12글자 이내의 최소 1개의 대소문자와 영문자 숫자로 비밀번호를 입력해주세요.");
            setShowMessage(true);
            return;
        } else if (password !== password2) {
            setMessage("다시 입력한 비밀번호가 일치하지 않습니다.");
            setShowMessage(true);
            return;
        }

        const response = await fetch("api/account/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                nickName,
                password,
                password2
            })
            ,
        });

        var executeResult = await response.json();
        var resultMessage = "";
        switch (executeResult.resultCode) {
            case 0:
                resultMessage = "계정생성에 성공하였습니다.";
                setSuccessRegist(true);
                break;
            case 1001:
                resultMessage = "해당 이메일은 이미 사용하고 있습니다.";
                break;
            case 1002:
                resultMessage = "해당 닉네임은 이미 사용하고 있습니다.";
                break;
            default:
            case 1003:
                resultMessage = "계정 생성에 실패하였습니다. 잠시 후에 다시 시도해주시거나 고객센터에 연락주시기 바랍니다.";
                break;
        }

        setMessage(resultMessage);
        setShowMessage(true);
    }

    const handleLoginClick = () => {
        window.history.pushState(null, '', '/login');
        window.dispatchEvent(new Event('popstate'));
    }


    function isValid(type, value) {
        let pattern = '';

        switch (type) {
            case 'email':
                pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                break;
            case 'nickname':
                pattern = /^[a-zA-Z0-9가-힣]{1,6}$/;
                break;
            case 'password':
                pattern = /^(?=.*[A-Z])[A-Za-z0-9]{1,12}$/;
                break;
            default:
                return false;
        }

        return pattern.test(value);
    }


    return (
        <>
            <div className="register-wrap">


                {!successRegist &&
                    <>
                        <input type="text" className="form-control login-input" placeholder="Email.." value={email} onChange={handleEmailChange} />
                        <input type="text" className="form-control login-input" placeholder="별명.." value={nickName} onChange={handleNickNameChange} />
                        <input type="password" className="form-control login-input" placeholder="비밀번호.." value={password} onChange={handlePasswordChange} />
                        <input type="password" className="form-control login-input" placeholder="비밀번호확인.." value={password2} onChange={handlePassword2Change} />
                        <button className="btn btn-success btn-register" onClick={handleRegisterClick}>가입하기</button>
                    </>
                }

                {successRegist &&
                    <button className="btn btn-primary btn-register" onClick={handleLoginClick}>로그인으로이동</button>
                }

            </div>
            {showMessage &&
                <div className="register-message">
                    {message}
                </div>
            }

        </>
    )
}

