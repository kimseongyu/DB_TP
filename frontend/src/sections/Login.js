import axios from 'axios';
import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import logo from './logo.jpg';
import { useSetRecoilState } from 'recoil';
import { cnoNumber } from '../state/state.js';

function Login(props) {
    const [email, setEmail] = useState(""); // 이메일 값
    const [password, setPassword] = useState("");// 비밀번호 값

    const [managerEmail, setManagerEmail] = useState("manager@email.com") // 매니저 이메일
    const [managerPw , setManagerPw] = useState("1234") //매니저 비밀번호
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    // input box에 입력하는 값에 따라 이메일과 비밀번호 값을 변경

    const navigate = useNavigate();
    const navigateToRegister = () => { // 회원가입 버튼 누를시 회원가입 창으로 이동
        navigate("/registerPage");
    };

    const navigateToManager = () => { // 매니저 계정일 경우 매니저 창으로 이동
        if (managerEmail === email && managerPw === password) {
            navigate("/Manager");
        }else{
            alert("관리자 전용입니다")
        }
    }
    const setCno = useSetRecoilState(cnoNumber); // 받아온 cno를 저장
    const navigateToMainPage = async (e) => { // 로그인 버튼 누를시 api로 cno를 받아옴
        e.preventDefault();

        const url = 'http://localhost:3001/login';
        const data = { email: email, password: password };

        try {
            const response = await axios.post(url, data);
            console.log(response.data);

            if (response.data.result === "success") {
                setCno(response.data.cno);
                navigate("/main");
            } else {
                alert("아이디 혹은 패스워드가 틀렸습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("ERROR!");
        }
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column'}}>
                <div>
                    <img src={logo} alt="hi"/>
                </div>
                <label>Email</label>
                <input style={{width: '30%',margin: '0 auto'}} type='email' value={email} onChange={onEmailHandler}/>
                <label>Password</label>
                <input style={{width: '30%',margin: '0 auto'}} type='password' value={password} onChange={onPasswordHandler}/>
                <br/>
                <button style={{width: '30%',margin: '0 auto'}} onClick ={navigateToMainPage}>
                    Login
                </button>
                <button style={{width: '30%',margin: '0 auto'}} onClick={navigateToRegister}>
                    SignUp
                </button>
                <button style={{width: '30%',margin: '0 auto'}} onClick={navigateToManager}>
                    Manager
                </button>
            </form>

        </div>
    )
}

export default Login;