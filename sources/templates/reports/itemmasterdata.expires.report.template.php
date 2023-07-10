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
#var_dump($itemdetails);
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
		<H1 STYLE='font-size:30px;'>ITEM EXPIRY MONITORING REPORT</H1>
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
					<th>Expired</th>
					<th>Remaining Balance</th>
					<th>Unit</th>
					
					
				</tr>
			</thead>
			<?php foreach ($itemdetails as $v) { ?>
			<tbody>
				<?php
				
				
				
				$sql23 = "SELECT * FROM inventory.ITEM_IN_WAREHOUSE AA
				WHERE ITEM_CODE = '".$v['ITEM_CODE']."' 
				AND EXPIRY_DATE BETWEEN IF(EXPIRY_DATE = '0000-00-00',NULL,'0000-00-00')
					AND CURDATE() + INTERVAL (SELECT ALERT_BEFORE_EXPIRY FROM inventory.ITEM_MASTER_DATA WHERE 
				ITEM_CODE = AA.ITEM_CODE) MONTH and
				ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE WHERE 
				ITEM_CODE = AA.ITEM_CODE AND EXPIRY_DATE = AA.EXPIRY_DATE and IS_CANCELLED != 1)";
				
				
				//echo $sql;
				
				$expiredItems = $registry->GET ("DB")->execute ( $sql23,[ null  ],\PDO::FETCH_ASSOC )->fetchAll();
				$totalqty = 0;
				//var_dump($v);
				//echo '<br>';
				?>
				
				
				
				<?php if(count($expiredItems)  > 0){ ?>
				<TR>
					<th colspan='' align='left'><?php echo $v['ITEM_NAME'] .' ('.$v['ITEM_CODE'];  ?>)</th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
				</TR>
				<?php } ?>
				
				
				<?php 
			

				foreach ($expiredItems as $vd) { ?>
				
				
				<?php 
				
				$units = get_units($vd["ITEM_CODE"]);
				
				
				$myunit_indx = array_search ( $vd["UNIT_CONVERSION_ID"],ARRAY_COLUMN(  $units,	 'UNIT_NAME' ) );
				
				$converted = convertUnit(  $vd["QUANTITY"] , $units[ $myunit_indx ]['UNIT_NAME'] , $units[ count($units) - 1 ]['UNIT_NAME'] , $units );
				
				$date1 = new \DateTime($vd['EXPIRY_DATE']);
				$date2 = new \DateTime($datefrom);
				$interval = $date1->diff($date2);
				?>
				
				<tr style='<?php  echo !$interval->invert ? 'background :#ff5959;' : ''; ?>'>
					<td ALIGN='RIGHT'><?php echo $vd["EXPIRY_DATE"]; ?></td>
					<td><?php echo $interval->y.' years '.$interval->m.' months '.$interval->d.' days <br>'; echo $interval->invert ? ' remain ':'<b> Has passed expiry date!</b>'; ?></td>
					<td><?php echo !$interval->invert ? 'Expired!' : '-'; ?></td>
					<td><?php echo $converted; ?></td>
					
					<td><B><?php echo  $units[ count($units) - 1 ]['UNIT_NAME']; ?></b></td>
				</tr>
				<?php 
				$totalqty += $converted;
				} ?>
				<?php if(count($expiredItems)  > 0){ ?>
				<TR>
					<td ></td>
					<td colspan='2' ALIGN='RIGHT'><B>TOTAL</b></td>
					<td><B><?PHP echo $totalqty; ?></b></td>
					
				</TR>
				<?php } ?>
				
			</tbody>
			<?php } ?>
		</table>
		
	</div>
	
</div>
</body>
</html>

