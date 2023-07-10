/* import your classes here */
import { TopnavController } from "./topnav.controller.class.js";
import { DashboardController } from "./dashboard.controller.class.js";
import { ItemMasterDataController } from "./itemmasterdata.controller.class.js";
import { SupplierController } from "./supplier.controller.class.js";
import { WarehouseController } from "./warehouse.controller.class.js";
import { TransactionController } from "./transaction.controller.class.js";
import { SettingsController } from "./settings.controller.class.js";
import { LoginPage } from "./login.page.js";
import { MainService } from "../classes/main.service.class.js";


export class ControllerModule {
	
	static controllers = {
		"topnav" : {
			controller : TopnavController,
			init : false,
			elem : ".topnav",
			initobj : null,
			
		},
		"dashboard" :  {
			controller : DashboardController,
			init : false,
			elem : ".dashboard",
			initobj : null,
			current : false,
		},
		
		"itemmasterdata" :  {
			controller : ItemMasterDataController,
			init : false,
			elem : ".itemmasterdata",
			initobj : null,
			current : false,
		},
		
		"supplier" :  {
			controller : SupplierController,
			init : false,
			elem : ".supplier",
			initobj : null,
			current : false,
		},
		
		"warehouse" :  {
			controller : WarehouseController,
			init : false,
			elem : ".warehouse",
			initobj : null,
			current : false,
		},
		
		"transaction" :  {
			controller : TransactionController,
			init : false,
			elem : ".transaction",
			initobj : null,
			current : false,
		},
		
		"settings" :  {
			controller : SettingsController,
			init : false,
			elem : ".settings",
			initobj : null,
			current : false,
		},
		
		"loginpage" :  {
			controller : LoginPage,
			init : false,
			elem : ".login",
			initobj : null,
			current : false,
		},

		
		
	}
	
	
	static Service = new MainService ( '/inventory/sources' );
	constructor (){
		//alert("aaahhss");
		//console.log(ControllerModule.Service);
	}

	static initializeControllers (){
		
		let controllerDOM = document.querySelectorAll ( 'div' );
		
		for ( let divctrl in controllerDOM ){
			if (controllerDOM[divctrl]['dataset']){
				let controller = controllerDOM[divctrl]['dataset']['controller'];
				if ( controller ){
					setTimeout ( ( ) => {
						if ( !ControllerModule.controllers[controller]['init'] || controller != 'topnav' ){
							ControllerModule.controllers[controller]['init'] = true;
							//console.log(controller,ControllerModule.controllers[controller]['init'])
							let elem = ControllerModule.controllers[controller]['elem'];
							
							if(controller !== 'loginpage'){
								//ControllerModule.Service['socketclient'] = ControllerModule.SocketClient;
								//console.log('conn');
								//turn on socket
								ControllerModule.Service.socketON();
							}
							else{
								
							}
							
							/* refresh controllers */
							if (ControllerModule.controllers[controller]['initObj'])
								ControllerModule.controllers[controller]['initObj'].unbinds();
							
							let ctr = new ControllerModule.controllers[controller]['controller'](controller,ControllerModule.Service,elem)
							//console.log(ctr);
							//ctr.binds (controller,elem);
							//console.log ( ctr );
							//ControllerModule.controllers[controller]['current'] = true;
							//controller object
							ControllerModule.controllers[controller]['initObj'] = ctr;
						}
					},300);
				}
				
			}
		}
		//console.log(ControllerModule.controllers);
		return;
		
	}
	/**/

}


