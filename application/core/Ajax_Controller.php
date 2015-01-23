<?php

class Ajax_Controller extends MY_Controller {

    public function __construct()
    {
        parent::__construct();

        $this->load->library('response');
    }
}