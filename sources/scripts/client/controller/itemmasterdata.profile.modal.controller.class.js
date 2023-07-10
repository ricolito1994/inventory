import { Modal } from "../classes/modal.controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { MainService } from "../classes/main.service.class.js";


export class ItemMasterDataProfileModal extends Modal{

	constructor ( modalData ){
		super ( modalData );
		this.init ( modalData );
	}
	
	
	async constructs(){
		if (this.isUpdate){
			let itemdetails = await this.getItemDetails()
			for ( let i in this.itemprofile ){
				if ( itemdetails[i] ){
					//console.log('itemdet',i,itemdetails[i]);
					let sel = itemdetails[i];
					this.itemprofile[i] = sel;
				}
			}
			this.unitConversions = this.itemprofile['UNIT'];
			this.suppcode = this.itemprofile.SUPPLIER_CODE;
			
		}
		let categories = await this.getCategory();
		let categorySelect = document.querySelector("#item-category")
		for (let i in categories.CAT) {
			let sel = categories.CAT[i];
			let opt = document.createElement('option');
				opt.value = sel.ID;
				opt.innerText = sel.NAME;
			categorySelect.appendChild(opt);
		}

		this.tempprofpic = this.itemprofile.ITEM_IMAGE == '' ? './sources/images/item.png' : `${this.itemprofile.ITEM_IMAGE}`;
		this.itemtemppic =  this.tempprofpic;
		this.itemprofile.ITEM_IMAGE = '';
		//this.displayUnit ();
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject(this,false);
	}
	
	init ( modalData ){
		this.modalData = modalData;
		this.isUpdate = this.modalData.isUpdate;
		//console.log(modalData);
		//alert(this.isUpdate);
		this.itemprofile = {
			ITEM_IMAGE : '',
			ITEM_NAME : 'ITEM',
			ITEM_CODE : this.mainService.generate_id_timestamp('ITEM'),
			ITEM_DESCRIPTION : 'It is an item',
			ACCOUNT_CODE : '0-00000',
			SUPPLIER_CODE : 'SUPPLIER01',
			SUPPLIER_NAME : 'My Customer',
			COMPANY_CODE : session_data.COMPANY_CODE,
			DATE_ENCODED : this.mainService.getCurrentDate(),
			EXPIRY_DATE : '',
			//LOT_NUMBER : '',
			ALERT_QTY : 0,
			UNIT : '',
			ALERT_BEFORE_EXPIRY : 6,
			CATEGORY : 1,
		};
		//console.log('aaa',this.modalData.arg.args[0]);
		for ( let i in this.itemprofile ){
			if ( this.modalData.arg.args[0][i] ){
				let sel = this.modalData.arg.args[0][i];
				this.itemprofile[i] = sel;
			}
		} 
		this.unitConversions = [
			{
				UNIT_NAME : 'Base Unit',
				COST_PER_UNIT : 1,
				SELLING_PRICE_PER_UNIT : 1,
				ITEM_CODE : this.itemprofile.ITEM_CODE,
				IS_EQUAL_TO : '',
				QTY : 1,
				PARENT_QTY:'',
				IS_BASE_UNIT:true,
				HEIRARCHY : 0,
				DATE_ENCODED: this.mainService.getCurrentDate(),
				COMPANY_CODE : session_data.COMPANY_CODE,
				UNIT_CONVERSION_ID : this.itemprofile.ITEM_CODE+'_'+this.mainService.generate_id_timestamp('UNIT'),
			}
		];
		if (this.modalData.arg.args[0]['UNIT']){
			if (this.modalData.arg.args[0]['UNIT'].length > 0){
				this.unitConversions = this.modalData.arg.args[0]['UNIT'];
			}
		}	
		this.suppcode = this.itemprofile.SUPPLIER_CODE;
		//console.log(this.itemprofile);
	}

