module.exports = {
  version: 1, // REST client version up to 3!
  timeout: 4000, // Default Timeout for fetch requests
  logrequests: true, // Have it log requests to console, this can get quite heavy very quickly
  cache: { // Ablity to cache requests for later use without sending a new request
    allow: false, // Allow any caching or not
    size: 50, // What max size should the cache have?
  },
};
