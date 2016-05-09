'use strict';

module.exports = {
    type: 'normal',
    reduce: (depRet, next) => {
        return next(depRet);
    }
};
