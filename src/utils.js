/**
 * Used to parse params passed in from commmand line (yargs)
 * @param {String} stringArr - a formated string that looks like a
 * standard JS array or variables. ex: [item1, item2, item3]
 * @returns {[String]}
 */
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

/**
 * basically a sleep function
 * @param {Number} delay - milliseconds to wait
 * @returns {Promise}
 */
function wait(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

module.exports = { stringToArr, wait };
