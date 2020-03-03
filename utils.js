function trim(str) {
    return str.replace(/\S/, "");
};

exports.stringToArr = function stringToArr(stringArr) {
    return stringArr.replace(/\[|\]/g, "").split(",");
};

exports.trimWhiteSpace = trim;