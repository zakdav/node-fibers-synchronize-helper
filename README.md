# node-fibers-synchronize-helper

This helper manage promise, you will be able to 

Promise management:
```
var synchProm = require('node-fibers-synchronize-helper')
 
var testSynch = function () {
try{
//promise function call
    var db = synchProm.executePromiseFiberFn(MongoClient, MongoClient.connect, url)
//get synch object and call promise function
    var dbProm = synchProm.getSynchPromiseObj(db);
    var stats = dbProm.executePromiseFiber(db.stats)
    
//cursor.toArray promise version
    var cursor = collection_test.find({});
    var resProm = synchProm.executePromiseFiberFn(cursor, cursor.toArray)

//cursor.toArray callback version
    cursor = collection_test.find({});
    var resCb = synchProm.executeFiberFn(cursor, cursor.toArray)
    assert.notEqual(null, resCb);

//multiparam callback
    var resMultiCb = synchProm.executeFiberFnMultiParamCb(this, multiParamCB, ['res1', 'res2'], "a", "b", "c")   
    
    
}catch(e){
    console.log(e)
}

}


synchProm.executeSynch(testSynch, function (err, res) {
    if (err)
        console.log("err", err)
    else
        console.log("OK:", JSON.stringify(res, null, 4))
})

```






