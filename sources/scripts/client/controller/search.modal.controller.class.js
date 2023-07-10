import { Modal } from "../classes/modal.controller.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { MainService } from "../classes/main.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";


export class SearchModal extends Modal{
	
	constructor ( modalData ){
		super ( modalData );
		this.fds = { gds:"" };
		this.modalData = modalData;
		this.searchParams = this.modalData.params;

		this.fieldsDataTable = {
			"supplier" :{
				"search_param" : [
					{
						value : "",
						placeholder : "%_placeholder_%",
					}
				],
				"search_dom" : [
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : 'row col-md-7',
							},
							{
								attribute : 'id',
								value : 'dttablefilter',
							},
							
						],
						children : [
								{
									createElement : 'div',
									attributes : [
										{
											attribute : 'className',
											value : "col-sm-12",
										}
									],
									children : [
										{
											createElement : 'input',
											attributes : [
												{
													attribute : 'type',
													value : 'text',
												},
												{
													attribute : 'className',
													value : 'form-control',
												},
												{
													attribute : 'placeholder',
													value : 'Search here...',
												},
												{
													attribute : 'valuectrl',
													type : 'dataset',
													
													value : 'fieldsDataTable.supplier.search_param.0.value',
												},
												{
													attribute : 'keyup',
													type : 'event',
													value : ( )=> {
														this.changefilter("request");
													},
												}
												
											],
										}
									],
								}
						],
					},
					
						
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : "row col-md-5 action-buttons",
							}
						],
						children : [
							{
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-warning',
									},			
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-refresh"></i> Refresh Table'
											}
										]
									}
								]
							}
						],
					}
						
					
				],
				"fields" : 
				[
					{
						head : "Supplier",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['SUPPLIER_NAME'];
										},
									}
								]
							}
						]
					},
					{
						head : "Code",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['SUPPLIER_CODE'];
										},
									}
								]
							}
						]
					},
					{
						head : "Address",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['SUPPLIER_ADDRESS'];
										},
									}
								]
							}
						]
					},
					{
						head : "Actions",
						elements : [
							{	
								createElement : "a",
								attributes : [
									{
										attribute: "href",
										value : "javascript:void(0);",
									},
									{
										attribute: "className",
										value : "btn btn-success",
									},
									{
										type : "event",
										attribute : "click",
										value : ( arg ) => {
											//console.log ( this.searchParams , arg );
											let actions = {
												
												link : ( ) => {

													MainService.EventObject[this.params.controller].dispatch (this.params.controller+this.params.evt , {
														detail : {
															query : {
																arg : arg['SUPPLIER_NAME'],
																id : arg['SUPPLIER_CODE'],
																context : this.parent,
															}
														} 
													});
													this.onClose();
												}
											};
											
											//console.log(this.params.action);
											actions [ this.params.action ]( );

										},
									}
								],
								children : [
									{
										createElement : "i",
										attributes : [
											{
												attribute: "className",
												value : "icon-plus",
											}
										]
									}
								]
							},
							
						]
					},
				],
				request : {
					type: "POST",
					url : this.mainService.urls["generic"].url,
					data : {
						data : {
							request : 'generic',
							REQUEST_QUERY : [
								{
									sql : "SELECT * FROM inventory.supplier WHERE SUPPLIER_NAME LIKE ?",
									query_request : 'GET',
									index : 'result',
									values : ['%%']
								},
							]
						}
					}		
				}
			},


			"itemmasterdata" :{
				"search_param" : [
					{
						value : "",
						placeholder : "%_placeholder_%",
					}
				],
				"search_dom" : [
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : 'row col-md-7',
							},
							{
								attribute : 'id',
								value : 'dttablefilter',
							},
							
						],
						children : [
								{
									createElement : 'div',
									attributes : [
										{
											attribute : 'className',
											value : "col-sm-12",
										}
									],
									children : [
										{
											createElement : 'input',
											attributes : [
												{
													attribute : 'type',
													value : 'text',
												},
												{
													attribute : 'className',
													value : 'form-control',
												},
												{
													attribute : 'placeholder',
													value : 'Search here...',
												},
												{
													attribute : 'valuectrl',
													type : 'dataset',
													// lain pa na da sa imo nga version instead if itemmasterdata , supplier pa na da
													// fieldsDataTable.supplier.search_param.0.value'
													value : 'fieldsDataTable.itemmasterdata.search_param.0.value',
													// copy lang ang code sa line 298 thanks :-) then save ctrl s then shift f5 heheh
												},
												{
													attribute : 'change',
													type : 'event',
													value : ( )=> {
														//alert("WEW");
														this.changefilter("request_2");
													},
												}
												
											],
										}
									],
								}
						],
					},
					
						
					{
						createElement : 'div',
						attributes : [
							{
								attribute : 'className',
								value : "row col-md-5 action-buttons",
							}
						],
						children : [
							{
								createElement : 'button',
								attributes : [			
									{
										attribute : 'className',
										value : 'btn btn-warning',
									},			
								],
								children : [
									{
										createElement : 'b',
										attributes : [
											{
												attribute : 'innerHTML',
												value : '<i class="icon-refresh"></i> All Items'
											},
											{
													attribute : 'click',
													type : 'event',
													value : ( )=> {
														//alert("WEW");
														this.changefilter("request");
													},
												}
										]
									}
								]
							}
						],
					}
						
					
				],
				"fields" : 
				[
					{
						head : "ITEM",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['ITEM_NAME'];
										},
									}
								]
							}
						]
					},
					{
						head : "In Stock",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											let iexp = (parseInt(selData['T'])+1 == Math.round(selData['T']) ? Math.round(selData['T']) : parseInt(selData['T']));
											return iexp;
										},
									}
								]
							}
						]
					},
					{
						head : "Expired in Stock",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerHTML",
										value : ( selData ) => {
											//let iexp = (parseInt(selData['AAA'])+1 == Math.round(selData['AAA']) ? Math.round(selData['AAA']) : parseInt(selData['AAA']));
											//return iexp> 0 ? "<span style='color:red;font-weight:bold;'><i class='icon-warning-sign' ></i> "+iexp+' </span>' :0;
											
											return new Promise ( ( resolve , reject ) => {
												let sql = `SELECT SUM(QUANTITY) as QQTY FROM inventory.ITEM_IN_WAREHOUSE AS AA 
													WHERE ITEM_CODE = ? AND EXPIRY_DATE BETWEEN 
													IF(EXPIRY_DATE = '0000-00-00',NULL,'0000-00-00') AND CURDATE() + INTERVAL ?
													MONTH and ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE 
													WHERE ITEM_CODE = ? AND EXPIRY_DATE = AA.EXPIRY_DATE )`
												let dataQuery = {
													type: "POST",
													url : this.mainService.urls["generic"].url,
													data : {
														data : {
															request : 'generic',
															REQUEST_QUERY : [
																{
																	
																	sql :sql,
																	db : 'DB',
																	query_request : 'GET',
																	index : 'aaa',
																	values : [
																		selData.IC,
																		selData.ALERT_BEFORE_EXPIRY,
																		selData.IC
																	]
																},	
															]
														}
														//report expiry details sql
														//SELECT * FROM inventory.ITEM_IN_WAREHOUSE AS AA WHERE ITEM_CODE = 'ITEM1637676113' AND EXPIRY_DATE BETWEEN IF(EXPIRY_DATE = '0000-00-00',NULL,'0000-00-00') AND CURDATE() + INTERVAL 1 MONTH and ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE WHERE ITEM_CODE = 'ITEM1637676113' AND EXPIRY_DATE = AA.EXPIRY_DATE and IS_CANCELLED != 1)		
													}
												}
												
												this.mainService.serverRequest( dataQuery , ( res ) => {
													//console.log(JSON.parse(res));
													let sdata = JSON.parse(res).aaa[0].QQTY;
													let iexp = (parseInt(sdata)+1 == Math.round(sdata) ? Math.round(sdata) : parseInt(sdata));
											        let ee = iexp > 0 ? "<span style='color:red;font-weight:bold;'><i class='icon-warning-sign' ></i> "+iexp+' </span>' :0;
													resolve (ee);
												} 
												, ( res ) => {
													//err
													console.log(res);
												});	
												
											});
										},
									}
								]
							}
						]
					},
					{
						head : "Unit",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerText",
										value : ( selData ) => {
											return selData['UNIT_NAME'];
										},
									}
								]
							}
						]
					},
					{
						head : "Status",
						elements : [
							{
								createElement : "b",
								attributes : [
									{
										attribute : "innerHTML",
										value : ( selData ) => {
											//return selData['UNIT_NAME'];
											let html1 = "<span style='color:green;font-weight:bold;'><i class='icon-thumbs-up' ></i> Normal Level</span>";
											let html2 = "<span style='color:red;font-weight:bold;'><i class='icon-warning-sign' ></i> Needs Restock</span>";
											return selData.lvl_qty == 0 ? html1 : html2;
										},
									}
								]
							}
						]
					},
					{
						head : "Actions",
						elements : [
							{	
								createElement : "a",
								attributes : [
									{
										attribute: "href",
										value : "javascript:void(0);",
									},
									{
										attribute: "className",
										value : "btn btn-success",
									},
									{
										type : "event",
										attribute : "click",
										value : ( arg ) => {
											//console.log ( this.searchParams , arg );
											
											let actions = {
												
												link : ( ) => {
													//console.log(this.params);
													MainService.EventObject[this.params.controller].dispatch (this.params.controller+this.params.evt , {
														detail : {
															query : {
																arg : arg,
																context : this.parent,
																args : (this.params.arg) ? this.params : false
															}
														}  
													});
													this.onClose();
												}
											};
											
											//console.log(this.params.action);
											actions [ this.params.action ]( );

										},
									}
								],
								children : [
									{
										createElement : "i",
										attributes : [
											{
												attribute: "className",
												value : "icon-plus",
											}
										]
									}
								]
							},
							
						]
					},
				],
				request : {
					type: "POST",
					url : this.mainService.urls["generic"].url,
					data : {
						data : {
							request : 'generic',
							REQUEST_QUERY : [
								{
									/* sql : "SELECT *,IF(imd.ALERT_QTY >= iiw.TOTAL_QUANTITY,'1','0') AS lvl_qty FROM inventory.item_master_data imd INNER JOIN inventory.item_in_warehouse iiw ON iiw.ITEM_CODE = imd.ITEM_CODE "+
										  "INNER JOIN inventory.unit u ON u.ITEM_CODE = imd.ITEM_CODE "+
										  "WHERE imd.ITEM_NAME LIKE ? AND "+
										  "iiw.ID = ( SELECT max(ID) FROM inventory.item_in_warehouse WHERE ITEM_CODE = imd.ITEM_CODE ) GROUP BY imd.ITEM_CODE order by lvl_qty ", */
									sql : "SELECT i.ITEM_CODE AS IC , i.ALERT_BEFORE_EXPIRY,i.ITEM_NAME, i.ITEM_IMAGE, u.*,i.SUPPLIER_CODE AS SUPPLIER_CODE,u.UNIT_NAME as UN,iiw.TOTAL_QUANTITY AS T,IF(i.ALERT_QTY >= iiw.TOTAL_QUANTITY,'1','0') AS lvl_qty "+
								  //", ( SELECT SUM(QUANTITY) FROM inventory.ITEM_IN_WAREHOUSE AS AA WHERE ITEM_CODE = i.ITEM_CODE AND EXPIRY_DATE BETWEEN IF(EXPIRY_DATE = '0000-00-00',NULL,'0000-00-00') AND CURDATE() + INTERVAL i.ALERT_BEFORE_EXPIRY MONTH and ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE WHERE ITEM_CODE = iiw.ITEM_CODE AND EXPIRY_DATE = AA.EXPIRY_DATE ) ) "+
								 // ",123 AS AAA "+
								  "FROM inventory.item_master_data i INNER JOIN inventory.supplier s ON s.SUPPLIER_CODE = i.SUPPLIER_CODE "+
								  "INNER JOIN inventory.unit u ON u.ITEM_CODE = i.ITEM_CODE "+
								  "INNER JOIN inventory.item_in_warehouse iiw ON iiw.ITEM_CODE = i.ITEM_CODE "+
								 
								  " WHERE iiw.ID=(SELECT max(ID) FROM inventory.item_in_warehouse where ITEM_CODE=i.ITEM_CODE and IS_CANCELLED != 1 ) AND item_name like ?"+
								    " AND  i.ID >= (SELECT MIN(ID) from inventory.item_master_data) AND i.ID <= (SELECT MIN(ID)+10 from inventory.item_master_data)   "+
								    "  "+" "+
									" and "
									+" u.HEIRARCHY = 0  "+
									" GROUP BY u.ITEM_CODE ORDER BY   lvl_qty desc ",
									query_request : 'GET',
									index : 'result',
									values : ['%%']
								},
							]
						}
					}		
				},
				request_2 : {
					type: "POST",
					url : this.mainService.urls["generic"].url,
					data : {
						data : {
							request : 'generic',
							REQUEST_QUERY : [
								{
									/* sql : "SELECT *,IF(imd.ALERT_QTY >= iiw.TOTAL_QUANTITY,'1','0') AS lvl_qty FROM inventory.item_master_data imd INNER JOIN inventory.item_in_warehouse iiw ON iiw.ITEM_CODE = imd.ITEM_CODE "+
										  "INNER JOIN inventory.unit u ON u.ITEM_CODE = imd.ITEM_CODE "+
										  "WHERE imd.ITEM_NAME LIKE ? AND "+
										  "iiw.ID = ( SELECT max(ID) FROM inventory.item_in_warehouse WHERE ITEM_CODE = imd.ITEM_CODE ) GROUP BY imd.ITEM_CODE order by lvl_qty ", */
									sql : "SELECT i.ITEM_CODE AS IC , i.ALERT_BEFORE_EXPIRY,i.ITEM_NAME, i.ITEM_IMAGE, u.*,i.SUPPLIER_CODE AS SUPPLIER_CODE,u.UNIT_NAME as UN,iiw.TOTAL_QUANTITY AS T,IF(i.ALERT_QTY >= iiw.TOTAL_QUANTITY,'1','0') AS lvl_qty "+
								  //", ( SELECT SUM(QUANTITY) FROM inventory.ITEM_IN_WAREHOUSE AS AA WHERE ITEM_CODE = i.ITEM_CODE AND EXPIRY_DATE BETWEEN IF(EXPIRY_DATE = '0000-00-00',NULL,'0000-00-00') AND CURDATE() + INTERVAL i.ALERT_BEFORE_EXPIRY MONTH and ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE WHERE ITEM_CODE = iiw.ITEM_CODE AND EXPIRY_DATE = AA.EXPIRY_DATE ) ) "+
								 // ",123 AS AAA "+
								  "FROM inventory.item_master_data i INNER JOIN inventory.supplier s ON s.SUPPLIER_CODE = i.SUPPLIER_CODE "+
								  "INNER JOIN inventory.unit u ON u.ITEM_CODE = i.ITEM_CODE "+
								  "INNER JOIN inventory.item_in_warehouse iiw ON iiw.ITEM_CODE = i.ITEM_CODE "+
								 
								  " WHERE iiw.ID=(SELECT max(ID) FROM inventory.item_in_warehouse where ITEM_CODE=i.ITEM_CODE and IS_CANCELLED != 1 ) AND item_name like ?"+
								  //  " AND  i.ID >= (SELECT MIN(ID) from inventory.item_master_data) AND i.ID <= (SELECT MIN(ID)+10 from inventory.item_master_data)   "+
								    "  "+" "+
									" and "
									+" u.HEIRARCHY = 0  "+
									" GROUP BY u.ITEM_CODE ORDER BY   lvl_qty desc ",
									query_request : 'GET',
									index : 'result',
									values : ['%%']
								},
							]
						}
					}		
				}
			},

			
		}
	}
	
	addItemTeacher(  ){
		
	}
	
	
	addItemSubject( arg ){
		
	}
	
	onCloseSearchModal(){
		this.onClose();
	}
	
	
	init ( request ){
		let search_params = this.fieldsDataTable[ this.params.type ][ "search_param" ];
		let dataQuery = this.fieldsDataTable[ this.params.type ][ request ];
		let dq = dataQuery.data.data.REQUEST_QUERY[0].values;	
		//dataQuery.data.data.REQUEST_QUERY[0].values[0] = '%'+this.fds.gds+'%';
		let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : "/inventory/sources/templates/modal/loading.modal.template.html",
			parent : this,
		});
		
		load.render();
		for (let i in dq){
			/* let sel = search_params[i];
			let sel2 = this.fieldsDataTable[ this.params.type ][ "search_additional" ][i];
			
			if ( sel2.includes("_placeholder_") ){
				sel = sel2.replace ("_placeholder_" , sel);
			}
			
			dataQuery.data.data.REQUEST_QUERY[0].values.push(sel); */
			//let sel = dq[i];
			//let sel2 = search_params[i];
			let search = search_params[i];
			
			if ( search.placeholder.includes("_placeholder_") ){
				dataQuery.data.data.REQUEST_QUERY[0].values[i] = search.placeholder.replace( '_placeholder_' , search.value );
			}
			else{
				dataQuery.data.data.REQUEST_QUERY[0].values[i] = search.value;
			}
			
		}
		
		//console.log(dataQuery);
		
		
		this.mainService.serverRequest( dataQuery , ( res ) => {
			
			setTimeout( ( ) => {
				let stds = (JSON.parse(res))['result'];
				
				let d = stds.length >= 130 ? 130 : Math.round( stds.length / 1 );
				
				this.dataTable.setTableData(stds);
				
				this.dataTable.setPaginateCtr(d);
				this.dataTable.construct();
				load.onClose();
			
			},100);
		} 
		, ( res ) => {
			//err
			console.log(res);
		});	
	}
	
	changefilter( request ){
		this.bindChildObject(this,this.elem);
		this.init(request);
	}
	
	constructs(){
		
		this.mainService.children(this.fieldsDataTable[ this.params.type ][ "search_dom" ],document.querySelector("#modal-search-pane") ,{});
		
		this.dataTable = new DataTableService({
			template : "/inventory/sources/templates/section/datatable.table.section.template.html",
			controller : this,
			controllername : "",
			tableID : "dttable",
			service : this.mainService,
			parentDiv : "#searchtablemodal",
			filterElems : [],
			fields : this.fieldsDataTable[ this.params.type ][ "fields" ],
		});
		this.init ("request");
	}
}