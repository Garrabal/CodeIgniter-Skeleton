<?php

class Info
{
	/** @var integer Constante para tipo de notificación de información */
	const INFO			= 0;
	/** @var integer Constante para tipo de notificación de información */
	const SUCCESS		= 1;
	/** @var integer Constante para tipo de notificación de depuración */
	const DEBUG			= 2;
	/** @var integer Constante para tipo de notificación de testeo */
	const TEST			= 3;
	/** @var integer Constante para tipo de error warning */
	const WARNING		= 4;
	/** @var integer Constante para tipo de error error */
	const ERROR			= 5;
	/** @var integer Constante para tipo de error fatal */
	const FATAL			= 6;

	//Tipos de notificaciones...
	/** @var integer Constante para tipo de notificación por log. */
	const INFO_LOG		= 100;
	/** @var integer Constante para tipo de notificación por mail. */
	const INFO_MAIL 	= 101;
	/** @var integer Constante para tipo de notificación por pantalla. */
	const INFO_SCREEN	= 102;

    private $logFile = '';
    
	/** @var array Array con los textos de los diferentes niveles. */
	private static $TEXT_LEVELS = array(
		0 => 'INFO',
		1 => 'SUCCESS',
		2 => 'DEBUG',
		3 => 'TEST',
		4 => 'WARNING',
		5 => 'ERROR',
		6 => 'FATAL'
	);
	/** @var object Instancia de CI */
	protected $CI;

	/**
	 * Constructor dado un nivel de notificación un mensaje y un tipo notifica.
	 *
	 * @param	integer $level		Nivel de notificación.
	 * @param	string	$message	Mensaje a notificar.
	 * @param	integer	$type		Vía de notificación.
	 * @return
	 */
	public function __construct($message = '', $level = self::INFO, $type = self::INFO_LOG)
	{
		if (func_num_args() > 0)
		{
			switch ($type)
			{
				case self::INFO_LOG:
					ECO_Info::log($message, $level);
					break;
				case self::INFO_MAIL:
					ECO_Info::sendMailError($message, NULL, $level = self::INFO);
					break;
				case self::INFO_SCREEN:
				default:
					echo '[' . self::$TEXT_LEVELS[$type] . '] - ', $message;
					break;
			}
		}
        
        $this->logFile = 'log-'.date('Y-m-d') . EXT;
	}
    
    public function setLogFile( $logFile ) { 
        $repo = str_replace( 'www.', '', str_replace( array( '.es', '.com'), '', $_SERVER[ 'HTTP_HOST' ] ));
        $carpeta =  APPPATH . 'logs/' . $repo;
        if ( !is_dir( $carpeta ) ) {
            mkdir( $carpeta );
            copy( APPPATH . 'logs/index.html', $carpeta . '/index.html' );
        }
        $this->logFile =  $carpeta . '/' . $logFile . date('-Y-m-d') . EXT;        
    }

	/**
	 * Guarda un mensaje de notificación en el log.
	 *
	 * @param string	$message	Mensaje a guardar en el log.
	 * @param integer	$level		Nivel del mensaje a guardar.
	 */
	public function log($message, $level = self::INFO)
	{
//		$CI = &get_instance();

		//Cogemos configuración de log.
//		$now = (defined('APP_LOG_DATE') ? date(APP_LOG_DATE) : date('Y-m-d H:i:s'));
//		$log = (defined('APP_LOG') ? APP_LOG : APPPATH . 'logs/eco');
//
//		//Generamos día para log.
//		$log .= '-' . date('Y-m-d') . '.log';

//		if (!empty($this->logFile))
//		{
//			$log = APPPATH . 'logs/' . $CI->logFile;
//		}
		
		
		//Generamos línea a escribir		
        $message = str_pad( self::$TEXT_LEVELS[$level], 10) . ' ### ' . date('Y-m-d H:i:s') . ' ### ' . str_pad($message, 250) .  "\n";

		file_put_contents( $this->logFile, $message, FILE_APPEND);
	}

