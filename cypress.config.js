/*const { defineConfig } = require('cypress');
module.exports = defineConfig({
e2e: {
baseUrl: 'https://opensource-demo.orangehrmlive.com',
},
screenshotOnRunFailure: true, // Auto-screenshot on test failure
screenshotsFolder: 'cypress/screenshots', // Screenshots save location
});*/
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',   // report output folder
      overwrite: false,               // don't overwrite old reports
      html: false,                    // generate JSON only first
      json: true                      // create JSON output for merging
    },
  },
  video: true, // Record videos
  videoUploadOnPasses: true, // Don't upload videos of passing tests
  videosFolder: 'cypress/videos', // Videos save location
  viewportWidth: 1280,
  viewportHeight: 720,
});
