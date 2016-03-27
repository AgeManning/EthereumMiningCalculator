angular.module('ethMiningCalc')
  .factory('MarketDataService', ['$http', 'EtherchainDataService', 'PoloniexDataService', 'BitpayDataService',  function($http, etherchainDataService, poloniexDataService, bitpayDataService) {
    var factory = {};

    /**
     * Grab some specific market data from a bunch of sources
     * 
     * @returns Promise containing an object full of juicy market data
     */
    factory.get = function() {
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
            marketData.btc_eth = Number(externals.poloniex.BTC_ETH.last);
            marketData.usd_btc = Number(externals.poloniex.USDT_BTC.last);
            marketData.usd_eth = Number(externals.poloniex.USDT_ETH.last);
            marketData.aud_btc = bitpayDataService.findRate(externals.bitpay, 'AUD').rate;
            marketData.aud_eth = marketData.aud_btc * marketData.btc_eth;
            marketData.cur_eth = marketData.aud_eth;
            
            resolve(marketData);
          });
      });
    }

    return factory;
  }]);