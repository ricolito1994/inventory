import { ControllerModule } from "../controller/controller.module.class.js";

export class Route{
	static routes = {
		"" : {
			url : ""+prot+"://"+ipaddress+"/inventory/sources/templates/pages/dashboard.page.template.html",
		},
		
		"settings" : {
			url : ""+prot+"://"+ipaddress+"/inventory/sources/templates/pages/settings.page.template.html",
		},
		
		"itemmasterdata" : {
			url : ""+prot+"://"+ipaddress+"/inventory/sources/templates/pages/itemmasterdata.page.template.html",
		},
		
		"supplier" : {
			url : ""+prot+"://"+ipaddress+"/inventory/sources/templates/pages/supplier.page.template.html",
		},
		
		"warehouse" : {
			url : ""+prot+"://"+ipaddress+"/inventory/sources/templates/pages/warehouse.page.template.html",
		},
		
		"transaction" : {
			url : ""+prot+"://"+ipaddress+"/inventory/sources/templates/pages/transactions.page.template.html",
		},
		"settings" : {
			url : ""+prot+"://"+ipaddress+"/inventory/sources/templates/pages/settings.page.template.html",
		}
		
		
	}
	constructor ( ){
		this.cm = new ControllerModule();
	}
	
	load ( e , path ) {
		//console.log (e);
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function (e) { 
			if (xhr.readyState == 4 && xhr.status == 200) {	
				
				
				if (document.getElementById("container-pages")){
					document.getElementById("container-pages").innerHTML = "";
					document.getElementById("container-pages").innerHTML = xhr.responseText;
				}
			 
				ControllerModule.initializeControllers();
			}
		  }
		
		xhr.open("GET", e, true);
		xhr.setRequestHeader("Cache-Control", "no-cache");
		xhr.setRequestHeader("Pragma", "no-cache");
		xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
		xhr.send();
	}
	
}