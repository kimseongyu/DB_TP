import { React, useEffect, useState } from 'react';
import RegisterCar from "./RegisterCar";
import axios from 'axios';
import logo from './logo.jpg';
import {useNavigate} from "react-router-dom";

function Manager() {

    const [showStat, setShowStat] = useState(true); // 통계화면 표시 여부
    const [showRegister, setShowRegister] = useState(false); // 차량 등록 화면 표시 여부
    
    const [allCars, setAllCars] = useState([]); // 모든 차량
    const [numandDate, setNumandDate] = useState([]); // 현재 예약되어있는 차량들의 차량번호 별,
// 예약 날짜별 예약 내용들의 수를 출력한다.
    const [ranking, setRanking] = useState([]); // 가격별 순위 변수

    const [flag, setFlag] = useState(false);
    
    useEffect(() => {
        fetchStatistics();
    }, []);
    const fetchStatistics = async () => {
        alert("매니저 접속")
        if (flag === false) {
            try {
                const res1 = await axios.post('http://localhost:3001/admin/join');
                setAllCars(res1.data.data);
                const res2 = await axios.post('http://localhost:3001/admin/group');
                setNumandDate(res2.data.data);
                const res3 = await axios.post('http://localhost:3001/admin/window');
                setRanking(res3.data.data);
            } catch(error){
                console.error('ERROR!', error)
            }
            setFlag(true);
        }
    };

    const navigate = useNavigate(); // 화면전환
    const navigateToLogin = () =>{
        navigate("/Login");
    };
    
    // 메인페이지와 비슷한 구조
    return ( 
        <div style={{width: "100%", height:"100%", display: "flex",  flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: "1em"}}>
            <div>
                <img src={logo} style={{height:'250px'}}/>
            </div>

            <div style={{width: "100%", paddingTop: '15px', display: "flex", justifyContent: "center", alignItems: "center"}}>
                <button style={{width: "40%", height: "30px", borderRadius: "5px", border: "none", marginRight: "10px", cursor: "pointer"}}
                        onClick={() => {setShowStat(true); setShowRegister(false)}}>
                    통계 정보
                </button>

                <button style={{width: "40%", height: "30px", borderRadius: "5px", border: "none", marginLeft: "10px", cursor: "pointer"}}
                        onClick={() => {setShowStat(false); setShowRegister(true)}}>
                    차량 등록
                </button>
            </div>

            <div style={{paddingBottom: "40px"}}>
                {showStat ? (
                    <div>
                        <h2>통계 정보 열람</h2> {/* db에서 가져온 통계를 보여준다 */}
                        {flag ? (
                            <div>
                                <h3>각 차량번호의 차량 모델 수</h3>
                                <ul>
                                    {allCars.map((car, index) => (
                                        <li key={car[0]}>
                                            <strong>{car[0]}</strong>: {car[1]} {car[2]} {car[3]} {car[4]}개
                                        </li>
                                    ))}
                                </ul>

                                <h3>차량번호 및 예약날짜별 예약 내용</h3>
                                <ul>
                                    {numandDate.map((car, index) => (
                                        <li key={car[0]}>
                                            <strong>{car[0]}</strong>: {car[1]} {car[2]}개
                                        </li>
                                    ))}
                                </ul>

                                <h3>차량 대여 비용 순위</h3>
                                <ul>
                                    {ranking.map((car, index) => (
                                        <li key={car[0]}>
                                            <strong>{car[0]}</strong>: {car[1]} {car[2]}등
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>통계 정보를 불러오는 중입니다...</p>
                        )}
                    </div>
                ) : null}

                {showRegister ? (
                    <RegisterCar></RegisterCar>
                ) : null}
            <button style={{position: 'absolute', right: 0, marginRight: "30px"}} onClick={navigateToLogin}>
                로그아웃  
            </button> {/* 관리자 창 종료 */}
            </div>


        </div>
    )
}

export default Manager;