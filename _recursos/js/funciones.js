$(document).ready( function(){
    $('[data-toggle=tooltip]').tooltip();
    $('[data-tooltip="tooltip"]').tooltip();
    $('div.alert-success, div.alert-warning').delay(ERROR_DELAY).fadeOut(FADE_OUT_TIME);
    
    $('#calendar').fullCalendar({
      // put your options and callbacks here
    })
    $(window).scroll(function () {
      if ($(this).scrollTop() > 50) {
          $('#back-to-top').fadeIn();
      } else {
          $('#back-to-top').fadeOut();
      }
    });
    // scroll body to 0px on click
    $('#back-to-top').click(function () {
      $('#back-to-top').tooltip('hide');
      $('body,html').animate({
          scrollTop: 0
      }, 700);
      return false;
    });
    $('.collapse').on( 'show.bs.collapse', toggleIconAccordion );
    $('.collapse').on( 'hidden.bs.collapse', toggleIconAccordion );
//    $('#back-to-top').tooltip('show');
    $(window).scroll(function(){
      var cargando = $('.scroll').attr('cargando');
      if ($(window).scrollTop() == ($(document).height() - $(window).height()) ){
         if (cargando == 0) {
            $('.scroll').attr('cargando',1);
            cargaFotos();
         }
      }
    });
    $(document).on('click', '.listadoModal', function() {
        var $padre  = $(this).closest('article');
        var $src    = $padre.find( 'img' ).attr('src');
        if ( $src.length > 1 ) {
            $src = $src.replace('?w=330&h=210', ''); // Cambiamos tamaño, pongo 10 porque con no funciona
            $src = $src.replace('?w=530&h=380', ''); // Cambiamos tamaño, pongo 10 porque con no funciona
        }               
        var $cuerpo = '<div class="modalCuerpoImg"><img class="img-thumbnail" src="'+$src+'"></img></div>\n\
                      <div class="modalCuerpo">'+$padre.find( '.listadoCuerpo' ).html()+'</div>';
        $('#myModal .modal-title').text( $padre.find( '.listadoTitle' ).text() );
        $('#myModal .modal-body').html( $cuerpo );
    });
    
    $('.shareme').sharrre({
        share: {
          twitter: true,
          facebook: true,
          googlePlus: true
        },
        template: '<div class="box"><div class="left">Compartir en redes sociales</div><div class="middle"><a href="#" class="facebook">f</a><a href="#" class="twitter">t</a><a href="#" class="googleplus">+1</a></div><div class="right">{total}</div></div>',
        enableHover: false,
        enableTracking: true,
        render: function(api, options){
          $(api.element).on('click', '.twitter', function() {
            api.openPopup('twitter');
          });
          $(api.element).on('click', '.facebook', function() {
            api.openPopup('facebook');
          });
          $(api.element).on('click', '.googleplus', function() {
            api.openPopup('googlePlus');
          });
        }
    });

//      $('.shareme').sharrre({
//      share: {
//        facebook: true,
//        googlePlus: true,
//        twitter: true,
//        digg: false,
//        delicious: false,
//        stumbleupon: false,
//        linkedin: false,
//        pinterest: false
//      },
//      buttons: {
//        googlePlus: {size: 'medium', annotation:'bubble', lang: 'es'},
//        facebook: {layout: 'button_count', lang: 'es_ES'},
//        twitter: {count: 'horizontal', lang: 'es'},
//        digg: {type: 'DiggMedium'},
//        delicious: {size: 'tall'},
//        stumbleupon: {layout: '5'},
//        linkedin: {counter: 'top'},
//        pinterest: {media: 'url', description: $('#shareme').data('text'), layout: 'vertical'}
//      },
//      enableHover: false,
//      enableCounter: false,
//      enableTracking: true
//    });
});


/* Slider de thumbnails */
// $('#sliderThumbnails').carousel({
// interval: 4000
// });
// $('#carouselFade').carousel({
//  interval: 4000
// });

 // handles the carousel thumbnails cuando click en los thumbs
 $('[id^=slider-selector-]').click( function(){
     var id_selector = $(this).attr("id");
     var id = id_selector.substr(id_selector.length -1);
     id = parseInt(id);
     $('#sliderThumbnails').carousel(id);
     $('[id^=slider-selector-]').removeClass('selected');
     $(this).addClass('selected');
 });

