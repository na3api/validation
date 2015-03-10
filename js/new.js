 $.validOptions = {
    type: 'field',
    lang: 'en',
    required: '.required',
    action: 'submit',
    actionsType: ['submit', 'click', 'change', 'select'],
    watchInputs: true,
    watchDataMask: false,
    byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
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
    criticalError:{
        bad_action:'This action type is not available',
        bad_element:'This element is not avalible',
        bad_form:'This form is not exist',
        
    }
};

$.fn.validation= function(options){
    if(typeof(options) !== 'undefined'){
        
        var form = $(this);
        var form_id = $(this).attr('id') ? $(this).attr('id') : undefined;
        var form_class = $(this).attr('class') ? $(this).attr('class') : undefined;
         
        if(typeof(options.lang) !== 'undefined')
        {
            $.validOptions.lang = options.lang;
        }
        if(typeof(options.action) !== 'undefined')
        {
            if(options.action !== 'submit')
            {
                if(typeof(options.action) === 'object')
                {
                    if(typeof(options.action.type) !== 'undefined' && $.inArray( options.action.type, $.validOptions.actionsType ) )
                    {
                        
                    }else{
                        this.error('')
                    }
                }else{
                    $.validOptions.action = options.action;
                }
                
            }else{
                
                $.validOptions.action = options.action;
            }
        }
        if(typeof(options.type) !== 'undefined')
        {
            $.validOptions.type = options.type;
        }
        console.log($.validOptions);
        
        var fields = {};
        var i=0;
//        form.childrens($.validOptions.required).each(function(){
//            fields[i++].obj = $(this);
//            
//        })
        console.log('#' + form_id + ' ' + $.validOptions.required)
        $('#' + form_id + ' ' + $.validOptions.required).each(function(){
            fields[i++] = {obj : $(this)};
            
        })
        
        console.log(fields)
        /**
         * @wer
         * */
        var error = function()
        {
            
        }
    }
    
};