# node-fibers-synchronize-helper

This helper uses synchronize module (https://www.npmjs.com/package/synchronize) and helps to manage promises and callbacks, you will be able to synch code and catch exceptions 


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



Callback management:
```
var synchProm = require('node-fibers-synchronize-helper')
 
var testSynch = function () {
    try{

    //cursor.toArray callback version
        cursor = collection_test.find({});
        var resCb = synchProm.executeFiberFn(cursor, cursor.toArray)
        assert.notEqual(null, resCb);

    //callback with param
        resCb = synchProm.executeFiberFn(cursor, cursor.count, true, {
            skip: 1
        })

    //multiparam result callback
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








