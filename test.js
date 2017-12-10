//TEST

var MongoClient = require('mongodb').MongoClient
var assert = require("assert")

var synchProm = require('./index.js')
    //var synchProm = require('node-fibers-synchronize-helper')


var url = 'mongodb://localhost:27017/test';
console.log("CALLBACK")
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    db.close();
});
console.log("PROMISE")
var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}


MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  insertDocuments(db, function() {
    db.close();
  });
});

console.log("SYNCH")


var multiParamCB = function (a, b, c, multiCB) {
    if (c)
        b = c + b
    if (c)
        a = c + a


    setTimeout(function () {
        multiCB(null, a, b);
    }, 3000);
    // multiCB(null, a, b);




}



var testSynch = function () {
    // var prom = synchProm.getSynchPromiseObj(MongoClient);
    // var db = prom.executePromiseFiber(MongoClient.connect, url)
    var db = synchProm.executePromiseFiberFn(MongoClient, MongoClient.connect, url)
    assert.notEqual(null, db);
    //var collection = res.collection('test_correctly_access_collections2');
    var dbProm = synchProm.getSynchPromiseObj(db);
    var stats = dbProm.executePromiseFiber(db.stats)
    assert.notEqual(null, stats);
    //console.log("stats:", stats)
    var collection_test = db.collection("collection_test") //synchProm.executePromiseFiberFn(db, db.collection, "collection_test")
    var cursor = collection_test.find({});

    var resProm = synchProm.executePromiseFiberFn(cursor, cursor.toArray)
    assert.notEqual(null, resProm);

    cursor = collection_test.find({});
    var resCb = synchProm.executeFiberFn(cursor, cursor.toArray)
    assert.notEqual(null, resCb);

    console.log("cursor.count")
    resCb = synchProm.executeFiberFn(cursor, cursor.count, true, {
        skip: 1
    })
    assert.notEqual(null, resCb);


    var resMultiCb = synchProm.executeFiberFnMultiParamCb(this, multiParamCB, ['res1', 'res2'], "a", "b", "c")
    console.log("res resMultiCb:", resMultiCb)
    assert.notEqual(null, resMultiCb);


    cursor = collection_test.find({});
    var cursorProm = synchProm.getSynchPromiseObj(cursor);
    var res = cursorProm.executePromiseFiber(cursor.toArray)
    console.log("res OBJ:", res)
    return res
}


var testSynchName = function () {
    // var prom = synchProm.getSynchPromiseObj(MongoClient);
    // var db = prom.executePromiseFiber(MongoClient.connect, url)
    var db = synchProm.executePromiseFiberFnName(MongoClient, 'connect', url)
    assert.notEqual(null, db);
    //var collection = res.collection('test_correctly_access_collections2');
    var dbProm = synchProm.getSynchPromiseObj(db);
    var stats = dbProm.executePromiseFiber(db.stats)
    assert.notEqual(null, stats);
    //console.log("stats:", stats)
    var collection_test = db.collection("collection_test") //synchProm.executePromiseFiberFn(db, db.collection, "collection_test")
    var cursor = collection_test.find({});

    var resProm = synchProm.executePromiseFiberFnName(cursor, 'toArray')
    assert.notEqual(null, resProm);

    cursor = collection_test.find({});
    var resCb = synchProm.executeFiberFn(cursor, cursor.toArray)
    assert.notEqual(null, resCb);


    var resMultiCb = synchProm.executeFiberFnMultiParamCb(this, multiParamCB, ['res1', 'res2'], "a", "b", null)
    console.log("res resMultiCb:", resMultiCb)
    assert.notEqual(null, resMultiCb);


    cursor = collection_test.find({});
    var cursorProm = synchProm.getSynchPromiseObj(cursor);
    var res = cursorProm.executePromiseFiber(cursor.toArray)
    console.log("res OBJ:", res)
    return res
}


synchProm.executeSynch(testSynch, function (err, res) {
    if (err)
        console.log("err", err)
    else
        console.log("OK:", JSON.stringify(res, null, 4))
})


synchProm.executeSynch(testSynchName, function (err, res) {
    if (err)
        console.log("err", err)
    else
        console.log("OK:", JSON.stringify(res, null, 4))
})