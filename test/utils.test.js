const { stringToArr, wait } = require("../src/utils");

test("stringToArr", () => {
  expect(stringToArr(undefined)).toEqual(expect.arrayContaining([]));
  expect(stringToArr(null)).toEqual(expect.arrayContaining([]));
  expect(stringToArr("[]")).toEqual(expect.arrayContaining([]));
  expect(stringToArr("[repo1]")).toEqual(["repo1"]);
  expect(stringToArr("[repo1, repo2, repo3]")).toEqual([
    "repo1",
    "repo2",
    "repo3"
  ]);
  expect(stringToArr("[repo1 ,repo2 ,repo3]")).toEqual([
    "repo1",
    "repo2",
    "repo3"
  ]);
  expect(stringToArr("[repo1,repo2,repo3]")).toEqual([
    "repo1",
    "repo2",
    "repo3"
  ]);
});

test("wait", async () => {
  const start = new Date();
  await wait(1000);
  const end = new Date();
  const time = end.getTime() - start.getTime();
  expect(time).toBeGreaterThanOrEqual(1000);
});
