/**
 * Author Nazar Shershin
 * Version 2.2
 * 2015
 * 
 * EXEMPELS - params
 * @lang:'ru'
 * @type:'field','underfield','popup'
 * @action:'submit'/  {type:'click', on:'button'}
 * @success:function(request)
 * @error:function(request)
 *  
 * @attr data-ajax: "{"url":"/check_card_active", "data": {"card_num": $('#card_num').val()}}"
 *       server response format: (false){error: "Error message"}
 * @attr data-file: "{"formats":"jpg,bmp,png", "max_size":"5", "min_size":"0.1"}" //size in Mb 
 *       
 *       
 *       */
$.validOptions = {
    type: 'field',
    lang: 'ru',
    action: 'submit',
    scroll: false,
    elementClass: {
        required: 'required',
        no: 'no',
        email: 'email',
        number: 'number',
        pass: 'pass',
        pass_again: 'pass_again',
        string: 'string',
        phone: 'phone',
        site: 'site',
        selectbox: 'selectbox'
    },
    numberFormat: 3,
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
    errorContainer: "<label class=\"message\">",
    imagePrevClass: "prev_img",
};
/*
 * Not editable params
 */
$.serviceOptions = {
    errorClass: 'error',
    type: ['field', 'popup', 'underfield'],
    actionsType: ['submit', 'click', 'change', 'select'],
    keyup_time: 300,
    valid_date_name: 'data-id',
    criticalError: {
        bad_action: 'This action type is not available',
        bad_element: 'This element is not avalible',
        bad_form: 'This form is not exist',
        bad_error_type: 'This error type is not exist',
        havent_translation: 'You havent translate for this field error',
        bad_json_format: 'Json format is not valid',
    },
    validPrevImgClass: 'valid_prev_img',
    elementAttribute: {min: 'data-min', max: 'data-max', in: 'data-in', ajax: 'data-ajax', file: 'data-file'},
}
$.formsOptions = [];
var current_id = 0;
var servise_errors = [];
$.fn.clear_form = function() {
    $(this).find('input:not(.no_clear)').val('');
}
$.fn.validation = function(params)
{
    if (typeof params == "object" && !params.length) {
        var s = new solutions.init($(this), params);
        //console.log(s);
        /*  
         
         , function (s) {
         if (s.validOptions.action.type != 'keyup')
         {
         $(document).on(s.validOptions.action.type, '#' + s.validOptions.action.on, function (e) {
         
         if ($(this).hasClass('no_valid'))
         {
         return true;
         } else {
         e.preventDefault();
         s.isError = 0;
         
         for (var el in s.fields)
         {
         s.validation(s.fields[el], function () {
         });
         }
         if (typeof (params.success) === 'function' && s.isError == 0) {
         //success request 
         s.success(s.validOptions, function (request) {
         params.success(true);
         });
         } else {
         if (s.validOptions.scroll)
         {
         s.scrollToElement('.' + $.serviceOptions.errorClass + ':first');
         }
         }
         }
         });
         }
         
         $(document).on('click focus change', '#' + s.form_id + ' .' + s.validOptions.elementClass.required, function (e) {
         //console.log(e.type, this.tagName)
         if (e.type == 'change' && this.tagName == 'SELECT')
         {
         
         }
         if ($(this).hasClass($.serviceOptions.errorClass) && $(this).attr('type') != 'file')
         {
         if ($(this).hasClass(s.validOptions.elementClass.pass) || $(this).hasClass(s.validOptions.elementClass.pass_again))
         {
         $(this).removeClass($.serviceOptions.errorClass).val('').siblings('.message').remove();
         } else {
         
         if (s.validOptions.type == 'field')
         {
         $(this).removeClass($.serviceOptions.errorClass).val('');
         } else if (s.validOptions.type == 'underfield')
         {
         //    $(this).removeClass($.serviceOptions.errorClass).siblings('.message').remove();
         }
         }
         
         }
         })
         $(document).on('keyup  change', '#' + this.form_id + ' .' + s.validOptions.elementClass.required + ' .' + s.validOptions.elementClass.number, function () {
         if (s.validOptions.numberFormat)
         {
         var num = '';
         var k = -1;
         var value = s.nospace($(this).val());
         for (var i = value.length; i >= 0; i--)
         {
         num = value[i] + (k % s.validOptions.numberFormat == 0 ? ' ' : '') + num;
         k++;
         }
         $(this).val(num)
         }
         return s.notNumber($(this), 11);
         })
         
         });*/
    }
};

