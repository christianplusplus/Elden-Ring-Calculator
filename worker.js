importScripts('script.js');

status_update = function(progress) {
    postMessage({header: 'update', progress: progress});
};

onmessage = function(e) {
    for(var [key, value] of Object.entries(JSON.parse(e.data.globals)))
        self[key] = value;
    var runnable = eval(e.data.runnable);
    var args = JSON.parse(e.data.args);
    var predicates = e.data.predicates;
    if(predicates)
        predicates = predicates.map(text => eval('weapon => ' + text));
    var result = runnable(...args, predicates);
    postMessage({header: 'result', result: result});
};