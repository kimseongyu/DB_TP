import { React, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { cnoNumber } from '../state/state.js';
import Reservation from './Reservation.js';
import axios from 'axios';
import logo from './logo.jpg';
import { useNavigate } from 'react-router-dom';

function MainPage() {
    const cno = useRecoilValue(cnoNumber);
    const [prev, setPrev] = useState([]);
    const [rent, setRent] = useState([]);
    const [reser, setReser] = useState([]);
    const [flag, setFlag] = useState(false);

    const navigate = useNavigate();

    const [showjaryo, setShowJaryo] = useState(true);
    const [showreserve, setShowReserve] = useState(false);

    const navigateToLogin = () => {
      navigate('/login');
    };

    const firstCome = async () => {
      alert("로딩 중입니다.");

      if (cno === -1) {
        alert("잘못된 접근입니다.");
        navigate("/login");
        return; 
      }

      try {
        const res = await axios.post('http://localhost:3001/myRent', {cno: cno});
        setPrev(res.data.prev);
        setRent(res.data.current);
        setReser(res.data.reserve);
      } catch (error) {
          console.error('ERROR!', error);
      }
    };

    useEffect ( () => {
      firstCome();
    }, []);
    
    const cancelReservation = async (startd, plate) => {
      const url = 'http://localhost:3001/cancel';
      const data = { plateno: plate, start: startd, cno: cno };

      await axios.post(url, data)
          .then(res => {
              alert(res.data.result)
              if (res.data.result === 'success') {
                  alert('예약을 취소하였습니다.');
                  firstCome();
              } else {
                  alert('예약을 취소하지 못했습니다.')
              }
          })
          .catch(err => {
              console.error('Error', err);
              alert("ERROR!");
          });
    };

    const returnCar = (plate) => {
      const url = 'http://localhost:3001/return';
      const data = { plateno: plate, cno: cno };

      axios.post(url, data)
        .then(res => {
          if (res.data.result === 'success') {
            alert('반납을 완료하였습니다.');
            firstCome();
          } else {
            alert('반납을 완료하지 못했습니다.')
          }
        })
        .catch(err => {
          console.error('Error', err);
          alert("ERROR!");
        })
    };

    return (
      <div style={{width: "100%", height:"100%", display: "flex",  flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: "1em"}}>

        <div> 
            { rent.length == 0 ? <img src={logo} style={{height:'250px'}}/> : 
              <div style={{height: '250px', borderColor: 'black'}}>
                <h3> 고객님의 현재 대여 내역 </h3>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>차량</th>
                      <th>대여 시작일</th>
                      <th>대여 종료일</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                      rent.map((v, i) => {
                          return (
                            <tr key={v[0]}>
                                <td>{v[0]}</td> <td> {v[1]}</td><td> {v[2].toString().substr(0,10)}</td> <td>{v[3].toString().substr(0,10)}</td>
                            </tr>
                        );
                        })
                      }
                  </tbody>
                </table>
              </div>
            }
        </div>

        <div style={{width: "100%", paddingTop: '15px', display: "flex", justifyContent: "center", alignItems: "center"}}>
            <button style={{width: "40%", height: "30px", borderRadius: "5px", border: "none", marginRight: "10px", cursor: "pointer"}}
            onClick={() => {setShowJaryo(true); setShowReserve(false)}}>
                자료실
            </button>

            <button style={{width: "40%", height: "30px", borderRadius: "5px", border: "none", marginLeft: "10px", cursor: "pointer"}}
            onClick={() => {setShowJaryo(false); setShowReserve(true)}}>
                예약하기
            </button>
        </div>

        <div style={{paddingBottom: "40px"}}>
            {showjaryo ? (
                <div>
                <h2>자료실</h2>
                <h3>예약 내역</h3>
                <table>
                  <thead>
                    <tr>
                      <th>차량 번호</th>
                      <th>차량</th>
                      <th>예약 시작 날짜</th>
                      <th>예약 종료 날짜</th>
                      <th>예약 취소 하기</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      reser.map((v, i) => {
                          return (
                            <tr key={v[0]}>
                                <td>{v[0]}</td> <td> {v[1]}</ td><td> {v[3]}</td> <td>{v[4]}</td> <td><button onClick={ () => cancelReservation(v[3], v[0])}>예약취소</button></td>
                            </tr>
                        );
                        })
                      }
                  </tbody>
                </table>
          
                <h3>현재 대여 내역</h3>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>차량</th>
                      <th>대여 시작일</th>
                      <th>대여 종료일</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                      rent.map((v, i) => {
                          return (
                            <tr key={v[0]}>
                                <td>{v[0]}</td> <td> {v[1]}</td><td> {v[2]}</td> <td>{v[3]}</td> <td><button onClick={ () => returnCar(v[0])}>반납</button></td>
                            </tr>
                        );
                        })
                      }
                  </tbody>
                </table>
          
                <h3>이전 대여 내역</h3>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>차량</th>
                      <th>대여 시작일</th>
                      <th>대여 종료일</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                      prev.map((v, i) => {
                          return (
                          
                            <tr key={v[0]}>
                                <td>{v[0]}</td> <td> {v[1]}</td><td> {v[2]}</td> <td>{v[3]}</td>
                            </tr>
                        );
                        })
                      }
                  </tbody>
                </table>
              </div>
            ) : null}

            {showreserve ? (
                <Reservation></Reservation>
            ) : null}
        </div>  

        <button style={{position: 'absolute', right: 0, marginRight: "30px"}} onClick={navigateToLogin}>
          로그아웃  
        </button> {/* 관리자 창 종료 */}
    </div>
    )
}

export default MainPage;