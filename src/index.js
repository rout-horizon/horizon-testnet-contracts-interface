"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getNetworkFromId = exports.networkToChainId = exports.CurrencyCategory = exports.Synths = exports.NetworkIdByName = exports.NetworkNameById = exports.horizon = void 0;
var smart_contract_1 = require("@horizon-protocol/smart-contract");
exports.networkToChainId = smart_contract_1.networkToChainId;
exports.getNetworkFromId = smart_contract_1.getNetworkFromId;
var ethers_1 = require("ethers");
var types_1 = require("./types");
exports.CurrencyCategory = types_1.CurrencyCategory;
exports.NetworkIdByName = types_1.NetworkIdByName;
exports.NetworkNameById = types_1.NetworkNameById;
var mainnet_1 = require("../generated/mainnet");
var testnet_1 = require("../generated/testnet");
var constants_1 = require("./constants");
var horizon = function (_a) {
    var networkId = _a.networkId, network = _a.network, signer = _a.signer, provider = _a.provider;
    var _b = selectNetwork(networkId, network), currentNetwork = _b[0], currentNetworkId = _b[1], useOvm = _b[2];
    return {
        network: {
            id: currentNetworkId,
            name: currentNetwork,
            useOvm: useOvm
        },
        networks: smart_contract_1.networks,
        networkToChainId: smart_contract_1.networkToChainId,
        decode: smart_contract_1.decode,
        defaults: smart_contract_1.defaults,
        feeds: (0, smart_contract_1.getFeeds)({ network: currentNetwork, useOvm: useOvm }),
        tokens: (0, smart_contract_1.getTokens)({ network: currentNetwork, useOvm: useOvm }),
        sources: (0, smart_contract_1.getSource)({ network: currentNetwork, useOvm: useOvm }),
        targets: (0, smart_contract_1.getTarget)({ network: currentNetwork, useOvm: useOvm }),
        synths: (0, smart_contract_1.getSynths)({ network: currentNetwork, useOvm: useOvm }),
        users: (0, smart_contract_1.getUsers)({ network: currentNetwork, useOvm: useOvm }),
        versions: (0, smart_contract_1.getVersions)({ network: currentNetwork, useOvm: useOvm }),
        stakingRewards: (0, smart_contract_1.getStakingRewards)({ network: currentNetwork, useOvm: useOvm }),
        suspensionReasons: (0, smart_contract_1.getSuspensionReasons)(),
        futuresMarkets: (0, smart_contract_1.getFuturesMarkets)({ network: currentNetwork, useOvm: useOvm }),
        perpsMarkets: (0, smart_contract_1.getPerpsMarkets)({ network: currentNetwork, useOvm: useOvm }),
        perpsV2ProxideMarkets: (0, smart_contract_1.getPerpsV2ProxiedMarkets)({ network: currentNetwork, useOvm: useOvm }),
        toBytes32: smart_contract_1.toBytes32,
        utils: ethers_1.ethers.utils,
        contracts: getHorizonContracts(currentNetwork, signer, provider, useOvm)
    };
};
exports.horizon = horizon;
var selectNetwork = function (networkId, network) {
    var currentNetworkId;
    var currentNetworkName;
    var useOvm = false;
    if ((network && !smart_contract_1.networkToChainId[network]) ||
        (networkId && !(0, smart_contract_1.getNetworkFromId)({ id: networkId }))) {
        throw new Error(constants_1.ERRORS.badNetworkArg);
    }
    else if (network && smart_contract_1.networkToChainId[network]) {
        var networkToId = types_1.NetworkIdByName[network];
        var networkFromId = (0, smart_contract_1.getNetworkFromId)({ id: networkToId });
        currentNetworkId = smart_contract_1.networkToChainId[network];
        currentNetworkName = networkFromId.network;
        useOvm = !!networkFromId.useOvm;
    }
    else if (networkId) {
        var networkFromId = (0, smart_contract_1.getNetworkFromId)({ id: networkId });
        currentNetworkId = networkId;
        currentNetworkName = networkFromId.network;
        useOvm = Boolean(networkFromId.useOvm);
    }
    else {
        currentNetworkId = types_1.NetworkIdByName.mainnet;
        currentNetworkName = types_1.NetworkNameById[56];
    }
    return [currentNetworkName, currentNetworkId, useOvm];
};
var getHorizonContracts = function (network, signer, provider, useOvm) {
    var sources = (0, smart_contract_1.getSource)({ network: network, useOvm: useOvm });
    var targets = (0, smart_contract_1.getTarget)({ network: network, useOvm: useOvm });
    return Object.values(targets)
        .map(function (target) {
        if (target.name === 'Synthetix') {
            if (network === 'mainnet') {
                target.address = targets.ProxyERC20.address;
            }
            else
                target.address = targets.ProxySynthetix.address;
        }
        else if (target.name === 'ZassetzUSD') {
            if (network === 'mainnet') {
                target.address = targets.ProxyERC20zUSD.address;
            }
            else
                target.address = targets.ProxyzUSD.address;
        }
        else if (target.name === 'FeePool') {
            target.address = targets.ProxyFeePool.address;
        }
        else if (target.name.match(/Zasset(z|i)[a-zA-Z]+$/)) {
            var newTarget = target.name.replace('Zasset', 'Proxy');
            target.address = targets[newTarget].address;
        }
        return target;
    })
        .reduce(function (acc, _a) {
        var name = _a.name, source = _a.source, address = _a.address;
        acc[name] = new ethers_1.ethers.Contract(address, sources[source].abi, signer || provider || ethers_1.ethers.getDefaultProvider(network));
        return acc;
    }, {});
};
var Synths = __assign(__assign({}, testnet_1.Synths), mainnet_1.Synths);
exports.Synths = Synths;
exports["default"] = horizon;
