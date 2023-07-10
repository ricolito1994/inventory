import { Modal } from "../classes/modal.controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { MainService } from "../classes/main.service.class.js";


export class WarehouseProfileModalController extends Modal{

	constructor ( modalData ){
		super ( modalData );
		this.init ( modalData );
	}
	
	init ( modalData ){
		this.modalData = modalData;
		this.isUpdate = this.modalData.isUpdate;
		this.warehouseprofile = {
			IMG : 'sources/images/ware.jpg',
			WAREHOUSE_NAME : 'OUR WAREHOUSE',
			WAREHOUSE_CODE : this.mainService.generate_id_timestamp('WAREHOUSE'),
			ADDRESS : 'BACOLOD CITY',
			ACCOUNT_CODE : '0-0000',
			DATE_ENCODED : this.mainService.getCurrentDate(),
			DESCRIPTION  : 'Our storage for our products',
			COMPANY_CODE : session_data.COMPANY_CODE,
		};
		
		for ( let i in this.warehouseprofile ){
			if ( this.modalData.arg.args[0][i] ){
				let sel = this.modalData.arg.args[0][i];
				this.warehouseprofile[i] = sel;
			}
		}
	}
	
	constructs(){
		
	}
	
	save (){
		this.bindChildObject(this,true);
		
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : "INSERT INTO inventory.warehouse (WAREHOUSE_NAME,WAREHOUSE_CODE,ADDRESS,ACCOUNT_CODE,DESCRIPTION,COMPANY_CODE,DATE_ENCODED) VALUES(?,?,?,?,?,?,?) ",
							db : 'DB',
							query_request : 'INSERT',
							values : [
								this.warehouseprofile.WAREHOUSE_NAME,
								this.warehouseprofile.WAREHOUSE_CODE,
								this.warehouseprofile.ADDRESS,
								this.warehouseprofile.ACCOUNT_CODE,
								this.warehouseprofile.DESCRIPTION,
								this.warehouseprofile.COMPANY_CODE,
								this.warehouseprofile.DATE_ENCODED,
							]
						},	
					]
				}
						
			}
		};
		
		
		
		if (this.isUpdate){
			request = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : "update inventory.warehouse set WAREHOUSE_NAME=?,WAREHOUSE_CODE=?,ADDRESS=?,ACCOUNT_CODE=?,DESCRIPTION=?,COMPANY_CODE=?,DATE_ENCODED=? where WAREHOUSE_CODE = ? ",
								db : 'DB',
								query_request : 'put',
								values : [
									this.warehouseprofile.WAREHOUSE_NAME,
									this.warehouseprofile.WAREHOUSE_CODE,
									this.warehouseprofile.ADDRESS,
									this.warehouseprofile.ACCOUNT_CODE,
									this.warehouseprofile.DESCRIPTION,
									this.warehouseprofile.COMPANY_CODE,
									this.warehouseprofile.DATE_ENCODED,
									this.warehouseprofile.WAREHOUSE_CODE,
								]
							},	
						]
					}
							
				}
			};
			
			
		}
	
		
		//console.log(this.unitConversions);
		/* let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : "/inventory/sources/templates/modal/loading.modal.template.html",
			parent : this,
		});
		load.render(); */
		//console.log(request);
		
		this.mainService.serverRequest( request , ( res ) => {
			//console.log(res);
			let request1 = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : "select * from inventory.warehouse where WAREHOUSE_CODE = ? ",
								db : 'DB',
								query_request : 'GET',
								index : 'res',
								values : [
									this.warehouseprofile.WAREHOUSE_CODE,
								]
							},	
						]
					}
							
				}
			};
			
			
			this.mainService.serverRequest( request1 , ( res ) => {
				res = JSON.parse(res).res;
				
				this.modalData.args = res;
				this.modalData.isUpdate = true;
				this.init(this.modalData);
				//load.onClose();
				MainService.EventObject['warehouse'].dispatch ('warehouse:onUpdateWarehouse' , {
					detail : {
						query : {
							
						}
					} 
				});
				alert("Success!");
			});
			
			
		});
		
	}
	
}