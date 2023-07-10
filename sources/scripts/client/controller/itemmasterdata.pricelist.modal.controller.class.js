import { Modal } from "../classes/modal.controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { MainService } from "../classes/main.service.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { TransactionMainModal } from "./transaction.modal.controller.class.js";

export class ItemPriceListModal extends Modal{

	constructor ( modalData ){
		super ( modalData );
		this.init ( modalData );
	}
	
	init ( modalData ){
		this.modalData = modalData;
		this.isUpdate = this.modalData.isUpdate;
		this.supplierName = '';
		this.supplierCode = '';
		this.itemdetails = this.modalData.arg.args[0];
		this.initialize();
		//console.log('item',this.itemdetails);
	}
	
	constructDataTable231 (){
		//console.log("wewsss333");
		this.dataTable = new DataTableService({
			template : "/inventory/sources/templates/section/datatable.template.section.html",
			controller : this,
			controllername : this.controllerName,
			tableID : "dttable",
			service : this.mainService,
			parentDiv : ".item-pricelist-table",
			filterElems : [],
			fields : [
				
				
				{
					head : "SUPPLIER",
					sort : {
						asc : ['SUPPLIER_NAME'],
						dsc : ['-SUPPLIER_NAME'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "span",
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
										//this.openitem(arg);
										let request = {
											type: "POST",
											url : this.mainService.urls["generic"].url,
											data : {
												data : {
													request : 'generic',
													REQUEST_QUERY : [
														{
															sql : "SELECT * FROM inventory.unit WHERE ITEM_CODE = ? ORDER BY HEIRARCHY",
															db : 'DB',
															query_request : 'GET',
															index : 'UNIT',
															values : [arg.ITEM_CODE],

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
											
											let unit = res['UNIT'];
											
											arg['UNIT'] = unit;
											
											
											this.openitem(arg);
											load.onClose();
										});
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
									value : "btn btn-danger",
								},
								{
									type : "event",
									attribute : "click",
									value : ( arg ) => {

									},
								}
							],
							children : [
								{
									createElement : "i",
									attributes : [
										{
											attribute: "className",
											value : "icon-trash",
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
									value : ( arg ) => {
										
										return "btn btn-success";
									},
								},
								{
											type : "event",
											attribute : "click",
											value : ( arg ) => {
												let request = {
													type: "POST",
													url : this.mainService.urls["generic"].url,
													data : {
														data : {
															request : 'generic',
															REQUEST_QUERY : [
																{
																	
																	sql : "UPDATE inventory.item_master_data SET SUPPLIER_CODE = ? WHERE ITEM_CODE = ?",
																	db : 'DB',
																	query_request : 'PUT',
																	values : [
																		arg.SUPPLIER_CODE,
																		this.itemdetails.ITEM_CODE
																	]
																},	
															]
														}
																
													}
												};
												console.log(	arg,this.itemdetails);
												let load = new LoadingModal ({
													modalID :  "loading-modal-load",
													controllerName : "loadingmodal",
													template : "/inventory/sources/templates/modal/loading.modal.template.html",
													parent : this,
												});
												
												if ( confirm ("Are you sure you want to change price ?") ){
													//load.render();
													
													this.mainService.serverRequest( request , ( res ) => {
														//console.log(res);
														//setTimeout( ( ) => {
															this.initialize();
															//load.onClose();
														//},100);
													});
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
											//value : "icon-check-empty",
											value : ( arg ) => {
												//console.log('fsads',arg.SUPPLIER_CODE,this.itemdetails.SUPPLIER_CODE);
										
												
												
												
												let request = {
													type: "POST",
													url : this.mainService.urls["generic"].url,
													data : {
														data : {
															request : 'generic',
															REQUEST_QUERY : [
																{
																	
																	sql : "SELECT * FROM inventory.item_master_data  WHERE ITEM_CODE = ?",
																	db : 'DB',
																	query_request : 'GET',
																	index : 'supp',
																	values : [
																		arg.ITEM_CODE
																	]
																},	
															]
														}
																
													}
												};
												return new Promise ( ( resolve , reject ) => {
													this.mainService.serverRequest( request , ( res ) => {
														let supp = (JSON.parse(res))['supp'][0];
														console.log(supp,arg);
														
														if (arg.SUPPLIER_CODE===supp.SUPPLIER_CODE)
															resolve( `icon-check` );
														else
															resolve (`icon-check-empty`);
													}, err =>{
														
														reject(err);
													});
												});
												
											}
										},
										
									]
								}
							]
						},
					]
				},
			],

		});
	}
	
	onSelectSupplier (  ){
		
	}
	
	initialize(){
		//console.log("wews1");
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							
							sql : "SELECT * FROM inventory.unit U INNER JOIN inventory.supplier S ON S.SUPPLIER_CODE = U.SUPPLIER_CODE WHERE ITEM_CODE = ? GROUP BY U.SUPPLIER_CODE",
							db : 'DB',
							query_request : 'GET',
							index : 'items',
							values : [
								!this.itemdetails.ITEM_CODE ? 1 :this.itemdetails.ITEM_CODE
							]
						},	
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
		
		this.mainService.serverRequest( request , ( res ) => {
			//console.log(res);
			setTimeout( ( ) => {
				let profilesObject = (JSON.parse(res))['items'];
				//console.log('re',profilesObject);
				let d = profilesObject.length >= 130 ? 130 : Math.round( profilesObject.length / 1 );
				if(this.dataTable){
					console.log('re',profilesObject);
					this.dataTable.setTableData(profilesObject);
					//console.log(this.dataTable);
					this.dataTable.setPaginateCtr(d);
					this.dataTable.construct();
				}
				//load.onClose();
			},100);
		});
	}
	
	
	constructs(){
		//alert("WEWz");
		//console.log("@#!#!");
		this.constructDataTable231();
	}
	
}