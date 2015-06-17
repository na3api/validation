/**
 * Author Nazar Shershin
 * Version 2.0
 * 2015
 * 
 * EXEMPELS - options
 * @lang:'ru'
 * @type:'field'
 * @action:'submit'/  {type:'click', on:'button'}
 * @success:function(request)
 * @error:function(request)
 *  
 * @attr data-ajax: "{"url":"/check_card_active", "data": {"card_num": $('#card_num').val()}}"
 *       server response format: (false){error: "Error message"}
 * @attr data-file: "{"formats":"jpg,bmp,png", "max_size":"5150000", "min_size":"100000"}" //size in bytes 
 *       
 *       
 *       */
$.validOptions = {
    type: 'field',
    lang: 'en',
    action: 'submit',
    elementClass: {
        required: 'wpcf7-validates-as-required',
        no: 'no',
        email: 'wpcf7-email',
        number: 'number',
        pass: 'pass',
        pass_again: 'pass_again',
        string: 'wpcf7-text',
        phone: 'phone-valid',
        site: 'site',
        selectbox: 'selectbox'
    },
    translation: {
        ua: {
            required: 'Поле не должно быть пустым.',
            email: 'Введите корректный email.',
            min: 'Значение поля должно быть больше {0}.',
            max: 'Значение поля должно быть меньше {0}.',
        },
        ru: {
            required: 'Не может быть пустым',
            email: 'имеет неверное значение',
            string: 'может включать только буквы, пробелы и символ "-"',
            min: 'Значение поля должно быть больше {0}',
            max: 'Значение поля должно быть меньше {0}',
            number: 'может включать только цифры',
            pass: 'Пароль не совпадает с подтверждением',
            ajax: '{0}',
            phone: 'Поле имеет неверный формат',
            site: 'имеет неверное значение, www.example.com',
            special_char: 'Enter without special characters.',
            file_format: 'Неверный формат файла',
            file_min_size: 'Должен быть меньше чем {0} Mb',
            file_max_size: 'Должен быть больше чем {0} Mb',
        },
        en: {
            required: 'can\'t be blank',
            string: 'can only include letters, spaces and character "-"',
            phone: 'The "Telephone" has an invalid format',
            email: 'is invalid',
            number: 'please enter a valid number',
            not_in: 'please enter number in {0} ',
            min: 'is too short (minimum is {0} characters)',
            max: 'is too long (maximum is {0} characters)',
            ajax: '{0}',
            pass: 'Password not fit confirmation',
            special_char: 'Enter without special characters.',
            site: 'is invalid, www.example.com',
            file_format: 'Wrong file format',
            file_min_size: 'Must be less than {0} Mb',
            file_max_size: 'Must be more than {0} Mb',
        }
    },
};
/*
 * Not editable options
 */
$.serviceOptions = {
    errorClass:'error',
    type: ['field', 'popup', 'underfield'],
    actionsType: ['submit', 'click', 'change', 'select'],
    criticalError: {
        bad_action: 'This action type is not available',
        bad_element: 'This element is not avalible',
        bad_form: 'This form is not exist',
        bad_error_type: 'This error type is not exist',
        havent_translation: 'You havent translate for this field error',
        bad_json_format: 'Json format is not valid',
    },
    elementAttribute: { min:'data_min', max:'data_max', in:'data_in', ajax:'data_ajax', file:'data_file'}
}
var servise_errors = [];

