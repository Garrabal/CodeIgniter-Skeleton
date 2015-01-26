// Noticias - fecha: 25/12/13 - www.eficsi.com
/* Parte Categorías 
$(document).ready( function() {
    $('.showFormCategoria').click( function(){
        var $form = $('#categoria_form');
        $form.show();

        var $boton	= $(this);
        var $opcion     = $(this).attr('value');

        // Rellenar el formulario con los datos correspondientes
        if ( $opcion === 'Editar' ) {
                var $categoria = $boton.closest('div.categoria');

                // Nuevo título del formulario
                $form.find('legend').text('Editar Categoría');
                // Título de la categoría
                $form.find('input[name=titulo]').val( $categoria.find('h3.categoriaTitulo a').text() );
                // Descripción
                $form.find('textarea[name=descripcion]').val( $categoria.find('div.categoriaDescripcion').text() );
                // Id de la categoría
                $form.find('input[name=id]').val( $categoria.attr('id') );

                // Cambiar el action del formulario a update
                $form.attr('action', $form.attr('action').replace('create', 'update') );
                $('html, body').animate({scrollTop: $($form).offset().top}, 500);
        
        } else if ( $opcion === 'Crear') {
                // Nuevo título del formulario
                $form.find('legend').text('Nueva Categoría');
                // Cambiar el action del formulario a create si se cambió antes
                $form.attr('action', $form.attr('action').replace('update', 'create') );
                clearForm($form);
                var $textarea = $('iframe').contents().find('.wysihtml5-editor');
                $textarea.text( $textarea.find('placeholder').text() );
        }
    });
    $('.deleteCategoria').click( function(){
        var $padre = $(this).closest('div.categoria');
        var $id = $padre.attr('id');
        // Eliminamos los datos
        $.ajax({
            type: 'POST'
            , url: BASE_URL + 'noticias/categoria_form/delete'
            , dataType: 'json'
            , data: { id : $id }
            , success: function(data){
            if ( data.error != undefined ) {
                    show_message( 'error', data.error.msj );
                }
                if ( data.exito != undefined ) {
                    show_message( 'success', data.exito.msj );
                    $padre.remove();
                }
            }
        });
    });
});*/

// Zona de noticias
$(document).ready( function() {
    $(window).scroll(function(){
      var cargando = $('.scrollNews').attr('cargando');
      if ($(window).scrollTop() > 0.75 * ($(document).height() - $(window).height()) ){
         if (cargando == 0) {
            $('.scrollNews').attr('cargando',1);
            cargaNoticias();
         }
      }
    });
 
    $(document).on('click', '.showFormNoticia', function() {
        var $padre = $(this).closest('div.news');
        var $id = $padre.attr('id');
        var $form = $('#noticias_form_container');
        var $opcion = $(this).attr('value');
        $.ajax({
            type: 'POST'
            , url: BASE_URL + '/noticias/noticia_form/'+$opcion
            , dataType: 'json'
            , data: { id : $id } 
            , success: function(data){
                if ( data.error != undefined ) {
                    show_message( 'error', data.error.msj );
                }
                if ( data.exito != undefined ) {
                    if ( data.exito.formulario != undefined ) {
                        $form.html( data.exito.formulario );
                        initTinymce();
                        initTokenfield();
                    } else {
                        show_message( 'error', data.error.msj );
                    }
                }
            }
        });
//        // Rellenar el formulario con los datos correspondientes
//        if ( $opcion === 'Editar' ) {
//            var $noticia = $boton.closest('div.news');
//            // Nuevo título del formulario
//            $form.find('legend').text('Editar Noticia');
//            
//            // Título de la noticia
//            $form.find('input[name=titulo]').val( data.formulario.titulo );
//            // Etiquetas
//            $form.find('input[name=etiquetas]').val( $noticia.find( 'span.newsTags' ).text() );
//            // Entrada de la noticia
//            $form.find('textarea[name=entrada]').val( $noticia.find( 'div.newsEntrada' ).text() );
//            // Cuerpo de la noticia
//            $('iframe').contents().find('.mce-content-body').html( $noticia.find( 'div.newsCuerpo' ).html() );
//            // Id de la imagen            
//            $form.find('input[name=id]').val( $noticia.attr('id') );
//
//            // Cambiar el action del formulario a update
//            $form.attr('action', $form.attr('action').replace('create', 'update') );
//            $('html, body').animate({scrollTop: $($form).offset().top}, 500);
//        
//        } else if ( $opcion === 'Crear') {
//            // Nuevo título del formulario
//            $form.find('legend').text('Nueva Noticia');
//            // Cambiar el action del formulario a create si se cambió antes
//            $form.attr('action', $form.attr('action').replace('update', 'create') );
//            clearForm($form);
//            var $textarea = $('iframe').contents().find('.mce-content-body');
//            $textarea.text( $textarea.find('placeholder').text() );
//        }
    });
    $(document).on('click', '.deleteNoticia', function() {
        var $padre = $(this).closest('div.news');
        var $id = $padre.attr('id');
        // Eliminamos los datos
        $.ajax({
            type: 'POST'
            , url: BASE_URL + '/noticias/noticia_form/delete'
            , dataType: 'json'
            , data: {id : $id}
            , success: function(data){
                if ( data.error != undefined ) {
                    show_message( 'error', data.error.msj );
                }
                if ( data.exito != undefined ) {
                    show_message( 'success', data.exito.msj );
                    $padre.remove();
                    
                }
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
});