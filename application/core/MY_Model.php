<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Model extends CI_Model {

	// Solución guarreras, pero valdrá de momento...
	// TODO: Ver cómo puedo decirle que coja los prefijos de otro sitio
	private $prefix = null;
	private $webId = null;

	function __construct() {

		parent::__construct();

		if ( is_null( $this->webId ) ) {
			$this->setConfigWebDDBB();
		}
	}

	private function setConfigWebDDBB() {
		$web = $this->db->select( 'prefix, id, url' )
			->from( 'webs' )
			->where( 'url', $_SERVER[ 'HTTP_HOST' ] )
			->limit( 1 )
			->get();

		// Puede que no exista la web que buscamos
		if ( $web->num_rows() > 0 ) {
            $web = $web->row();
			$this->prefix = $web->prefix;
			$this->webId = $web->id;
		} else {
            die( 'No existe la web buscada: ' . $_SERVER[ 'HTTP_HOST' ] );
        }

	}

	public function withPrefix( $tabla ) {
		return $this->prefix . '_' . $tabla;
	}

	public function getWebId() {
		return $this->webId;
	}

	/**
	 * Función genérica de inserción, para no tener que estar definiéndola
	 * @param type $table
	 * @param type $insData
	 * @param type $prefix
	 * @return int id del último elemento insertado, 0 si no
	 */
	public function insert( $table, $insData, $prefix = false ) {
		$id = 0;
		$table = ( $prefix ) ? $this->withPrefix( $table ) : $table;

		if ( $this->db->insert( $table, $insData ) ) {
			$id = $this->db->insert_id();
		}

		return $id;
	}


	/**
	 * Devuelve resultados desde la base de datos
	 *
	 * @param type $table
	 * @param type $filters
	 * @param type $orden
	 * @param type $prefix
	 * @param type $params
	 * @return type
	 */
	public function read( $table, $filters = array(), $orden = array(), $prefix = false, $params = NULL ) {
		$table = ( $prefix ) ? $this->withPrefix( $table ) : $table;

		$this->db->select();

//		Filtros Modo de uso
//		$filters = array(
//			'where' => array(
//				'mostrar'	=> 2
//			,	'id >'		=> 23
//			)
//		);

		if ( !empty ($filters) ) {
			foreach ($filters as $tipo => $filter) {
				switch ( $tipo ) {
					case 'where':
						foreach ($filter as $filt => $id ) {
							$this->db->where ($filt, $id);
						}
					break;

				}
			}
		}
        if ( !empty( $params->last_id )) {
           $this->db->where( 'id<', $params->last_id, false );
        }

//		Orden: Modo de uso
//		$orden = array(
//			'title'	=> 'asc'
//		,	'orden'	=> 'desc'
//		);
		if ( !empty($orden) ) {
			foreach( $orden as $order_by => $order_type ) {
				$this->db->order_by( $order_by, $order_type );
			}
		}
		if ( !empty( $params->limit ) ) {
            $this->db->limit( $params->limit );
		}

		$query = $this->db->get( $table );

		if ( !empty($params->devolver ) ) {
			switch ( $params->devolver ) {
				case 'fila':
					$results = $query->row();
				break;
				case 'todo':
					$results = $query->result();
				break;
			}
		} else {
			$results = $query->result();
		}

		return ($results);
   }

	/**
	 * Función para comprobar existencia de un elemento
	 *
	 * @param string $table Tabla en la que se busca
	 * @param array	$where Monta el filtrado de elementos por $key => $value
	 * @param bool $prefix Indica si la tabla lleva prefijo o no
	 * @return bool
	 */
	public function checkExists( $table, $where, $prefix = false ) {
		$table = ( $prefix ) ? $this->withPrefix( $table ) : $table;

		foreach ( $where as $key => $value ) {
			$this->db->where( $key, $value );
		}

		$num = $this->db->from( $table )
			->count_all_results();

		return ( ( $num > 0 ) ? true : false );
	}

	/**
	 * Función genérica para actualizar los datos
	 * @param type $table
	 * @param type $updData
	 * @param type $id
	 * @param type $prefix
	 * @return int
	 */
	public function update( $table, $id, $updData, $prefix = false ) {
		$table = ( $prefix ) ? $this->withPrefix( $table ) : $table;

		return $this->db->where('id', $id)
					   ->update($table, $updData);
	}
	/**
	 * Función genérica para eliminar filas
	 * @param type $table
	 * @param type $id
	 * @param type $prefix
	 * @return int
	 */
	public function delete( $table, $filters, $prefix = false ) {
		$table = ( $prefix ) ? $this->withPrefix( $table ) : $table;

		if ( !empty ($filters) ) {
			foreach ($filters as $tipo => $filter) {
				switch ( $tipo ) {
					case 'where':
						foreach ($filter as $filt => $id ) {
							$this->db->where ($filt, $id);
						}
					break;
				}
			}
		}
		return $this->db->delete($table);
   }

   /**
    * @param type $params
    */
	public function count( $params ) {
		$table = ( isset( $params->prefix ) && $params->prefix === true )
			? $this->withPrefix( $params->table ) : $params->table;

		if ( isset( $params->filtros ) ) {
			foreach ($params->filtros as $tipo => $filter) {
				switch ( $tipo ) {
					case 'where':
						foreach ($filter as $filt => $id ) {
							$this->db->where( $filt, $id );
						}
					break;

				}
			}
		}

		return $this->db->count_all_results( $table );
	}

	/**
	 * Obtiene un listado de las webs de la plataforma
	 * @return type
	 */
	public function getWebsForSelect() {
		$params	= (object) array(
			'table'		=> 'webs'
		,	'selectInit'	=> (object) array(
				'value'	=> 0
			,	'label'	=> 'Seleccione Web'
			)
		);

		return $this->getForSelect( $params );
	}

	/**
	 * Obtiene los valores para montar un select en cualquier lugar del código, desde la tabla
	 * @param type $params
	 * @return type
	 */
	public function getForSelect( $params )
	{
		$select	= array();
		if ( !empty( $params->selectInit ) ) {
			if ( !empty( $params->object ) OR !empty( $params->objectLabel ) ) {
				$select[]	= (object) array(
					'value'	=> $params->selectInit->value
				,	'label'	=> $params->selectInit->label
				);
			} else {
				$select[$params->selectInit->value]	= $params->selectInit->label;
			}
		} else {
			$select[0]	= 'Seleccione...';
		}
       
        $getOptionFunction  = ( isset( $params->getOptionsFunction ) ) ? $params->getOptionsFunction : 'getOptionsForSelect';
        
        $options	= $this->{$getOptionFunction}( $params );
        $fieldValue	= !empty( $params->fieldValue )	? $params->fieldValue	: 'id';
		$fieldLabel	= !empty( $params->fieldLabel )	? $params->fieldLabel	: 'name';
		if ( !empty( $options ) ) {
			if ( !empty( $params->object ) ) {
				foreach( $options as $option ) {
					// Es necesario dar la id aquí para seleccionar rápido cuales son los
					// select activos
					$select[$option->{$fieldValue}]	= (object) array(
						'value'	=> $option->{$fieldValue}
					,	'label'	=> $option->{$fieldLabel}
					);
				}
			} elseif ( !empty( $params->multipleLabel ) ) {
                $fieldLabel = explode( ',', $fieldLabel );
				foreach( $options as $option ) {
                    $totalLabel = null;
                    //Se ha puesto para los cursos, si es un numero que ponga º EJEMPLO 1º de Primaria
                    foreach( $fieldLabel as $label ) {
                        $totalLabel.= ( is_numeric( $option->{$label} ) )? $option->{$label} . 'º de ' : ucfirst( $option->{$label} ); 
                    }
                    if ( !empty( $params->objectLabel ) ) {
                        $select[$option->{$fieldValue}]	= (object) array(
                            'value'	=> $option->{$fieldValue}
                        ,	'label'	=> $totalLabel 
                        );
                    } else {
                        $select[$option->{$fieldValue}]	= $totalLabel;
                    }
				}
			} else {
				foreach( $options as $option ) {
					$select[$option->{$fieldValue}]	= $option->{$fieldLabel};
				}
			}

		}
		return $select;
	}
    
    protected function getOptionsForSelect( $params )
    {
        $table	= ( !empty( $params->prefix ) ) ? $this->withPrefix( $params->table ) : $params->table;

		$fieldValue	= !empty( $params->fieldValue )	? $params->fieldValue	: 'id';
		$fieldLabel	= !empty( $params->fieldLabel )	? $params->fieldLabel	: 'name';
        
        return $this->db->select( "$fieldValue, $fieldLabel" )->from( $table )->get()->result();
    }



}