$.fn.validation = function (options) {
    if (typeof (options) !== undefined) {

        var service_error = [];
        var form = $(this);
        var form_id = $(this).attr('id') ? $(this).attr('id') : undefined;
        var form_class = $(this).attr('class') ? $(this).attr('class') : undefined;

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
                            $.validOptions.action = {type: options.action.type, on: $(options.action.on)};
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
        $('#' + form_id + ' .' + $.validOptions.elementClass.required).each(function ()
        {
            fields[count] = {object: $(this), class: {}, attribute: {}};
            var class_count = 0,
                    attr_count = 0;
            //class collection

            for (var i in $.validOptions.elementClass)
            {
                if ($(this).hasClass($.validOptions.elementClass[i]))
                {
                    fields[count].class[class_count] = $.validOptions.elementClass[i];
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
        $(document).on($.validOptions.action.type, '#' + $.validOptions.action.on.attr('id'), function (e) {
            if ($(this).hasClass('no_valid'))
            {
                return true;
            } else {
                e.preventDefault();
                s.isError = 0;
                for (var el in fields)
                {
                    var classes = fields[el].class;
                    var attributes = fields[el].attribute;

                    if (fields[el].object.attr('id'))
                        var object = $('#' + fields[el].object.attr('id'));
                    else
                        var object = $('[name="' + fields[el].object.attr('name') + '"]');

                    //if element not disabled
                    if (!object.attr('disabled'))
                    {
                        if (object.hasClass('error'))
                        {
                            object.removeClass('error').siblings('.message').remove();
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

                        if (!count && !s.inArray($.validOptions.elementClass.no, classes))
                        {
                            if (s.inArray($.validOptions.elementClass.selectbox, classes))
                            {
                                s.setError(object, 'required');
                            } else {
                                s.setError(object, 'required');
                            }
                        } else {
                            if (count)
                            {
                                /*string*/
                                if (s.inArray($.validOptions.elementClass.string, classes)) {
                                    if (!s.validString(value) && !s.inArray($.validOptions.elementClass.email, classes)) {
                                        s.setError(object, 'string');
                                    }
                                }
                                /*phone*/
                                if (s.inArray($.validOptions.elementClass.phone, classes)) {
                                    if (!s.validPhone(value) && !s.inArray($.validOptions.elementClass.email, classes)) {
                                        s.setError(object, 'phone');
                                    }
                                }
                                /*site*/
                                if (s.inArray($.validOptions.elementClass.site, classes)) {
                                    if (!s.validSite(value) && !s.inArray($.validOptions.elementClass.email, classes)) {
                                        s.setError(object, 'site');
                                    }
                                }

                                /*email*/
                                if (s.inArray($.validOptions.elementClass.email, classes)) {
                                    if (!s.validateEmail(value)) {
                                        s.setError(object, 'email');
                                    }
                                }
                                /*pass AND pass2*/
                                if (s.inArray($.validOptions.elementClass.pass_again, classes)) {
                                    if (value != object.parents('form').find('.pass').val()) {
                                        s.setError(object, 'pass');
                                    }
                                }
                                /*number*/
                                if (s.inArray($.validOptions.elementClass.number, classes)) {
                                    if (!s.IsNumeric(value)) {
                                        s.setError(object, 'number');
                                    } else {
                                        value = parseFloat(value)
                                        /*data-in*/
                                        if (s.inArray($.serviceOptions.elementAttribute.in, attributes))
                                        {
                                            var more = object.attr($.serviceOptions.elementAttribute.in).split('-');
                                            var min = parseFloat(more[0]);
                                            var max = parseFloat(more[1]);
                                            if (value < min || value > max)
                                            {
                                                s.setError(object, 'not_in', object.attr('data_in'));
                                            }
                                        }
                                    }
                                }
                                /*data-min*/
                                if (s.inArray($.serviceOptions.elementAttribute.min, attributes))
                                {
                                    var min = object.attr($.serviceOptions.elementAttribute.min);
                                    if (min > count_symbols)
                                    {
                                        s.setError(object, 'min', min);
                                    }
                                }
                                /*data-max*/
                                if (s.inArray($.serviceOptions.elementAttribute.max, attributes))
                                {
                                    var max = object.attr($.serviceOptions.elementAttribute.max);
                                    if (max < count_symbols)
                                    {
                                        s.setError(object, 'max', max);
                                    }

                                }
                                /*data-ajax*/

                                if (s.inArray($.serviceOptions.elementAttribute.file, attributes))
                                {
                                    var parse_json;
                                    if (parse_json = s.parseJson(object.attr($.serviceOptions.elementAttribute.file)))
                                    {
                                        console.log(parse_json)
                                        var formates = typeof (parse_json.formates) !== 'undefined' ? parse_json.formates.split(',') : false
                                        var min_size = typeof (parse_json.min_size) !== 'undefined' ? parse_json.min_size : false
                                        var max_size = typeof (parse_json.max_size) !== 'undefined' ? parse_json.max_size : false
                                        var file = s.getFile(object);
                                        if(formates && !s.inArray(file.format, formates))
                                        {
                                            s.setError(object, 'file_format');
                                        }else{
                                            if(min_size && min_size > file.size )
                                            {
                                                s.setError(object, 'file_max_size', min_size/1024/1024);                                                    
                                            }
                                            if(max_size && max_size < file.size )
                                            {
                                                s.setError(object, 'file_min_size',max_size/1024/1024);                                                    
                                            }
                                                
                                        }
                                        console.log(file)
                                    }
                                }
                                /*data-ajax*/
                                if (!object.hasClass($.serviceOptions.errorClass))
                                {
                                    if (s.inArray($.serviceOptions.elementAttribute.ajax, attributes))
                                    {
                                        var parse_ajax;
                                        if (parse_ajax = s.parseJson(object.attr($.serviceOptions.elementAttribute.ajax)))
                                        {
                                            var data = typeof (parse_ajax.data) !== 'undefined' ? parse_ajax.data : s.parseJson('{ "' + (object.attr('id') ? object.attr('id') : object.attr('name')) + '": "' + object.val() + '"}');
                                            $.ajax({
                                                type: typeof (parse_ajax.type) !== 'undefined' ? parse_ajax.type : 'post',
                                                data: data,
                                                url: typeof (parse_ajax.url) !== 'undefined' ? parse_ajax.url : '/',
                                                dataType: 'json',
                                                async: false,
                                                success: function (data) {
                                                    if (data.error)
                                                    {
                                                        s.setError(object, 'ajax', data.error);
                                                    }
                                                }
                                            })
                                        }
                                    }
                                }
                            } else {
                                /*pass2 empty*/
                                if (s.inArray($.validOptions.elementClass.pass_again, classes)) {
                                    if (value != object.parents('form').find('.pass').val()) {
                                        s.setError(object, 'pass');
                                    }
                                }
                            }
                        }
                    }
                }
                if (typeof (options.success) === 'function' && s.isError == 0) {
                    //success request 
                    solutions.success($.validOptions, function (request) {
                        options.success(true);
                    });

                } else {
                    s.scrollToElement('.'+$.serviceOptions.errorClass+':first');
                }
            }
        })
    }

};
var solutions = s = {
    isError: 0,
    errorMess: '',
    /**
     * SERVICE ERROR 
     * */
    service_error: function (key) {
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
    success: function (arg, callback) {
        return callback(this);
    },
    inArray: function (elem, arr) {
        if (arr) {
            for (var i in arr) {
                // Skip accessing in sparse arrays
                if (i in arr && arr[ i ] === elem) {
                    return true;
                }
            }
        }
        return false;
    },
    inKeys: function (elem, arr) {
        if (arr[elem] !== 'undefined') {
            return true;
        } else {
            return false;
        }
    },
    count: function (value, sumbols)
    {
        if (sumbols !== 'undefined' && sumbols)
        {
            return value.replace(/&nbsp;/gi, ' ').length;
        } else {
            return value.replace(/\s+/g, '').replace(/&nbsp;/gi, '').length;
        }
    },
    /**
     * SET ERROR 
     * */
    setError: function (element, error, num)
    {
        if (typeof (num) === 'undefined')
            num = '';

        if ($.validOptions.translation[$.validOptions.lang][error])
        {
            var message = $.validOptions.translation[$.validOptions.lang][error].replace("{0}", num);
            if ($.validOptions.type == 'field')
            {
                element.addClass($.serviceOptions.errorClass).val(message);
            } else if ($.validOptions.type == 'popup') {
                this.errorMess += '<li>' + message.replace("{f}", (element.attr('data-title') ? element.attr('data-title') : element.attr('name'))) + '</li>';
            }
            else if ($.validOptions.type == 'underfield') {
                element.addClass($.serviceOptions.errorClass).after('<label class="message">' + message.replace("{f}", (element.attr('data-title') ? element.attr('data-title') : element.attr('name'))) + '</label>');
            }
            this.isError = 1;
        } else {
            this.service_error('havent_translation');
        }

    },
    /*
     *email validation 
     */
    validateEmail: function (email)
    {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        {
            return (true)
        } else {
            return (false)
        }
    },
    /*
     * 
     */
    validPhone: function (value)
    {
        if (/^[\d \+\-\(\)]{5,18}$/.test(value))
        {
            return (true)
        } else {
            return (false)
        }
    },
    /*
     * 
     */
    validString: function (value)
    {
        if (/^[a-zA-Zа-яіїєґА-ЯІЇЄҐ\.\-\s]+$/.test(value))
        {
            return (true)
        } else {
            return (false)
        }
    },
    /*
     * 
     */
    validSite: function (value)
    {
        if (/^(http\:\/\/|https\:\/\/)?([a-z0-9][a-z0-9\-]*\.)+[a-z0-9][a-z0-9\-]*$/i.test(value))
        {
            return (true)
        } else {
            return (false)
        }
    },
    /*
     * 
     */
    IsNumeric: function (number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    },
    /*
     *  remove not number sumbols 
     */
    notNumber: function (input) {
        input.val(input.val().replace(/[^\d]/g, ''));
    },
    scrollToElement: function (selector, time, verticalOffset)
    {
        time = typeof (time) != 'undefined' ? time : 1000;
        verticalOffset = typeof (verticalOffset) != 'undefined' ? verticalOffset : -20;
        element = $(selector);
        offset = element.offset();
        if (offset !== 'undefined')
        {
            offsetTop = offset.top + verticalOffset;
            $('html, body').animate({
                scrollTop: offsetTop
            }, time);
        }
    },
    parseJson: function (json)
    {
        try {
            return JSON && JSON.parse(json) || $.parseJSON(json)
        } catch (e) {
            console.log(e);
            this.service_error('bad_json_format');
            return false;
        }
    },
    /*
     * get file attributes
     */
    getFile: function (object)
    {
        var file_attributes = {}
        file_attributes['name'] = object.val().split('\\').pop();
        file_attributes['format'] =  object[0].files[0].name.split('.').pop().toLowerCase();
        file_attributes['size'] =  object[0].files[0].size;
        return file_attributes;
    }
};
/*
 * Remove class error from elements
 */
$(document).on('click focus change', '.' + $.validOptions.elementClass.required, function () {
    if ($(this).hasClass($.serviceOptions.errorClass))
    {
        if ($(this).hasClass('selectbox'))
        {
            $('#sbHolder_' + $(this).attr('sb')).removeClass($.serviceOptions.errorClass);
            $(this).removeClass($.serviceOptions.errorClass);

        } else {
            if ($(this).hasClass($.validOptions.elementClass.pass) && $(this).hasClass($.validOptions.elementClass.pass_again))
            {
                $(this).removeClass($.serviceOptions.errorClass).val('').siblings('.message').remove();
            } else {
                $(this).removeClass($.serviceOptions.errorClass).siblings('.message').remove();

            }
        }
    }
})
$(document).on('keyup change', '.' + $.validOptions.elementClass.number, function () {
    return s.notNumber($(this));
})