	/**
	 * Función que envía una notificación por emial.
	 *
	 * @param string	$message	Mensaje a enviar.
	 * @param string	$subject	Asunto, si no se especifica ninguno se usará uno por defecto.
	 * @param integer	$level		Nivel de la notificación.
	 */
	public static function sendMailError($message, $subject = NULL, $level = self::INFO)
	{
		$CI = &get_instance();

		$CI->load->library('email');

		global $MAIL_ADDRESS;

		$emailAddress = (!empty($MAIL_ADDRESS) && is_array($MAIL_ADDRESS))
			? $MAIL_ADDRESS
			: (defined('APP_MAIL') ? APP_MAIL : 'soporte@generanet.com');
			

		//Si hemos configurado una en el controlador cogemos la dirección de email del controlador.
		if (!empty($CI->emailAddress))
		{
			$emailAddress = $CI->emailAddress;
		}

		$CI->email->from('soporte@generanet.com', 'Soporte Generanet');
		$CI->email->to($emailAddress);

		// Hay un segundo email de destino? Si es asi, habrá 2 destinatarios
		if (defined('APP_MAIL2'))
		{
			$CI->email->cc(APP_MAIL2);
		} 		
		
		$subject = (!empty($subject) ? $subject : APP_NAME . ' - Notificacion - [' . self::$TEXT_LEVELS[$level] . ']');
		$CI->email->subject($subject);
		$CI->email->message($message);

		$CI->email->send();
	}

	/**
	 * Dada una variable imprime su contenido por una de las vías.
	 *
	 * @param	mixed	$var	Variable a inspeccionar.
	 * @param	string	$label	Etiqueta opcional para la variable.
	 * @param	integer	$type	Tipo de vía para mostrar la información
	 * @return	mixed			Devuelve información sobre la variable por la vía indicada.
	 */
	public static function dump($var, $label = NULL, $type = self::INFO_SCREEN)
	{
		// format the label
        $label = ($label === NULL) ? '' : rtrim($label) . ' ';

        // var_dump the variable into a buffer and keep the output
        ob_start();
        var_dump($var);
        $output = ob_get_clean();

        // neaten the newlines and indents
        $output = preg_replace("/\]\=\>\n(\s+)/m", "] => ", $output);
        $output = '<pre>'
        	. $label
        	. $output
			. '</pre>';

		switch ($type)
		{
			case self::INFO_LOG:
				self::log($output);
				break;
			case self::INFO_MAIL:
				self::sendMailError($output);
				break;
			case self::INFO_SCREEN:
			default:
				echo $output;
				break;
		}
	}

	/**
	 * Guarda un mensaje para mostarlo al usuario.
	 *
	 * @param integer	$code		Código de mensaje.
	 * @param string	$message	Mensaje , si el código se corresponse con uno, no se usa.
	 * @param array		$extra		Información adicional a guardar en el objeto mensaje.
	 * @param integer	$level		Nivel del mensaje.
	 */
	public static function storeUserMsg($code, $message = NULL, $extra = NULL, $level = ECO_Info::ERROR)
	{
		$CI = &get_instance();

		$CI->lang->load('msgs');

		switch ($level)
		{
			case self::ERROR:
			case self::WARNING:
				$key = 'error_';
				break;
			default:
				$key = strtolower(self::$TEXT_LEVELS[$level]) . '_';
				break;
		}

		$keyCode	= $key . str_pad($code, 3, '0', STR_PAD_LEFT);
		$msg		= $CI->lang->line($keyCode);
		$message 	= (!empty($msg) ? $msg : $message);

		/* Al ser un mensaje de error para el usuario lo suyo es que los guardemos en flash_data porque sólo
		 * se mostrará una vez.
		 */
		$msgs = $CI->session->userdata('msgs');

		if (empty($msgs))
		{
			$msgs = array();
		}

		$msgObject = new stdClass();
		$msgObject->code	= $code;
		$msgObject->level	= strtolower(self::$TEXT_LEVELS[$level]);
		$msgObject->message	= $message;

		if (!empty($extra) && is_array($extra))
		{
			$msgObject->extra = $extra;
		}

		$msgs[] = $msgObject;

		$CI->session->set_userdata('msgs', $msgs);
	}

