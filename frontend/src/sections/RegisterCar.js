import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from "axios";

const RegisterCar = () => {
    const [carNum, setCarNum] = useState(""); // 차량번호
    const [carModel, setCarModel] = useState(""); //차량모델
    const [carSelect, setCarSelect] = useState(0); //차량종류
    const [carFuel, setCarFuel] = useState(0); //차량연료
    const [carSeats, setCarSeats] = useState(""); //차량좌석수
    const [carPrice, setCarPrice] = useState(""); //차량가격
    const [carOption, setCarOption] = useState([]); // 차량옵션들
    const [newOption, setNewOption] = useState(""); // 현재 입력한 차량옵션

    const handleClickRadioButton = (e) => {
        setCarSelect(e.target.value)
    }
    const handleClickRadioFuel = (e) => {
        setCarFuel(e.target.value)
    }
    const onCarNumHandler = (event) => {
        setCarNum(event.currentTarget.value);
    }
    const onCarModelHandler = (event) => {
        setCarModel(event.currentTarget.value);
    }
    const onCarSeatsHandler = (event) => {
        setCarSeats(event.currentTarget.value);
    }
    const onCarPriceHandler = (event) => {
        setCarPrice(event.currentTarget.value);
    }
    const onCarOptionHandler = (event) => {
        setNewOption(event.currentTarget.value);
    }
    // 여기까지 input box 값 변화시 바로바로 적용하기 위한 코드

    const carTypes = [
        { value: 0, name: ''},
        { value: 1, name: '대형' },
        { value: 2, name: '중형' },
        { value: 3, name: '소형' },
        { value: 4, name: '승합' },
        { value: 5, name: 'SUV' },
        { value: 6, name: '고급' },
    ];
    const carFuelTypes = [
        {value:0, name:''},
        { value: 1, name: '휘발유' },
        { value: 2, name: '경유' },
        { value: 3, name: 'LPG' },
        { value: 4, name: '천연가스' },
        { value: 5, name: '전기' },
    ];
    // 전체 차량 종류와, 연료 종류들

    const addOption = (props) => {
        if (props === null || props === ""){
            alert("옵션을 입력해주세요")
        }else{
            setCarOption([...carOption, props])
        }
    }
    // 새로운 옵션을 옵션배열에 추가할때
    const showOption = (arr) =>{
        const result =[];
        for (let i = 0; i < arr.length; i++){
            result.push(<p key={i}>{arr[i]} <button onClick={() => cancelOption(arr[i])}>X</button></p> );
        }
        return result;
    };
    // 등록하려는 최종 차량 정보에 옵션을 보이게 하는 코드
    const cancelOption = (props) => {
        carOption.splice(carOption.indexOf(props), 1)
        setCarOption([...carOption])
    }
    // 추가한 옵션들 중에 취소를 할 경우
    const register = async (props) => {
        if (carNum === "" || carModel === ""|| carSeats === "" || carPrice === "" || carSelect === 0 || carFuel === 0){
            alert("입력되지 않은 값이 있습니다");
        }else {
            if (carNumCheck(carNum) === true){
                Swal.fire({
                    icon: 'warning',
                    title: '등록',
                    text: `[${props}] 등록하시겠습니까?`,
                    showCancelButton: true,
                    confirmButtonText: '등록',
                    cancelButtonText: '취소',
                }).then((res) => {
                    if (res.isConfirmed) {
                        const url1 = 'http://localhost:3001/admin/addcar'
                        const data1 = {
                            modelname: carModel,
                            vehicletype: carTypes[Number(carSelect)].name,
                            rentrateperday: carPrice,
                            fuel: carFuelTypes[Number(carFuel)].name,
                            numberofseats: carSeats
                        }
                        const url2 = 'http://localhost:3001/admin/addrentcar'
                        const data2 = {
                            licenseplateno: carNum,
                            modelname: carModel
                        }
                        axios.post(url1, data1)
                            .then (res => {
                                if (res.data.result === "success") {
                                    alert("차량 등록 완료.")
                                } else { 
                                    alert("차량 등록 실패.");
                                }
                            })
                            .catch (error => {
                                console.log(error);
                                alert("ERROR!");
                            });
                        axios.post(url2, data2)
                            .then (res => {
                                if (res.data.result === "success") {
                                    alert("렌트카 등록 완료.")
                                } else {
                                    alert("렌트카 등록 실패.");
                                }
                            })
                            .catch (error => {
                                console.log(error);
                                alert("ERROR!");
                            });
                    }
                });
            } else{
                alert("차량번호가 부적합합니다")
            }
        }
    };
    // 최종적으로 차량등록 버튼을 눌렀을때 존재해야하는 값들을 확인후, 가능할 경우 등록을 확인
    function carNumCheck(str) {
        if (/^\d{2}[가-힣]\d{4}/.exec(str) !== null && str.length === 7) {
            return true;
        }
        if (/^\d{3}[가-힣]\d{4}/.exec(str) !== null && str.length === 8) {
            return true;
        }
        return false
    }
    // 차량번호 정규표현식
    return (
        <div>
            <h2>차량 등록 하기</h2>
                <div style={{ display: 'flex', justifyContent: 'center',marginTop: '20px'}}>
                    <table>
                        <tbody>
                        <tr>
                            <th style={{ padding: '0 10px' }}>차량 번호</th>
                            <input style={{width: '100%',margin: '0 auto'}} value={carNum} onChange={onCarNumHandler}/>
                        </tr>
                        <tr>
                            <th style={{ padding: '0 10px' }}>모델</th>
                            <input style={{width: '100%',margin: '0 auto'}} value={carModel} onChange={onCarModelHandler}/>
                        </tr>
                        <tr>
                            <th style={{ padding: '0 10px' }}>차종</th>
                            <input
                                type="radio"
                                value="1"
                                checked={carSelect === "1"}
                                onChange={handleClickRadioButton}
                                defaultChecked
                                />
                            <label>
                                대형
                            </label>
                            <input
                                type="radio"
                                value="2"
                                checked={carSelect === "2"}
                                onChange={handleClickRadioButton}
                            />
                            <label>
                                중형
                            </label>
                            <input
                                type="radio"
                                value="3"
                                checked={carSelect === "3"}
                                onChange={handleClickRadioButton}
                            />
                            <label>
                                소형
                            </label>
                            <input
                                type="radio"
                                value="4"
                                checked={carSelect === "4"}
                                onChange={handleClickRadioButton}
                            />
                            <label>
                                승합
                            </label>
                            
                            <input
                                type="radio"
                                value="5"
                                checked={carSelect === "5"}
                                onChange={handleClickRadioButton}
                            />
                            <label>
                                SUV
                            </label>
                            <input
                                type="radio"
                                value="6"
                                checked={carSelect === "6"}
                                onChange={handleClickRadioButton}
                            />
                            <label>
                                고급
                            </label>
                        </tr>
                        <tr>
                            <th style={{ padding: '0 10px' }}>연료</th>
                            <input
                                type="radio"
                                value="1"
                                checked={carFuel === "1"}
                                onChange={handleClickRadioFuel}
                            />
                            <label>
                                휘발유
                            </label>
                            <input
                                type="radio"
                                value="2"
                                checked={carFuel === "2"}
                                onChange={handleClickRadioFuel}
                            />
                            <label>
                                경유
                            </label>
                            <input
                                type="radio"
                                value="3"
                                checked={carFuel === "3"}
                                onChange={handleClickRadioFuel}
                            />
                            <label>
                                LPG
                            </label>
                            <input
                                type="radio"
                                value="4"
                                checked={carFuel === "4"}
                                onChange={handleClickRadioFuel}
                            />
                            <label>
                                천연가스
                            </label>
                            <input
                                type="radio"
                                value="5"
                                checked={carFuel === "5"}
                                onChange={handleClickRadioFuel}
                            />
                            <label>
                                전기
                            </label>
                        </tr>
                        <tr>
                            <th style={{ padding: '0 10px' }}>좌석</th>
                            <input style={{width: '13%',marginLeft: 0}} value={carSeats} onChange={onCarSeatsHandler}/>
                        </tr>
                        <tr>
                            <th style={{ padding: '0 10px' }}>가격</th>
                            <input style={{width: '50%',margin: '0 auto'}} value={carPrice} onChange={onCarPriceHandler}/>
                        </tr>
                        <tr>
                            <th style={{ padding: '0 10px' }}>옵션</th>
                            <input style={{width: '100%',margin: '0 auto'}} value={newOption} onChange={onCarOptionHandler}/>
                            <td style={{ padding: '0 10px' }}>
                                <button onClick={() => addOption(newOption)}>추가하기</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            <br/>
            <br/>
            <div>
                <table>
                    <thead>
                    <tr>
                        <th style={{ padding: '0 10px' }}>차량 번호</th>
                        <th style={{ padding: '0 10px' }}>모델</th>
                        <th style={{ padding: '0 10px' }}>차종</th>
                        <th style={{ padding: '0 10px' }}>연료</th>
                        <th style={{ padding: '0 10px' }}>좌석</th>
                        <th style={{ padding: '0 10px' }}>가격</th>
                        <th style={{ padding: '0 10px' }}>옵션</th>
                        <th style={{ padding: '0 10px' }}>등록하기</th>
                    </tr>
                    </thead>
                    <thead>
                        <td style={{ padding: '0 10px' }}>{carNum}</td>
                        <td style={{ padding: '0 10px' }}>{carModel}</td>
                        <td style={{ padding: '0 10px' }}>{carTypes[Number(carSelect)].name}</td>
                        <td style={{ padding: '0 10px' }}>{carFuelTypes[Number(carFuel)].name}</td>
                        <td style={{ padding: '0 10px' }}>{carSeats}</td>
                        <td style={{ padding: '0 10px' }}>{carPrice}</td>
                        <td style={{ padding: '0 10px' }}>{showOption(carOption)}</td>
                        <td style={{ padding: '0 10px' }}>
                            <button onClick={() => register(carNum)}>등록하기</button>
                        </td>
                    </thead>
                </table>
            </div>
        </div>
    );
};

export default RegisterCar;