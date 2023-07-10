<?php namespace server\routes\start; ?>
<!DOCTYPE html>
<?PHP
session_start();
include_once ("../../scripts/server/routes/start.route.server.php");
global $registry;

function get_item_details ( $id  ){
	global $registry;
	//VAR_DUMP($registry);
	return $registry->GET ("DB")->execute ('select * from inventory.item_master_data '.( isset($id) ? ' WHERE ITEM_CODE = ? ' : '' ),[ isset($id) ? $id : null ],\PDO::FETCH_ASSOC)->fetchAll();
}

function get_units ($id){
	global $registry;
	return $registry->GET ("DB")->execute ('select * from inventory.unit  WHERE ITEM_CODE = ?',[ $id ],\PDO::FETCH_ASSOC)->fetchAll();

}

function convertUnit ( $value , $currentUnit, $toUnit , $u ){
	
	
		$thisUnit = $u[ array_search($currentUnit, array_column($u , 'UNIT_NAME')) ]; 
		$toUnitConvert = $u[ array_search($toUnit, array_column($u , 'UNIT_NAME')) ];
		$multiplier = 1;
		//console.log( value,currentUnit, toUnit,'->',toUnitConvert['HEIRARCHY'] ,'<' , currentUnit,'->',thisUnit['HEIRARCHY'] )
		
		if ($currentUnit == $toUnit){
			return $value;
		}
		
		else if ( $toUnitConvert['HEIRARCHY'] < $thisUnit['HEIRARCHY']  ){
			$next = $thisUnit['HEIRARCHY']  ;
					
			while ( true ){
				$sel = $u[ $next ];
				
				if ( $sel['HEIRARCHY'] == $toUnitConvert['HEIRARCHY'] ){
					break;
				}
				else{
					$multiplier *= $sel['QTY'];
				}
				
				
				$next --;
			}
			
			//console.log(multiplier)
			return floatval ($value / $multiplier);
		}
		else{
			$next = $toUnitConvert['HEIRARCHY']  ;
					
			while ( true ){
				$sel = $u[ $next ];
				
				if ( $sel['HEIRARCHY'] == $thisUnit['HEIRARCHY'] ){
					break;
				}
				else{
					$multiplier *= $sel['QTY'];
				}
				
				
				$next --;
			}
			
			//console.log(multiplier)
			
			return floatval ($value * $multiplier);
		}
}

#$reportData = json_decode($_POST['data'],true); 
#var_dump($reportData);
$itemdetails = get_item_details ( ISSET($_GET['ITEM_CODE']) ? $_GET['ITEM_CODE'] : NULL );
$datefrom = date('Y-m-d');
?>

<html>

<style>
*{
	font-family: verdana;
	font-size: 1.6vh;
}
#print{
	width:100%;
}

#print .report-title > *{
	line-height:10px;
}

table , table tr td , table tr th {
	border:1px solid black;
	border-collapse: collapse;
}

table tr td , table tr th {
	padding :0.5%;
}

table {
		width:100%;
}
</style>
<body>
<div id="print">
	<div class="report-title" align="center">
		<H2 STYLE='font-size:20px;'><?php ECHO($_SESSION['COMPANY_NAME']); ?></H2>
		<H1 STYLE='font-size:40px;'>INVENTORY MONITORING REPORT</H1>
		<!--<h2><?php echo  $reportData['datefrm']. ' - '.$reportData['dateto']; ?></h2>-->
		<H2><?php ECHO($_SESSION['BRANCH']); ?></H2>
		<H2><?php ECHO($_SESSION['ADDRESS']); ?></H2>
		<h2>As of <?php echo $datefrom; ?> </h2>
	</div>
	<br>
	<H3>
	
	</H3>
	
	<div>
		
		<table>
			<thead>
				
			
				<tr>
					
					<th>Expiry Date</th>
					<th>Expires In</th>
					<th>Remaining Balance</th>
					<th>Unit</th>
					
					
				</tr>
			</thead>
			<?php $iii = 0; foreach ($itemdetails as $v) { ?>
			<tbody>
				<?php
				
				
				
				$sql = "SELECT * FROM inventory.ITEM_IN_WAREHOUSE AS AA 
				WHERE ITEM_CODE = ? 
				 and
				ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE WHERE 
				ITEM_CODE = ? AND EXPIRY_DATE = AA.EXPIRY_DATE and IS_CANCELLED != 1)";
				$units = get_units($v["ITEM_CODE"]);
				$iii++;
				//echo $sql;
				
				$expiredItems = $registry->GET ("DB")->execute ($sql,[ $v['ITEM_CODE'] , $v['ITEM_CODE'] ],\PDO::FETCH_ASSOC)->fetchAll();
				$totalqty = 0;
				?>
				
				
				
				
				<TR>
					<th colspan='' align='left'><?php echo $iii.'.) '. $v['ITEM_NAME'] .' ('.$v['ITEM_CODE'].')';  ?></th>
					<th></th>
					<th></th>
					<th></th>
				</TR>
				
				<?php foreach ($expiredItems as $vd) { ?>
				
				
				<?php 
				
				
				//var_dump($units);
				
				$myunit_indx = array_search ( $vd["UNIT_CONVERSION_ID"],ARRAY_COLUMN(  $units,	 'UNIT_NAME' ) );
				
				$converted = convertUnit(  $vd["QUANTITY"] , $units[ $myunit_indx ]['UNIT_NAME'] , $units[ count($units) - 1 ]['UNIT_NAME'] , $units );
				
				$date1 = new \DateTime($vd['EXPIRY_DATE']);
				$date2 = new \DateTime($datefrom);
				$interval = $date1->diff($date2);
				
				?>
				
				<tr>
					<td ALIGN='RIGHT'><?php echo $vd["EXPIRY_DATE"]; ?></td>
					<td><?php echo $interval->y.' years '. $interval->m.' months '. $interval->d.' days '; ?></td>
					<td><?php echo $converted; ?></td>
					<td><?php echo  $units[ count($units) - 1 ]['UNIT_NAME']; ?></td>
				</tr>
				<?php 
				$totalqty += $converted;
				} ?>
				<?php
					$myunit_indx = array_search ( $vd["UNIT_CONVERSION_ID"],ARRAY_COLUMN(  $units,	 'UNIT_NAME' ) );
					$converted_alert_qty = convertUnit(  $v["ALERT_QTY"] , $units[ $myunit_indx ]['UNIT_NAME'] , $units[ count($units) - 1 ]['UNIT_NAME'] , $units );
				?>
				<TR style='<?php echo ( $converted_alert_qty >= $totalqty ? 'background:#ff8f8f;' : '' ) ?>'>
					<td colspan='2' ALIGN='RIGHT'><B>TOTAL</b></td>
					<td><B><?PHP echo $totalqty.( $converted_alert_qty >= $totalqty ? '<BR> <b>Critical Level</b>' : '' ); ?></b></td>
					<td><B><?php echo  $units[ count($units) - 1 ]['UNIT_NAME']; ?></b></td>
				</TR>
				
				
			</tbody>
			<?php } ?>
		</table>
		
	</div>
	
</div>
</body>
</html>

