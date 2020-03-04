function stringToArr(stringArr) {
  if (!stringArr) {
    return [];
  }

  return stringArr
    .replace(/\[|\]/g, "")
    .split(",")
    .map(s => s.trim())
    .filter(s => s !== "");
}

function wait(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

module.exports = { stringToArr, wait };
