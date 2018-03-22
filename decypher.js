// Config
global.config = {
  rpc: {
    host: "localhost",
    port: "8545",
  },
};

// Load Libraries
global.solc = require("solc");
global.fs = require("fs");
global.Web3 = require("web3");

// Connect Web3 Instance
global.web3 = new Web3(new Web3.providers.HttpProvider(`http://${global.config.rpc.host}:${global.config.rpc.port}`));

// Global Account Accessors
global.acct1 = web3.eth.accounts[0];
global.acct2 = web3.eth.accounts[1];
global.acct3 = web3.eth.accounts[2];
global.acct4 = web3.eth.accounts[3];
global.acct5 = web3.eth.accounts[4];

// Helper Functions
class Helpers {

  contractName(source) {
    const re1 = /contract.*{/g;
    const re2 = /\s\w+\s/;
    return source.match(re1).pop().match(re2)[0].trim();
  }

  createContract(source, options={}) {
    const compiled = solc.compile(source);
    const contractName = this.contractName(source);
    const contractToDeploy = compiled.contracts[`:${contractName}`];
    const bytecode = contractToDeploy.bytecode;
    // const bytecode = compiled.contracts[`:${contractName}`].bytecode﻿;
    const abi = JSON.parse(contractToDeploy.interface);
    // const bytecode = compiled.contracts[":" + contractName].bytecode;
    // const abi = JSON.parse(compiled.contracts[":" + contractName].interface);
    const contract = global.web3.eth.contract(abi);
    const gasEstimate = global.web3.eth.estimateGas({ data: bytecode });
    const contractTx = {
      from: global.web3.eth.accounts[0],
      data: bytecode,
      gas: gasEstimate,
      gasPrice: 5,
    };
    const deployed = contract.new(Object.assign(
      {},
      contractTx,
      options), (error, result) => { });
    return deployed;
  }

  loadContract(name) {
    const path = `./${name.toLowerCase()}.sol`;
    return fs.readFileSync(path, 'utf8');
  }

  deployContract(name, options={}) {
    const source = this.loadContract(name);
    return this.createContract(source, options);
  }

  etherBalance(contract) {
    switch(typeof(contract)) {
      case "object":
        if(contract.address) {
          return global.web3.fromWei(global.web3.eth.getBalance(contract.address), 'ether').toNumber();
        } else {
          return new Error("cannot call getEtherBalance on an object that does not have a property 'address'");
        }
        break
      case "string":
        return global.web3.fromWei(global.web3.eth.getBalance(contract), 'ether').toNumber();
    }
  }
}

// Load Helpers into Decypher namespace
global.decypher = new Helpers()

// Start repl
require('repl').start({})