	/**
	 * Obtiene los errores para los usuarios desde la sesión y borra dichos mensajes de sesión.
	 */
	public static function getUserMsg()
	{
		$CI = &get_instance();

		$msgs = $CI->session->userdata('msgs');
		$CI->session->unset_userdata('msgs');

		return $msgs;
	}

	/**
	 * Lanza un error al log y al email, dependiendo del nivel del error.
	 *
	 * @param integer	$code		Código de error según el cual obtendrá el mensaje.
	 * @param string	$message	Mensaje de error, se especifica si el codigo de error no existe.
	 * @param mixed		$data		Array o string para pasarle al mensage mediante sprintf.
	 * @param integer	$level		Nivel del error, según el cual se logueará o se logueará y enviará por mail.
	 */
	public static function error($code, $message = NULL, $data = NULL, $level = self::WARNING)
	{
		$CI = &get_instance();

		$CI->lang->load('msgs');

		$errorCode		= 'error_' . str_pad($code, 3, '0', STR_PAD_LEFT);
		$errorMessage	= $CI->lang->line($errorCode);

		if (empty($errorMessage))
		{
			$errorMessage = $message;
		}

		//Sustitución en mensaje de parámetros.
		if (!empty($data))
		{
			$args = array();
			$args[] = $errorMessage;

			if (is_array($data))
			{
				foreach ($data as $arg)
				{
					$args[] = $arg;
				}
			}
			else
			{
				$args[] = $data;
			}

			$errorMessage = call_user_func_array('sprintf', $args);
		}

		$stack = debug_backtrace();

		if (!empty($stack) && is_array($stack))
		{
			if (!empty($stack[0]))
			{
				$errorMessage .=
					(!empty($stack[0]['line']) ? ' - Línea: ' . $stack[0]['line'] : '') .
					(!empty($stack[0]['file']) ? ' - Fichero: ' . $stack[0]['file'] : '');
			}
		}

		switch ($level)
		{
			case self::ERROR:
			case self::FATAL:
				self::log($errorMessage, $level);
				self::sendMailError($errorMessage, NULL, $level);
				break;
			case self::WARNING:
			default:
				self::log($errorMessage, $level);
				break;
		}
	}

	/**
	 * Envía un email según los parámetros dados.
	 *
	 * @param	string	$from		Dirección de email del remitente.
	 * @param	string	$fromName	Nombre del usuario que envia.
	 * @param	mixed	$to			Puede ser una dirección de email o un array de direcciones
	 * @param	string	$subject	Asunto del email.
	 * @param	string	$message	Cuerpo del email.
	 * @param	string	$template	Plantilla de email.
	 * @param	array	$data		Datos para la plantilla de email.
	 * @param	boolean	$isHtml		Si es TRUE el cuerpo del email será html, en caso contrario texto plano.
	 * @param	string	$attach		Ruta de archivo a adjuntar o array de rutas.
	 * @return	boolean				Devuelve TRUE si se ha enviado FALSE en caso contrario.
	 */
	public static function sendMail($from, $fromName, $to, $subject, $message = NULL, $template = NULL,
	$data = NULL, $isHtml = TRUE, $attach = FALSE)
	{
		if (empty($from) || empty($fromName) || empty($to) || empty($subject))
		{
			throw new Exception(NULL, 500);
		}

		$CI = &get_instance();
		$CI->load->library('email');

		$CI->email->clear();
		$CI->email->from($from, $fromName);
		$CI->email->to($to);
		$CI->email->subject($subject);

		if ($isHtml)
		{
			$CI->email->set_mailtype('html');
		}
		if (empty($message) && !empty($template) && !empty($data))
		{
			$message = $CI->load->view($template, $data, TRUE);
		}

		$CI->email->message($message);

		if (!empty($attach))
		{
			if (is_array($attach))
			{
				foreach ($attach as $attachFile)
				{
					$CI->email->attach($attachFile);
				}
			}
			else
			{
				$CI->email->attach($attach);
			}
		}

		return $CI->email->send();
	}

