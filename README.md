# node-fibers-synchronize-helper

This helper uses synchronize module (https://www.npmjs.com/package/synchronize) and helps to manage promises and callbacks, and manage variables on underlying Fiber Thread like Java ThreadLocal, **you will be able to synchronize callback and promises** and **develop syncronously as your did in Java** returning Objects and catch exceptions, and set-get Objects on your Fiber Thread as you did with Java **ThreadLocal**.


***Create/Start Fiber Thread:***

var synchProm = require('node-fibers-synchronize-helper')

synchProm.executeSynch(function, callback)

```
     synchProm.executeSynch(function, function (err, res) {
                        if (err)
                            console.log("err", err)
                        else
                            console.log("OK:", res)
                    })

```


***Promise:***

**var result = executePromiseFiberFn(Object/this, method/function, params ...)**

**var result = executePromiseFiberFnName(Object/this, method/function name, params ...)**

example:
```
   var db = synchProm.executePromiseFiberFn(MongoClient, MongoClient.connect, url)
   synchProm.executePromiseFiberFn(collection, collection.insertMany, [{name:"Jim"}
      , {name:"Sarah", title:"Princess"}], {w:1})
      
    var db = synchProm.executePromiseFiberFnName(MongoClient, 'connect', url)  
```


***Callback:***

**var result = executeFiberFn(Object/this, method/function, params ...)**

example:
```
   var db = synchProm.executeFiberFn(MongoClient, MongoClient.connect, url)
   synchProm.executeFiberFn(collection, collection.insertMany, [{name:"Jim"}
      , {name:"Sarah", title:"Princess"}], {w:1})
      
```
Map results (keys are from result name array):

**var resultMap = executeFiberFnMultiParamCb(Object/this, method/function, result name array , params ...)** 

example:
```
    var resMultiCbMap = synchProm.executeFiberFnMultiParamCb(this, multiParamCB, ['res1', 'res2'], "a", "b", "c")  
    
```

Fiber ThreadLocal:


 **synchProm.setThreadLocalValue("key", value)**
 
 **synchProm.getThreadLocalValue("key")**



Promise synchronization:
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



Callback synchronization:
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



Fiber ThreadLocal:
```
 var synchProm = require('node-fibers-synchronize-helper')
 synchProm.setThreadLocalValue("key", value)
 synchProm.getThreadLocalValue("key")
 

```
example ThreadLocal:
```
var synchProm = require('node-fibers-synchronize-helper')

var timeoutCB = function (mills, cb) {

    setTimeout(function () {
        cb(null);
    }, mills);

}

var testThreadLocal = function () {



    for (i = 0; i < 10; i++) {
        (
            function (count) {
                var fiberThread = function () {
                    synchProm.setThreadLocalValue("count", count)

                    synchProm.executeFiberFn(this, timeoutCB, 1000)
                    console.log(count, synchProm.getThreadLocalValue("count"))
                    return count
                }
                synchProm.executeSynch(fiberThread, function (err, res) {
                    if (err)
                        console.log("err", err)
                    else
                        console.log("OK:", res)
                })
            })(i)
    }

}
testThreadLocal()

```