// when the carousel slides, auto update, cuando click en los controles
//$('#sliderThumbnails').on( 'slid', function (e) {
$('#sliderThumbnails').bind('slid.bs.carousel', function (e) {
    var id = $('.item.active').data('slide-number');
    id = parseInt(id);
    $('[id^=slider-selector-]').removeClass('selected');
    $('[id^=slider-selector-'+id+']').addClass('selected');
});


/* FUNCIÓN PARA EL SCROLL DE FOTOGRAFÍAS */
function cargaFotos() {        
   var lastId     = $(".scroll").find('div.galeria-fila:last div.imagen:last').attr("id")
   var galeriaId  = $(".scroll").attr("galeria-id")
   ,   fin        = $('.scroll').attr('fin');
  
   if ( fin != 1 ) {
      $('#loading').show();

      $.ajax({
         type: 'POST',
         url: BASE_URL + '/fotos/scroll/',
         data: { lastId : lastId, galeriaId : galeriaId },
         dataType: 'json',
         success: function(data) {
            if(data.error) {
               show_message('error', data.error);
            }
            if(data.fin != 1) {
               if(data.html !== undefined){
                  $('.scroll').append(data.html);
               }
            }
            else {
               if(data.html !== undefined){
                  $('.scroll').append(data.html);
               }
               $('.scroll').attr('fin','1');
               $('.scroll').append('<div class="alert alert-info">No hay más fotografías</div>');
            }
         },
         complete: function(){
             $('#loading').hide();
             $('.scroll').attr('cargando',0);
         }
      });
   }
}
// FUNCIONES POR DEFECTO

