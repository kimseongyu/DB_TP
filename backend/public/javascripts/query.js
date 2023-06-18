var db = require('oracledb');
var config = require('../../config/dbconfig');

// oracle database와 쉽게 data를 주고 받을 수 있도록 구현한 함수
const query = (sql, opt, func) => {
    return new Promise(async (resolve, reject) => {
        await db.getConnection(config, async (err, conn) => {
            if (err) {
                console.error(err.message);
            }

            await conn.execute(sql, [], opt, async (err, result) => {
                if (err) {
                    console.error(err.message);
                }

                await conn.close(err => {
                    if (err) {
                        console.error(err.message);
                    }

                    resolve(func(result));
                });
            });
        });
    });
};

module.exports = { query };
