import { Controller } from "../classes/controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";

export class DashboardController extends Controller{
	
	constructor ( controller , service , elem ){
		super ( controller , service , elem );
		
		/* let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'check_url_multi',
					filenames : [
						
						"sources/images/prof.jpg",
					]
																				
				}
															
			}
		};
		this.mainService.serverRequest( request , ( res ) => {
			//resolve (res);
			//console.log(res);
			console.log(document.querySelector('#dashboard-profpic'));
			document.querySelector('#dashboard-profpic').src = res;								
		},
		(err) => {
			//reject ( err );
		} ); */
		
		this[controller] = { 
			fullname : session_data.FIRSTNAME +' '+session_data.LASTNAME,
			position : session_data.POSITION,
			designation : session_data.DESIGNATION,
			datetoday : this.mainService.getCurrentDate(),
			timern : '',
			transactions : 0,
			noitems : 0,
			expireditems : 0,
			alertqty : 0,
		};	
		
		
		this.mainService.getCurrentTimeTick(()=>{
			//console.log(this.mainService.time());
			this[controller] .timern = this.mainService.time();
			//this.latestActivity(this.mainService.time()	);
			this.bindChildObject(this,false);
		});
		
		//console.log("AA");
		
		
	
		
		this.initialize();
		setTimeout(()=>{
			this.binds (controller,elem);
			this.bindChildObject(this,false);
		},500);
	}
	
	
	initWidgets(){
		//alert("WEW");
		let critlevel =  " and i.ALERT_QTY >= iiw.TOTAL_QUANTITY";
		
		
		let expr  = " and ( SELECT SUM(QUANTITY) FROM inventory.ITEM_IN_WAREHOUSE AS AA WHERE ITEM_CODE = i.ITEM_CODE AND EXPIRY_DATE BETWEEN IF(EXPIRY_DATE = '0000-00-00',NULL,'0000-00-00') AND CURDATE() + INTERVAL 1 MONTH and ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE WHERE ITEM_CODE = iiw.ITEM_CODE AND EXPIRY_DATE = AA.EXPIRY_DATE ) )  IS NOT NULL ";
		
		//console.log(critlevel);
		
		let uu = 'u.HEIRARCHY = (SELECT MAX(HEIRARCHY) FROM inventory.unit WHERE ITEM_CODE = i.ITEM_CODE)';
		
		//let uu =  'u.HEIRARCHY = 0';
		
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						/* {
							
							sql : "SELECT COUNT(iiw.ID) AS cnt_critlvl,u.UNIT_NAME as UN,iiw.TOTAL_QUANTITY AS T,IF(i.ALERT_QTY >= iiw.TOTAL_QUANTITY,'1','0') AS lvl_qty "+
								  
								  "FROM inventory.item_master_data i INNER JOIN inventory.supplier s ON s.SUPPLIER_CODE = i.SUPPLIER_CODE "+
								  "INNER JOIN inventory.unit u ON u.ITEM_CODE = i.ITEM_CODE "+
								  "INNER JOIN inventory.item_in_warehouse iiw ON iiw.ITEM_CODE = i.ITEM_CODE "+
								  "WHERE iiw.ID=(SELECT max(ID) FROM inventory.item_in_warehouse where ITEM_CODE=i.ITEM_CODE ) AND item_name like ?  "+
								  
								 " "+critlevel+" and "+uu+" ORDER BY   lvl_qty desc",
							db : 'DB',
							query_request : 'GET',
							index : 'critlevel',
							values : [
								'%%' 
							]
						},	 */
						/* {
							
							sql : "SELECT *,u.UNIT_NAME as UN,iiw.TOTAL_QUANTITY AS T,IF(i.ALERT_QTY >= iiw.TOTAL_QUANTITY,'1','0') AS lvl_qty "+
								  ", ( SELECT SUM(QUANTITY) FROM inventory.ITEM_IN_WAREHOUSE AS AA WHERE ITEM_CODE = i.ITEM_CODE AND EXPIRY_DATE BETWEEN IF(EXPIRY_DATE = '0000-00-00',NULL,'0000-00-00') AND CURDATE() + INTERVAL i.ALERT_BEFORE_EXPIRY MONTH and ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE WHERE ITEM_CODE = iiw.ITEM_CODE AND EXPIRY_DATE = AA.EXPIRY_DATE ) ) "+
								  " AS AAA "+
								  "FROM inventory.item_master_data i INNER JOIN inventory.supplier s ON s.SUPPLIER_CODE = i.SUPPLIER_CODE "+
								  "INNER JOIN inventory.unit u ON u.ITEM_CODE = i.ITEM_CODE "+
								  "INNER JOIN inventory.item_in_warehouse iiw ON iiw.ITEM_CODE = i.ITEM_CODE "+
								  "WHERE iiw.ID=(SELECT max(ID) FROM inventory.item_in_warehouse where ITEM_CODE=i.ITEM_CODE ) AND item_name like ?  "+
								  
								  expr+" and "+uu+" ORDER BY   AAA desc , lvl_qty desc",
							db : 'DB',
							query_request : 'GET',
							index : 'expr',
							values : [
								'%%' 
							]
						},	 */
						{
							sql : "SELECT COUNT(ID) AS cnt_items FROM inventory.item_master_data ",
							db : 'DB',
							query_request : 'GET',
							index : 'items',
							values : [
								'%%' 
							]
							
						},
						{
							sql : "SELECT count(ID) AS cnt_trans FROM inventory.alter_document WHERE DOCUMENT_DATE = ? ",
							db : 'DB',
							query_request : 'GET',
							index : 'transactions',
							values : [
								this.dashboard.datetoday, 
							]
							
						},
						/* {
							sql : "SELECT * FROM inventory.latest_activity la INNER JOIN inventory.user_setup us ON us.ID = la.POSTED_BY WHERE la.DATE = ? ORDER BY la.TIME ASC ",
							db : 'DB',
							query_request : 'GET',
							index : 'latest_activity',
							values : [
								this.dashboard.datetoday, 
							]
							
						}, */
						{
							sql : `SELECT si.CANCELLED_BY,si.DATE_TRANSACTION,si.ORNO,imd.ITEM_IMAGE,imd.ITEM_NAME,imd.ITEM_CODE,im.QUANTITY,im.TOTAL_PRICE,u.UNIT_NAME 

							FROM inventory.sales_invoice si 
									INNER JOIN item_details im ON im.DOC_ID = si.ORNO
									INNER JOIN item_master_data imd ON imd.ITEM_CODE = im.ITEM_CODE 
									INNER JOIN unit u ON u.UNIT_CONVERSION_ID = imd.UNIT_CONVERSION_ID 
									WHERE si.CANCELLED_BY = '' ORDER BY si.DATE_TRANSACTION desc`,
							db : 'DB',
							query_request : 'GET',
							index : 'sales_performance',
							values : ['']
						}
					]
				}
						
			}
		};
			console.log(request);
			let load = new LoadingModal ({
				modalID :  "loading-modal-load",
				controllerName : "loadingmodal",
				template : "/inventory/sources/templates/modal/loading.modal.template.html",
				parent : this,
			});
			
			//load.render();
		
		this.mainService.serverRequest( request , async ( res ) => {
			let result = JSON.parse(res);
			console.log('re123',result);
			
			this.sales_performance = result.sales_performance;
			//this.dashboard.expireditems = result.expr.length;
			//this.dashboard.alertqty = result.critlevel[0].cnt_critlvl;
			this.dashboard.noitems = result.items[0].cnt_items >= 10000 ? `${result.items[0].cnt_items/10000}k` : result.items[0].cnt_items;
			this.dashboard.transactions = result.transactions[0].cnt_trans;
			//load.onClose();
			
			let perf_arr_qty = {};
			let arr_sales_perf = [];
			let arr_sales_perv = [];
			//console.log(result);
			for (let p in this.sales_performance){
				let sel = this.sales_performance[p];
				let unit = await this.getUnit(sel.ITEM_CODE);
				let uu = parseFloat(this.convertUnits4(sel.QUANTITY,sel.UNIT_NAME,unit[unit.length-1].UNIT_NAME,unit));
				
				if (perf_arr_qty[sel.ITEM_CODE]){
					perf_arr_qty[sel.ITEM_CODE].SALES_QTY += uu;
					perf_arr_qty[sel.ITEM_CODE].SALES_AMT += parseFloat(sel.TOTAL_PRICE);
					
					//let indx = arr_sales_perf.findIndex ( x => x.DET.ITEM_CODE == sel.ITEM_CODE );
					
					//arr_sales_perf[indx] = perf_arr_qty[sel.ITEM_CODE];
					//arr_sales_perf.push(perf_arr_qty[sel.ITEM_CODE])
					//arr_sales_perf.push(perf_arr_qty[sel.ITEM_CODE])
				}
				else{
					perf_arr_qty[sel.ITEM_CODE]  = {
						SALES_AMT : parseFloat(sel.TOTAL_PRICE),
						SALES_QTY : uu,
						DET : sel,
						UNIT : unit[unit.length-1].UNIT_NAME,
						CURRENCY : '',
					};
					
					
				}
				
			
			}
			
			for (let i in perf_arr_qty ){
				arr_sales_perf.push(perf_arr_qty[i]);
				arr_sales_perv.push(perf_arr_qty[i]);
			}
			
			
			//let sales_amt = (arr_sales_perf.sort((a,b) => (a.SALES_AMT > b.SALES_AMT) ? 1 : ((b.SALES_AMT > a.SALES_AMT) ? -1 : 0)));
			//let sales_qty = (arr_sales_perf.sort((a,b) => (a.SALES_QTY > b.SALES_QTY) ? 1 : ((b.SALES_QTY > a.SALES_QTY) ? -1 : 0)));
			
			let sales_amt = arr_sales_perf.sort( ( a , b ) => {
				let keyA = a.SALES_AMT;
				let keyB = b.SALES_AMT;
				if (keyA < keyB) return 1;
				if (keyA > keyB) return -1;
				return 0;
			});
			
		
			
			let sales_qty = arr_sales_perv.sort( ( a , b ) => {
				let keyA = a.SALES_QTY;
				let keyB = b.SALES_QTY;
				if (keyA < keyB) return 1;
				if (keyA > keyB) return -1;
				return 0;
			});
			
			
			
			this.salesperformance(sales_qty,"top-5-quantity" , "SALES_QTY" , "UNIT" )
			
			this.salesperformance(sales_amt,"top-5-amount" , "SALES_AMT" , "CURRENCY" )
			
			this.latestActivity({ index : 0 , offset : 5 });
			//load.onClose();
		},err=>{
			console.log(err);
		});
		
	}
	
	
	salesperformance( arr , div , indx , AA ){
		for ( let i in arr ){
			let sel = arr[i];
			
			let itmimg = sel.DET.ITEM_IMAGE == '' ? 'sources/images/item.png' : `${sel.DET.ITEM_IMAGE}`;
			
			let html = `<div class='row'>
									<div class='col-md-2'>
										<img  src='${itmimg}' style='width:80%;border-radius: 50%; border: 1px solid #ccc;'/>
									</div>
									<div class='col-md-7'><h5>${sel.DET.ITEM_NAME}</h5></div>
									<div class='col-md-3'>${sel[indx]} ${sel[AA]}</div>
								</div>
								<br>`;
			document.getElementById(div).insertAdjacentHTML( 'beforeend' , html );
		}
	}
	
	getUnit(id){
		return new Promise ( ( resolve , reject ) => {
			let request = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							
							{
								sql : `SELECT * FROM  unit WHERE ITEM_CODE = ?`,
								query_request : 'GET',
								index : 'unit',
								values : [
									id
								]
							}
						]
					}
							
				}
			};
			this.mainService.serverRequest( request , ( res ) => {
				resolve(JSON.parse(res)['unit']);
			})
		});
	}
	
	
	convertUnits4 ( value , currentUnit, toUnit ,units){
		let u = units;
		let thisUnit = u[u.findIndex ( x => x.UNIT_NAME == currentUnit )];
		let toUnitConvert = u[u.findIndex ( x => x.UNIT_NAME == toUnit )];
		let multiplier = 1;
		//console.log( value,currentUnit, toUnit,'->',toUnitConvert['HEIRARCHY'] ,'<' , currentUnit,'->',thisUnit['HEIRARCHY'] )
		
		if (currentUnit == toUnit){
			return value;
		}
		
		else if ( toUnitConvert['HEIRARCHY'] < thisUnit['HEIRARCHY']  ){
			let next = thisUnit['HEIRARCHY']  ;
					
			while ( true ){
				let sel = u[ next ];
				
				if ( sel.HEIRARCHY == toUnitConvert.HEIRARCHY ){
					break;
				}
				else{
					multiplier *= sel.QTY;
				}
				
				
				next --;
			}
			
			//console.log(multiplier)
			return parseFloat (value / multiplier);
		}
		else{
			let next = toUnitConvert['HEIRARCHY']  ;
					
			while ( true ){
				let sel = u[ next ];
				
				if ( sel.HEIRARCHY == thisUnit.HEIRARCHY ){
					break;
				}
				else{
					multiplier *= sel.QTY;
				}
				
				
				next --;
			}
			
			//console.log(multiplier)
			
			return parseFloat (value * multiplier);
		}
	}
	
	salesPerformance ( ){
		
	}
	
	
	latestActivity( args ){
		//console.log(args);
		args.index = parseFloat(args.index);
		args.offset = parseFloat(args.offset);
		
		
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT *,la.ID IDD FROM inventory.latest_activity la INNER JOIN inventory.user_setup us ON us.ID = la.POSTED_BY  ORDER BY la.ID desc limit ${args.index},${args.offset}`,
							db : 'DB',
							query_request : 'GET',
							index : 'latest_activity',
							values : [
								//this.dashboard.datetoday, 	
								''
							]
							
						},
					]
				}
						
			}
		};
		
		//if (currentTimeTick)
		//request.data.data.REQUEST_QUERY[0].values.push (currentTimeTick);
		
		this.mainService.serverRequest( request , ( res ) => {
			let result = JSON.parse(res);
			let cardevent = "";
			console.log(result);
			for ( let i in result.latest_activity ){
				let sel = result.latest_activity [i];
				
				 cardevent =  "<div class='card' style='width:100%;padding:0;margin-bottom:2%;'>"+
							  
							'<div class="card-body" style="width:100%;">'+
								
								"<div style='width:100%;'>"+
									
									"<div style='width:10%;float:left;'>"+
									
										"<img src='sources/images/prof.jpg' style='width:100%;border-radius:50%;'/>"+
									"</div>"+
									
									"<div style='width:90%;padding-left:12%;'>"+
										'<div style="font-size:2vh;font-weight:bold;">'+sel.FIRSTNAME+' '+sel.LASTNAME+'</div>'+
										'<div style="font-size:1.5vh;">'+sel.DATE+' '+sel.TIME+'</div>'+
									'</div>'+
									
								'</div>'+
								
								"<div style='width:100%;margin-top:2%; font-size:1.5vh; text-align:justify;'>"+
									
									sel.MESSAGE+
									
								"</div>"+
								
								"</div>"
							
							
							
							
						"</div>"+
						"";
						
				
						
				document.getElementById('notifspanedashboard').insertAdjacentHTML( 'beforeend' , cardevent );
				if (args.seemore)
				$(`#seemore${args.index}`).remove();
				
				if ( i == 4 ){
					
					args.index += args.offset;
					
					let seemore = `<div class='card' id="seemore${args.index}" data-event="dashboard.click.latestActivity" data-params='{"index":"${args.index}","offset":"${args.offset}","seemore":"true"}' style='width:100%;padding:0;margin-bottom:2%;'>`+
							  
							"SEE MORE"
							
						"</div>"+
						"";
					
					document.getElementById('notifspanedashboard').insertAdjacentHTML( 'beforeend' , seemore );
				}

				;
						
			}
			
			if (args.seemore){
				
				this.binds (this.controller,this.elem);
				this.bindChildObject(this,false);
			}
			
			//$('#notifspanedashboard').html(cardevent);
			
			/* if (currentTimeTick){
				setTimeout(()=>{
					this.binds (controller,elem);
					this.bindChildObject(this,false);
				},100);
			} */
			
		});
	}
	
	viewreceipt ( ...args ){
		let orno = args[0].orno;
		//alert("WEW");
		//console.log(args);
		this.mainService.openPopupWindow("POST" , '/sales/sources/templates/reports/receipt.report.template.php',{
			data : {
				orno : orno		
			},
		});
	}
	
	
	initialize(){
		//this.initWidgets();	
	}
	
	
	
	
	report ( args ){

	}
	
	
	
}