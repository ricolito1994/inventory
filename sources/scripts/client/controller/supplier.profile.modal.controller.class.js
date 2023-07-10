import { Modal } from "../classes/modal.controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { MainService } from "../classes/main.service.class.js";


export class SupplierProfileModalController extends Modal{

	constructor ( modalData ){
		super ( modalData );
		this.init ( modalData );
	}
	
	init ( modalData ){
		this.modalData = modalData;
		this.isUpdate = this.modalData.isUpdate;
		//console.log(modalData);
		this.supplierprofile = {
			IMG : 'sources/images/comp.jpg',
			SUPPLIER_NAME : 'Business Partner',
			SUPPLIER_CODE : this.mainService.generate_id_timestamp('SUPPLIER'),
			SUPPLIER_ADDRESS : 'BACOLOD CITY',
			ACCOUNT_CODE : '0-0000',
			DESCRIPTION: 'A trusted Business Partner',
			COMPANY_CODE : session_data.COMPANY_CODE,
			DATE_ENCODED : this.mainService.getCurrentDate(),
			TYPE : 'Customer',
		};
		
		for ( let i in this.supplierprofile ){
			if ( this.modalData.arg.args[0][i] ){
				let sel = this.modalData.arg.args[0][i];
				this.supplierprofile[i] = sel;
			}
		}
		
		
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
							sql : "INSERT INTO inventory.supplier (SUPPLIER_NAME,SUPPLIER_CODE,SUPPLIER_ADDRESS,ACCOUNT_CODE,DESCRIPTION,COMPANY_CODE,DATE_ENCODED,TYPE) VALUES(?,?,?,?,?,?,?,?) ",
							db : 'DB',
							query_request : 'INSERT',
							values : [
								this.supplierprofile.SUPPLIER_NAME,
								this.supplierprofile.SUPPLIER_CODE,
								this.supplierprofile.SUPPLIER_ADDRESS,
								this.supplierprofile.ACCOUNT_CODE,
								this.supplierprofile.DESCRIPTION,
								this.supplierprofile.COMPANY_CODE,
								this.supplierprofile.DATE_ENCODED,
								this.supplierprofile.TYPE,
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
								sql : "update inventory.supplier set SUPPLIER_NAME=?,SUPPLIER_CODE=?,SUPPLIER_ADDRESS=?,ACCOUNT_CODE=?,DESCRIPTION=?,COMPANY_CODE=?,DATE_ENCODED=?,TYPE=? where SUPPLIER_CODE = ? ",
								db : 'DB',
								query_request : 'put',
								values : [
									this.supplierprofile.SUPPLIER_NAME,
									this.supplierprofile.SUPPLIER_CODE,
									this.supplierprofile.SUPPLIER_ADDRESS,
									this.supplierprofile.ACCOUNT_CODE,
									this.supplierprofile.DESCRIPTION,
									this.supplierprofile.COMPANY_CODE,
									this.supplierprofile.DATE_ENCODED,
									this.supplierprofile.TYPE,
									this.supplierprofile.SUPPLIER_CODE,
								]
							},	
						]
					}
							
				}
			};
			
			
		}
	
		
		//console.log(this.unitConversions);
		let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : "/inventory/sources/templates/modal/loading.modal.template.html",
			parent : this,
		});
		//load.render();
		
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
								sql : "select * from inventory.supplier where SUPPLIER_CODE = ? ",
								db : 'DB',
								query_request : 'GET',
								index : 'res',
								values : [
									this.supplierprofile.SUPPLIER_CODE,
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
				MainService.EventObject['supplier'].dispatch ('supplier:onUpdateSupplier' , {
					detail : {
						query : {
							
						}
					} 
				});
				alert("Success!");
			});
			
			
		});
		
	}
	
	constructs(){
	}
	
}