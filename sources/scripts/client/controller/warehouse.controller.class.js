import { Controller } from "../classes/controller.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { WarehouseMainModal } from "./warehouse.main.modal.js";

export class WarehouseController extends Controller{
	
	constructor ( controller , service , elem ){
		super ( controller , service , elem );
		
		this[controller] = { 
			warehousename : '',
			address:'',
		};	
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
					head : "IMAGE",
					elements : [
						{
							createElement : "img",
							attributes : [
								{
									attribute : "src",
									value : ( selData ) => {
										if (selData['IMG']=='')
										return '/inventory/sources/images/ware.jpg';
										else
										return '';
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
					head : "WAREHOUSE NAME",
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
										
										return selData['WAREHOUSE_NAME'];
									},
								}
							]
						}
					]
				},
				{
					head : "ADDRESS",
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['ADDRESS'];
									},
								}
							]
						}
					]
				},
				{
					head : "TOTAL COST",
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
					head : "DATE ENCODED",
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
										this.openwarehouse(arg);
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
	
	onUpdateWarehouse(){
		this.changefilter();
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
							sql : "SELECT * FROM inventory.warehouse w WHERE w.WAREHOUSE_NAME LIKE ? and w.ADDRESS like ?",
							db : 'DB',
							query_request : 'GET',
							index : 'items',
							values : ['%'+this.warehouse.warehousename+'%','%'+this.warehouse.address+'%']
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
				setTimeout( ( ) => {
					load.onClose();
				},1000);
			},100);
			
		});
	}
	
	opensupplier(){
		
	}
	
	report ( args ){

	}
	
	openwarehouse( ...arg ){
		//console.log(arg);
		let itemProfileModal = new WarehouseMainModal({
			modalID :  "warehousemodal",
			controllerName : "warehousemodal",
			template : "/inventory/sources/templates/modal/warehouse.modal.template.html",
			parent : this,
			isUpdate : arg[0]['ID'] ? true : false,
			args : arg
		});
		itemProfileModal.render();
	
	}
	
	allitems(){
		
	}
	
	
	
}