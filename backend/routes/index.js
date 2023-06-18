var express = require('express');
var router = express.Router();
var mailer = require('../public/javascripts/mailer');

var db = require('../public/javascripts/query');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

// Login 기능, email과 password를 받아서 login을 진행한다.
// login 성공시 { result: 'success', cno: CNO }를 front로 전송한다.
// login 실패시 { result: 'fail' }를 front로 전송한다.
router.post('/login', async (req, res, next) => {
    await db.query(
        `SELECT CNO FROM CUSTOMER WHERE EMAIL = '${req.body.email}' and PASSWD = '${req.body.password}'`,
        {},
        result => {
            data = result.rows[0];
            if (data) {
                res.status(200).json({ result: 'success', cno: data[0] });
            } else {
                res.status(202).json({ result: 'fail' });
            }
        },
    );
});

// 회원가입 기능, name, password, email을 받아서 회원가입을 진행한다.
// 현재 가장 큰 CNO보다 1큰 번호를 할당해준다.
// 똑같은 email이 존재시 중복가입이 되는 것으로 판단한다.
// 회원가입 성공시 { result: 'success' }를 front로 전송한다.
// 중복가입이 되는 등 회원가입 실패시 { result: 'fail' }를 front로 전송한다.
router.post('/signup', async (req, res, next) => {
    await db.query(
        `INSERT INTO CUSTOMER
        VALUES ((SELECT MAX(CNO) FROM CUSTOMER)+1, 
        '${req.body.name}', '${req.body.password}', '${req.body.email}')`,
        { autoCommit: true },
        result => {
            console.log(result);
            if (result) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(202).json({ result: 'fail' });
            }
        },
    );
});

// 예약 내역, 현재 대여 내역, 이전 대여 내역을 조사한다.
// 조사 성공시 { result: 'success', reserve: [], current: [], prev: [] }를 front로 전송한다.
// 조사 실패시 { result: 'fail' }를 front로 전송한다.
router.post('/myRent', async (req, res, next) => {
    data = { result: 0, reserve: [], current: [], prev: [] };

    // 예약 내역에서 차번호, 모델명, 예약일, 대출일, 반납일, 일당금액을 가져온다.
    await db.query(
        `SELECT RE.LICENSEPLATENO, CA.MODELNAME, TO_CHAR(RE.RESERVEDATE), TO_CHAR(RE.STARTDATE) , TO_CHAR(RE.ENDDATE) , CA.RENTRATEPERDAY
        FROM RESERVATION RE, CARMODEL CA, RENTCAR RC
        WHERE RE.LICENSEPLATENO = RC.LICENSEPLATENO AND RC.MODELNAME = CA.MODELNAME AND RE.CNO = ${req.body.cno}`,
        { autoCommit: true },
        result => {
            if (result) {
                data.reserve = result.rows;
                data.result += 1;
            }
        },
    );

    // 이전대여 내역에서 차번호, 모델명, 대출일, 반납일, 비용을 가져온다.
    await db.query(
        `SELECT PR.LICENSEPLATENO, CA.MODELNAME, TO_CHAR(PR.DATERENTED), TO_CHAR(PR.DATERETURNED) , PR.PAYMENT
        FROM PREVIOUSRENTAL PR, CARMODEL CA, RENTCAR RC
        WHERE PR.LICENSEPLATENO = RC.LICENSEPLATENO AND RC.MODELNAME = CA.MODELNAME AND PR.CNO = ${req.body.cno}`,
        { autoCommit: true },
        result => {
            if (result) {
                data.prev = result.rows;
                data.result += 1;
            }
        },
    );

    // 현재 대여 내역에서 차번호, 모델명, 대출일, 반납일, 일당금액을 반환한다.
    await db.query(
        `SELECT RC.LICENSEPLATENO, CA.MODELNAME, TO_CHAR(RC.DATERENTED) , TO_CHAR(RC.RETURNDATE) , CA.RENTRATEPERDAY
        FROM CARMODEL CA, RENTCAR RC
        WHERE RC.MODELNAME = CA.MODELNAME AND RC.CNO = ${req.body.cno}`,
        { autoCommit: true },
        result => {
            if (result) {
                data.current = result.rows;
                data.result += 1;
            }
        },
    );
    if (data.result == 3) {
        data.result = 'success';
        res.status(200).json(data);
    } else {
        res.status(202).json({ result: 'fail' });
    }
});

