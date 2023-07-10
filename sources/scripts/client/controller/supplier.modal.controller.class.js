import { Modal } from "../classes/modal.controller.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { SupplierProfileModalController } from "./supplier.profile.modal.controller.class.js";

export class SupplierMainModal extends Modal{
	
	constructor ( modalData ){
		super ( modalData );
		
		this.empid = session_data.empid;	
		//console.log(modalData);
		this.active = {};
		this.tabs = {
			'supplierprofile_tab' : {
				obj : ( ) => {
					return new SupplierProfileModalController({
						modalID :  "supplier-profile-tab",
						controllerName : "supplierprofile",
						template : "/inventory/sources/templates/modal/supplier.profile.modal.template.html",
						parent : this,
						params : modalData.params,
						isUpdate : modalData.isUpdate,
						arg : modalData,
					});
				},
				initObj : null,
				render : false,
			},
			
		}
		
		
		this.initialize();
		this.init ( modalData );
	}
	
	init ( modalData ){
		this.modalData = (modalData);
	}
	
	
	
	navigate ( ...args ){
		for ( let i in this.tabs ){
			let sel = this.tabs[i];
			if ( i==args[0]['navigate'] ){
				//console.log(args[0]['navigate']);
				if (!this.tabs[args[0]['navigate']]['render']){
					this.tabs[args[0]['navigate']]['render'] = true;
					this.active = this.tabs[args[0]['navigate']]['obj']();
					this.tabs[args[0]['navigate']]['initObj'] = this.active;
					this.active.renderDiv(args[0]['navigate']);
				}
			}
			else{
				//console.log("WEW");
				this.tabs[i]['render'] = false;
				this.tabs[i]['obj']().destroyModal();
			}
		}
	}
	
	closeProfileModal (){
		for(let i in this.tabs){
			if(this.tabs[i]['initObj'])
			this.tabs[i]['initObj'].onClose();
		}
		//this.active.onClose();
		this.onClose();
	}
	
	constructs(){
		this.navigate ({navigate:'supplierprofile_tab'});
	}

	initialize(){	
	}
	
}