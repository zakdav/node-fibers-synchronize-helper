var synchProm = require('./index.js')
    //var synchProm = require('node-fibers-synchronize-helper')

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