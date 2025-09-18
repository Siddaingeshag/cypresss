const { defineConfig } = require('cypress');
 
module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
 
    // Screenshot & video settings
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
   
    video: true,
    videoUploadOnPasses: true,
    videosFolder: 'cypress/videos',
 
    // Reporter configuration
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
      charts: true,
      reportPageTitle: 'OrangeHRM Test Report',
      inlineAssets: true,
    },
 
    viewportWidth: 1280,
    viewportHeight: 720
  }
});
 
 