import { Modal } from "../classes/modal.controller.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";


export class CompanySettings extends Modal{
	
	constructor( modalData ){
		super ( modalData );
		this.init ( modalData );
	}
	
	init ( modalData ){
		this.modalData = modalData;
		//this.company_logo = 'sources/images/prof.jpg';
		
		this.general_manager_name = '';
		this.general_manager_position ='';
		
		this.COMPANY = {
			COMPANY_CODE: '',
			COMPANY_NAME : '',
			GENERAL_MANAGER : '',
			BRANCH : '',
			ADDRESS : '',
			COMPANY_LOGO : '',
		}
		
		
	}
	
	chooselogo(){
		$('#companylogo_pic').click();
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
		  $('#companylogo').attr('src',e.target.result);
        }

       reader.readAsDataURL(args[1].target.files[0]);
	}
	
	async constructs(){
		let compdata = await this.getCompanyInformation( session_data.COMPANY_CODE );
		//console.log(compdata);
		for(let i in compdata[0]){
			if(typeof this.COMPANY[i] !== 'undefined')
				this.COMPANY[i] = compdata[0][i];
		}
		
		this.tempprofpic = this.COMPANY.COMPANY_LOGO == '' ? './sources/images/prof.jpg' : `/inventory/sources/complist/${session_data.COMPANY_DIR}/logos/${this.COMPANY.COMPANY_LOGO}`  ;
		
		this.complogo =  this.tempprofpic;
		this.COMPANY.COMPANY_LOGO = '';
		
		this.general_manager_name =compdata[0].general_manager_name;
		this.general_manager_position = compdata[0].general_manager_position;
		
		
		this.bindChildObject(this,false);
	}


	getCompanyInformation ( company_id ){
		return new Promise ( ( resolve , reject ) => {
			let request = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : "SELECT *,CS.ADDRESS ADDRESS,CONCAT(U.FIRSTNAME, ' ',U.MIDDLENAME,' ', U.LASTNAME) as general_manager_name, U.POSITION as general_manager_position from inventory.company_setup CS INNER JOIN inventory.user_setup U ON U.id = CS.general_manager WHERE CS.COMPANY_CODE = ?",
								db : 'DB',
								query_request : 'GET',
								index : 'companyProfile',
								values : [company_id]
							},	
						]
					}
							
				}
			};

			this.mainService.serverRequest( request , ( res ) => {
				resolve(JSON.parse(res).companyProfile);
				
			} 
			, ( res ) => {
				//err
				reject(res);
			});
		});
	}

	
	

	save(){
		
		
		
		this.bindChildObject(this,true);
		
		this.COMPANY.COMPANY_LOGO = this.COMPANY.COMPANY_LOGO == '' ? this.tempprofpic : this.COMPANY.COMPANY_LOGO.split("\\")[2];
		
		
		let saveparams = ( ServerRequest.queryBuilder( this.mainService.object2array(this.COMPANY) , "UPDATE"  ) );
	
		saveparams.values.push(this.COMPANY.COMPANY_CODE);
		
		
		
		let request = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : "UPDATE inventory.company_setup "+saveparams.initial+" WHERE COMPANY_CODE = ? ",
								query_request: 'UPDATE', 
								values : saveparams.values,
							} 	
						]
					}
							
				}
		};
		
		this.mainService.serverRequest( request , ( res ) => {
			//alert("Update Success! Changes will apply next log in!");
			let formData = new FormData();
					formData.append('file',$('#companylogo_pic')[0].files[0]);
					formData.append('dir',`${session_data.COMPANY_DIR}/logos/`);
					formData.append('createdir',true);
					formData.append('request','file_upload');
				
				
				//console.log(formData);
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
					//MainService.EventObject['mychurchmembers'].dispatch ('mychurchmembers:onUpdateChurchMembers' , {});
					//this.onClose(); 
					alert("Your changes has been saved! Changes may apply after your next login.");
				},err=>{
					console.log(err);
				});
		} 
		, ( res ) => {
			//err
		});
	}
	
}