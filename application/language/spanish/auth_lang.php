<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* Name:  Auth Lang - English
*
* Author: Ben Edmunds
* 		  ben.edmunds@gmail.com
*         @benedmunds
*
* Author: Daniel Davis
*         @ourmaninjapan
*
* Author: Josue Ibarra
*         @josuetijuana
*
* Location: http://github.com/benedmunds/ion_auth/
*
* Created:  03.09.2013
*
* Description:  Spanish language file for Ion Auth example views
*
*/

// Errors
$lang['error_csrf'] = 'Esta forma no pasó nuestras pruebas de seguridad.';

// Login
$lang['login_heading']         = 'Ingresar';
$lang['login_subheading']      = 'Por favor ingresa con tu email/usuario y contraseña.';
$lang['login_identity_label']  = 'Email/usuario:';
$lang['login_password_label']  = 'Contraseña:';
$lang['login_remember_label']  = 'Recuérdame:';
$lang['login_submit_btn']      = 'Ingresar';
$lang['login_forgot_password'] = '¿Olvidaste tu contraseña?';

// Index
$lang['index_heading']           = 'Usuarios';
$lang['index_subheading']        = 'Abajo está la lista de usuarios.';
$lang['index_fname_th']          = 'Nombre';
$lang['index_lname_th']          = 'Apellido';
$lang['index_email_th']          = 'Email';
$lang['index_groups_th']         = 'Grupos';
$lang['index_status_th']         = 'Status';
$lang['index_action_th']         = 'Acción';
$lang['index_active_link']       = 'Activo';
$lang['index_inactive_link']     = 'Inactivo';
$lang['index_create_user_link']  = 'Crear nuevo usuario';
$lang['index_create_group_link'] = 'Crear nuevo grupo';

// Deactivate User
$lang['deactivate_heading']                  = 'Desactivar usuario';
$lang['deactivate_subheading']               = '¿Estás seguro de que quieres desactivar al usuario \'%s\'?';
$lang['deactivate_confirm_y_label']          = 'Si:';
$lang['deactivate_confirm_n_label']          = 'No:';
$lang['deactivate_submit_btn']               = 'Enviar';
$lang['deactivate_validation_confirm_label'] = 'confirmación';
$lang['deactivate_validation_user_id_label'] = 'identificación de usuario';

// Create User
$lang['create_user_heading']                           = 'Crear Usuario';
$lang['create_user_subheading']                        = 'Por favor registra la información del usuario abajo.';
$lang['create_user_fname_label']                       = 'Nombre:';
$lang['create_user_lname_label']                       = 'Apellido:';
$lang['create_user_company_label']                     = 'Compañía:';
$lang['create_user_email_label']                       = 'Email:';
$lang['create_user_phone_label']                       = 'Teléfono:';
$lang['create_user_password_label']                    = 'Contraseña:';
$lang['create_user_password_confirm_label']            = 'Confirmar Contraseña:';
$lang['create_user_submit_btn']                        = 'Crear Usuario';
$lang['create_user_validation_fname_label']            = 'Nombre';
$lang['create_user_validation_lname_label']            = 'Apellido';
$lang['create_user_validation_email_label']            = 'Correo electrónico';
$lang['create_user_validation_phone1_label']           = 'Primera parte del numero telefónico';
$lang['create_user_validation_phone2_label']           = 'Segunda parte del numero telefónico';
$lang['create_user_validation_phone3_label']           = 'Tercera parte del numero telefónico';
$lang['create_user_validation_company_label']          = 'Nombre de Compañía';
$lang['create_user_validation_password_label']         = 'Contraseña';
$lang['create_user_validation_password_confirm_label'] = 'Confirmación de contraseña';

// Edit User
$lang['edit_user_heading']                           = 'Editar Usuario';
$lang['edit_user_subheading']                        = 'Por favor registra la información del usuario abajo.';
$lang['edit_user_fname_label']                       = 'Nombre:';
$lang['edit_user_lname_label']                       = 'Apellido:';
$lang['edit_user_company_label']                     = 'Compañía:';
$lang['edit_user_email_label']                       = 'Email:';
$lang['edit_user_phone_label']                       = 'Teléfono:';
$lang['edit_user_password_label']                    = 'Contraseña: (si quieres cambiarla)';
$lang['edit_user_password_confirm_label']            = 'Confirm Password: (si quieres cambiarla)';
$lang['edit_user_groups_heading']                    = 'Miembro de grupos';
$lang['edit_user_submit_btn']                        = 'Guardar Usuario';
$lang['edit_user_validation_fname_label']            = 'Nombre';
$lang['edit_user_validation_lname_label']            = 'Apellido';
$lang['edit_user_validation_email_label']            = 'Correo electrónico';
$lang['edit_user_validation_phone1_label']           = 'Primera parte del numero telefónico';
$lang['edit_user_validation_phone2_label']           = 'Segunda parte del numero telefónico';
$lang['edit_user_validation_phone3_label']           = 'Tercera parte del numero telefónico';
$lang['edit_user_validation_company_label']          = 'Compañía';
$lang['edit_user_validation_groups_label']           = 'Grupos';
$lang['edit_user_validation_password_label']         = 'Contraseña';
$lang['edit_user_validation_password_confirm_label'] = 'Confirmación de contraseña';

