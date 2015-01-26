$(document).ready(function(){
    $(document).on('click', '.showFormLocalizacion', function(){   
        var $padre = $(this).closest('section');
        var $id = $padre.find('div.datosLocalizacion').attr('data-id');
        // Eliminamos los datos y mostramos el formulario
         $.ajax({
           type: 'POST'
         , url: BASE_URL + '/html/localizacion/show'
         , dataType: 'json'
         , data: { id : $id }
         , success: function(data){
             if ( data.error != undefined ) {
                show_message( 'danger', data.error.msj );
             }
             if ( data.exito != undefined ) {
                 if ( $padre.attr('data-form') != 1 ) {
                    $padre.attr( 'data-form', 1 );
                    $padre.children('div.datosLocalizacion').slideUp('fast');
                    $padre.append(data.exito.formulario).slideDown('fast');
                }

             }
             /* URL para volver tanto si es exito como error */
            if ( data.url !== undefined ) {
              if ( data.url === 'reload' ) {
                window.location.href = document.URL;                                                    
              } else {
                window.location.href = data.url;                                                    
              }
            }
          }
        });
    });
    $(document).on('click', 'section.col-lg-12 form.datosLocalizacion button.cancelar', function(){
        var $padre = $(this).closest('section.localizacion');
//        if ( $(document).data('cambios') ) {
//            if ( confirm('Hay cambios sin guardar, ¿cancelar edición?') ) {
//                $padre.children('section').slideUp('fast').remove();
//                $padre.children('div.datosLocalizacion').slideDown('fast');
//                $padre.attr( 'data-form', 0 );
//                $(document).data('cambios', false);
//            }
//            else {
//                $padre.children('div.datosLocalizacion').slideUp('fast');
//                $padre.children('section.clearfix').slideDown('fast').show();
//                $padre.attr( 'data-form', 1 );
//            }
//        } else {
            $padre.children('section.form-view').slideUp('fast').remove();
            $padre.children('div.datosLocalizacion').slideDown('fast');
            $padre.attr( 'data-form', 0 );
//        }
    });
});


// ZONA DE ENVÍO
$(document).ready(function(){
    // Al cargar, no hay cambios en el doc:
    $(document).data('cambios', false);

    // Textarea que crece NO FUNCIONA
    $('textarea.normal').autosize();

    // Asegurarnos de que hay algo que impide que nos marchemos
    $(document).on('change', 'input, textarea, select', function() {
        $(document).data('cambios', true);
    });

    // Mensajes de error en los campos
    $(document).on('keyup', '.field_error', function() {
        $(this).removeClass('field_error');
        if ( $('.field_error').length == 0 && $( 'alert' ).is(':visible') ) { //Ya no hay campos con error
            $('.alert').slideUp( function(){
                $('.alert').alert('close');
            })
        }
    });

    $(document).on('submit', 'form.datosLocalizacion', function(e) {
        e.preventDefault();
        var $form = $(this);
        var $padre = $(this).closest('section.col-lg-12');
        var $datos = new FormData(this);

        // Cierro los mensajes anteriores
        $('.alert').remove();

        // Cargo el loading
        $form.find('.loading').show();
        //Botón submit disable y mostramos notificación
        $form.find('.btn-success').button('loading'); 
        show_message( 'info', 'Enviando, espere por favor.' );
        $.ajax({
            url: $form.attr('action'),
            type: 'post',
            dataType: 'json',
            async: false, // Tiene que ser así para no joder nada
            data: $datos,
            processData: false,
            contentType: false,

            success: function(data){
                $form.find('.load').hide();
                if ( data.error ){
                    var msjErrores = '';
                    if (data.errorElem) {
                        for ( var el in data.errorElem ) {
                            if (data.errorElem[el] != "") {
                                $('[name="' + el + '"]').closest('.form-group').addClass('has-error');
                                msjErrores += data.errorElem[el];
                            }
                        }
                    }
                    show_message( 'danger', data.error.msj + msjErrores );
                }
                if ( data.exito ) {
                    $form.slideUp( 'fast' ).remove();  //Eliminamos form
                    $padre.find('div.datosLocalizacion').remove();    //Eliminamos elemento
                    $padre.append(data.exito.html).hide().slideDown( 'fast' );
                    $padre.attr( 'data-form', 0 ); //Data-form a 0
                    show_message( 'success', data.exito.msj );
                }
                $form.find('.btn-success').button('reset'); //Botón submit lo reseteo
            }
        });
    });
});
