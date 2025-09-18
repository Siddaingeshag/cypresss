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
},
video: true, // Record videos
videoUploadOnPasses: true, // Don't upload videos of passing tests
videosFolder: 'cypress/videos', // Videos save location
viewportWidth: 1280, // Set video dimensions
viewportHeight: 720,
});