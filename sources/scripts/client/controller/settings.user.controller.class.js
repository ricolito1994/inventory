import { Modal } from "../classes/modal.controller.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { UsersModal } from "./settings.user.controller.modal.class.js";


export class UserSettings extends Modal{

	constructor ( modalData ){
		super ( modalData );
		this.init ( modalData );
	}
	
	constructs(){
		this.dataTable = new DataTableService({
			template : "/inventory/sources/templates/section/datatable.table.section.template.html",
			controller : this,
			controllername : "requirementsettings",
			tableID : "dttable",
			service : this.mainService,
			parentDiv : ".requirementtablesettings",
			filterElems : [],
			fields : [
				{
					head : "User",
					elements : [
						{
							createElement : "b",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return `${selData['FIRSTNAME']} ${selData['LASTNAME']}`;
									},
								}
							]
						}
					]
				},
				{
					head : "Designation",
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['DESIGNATION'];
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
															sql : "SELECT * FROM inventory.user_setup WHERE ID = ?",
															db : 'DB',
															query_request : 'GET',
															index : 'profiles',
															values : [arg.ID]
														},	
													]
												}
														
											}
										};

										this.mainService.serverRequest( request , ( res ) => {
											this.openUser(JSON.parse(res).profiles[0]);
											
										} 
										, ( res ) => {
											//err
											console.log(res);
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
							createElement : "span",
							attributes:[
								{
									attribute:"innerHTML",
									value : "&nbsp;"
								}
							]
						},
						/* {	
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
										
										
										
										//console.log(arg)
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
						}, */
					]
				},
			],

		});
	
		this.dataTablePopulate ();
	}
	
	openUser ( ...args ){
		//console.log('arara',args);
		let um = new UsersModal ( {
			modalID :  "usersmodal",
			controllerName : "usersmodal",
			template : "/inventory/sources/templates/modal/users.modal.template.html",
			params : args[0] ? args[0] : [],
			parent : this,
		});
		um.render();
	}
	
	
	init( modalData ){
		this.search = {
			requirement : '',
		}
		this.modalData = (modalData);
		
		
	}
	
	dataTablePopulate (){
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : "SELECT * FROM inventory.user_setup WHERE concat(FIRSTNAME,LASTNAME) LIKE ?",
							db : 'DB',
							query_request : 'GET',
							index : 'profiles',
							values : ['%'+this.search.requirement+'%']
						},	
					]
				}
						
			}
		};

		this.mainService.serverRequest( request , ( res ) => {
			setTimeout( ( ) => {
				let profilesObject = (JSON.parse(res)).profiles;
				//console.log('re',profilesObject);
				let d = profilesObject.length >= 130 ? 130 : Math.round( profilesObject.length / 1 );
				
				this.dataTable.setTableData(profilesObject);
				
				this.dataTable.setPaginateCtr(d);
				this.dataTable.construct();
			},100);
			
		} 
		, ( res ) => {
			//err
			console.log(res);
		});
	}
	
	changefilter (){
		this.bindChildObject(this,this.elem);
		this.dataTablePopulate ();
	}
	
	
	onUpdateUser(){
		this.changefilter ();
	}
	
	
	
}