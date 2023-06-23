const schedule = require('node-schedule');

var db = require('../public/javascripts/query');

// 매시 정각 scheduler가 대출기간이 끝난 차량을 이전 대여 내역(PreviousRental)으로 옮기고
// 대출기간이 시작된 차량을 예약내역(Reservation)에서 현재 대여 내역(RentCar)으로 옮긴다.
// */10 * * * * * <- 시간 이걸로 바꿔주면 함수 10초마다 실행됨
schedule.scheduleJob(`0 0 15 * * *`, async () => {
    // 대출기간이 끝난 차량정보를 PreviousRental로 옮긴다.
    // CARMODEL에서 RENTRATEPERDAY를 사용하여 지불한 금액을 삽입한다.
    await db.query(
        `
    INSERT INTO PREVIOUSRENTAL
    SELECT R.LICENSEPLATENO, R.DATERENTED, R.RETURNDATE,
    (RETURNDATE - DATERENTED) * (SELECT RENTRATEPERDAY FROM CARMODEL C WHERE C.MODELNAME = R.MODELNAME)
    , R.CNO
    FROM RENTCAR R
    WHERE RETURNDATE <= SYSDATE-1`,
        { autoCommit: true },
        result => {},
    );

    // RentCar table에서 대출 기간이 끝난 차량들에서
    // DATERENTED, RETURNDATE, CNO를 NULL로 채워준다.
    await db.query(
        `
    UPDATE RENTCAR
    SET
        DATERENTED = NULL,
        RETURNDATE = NULL,
        CNO = NULL
    WHERE RETURNDATE <= SYSDATE-1`,
        { autoCommit: true },
        result => {},
    );

    // 대출기간이 시작된 차량들의 정보를 RentCar로 옮겨서 update 한다.
    await db.query(
        `
    UPDATE RENTCAR R
    SET
        R.DATERENTED = SYSDATE,
        R.RETURNDATE = (SELECT RE.ENDDATE
                FROM RESERVATION RE
                WHERE R.LICENSEPLATENO = RE.LICENSEPLATENO
                AND RE.STARTDATE <= SYSDATE),
        R.CNO = (SELECT RE.CNO
                FROM RESERVATION RE
                WHERE R.LICENSEPLATENO = RE.LICENSEPLATENO
                AND RE.STARTDATE <= SYSDATE)
    WHERE R.LICENSEPLATENO IN (SELECT RE.LICENSEPLATENO
                FROM RESERVATION RE
                WHERE RE.STARTDATE <= SYSDATE)`,
        { autoCommit: true },
        result => {},
    );

    // 예약목록인 reservation table에서 대출기간이 시작된 차량들의 정보를 삭제한다.
    await db.query(
        `DELETE FROM RESERVATION
    WHERE STARTDATE <= SYSDATE`,
        { autoCommit: true },
        result => {},
    );
    console.log('예약차량 Rent되었습니다.');
});
