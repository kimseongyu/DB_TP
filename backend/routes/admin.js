var express = require('express');
var router = express.Router();

var db = require('../public/javascripts/query');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// 조인을 이용한 질의

// RentCar table이 가지고 있는모든 차량들의 차량번호
// 각 차량번호의 차량 모델들이 가지고 있는 정보를 출력
router.post('/join', async (req, res, next) => {
    await db.query(
        `SELECT R.LICENSEPLATENO, R.MODELNAME, C.VEHICLETYPE, C.FUEL, C.NUMBEROFSEATS
        FROM RENTCAR R JOIN CARMODEL C
        ON R.MODELNAME = C.MODELNAME`,
        { autoCommit: true },
        result => {
            if (result) {
                data = result.rows;
                res.status(200).json({ result: 'success', data: data });
            } else {
                res.status(202).json({ result: 'fail' });
            }
        },
    );
});

// 그룹함수(SUM, AVG, COUNT, MAX, MIN)을 이용한 질의

// 현재 예약되어있는 차량들의 차량번호 별,
// 예약 날짜별 예약 내용들의 수를 출력한다.
router.post('/group', async (req, res, next) => {
    await db.query(
        `SELECT
        DECODE(GROUPING(LICENSEPLATENO),1,'ALL RESERVDATE',LICENSEPLATENO) AS "차량 번호",
        DECODE(GROUPING(RESERVEDATE),1,'ALL PLATENO',RESERVEDATE) AS "예약 날짜",
        COUNT(*) "개수"
        FROM RESERVATION
        GROUP BY GROUPING SETS(LICENSEPLATENO, RESERVEDATE)`,
        { autoCommit: true },
        result => {
            if (result) {
                data = result.rows;
                res.status(200).json({ result: 'success', data: data });
            } else {
                res.status(202).json({ result: 'fail' });
            }
        },
    );
});

// 윈도우 함수를 사용한 질의

// 이전 대여 내역에서 차량 번호와 차량당 획득한 대여 비용과
// 그 순위를 가격이 높은 순서대로 출력한다.
router.post('/window', async (req, res, next) => {
    await db.query(
        `SELECT LICENSEPLATENO "차량 번호",
        SUM(PAYMENT) "차량 당 대여 비용",
        RANK () OVER (ORDER BY SUM(PAYMENT) DESC) "순위"
        FROM PREVIOUSRENTAL
        GROUP BY LICENSEPLATENO`,
        { autoCommit: true },
        result => {
            if (result) {
                data = result.rows;
                res.status(200).json({ result: 'success', data: data });
            } else {
                res.status(202).json({ result: 'fail' });
            }
        },
    );
});

module.exports = router;
