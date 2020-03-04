const { Octokit } = require("@octokit/rest");
const isAfter = require("date-fns/isAfter");
const parseISO = require("date-fns/parseISO");
const compareAsc = require("date-fns/compareAsc");

/**
 * @param {Object} params
 * @param {String} params.owner - the owner of the repos you want to get cycle time for
 * @param {[String]} params.repos - list of repo names you want to get cycle time for
 * @param {[String]} params.users - optional list of users to consider when calculating cycle time. Useful for calculating cycle time for a team
 * @param {String} params.from - optional argument to only consider prs past a certain date. Format: YYYY-MM-DD
 * @param {String} params.to - optional argument to only consider prs before a certain date. Format: YYYY-MM-DD
 */
async function cycleTime({ owner, repos, users = [], from = null, to = null }) {
  const gh = new Octokit({ auth: process.env.GH_API_KEY });

  const prs = [];
  let lastFetchedList = [];
  let page = 1;
  let error = null;

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


}

function removePrsBeforeAndAfter(prs, { from = null, to = null }) {
  if (from === null && to === null) {
    return prs;
  }

  var formattedFrom = parseISO((new Date(from).toISOString()));
  var formattedTo = parseISO((new Date(to).toISOString()));

  return prs.filter(pr => {
    const createdAt = parseISO(pr.created_at);
    const isBeforeOrEqualFrom = from === null || compareAsc(createdAt, formattedFrom) < 1;
    const isAfterOrEqualTo = to === null || compareAsc(createdAt, formattedTo) > -1;
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

  const formattedFrom = parseISO(new Date(from).toISOString());

  return prList.some(data => isAfter(parseISO(data.created_at), formattedFrom));
}

function toUsefulData(pr) {
  return {
    created_at: pr.created_at,
    closed_at: pr.closed_at,
    author_name: pr.user.login,
    title: pr.title,
    url: pr.url
  };
}

module.exports = {
  cycleTime,
  _helpers: { hasFetchedFarEnoughBack, toUsefulData, filterPrsByUsers, removePrsBeforeAndAfter }
};
