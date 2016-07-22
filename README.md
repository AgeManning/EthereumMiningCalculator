# EthereumMiningCalculator

Advanced statistics for mining ethereum and other cryptocurrencies.

## Single-Page AngularJS Web Application

This is a single-page AngularJS app. You can access a hosted version at [thecalc.io](https://thecalc.io).

You can also download/clone this repository and host your very own development server using Node.js.

> This project is still under development, please report bugs by creating [issues](https://github.com/AgeManning/EthereumMiningCalculator/issues).


## Getting Started

Ensure you have [Node.js](https://nodejs.org/en/) installed. 

> I reccomend installing node with [nvm](https://github.com/creationix/nvm). It allows you to switch easily between node versions. Whilst not required, it's worth the effort.

Enter the following commands in your terminal:

``` bash
$ git clone https://github.com/AgeManning/EthereumMiningCalculator.git
$ cd EthereumMiningCalculator/
$ npm install -g npm    # Update npm.
$ npm install -g bower    # Install bower.
$ npm install -g grunt-cli    # Install grunt.
$ npm install    # Install the local development dependencies.
$ npm start    # Run the build scripts and start a development server
```

Finally, Use Chrome to navigate to your new server at [localhost](http://localhost:9001) or [loopback](http:127.0.0.1:9001).


## Third-party Components

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

Grunt does menial tasks. Grunt automatically inserts script and link tags (from bower_components and the app folder) into our index.html and then runs a html server on 0.0.0.0:9001

## Contributing

Contribution is encouraged! Feel free to fix a technical issue or raise a discussion about a math or logic issue.

### The difficulty bomb

You can see a discussion about the difficulty bomb at this [issue](https://github.com/AgeManning/EthereumMiningCalculator/issues/59).
