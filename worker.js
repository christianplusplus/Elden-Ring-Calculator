importScripts('script.js');

status_update = function(progress) {
    postMessage({header: 'update', progress: progress});
};

onmessage = function(e) {
    var runnable = eval(e.data.runnable);
    var args = JSON.parse(e.data.args);
    var result = runnable(...args);
    postMessage({header: 'result', result: result});
};