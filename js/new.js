/**
 * EXEMPELS - options
 * @lang:'ru'
 * @type:'field'
 * @action:'submit'/  {type:'click', on:'button'}
 * @success:function(request)
 * @error:function(request)
 *  */
$.validOptions = {
    type: 'field',
    lang: 'en',
    required: '.required',
    action: 'submit',
    translation: {
        ru:{
            field:{
                required:'Поле не должно быть пустым.',
                email   :'Введите корректный email.',
                min     :'Значение поля должно быть больше {0}.',
                max     :'Значение поля должно быть меньше {0}.'                
            },
            popup:{
                required:'Поле не должно быть пустым.',
                email   :'Введите корректный email.',
                min     :'Значение поля должно быть больше {0}.',
                max     :'Значение поля должно быть меньше {0}.' 
            }
        },
        en:{
            field:{
                required:'This field is required.',
                email   :'Please enter a valid email address.',
                number  :'Please enter a valid number.',
                not_in  :'Please enter number in {0} ',
                min     :'Please enter at least {0} characters.',
                max     :'Please enter no more than {0} characters.',
                pass    :'Error_pass',
                special_char :'Enter without special characters.',
                
            },
            popup:{
                required:'<b>{f}</b>. Field  is required.',
                email   :'<b>{f}</b>. Please enter a valid email address.',
                number  :'<b>{f}</b>. Please enter a valid number.',
                not_in  :'<b>{f}</b>. Please enter number in {0} ',
                min     :'<b>{f}</b>. Please enter at least {0} characters.',
                max     :'<b>{f}</b>. Please enter no more than {0} characters.',
                special_char :'<b>{f}</b>. Enter without special characters.',
                pass    :'<b>Password</b>. New password and repeated new password did not match.'
            }
        }
    },
    
};
/*
 * Not editable options
 */
$.serviceOptions = {
    actionsType: ['submit', 'click', 'change', 'select'],
    criticalError:{
        bad_action:'This action type is not available',
        bad_element:'This element is not avalible',
        bad_form:'This form is not exist',
        bad_error_type:'This error type is not exist'
    },
    elementClass:['required','no','email','number','pass','pass_again','string'],
    elementAttribute:['valid-min','valid-max','valid-in']
}
var servise_errors = [];
$.fn.validation = function(options){
    if(typeof(options) !== undefined){
        
        var service_error = [];
        var form = $(this);
        var form_id = $(this).attr('id') ? $(this).attr('id') : undefined;
        var form_class = $(this).attr('class') ? $(this).attr('class') : undefined;
         console.log($.validOptions);
        if(typeof(options.lang) !== undefined)
        {
            $.validOptions.lang = options.lang;
        }
        if(typeof(options.action) !== 'undefined')
        {
            if(options.action !== 'submit')
            {
                if(typeof(options.action) === 'object')
                {
                    if(typeof(options.action.type) !== 'undefined' && $.inArray( options.action.type, $.serviceOptions.actionsType ) >= 0 )
                    {
                        if(typeof(options.action.on) !== 'undefined' && $(options.action.on).length )
                        {
                            $.validOptions.action = {type:options.action, on: $(options.action.on)};    
                        }else{
                            solutions.service_error('bad_element');
                        }
                    }else{
                        solutions.service_error('bad_action');
                    }
                }else{
                    $.validOptions.action = {type:options.action, on: this };
                }              
            }else{                
                $.validOptions.action = {type:options.action, on: this };
            }
        }else{
            if( typeof($.validOptions.action) !== 'undefined' && $.inArray( $.validOptions.action, $.serviceOptions.actionsType ) >= 0 )
            {
                $.validOptions.action = {type : $.validOptions.action, on: this };
            }else{
                solutions.service_error('bad_action');
            }
        }
        if(typeof(options.type) !== 'undefined')
        {
            $.validOptions.type = options.type;
        }
        /**
         * FIELD LIST
         * */
        var fields = {};
        var count = 0;
        $('#' + form_id + ' ' + $.validOptions.required).each(function(){
            fields[count] = {object:$(this)};
            for(var i in $.serviceOptions.elementClass)
            {
                var c = 0;
                fields[count].class = {};
                if($(this).hasClass($.serviceOptions.elementClass[i]))
                {
                    console.log({ c: $.serviceOptions.elementClass[i] })
                    fields[count].class[c] = $.serviceOptions.elementClass[i] ;
                    c++;
                }
            }
            count++;
        })
        $(document).on($.validOptions.action.type, $.validOptions.action.on, function(e){
            e.preventDefault();
            for(var el in fields)
            {
                console.log(fields[el].val());
            }
            if(typeof(options.success) === 'function'){
                //success request 
                solutions.success($.validOptions, function(request){
                    //options.success('122');
                });
               
            }
        })       
        
//        form.childrens($.validOptions.required).each(function(){
//            fields[i++].obj = $(this);
//            
//        })
        //console.log('#' + form_id + ' ' + $.validOptions.required)

        
        console.log(fields)
    }
    
};
var solutions = {
    /**
     * SERVICE ERROR 
     * */
    service_error:function(key){
        if($.serviceOptions.criticalError[key] !== undefined)
        {
            var mess = 'Error:: '+$.serviceOptions.criticalError[key] + '!!!';
            servise_errors.push(mess)
            console.log(mess);
            return false;
        }else{
            this.service_error('bad_error_type');
        }
    },
    success: function(arg, callback ) {
        return callback(this);
    },
    
};