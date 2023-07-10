import { Modal } from "../classes/modal.controller.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { ItemMasterDataProfileModal } from "./itemmasterdata.profile.modal.controller.class.js";
import { ItemStockCardModal } from "./itemmasterdata.stockcard.modal.controller.class.js";
import { ItemPriceListModal } from "./itemmasterdata.pricelist.modal.controller.class.js";
import { ItemSalesModal } from "./itemmasterdata.sales.modal.controller.class.js";

export class ItemMasterDataMainModal extends Modal{
	
	constructor ( modalData ){
		super ( modalData );
		this.data = modalData;
		this.empid = session_data.empid;	
		//console.log(modalData);
		this.active = {};
		this.tabs = {
			'itemprofiletab' : {
				obj : ( ) => {
					return new ItemMasterDataProfileModal({
						modalID :  "item-profile-tab",
						controllerName : "itemprofilecontroller",
						template : "/inventory/sources/templates/modal/itemmasterdata.itemprofile.tab.modal.template.html",
						parent : this,
						params : modalData.params,
						isUpdate : modalData.isUpdate,
						arg : modalData,
					});
				},
				initObj : null,
				render : false,
			},
			'itemstockcardtab' : {
				obj : ( ) => {
					return new ItemStockCardModal({
						modalID :  "item-stockcard-tab",
						controllerName : "itemstockcardcontroller",
						template : "/inventory/sources/templates/modal/itemmasterdata.stockcard.tab.modal.template.html",
						parent : this,
						params : modalData.params,
						isUpdate : modalData.isUpdate,
						arg : modalData,
					});
				},
				initObj : null,
				render : false,
			},
			'itempricelisttab' : {
				obj : ( ) => {
					return new ItemPriceListModal({
						modalID :  "item-pricelist-tab",
						controllerName : "itempricelistcontroller",
						template : "/inventory/sources/templates/modal/itemmasterdata.pricelist.tab.modal.template.html",
						parent : this,
						params : modalData.params,
						isUpdate : modalData.isUpdate,
						arg : modalData,
					});
				},
				initObj : null,
				render : false,
			},
			'itemsalestab' : {
				obj : ( ) => {
					return new ItemSalesModal({
						modalID :  "item-sales-tab",
						controllerName : "itemsalescontroller",
						template : "/inventory/sources/templates/modal/itemmasterdata.sales.tab.modal.template.html",
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
		//console.log(this.modalData);
		for ( let i in this.tabs ){
			let sel = this.tabs[i];
			//console.log(i,this.tabs[i]['render']);
			if ( i==args[0]['navigate'] ){
				if (!this.tabs[args[0]['navigate']]['render']){
					this.tabs[args[0]['navigate']]['render'] = true;
					this.active = this.tabs[args[0]['navigate']]['obj']();
					this.tabs[args[0]['navigate']]['initObj'] = this.active;
					this.active.renderDiv(args[0]['navigate']);
				}
			}
			else{
				//console.log(i);
				this.tabs[i]['render'] = false;
				this.tabs[i]['obj']().destroyModal();
			}
			//console.log(i,this.tabs[args[0]['navigate']]['render']);
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
		this.navigate ({navigate:'itemprofiletab'});
		
		if(!this.data.isUpdate){
			//$("#stockcardtab").class("disabled");
			//$("#salestab").class("disabled");
			if(document.getElementById("stockcardtab"))
				document.getElementById("stockcardtab").className = 'disabled';
			if(document.getElementById("salestab"))
				document.getElementById("salestab").className = 'disabled';
		}
		
	}

	initialize(){	
	}
	
}