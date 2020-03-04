const parseISO = require("date-fns/parseISO");
const {
  _helpers: {
    hasFetchedFarEnoughBack,
    toUsefulData,
    filterPrsByUsers,
    removePrsBeforeAndAfter
  }
} = require("../src/cycleTime");
const { pullRequest } = require("./data/pullRequest.js");

describe("hasFetchedFarEnoughBack", () => {
  var prList = [
    {
      created_at: new Date("2020-01-22").toISOString(),
      closed_at: new Date("2020-01-23").toISOString(),
      author_name: "chdwck",
      url: "www.somewhere.com/1"
    },
    {
      created_at: new Date("2020-01-24").toISOString(),
      closed_at: new Date("2020-01-25").toISOString(),
      author_name: "chdwck",
      url: "www.somewhere.com/2"
    }
  ];

  it("should return false if there aren't any prs past the from argument", () => {
    expect(hasFetchedFarEnoughBack(prList, "2020-01-26")).toEqual(false);
  });

  it("should return true if there are any prs past the from argument", () => {
    expect(hasFetchedFarEnoughBack(prList, "2020-01-23")).toEqual(true);
  });

  it("should return true if list is less then 100 items if from is null", () => {
    expect(hasFetchedFarEnoughBack(prList, null)).toEqual(true);
  });
});

describe("toUsefulData", () => {
  it("should correctly extract the data we want to use", () => {
    const pr = pullRequest();
    expect(toUsefulData(pr)).toMatchObject({
      created_at: parseISO(pr.created_at),
      closed_at: parseISO(pr.closed_at),
      author_name: pr.user.login,
      title: pr.title,
      url: pr.url,
      first_reviewed: pr.reviews[0].data.submitted_at
    });
  });
});

describe("filterPrsByUsers", () => {
  const users = ["chdwck", "shihrer"];
  const expected = [
    {
      author_name: "chdwck"
    },
    {
      author_name: "shihrer"
    }
  ];
  var prList = [...expected, { author_name: "pomc" }];
  it("should correctly filter out prs that aren't authored by specified users", () => {
    expect(filterPrsByUsers(prList, users)).toEqual(expected);
  });

  it("should return an unfiltered list if users is empty", () => {
    expect(filterPrsByUsers(prList, [])).toEqual(prList);
  });
});

describe("removePrsBeforeAndAfter", () => {
  const prList = [
    { created_at: new Date("2020-01-01").toISOString() },
    { created_at: new Date("2020-01-02").toISOString() },
    { created_at: new Date("2020-01-03").toISOString() },
    { created_at: new Date("2020-04-04").toISOString() }
  ];

  var to = "2020-01-02";
  var expectedTo = [prList[1], prList[2], prList[3]];

  var from = "2020-01-03";
  var expectedFrom = [prList[0], prList[1], prList[2]];

  var expectedFromAndTo = [prList[1], prList[2]];

  it("should only return dates after the to date", () => {
    expect(removePrsBeforeAndAfter(prList, { to })).toEqual(expectedTo);
  });

  it("should only return dates before the from date", () => {
    expect(removePrsBeforeAndAfter(prList, { from })).toEqual(expectedFrom);
  });

  it("should only return the dates between to and from", () => {
    expect(removePrsBeforeAndAfter(prList, { to, from })).toEqual(
      expectedFromAndTo
    );
  });

  it("should return the whole list if to and from are null", () => {
    expect(removePrsBeforeAndAfter(prList, {})).toEqual(prList);
  });
});
