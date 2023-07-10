import { Controller } from "../classes/controller.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SupplierMainModal } from "./supplier.modal.controller.class.js";

export class SupplierController extends Controller{
	
	constructor ( controller , service , elem ){
		super ( controller , service , elem );
		
		this[controller] = { 
			suppliername : '',
			address : '',
			type : '',
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
										return '/inventory/sources/images/comp.jpg';
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
					head : "BUSINESS PARTNER",
					sort : {
						asc : ['SUPPLIER_NAME'],
						dsc : ['-SUPPLIER_NAME'],
					},
					sortBy : 'asc',
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
					head : "ADDRESS",
					sort : {
						asc : ['SUPPLIER_ADDRESS'],
						dsc : ['-SUPPLIER_ADDRESS'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "span",
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
					head : "TYPE",
					sort : {
						asc : ['TYPE'],
						dsc : ['-TYPE'],
					},
					sortBy : 'asc',
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
										this.opensupplier(arg);
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
	
	
	initialize(){
		
		/* let SUPPLIERID = "and i.SUPPLIER_CODE = ?";
		if (this.itemmasterdata.supplierid=='%%'){
			SUPPLIERID = "and i.SUPPLIER_CODE like ?";
		} */
		
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : "SELECT * FROM inventory.supplier s WHERE s.SUPPLIER_NAME like ? and s.SUPPLIER_ADDRESS like ? and s.TYPE like ?",
							db : 'DB',
							query_request : 'GET',
							index : 'items',
							values : [
								'%'+this.supplier.suppliername+'%',
								'%'+this.supplier.address+'%',
								'%'+this.supplier.type+'%'
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
	
	onUpdateSupplier(){
		this.changefilter();
	}
	
	opensupplier(){
		
	}
	
	report ( args ){

	}
	
	opensupplier( ...arg ){
		//console.log(arg);
		let supplierModal = new SupplierMainModal({
			modalID :  "suppliermodal",
			controllerName : "suppliermodal",
			template : "/inventory/sources/templates/modal/supplier.modal.template.html",
			parent : this,
			isUpdate : arg[0]['ID'] ? true : false,
			args : arg
		});
		supplierModal.render();
	
	}
	
	allitems(){
		
	}
	
	
	
}