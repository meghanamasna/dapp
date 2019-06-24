pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;
contract initial
{
    struct person {
        string username;
        string email;
        string password;
    }
    function enroll(string memory username,string memory email,string memory password) public returns (bool);
    function login(string memory email, string memory  password)public  ;
}
contract mybook 
{   uint256 public bookscount=0;
    
    struct bookinfo{
       uint8 state; // 1 request ,2-accept,3-reject,0-free
        address a;
        uint256 isbn;
        string author;
        string bookname;
    }
    bookinfo[] public books;
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
    function viewallbooks() public  view returns(bookinfo[] memory ) {
        return books;
    }
    bookinfo[] public my;
    function mybooks() public returns(bookinfo[] memory)
    {
             for (uint256 i=0;i<books.length;i++){
                 if(books[i].a==msg.sender)
                 {
                     my.length++;
                     my[my.length-1].state=books[i].state;
                     my[my.length-1].isbn=books[i].isbn;
                     my[my.length-1].bookname=books[i].bookname;
                     my[my.length-1].author=books[i].author;
                     my[my.length-1].a=books[i].a;
                     
                 }
             }
             return my;
    }
     bookinfo[] public s;
     
    
}

contract process is mybook
{
    
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
    function rejbook(uint256 _isbn) public returns(bool){
         for (uint256 i=0;i<books.length;i++){
             if(books[i].isbn==_isbn){
                 require(books[i].state==1);// can reject only if book is requested
                 require(books[i].state!=2);//cannot reject after accepting
                 require(books[i].a==msg.sender);
                 books[i].state=3;
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