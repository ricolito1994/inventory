import { Modal } from "../classes/modal.controller.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";

export class SystemMaintenance extends Modal{
	
	constructor( modalData ){
		super ( modalData );
		this.init ( modalData );
	}
	
	init ( modalData ){
		this.modalData = modalData;
		//this.company_logo = 'sources/images/prof.jpg';
		this.bdata = [];
		this.db_to_backup = {
			inventory : 1,
			
		};
		this.back_up_time = '17:00:00'
		this.date_backup = this.mainService.getCurrentDate();
		this.is_auto_backup_running = 0;
		/* window.onbeforeunload = function () {
			alert("WEW");
			return ("WEW");
		} */
	}
	
	
	getBackUpdetails (){
		return new Promise ( ( resolve , reject ) => {
			
			let request = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : "SELECT * from `inventory`.maintenance where COMPANY_ID = ?",
								db : 'DB',
								query_request : 'GET',
								index : 'm',
								values : [session_data.COMPANY_CODE]
							},	
						]
					}
							
				}
			};

			this.mainService.serverRequest( request , ( res ) => {
				resolve(JSON.parse(res).m);
				
			} 
			, ( res ) => {
				//err
				reject(res);
			});
		})
		
	}
	
	runBackUpDatabase(){
		
		this.bindChildObject ( this , true );
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'backup_database',
					arg : { 
						dbs : this.db_to_backup ,
						desired_directory : `${session_data.COMPANY_DIR}/maintenance`
					}
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

		this.mainService.serverRequest( request , ( res ) => {
			setTimeout(()=>{
				let split = res.split ("/");
				//console.log(res,split)
				load.onClose();
				 var a = document.createElement("a");
				  a.href = res;
				  a.download = split[split.length - 1];
				  a.click();
			},300);
		} 
		, ( res ) => {
			//err
			console.log(res);
		});
	}
	
	restoreDB () {
		let files = $('#file_to_restore').prop('files');
				
		const formData = new FormData();
		formData.append('request','restore_database');
		formData.append('desired_directory',`${session_data.COMPANY_DIR}/maintenance`);

		
		for ( let i in files ){
			formData.append('filedbs[]',files[i]);
		}
		let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : "/inventory/sources/templates/modal/loading.modal.template.html",
			parent : this,
		});
			
		load.render();
		this.mainService.serverRequestFileUpload( 
			{
				type: "POST",
				url : this.mainService.urls["generic"]['url'],
				data : {
						data : {
							//request : 'restore_database',
							formdata : formData,
						}			
					}
			} , 
			( res ) => {
					//MainService.EventObject['mychurchmembers'].dispatch ('mychurchmembers:onUpdateChurchMembers' , {});
					//this.onClose(); 
				load.onClose();
				alert("Your changes has been saved!");
			},err=>{
				console.log(err);
		});
	}
	
	
	async runAutomaticBackup(){
		this.bindChildObject ( this , true );
		
		let bdata = await this.getBackUpdetails();
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'run_auto_backup',
					arg : { 
						desired_directory : `${session_data.COMPANY_DIR}/maintenance`
					}
				}
							
			}
		};
		//console.log(bdata);
		
		if (bdata[0]['IS_AUTO_BACK_UP_RUNNING'] == "1")
		{
			alert("ONLY ONE INSTANCE OF AUTO BACKUP MUST RUN!");
			return 0;
		}
		else{
			//console.log(bdata[0]['IS_AUTO_BACK_UP_RUNNING']);
			this.is_auto_backup_running = 1;
			this.bindChildObject ( this , false );
		}
		
		
		this.saveBackupSetting(1, () => {
			this.mainService.serverRequest( request , ( res ) => {
				//alert("already terminated!");
				this.saveBackupSetting(0 , ()=>{
					this.is_auto_backup_running = bdata[0]['IS_AUTO_BACK_UP_RUNNING'];
					this.bindChildObject ( this , false );
				});
			} 
			, ( res ) => {
				//err
				console.log(res);
			});
		} );	
	}
	
	
	
	
	async saveBackupSetting(  isrunning , callback ){
		this.bindChildObject ( this , true );
		let bdata = await this.getBackUpdetails();
		let autorun = typeof isrunning === "object"  ? 0 : isrunning;
		//console.log(isrunning);
		
		let rqueryinsert =  [
			{
				sql : "INSERT INTO inventory.maintenance (db_to_backup,back_up_time,COMPANY_DIR,COMPANY_ID,IS_AUTO_BACK_UP_RUNNING) VALUES (?,?,?,?,?)",
				query_request: 'INSERT', 
				values : [
					JSON.stringify(this.db_to_backup),
					this.back_up_time,
					session_data.COMPANY_DIR,
					session_data.COMPANY_CODE,
					autorun,
				],
			} 
		];
		let rqueryupdate =  [
			{
				sql : "UPDATE inventory.maintenance SET db_to_backup=?,back_up_time=?,IS_AUTO_BACK_UP_RUNNING=? where COMPANY_ID = ?",
				query_request: 'update', 
				values : [
					JSON.stringify(this.db_to_backup),
					this.back_up_time,
					autorun,
					session_data.COMPANY_CODE,
				
				],
			} 
		]
		//console.log(autorun);
		let request_main_setting = bdata.length == 0 ? rqueryinsert : rqueryupdate ;
		console.log(request_main_setting);
	
		
		let save_request_parameters = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : request_main_setting
				}
						
			}
		};
		//console.log(request_main_setting);
		this.mainService.serverRequest( save_request_parameters , ( res ) => {
			
			if( this.mainService.isFunction(callback) ){
				callback();
			}
			else{
				alert ("Done!");
			}
		
		},err =>{
			console.log(err);
		});
		
	}
	
	
	
	async constructs(){
		let backupdata = await this.getBackUpdetails ( );
		//console.log(backupdata);
		this.bdata = backupdata[0];
		this.db_to_backup = JSON.parse(this.bdata.db_to_backup)
		this.back_up_time = this.bdata.back_up_time
		this.is_auto_backup_running = this.bdata.IS_AUTO_BACK_UP_RUNNING;
		//console.log(this);
		this.binds(this.controllerName,this.elem);
		this.bindChildObject ( this , false );
	}
	
}