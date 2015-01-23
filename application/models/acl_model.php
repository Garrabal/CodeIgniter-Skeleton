<?php

if ( !defined( 'BASEPATH' ) )
    exit( 'No direct script access allowed' );

class Acl_model extends MY_Model {
	 public function __construct() {
        // Call the Model constructor
        parent::__construct();
    }

	/**
	 * Recoge los permisos desde la base de datos:
	 */
	public function getPermisos( $rolId, $userId )
	{
		$permissions = (object) array();

		// 1 - Recogemos los permisos generales (los de invitados)
		$permInvitado = $this->db->select('zone, permission, value')
			->from( $this->withPrefix( 'acl_roles' ) )
			->where('group_id', 0)
			->get()
			->result();

		foreach ( $permInvitado as $perm ) {
            if ( !isset( $permissions->{$perm->zone} )) {
                $permissions->{$perm->zone} = ( object )array();
            }
			$permissions->{$perm->zone}->{$perm->permission} = $perm->value;
		}

		// 2 - Recogemos los permisos del rol y sobreescribimos los de invitados
		$permRol = $this->db->select('zone, permission, value')
			->from( $this->withPrefix( 'acl_roles' ) )
			->where('group_id', $rolId )
			->get()
			->result();

		if ( !empty( $permRol ) ) {
			foreach ( $permRol as $perm ) {
				$permissions->{$perm->zone}->{$perm->permission} = $perm->value;
			}
		}

		// 3 - Si el usuario en particular tiene permisos especiales, sobreescribimos:
		$permUser = $this->db->select('zone, permission, value')
			->from( $this->withPrefix( 'acl_users' ) )
			->where('user_id', $userId )
			->get()
			->result();

		if ( !empty( $permUser ) ) {
			foreach ( $permUser as $perm ) {
				$permissions->{$perm->zone}->{$perm->permission} = $perm->value;
			}
		}

		return $permissions;
	}
}
