const { Octokit } = require("@octokit/rest");
const isAfter = require("date-fns/isAfter");
const parseISO = require("date-fns/parseISO");
const compareAsc = require("date-fns/compareAsc");
const differenceInBusinessDays = require("date-fns/differenceInBusinessDays");

/**
 * @param {Object} params
 * @param {String} params.owner - the owner of the repos you want to get cycle time for
 * @param {[String]} params.repos - list of repo names you want to get cycle time for
 * @param {[String]} params.users - optional list of users to consider when calculating cycle time. Useful for calculating cycle time for a team
 * @param {String} params.from - optional argument to only consider prs past a certain date. Format: YYYY-MM-DD
 * @param {String} params.to - optional argument to only consider prs before a certain date. Format: YYYY-MM-DD
 */
async function cycleTime({
  owner,
  repos,
  users = [],
  from = null,
  to = null,
  cycleTimeGoal = null
}) {
  const gh = new Octokit({ auth: process.env.GH_API_KEY });

  const prs = [];
  let lastFetchedList = [];
  let page = 1;
  let error = null;

  const formattedForm = parseISO(new Date(form).toISOString());
  const formattedTo = parseISO(new Date(to).toISOString());

  do {
    try {
      const results = await gh.pulls.list({
        owner,
        repo: repos[0],
        state: "closed",
        per_page: 100,
        page
      });
      lastFetchedList = results.data.map(toUsefulData);
      prs.push(...lastFetchedList);
    } catch (e) {
      error = e;
      console.warn(error);
    }
    page++;
  } while (!hasFetchedFarEnoughBack(lastFetchedList, from) && error === null);

  const filteredPrs = filterPrsByUsers(
    removePrsBeforeAndAfter(prs, { from: formattedForm, to: formattedTo }),
    users
  );

  const prsWithCalculatedCycleTimes = filteredPrs
    .map(pr => ({
      ...pr,
      daysToClose: differenceInBusinessDays(pr.closed_at, pr.created_at),
      daysToReview:
        pr.first_reviewed !== null
          ? differenceInBusinessDays(pr.first_reviewed, pr.created_at)
          : 0
    }))
    .sort((a, b) => a.daysToClose - b.daysToClose);

  const { totalDaysToClose, totalDaysToReview } = filteredPrs.reduce(
    (acc, pr) => ({
      totalDaysToClose:
        acc.totalDaysToClose +
        differenceInBusinessDays(pr.closed_at, pr.created_at),
      totalDaysToReview:
        acc.totalDaysToReview +
        differenceInBusinessDays(pr.first_reviewed, pr.created_at)
    }),
    { totalDaysToClose: 0, totalDaysToReview: 0 }
  );

  const prsPastCycleTimeGoal =
    cycleTimeGoal !== null &&
    prsWithCalculatedCycleTimes.filter(pr => pr.daysToClose > cycleTimeGoal);

  const avgDaysToClose = totalDaysToClose / filteredPrs.length;
  const avgDaysToReview = totalDaysToReview / filterPrs.length;

  console.log(prsPastCycleTimeGoal);

  console.log(`Number of pull-requests considered: ${filteredPrs.length}`);
  console.log(`Average days to close a pull-request: ${avgDaysToClose}`);
  console.log(
    `Average days to start reviewing a pull-request: ${avgDaysToReview}`
  );
}

function removePrsBeforeAndAfter(prs, { from = null, to = null }) {
  if (from === null && to === null) {
    return prs;
  }

  return prs.filter(pr => {
    const isBeforeOrEqualFrom =
      from === null || compareAsc(pr.created_at, from) < 1;
    const isAfterOrEqualTo = to === null || compareAsc(pr.created_at, to) > -1;
    return isBeforeOrEqualFrom && isAfterOrEqualTo;
  });
}

function filterPrsByUsers(prs, users) {
  if (users.length < 1) {
    return prs;
  }

  return prs.filter(pr => users.includes(pr.author_name));
}

function hasFetchedFarEnoughBack(prList, from = null) {
  if (from === null) {
    return prList.length < 100;
  }

  return prList.some(data => isAfter(data.created_at, from));
}

function toUsefulData(pr) {
  return {
    created_at: parseISO(pr.created_at),
    closed_at: parseISO(pr.closed_at),
    author_name: pr.user.login,
    title: pr.title,
    url: pr.url,
    first_reviewed:
      pr.reviews.length > 0 ? parseISO(pr.reviews[0].submitted_at) : null
  };
}

module.exports = {
  cycleTime,
  _helpers: {
    hasFetchedFarEnoughBack,
    toUsefulData,
    filterPrsByUsers,
    removePrsBeforeAndAfter
  }
};
