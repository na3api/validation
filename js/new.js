 $.validOptions = {
    type: 'field',
    lang: 'en',
    dataMask: true,
    watchInterval: 300,
    watchInputs: true,
    watchDataMask: false,
    byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
    translation: {
        '0': {pattern: /\d/},
        '9': {pattern: /\d/, optional: true},
        '#': {pattern: /\d/, recursive: true},
        'A': {pattern: /[a-zA-Z0-9]/},
        'S': {pattern: /[a-zA-Z]/}
    }
};

$.fn.validation= function(options){
    if(typeof(options) !== 'undefined'){
        
        console.log($.validOptions);
        if(typeof(options.lang) !== 'undefined')
        {
            $.validOptions = options.lang;
        }
        if(typeof(options.lang) !== 'undefined')
        {
            $.validOptions = options.lang;
        }
    }
    console.log(options)
};