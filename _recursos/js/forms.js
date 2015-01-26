/* Función para quitar los mensajes de error */
function removeError( element ) {
    element.closest('.form-group').removeClass('has-error');
    
    if ( $('.has-error').length == 0 && $( '.alert' ).is(':visible') ) { //Ya no hay campos con error
        $('.alert').slideUp( function(){
            $('.alert').alert('close');
        })
    }
}
//function initTinymce() {
//   tinymce.init({
//	  mode : "textareas"
////      , elements : 'absurls'
//	  , media_use_script : false
//	  , relative_urls : false
////      , remove_script_host : false
////      , media_strict: false
////      , convert_urls: false
//	  , cleanup: false
//	  , selector: "textarea.tinymce"
//	  , language : 'es'
//	  , verify_html : false
//	  , theme: "modern"
//	  , content_css : "/css/tema.css"
//	  , height: 400
//	  , skin_url: BASE_URL + '/css'
//	  , valid_elements : "@[id|class|style|title|dir<ltr?rtl|lang|xml::lang|onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup],a[rel|rev|charset|hreflang|tabindex|accesskey|type|name|href|target|title|class|onfocus|onblur],strong/b,em/i,strike,u,#p,-ol[type|compact],-ul[type|compact],-li,br,img[longdesc|usemap|src|border|alt=|title|hspace|vspace|width|height|align],-sub,-sup,-blockquote,-table[border=0|cellspacing|cellpadding|width|frame|rules|height|align|summary|bgcolor|background|bordercolor],-tr[rowspan|width| height|align|valign|bgcolor|background|bordercolor],tbody,thead,tfoot,#td[colspan|rowspan|width|height|align|valign|bgcolor|background|bordercolor |scope],#th[colspan|rowspan|width|height|align|valign|scope],caption,-div,-span,-code,-pre,address,-h1,-h2,-h3,-h4,-h5,-h6,hr[size|noshade],-font[face |size|color],dd,dl,dt,cite,abbr,acronym,del[datetime|cite],ins[datetime|cite],object[classid|width|height|codebase|*],param[name|value|_value],embed[type|width|height|src|*],script[src|type],map[name],area[shape|coords|href|alt|target],bdo,button,col[align|char|charoff|span|valign|width],colgroup[align|char|charoff|span|valign|width],dfn,fieldset,form[action|accept|accept-charset|enctype|method],input[accept|alt|checked|disabled|maxlength|name|readonly|size|src|type|value],kbd,label[for],legend,noscript,optgroup[label|disabled],option[disabled|label|selected|value],q[cite],samp,select[disabled|multiple|name|size],small,textarea[cols|rows|disabled|name|readonly],tt,var,big,iframe[src|title|width|height|allowfullscreen|frameborder]"
//	  , plugins: [
//		"advlist autolink lists link image charmap print preview textcolor",
//		"searchreplace visualblocks code fullscreen",
//		"insertdatetime media table contextmenu paste jbimages emoticons"
//		]
//	  , toolbar: "undo redo | styleselect | forecolor backcolor bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image jbimages emoticons | code"
//	, formats: {
//		alignleft:    {selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-left'},
//		aligncenter:  {selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-center'},
//		alignright:   {selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-right'},
//		alignfull:    {selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-justify'},
//		bold:         {inline: 'strong'},
//		italic:       {inline: 'em'},
//		underline:    {inline: 'span', styles : {'text-decoration' : 'underline'}},
//		strikethrough:{inline: 'del'}
//	}
//	});
//}