	getCategory () {
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
														
						{
							sql : "SELECT * FROM inventory.category WHERE  ? ",
							db : 'DB',
							query_request : 'GET',
							index : 'CAT',
							values : [
								1,
							],

						},
																												
					]
				}
														
			}
		};
		
		
		return new Promise ( ( resolve , reject ) => {
			this.mainService.serverRequest( request , ( res ) => {
				res = JSON.parse(res);
				resolve(res)						
			},err => {
				reject(err);
			});
		});
	}
	
	chooselogo(){
		$('#itemimage_pic').click();
	}
	
	churchprofpicchange(...args){
		//console.log(args[1].target.files[0]);
		var reader = new FileReader();
		//this.bindChildObject(this,true);
		//this.churchlogofile = 'sdasd';
		//this.bindChildObject(this,true);
		//this.binds (this.controllerName,this.elem);
        reader.onload = (e) => {
          //  $('#img').attr('src', e.target.result);
		  // console.log(e);
		  //this.churchlogo = e.target.result;
		  //this.binds (this.controllerName,this.elem);
		 // this.bindChildObject(this,true);
		  //this.bindChildObject(this,false);
		 //this.bindChildObject(this,true)
		  $('#itemimage').attr('src',e.target.result);
        }

       reader.readAsDataURL(args[1].target.files[0]);
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
	

	
	openSupplier(){
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/inventory/sources/templates/modal/search.modal.template.html",
			params : {
				type : "supplier",
				action : 'link',
				controller : 'itemprofilecontroller',
				evt : ':onLinkSupplier',
			},
			parent : this,
		});
		ssm.render();
	}
	
	onLinkSupplier( ...arg ) {
		let detail = arg[0].detail.query;
		this.itemprofile.SUPPLIER_CODE = detail.id;
		this.itemprofile.SUPPLIER_NAME = detail.arg;
		this.bindChildObject ( this , false );
	}
	
	removeUnit ( ...args ){
		if ( confirm ("Are you sure you want to remove this unit?" ) ){
			let index = this.unitConversions.findIndex ( x => x.ITEM_CODE == args[0].ITEM_CODE && x.UNIT_NAME == args[0].UNIT_NAME );
			this.unitConversions.splice(index);
			this.displayUnit ( );
			//this.appendBinds("#item-profile-modal-unit-table");
			this.binds(this.controllerName,'#'+this.modalID);
			this.bindChildObject ( this , false );
		}
	}
	
	changeunitvalues(){
		this.bindChildObject ( this , true );
	}
	
	
	addUnit ( ){
		setTimeout(()=>{
			this.unitConversions.push ({
				UNIT_NAME : 'UNIT'+this.unitConversions.length,
				COST_PER_UNIT : 5,
				SELLING_PRICE_PER_UNIT : 10,
				ITEM_CODE : this.itemprofile.ITEM_CODE,
				IS_EQUAL_TO : this.unitConversions[this.unitConversions.length - 1]['UNIT_NAME'],
				QTY : 10,
				PARENT_QTY:1,
				IS_BASE_UNIT:false,
				HEIRARCHY : (parseInt(this.unitConversions[this.unitConversions.length - 1]['HEIRARCHY']) + 1),
				DATE_ENCODED: this.mainService.getCurrentDate(),
				COMPANY_CODE : session_data.COMPANY_CODE,
				UNIT_CONVERSION_ID : this.itemprofile.ITEM_CODE+'_'+this.mainService.generate_id_timestamp('UNIT'),
				SUPPLIER_CODE : this.itemprofile.SUPPLIER_CODE,
			});
			this.displayUnit ( );
			this.binds(this.controllerName,'#'+this.modalID);
			this.bindChildObject ( this , false );	
		},500);
	}
	

	
	save (){
		this.bindChildObject(this,true);
		
		
		this.itemprofile.ITEM_IMAGE = this.itemprofile.ITEM_IMAGE == '' ? this.itemtemppic : `/inventory/sources/complist/${session_data.COMPANY_DIR}/itemimage/${this.itemprofile.ITEM_CODE}/profpic/${this.itemprofile.ITEM_IMAGE.split("\\")[2]}`;
		//console.log(this.itemprofile.ITEM_IMAGE.split("/"));
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : "INSERT INTO inventory.item_master_data (ITEM_IMAGE,ITEM_CODE,ITEM_NAME,SUPPLIER_CODE,DATE_ENCODED,COMPANY_CODE,ITEM_DESCRIPTION,ALERT_QTY,EXPIRY_DATE,ALERT_BEFORE_EXPIRY,CATEGORY) VALUES(?,?,?,?,?,?,?,?,?,?,?) ",
							db : 'DB',
							query_request : 'INSERT',
							values : [
								this.itemprofile.ITEM_IMAGE,
								this.itemprofile.ITEM_CODE,
								this.itemprofile.ITEM_NAME,
								this.itemprofile.SUPPLIER_CODE,
								this.itemprofile.DATE_ENCODED,
								this.itemprofile.COMPANY_CODE,
								this.itemprofile.ITEM_DESCRIPTION,
								this.itemprofile.ALERT_QTY,
								this.itemprofile.EXPIRY_DATE,
								this.itemprofile.ALERT_BEFORE_EXPIRY,
								this.itemprofile.CATEGORY,
							]
						},
						{
							sql : "INSERT INTO inventory.`item_in_warehouse` (ITEM_CODE,WAREHOUSE_CODE,QUANTITY,TOTAL_QUANTITY,UNIT_CONVERSION_ID,QTY_AS_OF,COMPANY_CODE) VALUES(?,?,?,?,?,?,?) ",
							db : 'DB',
							query_request : 'INSERT',
							values : [
								this.itemprofile.ITEM_CODE,
								'W01',
								0,
								0,
								this.unitConversions[0]['UNIT_CONVERSION_ID'],
								this.itemprofile.DATE_ENCODED,
								this.itemprofile.COMPANY_CODE,
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
								sql : "update inventory.item_master_data set ITEM_IMAGE=?,ITEM_CODE=?,ITEM_NAME=?,SUPPLIER_CODE=?,DATE_ENCODED=?,COMPANY_CODE=?,ITEM_DESCRIPTION=?,ALERT_QTY=?,EXPIRY_DATE=?,ALERT_BEFORE_EXPIRY=?,CATEGORY=? where ITEM_CODE = ? ",
								db : 'DB',
								query_request : 'put',
								values : [
									this.itemprofile.ITEM_IMAGE,
									this.itemprofile.ITEM_CODE,
									this.itemprofile.ITEM_NAME,
									this.itemprofile.SUPPLIER_CODE,
									this.itemprofile.DATE_ENCODED,
									this.itemprofile.COMPANY_CODE,
									this.itemprofile.ITEM_DESCRIPTION,
									this.itemprofile.ALERT_QTY,
									this.itemprofile.EXPIRY_DATE,
									this.itemprofile.ALERT_BEFORE_EXPIRY,
									this.itemprofile.CATEGORY,
									this.itemprofile.ITEM_CODE,
								]
							},	
						]
					}
							
				}
			};
			
			
		}
		else{
			
		}
		
		//console.log(this.suppcode , this.itemprofile.SUPPLIER_CODE);
		
		if(this.suppcode == this.itemprofile.SUPPLIER_CODE){
			request.data.data.REQUEST_QUERY.push({
				sql : "DELETE FROM inventory.unit where ITEM_CODE = ?",
				db : 'DB',
				query_request : 'DEL',
				values : [this.itemprofile.ITEM_CODE],
			});
		}
		
		for ( let i in this.unitConversions ){
			let sel = this.unitConversions[i];
			request.data.data.REQUEST_QUERY.push({
				sql : "INSERT INTO inventory.unit "+
				"(UNIT_NAME, COST_PER_UNIT, SELLING_PRICE_PER_UNIT, ITEM_CODE, IS_EQUAL_TO, QTY, PARENT_QTY, IS_BASE_UNIT, HEIRARCHY, DATE_ENCODED, COMPANY_CODE,UNIT_CONVERSION_ID,SUPPLIER_CODE) "+
				"VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ",
				db : 'DB',
				query_request : 'INSERT',
				values : [
					sel['UNIT_NAME'],
					sel['COST_PER_UNIT'],
					sel['SELLING_PRICE_PER_UNIT'],
					sel['ITEM_CODE'],
					sel['IS_EQUAL_TO'],
					sel['QTY'],
					sel['PARENT_QTY'],
					sel['IS_BASE_UNIT'],
					sel['HEIRARCHY'],
					sel['DATE_ENCODED'],
					sel['COMPANY_CODE'],
					sel['UNIT_CONVERSION_ID'],
					this.itemprofile.SUPPLIER_CODE,
				]
			});
		}
		
		//console.log(this.unitConversions);
		let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : "/inventory/sources/templates/modal/loading.modal.template.html",
			parent : this,
		});
		//load.render();
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
								sql : "select * from inventory.item_master_data where ITEM_CODE = ? ",
								db : 'DB',
								query_request : 'GET',
								index : 'res',
								values : [
									this.itemprofile.ITEM_CODE,
								]
							},	
						]
					}
							
				}
			};
			
			
			
			this.mainService.serverRequest( request1 , ( res ) => {
				res = JSON.parse(res).res;
				//console.log(res);
				this.modalData.args = res;
				this.modalData.isUpdate = true;
				this.init(this.modalData);
				//load.onClose();
				
				let formData = new FormData();
					formData.append('file',$('#itemimage_pic')[0].files[0]);
					formData.append('dir',`${session_data.COMPANY_DIR}/itemimage/${res[0].ITEM_CODE}/profpic/`);
					formData.append('createdir',true);
					formData.append('request','file_upload');
				
					
				this.mainService.serverRequestFileUpload( {
					type: "POST",
					url : this.mainService.urls["generic"]['url'],
					data : {
						data : {
							//request : 'file_upload',
							formdata : formData,
						}			
					}
				} , 
				( res ) => {
					//console.log('rerere',res)
					MainService.EventObject['itemmasterdata'].dispatch ('itemmasterdata:onUpdateItems' , {
						detail : {
							query : {
								
							}
						} 
					});
					
					alert("Success!");
					this.onClose();
					this.parent.onClose();
				});
			
					
				
				
			});
			
			
		});
		
	}
	
	
	
	

	
	displayUnit ( ){
		let table = document.querySelector("#item-profile-modal-unit-table tbody");
			table.innerHTML = "";
		let s = this.unitConversions.length > 2 ? 1 : 0;
		//console.log(this.unitConversions);
		for ( ; s < this.unitConversions.length ; s++ ){
			if (s > 0){
				let sel =  this.unitConversions[s];
				let tr = document.createElement ("tr");
				let dsp = [
					'UNIT_NAME',
					'QTY',
					'IS_EQUAL_TO',
					'PARENT_QTY',
					'COST_PER_UNIT',
					'SELLING_PRICE_PER_UNIT',
					
				];
				for ( let t in dsp ){
					let td = document.createElement ("td");
					let input = document.createElement("input");
						input.type='text';
						input.setAttribute('class','form-control');
						input.setAttribute('data-valuectrl','unitConversions.'+s+'.'+dsp[t]);
						input.setAttribute('data-event','itemprofilecontroller.keyup.changeunitvalues');
					//console.log(sel);
					td.appendChild(input);
					tr.appendChild(td);
				}
				
				let td = document.createElement ("td");
				let a = document.createElement("a");
					a.href='javascript:void(0)';
					a.setAttribute('class','btn btn-danger');
					a.setAttribute('data-event','itemprofilecontroller.click.removeUnit');
					
					a.setAttribute('data-params','{"UNIT_NAME":"'+sel['UNIT_NAME']+'","ITEM_CODE":"'+sel['ITEM_CODE']+'"}');
					let it = document.createElement('i');
						it.setAttribute("class","icon-remove");
					a.appendChild(it);
				//console.log(sel);
				td.appendChild(a);
				tr.appendChild(td);
				table.appendChild(tr);	
			}
		}
		
	}
	
}