var solutions = s = {
    init: function(o, params) {
        this.form_identity = uniqID.get(o[0]);
        //this.form_class = o.attr('class') ? o.attr('class') : undefined;
        this.validOptions = Object.assign({}, $.validOptions);
        this.funtions = this.getFunctions(params);
        console.log(params);
        if (typeof (params.lang) != 'undefined')
        {
            this.validOptions.lang = params.lang;
        }
        if (typeof (params.action) != 'undefined')
        {
            if (params.action != 'submit')
            {
                if (typeof (params.action) === 'object')
                {
                    if (typeof (params.action.type) != 'undefined' && this.inArray(params.action.type, $.serviceOptions.actionsType))
                    {
                        if (typeof (params.action.on) != 'undefined' && $(params.action.on).length)
                        {
                            this.validOptions.action = {type: params.action.type, on: o.find(params.action.on).attr('id')};
                        } else {
                            console.log(this.service_error('bad_element'));
                        }
                    } else {
                        console.log(this.service_error('bad_action'));
                    }
                } else {
                    this.validOptions.action = {type: params.action, on: this.form_id};
                }
            } else {
                this.validOptions.action = {type: params.action, on: this.form_id};
            }
        } else {
            if (typeof (this.validOptions.action) != 'undefined' && this.inArray(this.validOptions.action, $.serviceOptions.actionsType))
            {
                this.validOptions.action = {type: this.validOptions.action, on: this.form_id};
            } else {
                console.log(this.service_error('bad_action'));
            }
        }
        if (typeof (params.type) != 'undefined')
        {
            this.validOptions.type = params.type;
        }
        if( typeof params.fields != 'undefined'){
            
        }
        /* get field parametrs */
        var elements = $('[' + $.serviceOptions.valid_date_name + '="' + this.form_identity + '"] .' + this.validOptions.elementClass.required),
                length = elements.length,
                fields = {};
        for (var index = 0; index < length; index++) {
            var element_id = uniqID.get(elements[index], 'el_');
            fields[element_id] = {
                object    :  elements[index],
                fields    :  this.getClasses(elements[index])
            };
        }   
        this.validFields = fields;
        return this;
        
        
        this.validOptions['params'] = this.params
        $.formsOptions[this.form_id] = this.validOptions;
        var count = 0,
                fields = {},
                validOptions = this.validOptions,
                solutions = this,
                id = '',
                key_up_timer = false

        $('#' + this.form_id + ' .' + this.validOptions.elementClass.required).each(function(e)
        {
            //this.validOptions
            if ($(this).attr('id'))
            {
                id = $(this).attr('id');
            } else {
                id = $(this).attr('name') + '_' + count;
                $(this).attr('id', id);
            }
            fields[id] = {object: $(this), class: {}, attribute: {}};
            var class_count = 0,
                    attr_count = 0;
            //class collection
            for (var i in validOptions.elementClass)
            {
                if ($(this).hasClass(validOptions.elementClass[i]))
                {
                    fields[id].class[class_count] = validOptions.elementClass[i];
                    class_count++;
                }
            }
            //attributes collection
            for (var i in $.serviceOptions.elementAttribute)
            {
                if ($(this).attr($.serviceOptions.elementAttribute[i]))
                {

                    if (i == 'ajax')
                    {
                        $(document).on('change', '#' + $(this).attr('id'), function(e) {
                            //document.querySelector('#' + solutions.form_id + ' #' + id).addEventListener('change', function () {
                            solutions.ajax_validation($(this), function(error, object) {
                                solutions.sendFeedback(object, error);
                                if (error)
                                {
                                    error = solutions.setError(object, 'ajax', error);
                                }
                                solutions.isGroupError[object.attr("id")] = error;
                                if (solutions.checkOnError()) {
                                    solutions.sendSuccess();
                                } else {
                                    solutions.sendError();
                                }
                            });

                        })
                    }
                    fields[id].attribute[attr_count] = $.serviceOptions.elementAttribute[i];
                    attr_count++;

                }
            }
            if (validOptions.action.type == 'keyup') {
                if ($(this).val())
                {
                    solutions.validation(fields[id], function(error, object) {
                        solutions.isGroupError[id] = error;
                        if (solutions.checkOnError()) {
                            solutions.sendSuccess();
                        } else {
                            solutions.sendError();
                        }
                    });
                } else {
                    solutions.isGroupError[id] = 1;
                }
                if (this.tagName == 'SELECT') {
                    var action = 'change';
                } else {
                    var action = 'keyup';
                }
                document.querySelector('#' + solutions.form_id + ' #' + id).addEventListener(action, function() {
                    var this_id = this.getAttribute("id");
                    clearTimeout(key_up_timer)
                    key_up_timer = setTimeout(function() {
                        solutions.validation(fields[this_id], function(error, object) {
                            solutions.isGroupError[this_id] = error;
                            if (solutions.checkOnError()) {
                                solutions.sendSuccess();
                            } else {
                                solutions.sendError();
                            }
                        });
                    }, $.serviceOptions.keyup_time)
                });
            }
            if ($(this).attr('type') == 'file')
            {
                $(this).on('change', function() {
                    $(this).removeClass($.serviceOptions.errorClass).siblings('.message').remove();
                    solutions.fileValidation(solutions.fields[$(this).attr('id')])

                })
            }
            count++;
        })
        this.fields = fields;
        return feedback(this);
    },
    start: function(o, feedback) {
        console.log(o)
    }
};
solutions.start.prototype = {
    isGroupError: {},
}
solutions.init.prototype = {
    isError: 0,
    isGroupError: {},
    form_id: '',
    form_class: '',
    validFields: {},
    validOptions: {},
    getAttributes: function(object) {
        var correct_attr = [];
        for (var a in $.serviceOptions.elementAttribute) {
            if (attribute = object.getAttribute($.serviceOptions.elementAttribute[a])) {
                correct_attr[a] = attribute;
            }
        }
        return correct_attr;
    },
    getClasses: function(object) {
        var classes = object.getAttribute('class'),
            correct_class = [];
        for (var c in this.validOptions.elementClass) {
            if (classes.search(this.validOptions.elementClass[c]) >= 0) {
                correct_class.push(this.validOptions.elementClass[c]);
            }
        }
        return correct_class;
    },
    checkOnError: function() {
        for (var i in this.isGroupError) {
            if (this.isGroupError[i]) {
                return false;
            }
        }
        return true;
    },
    getFunctions: function(params) {
        var functions = {};
        for (var el in params) {
            if (typeof params[el] === 'function')
                functions[el] = params;
        }
        return functions;
    },
    sendSuccess: function() {
        if (typeof (this.validOptions.params.success) === 'function') {
            //success request 
            this.validOptions.params.success(this.validOptions.params, function(request) {
                this.validOptions.params.success(true);
            });
        }
    },
    sendError: function() {
        if (this.validOptions.scroll)
        {
            this.scrollToElement('.' + $.serviceOptions.errorClass + ':first');
        }
        if (typeof (this.validOptions.params.error) === 'function') {
            //success request 
            this.validOptions.params.error(this.validOptions.params, function(request) {
                this.validOptions.params.error(true);
            });
        }
    },
    sendFeedback: function(object, error) {
        if (typeof (this.validOptions.params[object.attr('id')]) === 'function') {
            //success request 
            this.validOptions.params[object.attr('id')](error, object);
        }
    },
    /**
     * SERVICE ERROR 
     * */
    service_error: function(key) {
        if ($.serviceOptions.criticalError[key] != undefined)
        {
            var mess = 'Error:: ' + $.serviceOptions.criticalError[key] + '!!!';
            servise_errors.push(mess)
            return mess;
        } else {
            this.service_error('bad_error_type');
        }
    },
    success: function(arg, callback) {
        return callback(this);
    },
    inArray: function(elem, arr) {
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
    inKeys: function(elem, arr) {
        if (arr[elem] != 'undefined') {
            return true;
        } else {
            return false;
        }
    },
    count: function(value, sumbols)
    {
        if (sumbols != 'undefined' && sumbols)
        {
            return value.replace(/&nbsp;/gi, ' ').length;
        } else {
            return value.replace(/\s+/g, '').replace(/&nbsp;/gi, '').length;
        }
    },
    /**
     * SET ERROR 
     * */
    setError: function(element, error, num)
    {
        if (typeof (num) == 'undefined')
            num = '';


        if (this.validOptions.translation[this.validOptions.lang][error])
        {
            if (element.attr('data-error-' + error))
            {
                var message = element.attr('data-error-' + error);
            } else {
                var message = this.validOptions.translation[this.validOptions.lang][error].replace("{0}", num);
            }
            if (this.validOptions.type == 'field' && element.attr('type') != 'file')
            {
                element.addClass($.serviceOptions.errorClass).val(message);
            } else if (this.validOptions.type == 'popup') {
                this.errorMess += '<li>' + message.replace("{f}", (element.attr('data-title') ? element.attr('data-title') : element.attr('name'))) + '</li>';
            }
            else if (this.validOptions.type == 'underfield' || (element.attr('type') == 'file' && this.validOptions.type == 'field')) {
                element.addClass($.serviceOptions.errorClass).after(this.validOptions.errorContainer + message.replace("{f}", (element.attr('data-title') ? element.attr('data-title') : element.attr('name'))));
            }
            this.isError = 1;
            return this.isError;
        } else {
            console.log(this.service_error('havent_translation'));
        }

    },
    /*
     *email validation 
     */
    validateEmail: function(email)
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
    validPhone: function(value)
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
    validString: function(value)
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
    validSite: function(value)
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
    IsNumeric: function(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    },
    /*
     *  remove not number sumbols 
     */
    notNumber: function(input, count) {
        if (input.val().length > count)
        {
            var value = input.val().slice(0, -1)
        } else {
            var value = input.val()
        }
        input.val(value.replace(/[^\d\s]/g, ''));

    },
    scrollToElement: function(selector, time, verticalOffset)
    {
        time = typeof (time) != 'undefined' ? time : 1000;
        verticalOffset = typeof (verticalOffset) != 'undefined' ? verticalOffset : -20;
        element = $(selector);
        offset = element.offset();
        if (offset != 'undefined' && offset)
        {
            offsetTop = offset.top + verticalOffset;
            $('html, body').animate({
                scrollTop: offsetTop
            }, time);
        }
    },
    parseJson: function(json)
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
    getFile: function(object)
    {
        if (object.val() && object[0])
        {
            var file_attributes = {}
            file_attributes['name'] = object.val().split('\\').pop();
            file_attributes['format'] = object[0].files[0].name.split('.').pop().toLowerCase();
            file_attributes['size'] = object[0].files[0].size;
            return file_attributes;
        } else {
            return false;
        }
    },
    /*
     * get file attributes
     */
    fileValidation: function(object)
    {
        var parse_json;
        if (parse_json = this.parseJson(object.attr($.serviceOptions.elementAttribute.file)))
        {
            var formats = typeof (parse_json.formats) != 'undefined' ? parse_json.formats.split(',') : false
            var min_size = typeof (parse_json.min_size) != 'undefined' ? parse_json.min_size : false
            var max_size = typeof (parse_json.max_size) != 'undefined' ? parse_json.max_size : false
            var name_container = typeof (parse_json.name) != 'undefined' ? parse_json.name : false
            var prev = typeof (parse_json.preview) != 'undefined' ? parse_json.preview : false
            if (file = this.getFile(object))
            {
                if (formats && !this.inArray(file.format, formats))
                {
                    this.setError(object, 'file_format');
                } else {
                    if (min_size && (min_size * 1024 * 1024) > file.size)
                    {
                        this.setError(object, 'file_max_size', min_size);
                    }
                    if (max_size && (max_size * 1024 * 1024) < file.size)
                    {
                        this.setError(object, 'file_min_size', max_size);
                    }
                }
                if (!object.hasClass($.serviceOptions.errorClass))
                {
                    if (name_container)
                    {
                        this.validOptions.old_file_name = $(name_container).text().length ? $(name_container).text() : $(name_container).val();
                        $(name_container).text(file.name).val(file.name)
                    }

                    if (prev)
                    {
                        var reader = new FileReader();
                        reader.readAsDataURL(object[0].files[0]);
                        reader.onload = function(e) {
                            if (!$(prev).length)
                            {
                                if (!object.siblings('.' + this.validOptions.imagePrevClass).length)
                                {
                                    object.after('<img class="' + this.validOptions.imagePrevClass + ' ' + $.serviceOptions.validPrevImgClass + '" src="' + e.target.result + '">');
                                } else {
                                    object.siblings('.' + this.validOptions.imagePrevClass).addClass($.serviceOptions.validPrevImgClass).attr("src", e.target.result).show()
                                }
                            } else {
                                $(prev).attr("src", e.target.result).show()
                            }
                        }
                    }
                } else {
                    s.clearPreview(object, name_container)
                }
            } else {
                s.clearPreview(object, name_container)
            }
        }
    },
    clearPreview: function(object, name_container) {
        if (name_container && this.validOptions.old_file_name)
        {
            $(name_container).text(this.validOptions.old_file_name).val(this.validOptions.old_file_name)
        }
        $(object).siblings('.' + this.validOptions.imagePrevClass).removeAttr("src").hide();
    },
    nospace: function(str) {
        return str.replace(/\s+/g, '');
    },
    ajax_validation: function(object, callback) {
        var parse_ajax;
        if (parse_ajax = this.parseJson(object.attr($.serviceOptions.elementAttribute.ajax)))
        {
            var data = typeof (parse_ajax.data) != 'undefined' ? parse_ajax.data : this.parseJson('{ "' + (object.attr('id') ? object.attr('id') : object.attr('name')) + '": "' + object.val() + '", "_token": "' + $('[name="_token"]').val() + '"}');
            $.ajax({
                type: typeof (parse_ajax.type) != 'undefined' ? parse_ajax.type : 'post',
                data: data,
                url: typeof (parse_ajax.url) != 'undefined' ? parse_ajax.url : '/',
                dataType: 'json',
                success: function(data) {
                    if (data.error)
                    {
                        return callback(data.error, object);
                    } else {
                        return callback(false, object);
                    }
                },
                complete: function(data) {
                    if (data.status == 200 && data.responseJSON == undefined) {
                        return callback(false, object);
                    }
                }
            })
        }
    },
    validation: function(field, callback)
    {
        var error = false;
        var classes = field.class;
        var attributes = field.attribute;
        if (field.object.hasClass('dynamic_field'))
            var object = $('#' + field.object.attr('id'));
        else
            var object = field.object;
        //if element not disabled
        if (!object.attr('disabled'))
        {
            if (object.hasClass('error'))
            {
                if (this.validOptions.type == 'underfield') {
                    object.removeClass('error').siblings('.message').remove();
                } else {
                    object.removeClass('error').val('');
                }
            }
            var value = object.val();
            if (value == '0')
            {
                value = null;
            }
            if (value)
            {
                var count = this.count(value);
                var count_symbols = this.count(value, true);
            } else {
                var count = 0;
            }

            if (!count && !this.inArray(this.validOptions.elementClass.no, classes))
            {
                if (this.inArray(this.validOptions.elementClass.selectbox, classes))
                {
                    error = this.setError(object, 'required');
                } else {
                    error = this.setError(object, 'required');
                }
            } else {
                if (count)
                {
                    /*string*/
                    if (this.inArray(this.validOptions.elementClass.string, classes)) {
                        if (!this.validString(value) && !this.inArray(this.validOptions.elementClass.email, classes)) {
                            error = this.setError(object, 'string');
                        }
                    }
                    /*phone*/
                    if (this.inArray(this.validOptions.elementClass.phone, classes)) {
                        if (!this.validPhone(value) && !this.inArray(this.validOptions.elementClass.email, classes)) {
                            error = this.setError(object, 'phone');
                        }
                    }
                    /*site*/
                    if (this.inArray(this.validOptions.elementClass.site, classes)) {
                        if (!this.validSite(value) && !this.inArray(this.validOptions.elementClass.email, classes)) {
                            error = this.setError(object, 'site');
                        }
                    }

                    /*email*/
                    if (this.inArray(this.validOptions.elementClass.email, classes)) {
                        if (!this.validateEmail(value)) {
                            error = this.setError(object, 'email');
                        }
                    }
                    /*pass AND pass2*/
                    if (this.inArray(this.validOptions.elementClass.pass_again, classes)) {
                        if (value != object.parents('form').find('.pass').val()) {
                            error = this.setError(object, 'pass');
                        }
                    }
                    /*number*/
                    if (this.inArray(this.validOptions.elementClass.number, classes)) {
                        if (!this.IsNumeric(value)) {
                            error = this.setError(object, 'number');
                        } else {
                            value = parseFloat(value)
                            /*data-in*/
                            if (this.inArray($.serviceOptions.elementAttribute.in, attributes))
                            {
                                var more = object.attr($.serviceOptions.elementAttribute.in).split('-');
                                var min = parseFloat(more[0]);
                                var max = parseFloat(more[1]);
                                if (value < min || value > max)
                                {
                                    error = this.setError(object, 'not_in', object.attr('data_in'));
                                }
                            }
                        }
                    }
                    /*data-min*/
                    if (this.inArray($.serviceOptions.elementAttribute.min, attributes))
                    {
                        var min = object.attr($.serviceOptions.elementAttribute.min);
                        if (min > count_symbols)
                        {
                            error = this.setError(object, 'min', min);
                        }
                    }
                    /*data-max*/
                    if (this.inArray($.serviceOptions.elementAttribute.max, attributes))
                    {
                        var max = object.attr($.serviceOptions.elementAttribute.max);
                        if (max < count_symbols)
                        {
                            error = this.setError(object, 'max', max);
                        }

                    }
                    /*data-file*/
                    if (this.inArray($.serviceOptions.elementAttribute.file, attributes))
                    {
                        this.fileValidation(object)
                    }
                    /*data-ajax*/
                    if (!object.hasClass($.serviceOptions.errorClass))
                    {
                        //
                    }
                } else {
                    /*pass2 empty*/
                    if (this.inArray(this.validOptions.elementClass.pass_again, classes)) {
                        if (value != object.parents('form').find('.pass').val()) {
                            error = this.setError(object, 'pass');
                        }
                    }
                }
            }
            return callback(error, object);
        }
        return callback(error, object);

    }
}

var uniqID = {
    counter: 1,
    get: function(object, prefix) {
        if (!prefix) {
            prefix = "form_";
        }
        var id = prefix + "" + uniqID.counter++;
        if ($('[' + $.serviceOptions.valid_date_name + '="' + id + '"]').length == 0) {
            object.setAttribute($.serviceOptions.valid_date_name, id);
            return id;
        } else {
            return uniqID.get()
        }
    }
}