function initTinymce() {
    tinymce.init({
      directionality: "ltr",
      plugins: [
          "advlist autolink lists link image charmap print preview textcolor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table contextmenu paste jbimages emoticons"
          ],
        mode : "textareas",
        selector: "textarea.tinymce", 
        content_css : "/css/tema.css", 
        language : 'es',
        invalid_elements : "script,applet",
        height : "550",
        relative_urls : false,
        document_base_url : BASE_URL,
        remove_script_host: true,
        skin_url: '/css',
        force_br_newlines : true,
        force_p_newlines : false,
        forced_root_block : '',
        visualblocks_default_state: true,
        extended_valid_elements : "iframe[src|class|width|height|name|align|frameborder|style|allowfullscreen]",
        theme_advanced_buttons1 : "newdocument,|,bold,italic,underline,|,justifyleft,justifycenter,justifyright,fontselect,fontsizeselect,formatselect",
        theme_advanced_buttons2 : "cut,copy,paste,|,bullist,numlist,|,outdent,indent,|,undo,redo,|,link,unlink,anchor,image,|,code,preview,|,forecolor,backcolor",
        theme_advanced_buttons3 : "insertdate,inserttime,|,spellchecker,advhr,,removeformat,|,sub,sup,|,charmap,emotions",      
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        theme_advanced_statusbar_location : "bottom",
        theme_advanced_resizing : true
        , formats: {
            alignleft:    {selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,iframe', classes: 'text-left'},
            alignright:   {selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,iframe', classes: 'text-right'},
            alignfull:    {selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table', classes: 'text-justify'},
            aligncenter:  {selector: 'img,iframe', classes: 'center-block'},
            bold:         {inline: 'strong'},
            italic:       {inline: 'em'},
            underline:    {inline: 'span', styles : {'text-decoration' : 'underline'}},
            strikethrough:{inline: 'del'}
          }
    });
}
//            aligncenter:  {selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,iframe', classes: 'text-center'},
/* Función para añadir etiquetas y darle formato, también comprueba que no haya etiquetas duplicadas */
function initTokenfield() {
// CREATE/UPDATE ZONES
  $('#etiquetas').tokenfield({
    showAutocompleteOnFocus: true,
    delimiter: [','],
    limit: 4
//    delimiter: [',',' ', '-', '_']
  });
  $('#etiquetas').on('tokenfield:createtoken', function (event) {
    var existingTokens = $(this).tokenfield('getTokens');
    $.each(existingTokens, function(index, token) {
        if (token.value === event.attrs.value) {
            event.preventDefault( show_message( 'warning', 'Etiqueta duplicada' ) );
        }
      });
  });
};
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
    $(document).on('keyup', '.has-error input, .has-error textarea', function() {
        removeError( $(this) );        
    });
    $(document).on('change', '.has-error input', function() {
        removeError( $(this) );                
    });

    $(document).on('submit', 'form.ajax', function(e) {
        e.preventDefault();
        var $form = $(this);
        var $datos = new FormData(this);

        // Cierro los mensajes anteriores
        $('.alert').remove();

        // Cargo el loading
        $form.find('.load').show();
        $form.find('.btn-success').button('loading');
        show_message( 'info', 'Enviando, espere por favor.' );
        $.ajax({
            url: $form.attr('action'),
            type: 'post',
            dataType: 'json',
            async: true, // Tiene que ser así para no joder nada
            data: $datos,
            
            processData: false,
            contentType: false,

            success: function(data){
                $form.find('.load').hide();
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
                    $('.alert-warning').alert('close'); //Cierro los errores
                    $('#myModal').modal('hide'); //Oculto modal si lo hubiese
                    show_message( 'success', data.exito.msj ); //Mostramos mensaje de success
//                     window.location.reload(false);
                } 
                $form.find('.btn-success').button('reset'); //Botón submit lo reseteo
                /* URL para volver tanto si es exito como error */
                if ( data.url !== undefined ) {
                    //Ponemos el botón el loading mientras se recarga la página por si acaso lo vuelven a pulsar
                    $form.find('.btn-success').button('loading');
                    if ( data.url === 'reload' ) {
//                        window.location.href = document.URL; 
                        window.location.reload(false);
                    } else {
                        window.location.href = data.url;                                                    
                    }
                }
                //Para recargar el listado -> aulatic
                if ( data.reloadListado !== undefined ) {
                    var $formTabla = $('div.listado-head').find('form');
                    reloadDataListado( $formTabla );
                }
//                $form.find('.btn-success').button('reset'); //Botón submit lo reseteo
            }
        });
    });
});

// Cancelar formulario y eliminar objeto tinymce para cuando se regarga el formulario, este formulario es por AJAX
$(document).on('click', 'form .cancelarOculto', function() {
    /* Para eliminar el tinymce por si luego hay que recargarlo */
    tinyMCE.remove();
    $('html, body').animate({scrollTop: $(this).closest('body').offset().top}, 500);
    $(this).closest('.form-view').slideUp().remove();
});
// Ocultar formulario que ya está cargado en la página
$(document).on('click', 'form .ocultarForm', function() {
    $(this).closest('form').slideUp();
    $('html, body').animate({scrollTop: $(this).closest('body').offset().top}, 500);
});
// Ocultar formulario modal
$(document).on('click', 'form .hide-modal-form', function() {
    $('#myModal').modal('hide');
    $('html, body').animate({scrollTop: $(this).closest('body').offset().top}, 500);
});