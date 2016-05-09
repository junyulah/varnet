'use strict';

module.exports = {
    use: 'domain',
    type: 'any',
    reduce: (curDep, next) => {
        let depRet = curDep.depRet;
        for (let i = 0; i < depRet.length; i++) {
            let item = depRet[i];
            if (!next(item)) {
                return false;
            }
        }
        return true;
    }
};
