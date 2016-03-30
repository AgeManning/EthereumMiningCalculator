angular.module('ethMiningCalc')
  .factory('MarketDataService', ['$http', 'EtherchainDataService', 'PoloniexDataService', 'BitpayDataService',  function($http, etherchainDataService, poloniexDataService, bitpayDataService) {
    var factory = {};

    /**
     * Grab some specific market data from a bunch of sources
     * 
     * @returns Promise containing an object full of juicy market data
     */
    // Currency just using cryptoCode as a placeholder and currencyCode
    factory.get = function(cryptoCode,currencyCode) {
      switch(cryptoCode){
        case "eth":
          return new Promise(function(resolve) {
            var externals = {};
            etherchainDataService.getBasicStats()
              .then(function(data) {
                externals.etherchain = data;
                return poloniexDataService.getTicker();
              })
              .then(function(data) {
                externals.poloniex = data;
                return bitpayDataService.getRates();
              })
              .then(function(data) {
                externals.bitpay = data;
                
                var marketData = {};
                marketData.difficulty = externals.etherchain.stats.difficulty / 1e12;
                marketData.blockTime = externals.etherchain.stats.blockTime;
                marketData.networkHashRate = externals.etherchain.stats.hashRate / 1e9;
                marketData.btc_crypto = Number(externals.poloniex.BTC_ETH.last);
                marketData.usd_btc = Number(externals.poloniex.USDT_BTC.last);
                marketData.usd_crypto= Number(externals.poloniex.USDT_ETH.last);
                marketData.aud_btc = bitpayDataService.findRate(externals.bitpay, 'AUD').rate;
                marketData.aud_crypto = marketData.aud_btc * marketData.btc_crypto;
                marketData.cur_crypto = marketData.aud_eth;
                resolve(marketData);
              });
          });
          break;
          //TODO:Get data for BTC
        case "btc":
          //Default Template for Other
          return new Promise(function(resolve){
            var marketData = {};
            marketData.difficulty = 0;
            marketData.blockTime = 0;
            marketData.networkHashRate = 0;
            marketData.btc_crypto = 0;
            marketData.usd_btc = 0;
            marketData.usd_crypto= 0;
            marketData.aud_btc = 0;
            marketData.aud_crypto = 0;
            marketData.cur_crypto = 0;
            marketData.difficulty = 0;
            resolve(marketData);
          });
          break;
        case "other":
          return new Promise(function(resolve){
            var marketData = {};
            marketData.difficulty = 0;
            marketData.blockTime = 0;
            marketData.networkHashRate = 0;
            marketData.btc_crypto = 0;
            marketData.usd_btc = 0;
            marketData.usd_crypto= 0;
            marketData.aud_btc = 0;
            marketData.aud_crypto = 0;
            marketData.cur_crypto = 0;
            marketData.difficulty = 0;
            resolve(marketData);
          });
    };
    }

    return factory;
  }]);
