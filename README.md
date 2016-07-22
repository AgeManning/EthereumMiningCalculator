# EthereumMiningCalculator
Advanced Statistics for Mining Ethereum and other Cryptocurrencies.

Available at: [www.TheCalc.io](https://thecalc.io)

This project is still under development, there may be bugs.

## Single-Page AngularJS app

This is a single-page AngularJS app. You can access a hosted version at [thecalc.io](https://thecalc.io).

You can also download/clone this repository and host your very own development server using Node.js.


## Getting Started


1. Install node.js. 

> I reccomend using [nvm](https://github.com/creationix/nvm) so you can switch between node versions easily. Whilst not required, it's worth the effort.

2. Install bower globally `$ npm install -g bower`
3. Install grunt globally `$ npm install -g grunt-cli`
4. Switch to the project dir and do an npm install `$ npm install`
5. Run the build script and launch the server with npm `$ npm start`
6. Use Chrome to navigate to your new server at [localhost](http://localhost:9001) (or [loopback](http:127.0.0.1:9001)) 

## Third-party components

Here are some technologies we rely on.

### Angular.js

#### [AngularJS](https://angularjs.org/)

This is an [AngularJS](https://angularjs.org/), HTML, JS and CSS single-page web-app without it's own "backend" server. (We do however use online third-party APIs).

### Third-party APIs

* [Poloniex](https://poloniex.com/)

We use the Poloniex API to determine current exchange rates.

* [Bitpay](https://bitpay.com/)

We also use the Bitpay API to determine further current exchange rates.


* [etherchain.org](https://etherchain.org/)

The etherchain.org API supplies us with various current blockchain stats including difficulty, block time, hash rate, current block number


### Development

* [Node.js](https://nodejs.org/en/)

We use node.js to run helpful scripts whilst we're developing. Not required for production. (No actual node.js coding is required).

* [Bower](https://bower.io/)

Bower manages third-party dependencies. Eg, Want to install highcharts? `bower install --save highcharts`. Highcharts will then be loaded in bower_components and the grunt script will automatically load its script and link tags
to our index.html.

* [Grunt](http://gruntjs.com/)

Grunt does menial tasks. Grunt automatically inserts script and link tags (from bower_components and the app folder) into our index.html and then runs a html server on localhost:9001
