$(document).ready(function(){
    // ZONA DE CREATE
    $(document).on('click', 'table.tabla_personal .create, table.tabla_personal .update', function(event){
        event.preventDefault();

        var $link = $(this),
        $id = 0;
        //Buscamos la ID de un elemento si es update o del padre si es create
        if ( $(this).hasClass('create') ) {
          $id	  = $link.closest('table').attr('padre');
        } else {
          $id	  = $link.closest('tr').attr('id').replace('tabla_personal-', '');
        }
        // Cargamos el formulario para el modal
        $.ajax({
           type: 'POST'
          , url: $link.attr('href')//'http:/html/addPersonal'
          , dataType: 'json'
          , data: { id: $id }
          , success: function(data){
            if ( data.error != undefined ) {
                show_message( 'error', data.error.msj ); //Mostramos mensaje de errores
            }
//DRY => Don't Repeat Yourself
//KISS => Keep It Simple Stupid
           if ( data.exito != undefined ) {
                  $('#myModal .modal-title').html( data.formulario.titulo );
                  $('#myModal .modal-body' ).html( data.formulario.cuerpo );
                  $('#myModal').modal();
           }
        }
      });
    });
    //Fijal el tamaño de las filas para que cuando se mueva no se junten
    var fixHelper = function(e, ui) {
        ui.children().each(function() {
          $(this).width($(this).width());
        });
        return ui;
    };
    $("#tabla_personal tbody").sortable({ handle: 'a.order', cancel: '', helper: fixHelper, opacity: 0.6, cursor: 'move', placeholder: "bg-warning", 
      update: function() {
        var order = $(this).sortable( "serialize" );
        $.post( "/html/order_personal", order, function(data) {
        //Mostramos mensaje de errores
          if ( data.error  ) {
            show_message( 'error', data.error.msj ); 
          }
          if ( data.exito !== undefined ) {
            show_message( 'success', data.exito.msj ); 
          }
        }, 'json');
      }
    });
    $("#tabla_personal tbody").disableSelection();
//Esto estaba si había errores pero no puede haber errores de formulario si no lo ha cargado :p
//                var msjErrores = '';
//                if (data.errorElem) {
//                    for (var el in data.errorElem) {
//                        if (data.errorElem[el] != "") {
//                            $('#' + el).addClass('error');
//                            msjErrores += data.errorElem[el];
//                        }
//                    }
//                }
//                $('.alert').alert('close'); //Cierro el anterior, y muestro los nuevos errores
//                var alertBox = $("<div />", {
//                    "class": "alert alert-warning", // you need to quote "class" since it's a reserved keyword
//                    html: '<a class="close" data-dismiss="alert" href="#">&times;</a><span class="mensaje"></span>'
//                });
//                $('#myModal .modal-body').prepend(alertBox);
//                $( '.alert .mensaje' ).html(data.error.msj + msjErrores);
//                $( '.alert' ).alert();
//                $( '.alert' ).show();
//    $(document).on('submit', 'form.personal', function(e) {
//        e.preventDefault();
//
//        var $form = $(this);
//        var $datos = new FormData(this);
//
//        // Cierro los mensajes anteriores
//        $('.alert').remove();
//
//        // Cargo el loading
//        $form.find('.load').show();
//
//        $.ajax({
//            url: $form.attr('action'),
//            type: 'post',
//            dataType: 'json',
//            async: false, // Tiene que ser así para no joder nada
//            data: $datos,
//            processData: false,
//            contentType: false,
//
//            success: function(data){
//                $form.find('.load').hide();
//                if ( data.error != undefined ) {
//                    var msjErrores = '';
//                    if (data.errorElem) {
//                        for (var el in data.errorElem) {
//                            if (data.errorElem[el] != "") {
//                                $('#' + el).addClass('error');
//                                msjErrores += data.errorElem[el];
//                            }
//                        }
//                    }
//                    $('.alert').alert('close'); //Cierro el anterior, y muestro los nuevos errores
//
//                    var alertBox = $("<div />", {
//                        "class": "alert alert-warning", // you need to quote "class" since it's a reserved keyword
//                        html: '<a class="close" data-dismiss="alert" href="#">&times;</a><span class="mensaje"></span>'
//                    });
//                    $('#myModal .modal-body').prepend(alertBox);
//                    $( '.alert .mensaje' ).html(data.error.msj + msjErrores);
//                    $( '.alert' ).alert();
//                    $( '.alert' ).show();
//                    show_message( 'error', data.error.msj ); //Mostramos mensaje de errores
//                }
//                if ( data.exito !=undefined ) {
//                    $('#myModal').modal('hide')
//                    show_message( 'success', data.exito.msj ); //Mostramos mensaje de success
////	                var $table = $('.padreId-' + data.exito.padreId );
//        //					$table.find('tbody').remove();
//        //					$table.append(data.exito.reload.tbody);
//                    window.location.reload(false);
//                }
//            }
//        });
//    });


	// Función que necesita actualizar con AJAX
    $(document).on('click', 'table.tabla_personal .delete', function(e){
      var $link = $(this);

      if ( confirm('¿Borrar?') ) {
            e.preventDefault();

        var $parts	= $link.attr('href').split('/');
        var $id		= $parts.pop();
        var $url	= $parts.join('/');
        $.ajax({
          url: $url,
          type: 'post',
          dataType: 'json',
          data: { id: $id },
          success: function(data){
            if ( data.error != undefined ) {
              show_message( 'error', data.error.msj ); //Mostramos mensaje de errores
            }
            if ( data.exito !=undefined ) {
              $link.closest('tr').remove();
              show_message( 'success', data.exito.msj ); //Mostramos mensaje de success
            }
          }
        });
      }
    });
});