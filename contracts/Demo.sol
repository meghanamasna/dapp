pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract Book 
{
    uint256 public bookscount=0;
    
    struct Bookinfo{
       uint8 state; // 1 request ,2-accept,3-reject,0-free
        address a;
        uint256 isbn;
        string author;
        string bookname;
    }
    Bookinfo[] public books;
    function addBook(uint256 _isbn, string memory _bookname, string memory _author) public  
      returns(uint) {
           bookscount=bookscount+1;
        books.length++;
        books[books.length-1].state =0;
         books[books.length-1].a=msg.sender;
        books[books.length-1].isbn = _isbn;
        books[books.length-1].bookname= _bookname;
        books[books.length-1].author = _author;
        return books.length;
    }
     function viewallbooks() public view returns(uint[] memory, string[] memory, string[] memory ) {
        //bookinfo[] memory books1 = new bookinfo[](books.length);
        uint[] memory isbn = new uint[](books.length);
        string[] memory bookname = new string[](books.length);
        string[] memory author = new string[](books.length);
        for(uint i = 0; i < books.length; i++){
            Bookinfo storage book1 = books[i];
            isbn[i] = book1.isbn;
            bookname[i] = book1.bookname;
            author[i] = book1.author;

        }
        return (isbn, bookname, author);
       
                       
    }
    
    function reqbook(uint256 _isbn) public returns(bool){
         for (uint256 i=0;i<books.length;i++){
            
             if(books[i].isbn==_isbn){
                 require(books[i].a!=msg.sender);//can request only if book belongs to another user
                 require(books[i].state==0);//can request only if book is free
                 books[i].state=1;
                 return true;
             }
         }
         return false;
    }
    function accbook(uint256 _isbn) public returns(bool){
         for (uint256 i=0;i<books.length;i++){
             if(books[i].isbn==_isbn  ){
                 require(books[i].state==1);// can accept only if book is requested
                 require(books[i].a==msg.sender);
                 books[i].state=2;
                 return true;
             }
         }
         return false;
    }
    
    function viewstatus(uint256 _isbn)public view returns(uint8)
    {
        for (uint256 i=0;i<books.length;i++){
             if(books[i].isbn==_isbn){
                
                 return books[i].state;
             }
         }
         return 4;// not registered book 
    }
}
