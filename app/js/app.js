//console.log("outside");

App = {
  web3Provider: null,
  contracts: {},
  books: Array, 
  

  init: async function() {
    //check the state of book
    //if req print 
    //disable the request
    console.log("init function");
     $.ajaxSetup({async: false});
    $.getJSON('../books.json',function(data){
      console.log("inside");
      //console.log(data);
      var bookrow = $('#bookrow');
      var bookTemplate = $('#bookTemplate');
      for(i=0; i<data.length; i++){
        console.log(bookTemplate.find('.book-isbn').text(data[i].isbn));
        bookTemplate.find('.book-name').text(data[i].name);
        bookTemplate.find('.book-author').text(data[i].author);
        console.log(data[i].isbn);
        bookTemplate.find('.b').attr('id',data[i].isbn);

        console.log(bookTemplate.find('.bk-req').attr('id',data[i].isbn));
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
    App.viewallbooks();
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
     console.log(binstance.addBook($('#isbn').val(),$('#name').val(),$('#author').val()));
     binstance.addBook($('#isbn').val(),$('#name').val(),$('#author').val()).then(function(){
      console.log("added");

        });
      });
     });
    App.viewallbooks();
  
},
reqBook: function(event){
  console.log("requesting");
  //console.log(data);
  event.preventDefault();

    //var isbn = $(event.target).data('isbn');
    var id = $(event.target).prop('id');
    console.log(event.target);
    //1. indexof(array)
    //2. update state of attribute
    console.log(id);
 
  web3.eth.getAccounts(function(error,accounts){
      if(error){
        console.log(error);
      }
      
    var account = accounts[0];
    var rinstance;
    App.contracts.Book.deployed().then(function(instance){
      rinstance = instance;
      console.log("here");

      return rinstance.reqbook(id);
     
    }).then(function(data){
        console.log("in books");
        console.log(data);
          $('.bk-req').eq(id).text('requested').attr('disabled', true);
        
       console.log("requested");
       return App.getStatus();
    });
      
    

});
},
viewallbooks: function(){

  var viewinstance;
  App.contracts.Book.deployed().then(function(instance){
    viewinstance = instance;
    console.log(instance.viewallbooks());

  });
},
getStatus: function(){
  App.contracts.Book.deployed().then(function(instance){
    //instance.viewstatus();

  });

  
}
};

$(function() {
  $(window).load(function() {
    console.log("initiating");
    App.init();
  });
});
