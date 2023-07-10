<?php namespace templates\section\topnav; ?>
<?php function topnav ( $prefix = './' , $current = 0 ){?>
<div class="topnav" data-controller="topnav">
	<nav class="navbar navbar-expand-sm bg-primary navbar-dark topnav-fixed-top">
		<a class="navbar-brand" href="javascript:void(0);" data-event="topnav.click.route" data-params='{"path":""}'>
			<img  data-valuectrl="topnav.companylogo" alt="Logo" style="width:50px;">
		</a>
		<ul class="navbar-nav mr-auto" >
			<li class="nav-item <?php if ( $current == 0 ){ ?><?php }else{ echo "";}?>">
			  <a id='dashboard' data-event="topnav.click.route" data-params='{"path":""}' class="nav-link" href="javascript:void(0);">
				<i class="icon-dashboard"></i> Dashboard
			  </a>
			</li>
			<li class="nav-item">
			 <a id='itemmasterdata' data-event="topnav.click.route" data-params='{"path":"itemmasterdata"}' class="nav-link <?php if ( $current == 1 ){ ?>active<?php }else{ echo "";}?>" href="javascript:void(0);">
				<i class="icon-group"></i> Item Master Data
			 </a>
			</li>
			<!--<li class="nav-item">
			  <a id='supplier' data-event="topnav.click.route" data-params='{"path":"supplier"}' class="nav-link <?php if ( $current == 4 ){ ?>active<?php }else{ echo "";}?>" href="javascript:void(0);">
				<i class="icon-cog"></i> Business Partner
			 </a>
			</li>
			<li class="nav-item">
			  <a id='warehouse' data-event="topnav.click.route" data-params='{"path":"warehouse"}' class="nav-link <?php if ( $current == 1 ){ ?>active<?php }else{ echo "";}?>" href="javascript:void(0);">
				<i class="icon-list"></i> Warehouse
			 </a>
			</li>-->
			<!--<li class="nav-item">
			  <a id='transaction' data-event="topnav.click.route" data-params='{"path":"transaction"}' class="nav-link <?php if ( $current == 3 ){ ?>active<?php }else{ echo "";}?>" href="javascript:void(0);">
				<i class="icon-time"></i> Transactions
			 </a>
			</li>
			
			
			<li class="nav-item">
			  <a id='settings' data-event="topnav.click.route" data-params='{"path":"settings"}' class="nav-link <?php if ( $current == 3 ){ ?>active<?php }else{ echo "";}?>" href="javascript:void(0);">
				<i class="icon-time"></i> Settings
			 </a>
			</li>-->
			<!--<li class="nav-item">
			  <a id='specialsubject' data-event="topnav.click.route" data-params='{"path":"settings"}' class="nav-link <?php if ( $current == 3 ){ ?>active<?php }else{ echo "";}?>" href="javascript:void(0);">
				<i class="icon-time"></i> Reports
			 </a>
			</li>-->
			<!--<li class="nav-item">
			  <a id='specialsubject' data-event="topnav.click.route" data-params='{"path":"settings"}' class="nav-link <?php if ( $current == 3 ){ ?>active<?php }else{ echo "";}?>" href="javascript:void(0);">
				<i class="icon-time"></i> Settings
			 </a>
			</li>-->
			
			
		</ul>
		 <ul class="navbar-nav">
		  <li class="nav-item">
			<img  id='top-profpic' src='<?php echo $prefix; ?>sources/images/prof.jpg' alt="Logo" style="width:40px;">
			&nbsp;
		  </li>
		  <li class="nav-item">
	
			<b><a data-event="topnav.click.route" data-params='{"path":"userprofile"}' class="nav-link active" href="javascript:void(0);" data-valuectrl="topnav.name"></a></b>
		
		  </li>
		  <!--<li class="nav-item">
			<a class="nav-link" href="javascript:void(0);" ><i class='icon-bell'></i></a>
		  </li>
		  <li class="nav-item">
			<a class="nav-link" href="javascript:void(0);" ><i class='icon-gear'></i></a>
		  </li>-->
		  <li class="nav-item">
			<a title='logout' class="nav-link" href="javascript:void(0);" data-event="topnav.click.logout"><i class='icon-signout'></i></a>
		  </li>
		  
		</ul>
	</nav>
</div>
<?php } ?>	
