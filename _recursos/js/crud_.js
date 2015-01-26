// READ ZONE
$(document).ready(function(){

    $('table .opciones select').change( function() {
        var $form = $(this).closest('form');
        reloadData( $form );
    });

    //---
    // Lanzamos evento de recarga tras esperar que el usuario termine de escribir
    var typingTimer;               //timer identifier
    var doneTypingInterval = 500;  //time in ms, 5 second for example

    $('table .opciones input.filtrar').keyup(function(){
        typingTimer = setTimeout( doneTyping, doneTypingInterval );
    });

    $('table .opciones input.filtrar').keydown(function(){
        clearTimeout( typingTimer );
    });

    function doneTyping() {
        if ( $('table .opciones select.filtrar').val() != 0 ) {
            var input = $('table .opciones input.filtrar');
            var $form = input.closest('form');
            reloadData( $form );
        }
    }
    //---

    $('table .opciones .paginacion .page').change( function(e) {
        e.preventDefault();
        var $form = $(this).closest('form');
        reloadData( $form );
    });

    $('table .opciones .paginacion .prev, table .opciones .paginacion .next, table .opciones .paginacion .init, table .opciones .paginacion .end').click( function( e ) {
        e.preventDefault();

        var $form = $(this).closest('form');

        $input = $form.find('.paginacion .page');
        $page = parseInt( $input.val() );

        if ( $(this).hasClass('prev') ) {
            $input.val( $page - 1 );
        }
        if ( $(this).hasClass('next') ) {
            $input.val( $page + 1 );
        }
        if ( $(this).hasClass('init') ) {
            $input.val( 1 );
        }
        if ( $(this).hasClass('end') ) {
            $input.val( parseInt( $form.find('.paginacion .total').html() ) );
        }

        reloadData( $form );
    });

    /**
     * Mandar los campos de ordenación
     */
    $(document).ready( function() {
        $('.orden a').click( function(e){
            e.preventDefault();

            var $form   = $(this).closest('thead').find('form');
            var $flecha = $(this);
            var $tipo   = 'reset';

            if ( $flecha.hasClass('selected') ) {
                // Si la flecha estaba seleccionada, se deselecciona, y tipo se queda
                // como reset (lo que deseamos, borrar orden si pulso en seleccionado)
                $flecha.removeClass('selected');
            } else {
                // Si la otra flecha está seleccionada, la deselecciona
                $flecha.closest('.orden').find('a.selected').removeClass('selected');

                $flecha.addClass('selected');
                $tipo = $flecha.attr('href');
            }

            var $orden = {
                'campo' : $flecha.closest('.orden').attr('id')
              , 'tipo'  : $tipo
            }

            // Voy al thead, bajo al form, busco el action, y envío el dato
            $.ajax({
                url: $form.attr('action'),
                type: 'post',
                dataType: 'json',
                data: {
                    orden:$orden
                },
                success: function(data){
                    if ( data.reload ) {
                        var $table = $form.closest('table');
                        $table.find('tbody').remove();
                        $table.append(data.reload.tbody);
                    } else {
                        alert('Error en la recarga de la tabla');
                    }

                    $form.find('.estado .ok').show();
                    $form.find('.estado .load').hide();
                }
            });
        });
    });
});

/**
 * Reload the READ table data
 */
function reloadData( $form ) {
    var datos = $form.serializeArray();

    $form.find('.estado .ok').hide();
    $form.find('.estado .load').show();

    $.ajax({
        url: $form.attr('action'),
        type: 'post',
        dataType: 'json',
        data: datos,
        success: function(data){
            if ( data.reload ) {
                var $table = $form.closest('table');
                $table.find('tbody').remove();
                $table.append(data.reload.tbody);

                //console.log(data.reload);
                // Table States:
                // Pages
                $form.find( '.paginacion .page' ).val( data.reload.state.pages.page );
                $form.find( '.paginacion .total' ).html( data.reload.state.pages.total );

                // Results
                $form.find( '.results .total' ).html( data.reload.state.results.total );
                $form.find( '.results .init' ).html( data.reload.state.results.init );
                $form.find( '.results .end' ).html( data.reload.state.results.end );
            } else {
                alert('Error en la recarga de la tabla');
            }

            $form.find('.estado .ok').show();
            $form.find('.estado .load').hide();
        }
    });
}


