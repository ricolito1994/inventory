import { Controller } from "../classes/controller.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { CompanySettings } from "./company.settings.controller.js";
import { UserSettings } from "./settings.user.controller.class.js";
import { SystemMaintenance } from "./settings.system.maintenance.controller.class.js";

export class SettingsController extends Controller{
	
	constructor ( controller , service , elem ){
		super ( controller , service , elem );
		
		this[controller] = { 
			empid : session_data.empid,	
			searchentry : '',
		};
		
		this.settings = {
			'settings-company' : {
				obj : ( ) => {
					return new CompanySettings({
						modalID :  "companysettings",
						controllerName : "companysettings",
						template : "/inventory/sources/templates/section/settings.company.template.html",
						parent : this,
					});
				},
				render : false,
			},
			'settings-user' : {
				obj : ( ) => {
					return new UserSettings({
						modalID :  "usersettings",
						controllerName : "usersettings",
						template : "/inventory/sources/templates/section/settings.user.template.html",
						parent : this,
					});
				},
				render : false,
			},
			'settings-maintenance' : {
				obj : ( ) => {
					return new SystemMaintenance({
						modalID :  "sysytemmaintenance",
						controllerName : "sysytemmaintenance",
						template : "/inventory/sources/templates/section/settings.system.maintenance.section.template.html",
						parent : this,
					});
				},
				render : false,
			},
			
		}
		
		
		//console.log("AA");
		this.binds (controller,elem);
		this.bindChildObject(this,false);
		this.initialize();
	}
	
	
	changefilter (){
		this.bindChildObject(this,this.elem);
		this.initialize();
	}
	
	initialize(){
		this.navigate({path:'settings-maintenance'});
	}
	
	navigate (){
		let id  = (arguments[0]['path']);
		let settings = document.querySelectorAll( 'ul.settings-choices li a' );
		
		for ( let i = 0 ; i < settings.length ; i++ ){
			let sel = settings[i];
			
			if(i != 'length'){
				
				if ( id === sel.id && !this.settings[id]['render'] ){ 
					sel.className="active";
					
					this.settings[id]['render'] = true;
					this.settings[id]['obj']().renderDiv('settings-container');
				}
				else{ 
					
					if ( id !== sel.id ){
						sel.className = '';
						
						if(this.settings[sel.id]){
							this.settings[sel.id]['render'] = false;
							this.settings[sel.id]['obj']().destroyModal();
						}
					}
				};
			}
		}
	}
	
	/* additional methods onLeavePage event */
	aggunbind(){
		for ( let i in this.settings ){
			this.settings[i]['render'] = false;
			this.settings[i]['obj']().destroyModal();
		}
	}
	
	
}