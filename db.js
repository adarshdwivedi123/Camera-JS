// open  adtabase 
// create ObjectStore
// Make Datbase

let db;
let openRequest=indexedDB.open("myDataBase");
//Db has these three Event
// HMRA  DB OPEN OH IN CASE OF SUCCES VLA CHLE GA 
//IN CASE OF FAILURE ,FAILURE VLA CHLE GA

//SECOND ONE 
openRequest.addEventListener("success",e=>{
    console.log("DB Success");
    db=openRequest.result;

});

openRequest.addEventListener("error",e=>{
    console.log("DB error");
});
//FIRST ONE THIS CALL
//UPGRADED BASICALLY FOR VERSION 
//I WE LOWER VERSION THEN JO CURRENT VERSION HAI VHI FOLOW KRE GA THEN
// INTIALLY DB YHI CREATE HOGA NEW 
// intially isse jagah db create hoga
openRequest.addEventListener("upgradeneeded",e=>{
    console.log("DB upgraded and also for initial DB creation");
    db=openRequest.result;

    //SECOND CREATE OBJECT STore

    // keypath me hm id store kr reh hai
    // keypath we use here to uniquely identify each and every data.
    //keypath ke andar hm term use kre ge id for unikely identify the term
    db.createObjectStore("video",{keyPath:"id"}); //vedio store
    db.createObjectStore("image",{keyPath:"id"}); //image stroe


    
});