// 예약날과 반납날을 지정하여 예약할 수 있는 차량들을 조회한다.
// 조사 성공시 { result: 'success', data: [] }를 front로 전송한다.
// 조사 실패시 { result: 'fail' }를 front로 전송한다.
router.post('/car', async (req, res, next) => {
    await db.query(
        `
    SELECT R.LICENSEPLATENO, R.MODELNAME, VEHICLETYPE, RENTRATEPERDAY, FUEL, NUMBEROFSEATS,
    (SELECT LISTAGG(OPTIONNAME, ', ') FROM OPTIONS O WHERE O.LICENSEPLATENO = R.LICENSEPLATENO) AS OPTIONNAME
    FROM RENTCAR R JOIN CARMODEL C ON R.MODELNAME = C.MODELNAME
    WHERE R.LICENSEPLATENO NOT IN (
    SELECT DISTINCT LICENSEPLATENO
    FROM (
    SELECT LICENSEPLATENO, STARTDATE AS S, ENDDATE AS E
    FROM RESERVATION
    UNION ALL
    SELECT LICENSEPLATENO, DATERENTED AS S, RETURNDATE AS E
    FROM RENTCAR)
    WHERE TO_DATE('${req.body.start}', 'YYYY/MM/DD') BETWEEN S AND E
    OR TO_DATE('${req.body.end}', 'YYYY/MM/DD') BETWEEN S AND E
    )
    `,
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

// 차번호, 대출일, 반납일, CNO를 받아서 예약을 진행한다.
// 같은 차량에 대출일이 겹치면 예약이 안 된다.
// 예약 성공시 { result: 'success' }를 front로 전송한다.
// 예약 실패시 { result: 'fail' }를 front로 전송한다.
router.post('/reserve', async (req, res, next) => {
    await db.query(
        `INSERT INTO RESERVATION 
        SELECT '${req.body.plateno}', TO_DATE('${new Date().toISOString().substring(0, 10)}','YYYY/MM/DD'), TO_DATE('${
            req.body.start
        }', 'YYYY/MM/DD'), TO_DATE('${req.body.end}', 'YYYY/MM/DD'), ${req.body.cno}
        FROM DUAL 
        WHERE 0 = (SELECT COUNT(*) FROM RESERVATION
        WHERE '${req.body.plateno}' = LICENSEPLATENO AND 
        (STARTDATE BETWEEN TO_DATE('${req.body.start}', 'YYYY/MM/DD') AND TO_DATE('${req.body.end}', 'YYYY/MM/DD')
        OR ENDDATE BETWEEN TO_DATE('${req.body.start}', 'YYYY/MM/DD') AND  TO_DATE('${req.body.end}', 'YYYY/MM/DD')))`,
        { autoCommit: true },
        result => {
            if (result) {
                if (result.rowsAffected == 1) {
                    res.status(200).json({ result: 'success' });
                } else {
                    res.status(202).json({ result: 'fail' });
                }
            } else {
                res.status(202).json({ result: 'fail' });
            }
        },
    );
});

// 차번호, CNO를 받아서 예약을 취소한다.
// 예약 취소 성공시 { result: 'success' }를 front로 전송한다.
// 예약 취소 실패시 { result: 'fail' }를 front로 전송한다.
router.post('/cancel', async (req, res, next) => {
    await db.query(
        `DELETE FROM RESERVATION
        WHERE CNO = ${req.body.cno} AND LICENSEPLATENO = '${req.body.plateno}' AND STARTDATE = TO_DATE('${req.body.start}', 'YY/MM/DD')`,
        { autoCommit: true },
        result => {
            if (result) {
                if (result.rowsAffected == 1) {
                    res.status(200).json({ result: 'success' });
                } else {
                    res.status(202).json({ result: 'fail' });
                }
            } else {
                res.status(202).json({ result: 'fail' });
            }
        },
    );
});

// 차번호, CNO를 받아서 차량 반납을 진행한다.
// 현재 차량 목록(RentCar)에서 이전 대여 목록 (PreviousRental)로 옮긴다.
// 반납이 성공하였으면 email을 front로 전송하여 email을 전송하도록 한다.
// 예약 성공시 { result: 'success', data: email }을 front로 전송한다.
// 예약 실패시 { result: 'fail' }를 front로 전송한다.
router.post('/return', async (req, res, next) => {
    next = true;
    // 이전 대여 목록에 반납할 차량 정보를 삽입한다.
    await db.query(
        `INSERT INTO PREVIOUSRENTAL 
        SELECT R.LICENSEPLATENO, R.DATERENTED, R.RETURNDATE, 
        (RETURNDATE - DATERENTED) * (SELECT RENTRATEPERDAY FROM CARMODEL C WHERE C.MODELNAME = R.MODELNAME)
        , R.CNO
        FROM RENTCAR R
        WHERE CNO = ${req.body.cno} AND LICENSEPLATENO = '${req.body.plateno}'`,
        { autoCommit: true },
        result => {
            if (!result || result.rowsAffected != 1) {
                next = false;
            }
        },
    );
    if (next == false) {
        res.status(202).json({ result: 'fail' });
        return;
    }
    // RentCar table에서 반납한 차량의 정보를 지운다.
    // DATERENTED, RETURNDATE, CNO를 NULL로 채워준다.
    await db.query(
        `UPDATE RENTCAR 
        SET
        DATERENTED = NULL,
        RETURNDATE = NULL,
        CNO = NULL
        WHERE CNO = ${req.body.cno} AND LICENSEPLATENO = '${req.body.plateno}'`,
        { autoCommit: true },
        result => {
            if (!result || result.rowsAffected != 1) {
                next = false;
            }
        },
    );
    if (next == false) {
        res.status(202).json({ result: 'fail' });
        return;
    }
    // 사용자의 Email을 받아서 전송해준다.
    await db.query(
        `SELECT EMAIL
        FROM CUSTOMER
        WHERE CNO = ${req.body.cno}`,
        { autoCommit: true },
        result => {
            if (result) {
                email = result.rows;
                emailParam = {
                    toEmail: result.rows[0][0],
                    subject: `[차차렌터차] 차량이 반납되었습니다.`,
                    text: `${req.body.plateno} 번호의 차량이 반납되었습니다.`,
                };
                mailer.sendGmail(emailParam);
                res.status(200).json({ result: 'success' });
            } else {
                res.status(202).json({ result: 'fail' });
            }
        },
    );
});

module.exports = router;