	/**
	 * Monitoriza las acciones del usuario en un log.
	 *
	 * @param mixed		$userId		Puede ser el id del usuario o el nombre del usuario.
	 * @param integer	$code		Código del mensaje a grabar.
	 * @param string	$message	Mensaje a grabar, si el código no se corresponde con ninguno usa éste.
	 * @param array		$data		Datos a pasar como parámetros al mensaje que se quiere grabar
	 * @param integer	$level		Nivel del mensaje.
	 */
	public static function userWatchdog($user, $code, $message = NULL, $data = NULL, $level = self::INFO)
	{
		$CI = &get_instance();

		if (is_numeric($user))
		{
			$user = $CI->users->read($user);
		}

		$CI->lang->load('msgs');

		$keyCode = 'user_' . str_pad($code, 3, '0', STR_PAD_LEFT);
		$userMessage = $CI->lang->line($keyCode);

		if (!empty($data))
		{
			$args = array();
			$args[] = $userMessage;

			if (!empty($user) && is_object($user))
			{
				$args[] = $user->id . ':' . $user->title;
			}
			else
			{
				$args[] = $user;
			}

			if (is_array($data))
			{
				foreach ($data as $arg)
				{
					$args[] = $arg;
				}
			}
			else
			{
				$args[] = $data;
			}

			$userMessage = call_user_func_array('sprintf', $args);

			//Si está vacío lo cogemos de $message.
			if (!empty($userMessage))
			{
				$message = $userMessage;
			}
			else
			{
				$message = call_user_func_array('sprintf', $args);
			}
		}
		else
		{
			$userMessage = ((!empty($user) && is_object($user))
				? sprintf($userMessage, $user->id . ':' . $user->title)
				: sprintf($userMessage, $user));
			$message = (!empty($userMessage) ? $userMessage : sprintf($message, $user));
		}

		$now = (defined('APP_LOG_DATE') ? date(APP_LOG_DATE) : date('Y-m-d H:i:s'));
		$log = (defined('APP_LOG_USER') ? APP_LOG_USER : APPPATH . 'logs/users');

		//Generamos día para log.
		$log .= '-' . date('Y-m-d') . '.log';

		if (!empty($CI->logUserFile))
		{
			$log = $CI->logUserFile;
		}

		//Generamos línea a escribir.
		$message = '[' . self::$TEXT_LEVELS[$level] . '] [' . $_SERVER['REMOTE_ADDR'] . '] - ' . $now . ' --> '
			. $message . "\n";

		file_put_contents($log, $message, FILE_TEXT | FILE_APPEND);
	}

	/**
	 * Devuelve el mensaje del nivel especificado. Útil para mostrar mensajes destinados a javascript.
	 *
	 * @param	integer $code	Código del mensaje a devolver.
	 * @param	integer $level	Tipo de mensaje a devolver.
	 * @return	string			Mensaje a devolver.
	 */
	public static function getMessage($code, $level = self::INFO)
	{
		$CI = &get_instance();
		$CI->lang->load('msgs');

		$keyCode = strtolower(self::$TEXT_LEVELS[$level]) . '_' . str_pad($code, 3, '0', STR_PAD_LEFT);
		$message = $CI->lang->line($keyCode);

		return (!empty($message) ? $message : FALSE);
	}
}