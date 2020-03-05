pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract Food_supply{

    
    struct Product {
        uint id;
        string name;
        uint quantity;
        string others;  // for QOs or conditions, location etc
        uint numberoftraces;
        uint numberoftemperatures;
        uint [] tracesProduct; // the ID of the traces of the product
        uint [] temperaturesProduct;
        address maker; // who  updates
        string globalId; // global id in manufacturing 
        string hashIPFS; // refernce to manufacturing description
    }
    // key is a uint, later corresponding to the product id
    // what we store (the value) is a Product
    // the information of this mapping is the set of products of the order.
    mapping(uint => Product) private products; // public, so that w can access with a free function 

    struct Trace {
        uint id;
        uint id_product;
        string location;
        string temp_owner;
        string timestamp;
        address maker; // who  updates
    }

    mapping(uint => Trace) private traces; // public, so that w can access with a free function 
    //store products count
    // since mappings cant be looped and is difficult the have a count like array
    // we need a var to store the coutings  
    // useful also to iterate the mapping 

    struct Temperature {  // we use celsious
        uint id;
        uint id_product;
        uint celsius; // the number
        string timestamp;
        address maker; // who  updates
    }

    mapping(uint => Temperature) private temperatures; // public, so that w can access with a free function 






  uint private temperaturesCount;
    uint private productsCount;
    uint private tracesCount;

    //declare address of the participants
    address constant public customer = 0xE0f5206BBD039e7b0592d8918820024e2a7437b9;
    address constant public wholesaler = 0xE0F5206bbd039E7B0592D8918820024E2a743445;
    address constant public distributor = 0xE0F5206bbd039e7b0592d8918820024E2A743222;

    bool private  triggered;
    bool private  delivery;
    bool private  received;


    // event, voted event. this will trigger when we want
    //  when a vote is cast for example, in the vote function. 
    event triggeredEvent (  // triggers new accepted order 
    );

    event deliveryEvent (  // triggers delivery start
    );

    event receivedEvent ( // triggers order received by customer
    );

    event updateEvent ( // triggers product status change
    );


    constructor () public { // constructor, creates order. we map starting from id=1,  hardcoded values of all
        addProduct("Example",200, "Delivey in 3 days, temperature X","5400AA","ADDeFFtt45045594xxE3948"); //
        addTrace(1,"some coordinates", "name or address of actual owner","timestamp");
        triggered=false;
        delivery=false;
        received=false;
    }


    //PRODUCT OPERATIONS******************************************
    // enables product creation
    // get product
    // get total for externally looping the mapping
    // update others.

    // add product to mapping. private because we dont want to be accesible or add products afterwards to our mapping. We only want
    // our contract to be able to do that, from constructor
    // otherwise the conditions of the accepted contract could change
    function addProduct (string _name, uint _quantity, string _others, string _globalID, string _hashIpfs) private {
        require(msg.sender==vendor);

        productsCount ++; // inc count at the begining. represents ID also. 
        products[productsCount].id = productsCount; 
        products[productsCount].name = _name;
        products[productsCount].quantity = _quantity;
        products[productsCount].others = _others;
        products[productsCount].numberoftraces = 0;
        products[productsCount].numberoftemperatures = 0; 
        products[productsCount].maker = msg.sender;
        products[productsCount].globalId = _globalID;
        products[productsCount].hashIPFS = _hashIpfs;
        // reference the mapping with the key (that is the count). We assign the value to 
        // the mapping, the count will be the ID.  
    }

    // returns the number of products, needed to iterate the mapping and to know info about the order.
    function getNumberOfProducts () public view returns (uint){
        require(msg.sender==customer || msg.sender==wholesaler || msg.sender==distributor);
        
        return productsCount;
    }

     // only wholesaler or distributors
    function UpdateProduct (uint _productId, string _others) public { 
        require(msg.sender==wholesaler || msg.sender==distributor);
        require(_productId > 0 && _productId <= productsCount); 

        products[_productId].others = _others;  // update conditions
        emit updateEvent(); // trigger event 
    }

    // function to check the contents of the contract, the customer will check it and later will trigger if correct
    // only customer can check it 
    // customer will loop outside for this, getting the number of products before with getNumberOfProducts
    function getProduct (uint _productId) public view returns (Product) {
        require(msg.sender==wholesaler || msg.sender==customer);
        require(_productId > 0 && _productId <= productsCount); 

        return products[_productId];
    }

      function getProductGlobalID (uint _productId) public view returns (string) {
        require(msg.sender==customer);
        require(_productId > 0 && _productId <= productsCount); 

        return products[_productId].globalId;
    }


      function getProductHistoric (uint _productId) public view returns (string) {
        require(msg.sender==customer);
        require(_productId > 0 && _productId <= productsCount); 

        return products[_productId].hashIPFS;
    }
    //TRACES and temperatures OPERATIONS********************************************
    // enables add trace to a product
    // enables total number of traces to loop
    // get a trace
    // gets the total number of traces of a product. for statistical purposes
    // get the list of traces of a product, that can be consulter afterwards using get a trace
    // the same for temperatures

    function addTrace (uint _productId, string _location, string _temp_owner, string _timestamp) public {  // acts as update location
        require(msg.sender==wholesaler || msg.sender==distributor);
        require(_productId > 0 && _productId <= productsCount); // check if product exists
        
        tracesCount ++; // inc count at the begining. represents ID also. 
        traces[tracesCount] = Trace(tracesCount, _productId, _location,_temp_owner,_timestamp,msg.sender);
        products[_productId].tracesProduct.push(tracesCount); // we store the trace reference in the corresponding product
        products[_productId].numberoftraces++;
         //this will give us the set of ID traces about our productid
        emit updateEvent();
    }

    function addTemperature (uint _productId, uint _celsius, string _timestamp) public {  // acts as update temperature
        require(msg.sender==wholesaler || msg.sender==distributor);
        require(_productId > 0 && _productId <= productsCount); // check if product exists
        
        temperaturesCount ++; // inc count at the begining. represents ID also. 
        temperatures[temperaturesCount] = Temperature(temperaturesCount, _productId, _celsius,_timestamp,msg.sender);
        products[_productId].temperaturesProduct.push(temperaturesCount); // we store the trace reference in the corresponding product
        products[_productId].numberoftemperatures++;
        // this will give us the set of ID temperatures about our productid
        emit updateEvent();
    }

    // returns the number of traced locations
    //useful for generic statistical purposes
    function getNumberOfTraces () public view returns (uint) {
        require(msg.sender==customer || msg.sender==wholesaler || msg.sender==distributor);
        
        return tracesCount;
    }


     // returns the number of registered temperatures
    //useful for generic statistical purposes
    function getNumberOfTemperatures () public view returns (uint) {
        require(msg.sender==customer || msg.sender==wholesaler || msg.sender==distributor);
        
        return temperaturesCount;
    }


    // get a trace
    function getTrace (uint _traceId) public view returns (Trace)  {
        require(msg.sender==customer );
        require(_traceId > 0 && _traceId <= tracesCount); 

        return traces[_traceId];
    }

        // get a temperature
    function getTemperature (uint _temperatureId) public view returns (Temperature)  {
        require(msg.sender==customer );
        require(_temperatureId > 0 && _temperatureId <= temperaturesCount); 

        return temperatures[_temperatureId];
    }


    // returns the number of traced locations for specific product
    function getNumberOfTracesProduct (uint _productId) public view returns (uint) {
        require(msg.sender==customer || msg.sender==wholesaler || msg.sender==distributor);
        require(_productId > 0 && _productId <= productsCount); // check if product exists
        
        return products[_productId].numberoftraces;
    }

            // returns the number of registered temperatures for specific product
    function getNumberOfTemperaturesProduct (uint _productId) public view returns (uint) {
        require(msg.sender==customer || msg.sender==wholesaler || msg.sender==distributor);
        require(_productId > 0 && _productId <= productsCount); // check if product exists
        
        return products[_productId].numberoftemperatures;
    }



    // get the array of traces of a product, later we can loop them using getTrace to obtain the data
    function getTracesProduct (uint _productId) public view returns (uint [])  {
        require(msg.sender==customer );
        require(_productId > 0 && _productId <= productsCount); // check if product exists

        return products[_productId].tracesProduct;
    }

            // get the array of temperatures of a product, later we can loop them using getTrace to obtain the data
    function getTemperaturesProduct (uint _productId) public view returns (uint [])  {
        require(msg.sender==customer );
        require(_productId > 0 && _productId <= productsCount); // check if product exists

        return products[_productId].temperaturesProduct;
    }




    //EVENT AND SC OPERATIONS********************************************************
    //  computes hash of transaction
    // several event triggers

    function retrieveHash (uint _productId) public view returns (bytes32){ 
        //computehash according to unique characteristics
        // hash has to identify a unique transaction so timestamp and locations and products should be used.
        // this example hashes a transaction as a whole.
        return keccak256(abi.encodePacked(block.number,msg.data, products[_productId].id, products[_productId].name, products[_productId].quantity, products[_productId].others, products[_productId].numberoftraces, products[_productId].numberoftemperatures, products[_productId].maker));

    }

     //this function triggers the contract, enables it since the customer accepts it 
    // only customer
    function triggerContract () public { 
        require(msg.sender==customer);
        triggered=true;
        emit triggeredEvent(); // trigger event 

    }

    // only wholesaler
    function deliverOrder () public { 
        require(msg.sender==wholesaler);
        delivery=true;
        emit deliveryEvent(); // trigger event 

    }

    //only customer
    function receivedOrder () public { 
        require(msg.sender==customer);
        received=true;
        emit receivedEvent(); // trigger event 

    }


}
