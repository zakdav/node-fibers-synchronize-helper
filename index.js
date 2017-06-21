var sync = require('synchronize');

var synchObj = function (that, returnParamsNameArr) {
    this.that = that;
    this.returnParamsNameArr = returnParamsNameArr;
}

synchObj.prototype.executeFiberInt = function (fn, params) {
    //var defer = sync.defer();
    //runFiber(fn, params, defer)
    if (this.returnParamsNameArr)
        params.push(sync.defers.apply(sync, this.returnParamsNameArr))
    else
        params.push(sync.defer())
    var res = sync.await(fn.apply(this.that, params));
    return res;
}
synchObj.prototype.executeFiber = function (fn) {
    //console.log(fn)
    //console.log(arguments)
    var params = [];
    var argl = arguments.length
    for (var i = 1; i < argl; i++) {
        params.push(arguments[i]);
    }
    return this.executeFiberInt(fn, params);
}

var synchPromObj = function (that) {
    this.that = that;


}

synchPromObj.prototype.runPromiseFiber = function (fn, params, defer) {
    fn.apply(this.that, params).then(function (res) {
        //fn().then(function (res) {
        defer(null, res)
    }).catch(function (e) {

        defer(e)
    })
}

synchPromObj.prototype.executePromiseFiberInt = function (fn, params) {
    var defer = sync.defer();
    this.runPromiseFiber(fn, params, defer)
    var res = sync.await();
    return res;
}

synchPromObj.prototype.executePromiseFiber = function (fn) {
    //console.log(fn)
    // console.log(arguments)
    var params = [];
    var argl = arguments.length
    for (var i = 1; i < argl; i++) {
        params.push(arguments[i]);
    }
    return this.executePromiseFiberInt(fn, params);
}

var runPromiseFiberFn = function (obj, fn, params, defer) {
    fn.apply(obj, params).then(function (res) {
        //fn().then(function (res) {
        defer(null, res)
    }).catch(function (e) {

        defer(e)
    })
}

exports.executePromiseFiberFnName = function (obj, fnName) {
    //console.log(fn)
    // console.log(arguments)
    var params = [];
    var argl = arguments.length
    for (var i = 2; i < argl; i++) {
        params.push(arguments[i]);
    }
    var fn = obj[fnName]

    return executePromiseFiberIntFn(obj, fn, params);
}

exports.executePromiseFiberFn = function (obj, fn) {
    //console.log(fn)
    // console.log(arguments)
    var params = [];
    var argl = arguments.length
    for (var i = 2; i < argl; i++) {
        params.push(arguments[i]);
    }
    return executePromiseFiberIntFn(obj, fn, params);
}

var executePromiseFiberIntFn = function (obj, fn, params) {
    var defer = sync.defer();
    runPromiseFiberFn(obj, fn, params, defer)
    var res = sync.await();
    return res;
}

var executeFiberIntFn = function (obj, fn, params, returnParamsNameArr) {
    //var defer = sync.defer();
    //runFiber(fn, params, defer)

    if (returnParamsNameArr)
        params.push(sync.defers.apply(obj, returnParamsNameArr))
    else
        params.push(sync.defer())

    //console.log(params)
    var res = sync.await(fn.apply(obj, params));
    return res;
}

exports.executeFiberFn = function (obj, fn) {
        //console.log(fn)
        //console.log(arguments)
        var params = [];
        var argl = arguments.length
        for (var i = 2; i < argl; i++) {
            params.push(arguments[i]);
        }
        return executeFiberIntFn(obj, fn, params);
    }
    /*
    exports.executeFiberFnName = function (obj, fnName) {
        //console.log(fn)
        //console.log(arguments)
        var params = [];
        var argl = arguments.length
        for (var i = 2; i < argl; i++) {
            params.push(arguments[i]);
        }
        var fn = obj[fnName]
        return executeFiberIntFn(obj, fn, params);
    }
    */

exports.executeFiberFnMultiParamCb = function (obj, fn, returnParamsNameArr) {
        //console.log(fn)
        //console.log(arguments)
        var params = [];
        var argl = arguments.length
        for (var i = 3; i < argl; i++) {
            params.push(arguments[i]);
        }
        return executeFiberIntFn(obj, fn, params, returnParamsNameArr);
    }
    /*
    exports.executeFiberFnNameMultiParamCb = function (obj, fnName, returnParamsNameArr) {
        //console.log(fn)
        //console.log(arguments)
        var params = [];
        var argl = arguments.length
        for (var i = 3; i < argl; i++) {
            params.push(arguments[i]);
        }
        var fn = obj[fnName]
        return executeFiberIntFn(obj, fn, params, returnParamsNameArr);
    }
    */



exports.getSynchPromiseObj = function (that) {
    return new synchPromObj(that)
};

exports.getSynchCallbackObj = function (that, returnParamsNameArr) {
    return new synchObj(that, returnParamsNameArr)
}

exports.executeSynch = function (fn, done) {
    sync.fiber(fn, done);
}

exports.setThreadLocalValue = function (key, value) {
    if (sync.Fiber && sync.Fiber.current)
        sync.Fiber.current[key] = value;
    else {
        console.log("ERROR", "NO Fiber Thread")
        throw Error("NO Fiber Thread");
    }
}

exports.getThreadLocalValue = function (key) {
    if (sync.Fiber && sync.Fiber.current)
        return sync.Fiber.current[key];
    else {
        // throw Error("NO Fiber Thread");
        console.log("ERROR", "NO Fiber Thread")
        return undefined;
    }

}