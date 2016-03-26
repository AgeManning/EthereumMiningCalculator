# EthereumMiningCalculator
Basic Statistics Useful for Mining Ethereum


Currently under development, don't trust it just yet.

## Dev Requirements

* node.js (I recommend using nvm (node version manager) to install node)
* bower (npm install -g bower)
* grunt-cli (npm install -g grunt-cli)

## What does what?

#### Node.js
We use node.js to run helpful dev packages, like the ones listed below.

#### Bower
Bower (like the bird) fetches pretty blue things and puts them in your nest. Except instead of pretty blue things, it
fetches third-party packages and instead of putting them in your nest, it puts them in your bower_components foler.
Now installing highcharts becomes the command 'bower install --save highcharts'. Updating is 'bower update highcharts'.

#### Grunt
Grunt does menial tasks. For example, we have a grunt tasks the runs through our 'bower.json' file (where saved
bower components are listed) and adds them to our index.html file.