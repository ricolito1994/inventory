import { Controller } from "../classes/controller.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { ItemMasterDataMainModal } from "./itemmasterdata.main.modal.controller.class.js";

export class ItemMasterDataController extends Controller{
	
	constructor ( controller , service , elem ){
		super ( controller , service , elem );
		
		this[controller] = { 
			itemname : '',
			suppliername : '',
			supplierid : '%%',
			critlevel : "",
			bunit : 'bu',
			expired : '',
			category : 1,
			price : 0,
			supplier : '',
			supplierId : '',
		};	

		
		//this.displayCategory();
		
		for (let i in this.itemmasterdata) {
			let searchItem = localStorage.getItem(i);
			if (!searchItem) {
				localStorage.setItem(i, this.itemmasterdata[i]);
			} else {
				this[controller][i] = searchItem;
			}
		}
		
		this.x2js = new X2JS();
		

		this.dataTable = new DataTableService({
			template : "/inventory/sources/templates/section/datatable.template.section.html",
			controller : this,
			controllername : controller,
			tableID : "dttable",
			service : this.mainService,
			parentDiv : ".item-masterdata-table",
			filterElems : [],
			fields : [
				{
					head : "IMAGE",
					elements : [
						{
							createElement : "img",
							attributes : [
								{
									attribute : "src",
									value : ( selData ) => {
										if (selData['ITEM_IMAGE']=='')
										return '/inventory/sources/images/item.png';
										else
										return  `${selData['ITEM_IMAGE']}`;
									},
								},
								{
									attribute : "style",
									value : ( selData ) => {
										
										return "width:20%;border:1px solid #ccc;";
									},
								}
								
							]
						}
					]
				},
				{
					head : "ITEM NAME",
					sort : {
						asc : ['ITEM_NAME'],
						dsc : ['-ITEM_NAME'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "b",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										
										return `${selData['ITEM_NAME']}`;
									},
								}
							]
						}
					]
				},
				
				
				{
					head : "PRICE",
					sort : {
						asc : ['price'],
						dsc : ['-price'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['price'];
									},
								}
							]
						}
					]
				}, 
				/*{
					head : "QUANTITY",
					sort : {
						asc : ['TOTAL_QUANTITY'],
						dsc : ['-TOTAL_QUANTITY'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										
										return new Promise (( resolve , reject ) => {
											selData['UNIT_NAME'] = selData['UN'] ;
											//selData['TOTAL_QUANTITY'] = selData.T;
											//console.log(selData);
											this.convertUnits ( selData , true ,'T' ).then ( async  (res) => {
												//console.log('>',res);
												await resolve ( parseInt(res)+1 == Math.round(res) ? Math.round(res) : parseInt(res) );
											});
										});
										
									},
								}
							]
						}
					]
				},*/
				{
					head : "SUPPLIER",
					sort : {
						asc : ['sup'],
						dsc : ['-sup'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['sup'];
									},
								}
							]
						}
					]
				},
				{
					head : "CATEGORY",
					sort : {
						asc : ['NAME'],
						dsc : ['-NAME'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['CATEGORY'];
									},
								}
							]
						}
					]
				},
				/*{
					head : "UNIT",
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( arg ) => {
										
										return arg['UN'];
									},
								}
							]
						}
					]
				},
				{
					head : "IN STOCK STATUS",
					sort : {
						asc : ['lvl_qty'],
						dsc : ['-lvl_qty'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerHTML",
									value : ( selData ) => {
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
					head : "EXPIRY IN STOCK",
					sort : {
						asc : ['AAA'],
						dsc : ['-AAA'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerHTML",
									value : ( selData ) =>
									{
											//let iexp = (parseInt(selData['AAA'])+1 == Math.round(selData['AAA']) ? Math.round(selData['AAA']) : parseInt(selData['AAA']));
											//return iexp> 0 ? "<span style='color:red;font-weight:bold;'><i class='icon-warning-sign' ></i> "+iexp+' </span>' :0;
											
											return new Promise ( ( resolve , reject ) => {
												let sql = `SELECT SUM(QUANTITY) as QQTY FROM inventory.ITEM_IN_WAREHOUSE AS AA 
													WHERE ITEM_CODE = ? AND EXPIRY_DATE BETWEEN 
													IF(EXPIRY_DATE = '0000-00-00',NULL,'0000-00-00') AND CURDATE() + INTERVAL ?
													MONTH and ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE 
													WHERE ITEM_CODE = ? AND EXPIRY_DATE = AA.EXPIRY_DATE and IS_CANCELLED != 1 )`
												console.log(selData);
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
													console.log(JSON.parse(res));
													let sdata = JSON.parse(res).aaa[0].QQTY;
													let iexp = (parseInt(sdata)+1 == Math.round(sdata) ? Math.round(sdata) : parseInt(sdata));
											        let ee = iexp > 0 ? `<a href='../inventory/sources/templates/reports/itemmasterdata.expires.report.template.php?ITEM_CODE=${selData.ITEM_CODE}' target='blank_' ><span style='color:red;font-weight:bold;'><i class='icon-warning-sign' ></i> ${iexp} ${selData.UN}  </span></a> </span>` :0;
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
				},*/
				
				
				{
					head : "ACTION",
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
									value : "btn btn-primary",
								},
								{
									type : "event",
									attribute : "click",
									value : ( arg ) => {
										this.openitem(arg);
										/* let request = {
											type: "POST",
											url : this.mainService.urls["generic"].url,
											data : {
												data : {
													request : 'generic',
													REQUEST_QUERY : [
														
														{
															sql : "SELECT * FROM inventory.item_master_data WHERE ITEM_CODE = ? ",
															db : 'DB',
															query_request : 'GET',
															index : 'ITEM',
															values : [
																arg.ITEM_CODE,
															],

														},
																												
													]
												}
														
											}
										};
										let load = new LoadingModal ({
											modalID :  "loading-modal-load",
											controllerName : "loadingmodal",
											template : "/inventory/sources/templates/modal/loading.modal.template.html",
											parent : this,
										});
										load.render();
										//console.log(arg);
										this.mainService.serverRequest( request , ( res ) => {
											res = JSON.parse(res);
											//console.log(res);
											let item = res['ITEM'][0];
											
											
											
											let request23 = {
												type: "POST",
												url : this.mainService.urls["generic"].url,
												data : {
													data : {
														request : 'generic',
														REQUEST_QUERY : [
															{
																sql : "SELECT * FROM inventory.unit WHERE ITEM_CODE = ? and SUPPLIER_CODE = ? ORDER BY HEIRARCHY",
																db : 'DB',
																query_request : 'GET',
																index : 'UNIT',
																values : [
																	arg.ITEM_CODE,
																	item.SUPPLIER_CODE,
																],

															},
															{
																sql : "SELECT * FROM inventory.supplier WHERE SUPPLIER_CODE = ?",
																db : 'DB',
																query_request : 'GET',
																index : 'SUPPLIER',
																values : [
																	item.SUPPLIER_CODE,
																],

															},
															
																													
														]
													}
															
												}
											};
											
											this.mainService.serverRequest( request23 , ( res23 ) => {
												res23 = JSON.parse(res23);
												let supp = res23['SUPPLIER'][0];
												let unit = res23['UNIT'];
												
												item['UNIT'] = unit;
												item['SUPPLIER_NAME'] = supp.SUPPLIER_NAME;
												item['SUPPLIER_CODE'] = supp.SUPPLIER_CODE;
												this.openitem(item);
												load.onClose();
											});
											
											
											
										}); */
									},
								}
							],
							children : [
								{
									createElement : "i",
									attributes : [
										{
											attribute: "className",
											value : "icon-search",
										}
									]
								}
							]
						},
						{	
							createElement : "span",
							attributes:[
								{
									attribute:"innerHTML",
									value : "&nbsp;"
								}
							]
						},
						
						{	
							createElement : "span",
							attributes:[
								{
									attribute:"innerHTML",
									value : "&nbsp;"
								}
							]
						},
					]
				},
			],

		});
		this.binds (controller,elem);
		this.bindChildObject(this,false);
		this.initialize();
	}

	

	async displayCategory () {
		let categories = await this.getCategory();
		let categorySelect = document.querySelector("#item-master-data-search-category")
		for (let i in categories.CAT) {
			let sel = categories.CAT[i];
			let opt = document.createElement('option');
				opt.value = sel.ID;
				opt.innerText = sel.NAME;
			categorySelect.appendChild(opt);
		}
	}

	getCategory () {
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
														
						{
							sql : "SELECT * FROM inventory.category WHERE  ? ",
							db : 'DB',
							query_request : 'GET',
							index : 'CAT',
							values : [
								1,
							],

						},
																												
					]
				}
														
			}
		};
		
		
		return new Promise ( ( resolve , reject ) => {
			this.mainService.serverRequest( request , ( res ) => {
				res = JSON.parse(res);
				resolve(res)						
			},err => {
				reject(err);
			});
		});
	}
	
	openSupplier(){
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/inventory/sources/templates/modal/search.modal.template.html",
			params : {
				type : "supplier",
				action : 'link',
				controller : 'itemmasterdata',
				evt : ':onLinkSupplier',
			},
			parent : this,
		});
		ssm.render();
	}
	
	onLinkSupplier( ...arg ) {
		let detail = arg[0].detail.query;
		this.itemmasterdata.supplierId = detail.id;
		this.itemmasterdata.supplier = detail.arg;
		this.bindChildObject ( this , false );
		this.changefilter(  );
	}
	
	expiryInStock(){
		this.mainService.openPopupWindow("POST" , '/inventory/sources/templates/reports/itemmasterdata.expires.report.template.php',{
					
				},'toolbars=0,width=1700,height=1000,left=200,top=200,scrollbars=1,resizable=1');
	}
	
	
	inventoryInStock(){
		this.mainService.openPopupWindow("POST" , '/inventory/sources/templates/reports/itemmasterdata.inventory.report.php',{
					
				},'toolbars=0,width=1700,height=1000,left=200,top=200,scrollbars=1,resizable=1');
	}
	
	
	openReport ( ...args ){
	}
	
	
	changefilter(  ){
		this.bindChildObject(this,this.elem);
		this.initialize();
	}
	
	
	convertUnits ( item , m , s ){
		//console.log(item);
		return new Promise ( ( resolve , reject ) =>{
			let request1 = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : "select * from inventory.unit where ITEM_CODE = ? ORDER BY HEIRARCHY",
								db : 'DB',
								query_request : 'GET',
								index : 'units',
								values : [
									item.ITEM_CODE
								]
							},	
							{
								sql : "select * from inventory.unit where ITEM_CODE = ? and UNIT_NAME = ?",
								db : 'DB',
								query_request : 'GET',
								index : 'my_unit',
								values : [
									item.ITEM_CODE,
									item.UNIT_NAME
								]
							},
						]
					}
								
				}
			};
			//console.log(request1);
				
			this.mainService.serverRequest( request1 , ( res ) => {
				let u = JSON.parse(res);
				//console.log('ii',item.AAA, item.T);
				//resolve(stck);
				item.TOTAL_QUANTITY = item[s];
				
				let t = u.units[0]['QTY'];
				if (u.my_unit[0]['HEIRARCHY'] == 0){
					resolve( item.TOTAL_QUANTITY );
				}
				else{
					for ( let i in u.units ){
						let sl = u.units[i];
						t *= parseFloat(sl.QTY);
						if ( sl.HEIRARCHY == u.my_unit[0]['HEIRARCHY'] ){
							break;
						}
						
						
					}
				}
				//console.log(item.ITEM_NAME,item.QUANTITY , t )
				resolve (!m ? item.TOTAL_QUANTITY / t : item.TOTAL_QUANTITY * t );
				
			});
		});
	}
	
	initialize(f){
		//console.log(typeof f != 'undefined');

		for (let i in this.itemmasterdata) {
			localStorage.setItem(i, this.itemmasterdata[i]);
		}
		

		let SUPPLIERID = "and i.SUPPLIER_CODE = ?";
		if (this.itemmasterdata.supplierid=='%%'){
			SUPPLIERID = "and i.SUPPLIER_CODE like ?";
		}
		
		let critlevel = "";
		if (this.itemmasterdata.critlevel!==''){
			critlevel = " and i.ALERT_QTY >= iiw.TOTAL_QUANTITY";
		}
		
			let expr = "";
		if ( this.itemmasterdata.expired !== '' ){
			expr = ` and ( 
			SELECT SUM(QUANTITY) FROM inventory.ITEM_IN_WAREHOUSE AS AA 
			WHERE ITEM_CODE = i.ITEM_CODE AND EXPIRY_DATE 
			BETWEEN IF(EXPIRY_DATE = '0000-00-00',NULL,'0000-00-00') 
				AND CURDATE() + INTERVAL i.ALERT_BEFORE_EXPIRY MONTH 
			and ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE 
			WHERE ITEM_CODE = iiw.ITEM_CODE AND EXPIRY_DATE = AA.EXPIRY_DATE and IS_CANCELLED != 1  ) )  IS NOT NULL `;
			
			/*  `SELECT SUM(QUANTITY) as QQTY FROM inventory.ITEM_IN_WAREHOUSE AS AA 
													WHERE ITEM_CODE = ? AND EXPIRY_DATE BETWEEN 
													IF(EXPIRY_DATE = '0000-00-00',NULL,'0000-00-00') AND CURDATE() + INTERVAL ?
													MONTH and ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE 
													WHERE ITEM_CODE = ? AND EXPIRY_DATE = AA.EXPIRY_DATE and IS_CANCELLED != 1 )` */
		}
		
		let uu = this.bunit == 'bu' ? 'u.HEIRARCHY = 0' : 'u.HEIRARCHY = (SELECT MAX(HEIRARCHY) FROM inventory.unit WHERE ITEM_CODE = i.ITEM_CODE)';
		//console.log(uu);
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							/* sql : 
								SELECT *,u.UNIT_NAME as UN,IF(i.ALERT_QTY >= iiw.TOTAL_QUANTITY,'1','0') AS lvl_qty , 
								( SELECT SUM(TOTAL_QUANTITY) FROM inventory.ITEM_IN_WAREHOUSE WHERE ITEM_CODE = i.ITEM_CODE AND 
								  EXPIRY_DATE BETWEEN IF(EXPIRY_DATE = '0000-00-00',NULL,"0000-00-00") AND CURDATE() + INTERVAL 1 MONTH ) AS AAA 
								  FROM inventory.item_master_data i 
								  INNER JOIN inventory.supplier s ON s.SUPPLIER_CODE = i.SUPPLIER_CODE 
								  INNER JOIN inventory.unit u ON u.ITEM_CODE = i.ITEM_CODE 
								  INNER JOIN inventory.item_in_warehouse iiw ON iiw.ITEM_CODE = i.ITEM_CODE 
								  WHERE iiw.ID=(SELECT max(ID) FROM inventory.item_in_warehouse where ITEM_CODE=i.ITEM_CODE ) AND 
								  ( SELECT SUM(TOTAL_QUANTITY) 
								    FROM inventory.ITEM_IN_WAREHOUSE 
									WHERE ITEM_CODE = i.ITEM_CODE AND 
										EXPIRY_DATE BETWEEN IF(EXPIRY_DATE = '0000-00-00',NULL,"0000-00-00") AND CURDATE() + INTERVAL 1 MONTH ) IS NOT NULL 
										ORDER BY lvl_qty desc , AAA desc */
							//  ", ( SELECT SUM(QUANTITY) FROM inventory.ITEM_IN_WAREHOUSE AS AA WHERE ITEM_CODE = i.ITEM_CODE AND EXPIRY_DATE BETWEEN IF(EXPIRY_DATE = '0000-00-00',NULL,'0000-00-00') AND CURDATE() + INTERVAL 1 MONTH and ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE WHERE ITEM_CODE = iiw.ITEM_CODE AND EXPIRY_DATE = AA.EXPIRY_DATE and IS_CANCELLED != 1 )  ) "+
								 
							sql : "SELECT i.ITEM_CODE IC,cat.NAME CATEGORY, i.ALERT_BEFORE_EXPIRY,i.ITEM_NAME, i.ITEM_IMAGE, u.*, i.ID idd,i.SUPPLIER_CODE SUPPLIER_CODE,s.SUPPLIER_NAME sup ,u.UNIT_NAME as UN,u.SELLING_PRICE_PER_UNIT price,iiw.TOTAL_QUANTITY AS T,IF(i.ALERT_QTY >= iiw.TOTAL_QUANTITY,'1','0') AS lvl_qty "+
								  //", ( SELECT SUM(QUANTITY) FROM inventory.ITEM_IN_WAREHOUSE AS AA WHERE ITEM_CODE = i.ITEM_CODE AND EXPIRY_DATE BETWEEN IF(EXPIRY_DATE = '0000-00-00',NULL,'0000-00-00') AND CURDATE() + INTERVAL i.ALERT_BEFORE_EXPIRY MONTH and ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE WHERE ITEM_CODE = iiw.ITEM_CODE AND EXPIRY_DATE = AA.EXPIRY_DATE and IS_CANCELLED != 1 )  ) "+
								  ",00 AS AAA "+
								  "FROM inventory.item_master_data i INNER JOIN inventory.supplier s ON s.SUPPLIER_CODE = i.SUPPLIER_CODE "+
								  "INNER JOIN inventory.unit u ON (u.ITEM_CODE = i.ITEM_CODE ) "+
								  "INNER JOIN inventory.item_in_warehouse iiw ON iiw.ITEM_CODE = i.ITEM_CODE "+
								  "INNER JOIN inventory.category cat ON cat.ID = i.CATEGORY "+
								  "WHERE  item_name like ? "+
								  "AND CATEGORY = "+this.itemmasterdata.category+" "+
								  (this.itemmasterdata.price > 0 ? ("AND u.SELLING_PRICE_PER_UNIT >= "+this.itemmasterdata.price+" ") : '')+
								  (this.itemmasterdata.supplierId !== "" ? ("AND i.SUPPLIER_CODE = '"+this.itemmasterdata.supplierId+"' ") : '')+
								  (( this.itemmasterdata.itemname == '' && typeof f == 'undefined' ) ?
								  " AND  i.ID >= (SELECT MIN(ID) from inventory.item_master_data) AND i.ID <= (SELECT MIN(ID)+10 from inventory.item_master_data)  " : "")+
								  " AND iiw.ID=(SELECT max(ID) FROM inventory.item_in_warehouse where ITEM_CODE=i.ITEM_CODE and TOTAL_QUANTITY >= 0 and IS_CANCELLED != 1 ) "+
								  expr+" "+critlevel+" and "+uu+"  GROUP BY u.ITEM_CODE ORDER BY i.ID desc ",
							db : 'DB',
							query_request : 'GET',
							index : 'items',
							values : [
								'%'+this.itemmasterdata.itemname+'%' 
							]
						},	
					]
				}
				//report expiry details sql
				//SELECT * FROM inventory.ITEM_IN_WAREHOUSE AS AA WHERE ITEM_CODE = 'ITEM1637676113' AND EXPIRY_DATE BETWEEN IF(EXPIRY_DATE = '0000-00-00',NULL,'0000-00-00') AND CURDATE() + INTERVAL 1 MONTH and ID = (SELECT MAX(ID) FROM inventory.ITEM_IN_WAREHOUSE WHERE ITEM_CODE = 'ITEM1637676113' AND EXPIRY_DATE = AA.EXPIRY_DATE and IS_CANCELLED != 1)		
			}
		};
		//console.log(request);
		let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : "/inventory/sources/templates/modal/loading.modal.template.html",
			parent : this,
		});
		
		load.render();
		
		this.mainService.serverRequest( request , ( res ) => {
			//console.log(res);
			//setTimeout( ( ) => {
				let profilesObject = (JSON.parse(res))['items'];

				let newArray = {};

				for (let i in profilesObject) {
					let tmp = {};
					for (let j in profilesObject[i]) {
						tmp[j] = profilesObject[i][j];
					}
					newArray[`${i}`] =tmp;
				}

				let xmlItems = this.OBJtoXML({ITEMS:newArray});

				let d = profilesObject.length >= 130 ? 130 : Math.round( profilesObject.length / 1 );

				
				this.dataTable.setTableData(profilesObject);
				this.dataTable.setTableDataXML(xmlItems, 'IC');
				//this.dataTable.populateAsXML(xmlItems);
				console.log(d)
				this.dataTable.setPaginateCtr(d);
				this.dataTable.construct();
				load.onClose();
			//},100);
		});
	}
	
	OBJtoXML(obj) {
		var xml = '';
		for (var prop in obj) {
			xml += "<" + prop + ">";
			if(Array.isArray(obj[prop])) {
				for (var array of obj[prop]) {
	
					// A real botch fix here
					xml += "</" + prop + ">";
					xml += "<" + prop + ">";
	
					xml += this.OBJtoXML(new Object(array));
				}
			} else if (typeof obj[prop] == "object") {
				xml += this.OBJtoXML(new Object(obj[prop]));
			} else {
				xml += obj[prop];
			}
			xml += "</" + prop + ">";
		}
		var xml = xml.replace(/<\/?[0-9]{1,}>/g,'');
		return xml
	}

	onUpdateItems(){
		this.changefilter();
	}
	
	
	opensupplier(){
		
	}
	
	report ( args ){

	}
	
	openitem( ...arg ){
		let itemProfileModal = new ItemMasterDataMainModal({
			modalID :  "itemmasterdatamodal",
			controllerName : "itemmasterdatamodal",
			template : "/inventory/sources/templates/modal/itemmasterdata.modal.template.html",
			parent : this,
			isUpdate : arg[0]['ID'] ? true : false,
			args : arg
		});
		itemProfileModal.render();
	
	}
	
	allitems(){
		this.itemmasterdata.itemname = '';
		this.bindChildObject(this,false);
		this.initialize(true);
	}
	
	
	
}