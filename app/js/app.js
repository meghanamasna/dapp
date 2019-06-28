//console.log("outside");
App = {
  web3Provider: null,
  contracts: {},
  books: Array, 


  init: async function() {
    console.log("init function");
     $.ajaxSetup({async: false});
    $.getJSON('../books.json',function(data){
      console.log("inside");
      var bookrow = $('#bookrow');
      var bookTemplate = $('#bookTemplate');
      for(i=0; i<data.length; i++){
        bookTemplate.find('.book-isbn').text(data[i].isbn);
        bookTemplate.find('.book-name').text(data[i].name);
        bookTemplate.find('.book-author').text(data[i].author);
        console.log(data[i].isbn);
        bookTemplate.find('.btn-req').attr('data-isbn',data[i].isbn);
        console.log(bookTemplate.find('.btn-req').attr('data-isbn',data[i].isbn));
        bookrow.append(bookTemplate.html());
      }


    });
    

    return  await App.initWeb3();
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

  initContract:  function() {
    console.log("init contract");
    $.getJSON('Book.json',function(data){
      console.log("inside getjson");
     // console.log(data);

      var bookArtifact = data;
      App.contracts.Book = TruffleContract(bookArtifact);
      console.log("truffle contract");
      App.contracts.Book.setProvider(App.web3Provider);
      console.log(App.contracts.Book);

      
    });
    console.log("outside getjson");


    return App.bindEvents();

  },

  bindEvents: function() {
    console.log("binding");

    $(document).on('click','.btn-add',App.addBook);
    $(document).on('click','.bk-req',App.reqBook);
    
    //return App.addBook();
   
  },
  addBook: function(event){

    console.log("adding");
    
    
    web3.eth.getAccounts(function(error,accounts){
      if(error){
        console.log(error);
      }
      
    var account = accounts[0];
    console.log(account);
    var binstance;
    

    App.contracts.Book.deployed().then(function(instance){
      binstance = instance;
      console.log("inside add book");

     // return binstance.viewallbooks.call();
     binstance.addBook(123,"hekko","ek2e").then(function(){
      console.log("added");

        });
      });
     });
  
},
reqBook: function(event){
  console.log("requesting");
  //console.log(data);
  event.preventDefault();

    var isbn = $(event.target).data('isbn');

    console.log(isbn);
 
  web3.eth.getAccounts(function(error,accounts){
      if(error){
        console.log(error);
      }
      
    var account = accounts[0];
    var rinstance;
    App.contracts.Book.deployed().then(function(instance){
      rinstance = instance;
      console.log("here");

      return rinstance.reqbook(isbn);
     
    }).then(function(data){
        console.log("in books");
        console.log(data);
          $('.bk-req').eq(isbn).text('requested').attr('disabled', true);
        
       console.log("requested");
       return App.getStatus();
    });
      
    

});
},
getStatus: function(data){

  console.log(data);
  
  console.log("showing status");
  

}
};

$(function() {
  $(window).load(function() {
    console.log("initiating");
    App.init();
  });
});
