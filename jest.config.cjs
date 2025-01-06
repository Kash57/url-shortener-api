module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.mjs$": "babel-jest"
  },
  testMatch: ["**/test/**/*.test.mjs"],
  // extensionsToTreatAsEsm: [".mjs"],
  moduleFileExtensions: ["js", "mjs", "json", "node"],
};
