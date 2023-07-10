import { Modal } from "../classes/modal.controller.class.js";
import { MainService } from "../classes/main.service.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";

export class UsersModal extends Modal{

	constructor ( modalData ){
		super ( modalData );
		this.init ( modalData );
	}
	
	init ( modalData ){
		this.modalData = modalData;
		this.isUpdate = this.modalData.params.ID ? true : false;
		console.log(this.isUpdate,this.modalData);
		//console.log(this.modalData.params);
		//let age = this.mainService.calculateAge ( this.mainService.getCurrentDatePlus(-10000).toString().split('-'), this.mainService.getCurrentDate().toString().split('-') );
		this.uservars =   {
			COMPANY_CODE : session_data.COMPANY_CODE,
			LASTNAME : '',
			FIRSTNAME : '',
			MIDDLENAME : '',
			USERNAME : this.mainService.makeid(12),
			PASSWORD : this.mainService.makeid(12),
			POSITION : 'Cashier',
			STATUS : 'Active',
			EMAIL : '',
			CONTACT: '',
			DESIGNATION : 'Normal User'
			
		};
		
		this.tempprofpic = '';
		
		if (this.isUpdate){
			for (let x in this.uservars){
				if (this.modalData.params[x] ){
					this.uservars[x] = this.modalData.params[x];
				}
			}
			
			//this.tempprofpic = this.uservars.member_current_profile_pic == '' ? './sources/images/prof.jpg' : this.uservars.member_current_profile_pic ;
			//this.uservars.member_current_profile_pic = '';
		}
		
		//this.memberprofilepic = this.isUpdate ? this.tempprofpic : './sources/images/prof.jpg'	;
		
		
		//this.uservars.member_current_profile_pic = '';
		
	}
	
	
	showpw(){
		//$('#member-password')
		 var x = document.getElementById("member-password");
		  if (x.type === "password") {
			x.type = "text";
		  } else {
			x.type = "password";
		  }
	}
	
	changedob(){
		this.bindChildObject(this,true);
		this.uservars.member_current_age = this.mainService.calculateAge ( this.uservars.member_dob.toString().split('-'), this.mainService.getCurrentDate().toString().split('-') )
		this.uservars.member_age_of_register = this.mainService.calculateAge ( this.uservars.member_dob.toString().split('-'), this.mainService.getCurrentDate().toString().split('-') )
		this.bindChildObject(this,false);
	}
	
	
	
	chooselogo(){
		$('#member_current_profile_pic').click();
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
		  $('#memprofpic').attr('src',e.target.result);
        }

       reader.readAsDataURL(args[1].target.files[0]);
	}
	
	save(){
		this.bindChildObject(this,true);
		
		//this.uservars.member_current_profile_pic = this.uservars.member_current_profile_pic == '' ? this.tempprofpic : `./sources/complist/${session_data.church_dir}/${this.uservars.member_username}/profpic/${this.uservars.member_current_profile_pic.split("\\")[2]}`;
		
		let saveparams = ( ServerRequest.queryBuilder( this.mainService.object2array(this.uservars) , this.isUpdate ? "UPDATE" : "INSERT" ) );
		
		if ( this.isUpdate ) saveparams.values.push(this.modalData.params.ID);
		
		
		let rquery = !this.isUpdate ? [
			{
				sql : "INSERT INTO inventory.user_setup "+saveparams.initial+" VALUES "+saveparams.seconds,
				query_request: 'INSERT', 
				values : saveparams.values,
			} 
		] :
		[
			{
				sql : "UPDATE inventory.user_setup "+saveparams.initial+" WHERE id = ? ",
				query_request: 'UPDATE', 
				values : saveparams.values,
			} 
		];

		
		
		let save_request_parameters = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : rquery
				}
						
			}
		};
		
		//console.log(save_request_parameters);	
		
		//console.log(save_request_parameters);
		this.mainService.serverRequest( save_request_parameters , ( res ) => {
			/* let formData = new FormData();
				formData.append('file',$('#member_current_profile_pic')[0].files[0]);
				formData.append('dir',`${session_data.church_dir}/${this.uservars.member_username}/profpic/`);
				formData.append('createdir',true);
				formData.append('request','file_upload');
		
			this.mainService.serverRequestFileUpload( {
				type: "POST",
				url : this.mainService.urls["generic"]['url'],
				data : {
					data : {
						
						formdata : formData,
					}			
				}
			} , 
			( res ) => {
				MainService.EventObject['mychurchmembers'].dispatch ('mychurchmembers:onUpdateChurchMembers' , {});
				this.onClose(); 
			}); */
			MainService.EventObject['usersettings'].dispatch ('usersettings:onUpdateUser' , {});
			this.onClose(); 
		});
		
	}
	
	constructs(){	
	}
}