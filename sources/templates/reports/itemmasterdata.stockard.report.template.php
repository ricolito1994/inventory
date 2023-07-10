<?php namespace server\routes\start; ?>
<!DOCTYPE html>
<?PHP
session_start();
include_once ("../../scripts/server/routes/start.route.server.php");


function get_dept_name ( $id = 1 ){
	global $registry;
	//return $registry->GET ("DB_EMPLOYEE")->execute ('select deptname,id from department where id = ?',[ $id ],\PDO::FETCH_ASSOC)->fetch()['deptname'];
}

$reportData = json_decode($_POST['data'],true); 

#var_dump($reportData);

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
		<H1 STYLE='font-size:40px;'>ITEM STOCK CARD</H1>
		<h2><?php echo  $reportData['datefrm']. ' - '.$reportData['dateto']; ?></h2>
		<H2><?php ECHO($_SESSION['BRANCH']); ?></H2>
		<H2><?php ECHO($_SESSION['ADDRESS']); ?></H2>
		
	</div>
	<br>
	<H3>
	<?php #var_dump($reportData['itemstockobj']); 
		echo $reportData['itemstockobj'][1]['ITEM_NAME'].' - '.$reportData['itemstockobj'][1]['ITEM_CODE'];
		
		$TVAL = 0;
	?>
	</H3>
	
	<div>
		<table>
			<thead>
				<tr>
					<th>-</th>
					<th>Document</th>
					<th>Type</th>
					<th>Status</th>
					<th>Delivery/Pickup Date</th>
					<th>Customer</th>
					<th>UNIT</th>
					<th>DEAL</th>
					<th>REGULAR</th>
					<th>QTY</th>
					<th>Movement</th>
					<th>Total</th>
				</tr>
			</thead>
			<tbody>
				<?php foreach($reportData['itemstockobj'] as $v) { ?>
				<tr style="<?php if(isset($v['STATUS']) && $v['STATUS'] ==='Cancelled' )echo 'background : #ef8080'; ?>" >
					<td><?php echo isset($v['BEGBAL']) ? 'BEGGINING BALANCE':''; ?></td>
					<td><?php echo isset($v['DOC_ID']) ? $v['DOC_ID'] : ''; ?></td>
					<td><?php echo isset($v['dtype']) ? $v['dtype'] : ''; ?></td>
					<td><?php echo isset($v['STATUS']) ? $v['STATUS'] : ''; ?></td>
					<td><?php echo isset($v['DOCUMENT_DATE']) ? $v['DOCUMENT_DATE'] : ''; ?></td>
					<td><?php echo isset($v['SUPPLIER_NAME']) ? $v['SUPPLIER_NAME'] : ''; ?></td>
					<td><?php echo isset($v['UNIT_NAME__']) ? $v['UNIT_NAME__'] : ''; ?></td>
					<td><?php echo isset($v['DEAL_']) ? $v['DEAL_'] : ''; ?></td>
					<td><?php echo isset($v['REGULAR']) ? $v['REGULAR'] : ''; ?></td>
					<td><?php echo isset($v['QUANTITY']) ? $v['QUANTITY'] : ''; ?></td>
					<td><?php echo isset($v['STOCK_IN_OUT']) ? $v['STOCK_IN_OUT']==1?'IN ( + )':'OUT ( - )' : ''; ?></td>
					<td><?php echo isset($v['TQUANTITY']) ? $v['TQUANTITY'] : ''; ?></td>
				</tr>
				<?php 
					IF(ISSET($v['STATUS']) && $v['STATUS']!=='Cancelled') $TVAL = $v['TQUANTITY'];
				
				} ?>
				<tr>
					<td colspan='11' align='right'><b><?php echo 'REMAINING BALANCE'; ?></b></td>
					<td><b><?php echo $TVAL.' '.$reportData['itemstockobj'][COUNT($reportData['itemstockobj'])-1]['UNIT_NAME__']; ?></b></td>
				</tr>
			</tbody>
		</table>
	</div>
	
</div>
</body>
</html>

