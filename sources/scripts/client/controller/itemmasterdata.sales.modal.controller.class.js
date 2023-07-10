import { Modal } from "../classes/modal.controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { MainService } from "../classes/main.service.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { TransactionMainModal } from "./transaction.modal.controller.class.js";

export class ItemSalesModal extends Modal{

	constructor ( modalData ){
		super ( modalData );
		this.init ( modalData );
	}
	
	init ( modalData ){
		this.modalData = modalData;
		this.isUpdate = this.modalData.isUpdate;
		this.dtoo = this.mainService.getCurrentDate();
		this.dfrm = this.mainService.addDays (this.dtoo , -30);
		
		this.itemdetails = this.modalData.arg.args[0];
		//console.log(this.modalData);
		this.initialize();
	}
	
	async constructs(){
		let itemdetails = await this.getItemDetails();
		this.itemdetails = itemdetails 
		//console.log('detststs',this.itemdetails);
		this.constructDataTable231();
	}
	
	
	
	
	getItemDetails(){
		let request = {
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
								this.modalData.arg.args[0].ITEM_CODE,
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
		
		return new Promise ( ( resolve , reject ) => {
			this.mainService.serverRequest( request , ( res ) => {
				res = JSON.parse(res);
				console.log(`res`,res);
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
										item.ITEM_CODE,
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
					resolve(item);
					load.onClose();
				},err=>{
					reject(err);
				});
												
												
												
			},err => {
				reject(err);
			});
		});
	}
	
	
	constructDataTable231 (){
		//console.log("wewsss333");
		this.dataTable = new DataTableService({
			template : "/inventory/sources/templates/section/datatable.template.section.html",
			controller : this,
			controllername : this.controllerName,
			tableID : "dttable",
			service : this.mainService,
			parentDiv : ".item-sales-table",
			filterElems : [],
			fields : [
				
				
				{
					head : "DATE",
					sort : {
						asc : ['DATE_TRANSACTION'],
						dsc : ['-DATE_TRANSACTION'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										
										
										return selData['DATE_TRANSACTION'];
									},
								}
							]
						}
					]
				},
				
				{
					head : "PIECES SOLD",
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
										
										
										return selData['TOTAL_QUANTITY'];
									},
								}
							]
						}
					]
				},
				
				{
					head : "SALES AMOUNT",
					sort : {
						asc : ['TOTAL_AMOUNT'],
						dsc : ['-TOTAL_AMOUNT'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										
										
										return selData['TOTAL_AMOUNT'];
									},
								}
							]
						}
					]
				},
				
				
			],

		});
	}
	
	initialize(){
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							
							sql : `SELECT * FROM inventory.sales_invoice si 
							INNER JOIN item_details im ON im.DOC_ID = si.ORNO 
							INNER JOIN unit u ON u.UNIT_CONVERSION_ID = im.UNIT_CONVERSION_ID 
							WHERE im.ITEM_CODE = ? and CANCELLED_BY = ''  ORDER BY si.DATE_TRANSACTION desc`,
							
							db : 'DB',
							query_request : 'GET',
							index : 'items',
							values : [
								!this.itemdetails.ITEM_CODE ? 1 : this.itemdetails.ITEM_CODE
							]
						},	
					]
				}
						
			}
		};
		//console.log(request);
		let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : "/inventory/sources/templates/modal/loading.modal.template.html",
			parent : this,
		});
		
		//load.render();
		
		this.mainService.serverRequest( request , ( res ) => {
			//console.log(res);
			setTimeout( ( ) => {
				let profilesObject = (JSON.parse(res))['items'];
				console.log('re',profilesObject);
			
				if(this.dataTable){
					//console.log('re',profilesObject);
					/* this.dataTable.setTableData(profilesObject);
					//console.log(this.dataTable);
					this.dataTable.setPaginateCtr(d);
					this.dataTable.construct(); */
					
					
					let salesPerformanceArray = [];
					
					for (let i in profilesObject){
						let sel = profilesObject[i];
						
						let chk = salesPerformanceArray.findIndex( x => x.DATE_TRANSACTION == sel.DATE_TRANSACTION);
						//console.log(sel.DATE_TRANSACTION,chk);
						if (chk > -1){
							salesPerformanceArray[chk][`TOTAL_QUANTITY`] += parseFloat(this.convertUnits4(sel.QUANTITY,sel.UNIT_NAME,this.itemdetails.UNIT[this.itemdetails.UNIT.length-1].UNIT_NAME,this.itemdetails.UNIT));
							salesPerformanceArray[chk][`TOTAL_AMOUNT`] += parseFloat(sel.TOTAL_AMOUNT);
						}
						else{
							salesPerformanceArray.push({ 
								DATE_TRANSACTION : sel.DATE_TRANSACTION,
								TOTAL_QUANTITY : parseFloat(this.convertUnits4(sel.QUANTITY,sel.UNIT_NAME,this.itemdetails.UNIT[this.itemdetails.UNIT.length-1].UNIT_NAME,this.itemdetails.UNIT)),
								TOTAL_AMOUNT : parseFloat(sel.TOTAL_AMOUNT),
							});
						}
						
					}
					let d = salesPerformanceArray.length >= 130 ? 130 : Math.round( salesPerformanceArray.length / 1 );
					//console.log(`salesperformance`,salesPerformanceArray);
					this.dataTable.setTableData(salesPerformanceArray)
					this.dataTable.setPaginateCtr(d);
					this.dataTable.construct();
				}
				//load.onClose();
			},100);
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
	
	changefilter(){
		
	}
	
	
	
	
}