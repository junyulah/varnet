'use strict';

module.exports = {
    use: 'domain',
    type: 'map',
    reduce: (curDep, next) => {
        let rets = [];
        let depRet = curDep.depRet;
        for (let i = 0; i < depRet.length; i++) {
            let item = depRet[i];
            rets.push(next(item));
        }
        return rets;
    }
};
