var path = require('path');

exports["localhost"] = {
    root: __dirname,
    debug: false,
    buildFilter: function (pathname) {
        if (/cdn\/js\/(libs|scripts\b)/.test(pathname)
            || /index\.php/.test(pathname)
            || /cdn\/demos/.test(pathname)
        ) {
            return false;
        }
        else {
            return true;
        }
    },
    output: path.join(__dirname, '../cdn-sys-out/')
};