// CREATE/UPDATE ZONES
$(document).ready(function(){
    // Al cargar, no hay cambios en el doc:
    $(document).data('cambios', false);

    // Textarea que crece
    $('textarea').autosize();

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

    //$('.save').click(function(){
    $(document).on('click', '.save', function(e){

        if ( ! $(this).hasClass('go-back') ) {
            $(this).closest('form').submit();
        }
    });

    // Función que necesita actualizar con AJAX
//	$(document).on('click', '.delete', function(e){
//        if ( ! confirm('¿Borrar?') ) {
//            e.preventDefault();
//        }
//    });


    $(document).on('click', '.go-back', function(){
        // Salvo primero:
        if ( $(this).hasClass('save') ) {
            // Los submits definidos como síncronos para que espere la respuesta.
            $(this).closest('form').submit();
        }

        // Si al enviar el formulario todo fue bien, cambios contendrá false
        if ( $(document).data('cambios') == true && ! $(this).hasClass('save') ) {
            if ( confirm( 'Cambios sin Guardar, ¿Volver?' ) ) {
                window.location.href = $(this).closest('form').attr('flow');
            }
        } else if ( $(document).data('cambios') == false ) {
            window.location.href =  $(this).closest('form').attr('flow');
        }
    });

    $(document).on('submit', 'form.crud', function(e) {
        e.preventDefault();
        var $form = $(this);
        var $datos = new FormData(this);

        // Cierro los mensajes anteriores
        $('.alert').remove();

        // Cargo el loading
        $form.find('.load').show();

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
                var alertDiv = $("<div />", {
                    "class": "alert", // you need to quote "class" since it's a reserved keyword
                    html: '<a class="close" data-dismiss="alert" href="#">&times;</a><span class="mensaje"></span>'
                });
                if (data.error){
                    var msjErrores = '';
                    if (data.errorElem) {
                        for (var el in data.errorElem) {
                            if (data.errorElem[el] != "") {
                                $('[name="' + el + '"]').addClass('field_error');
                                msjErrores += data.errorElem[el];
                            }
                        }
                    }
                    $form.append( alertDiv );
                    $('.alert .mensaje').html(data.error.msj + msjErrores);
                    alertDiv.hide().slideDown('slow');
                    alertDiv.addClass('alert-error');
                }
                if ( data.exito ) {


                    // Actualizo la imagen del formulario
                    if (data.exito.imagen) {
                        $imagen = $form.find('.imagen img');
                        $imagen.slideUp( function() {
                            $imagen.attr( 'src', data.exito.imagen ).slideDown();
                        });

                        $form.find(':input[type=file]').val('');
                    } else if (data.exito.borraImagen) {
                        $form.find('.imagen img').slideUp();
                    }

                    //console.log(data.exito);

                    // TODO: Esto debería salir sólo cuando no nos vamos de la página,
                    // ahora sale siempre
                    $form.append( alertDiv );
                    $('.alert .mensaje').html('<span class="icono20 iExito"></span>' + data.exito.msj);
                    alertDiv.hide().slideDown('slow');
                    alertDiv.addClass('alert-success');

                    $(document).data('cambios', false );

                    if ( $form.hasClass('create') ) {
                        clearForm( $form );
                    }
                }
            }
        });
    });
});

function clearForm( $form ) {
    $form.find(':input').each(function() {
        switch(this.type) {
            case 'password':
            case 'text':
            case 'file':
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });
}