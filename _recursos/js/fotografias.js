//Zona de Galerias
$(document).ready( function() {
    $('.showFormGaleria').click( function(){
        var $form = $('#galeria_form');
        $form.slideDown().show();

        var $boton	= $(this);
        var $opcion = $(this).attr('value');

        // Rellenar el formulario con los datos correspondientes
        if ( $opcion === 'Editar' ) {
                var $galeria = $boton.closest('div.galeria');
                // Cambiamos los datos del formulario: Título del form, titulo, id y  
                $form.find('legend').text('Editar Galería');
                $form.find( 'input[name=title]' ).val( $galeria.find( 'h3.galeriaTitle' ).text() );
                $form.find('input[name=id]').val( $galeria.attr('id') );
                // comprobamos si la galería es visible o no para marcar el checkbox
                if ( $galeria.hasClass( 'no-visible' ) ){
                  $form.find( 'input[name=visible][value=0]').prop( "checked", true )
                } else {
                  $form.find( 'input[name=visible][value=1]').prop( "checked", true )
                }
                // Cambiar el action del formulario a update
                $form.attr( 'action', $form.attr('action').replace( 'create', 'update' ) );
                // Descripción
                //$form.find('textarea[name=descripcion]').val( $galeria.find('.caption').text() );
        } else if ( $opcion === 'Crear') {
                // Nuevo título del formulario, cambiamos la acción de update a create y marcamos el 
                // radio buttom en visible
                $form.find( 'legend' ).text('Nueva Galería' );
                clearForm($form);
                $form.find( 'input[name=visible][value=1]' ).prop( "checked", true )
                $form.attr( 'action' , $form.attr('action').replace( 'update', 'create' ) );
        }
        $('html, body').animate({scrollTop: $('main').offset().top}, 500);
    });
    $('.deleteGaleria').click( function(){
        var $padre  = $(this).closest('div.galeria');
        var $id     = $padre.attr('id');
        // Eliminamos los datos
        $.ajax({
            type: 'POST'
            , url: BASE_URL + '/fotos/galeria_form/delete'
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
});

// Zona de imágenes
$(document).ready( function() {  
    $(document).on('click', '.showFormImagen', function() {
        var $form = $('#imagen_form');
        $form.slideDown().show();

        var $boton	= $(this);
        var $opcion = $(this).attr('value');

        // Rellenar el formulario con los datos correspondientes
        if ( $opcion === 'Editar' ) {
            var $imagen = $boton.closest('.imagen');
            // Nuevo título del formulario
            $form.find('legend').text('Editar Imagen');
            // Título de la imagen
            $form.find('input[name=titulo]').val( $imagen.find('img').attr('title') );
            // Descripción
            $form.find('textarea[name=descripcion]').val( $imagen.find('.caption').text() );
            // Id de la imagen
            //console.log($imagen.attr('id'));
            $form.find('input[name=id]').val( $imagen.attr('id') );
            // Cambiar el action del formulario a update
            $form.attr('action', $form.attr('action').replace('create', 'update') );

      } else if ( $opcion === 'Crear') {
            // Función para añadir nuevos campos input en el formulario
            var $FieldCount  = 1; //Número de campo
//            var $fileSize    = 0; //Tamaño de los archivos
              $(document).on('change', 'input[name="archivo[]"]', function() {  
                  var $marco = $(this).closest('div.marcoFile');
//                  $fileSize = $fileSize + this.files[0].size;
                  if ( $FieldCount < 10 ) {
//                    if ( $fileSize <= 2097152 ) {
                      if ( $('input[name="archivo[]"]:last').val() != '' ) {
                          var $padre = $(this).closest('div.fileMultiple');
                          $padre.last('div').append('<div class="marcoFile"><label class="control-label" for="archivo_'+ $FieldCount +'">Archivo</label>\n\
                            <div class="input-group"><input class="form-control" type="file" id="archivo_'+ $FieldCount +'" name="archivo[]" value=""><span class="input-group-addon">\n\
                            <a data-toggle="tooltip" data-placement="top" title="Eliminar" class="removeFile btn-xs btn-danger"><span class="glyphicon glyphicon-remove"></span></a></span></div></div>');
                          $FieldCount++; 
                          return false;                    
                      }
                      if ( $(this).val() == '' && $('input[name="archivo[]"]').length > 1 ) {
                          $marco.remove();
                          $FieldCount--;
                      } 
//                    } else {
//                      alert('Ha superado el tamaño máximo permitido. Tam. Max. 2MB');
//                    }
                  } else {
                    alert('Se permiten 10 archivos a la vez');
                  }
              });
            // Eliminar inputs file cuando pulsamos la X
            $(document).on('click', 'a.removeFile', function() {  
                var $marco = $(this).closest('div.marcoFile');
                if ( $('input[name="archivo[]"]').length > 1 ) {
                    $marco.remove();
                    $FieldCount--;
                } 
            });
            // Nuevo título del formulario
            $form.find('legend').text('Nueva Imagen');
            // Cambiar el action del formulario a create si se cambió antes
            $form.attr('action', $form.attr('action').replace('update', 'create') );
            clearForm($form);
        }
        $('html, body').animate({scrollTop: $('main').offset().top}, 500);
    });
    $(document).on('submit', 'form.images', function(e) {
        e.preventDefault();
        var $form = $(this);
        //Buscamos si es update para no requerir el archivo (puede actulizar solo los datos)
        var $opcion = $form.attr('action').match(/\/imagen_form\/update/);
        
        var $inputs = $('input[type="file"]').length;
        var $emptyInputs = $("input[type='file']").filter(function (){
            return !this.value
        });
        
        if ( ($inputs - $emptyInputs.length ) === 0 && !$opcion ) {
            alert('Debe seleccionar un archivo');
          
        } else { 
            $emptyInputs.each( function() {
                $(this).closest('div.marcoFile').remove();                 
            });               
            
            var $datos = new FormData(this);
            // Cierro los mensajes anteriores
            $('.alert').remove();
            //Botón submit disable y mostramos notificación
            $form.find('.btn-success').button('loading'); 
            show_message( 'info', 'Enviando imagen, espere por favor.' );
            $.ajax({
                url: $form.attr('action'),
                type: 'post',
                dataType: 'json',
                async: false, // Tiene que ser así para no joder nada
                data: $datos,
                processData: false,
                contentType: false,
                success: function(data){
                    if ( data.error ){
                        var msjErrores = '';
                        if (data.errorElem) {
                            for (var el in data.errorElem) {
                                if (data.errorElem[el] != "") {
                                    $('[name="' + el + '"]').closest('.form-group').addClass('has-error');
                                    msjErrores += data.errorElem[el];
                                }
                            }
                        }
                        $('.alert').alert('close'); //Cierro el anterior, y muestro los nuevos errores

                        var e = $("<div />", {
                          "class": "alert alert-warning", // you need to quote "class" since it's a reserved keyword
                          html: '<a class="close" data-dismiss="alert" href="#">&times;</a><span class="mensaje"></span>'
                        });
                        $form.prepend(e);
                        $( '.alert .mensaje' ).html(data.error.msj + msjErrores);
                        $( '.alert' ).alert();
                        $( '.alert' ).show();
                    }
                    if ( data.exito ) {
                        show_message( 'success', data.exito.msj ); //Mostramos mensaje de success
                        $('.alert-warning').alert('close'); //Cierro los errores
                       
                        if ( data.url === 'reload' ) {
                            window.location.href = document.URL;                                                    
                        } else {
                            window.location.href = data.url;                                                    
                        }
                    }
                    $form.find('.btn-success').button('reset');
                }
            });
          }
    });
            
    $(document).on('click', '.deleteImagen', function() {
        var $padre = $(this).closest('div.imagen');
        var $id = $padre.attr('id');
        // Eliminamos los datos
        $.ajax({
            type: 'POST'
            , url: BASE_URL + '/fotos/imagen_form/delete'
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
            }
        });
    });
});
