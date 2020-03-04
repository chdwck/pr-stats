const faker = require("faker");

function pullRequest() {
  return {
    url: faker.internet.url(),
    id: faker.random.number(),
    node_id: faker.fake(),
    html_url: faker.internet.url(),
    diff_url: faker.internet.url(),
    patch_url: faker.internet.url(),
    issue_url: faker.internet.url(),
    number: faker.random.number(),
    state: "closed",
    locked: faker.random.boolean(),
    title: faker.commerce.productName(),
    user: {
      login: faker.internet.userName(),
      id: faker.random.number(),
      node_id: faker.fake(),
      avatar_url: faker.internet.url(),
      gravatar_id: "",
      url: faker.internet.url(),
      html_url: faker.internet.url(),
      followers_url: faker.internet.url(),
      following_url: faker.internet.url(),
      gists_url: faker.internet.url(),
      starred_url: faker.internet.url(),
      subscriptions_url: faker.internet.url(),
      organizations_url: faker.internet.url(),
      repos_url: faker.internet.url(),
      events_url: faker.internet.url(),
      received_events_url: faker.internet.url(),
      type: "User",
      site_admin: false
    },
    body: faker.lorem.text(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.past().toISOString(),
    closed_at: faker.date.past().toISOString(),
    merged_at: faker.date.past().toISOString(),
    merge_commit_sha: faker.fake(),
    assignee: faker.internet.userName(),
    assignees: [],
    requested_reviewers: [],
    requested_teams: [],
    labels: [],
    milestone: null,
    commits_url: faker.internet.url(),
    review_comments_url: faker.internet.url(),
    review_comment_url: faker.internet.url(),
    comments_url: faker.internet.url(),
    statuses_url: faker.internet.url(),
    author_association: "COLLABORATOR"
  };
}

exports.pullRequest = pullRequest;
