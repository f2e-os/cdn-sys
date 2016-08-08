/**
 * 将一个序列换数组转化成一个数据对象。
 *
 * @param {Array} serializeArr 传入的序列化数组
 * @return {Object} 返回对象
 */
$.array2object = function (serializeArr) {
    var res = {};
    serializeArr.forEach(function (i) {
        if ($.isArray(res[i.name])) {
            res[i.name].push(i.value);
        }
        else if (typeof res[i.name] === 'string') {
            res[i.name] = [res[i.name], i.value];
        }
        else {
            res[i.name] = i.value;
        }
    });
    return res;
};

/**
 * 将一个表单内的elements值转化成一个序列化数组。
 * this 必须是一个form， 否则返回空数组 []
 *
 * @return {Array} 序列化数组
 */
$.fn.serializeObject = function () {
    return $.array2object( $(this).serializeArray() );
};