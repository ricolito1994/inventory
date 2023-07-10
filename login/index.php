<?php ?>
<!doctype html>
<html>
<head>
<?php use templates\section\headimports as head; ?>
<?php use templates\section\bottomimports as bottom; ?>
<?php include("../sources/templates/section/imports.bottom.section.template.php"); ?>
<?php include("../sources/templates/section/imports.head.section.template.php"); ?>
<!--styles here for it is first to load-->
<?php head\import("../"); ?>
</head>

<body>
	
	<div class="login-main-container main-container login " id='main-div' data-controller="loginpage">
		<!--<div class="login-title" align="center">
				<h3>BTTHS Admission</h3>
				<h4>User Login</h4>
				<img src="../sources/images/logo.png" width='150' />
			</div>-->
		<div class="login-container">
			<h4>INVENTORY SYSTEM LOGIN</h4>
			<div class="login-form row">
				<div class="col-md-12">
					<div class="icon-addon addon-lg">
						<input data-event="loginpage.keyup.login_on_enter" type="text" placeholder="Username" class="form-control arial-font" id="username" data-valuectrl="loginpage.username">
						<label for="email" class="glyphicon icon-user" rel="tooltip" title="username"></label>
					</div>
				</div>
				<div class="col-md-12">
					<div class="icon-addon addon-lg">
						<input data-event="loginpage.keyup.login_on_enter" type="password" placeholder="Password" class="form-control arial-font" id="password" data-valuectrl="loginpage.password">
						<label for="password" class="glyphicon icon-lock" rel="tooltip" title="password"></label>
					</div>
				</div>	
				<div class="col-md-12">
					<button data-event="loginpage.click.login" class="btn btn-primary" style="width:100%;">Log In</button>
				</div>
			</div>
			<div id='login-errmsg' class="alert alert-danger disabled">
			  <strong>Error!</strong> Invalid username or password!
			</div>
			<div class="copyright-bottom">
				(c) AutoLigtasSystems 2020 - 2021
			</div>
		</div>
		
		
	</div>

</body>
<!--most likely import written codes-->
<?php bottom\import("../"); ?>
</html>