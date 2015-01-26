/* Zona de listados con ENTRADA, CUERPO, IMAGEN */
$(document).ready(function(){
  
    $(document).on('click', '.showFormListado', function() {
        var $padre  = $(this).closest('section');
        var $form   = $padre.find('form');
        var $boton	= $(this);
        var $opcion = $(this).attr('value');

    // Rellenar el formulario con los datos correspondientes
        if ( $opcion === 'Editar' ) {
            var $listado = $boton.closest('article');
            // Nuevo título del formulario
            $form.find('legend').text('Editar Contenido');
            // Título del listado
            $form.find('input[name=titulo]').val( $listado.find( '.listadoTitle' ).text() );
            // Entrada del listado
            $form.find('textarea[name=entrada]').val( $listado.find( '.listadoEntrada' ).text() );
            // Cuerpo del listado Depende de si es wysi o es textarea
            $form.find('textarea[name=cuerpo]').val( $listado.find( '.listadoCuerpo' ).text() );
            // Id 
            $form.find('input[name=id]').val( $listado.attr('id') );

            // Cambiar el action del formulario a update
            $form.attr('action', $form.attr('action').replace('create', 'update') );
        
        } else if ( $opcion === 'Crear') {
            //$padre.find('div.clearfix').append( $form.show( 'fast' ));
            // Nuevo título del formulario
            $form.find('legend').text('Nuevo Contenido');
            // Cambiar el action del formulario a create si se cambió antes
            $form.attr('action', $form.attr('action').replace('update', 'create') );
            clearForm($form);
        }
        // Eliminamos la clase hidden del form y movemos la página hasta el form
        // Por ahora mostramos el formulario en la parte superior (hay que ponerlo mejor)
        $form.slideDown().show();
        $form.removeClass('hidden');
        $('html, body').animate({scrollTop: $($form).offset().top}, 500);
    });
    $(document).on('click', '.deleteListado', function() {
        var $padre  = $(this).closest('article');
        var $id     = $padre.attr('id');
        var $vista  = $padre.attr('data-vista');
        // Eliminamos los datos
        $.ajax({
            type: 'POST'
            , url: BASE_URL + '/html/listado_form/delete/'+$vista
            , dataType: 'json'
            , data: {id : $id }
            , success: function(data){
              if ( data.error != undefined ) {
                      show_message( 'warning', data.error.msj );
              }
              if ( data.exito != undefined ) {
                  show_message( 'success', data.exito.msj );
                  $padre.remove();
              }
            }
        });
    });
    
    $(document).on('click', '.listadoModal', function() {
        var $padre  = $(this).closest('article');
        var $src    = $padre.find( 'img' ).attr('src');
        if ( $src.length > 1 ) {
            $src = $src.replace('?w=330&h=210', ''); // Cambiamos tamaño, pongo 10 porque con no funciona
        }               
        var $cuerpo = '<div class="modalCuerpoImg"><img class="img-thumbnail" src="'+$src+'"></img></div>\n\
                      <div class="modalCuerpo">'+$padre.find( '.listadoCuerpo' ).html()+'</div>';
        $('#myModal .modal-title').text( $padre.find( '.listadoTitle' ).text() );
        $('#myModal .modal-body').html( $cuerpo );
    });
    
    //FUNCIONES PARA LA ZONA DE LISTADO (AULA-TIC)
    //Para cargar el formulario
    $(document).on( 'click', '.listado-head .create, .listado-body .acciones .update, .listado-body .acciones .delete', function(event){
        event.preventDefault();
        var $link = $(this),
            $id   = 0;
        //Buscamos la ID de un elemento si es update o delete
        if ( $(this).hasClass( 'update' ) || $(this).hasClass( 'delete' ) ) {
          var $padre = $(this).closest( 'div.listado-item' );
          $id        = $padre.attr( 'id' ).replace( 'aulatic-', '' );
        }
        // Cargamos el formulario para el modal
        $.ajax({
           type: 'POST'
          , url: $link.attr( 'href' )
          , dataType: 'json'
          , data: { id: $id }
          , success: function(data){
            if ( data.error != undefined ) {
                show_message( 'error', data.error.msj ); //Mostramos mensaje de errores
            }
           if ( data.exito != undefined ) {
             if ( data.formulario ) {
                  $( '#myModal .modal-title' ).html( data.formulario.titulo );
                  $( '#myModal .modal-body' ).html( data.formulario.cuerpo );
                  $( '#myModal' ).modal();
             }
             if ( data.exito.msj) {
                  show_message( 'success', data.exito.msj ); //Mostramos mensaje
                  $padre.remove();
             }
           }
        }
      });
    });
    
    //Para las págins en HTML -> widget html
    $(document).on( 'click', '.showFormHtlm', function(){
        var $padre  = $(this).closest( 'article' );
        var $form   = $padre.find( 'form' );

        $form.slideDown( 'fast' ).show();
        $form.removeClass( 'hidden' );
        initTinymce();
        $('html, body').animate({scrollTop: $($form).offset().top}, 500);
    });
 }); 
    
