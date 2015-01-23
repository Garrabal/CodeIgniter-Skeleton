<?php

function autoload() {
    spl_autoload_register( 'custom_autoload', true, true );
}

function custom_autoload( $class ) {
    if ( file_exists( APPPATH . 'core/' . $class  .EXT ) ) {
        require_once APPPATH . 'core/' . $class . EXT;
    } else if ( file_exists( APPPATH . 'third_party/MX/' . $class . EXT ) ) {
        require_once APPPATH . 'third_party/MX/' . $class . EXT;
    } else if ( file_exists( APPPATH . 'libraries/' . $class . EXT ) ) {
        require_once APPPATH . 'libraries/' . $class . EXT;
    } else if ( strpos( $class, 'Formulario' ) !== false ) {
        require_once APPPATH . 'libraries/Formulario' . EXT;
    } else if ( strpos( $class, 'Tabla' )  !== false ) {
        require_once APPPATH . 'libraries/Tabla' . EXT;
    } else if ( strpos( $class, 'CI_Exceptions' )  !== false ) {
        require_once BASEPATH . 'core/Exceptions' . EXT;    
    } else if ( strpos( $class, 'User' )  !== false ) {
        require_once APPPATH . 'libraries/Ion_auth/Ion_auth' . EXT;
    }
}