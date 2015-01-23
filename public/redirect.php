<?php

define( 'UPLOAD_FOLDER',	__DIR__ . '/../_uploads/' );
define( 'RECURSOS_FOLDER',	__DIR__ . '/../_recursos/' );
define( 'APP_FOLDER',		__DIR__ . '/../application/' );

function get( $var ) {
	return ( isset($_GET[$var]) ? $_GET[$var] : false );
}
// El repo es
// Caso concreto de la versión de prueba:
//if ( in_array( $_SERVER['HTTP_HOST'], array( 'devgestion.webnetizar.es', 'gestion.webnetizar.es' ) ) ) {
//	$repo = 'webnetizar';
//} elseif ( in_array( $_SERVER['HTTP_HOST'], array( 'kengurupro.eficsi.es' ) ) ) {
//	$repo = 'kengurupro';
//} else {
//    $extensiones = array( '.es', '.com' );
//	$repo = str_replace( array( 'www.' ,'dev.'), '', str_replace( $extensiones, '', $_SERVER[ 'HTTP_HOST' ] ) );
//}

$file = get('file');
$type = get('type');
$ruta = get('ruta');

switch( $ruta ) {
	case 'uploads':
	case 'files':
		$rutaRecursos = UPLOAD_FOLDER;
	break;

	default:
		$rutaRecursos = RECURSOS_FOLDER;
	break;
}
try {
    switch ( $type ) {
        case 'file' :
            $carpeta = '/files/';
            $realFile   = $rutaRecursos . $carpeta . $file;
            $nombreFile = explode( '/' , $file );
            $nombreFile = array_pop( $nombreFile );
            if ( file_exists( $realFile ) ) {
                // Necesitamos el contentType, nombre y tamaño. Se ha puesto para descargar siempre Content-Disposition: attachment
                $contentType = mime_content_type( $realFile );

                header( 'Content-Description: File Transfer' );
                header( "Cache-Control: public, must-revalidate" );
                header( 'Pragma: public' );
                header( "Content-Type: $contentType " );
//                header( 'Content-Disposition: inline; filename="' . $nombreFile . '"' );
                header( 'Content-Transfer-Encoding: binary' );
                header( 'Content-Length: ' . ( string ) filesize( $realFile ) );
                header( 'Accept-Ranges: bytes' );
                header( 'Content-Disposition: attachment; filename=' . basename( $nombreFile ));
                header('Expires: 0');

                echo file_get_contents( $realFile );
//                @readfile($realFile);
            } else {
                throw new Exception();
            }
        break;

        case 'css' :
        case 'less':
            switch ( $file ) {
                case 'bootstrap.css':
                case 'chosen.css':
                case 'lightbox.css':

                case 'fullcalendar.css':
                case 'estilo.css':
                case 'estiloAdmin.css':

				// Tinymce
                case 'skin.min.css':
                case 'content.min.css':
                case 'tinymce_upload.css':

				// CookieLawInfo (cli)
				case 'cookie-law-information-style.css':
                    $carpeta = '/css/';
                break;

                default:
                    if ( preg_match( '/([0-9a-f]{32})\.css/', $file )) {
                        $carpeta = '/cache/js_css/';
                    } else {
                        $carpeta = '/css/';
                    }
                break;
            }
            $ctype = 'text/css';

        break;

        case 'fonts':
            // La carpeta de las fuentes
            $carpeta = '/fonts/';
          break;

        case 'image':
            switch ( $file ) {
                case 'glyphicons-halflings-white.png':
                case 'glyphicons-halflings.png':
                case 'chosen-sprite.png':
                case 'iconosTabla.png':
                case 'load.gif':
                case 'notificaciones.png':
                case 'check.png':
                case 'sprite-social-16.png':
                case 'sprite-social-24.png':
                case 'ajax-loader.gif':
                case 'files-sprite.png':
                case 'files-sprite-30.png':
                case 'object.gif':
                case 'sprite-tecno-eficsi-50.png':

                // Plugin de Lightbox
                case 'lightbox/close.png':
                case 'lightbox/loading.gif':
                case 'lightbox/next.png':
                case 'lightbox/prev.png':
                    $carpeta = '/images/';
                break;

                case 'glyphicons-halflings-regular.woff':
                case 'glyphicons-halflings-regular.svg':
                case 'glyphicons-halflings-regular.ttf':
                    $carpeta = '/fonts/';
				break;

                default:
                    if ( $ruta == "files" ) {
                        $carpeta = '/files/';
                    }
                    else {
                        $carpeta = '/images/';
                    }
                break;
            }

            if ( file_exists( $rutaRecursos . $carpeta . $file ) ) {

                // Si está definido width, y height es 0, se fuerza al ancho manteniendo proporcionalidad
                // Si está definido height, y width es 0, se fuerza al alto manteniendo proporcionalidad
                // Si están los dos, cortamos
                $width  = get('w');
                $height = get('h');

                if ( $width && $height ) {
                    $nameFile = explode( '/', $file );
                    $thumbFile = 'thumb_' . $width . '_' . $height . '_' . array_pop($nameFile);
                    $rutaThumb = implode( '/', $nameFile ) . '/';

                    if ( file_exists( $rutaRecursos . $carpeta . $rutaThumb . $thumbFile ) ) {
                        $file = $rutaThumb . $thumbFile;
                    } else {
                        if ( !in_array( $width, array( 0, 50, 120, 200, 250, 300, 320, 330, 340, 348, 530, 698, 730, 865 ) ) 
                          || !in_array( $height, array( 0, 50, 60, 80, 150, 170, 180, 200, 210, 220, 230, 240, 250, 340, 380, 486, 500, 865 ) ) || ( $width == 0 ) && ( $height == 0 ) ) {
                            throw new Exception();
                        }
                        require_once( APP_FOLDER . 'libraries/SimpleImage.php');
                        // Redimensionado y guardado de la imagen
                        $image = new SimpleImage();
                        $image->load( $rutaRecursos . $carpeta . $file );

                        if ( $height == 0 || $width == 0 ) {
                            if ( $height == 0) {
                                $image->resizeToWidth( $width );
                            }
                            if ( $width == 0) {
                                $image->resizeToHeight( $height );
                            }
                        } else {
                            if ( $width == $height ) {
                                $image->createThumb( $width );
                            } else {
//                                $image->resize($width, $height);
                                $image->resize_image( $width, $height, 1 );
                            }
                        }

                        $targetFile = $rutaRecursos . $carpeta . $rutaThumb . $thumbFile;
                        $image->save( $targetFile );
                        $file = $rutaThumb . $thumbFile;
                    }
                }
            } else {
                throw new Exception();
            }
        break;

        case 'js':
            switch ( $file ) {
                case 'bootstrap.min.js':
                case 'lightbox-2.6.min.js':
                case 'jquery.autosize.min.js':
                case 'jquery.chosen.min.js':

                case 'contacto.js':
                case 'crud.js':
                case 'forms.js':
                case 'listado.js':
                case 'updatedatoscontacto.js':
                case 'funciones.js':
                case 'personal.js':
                case 'fotografias.js':
                case 'noticias.js':
                case 'files.js':
                case 'fullcalendar.min.js':
                case 'bootstrap-tokenfield.min.js':

                case 'cookielawinfo.js':

                case 'tinymce_upload.js':
                    $carpeta = '/js/';
                break;

                case 'tinymce.min.js':
                case 'themes/modern/theme.min.js':
                case 'langs/es.js':
                    $carpeta = '/js/tinymce/';
                break;

                case 'vars.js':
                default:
                    // Para los plugins del tinymce, están en la carpeta puglins dentro de JS
                    if ( preg_match( '/plugins/', $file ) ){
                        $carpeta = '/js/';
						}
                    elseif ( preg_match( '/([0-9a-f]{32})\.js/', $file )) {
                        $carpeta = '/cache/js_css/';
                    } else {
                        $carpeta = '/js/';
                    }
                break;
            }
            //Para el css que lo carga el js del tinymce
//            if ( $file == '/plugins/visualblocks/css/visualblocks.css') {
            if ( preg_match( '/visualblocks.css/', $file ) ){
                 $ctype = 'text/css';
            } else { 
                $ctype = 'application/x-javascript';
            }
        break;
    }
    if ( file_exists( $rutaRecursos . $carpeta . $file ) ) {
        //Buscamos el tipo mime que lo dá el PHP, en local lo interpreta como texto plano
        $file_con_ruta = $rutaRecursos . $carpeta . $file;
        if ( empty( $ctype ) ) {
            if ( function_exists( 'finfo_file' ) && defined( 'FILEINFO_MIME_TYPE' ) ) {
            $resource = finfo_open( FILEINFO_MIME_TYPE );
            if ( $resource ) {
                $ctype = finfo_file( $resource, $file_con_ruta );
                finfo_close( $resource );
            }
        }
        // for everyone else.
        if ( !$ctype && function_exists( 'mime_content_type' )) {
            $ctype = mime_content_type( $file_con_ruta );
        }

//          $resource = finfo_open( FILEINFO_MIME_TYPE );
//          $ctype    = finfo_file( $resource,  $file );
//          finfo_close( $resource );
        }

        // Expiran a los 1000 días
        header( 'Cache-Control: "public" ');
        header( 'Expires: '.gmdate('D, d M Y H:i:s \G\M\T', time() + 8650000));
        header( 'content-type: ' . $ctype . '; charset=utf-8' );
        readfile( $rutaRecursos . $carpeta . $file );
    } else {
        throw new Exception();
    }
} catch (Exception $ex) {
    header( "HTTP/1.0 404 Not Found" );
}