function nl2br (str, is_xhtml) {
var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

/**
 * Función de limpieza de formularios
 */
function clearForm(ele) {
    $(ele).find(':input').each(function() {
        switch(this.type) {
            case 'checkbox':
            case 'radio':
              this.checked = false;
              break;
            default: 
              $(this).val('');
            break;
        }
   });
}

/**
 * Función para mostrar mensajes de notificación
 */
var ERROR_DELAY = 5000;
var FADE_OUT_TIME = 2500;


function show_message (tipo, mensaje){
//  $('#msj').animate({
//            right: "+=50%",
//            }, 1500 );
   if ( tipo == 'error' ) { tipo = 'warning'; }
   $('#msj').append('<div class="alerta alert alert-'+tipo+'"><a class="close" data-dismiss="alert" href="#">×</a>' + mensaje + '</div>');
   $('#msj>div:last').delay(ERROR_DELAY).fadeOut(FADE_OUT_TIME);
}

function toggleIconAccordion(e) {
  $(e.target)
  .prev( '.panel-heading' )
  .find( 'span.change-icon' )
  .toggleClass( 'glyphicon-chevron-down glyphicon-chevron-up' );
//  .prev('.panel-heading')
//  .find( ".tituloListado" )
//  .attr( "data-original-title", "Contraer" )
}

$(document).ready(function(){
//FUNCIONES PARA LA ZONA DE LISTADO (AULA-TIC)
    // Cuando se seleccione algún filtro que recargue los datos (Select, Input radio y datepicker)
     $('div .listado-head select, div .listado-head input[type=radio], div .listado-head .datepicker').change( function() {
        var $form = $(this).closest('form');
        reloadDataListado( $form );
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

    $('div .listado-head input.filtrar').keyup(function(){
        typingTimer = setTimeout( doneTyping, doneTypingInterval );
    });

    $('div .listado-head input.filtrar').keydown(function(){
        clearTimeout( typingTimer );
    });

    function doneTyping() {
        if ( $('div .listado-head select.filtrar').val() != 0 ) {
            var input = $('div .listado-head input.filtrar');
            var $form = input.closest('form');
            reloadDataListado( $form );
        }
    }
    
    //Input con el número de página
    $('div .listado-head .paginacion .page').change( function(e) {
        e.preventDefault();
        var $form = $(this).closest('form');
        reloadDataListado( $form );
    });
    //Botones de nex, prev, init, end de PAGES
    $('div .listado-head .pagination .next, div .listado-head .pagination .prev, div .listado-head .pagination .init, div .listado-head .pagination .end').click( function( e ) {
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

        reloadDataListado( $form );
    });
    
    
    //Para el rating
     $(document).on( "click", '.rating .like, .rating .dislike', function( e ) {
        e.preventDefault();
        var element = $(this);//Para poder mover el icono
        var padre   = $(this).closest( 'span.rating' );
        var id      = padre.attr( 'data-id' )
          , type    = ''
          , animation    = '';
        if ( $(this).hasClass( 'like' ) ) { 
          type = 'like'; animation = '-'; 
        } else { 
          type = 'dislike'; animation = '+'; }
        var currentRating = padre.find( '.total-' + type );
        var newValue      = +currentRating.text() + 1;
        // Enviamos los datos por el post
        $.ajax({
            type: 'POST'
            , url: BASE_URL + '/aulatic/rating'
            , dataType: 'json'
            , data: {id : id, type : type }
            , success: function(data){
              if ( data.error != undefined ) {
                  show_message( 'warning', data.error.msj );
              }
              if ( data.exito != undefined ) {
                  show_message( 'success', data.exito.msj );
                  element.animate({ top : animation + '10' }, {
                    duration: 150, 
                    complete: function() { //Cuando se completa la función volvemos al punto inicial
                        element.animate({ top: 0 }, {
                            duration: 150, 
                        });
                    }});
                  //Ponemos el nuevo valor en el campo
                  currentRating.text( newValue );
              }
            }
        });
    });


//Para cargar el select de asignaturas en el form modal
    $(document).on('change', '#select-courses', function() {
        var $id = this.value; // or $(this).val()
        $( '#select-subjects ' ).prepend("<option value='0' selected>Cargando...</option>");
        $.ajax({
          url: BASE_URL + '/aulatic/subjects'
        , type: 'post'
        , dataType: 'json'
        , data:{ id : $id }
        , success: function(data){
              if( data.subjects ) {
                $( '#select-subjects option' ).remove();
                $.each( data.subjects, function(key, value) {  
  //                    console.log(key+value);
                   $( '#select-subjects ' )
                       .append($("<option></option>")
                       .attr("value",key)
                       .text(value)); 
                });
                $( '#select-subjects' ).focus();
              }
            }
        });
    });
});

/**
 * Reload the READ table data
 */
function reloadDataListado( $form ) {
    var datos = $form.serializeArray();

    $form.find('.estado .glyphicon-ok').hide();
    $form.find('.estado .load').show();

    $.ajax({
        url: $form.attr('action'),
        type: 'post',
        dataType: 'json',
        data: datos,
        success: function(data){
            if ( data.reload ) {
                //Recargar el select de asignaturas
                if( data.reload.optionSelect ) {
                  $( 'select[name=subjects] option' ).remove();
                  $.each( data.reload.optionSelect, function(key, value) {  
//                    console.log(key+value);
                     $( 'select[name=subjects]' )
                         .append($("<option></option>")
                         .attr("value",key)
                         .text(value)); 
                  });
                }
                //Buscamos el body y lo recarcamos
                var $section = $form.closest('section');
                $section.find('div.listado-body').empty();
                //Si está vacío se muestra mensaje 
                if ( data.reload.tbody ) {
                  $section.find('div.listado-body').html(data.reload.tbody);
                } else {
                  $section.find('div.listado-body').html('<p>No existen resultados</p>');
                }

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

            $form.find('.estado .glyphicon-ok').show();
            $form.find('.estado .load').hide();
        }
    });
}




(function(g,i,j,b){var h="sharrre",f={className:"sharrre",share:{googlePlus:false,facebook:false,twitter:false,digg:false,delicious:false,stumbleupon:false,linkedin:false,pinterest:false},shareTotal:0,template:"",title:"",url:j.location.href,text:j.title,urlCurl:BASE_URL + "/share.php",count:{},total:0,shorterTotal:true,enableHover:true,enableCounter:true,enableTracking:false,hover:function(){},hide:function(){},click:function(){},render:function(){},buttons:{googlePlus:{url:"",urlCount:false,size:"medium",lang:"en-US",annotation:""},facebook:{url:"",urlCount:false,action:"like",layout:"button_count",width:"",send:"false",faces:"false",colorscheme:"",font:"",lang:"en_US"},twitter:{url:"",urlCount:false,count:"horizontal",hashtags:"",via:"",related:"",lang:"en"},digg:{url:"",urlCount:false,type:"DiggCompact"},delicious:{url:"",urlCount:false,size:"medium"},stumbleupon:{url:"",urlCount:false,layout:"1"},linkedin:{url:"",urlCount:false,counter:""},pinterest:{url:"",media:"",description:"",layout:"horizontal"}}},c={googlePlus:"",facebook:"https://graph.facebook.com/fql?q=SELECT%20url,%20normalized_url,%20share_count,%20like_count,%20comment_count,%20total_count,commentsbox_count,%20comments_fbid,%20click_count%20FROM%20link_stat%20WHERE%20url=%27{url}%27&callback=?",twitter:"http://cdn.api.twitter.com/1/urls/count.json?url={url}&callback=?",digg:"http://services.digg.com/2.0/story.getInfo?links={url}&type=javascript&callback=?",delicious:"http://feeds.delicious.com/v2/json/urlinfo/data?url={url}&callback=?",stumbleupon:"",linkedin:"http://www.linkedin.com/countserv/count/share?format=jsonp&url={url}&callback=?",pinterest:"http://api.pinterest.com/v1/urls/count.json?url={url}&callback=?"},l={googlePlus:function(m){var n=m.options.buttons.googlePlus;g(m.element).find(".buttons").append('<div class="button googleplus"><div class="g-plusone" data-size="'+n.size+'" data-href="'+(n.url!==""?n.url:m.options.url)+'" data-annotation="'+n.annotation+'"></div></div>');i.___gcfg={lang:m.options.buttons.googlePlus.lang};var o=0;if(typeof gapi==="undefined"&&o==0){o=1;(function(){var p=j.createElement("script");p.type="text/javascript";p.async=true;p.src="//apis.google.com/js/plusone.js";var q=j.getElementsByTagName("script")[0];q.parentNode.insertBefore(p,q)})()}else{gapi.plusone.go()}},facebook:function(m){var n=m.options.buttons.facebook;g(m.element).find(".buttons").append('<div class="button facebook"><div id="fb-root"></div><div class="fb-like" data-href="'+(n.url!==""?n.url:m.options.url)+'" data-send="'+n.send+'" data-layout="'+n.layout+'" data-width="'+n.width+'" data-show-faces="'+n.faces+'" data-action="'+n.action+'" data-colorscheme="'+n.colorscheme+'" data-font="'+n.font+'" data-via="'+n.via+'"></div></div>');var o=0;if(typeof FB==="undefined"&&o==0){o=1;(function(t,p,u){var r,q=t.getElementsByTagName(p)[0];if(t.getElementById(u)){return}r=t.createElement(p);r.id=u;r.src="//connect.facebook.net/"+n.lang+"/all.js#xfbml=1";q.parentNode.insertBefore(r,q)}(j,"script","facebook-jssdk"))}else{FB.XFBML.parse()}},twitter:function(m){var n=m.options.buttons.twitter;g(m.element).find(".buttons").append('<div class="button twitter"><a href="https://twitter.com/share" class="twitter-share-button" data-url="'+(n.url!==""?n.url:m.options.url)+'" data-count="'+n.count+'" data-text="'+m.options.text+'" data-via="'+n.via+'" data-hashtags="'+n.hashtags+'" data-related="'+n.related+'" data-lang="'+n.lang+'">Tweet</a></div>');var o=0;if(typeof twttr==="undefined"&&o==0){o=1;(function(){var q=j.createElement("script");q.type="text/javascript";q.async=true;q.src="//platform.twitter.com/widgets.js";var p=j.getElementsByTagName("script")[0];p.parentNode.insertBefore(q,p)})()}else{g.ajax({url:"//platform.twitter.com/widgets.js",dataType:"script",cache:true})}},digg:function(m){var n=m.options.buttons.digg;g(m.element).find(".buttons").append('<div class="button digg"><a class="DiggThisButton '+n.type+'" rel="nofollow external" href="http://digg.com/submit?url='+encodeURIComponent((n.url!==""?n.url:m.options.url))+'"></a></div>');var o=0;if(typeof __DBW==="undefined"&&o==0){o=1;(function(){var q=j.createElement("SCRIPT"),p=j.getElementsByTagName("SCRIPT")[0];q.type="text/javascript";q.async=true;q.src="//widgets.digg.com/buttons.js";p.parentNode.insertBefore(q,p)})()}},delicious:function(o){if(o.options.buttons.delicious.size=="tall"){var p="width:50px;",n="height:35px;width:50px;font-size:15px;line-height:35px;",m="height:18px;line-height:18px;margin-top:3px;"}else{var p="width:93px;",n="float:right;padding:0 3px;height:20px;width:26px;line-height:20px;",m="float:left;height:20px;line-height:20px;"}var q=o.shorterTotal(o.options.count.delicious);if(typeof q==="undefined"){q=0}g(o.element).find(".buttons").append('<div class="button delicious"><div style="'+p+'font:12px Arial,Helvetica,sans-serif;cursor:pointer;color:#666666;display:inline-block;float:none;height:20px;line-height:normal;margin:0;padding:0;text-indent:0;vertical-align:baseline;"><div style="'+n+'background-color:#fff;margin-bottom:5px;overflow:hidden;text-align:center;border:1px solid #ccc;border-radius:3px;">'+q+'</div><div style="'+m+'display:block;padding:0;text-align:center;text-decoration:none;width:50px;background-color:#7EACEE;border:1px solid #40679C;border-radius:3px;color:#fff;"><img src="http://www.delicious.com/static/img/delicious.small.gif" height="10" width="10" alt="Delicious" /> Add</div></div></div>');g(o.element).find(".delicious").on("click",function(){o.openPopup("delicious")})},stumbleupon:function(m){var n=m.options.buttons.stumbleupon;g(m.element).find(".buttons").append('<div class="button stumbleupon"><su:badge layout="'+n.layout+'" location="'+(n.url!==""?n.url:m.options.url)+'"></su:badge></div>');var o=0;if(typeof STMBLPN==="undefined"&&o==0){o=1;(function(){var p=j.createElement("script");p.type="text/javascript";p.async=true;p.src="//platform.stumbleupon.com/1/widgets.js";var q=j.getElementsByTagName("script")[0];q.parentNode.insertBefore(p,q)})();s=i.setTimeout(function(){if(typeof STMBLPN!=="undefined"){STMBLPN.processWidgets();clearInterval(s)}},500)}else{STMBLPN.processWidgets()}},linkedin:function(m){var n=m.options.buttons.linkedin;g(m.element).find(".buttons").append('<div class="button linkedin"><script type="in/share" data-url="'+(n.url!==""?n.url:m.options.url)+'" data-counter="'+n.counter+'"><\/script></div>');var o=0;if(typeof i.IN==="undefined"&&o==0){o=1;(function(){var p=j.createElement("script");p.type="text/javascript";p.async=true;p.src="//platform.linkedin.com/in.js";var q=j.getElementsByTagName("script")[0];q.parentNode.insertBefore(p,q)})()}else{i.IN.init()}},pinterest:function(m){var n=m.options.buttons.pinterest;g(m.element).find(".buttons").append('<div class="button pinterest"><a href="http://pinterest.com/pin/create/button/?url='+(n.url!==""?n.url:m.options.url)+"&media="+n.media+"&description="+n.description+'" class="pin-it-button" count-layout="'+n.layout+'">Pin It</a></div>');(function(){var o=j.createElement("script");o.type="text/javascript";o.async=true;o.src="//assets.pinterest.com/js/pinit.js";var p=j.getElementsByTagName("script")[0];p.parentNode.insertBefore(o,p)})()}},d={googlePlus:function(){},facebook:function(){fb=i.setInterval(function(){if(typeof FB!=="undefined"){FB.Event.subscribe("edge.create",function(m){_gaq.push(["_trackSocial","facebook","like",m])});FB.Event.subscribe("edge.remove",function(m){_gaq.push(["_trackSocial","facebook","unlike",m])});FB.Event.subscribe("message.send",function(m){_gaq.push(["_trackSocial","facebook","send",m])});clearInterval(fb)}},1000)},twitter:function(){tw=i.setInterval(function(){if(typeof twttr!=="undefined"){twttr.events.bind("tweet",function(m){if(m){_gaq.push(["_trackSocial","twitter","tweet"])}});clearInterval(tw)}},1000)},digg:function(){},delicious:function(){},stumbleupon:function(){},linkedin:function(){function m(){_gaq.push(["_trackSocial","linkedin","share"])}},pinterest:function(){}},a={googlePlus:function(m){i.open("https://plus.google.com/share?hl="+m.buttons.googlePlus.lang+"&url="+encodeURIComponent((m.buttons.googlePlus.url!==""?m.buttons.googlePlus.url:m.url)),"","toolbar=0, status=0, width=900, height=500")},facebook:function(m){i.open("http://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent((m.buttons.facebook.url!==""?m.buttons.facebook.url:m.url))+"&t="+m.text+"","","toolbar=0, status=0, width=900, height=500")},twitter:function(m){i.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(m.text)+"&url="+encodeURIComponent((m.buttons.twitter.url!==""?m.buttons.twitter.url:m.url))+(m.buttons.twitter.via!==""?"&via="+m.buttons.twitter.via:""),"","toolbar=0, status=0, width=650, height=360")},digg:function(m){i.open("http://digg.com/tools/diggthis/submit?url="+encodeURIComponent((m.buttons.digg.url!==""?m.buttons.digg.url:m.url))+"&title="+m.text+"&related=true&style=true","","toolbar=0, status=0, width=650, height=360")},delicious:function(m){i.open("http://www.delicious.com/save?v=5&noui&jump=close&url="+encodeURIComponent((m.buttons.delicious.url!==""?m.buttons.delicious.url:m.url))+"&title="+m.text,"delicious","toolbar=no,width=550,height=550")},stumbleupon:function(m){i.open("http://www.stumbleupon.com/badge/?url="+encodeURIComponent((m.buttons.delicious.url!==""?m.buttons.delicious.url:m.url)),"stumbleupon","toolbar=no,width=550,height=550")},linkedin:function(m){i.open("https://www.linkedin.com/cws/share?url="+encodeURIComponent((m.buttons.delicious.url!==""?m.buttons.delicious.url:m.url))+"&token=&isFramed=true","linkedin","toolbar=no,width=550,height=550")},pinterest:function(m){i.open("http://pinterest.com/pin/create/button/?url="+encodeURIComponent((m.buttons.pinterest.url!==""?m.buttons.pinterest.url:m.url))+"&media="+encodeURIComponent(m.buttons.pinterest.media)+"&description="+m.buttons.pinterest.description,"pinterest","toolbar=no,width=700,height=300")}};function k(n,m){this.element=n;this.options=g.extend(true,{},f,m);this.options.share=m.share;this._defaults=f;this._name=h;this.init()}k.prototype.init=function(){var m=this;if(this.options.urlCurl!==""){c.googlePlus=this.options.urlCurl+"?url={url}&type=googlePlus";c.stumbleupon=this.options.urlCurl+"?url={url}&type=stumbleupon"}g(this.element).addClass(this.options.className);if(typeof g(this.element).data("title")!=="undefined"){this.options.title=g(this.element).attr("data-title")}if(typeof g(this.element).data("url")!=="undefined"){this.options.url=g(this.element).data("url")}if(typeof g(this.element).data("text")!=="undefined"){this.options.text=g(this.element).data("text")}g.each(this.options.share,function(n,o){if(o===true){m.options.shareTotal++}});if(m.options.enableCounter===true){g.each(this.options.share,function(n,p){if(p===true){try{m.getSocialJson(n)}catch(o){}}})}else{if(m.options.template!==""){this.options.render(this,this.options)}else{this.loadButtons()}}g(this.element).hover(function(){if(g(this).find(".buttons").length===0&&m.options.enableHover===true){m.loadButtons()}m.options.hover(m,m.options)},function(){m.options.hide(m,m.options)});g(this.element).click(function(){m.options.click(m,m.options);return false})};k.prototype.loadButtons=function(){var m=this;g(this.element).append('<div class="buttons"></div>');g.each(m.options.share,function(n,o){if(o==true){l[n](m);if(m.options.enableTracking===true){d[n]()}}})};k.prototype.getSocialJson=function(o){var m=this,p=0,n=c[o].replace("{url}",encodeURIComponent(this.options.url));if(this.options.buttons[o].urlCount===true&&this.options.buttons[o].url!==""){n=c[o].replace("{url}",this.options.buttons[o].url)}if(n!=""&&m.options.urlCurl!==""){g.getJSON(n,function(r){if(typeof r.count!=="undefined"){var q=r.count+"";q=q.replace("\u00c2\u00a0","");p+=parseInt(q,10)}else{if(r.data&&r.data.length>0&&typeof r.data[0].total_count!=="undefined"){p+=parseInt(r.data[0].total_count,10)}else{if(typeof r[0]!=="undefined"){p+=parseInt(r[0].total_posts,10)}else{if(typeof r[0]!=="undefined"){}}}}m.options.count[o]=p;m.options.total+=p;m.renderer();m.rendererPerso()}).error(function(){m.options.count[o]=0;m.rendererPerso()})}else{m.renderer();m.options.count[o]=0;m.rendererPerso()}};k.prototype.rendererPerso=function(){var m=0;for(e in this.options.count){m++}if(m===this.options.shareTotal){this.options.render(this,this.options)}};k.prototype.renderer=function(){var n=this.options.total,m=this.options.template;if(this.options.shorterTotal===true){n=this.shorterTotal(n)}if(m!==""){m=m.replace("{total}",n);g(this.element).html(m)}else{g(this.element).html('<div class="box"><a class="count" href="#">'+n+"</a>"+(this.options.title!==""?'<a class="share" href="#">'+this.options.title+"</a>":"")+"</div>")}};k.prototype.shorterTotal=function(m){if(m>=1000000){m=(m/1000000).toFixed(2)+"M"}else{if(m>=1000){m=(m/1000).toFixed(1)+"k"}}return m};k.prototype.openPopup=function(m){a[m](this.options);if(this.options.enableTracking===true){var n={googlePlus:{site:"Google",action:"+1"},facebook:{site:"facebook",action:"like"},twitter:{site:"twitter",action:"tweet"},digg:{site:"digg",action:"add"},delicious:{site:"delicious",action:"add"},stumbleupon:{site:"stumbleupon",action:"add"},linkedin:{site:"linkedin",action:"share"},pinterest:{site:"pinterest",action:"pin"}};_gaq.push(["_trackSocial",n[m].site,n[m].action])}};k.prototype.simulateClick=function(){var m=g(this.element).html();g(this.element).html(m.replace(this.options.total,this.options.total+1))};k.prototype.update=function(m,n){if(m!==""){this.options.url=m}if(n!==""){this.options.text=n}};g.fn[h]=function(n){var m=arguments;if(n===b||typeof n==="object"){return this.each(function(){if(!g.data(this,"plugin_"+h)){g.data(this,"plugin_"+h,new k(this,n))}})}else{if(typeof n==="string"&&n[0]!=="_"&&n!=="init"){return this.each(function(){var o=g.data(this,"plugin_"+h);if(o instanceof k&&typeof o[n]==="function"){o[n].apply(o,Array.prototype.slice.call(m,1))}})}}}})(jQuery,window,document);
   /**
    * Embellecer los alerts de la página, como una extensión de jQuery
    * Uso:
      $.alert( {text: 'Esto es un mensaje de prueba'} );
    *
   $.extend({ alert: function ( setting, okFunc ) {
      $( '<div>' + setting.text + '</div>' ).dialog({
           draggable: false
         , modal: true
         , resizable: false
         , height: (setting.height != undefined) ? setting.height : 150
         , width:  (setting.width  != undefined) ? setting.width  : 260
         , title:  (setting.title  != undefined) ? setting.title  : '¡Mensaje de Gaytactos!'
         , buttons:
            [{ text: setting.ok || 'Entendido'
             , click: function () {
                  if (typeof (okFunc) == 'function') { setTimeout( okFunc, 50); }
                  $(this).dialog( 'destroy' );
               }
             }]
         });
      }
   });

   /**
    * Embellecer los confirm de la página, como una extensión de jQuery
    * Uso:
      $.confirm( ({ text: '¿Quieres borrar XXX?', title: 'Confirmar Borrado' }),
         function () {
            alert('You clicked OK');
         },
         function () {
            alert('You clicked Cancel');
         }
      );
    *
   $.extend({ confirm: function ( setting, okFunc, cancelFunc ) {
      $('<div>' + setting.text + '</div>').dialog({
         draggable: false
       , modal: true
       , resizable: false
       , width: (setting.width  != undefined) ? setting.width  : 260
       , title: setting.title || 'Confirmar Borrado'
       , minHeight: 75
       , buttons:
            [{ text: setting.ok ||'Borrar'
             , click: function () {
                  if (typeof (okFunc) == 'function') { setTimeout( okFunc, 50); }
                  $(this).dialog( 'destroy' );
               }
             }
           , { text: 'Cancelar'
             , click: function () {
                  if (typeof (cancelFunc) == 'function') { setTimeout( cancelFunc, 50); }
                  $(this).dialog( 'destroy' );
               }
             }]
         });
      }
   });
*/
