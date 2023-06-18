# Emergency Message App BackEnd

## Execute

```
npm install
npm stasrt
```

config file 수정하기

## API

Login

post /login

parmeter <br>

-   email : string
-   password : string

reponse <br>

{"result":"success","cno":10006}

{"result":"fail"}

---

SignUp

post /signup

parmeter<br>

-   email : string
-   password : string
-   name : string

reponse<br>
{"result":"success"}

{"result":"fail"}

---

MyRentCar
이전에 previousRental, CurrentRental, Reservation 목록을 볼 수 있음

post /myRent

parmeter <br>

-   cno : number

reponse <br>
{"result":"success",
"reserve":[["55호5555","스파크","23/06/05","23/06/26","23/06/29",38000]],
"current":[],
"prev":[["55호5555","스파크","23/04/04","23/04/05",76000]]}

{"result":"fail"}

---

Car
현재 예약할 수 있는 Car list를 볼 수 있음

post /car

parmeter <br>

-   start : string
-   end : string

reponse <br>
{"result":"success",
"data":[["24버1253","스파크","소형",38000,"가솔린",5,"크루즈 컨트롤"],["56마3156","K5","중형",48000,"LPG",5,"후방 카메라"]]}

{"result":"fail"}

---

Reservation
예약하기

post /reserve

parmeter <br>

-   plateno : string
-   start : string
-   end : string
-   cno : number

reponse <br>
{"result":"success"}

{"result":"fail"}

---

Cancel
예약취소

post /cancel

parmeter <br>

-   plateno : string
-   start : string
-   cno : number

reponse <br>
{"result":"success"}

{"result":"fail"}

---

Return
반납

post /return

parmeter <br>

-   plateno : string
-   cno : number

reponse <br>
{"result":"success","data":"soonyang@cnu.ac.kr"}

{"result":"fail"}

---

관리자 API

---

JOIN을 사용한 질의
모든 차량들의 차량번호, 차량들의 정보를 출력

post admin/join

parmeter <br>

reponse <br>
{"result":"success","data":[["24버1253","스파크","소형","가솔린",5],["55호5555","스파크","소형","가솔린",5]]}

{"result":"fail"}

---

GROUP 함수을 사용한 질의
현재 예약되어있는 차량들의 차량번호 별, 예약 날짜별 예약 내용들의 수를 출력.

post admin/group

parmeter <br>

reponse <br>
{"result":"success","data":[["55호5555","ALL PLATENO",1],["ALL RESERVDATE","23/06/06",1]]}

{"result":"fail"}

---

WINDOW 함수을 사용한 질의
이전 대여 내역에서 차량 번호와 차량당 획득한 대여 비용과 그 순위를 가격이 높은 순서대로 출력.

post admin/window

parmeter <br>

reponse <br>
{"result":"success","data":[["12삼4567",4200000,1],["33로4561",1040000,2]]}

{"result":"fail"}

---
