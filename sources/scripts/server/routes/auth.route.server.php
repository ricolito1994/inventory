<?php
session_start();
$data = $_POST['data'];

switch ( $data['request'] ){
	
	case "login" :
		
		foreach ( $data['login_data'][0] as $k => $v ){
			$_SESSION[ $k ] = $v;
			
		}
		#print_r ( $_SESSION );
		#header('Location: /studentadmission/');
		
	break;
	
	case "logout" :
		session_unset();
		session_destroy();
		header('Location: /inventory/login');
	break;
	
}

?>