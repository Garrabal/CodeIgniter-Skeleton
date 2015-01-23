<?php

class Inicio extends MY_Controller {
    public function __construct() {
        parent::__construct();
    }
    
    public function index() {
       echo modules::run( 'auth/index');
       echo modules::run( 'auth/index');
    }
    
    
    
}