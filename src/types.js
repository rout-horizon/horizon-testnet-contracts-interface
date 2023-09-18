"use strict";
exports.__esModule = true;
exports.CurrencyCategory = exports.NetworkNameById = exports.NetworkIdByName = void 0;
exports.NetworkIdByName = {
    mainnet: 56,
    testnet: 97
};
exports.NetworkNameById = {
    56: 'mainnet',
    97: 'testnet'
};
var CurrencyCategory;
(function (CurrencyCategory) {
    CurrencyCategory["crypto"] = "Crypto";
    CurrencyCategory["forex"] = "Forex";
    CurrencyCategory["equity"] = "Equity";
    CurrencyCategory["commodity"] = "Commodity";
})(CurrencyCategory = exports.CurrencyCategory || (exports.CurrencyCategory = {}));
