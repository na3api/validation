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
        ru: {
            field: {
                required: 'Поле не должно быть пустым.',
                email: 'Введите корректный email.',
                min: 'Значение поля должно быть больше {0}.',
                max: 'Значение поля должно быть меньше {0}.'
            },
            popup: {
                required: 'Поле не должно быть пустым.',
                email: 'Введите корректный email.',
                min: 'Значение поля должно быть больше {0}.',
                max: 'Значение поля должно быть меньше {0}.'
            }
        },
        en: {
            field: {
                required: 'This field is required.',
                email: 'Please enter a valid email address.',
                number: 'Please enter a valid number.',
                not_in: 'Please enter number in {0} ',
                min: 'Please enter at least {0} characters.',
                max: 'Please enter no more than {0} characters.',
                pass: 'Error_pass',
                special_char: 'Enter without special characters.',
            },
            popup: {
                required: '<b>{f}</b>. Field  is required.',
                email: '<b>{f}</b>. Please enter a valid email address.',
                number: '<b>{f}</b>. Please enter a valid number.',
                not_in: '<b>{f}</b>. Please enter number in {0} ',
                min: '<b>{f}</b>. Please enter at least {0} characters.',
                max: '<b>{f}</b>. Please enter no more than {0} characters.',
                special_char: '<b>{f}</b>. Enter without special characters.',
                pass: '<b>Password</b>. New password and repeated new password did not match.'
            }
        }
    },
};
/*
 * Not editable options
 */
$.serviceOptions = {
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
        console.log($.validOptions);
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
                    fields[count].attributes[attr_count] = $.serviceOptions.elementAttribute[i];
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
                var attributes = fields[el].attributes;
                //if element not disabled
                if (!object.attr('disabled'))
                {
                    var value = object.val();

                    if (object.hasClass('error'))
                    {
                        object.removeClass('error').val('');
                    }
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
                    if (!count && !s.inArray('no', classes))
                    {
                        //////////////////////////end//////////////////
                        if (s.inArray('selectbox', classes))
                        {
                            var sb = $(this).attr('sb');
                            $('#sbHolder_' + sb).addClass('error');
                            setError($(this), 'required');
                        } else {
                            error = 1;
                            setError($(this), 'required');
                        }
                    } else {
                        if (count)
                        {
                            /*string*/
                            if ($(this).hasClass('string')) {
                                if (!ValidateString(value) && !$(this).hasClass('email')) {
                                    error = 1;
                                    setError($(this), 'special_char');
                                }
                            }

                            /*pass AND pass2*/
                            if ($(this).hasClass('pass2')) {
                                if (value != $(this).siblings('.pass').val()) {
                                    error = 1;
                                    setError($(this), 'pass');
                                }
                            }
                            /*email*/
                            if ($(this).hasClass('email')) {
                                if (!ValidateEmail(value)) {
                                    error = 1;
                                    setError($(this), 'email');
                                }
                            }
                            /*number*/
                            if ($(this).hasClass('number')) {
                                if (!IsNumeric(value)) {
                                    error = 1;
                                    setError($(this), 'number');
                                } else {
                                    value = parseFloat($(this).val())
                                    /*data-in*/
                                    if ($(this).attr('data-in'))
                                    {
                                        var more = $(this).attr('data-in').split('-');
                                        var min = parseFloat(more[0]);
                                        var max = parseFloat(more[1]);
                                        if (value < min || value > max)
                                        {
                                            error = 1;
                                            setError($(this), 'not_in', $(this).attr('data-in'));
                                        }
                                    }
                                }
                            }
                            /*data-min*/
                            if ($(this).attr('data-min'))
                            {
                                var min = $(this).attr('data-min');
                                if (min > count_symbols)
                                {
                                    error = 1;
                                    setError($(this), 'min', min);
                                }
                            }
                            /*data-max*/
                            if ($(this).attr('data-max'))
                            {
                                var max = $(this).attr('data-max');
                                if (max < count_symbols)
                                {
                                    error = 1;
                                    setError($(this), 'max', max);
                                }

                            }

                        }
                    }
                }
                var value = fields[el].val();
                console.log(fields[el].val());
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


        console.log(fields)
    }

};
var solutions = s = {
    /**
     * SERVICE ERROR 
     * */
    service_error: function(key) {
        if ($.serviceOptions.criticalError[key] !== undefined)
        {
            var mess = 'Error:: ' + $.serviceOptions.criticalError[key] + '!!!';
            servise_errors.push(mess)
            console.log(mess);
            return false;
        } else {
            this.service_error('bad_error_type');
        }
    },
    success: function(arg, callback) {
        return callback(this);
    },
    inArray: function(elem, arr) {
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
    }
};
