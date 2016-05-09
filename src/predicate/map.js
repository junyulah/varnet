'use strict';

module.exports = {
    use: 'domain',
    type: 'map',
    reduce: (depRet, next) => {
        let rets = [];
        for (let i = 0; i < depRet.length; i++) {
            let item = depRet[i];
            rets.push(next(item));
        }
        return rets;
    }
};
