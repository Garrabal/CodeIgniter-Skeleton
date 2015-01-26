// READ ZONE
$(document).ready(function(){
	initTinymce();

    $('table .opciones select, table .opciones input[type=radio], table .opciones .datepicker').change( function() {
        var $form = $(this).closest('form');
        reloadData( $form );
    });

	// Crear los datepicker:
	$( '.datepicker' ).datepicker({
//		showOn: "button",
//		buttonImage: "images/calendar.gif",
		dateFormat: 'dd-mm-yy'
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

        var $input = $form.find('.paginacion .page');
        var $page = parseInt( $input.val() );

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

    //Mandar las acciones de los TD (convenio, imagen, ahorro)
    $(document).on('click', 'a.accion-td' , function(e){
        e.preventDefault();
        var $tipo       = $(this).attr('data-tipo');
        var $valorTd    = $(this).attr('title');
        var $cliente    = $(this).closest('tr').attr('id');
        var $clienteId  = $cliente.replace('trabajo_clientes-', ''); // Cogemos la ID

//        var $form = $('#trabajo_clientes thead').find('form');
        var $form   = $(this).closest('table').find('form');

        $form.find('.estado .ok').hide();
        $form.find('.estado .load').show();
        // Manadmos los datos y devolvemos el mensaje
        $.ajax({
            type: 'POST'
            , url: BASE_URL_ADMIN + '/admin/trabajo/accion/' + $tipo
            , dataType: 'json'
            , data: {id : $clienteId , valorTd : $valorTd}
            , success: function(data){
                if ( data.error != undefined ) {
                        show_message( 'warning', data.error.msj );
                }
                if ( data.exito != undefined ) {
                    if ( data.exito.formulario != undefined ) {
                      $('#myModal .modal-header .modal-title').text( data.exito.titulo );
                      $('#myModal .modal-body').html( data.exito.formulario );
                      $('#myModal').modal();
                    }
                    else {
                        show_message( 'success', data.exito.msj );
                        reloadData( $form );
                    }
                }
                $form.find('.estado .load').hide();
                $form.find('.estado .ok').show();
            }
        });
    });

    //Mandar las acciones de los TD (Crear , editar y eliminar)
    $(document).on('click', 'a.uaccion-td' , function(e){
        e.preventDefault();
        //Si es eliminar cliente necesitamos confirmación
        if ( $(this).hasClass('confirm') )
        { if ( !confirm( '¿Está seguro de eliminar?' )){ return false; } }
        var $form   = $(this).closest('table').find('form');

        $form.find('.estado .ok').hide();
        $form.find('.estado .load').show();
        // Manadmos los datos y devolvemos el mensaje
        $.ajax({
            type: 'POST'
            , url: $(this).attr('href')
            , dataType: 'json'
            , data: {}
            , success: function(data){
                if ( data.error != undefined ) {
                        show_message( 'warning', data.error.msj );
                }
                if ( data.exito != undefined ) {
                    if ( data.exito.formulario != undefined ) {
                      $('#myModal .modal-header .modal-title').text( data.exito.titulo );
                      $('#myModal .modal-body').html( data.exito.formulario );
                      $('#myModal').modal();
                    }
                    else {
                        show_message( 'success', data.exito.msj );
                        reloadData( $form );
                    }
                }
                $form.find('.estado .load').hide();
                $form.find('.estado .ok').show();
            }
        });
    });

    //Mandar formulario de Items
    $(document).on('submit', 'form.items, form.modal-form', function(e) {
        e.preventDefault();
        var $form = $(this);
        var $datos = new FormData(this);
        $.ajax({
            url: $form.attr('action'),
            type: 'post',
            dataType: 'json',
            async: false, // Tiene que ser así para no joder nada
            data: $datos,

            processData: false,
            contentType: false,

            success: function(data){
                var alertDiv = $("<div />", {
                    "class": "alert", // you need to quote "class" since it's a reserved keyword
                       html: '<a class="close" data-dismiss="alert" href="#">&times;</a><span class="mensaje"></span>'
                });
                if (data.error){
                    $('.alert-warning').remove();

                    var msjErrores = '';
                    if (data.errorElem) {
                        for (var el in data.errorElem) {
                            if (data.errorElem[el] != "") {
                                $('[name="' + el + '"]').addClass('field_error');
                                msjErrores += data.errorElem[el];
                            }
                        }
                    }
                    $form.prepend( alertDiv );
                    $('.alert .mensaje').html(data.error.msj + msjErrores);
                    alertDiv.hide().slideDown('slow');
                    alertDiv.addClass('alert-warning');
                }
                if ( data.exito ) {
                    $('#myModal').modal( 'hide' );
                    show_message( 'success', data.exito.msj );
                    var $formTabla = $('table thead').find('form');
                    reloadData( $formTabla );
                }
            }
        });
    });
    //Eliminar archivos de los clientes
    $(document).on('click', 'a.delete-archivo' , function(e){
        e.preventDefault();
        var $idArchivo  = $(this).attr('href'); //id del archivo
        var $filaId     = $(this).closest('tr').attr('id');
        var $id         = $filaId.split('-').pop();// Id del cliente
        // El form para recargar la tabla
        var $form   = $(this).closest('table').find('form');
        var $elem   = $(this).closest('li');

        $form.find('.estado .ok').hide();
        $form.find('.estado .load').show();
        // Manadmos los datos y devolvemos el mensaje
        $.ajax({
            type: 'POST'
            //, url: BASE_URL_ADMIN + '/admin/trabajo/imagen/delete/' + $idArchivo
            , url: $idArchivo
            , dataType: 'json'
            , data: { id : $id }
            , success: function(data){
                if ( data.error != undefined ) {
                    show_message( 'warning', data.error.msj );
                }
                if ( data.exito != undefined ) {
                    show_message( 'success', data.exito.msj );
                    var $padre = $elem.closest('td');
                    $elem.remove();
                    if ( $padre.find($('li')).length == 0 ) {
                        $padre.html('Sin Archivos');
                    }
                }
                $form.find('.estado .load').hide();
                $form.find('.estado .ok').show();
            }
        });
    });
    /**
     * Mandar las acciones de la tabla
     */
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

                $('[data-toggle=tooltip]').tooltip();
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
//    $(document).data('cambios', false);
//
//    // Textarea que crece
//    $('textarea').autosize();
//
//    // Asegurarnos de que hay algo que impide que nos marchemos
//    $(document).on('change', 'input, textarea, select', function() {
//        $(document).data('cambios', true);
//    });

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