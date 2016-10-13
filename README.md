[![Build Status](https://travis-ci.org/alexvictoor/react-tc-dashboard.svg?branch=master)](https://travis-ci.org/alexvictoor/react-tc-dashboard)

# react-tc-dashboard
A very simple dashboard for TeamCity, built on React, Redux and written in TypeScript.  
This is mainly a pet project I am using to learn react/redux. Obviously feedbacks are welcome :)

## Usage
Check out the [online demo](https://alexvictoor.github.io/react-tc-dashboard) to get a first overview.
This demo is not plugged to any real TeamCity server. Builds notifications are fake  
To monitor builds of your TeamCity instance you need to:
- checkout branch gh-pages of this repo and set up a static http server serving these files
- modify file configuration.js in order to specify the URL of your TeamCity server and the builds you want to monitor
- activate [cors on your TeamCity server](https://confluence.jetbrains.com/display/TW/REST+API#RESTAPI-CORSSupport)

## Building from sources
npm3 is needed to be able to build the project.
You also need TypeScript2:
  npm i typescript -g

Then at the root of the project you can try to install all dependencies:
  npm i

To launch tests, using karma and webpack under the cover you just need to launch:
  npm test

Webpack is the bundler used here. If you are not familiar with it, you just need to know that a dev web server can 
be launch using "webpack-dev-server" and the application bundle file will be produced using command "webpack" 

