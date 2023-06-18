import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }
    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    }
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate("/login");
    };

    const onSubmitHandler = async (e) => {
        if(password !== confirmpassword){
            return alert('비밀번호와 비밀번호 확인이 같지 않습니다.');
        }
        e.preventDefault();

        const url = 'http://localhost:3001/signup';
        const body = {
            email: email,
            name: name,
            password: password
        };

        await axios.post(url, body)
        .then(function (res) {
            if (res.data.result === "success") {
                alert("회원가입이 완료되었습니다.");
                navigateToLogin();
            } else {
                alert("이미 존재하는 ID거나 잘못된 email 형식입니다.");
            }
        })
        .catch (function (error) {
            console.log(error);
            alert("ERROR!");
        });
    }

    useEffect(() => {
        setEmail(null);
        setName(null);
        setPassword(null);
        setConfirmPassword(null);
    }, []);

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
            }}>
            <form style={{ display: 'flex', flexDirection: 'column'}}>
                <label>Email</label>
                <input type='email' value={email} onChange={onEmailHandler}/>
                <label>Name</label>
                <input type='text' value={name} onChange={onNameHandler}/>
                <label>Password</label>
                <input type='password' value={password} onChange={onPasswordHandler}/>
                <label>Confirm Password</label>
                <input type='password' value={confirmpassword} onChange={onConfirmPasswordHandler}/>
                <br />
                <button onClick={onSubmitHandler}>
                    Register
                </button>
                <button onClick={navigateToLogin}>
                    Go Back
                </button>
            </form>
        </div>
    )
}

export default RegisterPage;