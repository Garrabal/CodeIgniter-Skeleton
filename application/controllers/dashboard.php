<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Dashboard extends MY_Controller
{
	function __construct()
	{
		parent::__construct();
               
                $access = FALSE;
        }
        public function index()
        {
            if ( ! $this->ion_auth->logged_in() ) {
    //                    echo 'entra';
                redirect('login');
            } else {
                $data['entra'] = 'entra';
                $this->_render_page('dashboard', $data);
            }
            
        }
}
