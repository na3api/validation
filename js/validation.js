/*
 * * * Classes * * * 
 * @param - form identefication
 * @option - required
 * @option - email
 * @option - number
 * @option - data-min
 * @option - data-max
 * @option - pass
 * @option - pass2
 * @option - string (without special char)
 */
var type = '';
var errorMess;
function setError(t, error, num)
{
    if(typeof(num)==='undefined') num = '';

    if(type == 'field')
    {   
        var message = errors('en')[error].replace("{0}", num) ;
        t.addClass('error').val(message);
    }else{
        var message = errors2('en')[error].replace("{0}", num) ;
        errorMess += '<li>'+message.replace("{f}", (t.attr('data-title') ? t.attr('data-title'): t.attr('name')))+'</li>';
    }


} 
/*clear form*/
function clear_form(form)
{
    $(form+' .required').each(function(){
        $(this).val('');
    })
}
/*recicle validation*/
function validation(form, t)
{
    
    errorMess = '<ul>';
    if(typeof(t)==='undefined'){
        type = 'field';
    }else{
        type = t;
    }
    var error = 0;
    $(form+' .required').each(function(){
        if(!$(this).attr('disabled'))
        {            
            if($(this).hasClass('error'))
            {
                $(this).removeClass('error').val('');
            }
            var value = $(this).val();
            if(value == '0')
            {
                value = null;
            }
            if(value)
            {
                var count = value.replace(/\s+/g, '').replace(/&nbsp;/gi, '').length;   
                var count_symbols = value.replace(/&nbsp;/gi, ' ').length;   
                
            }else{
                var count = 0;
            }
            if(!count && !$(this).hasClass('no'))
            {
                if($(this).hasClass('selectbox'))
                {
                    var sb = $(this).attr('sb');
                    $('#sbHolder_'+sb).addClass('error');
                    setError($(this), 'required'); 
                }else{
                    error = 1;
                    setError($(this), 'required');                   
                }
            }else{
                if(count)
                {
                    /*string*/
                    if($(this).hasClass('string')){
                        if(!ValidateString(value) && !$(this).hasClass('email')){
                            error = 1;
                            setError($(this), 'special_char');
                        }
                    }

                    /*pass AND pass2*/
                    if($(this).hasClass('pass2')){
                        if(value != $(this).siblings('.pass').val()){
                            error = 1;
                            setError($(this), 'pass');
                        }
                    }
                    /*email*/
                    if($(this).hasClass('email')){
                        if(!ValidateEmail(value)){
                            error = 1;
                            setError($(this), 'email');
                        }
                    }
                    /*number*/
                    if($(this).hasClass('number')){
                        if(!IsNumeric(value)){
                            error = 1;
                            setError($(this),'number');
                        }else{
                            value = parseFloat($(this).val())
                            /*data-in*/
                            if($(this).attr('data-in'))
                            {
                                var more = $(this).attr('data-in').split('-');
                                var min  = parseFloat(more[0]);
                                var max  = parseFloat(more[1]);
                                if( value < min  ||  value > max)
                                {                               
                                    error = 1;
                                    setError($(this),'not_in',$(this).attr('data-in'));
                                }
                            }
                        }
                    }   
                    /*data-min*/
                    if($(this).attr('data-min'))
                    {
                        var min = $(this).attr('data-min');
                        if(min > count_symbols)
                        {
                            error = 1;
                            setError($(this),'min',min);
                        }
                    }
                    /*data-max*/
                    if($(this).attr('data-max'))
                    {
                        var max = $(this).attr('data-max');
                        if(max < count_symbols)
                        {
                            error = 1;
                            setError($(this),'max',max);
                        }

                    }

                }
            }
        }else{
            if($(this).hasClass('error') && !$(this).attr('disabled'))
            {
                $(this).removeClass('error').val('');
            }
        }
    })
    errorMess += '</ul>';
    if(type == 'popup')
    {        
        if(error == 1)
        {
            $('.alert_note').remove();
            jQuery('body').after('<div class="alert_note alert-error" >'+
                        '<button type="button" class="close"  data-dismiss="alert">×</button>'+
                        ''+errorMess+''+
                     '</div>');
        }       

    }
    return error;
    

}
function IsNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
$(function(){  
    $('.required ').on('click focus change', function(){
        if($(this).hasClass('error'))
        {
            if($(this).hasClass('selectbox'))
            {
                $('#sbHolder_'+$(this).attr('sb')).removeClass('error');
                $(this).removeClass('error');                
            }else{
                $(this).removeClass('error').val('');                
            }
        }
    })
    $('.required.number').on('keyup change',function(){
        return proverka($(this));
    })
})
function ValidateEmail(mail)   
{  
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))  
    {  
        return (true)  
    }  

        return (false)  
}
function ValidateString(value)   
{  
    if(/^[a-zA-Zа-яіїєґА-ЯІЇЄҐ0-9\.\s]+$/.test(value))
    {  
        return (true)  
    }  
    return (false)  
}
function proverka(input) {
    input.val(input.val().replace(/[^\d]/g, ''));
};
function errors(lang)
{
    var array =  {
        en:{
            required:'This field is required.',
            email   :'Please enter a valid email address.',
            number  :'Please enter a valid number.',
            not_in  :'Please enter number in {0} ',
            min     :'Please enter at least {0} characters.',
            max     :'Please enter no more than {0} characters.',
            pass    :'Error_pass',
            special_char :'Enter without special characters.',
        },ru:{
            required:'Поле не должно быть пустым.',
            email   :'Введите корректный email.',
            min     :'Значение поля должно быть больше {0}.',
            max     :'Значение поля должно быть меньше {0}.' 
        }
    };
    return array[lang];
}
function errors2(lang)
{
    var array =  {
        en:{
            required:'<b>{f}</b>. Field  is required.',
            email   :'<b>{f}</b>. Please enter a valid email address.',
            number  :'<b>{f}</b>. Please enter a valid number.',
            not_in  :'<b>{f}</b>. Please enter number in {0} ',
            min     :'<b>{f}</b>. Please enter at least {0} characters.',
            max     :'<b>{f}</b>. Please enter no more than {0} characters.',
            special_char :'<b>{f}</b>. Enter without special characters.',
            pass    :'<b>Password</b>. New password and repeated new password did not match.'
        },ru:{
            required:'Поле не должно быть пустым.',
            email   :'Введите корректный email.',
            min     :'Значение поля должно быть больше {0}.',
            max     :'Значение поля должно быть меньше {0}.' 
        }
    };
    return array[lang];
}