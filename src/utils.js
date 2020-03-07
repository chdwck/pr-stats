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

/**
 * Creates a table to be printed using same object keys as headers
 * @param {[Object]}
 * @returns {String}
 */
function formatTable(objs) {
  const arrayOfArrays = Object.keys(
    objs.reduce((acc, obj) => ({ ...acc, ...obj }), {})
  ).map(header => [header, ...objs.map(obj => obj[header] || "n/a")]);

  const maxLengths = arrayOfArrays.map(column =>
    column.reduce((acc, str) => (acc >= str.length ? acc : str.length), 0)
  );

  const [col1MaxLength, ...restMaxLengths] = maxLengths;
  const dashStr = restMaxLengths.reduce(
    (acc, maxLength) => (acc += "|" + "-".repeat(maxLength + 2)),
    "-".repeat(col1MaxLength + 2)
  );

  let table = "\n";
  for (let i = 0; i < arrayOfArrays[0].length; i++) {
    let nextRow = "";
    for (let j = 0; j < arrayOfArrays.length; j++) {
      const item = arrayOfArrays[j][i];
      if (j !== 0) nextRow += "|";
      nextRow += " " + item + " ".repeat(maxLengths[j] - item.length + 1);
    }

    if (i < 2) {
      table += `${dashStr}\n`;
    }

    table += `${nextRow}\n`;
    nextRow = "";
  }

  return table + dashStr;
}

module.exports = { stringToArr, wait, formatTable };
