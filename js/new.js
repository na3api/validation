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
        ua: {
            required: 'Поле не должно быть пустым.',
            email: 'Введите корректный email.',
            min: 'Значение поля должно быть больше {0}.',
            max: 'Значение поля должно быть меньше {0}.',
        },
        ru: {
            required: 'Поле не должно быть пустым.',
            email: 'Введите корректный email.',
            min: 'Значение поля должно быть больше {0}.',
            max: 'Значение поля должно быть меньше {0}.',
        },
        en: {
            required: 'This field is required.',
            email: 'Please enter a valid email address.',
            number: 'Please enter a valid number.',
            not_in: 'Please enter number in {0} ',
            min: 'Please enter at least {0} characters.',
            max: 'Please enter no more than {0} characters.',
            pass: 'Error_pass',
            special_char: 'Enter without special characters.',
        }
    },
};
/*
 * Not editable options
 */
$.serviceOptions = {
    type: ['field', 'popup', 'underfield'],
    actionsType: ['submit', 'click', 'change', 'select'],
    criticalError: {
        bad_action: 'This action type is not available',
        bad_element: 'This element is not avalible',
        bad_form: 'This form is not exist',
        bad_error_type: 'This error type is not exist'
    },
    elementClass: ['required', 'no', 'email', 'number', 'pass', 'pass_again', 'string','selectbox'],
    elementAttribute: ['data-min', 'data-max', 'data-in']
}
var servise_errors = [];
$.fn.validation = function(options) {
    if (typeof (options) !== undefined) {

        var service_error = [];
        var form = $(this);
        var form_id = $(this).attr('id') ? $(this).attr('id') : undefined;
        var form_class = $(this).attr('class') ? $(this).attr('class') : undefined;
        //console.log($.validOptions);
        if (typeof (options.lang) !== undefined)
        {
            $.validOptions.lang = options.lang;
        }
        if (typeof (options.action) !== 'undefined')
        {
            if (options.action !== 'submit')
            {
                if (typeof (options.action) === 'object')
                {
                    if (typeof (options.action.type) !== 'undefined' && $.inArray(options.action.type, $.serviceOptions.actionsType) >= 0)
                    {
                        if (typeof (options.action.on) !== 'undefined' && $(options.action.on).length)
                        {
                            $.validOptions.action = {type: options.action, on: $(options.action.on)};
                        } else {
                            solutions.service_error('bad_element');
                        }
                    } else {
                        solutions.service_error('bad_action');
                    }
                } else {
                    $.validOptions.action = {type: options.action, on: this};
                }
            } else {
                $.validOptions.action = {type: options.action, on: this};
            }
        } else {
            if (typeof ($.validOptions.action) !== 'undefined' && $.inArray($.validOptions.action, $.serviceOptions.actionsType) >= 0)
            {
                $.validOptions.action = {type: $.validOptions.action, on: this};
            } else {
                solutions.service_error('bad_action');
            }
        }
        if (typeof (options.type) !== 'undefined')
        {
            $.validOptions.type = options.type;
        }
        /**
         * FIELD LIST
         * */
        var fields = {};
        var count = 0;
        $('#' + form_id + ' ' + $.validOptions.required).each(function()
        {
            fields[count] = {object: $(this), class: {}, attribute: {}};
            var class_count = 0,
            attr_count = 0;
            //class collection
            for (var i in $.serviceOptions.elementClass)
            {
                if ($(this).hasClass($.serviceOptions.elementClass[i]))
                {
                    fields[count].class[class_count] = $.serviceOptions.elementClass[i];
                    class_count++;
                }
            }
            //attributes collection
            for (var i in $.serviceOptions.elementAttribute)
            {
                if ($(this).attr($.serviceOptions.elementAttribute[i]))
                {
                    fields[count].attribute[attr_count] = $.serviceOptions.elementAttribute[i];
                    attr_count++;
                }
            }
            count++;
        })
        $(document).on($.validOptions.action.type, $.validOptions.action.on, function(e) {
            e.preventDefault();
            for (var el in fields)
            {
                var object = fields[el].object;
                var classes = fields[el].class;
                var attributes = fields[el].attribute;
                //if element not disabled
                if (!object.attr('disabled'))
                {
                    if (object.hasClass('error'))
                    {
                        object.removeClass('error').val('').siblings('.message').remove();
                    }
                    var value = object.val();
                    if (value == '0')
                    {
                        value = null;
                    }
                    if (value)
                    {
                        var count = s.count(value);
                        var count_symbols = s.count(value, true);

                    } else {
                        var count = 0;
                    }
                    console.log(count);
                    if (!count && !s.inArray('no', classes))
                    {
                        if (s.inArray('selectbox', classes))
                        {
                            s.setError(object, 'required');
                        } else {
                            s.setError(object, 'required');
                        }
                    } else {
                        if (count)
                        {
                            /*string*/
                            if (s.inArray('string', classes)) {
                                if (!ValidateString(value) && !s.inArray('email', classes)) {
                                    s.setError(object, 'special_char');
                                }
                            }
                            /*pass AND pass2*/
                            if (s.inArray('pass_again', classes)) {
                                if (value != object.parents('form').find('.pass').val()) {
                                    s.setError(object, 'pass');
                                }
                            }
                            /*email*/
                                //console.log(classes)    
                            if (s.inArray('email', classes)) {
                                if (!s.validateEmail(value)) {
                                    s.setError(object, 'email');
                                }
                            }
                            /*number*/
                            if (s.inArray('number', classes)) {
                                if (!s.IsNumeric(value)) {
                                    s.setError(object, 'number');
                                } else {
                                    value = parseFloat(value)
                                    /*data-in*/
                                    if (s.inArray('data-in',attributes))
                                    {
                                        var more = object.attr('data-in').split('-');
                                        var min = parseFloat(more[0]);
                                        var max = parseFloat(more[1]);
                                        if (value < min || value > max)
                                        {
                                            s.setError(object, 'not_in', object.attr('data-in'));
                                        }
                                    }
                                }
                            }
                            /*data-min*/
                            if (s.inArray('data-min', attributes))
                            {
                                var min = object.attr('data-min');
                                if (min > count_symbols)
                                {
                                    s.setError(object, 'min', min);
                                }
                            }
                            /*data-max*/
                            if (s.inArray('data-max', attributes))
                            {
                                var max = object.attr('data-max');
                                if (max < count_symbols)
                                {
                                    s.setError(object, 'max', max);
                                }

                            }

                        }
                    }
                }
                //var value = fields[el].val();
               // console.log(fields[el].val());
            }
            if (typeof (options.success) === 'function') {
                //success request 
                solutions.success($.validOptions, function(request) {
                    //options.success('122');
                });

            }
        })

//        form.childrens($.validOptions.required).each(function(){
//            fields[i++].obj = $(this);
//            
//        })
        //console.log('#' + form_id + ' ' + $.validOptions.required)


        //console.log(fields)
    }

};
var solutions = s = {
    isError:0,
    errorMess:'',
    /**
     * SERVICE ERROR 
     * */
    service_error: function(key) {
        if ($.serviceOptions.criticalError[key] !== undefined)
        {
            var mess = 'Error:: ' + $.serviceOptions.criticalError[key] + '!!!';
            servise_errors.push(mess)
            return false;
        } else {
            this.service_error('bad_error_type');
        }
    },
    success: function(arg, callback) {
        return callback(this);
    },
    inArray: function(elem, arr) {
        if ( arr ) {
            for (var i in arr ) {
                // Skip accessing in sparse arrays
                if ( i in arr && arr[ i ] === elem ) {
                        return true;
                }
            }
        }
        return false;
    },
    inKeys: function(elem, arr) {
        if(arr[elem] !== 'undefined'){
            return true;
        }else{
            return false;
        }
    },
    count: function(value, sumbols)
    {
        if(sumbols !== 'undefined' && sumbols)
        {
            return value.replace(/&nbsp;/gi, ' ').length;            
        }else{
            return value.replace(/\s+/g, '').replace(/&nbsp;/gi, '').length;                   
        }
    },
    /**
     * SET ERROR 
     * */
    setError:function( element, error, num)
    {
        if(typeof(num)==='undefined') num = '';

        var message = $.validOptions.translation[$.validOptions.lang][error].replace("{0}", num) ;
        if($.validOptions.type == 'field')
        {   
            element.addClass('error').val(message);
        }else if($.validOptions.type == 'popup'){
            this.errorMess += '<li>'+message.replace("{f}", (element.attr('data-title') ? element.attr('data-title'): element.attr('name')))+'</li>';
        }
        else if($.validOptions.type == 'underfield'){
            element.addClass('error').after( '<label class="message">'+message.replace("{f}", (element.attr('data-title') ? element.attr('data-title'): element.attr('name')))+'</label>');
        }
        this.error = 1;
    },
    /*
     *email validation 
     */
    validateEmail:function(email)
    {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))  
        {  
            return (true)  
        }else{
            return (false)          
        }  
    },
    /*
     * 
     */
    validateString:function(value)   
    {  
        if(/^[a-zA-Zа-яіїєґА-ЯІЇЄҐ0-9\.\s]+$/.test(value))
        {  
            return (true)  
        } else{
            return (false)             
        } 
    },
    /*
     * 
     */
    IsNumeric:function(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    },
    /*
     *  remove not number sumbols 
     */
    notNumber:function (input) {
        input.val(input.val().replace(/[^\d]/g, ''));
    }
}; 
/*
 * Remove class error from elements
 */
$(document).on('click focus change', $.validOptions.required , function(){
    if($(this).hasClass('error'))
    {
        if($(this).hasClass('selectbox'))
        {
            $('#sbHolder_'+$(this).attr('sb')).removeClass('error');
            $(this).removeClass('error');       
            
        }else{
            $(this).removeClass('error').val('').siblings('.message').remove();      
        }
    }
})
$(document).on('keyup change', $.validOptions.required+'.number',function(){
    return notNumber($(this));
})
