# EthereumMiningCalculator
Basic Statistics Useful for Mining Ethereum


Currently under development, don't trust it just yet.

## Dev Requirements

* node.js & npm
* bower (npm install -g bower)
* grunt-cli (npm install -g grunt-cli)

## Getting Started

1. Install node.js. I reccomend using 'nvm' (node version manager) to do this so you can switch between
node versions at will.
2. Install bower globally ''''$ npm install -g bower''''
3. Install grunt globally ''''$ npm install -g grunt-cli''''
4. Switch to the this project dir and do an npm install ''''$ npm install''''
5. Run the build script with npm ''''npm start''''

PS. We're using node only cause it's easiest for angular dev - you don't need to write any actual node JS.


## What does what?

#### Node.js
We use node.js to run helpful dev packages, like the ones listed below.

#### Bower
Bower manages third-party dependencies.

#### Grunt
Grunt does menial tasks. Grunt automatically inserts script and link tags (from bower_components and the app folder)
into our index.html and then runs a html server on localhost:9001