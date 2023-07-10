import { Controller } from "../classes/controller.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { TransactionMainModal } from "./transaction.modal.controller.class.js";

export class TransactionController extends Controller{
	
	constructor ( controller , service , elem ){
		super ( controller , service , elem );
		
	
		this.DOC_ID = '';
		this.DOC_TYPE = '';
		this.ENCODED_DATE = '2021-01-01';
		this.DOC_DATE = this.mainService.getCurrentDate();
		this.STATUS = '';
		
		this.binds (controller,elem);
		this.bindChildObject(this,false);
		
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
					head : "DOCUMENT ID",
					sort : {
						asc : ['emplast'],
						dsc : ['-emplast'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "b",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										
										return selData['DOC_ID'];
									},
								}
							]
						}
					]
				},
				{
					head : "DOCUMENT DATE",
					sort : {
						asc : ['DOCUMENT_DATE'],
						dsc : ['-DOCUMENT_DATE'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['DOCUMENT_DATE'];
									},
								}
							]
						}
					]
				},
				{
					head : "DATE ENCODED",
					sort : {
						asc : ['DATE_ENCODED'],
						dsc : ['-DATE_ENCODED'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['DATE_ENCODED'];
									},
								}
							]
						}
					]
				},
				
				{
					head : "DOCUMENT TYPE",
					sort : {
						asc : ['TYPE'],
						dsc : ['-TYPE'],
					},
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['TYPE'];
									},
								}
							]
						}
					]
				},
				
				{
					head : "STATUS",
					sort : {
						asc : ['STATUS'],
						dsc : ['-STATUS'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['STATUS'];
									},
								}
							]
						}
					]
				},
				
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
										//console.log(arg);
										let request = {
											type: "POST",
											url : this.mainService.urls["generic"].url,
											data : {
												data : {
													request : 'generic',
													REQUEST_QUERY : [
														{
															sql : "SELECT *,id.UNIT_CONVERSION_ID as UNIT_CONVERSION_ID,id.EXPIRY_DATE as EXPIRY_DATE,id.LOT_NUMBER as LOT_NUMBER FROM inventory.`item_details` id INNER JOIN inventory.item_master_data imd ON imd.ITEM_CODE=id.ITEM_CODE WHERE id.DOC_ID = ? order by id.ID",
															db : 'DB',
															query_request : 'GET',
															index : 'ITEM_DETAILS',
															values : [arg.DOC_ID],

														},
														{
															sql : "SELECT *,u.UNIT_CONVERSION_ID as UNIT_CONVERSION_ID,id.TOTAL_PRICE as TOTAL_PRICE,id.TOTAL_COST as TOTAL_COST FROM inventory.`item_details` id INNER JOIN inventory.item_master_data imd ON imd.ITEM_CODE=id.ITEM_CODE "+
																  "inner join unit u ON u.ITEM_CODE=imd.ITEM_CODE WHERE id.DOC_ID = ?",
															db : 'DB',
															query_request : 'GET',
															index : 'UNIT_VALS',
															values : [arg.DOC_ID],
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
										setTimeout(()=>{
											this.mainService.serverRequest( request , ( res ) => {
												res = JSON.parse(res);
												let itemdetails = res['ITEM_DETAILS'];
												let unitvals = res['UNIT_VALS'];
												arg['ITEM_DETAILS'] = itemdetails;
												arg['UNIT_VALS'] = unitvals;
												
												this.newTransaction(arg);
												load.onClose();
											});
										},500);
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
										console.log(arg);
										if(arg.STATUS == 'Cancelled'){
											if (parseInt(arg.IS_REPLACED) === 1) {
												alert("This transaction has already been replaced!");
												return;
											}
											
											if (arg.TYPE === 'Sales Invoice') {
												alert("Sales invoice cannot be replaced!");
												return;
											}
											
											let request = {
												type: "POST",
												url : this.mainService.urls["generic"].url,
												data : {
													data : {
														request : 'generic',
														REQUEST_QUERY : [
															{
																sql : "SELECT *,id.UNIT_CONVERSION_ID as UNIT_CONVERSION_ID,id.EXPIRY_DATE as EXPIRY_DATE,id.LOT_NUMBER as LOT_NUMBER FROM inventory.`item_details` id INNER JOIN inventory.item_master_data imd ON imd.ITEM_CODE=id.ITEM_CODE WHERE id.DOC_ID = ? order by id.ID",
																db : 'DB',
																query_request : 'GET',
																index : 'ITEM_DETAILS',
																values : [arg.DOC_ID],

															},
															{
																sql : "SELECT *,id.ID AS ITEM_IN_WH_ID ,id.UNIT_CONVERSION_ID as UNIT_CONVERSION_ID,id.EXPIRY_DATE as EXPIRY_DATE,id.LOT_NUMBER as LOT_NUMBER FROM inventory.`item_in_warehouse` id INNER JOIN inventory.item_master_data imd ON imd.ITEM_CODE=id.ITEM_CODE WHERE id.DOC_ID = ? order by id.ID",
																db : 'DB',
																query_request : 'GET',
																index : 'ITEM_DETAILS_IN_WAREHOUSE',
																values : [arg.DOC_ID],

															},
															{
																sql : "SELECT *,u.UNIT_CONVERSION_ID as UNIT_CONVERSION_ID,id.TOTAL_PRICE as TOTAL_PRICE,id.TOTAL_COST as TOTAL_COST FROM inventory.`item_details` id INNER JOIN inventory.item_master_data imd ON imd.ITEM_CODE=id.ITEM_CODE "+
																	  "inner join unit u ON ( u.ITEM_CODE=imd.ITEM_CODE and u.SUPPLIER_CODE = imd.SUPPLIER_CODE ) WHERE id.DOC_ID = ?",
																db : 'DB',
																query_request : 'GET',
																index : 'UNIT_VALS',
																values : [arg.DOC_ID],
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
											console.log(arg);
											this.mainService.serverRequest( request , ( res ) => {
												res = JSON.parse(res);
												let itemdetails = res['ITEM_DETAILS'];
												let unitvals = res['UNIT_VALS'];
												arg['ITEM_DETAILS'] = [];
												arg['ITEM_DETAILS_IN_WAREHOUSE'] =  res['ITEM_DETAILS_IN_WAREHOUSE'];
												arg['UNIT_VALS'] = unitvals;
												arg['REPLACE_DOCUMENT'] = true;
												
												this.newTransaction(arg);
												load.onClose();
											});
											
										}
										else{
											alert("Only cancelled transaction allowed to be replaced!");
										}
									},
								}
							],
							children : [
								{
									createElement : "i",
									attributes : [
										{
											attribute: "className",
											value : "icon-refresh",
										}
									]
								}
							]
						},
					]
				},
			],

		});

		this.initialize();

	}
	
	
	
	
	changefilter(){
		this.bindChildObject(this,this.elem);
		this.initialize();
	}
	
	
	initialize(){
		
		/* let SUPPLIERID = "and i.SUPPLIER_CODE = ?";
		if (this.itemmasterdata.supplierid=='%%'){
			SUPPLIERID = "and i.SUPPLIER_CODE like ?";
		} */
		/* console.log('%'+this.DOC_TYPE+'%','%'+this.DOC_ID +'%',	
								this.DOC_DATE,
								this.ENCODED_DATE ,
								this.STATUS); */
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : "SELECT *,s.ID AS ALTER_DOC_ID FROM inventory.alter_document s "+
								  "where s.TYPE LIKE ? and s.DOC_ID like ? and (s.DOCUMENT_DATE between ? And ?) AND s.STATUS like ?",
							db : 'DB',
							query_request : 'GET',
							index : 'items',
							values : [
								'%'+this.DOC_TYPE+'%',
								'%'+this.DOC_ID +'%',
								this.ENCODED_DATE ,
								this.DOC_DATE,
								'%'+this.STATUS+'%',
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
		load.render();
		
		this.mainService.serverRequest( request , ( res ) => {
			//console.log(res);
			setTimeout( ( ) => {
				let profilesObject = (JSON.parse(res))['items'];
				//console.log('re',profilesObject);
				let d = profilesObject.length >= 130 ? 130 : Math.round( profilesObject.length / 1 );
				
				this.dataTable.setTableData(profilesObject);
				
				this.dataTable.setPaginateCtr(d);
				this.dataTable.construct();
				load.onClose();
			},100);
		});
	}
	
	onUpdateTransaction(){
		this.changefilter();
	}
	

	
	newTransaction ( ...arg ){
		let transaction = new TransactionMainModal({
			modalID :  "transactionmodal",
			controllerName : "transactionmodal",
			template : "/inventory/sources/templates/modal/transaction.main.modal.template.html",
			parent : this,
			isUpdate : arg[0]['ID'] ? true : false,
			args : arg
		});
		transaction.render();
	}
	

	
	
	
}