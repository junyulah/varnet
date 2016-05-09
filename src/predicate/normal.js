'use strict';

module.exports = {
    type: 'normal',
    reduce: (curDep, next) => {
        return next(curDep.depRet);
    }
};