// Create Group
$lang['create_group_title']                  = 'Crear Grupo';
$lang['create_group_heading']                = 'Crear Grupo';
$lang['create_group_subheading']             = 'Por favor registra la información del grupo abajo.';
$lang['create_group_name_label']             = 'Nombre de Grupo:';
$lang['create_group_desc_label']             = 'Descripción:';
$lang['create_group_submit_btn']             = 'Crear Grupo';
$lang['create_group_validation_name_label']  = 'Nombre de Grupo';
$lang['create_group_validation_desc_label']  = 'Descripción';

// Edit Group
$lang['edit_group_title']                  = 'Editar Grupo';
$lang['edit_group_saved']                  = 'Grupo Guardado';
$lang['edit_group_heading']                = 'Editar Grupo';
$lang['edit_group_subheading']             = 'Por favor registra la información del grupo abajo.';
$lang['edit_group_name_label']             = 'Nombre de Grupo:';
$lang['edit_group_desc_label']             = 'Descripción:';
$lang['edit_group_submit_btn']             = 'Guardar Grupo';
$lang['edit_group_validation_name_label']  = 'Nombre de Grupo';
$lang['edit_group_validation_desc_label']  = 'Descripción';

// Change Password
$lang['change_password_heading']                               = 'Cambiar Contraseña';
$lang['change_password_old_password_label']                    = 'Contraseña Vieja:';
$lang['change_password_new_password_label']                    = 'Nueva Contraseña (de al menos %s caracteres de largo):';
$lang['change_password_new_password_confirm_label']            = 'Confirmar Nueva Contraseña:';
$lang['change_password_submit_btn']                            = 'Cambiar';
$lang['change_password_validation_old_password_label']         = 'Vieja Contraseña';
$lang['change_password_validation_new_password_label']         = 'Nueva Contraseña';
$lang['change_password_validation_new_password_confirm_label'] = 'Confirmar Nueva Contraseña';

// Forgot Password
$lang['forgot_password_heading']                 = 'Olvidé Mi Contraseña';
$lang['forgot_password_subheading']              = 'Por favor ingresa tu %s para que podamos enviarte un email para restablecer tu contraseña.';
$lang['forgot_password_email_label']             = '%s:';
$lang['forgot_password_submit_btn']              = 'Enviar';
$lang['forgot_password_validation_email_label']  = 'Correo Electrónico';
$lang['forgot_password_username_identity_label'] = 'Usuario';
$lang['forgot_password_email_identity_label']    = 'Email';


// Reset Password
$lang['reset_password_heading']                               = 'Cambiar Contraseña';
$lang['reset_password_new_password_label']                    = 'Nueva Contraseña (de al menos %s caracteres de largo):';
$lang['reset_password_new_password_confirm_label']            = 'Confirmar Nueva Contraseña:';
$lang['reset_password_submit_btn']                            = 'Guardar';
$lang['reset_password_validation_new_password_label']         = 'Nueva Contraseña';
$lang['reset_password_validation_new_password_confirm_label'] = 'Confirmar Nueva Contraseña';

// Activation Email
$lang['email_activate_heading']    = 'Activar cuenta por %s';
$lang['email_activate_subheading'] = 'Por favor ingresa a este link para %s.';
$lang['email_activate_link']       = 'activar tu cuenta';

// Forgot Password Email
$lang['email_forgot_password_heading']    = 'Reestablecer contraseña para %s';
$lang['email_forgot_password_subheading'] = 'Por favor ingresa a este link para %s.';
$lang['email_forgot_password_link']       = 'Restablecer Tu Contraseña';

// New Password Email
$lang['email_new_password_heading']    = 'Nueva contraseña para %s';
$lang['email_new_password_subheading'] = 'Tu contraseña ha sido restablecida a: %s';

