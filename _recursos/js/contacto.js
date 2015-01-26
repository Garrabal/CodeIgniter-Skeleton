$(document).ready(function(){

   $(document).on('keyup', '.error', function() {
      $(this).removeClass('error');
      if ( $('.error').length == 0 && $( '.alert' ).is(':visible') ) { //Ya no hay campos con error
         $('.alert').slideUp( function(){
            $('.alert').alert('close');
         })
      }
   });

   // Textarea que crece
   $(document).ready(function(){
      $('textarea').autosize();
   });

   // Limpieza del formulario
   $('.limpiar').click( function() {
      clearForm('form');
   });

   // EnvÃ­o de formularios
   $('form.contacto').submit(function(event){
      event.preventDefault();
      var form = $(this);
      var datos = form.serializeArray();
      form.find('.btn-success').button('loading');
      show_message( 'info', 'Enviando mensaje, espere por favor.' );
      $.ajax({
         url: form.attr('action'),
         type: 'post',
         dataType: 'json',
         data: datos,
         success: function(data){
            var msjErrores = '';
            if (data.errorElem) {
               for (var el in data.errorElem) {
                  if (data.errorElem[el] != "") {
                     $('[name="' + el + '"]').closest('.form-group').addClass('has-error');
                     msjErrores += data.errorElem[el];
                  }
               }
            }
            if (data.error){
               $('.alert').alert('close'); //Cierro el anterior, y muestro los nuevos errores

               var e = $("<div />", {
                 "class": "alert alert-warning", // you need to quote "class" since it's a reserved keyword
                  html: '<a class="close" data-dismiss="alert" href="#">&times;</a><span class="mensaje"></span>'
               });
               form.prepend(e);
               $( '.alert .mensaje' ).html(data.error.msj + msjErrores);
               $( '.alert' ).alert();
               $( '.alert' ).show();

               if (data.error.tipo == 'captcha') {
                  Recaptcha.reload();
               }

            }
            if (data.exito) {
               $('.alert').alert('close'); //Cierro los errores
//               $('#myModal .modal-body').html( data.exito );
//               $('#myModal').modal();
               show_message( 'success', data.exito.msj );
               clearForm(form);
               Recaptcha.reload();
            }
            form.find('.btn-success').button('reset');
         }
      });
   });
});