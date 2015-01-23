<?php

class My_Exceptions extends CI_Exceptions {

	public function __construct() {
		parent::__construct();
	}

	/**
	 * Para que por defecto loguee la página que da el 404
	 * @param type $page
	 * @param type $log_error
	 */
	public function show_404( $page = '', $log_error = TRUE, $custom_message = '') {
		$page = ( empty( $page ) ) ? BASE_URL . URL_URI : $page;

		$heading = "404 Página no encontrada";
        $message = "No se encuentra la página solicitada.";

		// By default we log this, but allow a dev to skip it
		if ( $log_error ) {
			$Log = new Info();
			$Log->setLogFile( 'error404' );
			$Log->log( 'Página No Encontrada: ' . $page . (!empty( $custom_message) ? ' ### ERROR: ' . $custom_message : '' ) , $Log::ERROR );
		}

		echo $this->show_error( $heading, $message, 'error_404', 404 );
		exit;
	}

	/**
	 * Reescrito para que inique en qué página pasa y ponga el error con el formato ###
	 * @param type $severity
	 * @param type $message
	 * @param type $filepath
	 * @param type $line
	 */
	function log_exception( $severity, $message, $filepath, $line ) {
		$severity = (!isset( $this->levels[ $severity ] )) ? $severity : $this->levels[ $severity ];

		$page = ( empty( $page ) ) ? BASE_URL . URL_URI : $page;

		$Log = new Info();
		$Log->setLogFile( 'errorPHP' );
		$Log->log( str_pad( 'Severity: ' . $severity, 30 )
			. ' ### ' . str_pad( $message . ' ' . $filepath . ' ' . $line, 100 )
			. ' ### ' . 'Página: ' . $page, $Log::ERROR );
		//log_message('error', 'Severity: '.$severity.'  --> '.$message. ' '.$filepath.' '.$line, TRUE);
	}

	/**
	 * Para que haga caso de lo que pongamos en el php_ini
	 *
	 * @param string $severity
	 * @param string $message
	 * @param string $filepath
	 * @param string $line
	 * @return string
	 */
	function show_php_error( $severity, $message, $filepath, $line ) {
		if ( ini_get( 'display_errors' ) ) {
			parent::show_php_error( $severity, $message, $filepath, $line );
		}
	}

}