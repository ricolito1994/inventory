<?php namespace templates\section\headimports; ?>
<?php
session_start();
$current_page = explode('/',$_SERVER['REQUEST_URI'])[2];
#echo $current_page == "barcodereader";
if (!isset ( $_SESSION ['PASSWORD'] ) && $current_page != 'login' ) header('Location: /inventory/login');
		

if (isset ( $_SESSION ['PASSWORD'] ) && $current_page == 'login') 	header('Location: /inventory');
	

?>
<?php function import( $prefix = "" ) { ?>
<?php $ver = '';?>
<?php
global $ip_address;
//whether ip is from share internet
if (!empty($_SERVER['HTTP_CLIENT_IP']))   
  {
    $ip_address = $_SERVER['HTTP_CLIENT_IP'];
  }
//whether ip is from proxy
elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))  
  {
    $ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
  }
//whether ip is from remote address
else
  {
    $ip_address = $_SERVER['REMOTE_ADDR'];
  }

if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') 
    $link = "https"; 
else
    $link = "http"; 

?>
<title><?php ECHO isset($_SESSION['COMPANY_NAME']) ? $_SESSION['COMPANY_NAME'] : 'INVENTORY 1.0';  ?></title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="<?php echo $prefix;?>sources/imports/styles/font-awesome/css/font-awesome.min.css<?php echo $ver; ?>" />
<link rel="stylesheet" href="<?php echo $prefix;?>sources/imports/scripts/bootstrap4/css/bootstrap.min.css<?php echo $ver; ?>" />
<!--<link rel="stylesheet" href="<?php echo $prefix;?>sources/imports/scripts/bootstrap4/css/bootstrap-datepicker.css<?php echo $ver; ?>" />-->
<!--<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/css/bootstrap-datepicker.css" rel="stylesheet"/>-->
<link rel="stylesheet" href="<?php echo $prefix;?>sources/imports/scripts/bootstrap4/css/bootstrap-dp.css<?php echo $ver; ?>" />

<link rel="stylesheet" href="<?php echo $prefix;?>sources/styles/main.style.css<?php echo $ver; ?>" />
<link rel="stylesheet" href="<?php echo $prefix;?>sources/styles/dt.client.style.css<?php echo $ver; ?>" />
<link rel="stylesheet" href="<?php echo $prefix;?>sources/styles/login.style.css<?php echo $ver; ?>" />
<link rel="stylesheet" href="<?php echo $prefix;?>sources/styles/icon.form.style.css<?php echo $ver; ?>" />
<link rel="stylesheet" href="<?php echo $prefix;?>sources/styles/topnav.style.css<?php echo $ver; ?>" />
<link rel="stylesheet" href="<?php echo $prefix;?>sources/styles/modal.style.css<?php echo $ver; ?>" />
<link rel="stylesheet" href="<?php echo $prefix;?>sources/styles/checkbox.style.css<?php echo $ver; ?>" />
<link rel="stylesheet" href="<?php echo $prefix;?>sources/styles/yearpicker.style.css<?php echo $ver; ?>" />
<link rel="stylesheet" href="<?php echo $prefix;?>sources/styles/calendar.style.css<?php echo $ver; ?>" />

<script defer type="text/javascript" src="<?php echo $prefix;?>sources/imports/scripts/watcher/watcher.js<?php echo $ver; ?>" ></script>
<script defer type="text/javascript" src="<?php echo $prefix;?>sources/imports/scripts/jquery3/jquery-3.2.1.min.js<?php echo $ver; ?>" ></script>
<script defer type="text/javascript" src="<?php echo $prefix;?>sources/imports/scripts/jquery3/jquery-ui.js"></script>
<script defer type="text/javascript" src="<?php echo $prefix;?>sources/imports/scripts/tether/tether.min.js"></script>
<script defer type="text/javascript" src="<?php echo $prefix;?>sources/imports/scripts/popper/popper.min.js<?php echo $ver; ?>" ></script>
<script defer type="text/javascript" src="<?php echo $prefix;?>sources/imports/scripts/redirect/redirect.js<?php echo $ver; ?>" ></script>
<script defer type="text/javascript" src="<?php echo $prefix;?>sources/imports/scripts/bootstrap-4.0.0-beta.2/dist/js/bootstrap.min.js<?php echo $ver; ?>" ></script>
<script defer type="text/javascript" src="<?php echo $prefix;?>sources/imports/scripts/bootstrap4/js/bootstrap.datepicker.js<?php echo $ver; ?>" ></script>

<script defer type="module" src="<?php echo $prefix;?>sources/scripts/client/classes/socket.client.class.js" /></script>
<script defer type="module" src="<?php echo $prefix;?>sources/scripts/client/start.js<?php echo $ver; ?>" /></script>


<script defer>

var session_data = <?php echo json_encode( $_SESSION , true ); ?>;
<?php #echo $ip_address; ?>
var ipaddress = "<?php $ip_address = $ip_address == '::1' ? 'localhost' : 'localhost'; echo $ip_address; ?>";
var prot = "<?php echo $link;?>";
</script>
<?php } ?>