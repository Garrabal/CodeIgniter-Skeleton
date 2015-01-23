<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

// Load the MX_Controller class
//require APPPATH . 'third_party/MX/Controller.php';

class MY_Controller extends MX_Controller {
public $version = 3;
    public $js      = array( );
    private $css    = array( );
    // Datos de la web por defecto
    public $web     = null;
    // La variable que contendrá al usuario
    public $usuario = null;
    // Variable para las excepciones show404
    public $exc     = null;
    // Variable para el INFO LOG
    public $info    = null;

    private $_ci;
    
    const ERROR_CREATE	= 'Acción: Create ### Controlador: %s ### User: %s ### Mensaje: %s';
    const ERROR_READ	= 'Acción: Read   ### Controlador: %s ### User: %s ### Mensaje: %s';
    const ERROR_UPDATE	= 'Acción: Update ### Controlador: %s ### User: %s ### ID: %s ### Mensaje: %s';
    const ERROR_DELETE	= 'Acción: Delete ### Controlador: %s ### User: %s ### ID: %s ### Mensaje: %s';

    const ERROR_NO_ACCESS	= 'Acción: Acceso ### Controlador: %s ### User: %s ### Mensaje: Acceso Denegado en %s';

    const SUCCESS_CREATE	= 'Acción: Create ### Controlador: %s ### User: %s ### Id: %s ### Mensaje: Creado OK';
    const SUCCESS_UPDATE	= 'Acción: Update ### Controlador: %s ### User: %s ### Id: %s ### Mensaje: Actualizado OK';
    const SUCCESS_DELETE	= 'Acción: Delete ### Controlador: %s ### User: %s ### Id: %s ### Mensaje: Borrado OK';

    function __construct() {

//        require_once APPPATH . 'core/MY_Exceptions.php';
        
        $this->exc  = new MY_Exceptions();
        $this->info = new Info();
        // Extendiendo la clase del form validation para que tire bien con el HMVC
       // $this->form_validation->CI = & $this;

        // SIEMPRE debe haber un $this->usuario en la aplicación, cuando no esté
        // logueado, será un invitado.
        if ( is_null( $this->usuario ) ) {
            $this->usuario = new User();
        }

        parent::__construct();

        $this->_ci =& get_instance();            
    }

    /**
     * Load Javascript inside the page's body
     * @access  public
     * @param   string  $script
     */
    public function _load_script($script)
    {
        if (isset($this->_ci->template) && is_object($this->_ci->template))
        {
            // Queue up the script to be executed after the page is completely rendered
            echo <<< JS
<script>
    var CIS = CIS || { Script: { queue: [] } };
    CIS.Script.queue.push(function() { $script });
</script>
JS;
        }
        else
        {
            echo '<script>' . $script . '</script>';
        }
    }
}

/* End of file MY_Controller.php */
/* Location: ./application/core/MY_Controller.php */