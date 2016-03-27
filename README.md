# EthereumMiningCalculator
Basic Statistics Useful for Mining Ethereum


Currently under development, don't trust it just yet.

## Getting Started

_I haven't tested these setup commands. There may be extra steps, but it should be straight-forward._

1. Install node.js. I reccomend using [nvm](https://github.com/creationix/nvm) so you can switch between
node versions easily (not required for this project).
2. Install bower globally `$ npm install -g bower`
3. Install grunt globally `$ npm install -g grunt-cli`
4. Switch to the project dir and do an npm install `$ npm install`
5. Run the build script and launch the server with npm `$ npm start`
6. _..._
7. Profit

## What does what?

#### Node.js
We use node.js to run helpful dev packages, like the ones listed below. No actual node.js coding is required.

#### Bower
Bower manages third-party dependencies. Eg, Want to install highcharts? `bower install --save highcharts`. Highcharts
will then be loaded in bower_components and the grunt script will automatically load its script and link tags
to our index.html.

#### Grunt
Grunt does menial tasks. Grunt automatically inserts script and link tags (from bower_components and the app folder)
into our index.html and then runs a html server on localhost:9001