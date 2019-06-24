console.log("outside");
App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    console.log("init function");

    return await App.initWeb3();
  },

  initWeb3: async function() {
    console.log("initweb3");
   
      if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

        return App.initContract();
  },

  initContract: function() {
    console.log("init contract");
    $.getJSON('process.json',function(data){
      console.log("inside getjson");

      var bookArtifact=data;
      App.contracts.process=TruffleContract(bookArtifact);
      App.contracts.process.setProvider(App.web3Provider);
      
    });

    return App.bindEvents();

  },

  bindEvents: function() {
    console.log("binding");

    $(document).on('click','.btn-add',App.addBook);
    return App.addBook();
   
  },
  addBook: function(event){
    console.log("adding");
    web3.eth.getAccounts(function(error,accounts){
      if(error){
        console.log(error);
      }
      
    var account=accounts[0];
    var binstance;
    App.contracts.process.deployed().then(function(instance){
      binstance=instance;
      return binstance.addBook($('#isbn').val(),$('#name').val(),$('#author').val(),{from:account});
     } );

    });
  }

 

};

$(function() {
  $(window).on('load',function() {
    console.log("initiating");
    App.init();
  });
});
