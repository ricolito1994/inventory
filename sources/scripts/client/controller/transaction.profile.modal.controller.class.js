import { Modal } from "../classes/modal.controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { MainService } from "../classes/main.service.class.js";


export class TransactionProfileModalController extends Modal{

	constructor ( modalData ){
		super ( modalData );
		this.init ( modalData );
	}

	init ( modalData ){
		this.modalData = modalData;
		this.isUpdate = modalData.isUpdate  ;
		
	
		//console.log(this.modalData);
		//console.log(this.modalData.arg.args[0]['TYPE']);
		this.transactionProfile = {
			DOC_ID : this.mainService.generate_id_timestamp(this.modalData.arg.args[0]['TYPE']),
			REFFERENCE_DOC_ID : '',
			ACCOUNT_CODE : '',
			DATE_ENCODED : this.mainService.getCurrentDate(),
			DOCUMENT_DATE : this.mainService.getCurrentDate(),
			TYPE : this.modalData.arg.args[0]['TYPE'],
			STATUS : 'Open',
			DESCRIPTION : 'A transaction',
			COMPANY_CODE : session_data.COMPANY_CODE,
			SUPPLIER_ID : 'SUPPLIER1611190040',
			SUPPLIER_NAME : '-',
			TOTAL_PRICE : 0,
			TOTAL_COST : 0,
			STOCK_IN_OUT : this.modalData.arg.args[0]['STOCK_IN_OUT'],
			WAREHOUSE_CODE : 'W01',
			WAREHOUSE_NAME : 'MAIN WAREHOUSE',
		}
		
		
		
		

		/* this.itemdetailspre = {
			ITEM_CODE : '',
			ITEM_NAME : '',
			QUANTITY : 1,
			UNIT_CONVERSION_ID : '',
			UNIT_NAME : '',
			DOC_ID : '',
			COST_PER_UNIT : 0,
			SELLING_PRICE_PER_UNIT : 0,
			TOTAL_COST : 0,
			TOTAL_PRICE : 0,
			DATE_ENCODED : '',
			
		} */
		this.itemdetails = []
		this.l = {
			'Delivery' : {
				dnum: 'DR No.',
				ddate : 'Delivery Date',
			},
			'Return by Customer' :{
				dnum: 'Return No.',
				ddate : 'Return Date',
			},
			'Return to Supplier' :{
				dnum: 'Return No.',
				ddate : 'Return Date',
			},
			'Sales Invoice' :{
				dnum: 'OR No.',
				ddate : 'Paid Date',
			},
			
		}
		
		//console.log(this.transactionProfile);
		this.labels = {
			docnum : this.l[this.transactionProfile.TYPE].dnum,
			docdate :  this.l[this.transactionProfile.TYPE].ddate,
		}
		
		for (let i in this.modalData.arg.args[0]){
			let sel = this.modalData.arg.args[0][i];
			//console.log(i,sel);
			//if (this.transactionProfile[i]){
				//console.log(i,this.transactionProfile[i]);
				
				this.transactionProfile[i] = sel;
			//}
		}
	
		
		if (this.modalData.arg.args[0]['ITEM_DETAILS']){
			for (let i in this.modalData.arg.args[0]['ITEM_DETAILS']){
				let sel = this.modalData.arg.args[0]['ITEM_DETAILS'][i];
				sel['UNIT_VALS'] = [];
				for(let u in this.modalData.arg.args[0]['UNIT_VALS']){
					let s = this.modalData.arg.args[0]['UNIT_VALS'][u];
					if (s.ITEM_CODE == sel.ITEM_CODE){
						sel['UNIT_VALS'][s.UNIT_NAME] = s;
					}
					//console.log('1 > ',s.UNIT_CONVERSION_ID, '2 > ' , sel.UNIT_CONVERSION_ID);
					if (s.UNIT_CONVERSION_ID == sel.UNIT_CONVERSION_ID){
						sel['UNIT_NAME'] = s.UNIT_NAME;
					}
					
				}
				this.itemdetails.push(sel);
			}
		}
		
		if ( this.modalData.arg.args[0].REPLACE_DOCUMENT ){
			this.isUpdate = false;
			//this.
			this.itemDetailsContainer = this.modalData.arg.args[0]['ITEM_DETAILS'];
			this.itemInWarehouseDetails = this.modalData.arg.args[0]['ITEM_DETAILS_IN_WAREHOUSE'];
			//this.transactionProfile.TYPE = 'Replacement';
			this.transactionProfile.STATUS = 'Open';
			this.transactionProfile.DESCRIPTION = `A replacement document to "${this.modalData.arg.args[0]['DOC_ID']}"`;
			this.transactionProfile.DOC_ID = this.mainService.generate_id_timestamp(this.modalData.arg.args[0]['TYPE']);
		}
		//console.log(this.itemdetails);
		//console.log(this.modalData.arg.args[0]);
		
		
		
	}
	
	/*dont remove*/
	async constructs(){
		if(this.modalData.isUpdate){
			this.displayItems ( );
			let cust = await this.getCustomerData(this.transactionProfile.SUPPLIER_ID);
			//	console.log(cust);
			this.transactionProfile.SUPPLIER_NAME = cust.SUPPLIER_NAME;
			//setTimeout(()=>{
				
			this.bindChildObject ( this , false );
			//},1000);
		}
	}
	
	addItem (){
		this.bindChildObject ( this , true );
		this.itemdetails.push ( {
				ITEM_CODE : '',
				ITEM_NAME : '',
				QUANTITY : 1,
				REGULAR : 0,
				DEAL : 1,
				STOCK_IN_OUT : this.transactionProfile.STOCK_IN_OUT,
				UNIT_NAME : '',
				DOC_ID : this.transactionProfile.DOC_ID ,
				COST_PER_UNIT : 0,
				SELLING_PRICE_PER_UNIT : 0,
				TOTAL_COST : 0,
				TOTAL_PRICE : 0,
				DATE_ENCODED : '',	
				UNIT_VALS : [],
				UNIT_CONVERSION_ID : '',
				COMPANY_CODE : session_data.COMPANY_CODE,
				LOT_NUMBER : '',
				EXPIRY_DATE : '',
			});
			this.newItems();
		setTimeout(()=>{
			
			this.binds(this.controllerName,'#'+this.modalID);
			this.bindChildObject ( this , false );
		},100);
	}
	
	searchItem( args ){
		//console.log(args);
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/inventory/sources/templates/modal/search.modal.template.html",
			params : {
				type : "itemmasterdata",
				action : 'link',
				controller : 'transactionprofilecontroller',
				evt : ':onLinkItem',
				arg : args,
			},
			parent : this,
		});
		ssm.render();
	}
	
	onLinkItem( ...arg ) {
		let detail = arg[0].detail.query;
		let index = detail.args.arg.index;
		//console.log(index,detail.args.arg,arg)
		//console.log(arg[0].detail);
		let index1 = this.itemdetails.findIndex ( x => (x.ITEM_CODE == detail.arg.ITEM_CODE) );
		console.log(detail);
		this.itemdetails[index]['ITEM_CODE'] = detail.arg.ITEM_CODE;
		
		//console.log(this.itemdetails[index]);
		
		this.getStocksOnhandWexpLot(this.itemdetails[index]).then( ( res ) => {
			//console.log(res);
			let r = res.stock;
			let s = res.stock_all;
			//console.log(r,s);
			
			detail.arg['QTY_AS_OF'] = r[0] ? r[0]['QUANTITY'] : s[0]['QUANTITY'];
			detail.arg['QTY_AS_OF_T'] = r[0] ? r[0]['TOTAL_QUANTITY'] : s[0]['TOTAL_QUANTITY'];
			
			if ( r[0] && s[0] ){
				//detail.arg['QTY_AS_OF'] = r[0] ? r[0]['QUANTITY'] : s[0]['QUANTITY'];
				detail.arg['QTY_AS_OF_T'] =  s[0]['TOTAL_QUANTITY'];
			}
			
			
			
			
			//console.log(s);
			
			if (this.transactionProfile.STOCK_IN_OUT == 0 &&  detail.arg.QUANTITY == 0 ){
				alert("You cannot stock out this item its quantity is 0!");
				return;
			}
			
			
			
			/* if ( index1 == -1 ){ */
				this.populateSelectUnit(detail);
			/* }else{
				alert("This item is already on the list!");
				return;
			} */
		})
		.catch ( err => {
			console.log(err);
		});
		
	}
	
	getStocksOnhandWexpLot ( details ){
		//console.log( details.LOT_NUMBER , details.EXPIRY_DATE );
		//console.log(`DE`,details);
		let ln = details.LOT_NUMBER !== "" ? ' and iiw.LOT_NUMBER = "'+details.LOT_NUMBER+'" ' : ' and iiw.LOT_NUMBER = "'+''+'" ';
		let ex = details.EXPIRY_DATE !== "" ? ' and iiw.EXPIRY_DATE = "'+details.EXPIRY_DATE+'" ' : ' and iiw.EXPIRY_DATE = "'+'0000-00-00'+'" ';
		/* let ln =  '  LOT_NUMBER = "'+details.LOT_NUMBER+'" ' ;
		let ex =  '  EXPIRY_DATE = "'+details.EXPIRY_DATE+'" '; */
	
		//console.log(this.itemInWarehouseDetails[0][`ITEM_IN_WH_ID`]);
		
		let reqArray = [
			{
				sql : "select * from inventory.item_in_warehouse  where ID = (SELECT MAX(iiw.ID) FROM inventory.item_in_warehouse iiw  where iiw.COMPANY_CODE = ? and iiw.WAREHOUSE_CODE = ? and iiw.ITEM_CODE = ? and iiw.QUANTITY >= 0  "+ln+" "+ex+" and iiw.IS_CANCELLED != 1 ) ",
				db : 'DB',
				query_request : 'GET',
				index : 'stock',
				values : [
					session_data.COMPANY_CODE,
					'W01',
					details.ITEM_CODE,
				]
			},	
			{
				sql : "select * from inventory.item_in_warehouse  where ID = (SELECT MAX(iiw.ID) FROM inventory.item_in_warehouse iiw where iiw.COMPANY_CODE = ? and iiw.WAREHOUSE_CODE = ? and iiw.ITEM_CODE = ?  and iiw.TOTAL_QUANTITY >= 0 and iiw.IS_CANCELLED != 1 )",
				db : 'DB',
				query_request : 'GET',
				index : 'stock_all',
				values : [
					session_data.COMPANY_CODE,
					'W01',
					details.ITEM_CODE,
				]
			},	
		];
		
		
		if ( this.modalData.arg.args[0].REPLACE_DOCUMENT ){
			//	console.log(this.itemInWarehouseDetails[0][`ITEM_IN_WH_ID`]);
			reqArray = [
			{
				sql : "select *,iiw.ID AS ID,iiw.EXPIRY_DATE AS EXPIRY_DATE from inventory.item_in_warehouse iiw INNER JOIN inventory.alter_document ad ON ad.DOC_ID=iiw.DOC_ID  where iiw.ID < ? and iiw.COMPANY_CODE = ? and iiw.WAREHOUSE_CODE = ? and iiw.ITEM_CODE = ? and iiw.QUANTITY >= 0  "+ln+" "+ex+" and ad.STATUS != 'Cancelled' ",
				db : 'DB',
				query_request : 'GET',
				index : 'stock',
				values : [
					this.itemInWarehouseDetails[0][`ITEM_IN_WH_ID`],
					session_data.COMPANY_CODE,
					'W01',
					details.ITEM_CODE,
				]
			},	
			{
				sql : "select *,iiw.ID AS ID from inventory.item_in_warehouse iiw INNER JOIN inventory.alter_document ad ON ad.DOC_ID=iiw.DOC_ID where iiw.ID < ? and iiw.COMPANY_CODE = ? and iiw.WAREHOUSE_CODE = ? and iiw.ITEM_CODE = ?  and iiw.TOTAL_QUANTITY >= 0 and ad.STATUS != 'Cancelled' ORDER BY iiw.ID DESC LIMIT 1",
				db : 'DB',
				query_request : 'GET',
				index : 'stock_all',
				values : [
					this.itemInWarehouseDetails[0][`ITEM_IN_WH_ID`],
					session_data.COMPANY_CODE,
					'W01',	
					details.ITEM_CODE,
				]
			},	
		];
		}
		
		//console.log(ln,ex);
		return new Promise ( ( resolve , reject ) => {
			let request1 = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : reqArray,
					}
								
				}
			};
			//console.log(request1);
				
			this.mainService.serverRequest( request1 , ( res ) => {
				let stck = JSON.parse(res);
				console.log(request1,stck);
				resolve(stck);
			});
		});
	}
	
	populateSelectUnit (detail){
		console.log('dets',detail);
		let request = {
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
								detail.arg.ITEM_CODE,
								detail.arg.SUPPLIER_CODE,
							],

						},
														
																												
					]
				}
														
			}
		};

		this.mainService.serverRequest( request , ( res ) => {
			//console.log(detail.args.arg);
			res = JSON.parse(res);
			res = res.UNIT;
			let selunit = document.querySelector('#UNIT_NAME-'+detail.args.arg.index);
				selunit.innerHTML = "";
			for ( let i in res ){
				let sel = res[i];
				let opt = document.createElement('option');
					opt.innerText = sel['UNIT_NAME'];
					selunit.appendChild(opt);
				this.itemdetails[detail.args.arg.index].UNIT_VALS[sel['UNIT_NAME']] =(sel);
				
			}
			//console.log(detail);
			//this.itemdetails[detail.args.arg.index]['QQ']= parseFloat(detail.arg.QTY_AS_OF);
			
			this.itemdetails[detail.args.arg.index].ITEM_CODE = detail.arg.ITEM_CODE;
			this.itemdetails[detail.args.arg.index].ITEM_NAME = detail.arg.ITEM_NAME;
			this.itemdetails[detail.args.arg.index].SUPPLIER_CODE = detail.arg.SUPPLIER_CODE;
			this.itemdetails[detail.args.arg.index].UNIT_NAME = res[0]['UNIT_NAME'];
			this.itemdetails[detail.args.arg.index].UNIT_CONVERSION_ID = res[0]['UNIT_CONVERSION_ID'];
			this.itemdetails[detail.args.arg.index].QTY_AS_OF = parseFloat(detail.arg.QTY_AS_OF);
			this.itemdetails[detail.args.arg.index].QTY_AS_OF_T = parseFloat(detail.arg.QTY_AS_OF_T);
			this.autoComputeCostAndPrice(detail.args.arg.index);
			
			
		});
	}
	
	autoComputeCostAndPrice (index){
		
		this.itemdetails[index].QUANTITY = parseFloat(this.itemdetails[index].REGULAR) + parseFloat(this.itemdetails[index].DEAL);
		
		this.convertUnits ( this.itemdetails[index] ).then ( ( res ) => {
			//console.log(this.itemdetails[index])
			//console.log(this.itemdetails[index].REGULAR);
			let cost = (this.itemdetails[index].UNIT_VALS[this.itemdetails[index]['UNIT_NAME']].COST_PER_UNIT);
			let price = (this.itemdetails[index].UNIT_VALS[this.itemdetails[index]['UNIT_NAME']].SELLING_PRICE_PER_UNIT);
			//this.itemdetails[index]['QTY_AS_OF'] = this.itemdetails[index]['QQ']
			this.itemdetails[index].QUANTITY = parseFloat(this.itemdetails[index].REGULAR) + parseFloat(this.itemdetails[index].DEAL);
			this.itemdetails[index].QQ = res;
			this.itemdetails[index].TOTAL_COST = this.itemdetails[index].QUANTITY * cost;
			this.itemdetails[index].TOTAL_PRICE = this.itemdetails[index].QUANTITY * price;
			this.itemdetails[index].SELLING_PRICE_PER_UNIT = price;
			this.itemdetails[index].COST_PER_UNIT = cost;
			
			this.itemdetails[index].UNIT_CONVERSION_ID = (this.itemdetails[index].UNIT_VALS[this.itemdetails[index]['UNIT_NAME']].UNIT_CONVERSION_ID);
			
			/* console.log('sti',this.transactionProfile.STOCK_IN_OUT);*/
			//this.itemdetails[index]['STOCK_IN_OUT'] = this.transactionProfile.STOCK_IN_OUT;
			
			/*if(this.transactionProfile.STOCK_IN_OUT == 1){
				this.itemdetails[index]['QTY_AS_OF'] += parseFloat(this.itemdetails[index].QUANTITY);
			}
			else{
				this.itemdetails[index]['QTY_AS_OF'] -= parseFloat(this.itemdetails[index].QUANTITY);
			} */
			
			//console.log(this.itemdetails[index].QUANTITY);
		
		
			//console.log(res);
			this.computeTotals();
			
			//console.log('axasd',this.itemdetails[index]);
			this.bindChildObject ( this , false );
		})
		.catch ( e => {});
		
		this.computeTotals();
		this.bindChildObject ( this , false );
	}
	
	getCustomerData( supplier_code ){
		//console.log(item);
		return new Promise ( ( resolve , reject ) =>{
			let request1 = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : "select * from inventory.supplier where SUPPLIER_CODE = ?",
								db : 'DB',
								query_request : 'GET',
								index : 'SUPPLIER',
								values : [
									supplier_code
								]
							},	
							
						]
					}
								
				}
			};
			//console.log(request1);
				
			this.mainService.serverRequest( request1 , ( res ) => {
				let u = JSON.parse(res);
				//console.log('ii',u);
				//resolve(stck);
				resolve (u.SUPPLIER[0]);
				
			},err =>{
				reject (err);
			});
		});
	}
	
	convertUnits ( item ){
		console.log(item);
		return new Promise ( ( resolve , reject ) =>{
			let request1 = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : "select * from inventory.unit where ITEM_CODE = ? and SUPPLIER_CODE = ? ORDER BY HEIRARCHY",
								db : 'DB',
								query_request : 'GET',
								index : 'units',
								values : [
									item.ITEM_CODE,
									item.SUPPLIER_CODE
								]
							},	
							{
								sql : "select * from inventory.unit where ITEM_CODE = ?  and SUPPLIER_CODE = ?  and UNIT_NAME = ?",
								db : 'DB',
								query_request : 'GET',
								index : 'my_unit',
								values : [
									item.ITEM_CODE,
									item.SUPPLIER_CODE,
									item.UNIT_NAME
								]
							},
						]
					}
								
				}
			};
			//console.log(request1);
				
			this.mainService.serverRequest( request1 , ( res ) => {
				let u = JSON.parse(res);
				//console.log('ii',u);
				//resolve(stck);
				let t = u.units[0]['QTY'];
				if (u.my_unit[0]['HEIRARCHY'] == 0){
					resolve( item.QUANTITY );
				}
				else{
					for ( let i in u.units ){
						let sl = u.units[i];
						t *= parseFloat(sl.QTY);
						if ( sl.HEIRARCHY == u.my_unit[0]['HEIRARCHY'] ){
							break;
						}
						
						
					}
				}
				resolve (item.QUANTITY / t);
				
			});
		});
	}
	
	
	
	
	searchcust(){
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/inventory/sources/templates/modal/search.modal.template.html",
			params : {
				type : "supplier",
				action : 'link',
				controller : 'transactionprofilecontroller',
				evt : ':onLinkCustomer',
				arg : [],
			},
			parent : this,
		});
		ssm.render();
	}
	
	onLinkCustomer ( args ){
		let detail = args.detail.query;
		this.transactionProfile.SUPPLIER_ID = detail.id;
		this.transactionProfile.SUPPLIER_NAME = detail.arg;
		this.bindChildObject ( this , false );
		//console.log(args);
	}
	
	changefields(){
		this.bindChildObject(this,true);
	}
	
	changeType (){
		this.bindChildObject(this,true);
		this.labels = {
			docnum : this.l[this.transactionProfile.TYPE].dnum,
			docdate :  this.l[this.transactionProfile.TYPE].ddate,
		}
		this.bindChildObject ( this , false );
	}
	
	
	computeTotals(){
		let totCost = 0;
		let totPrice = 0;
		//console.log(this.itemdetails);
		for(let i in this.itemdetails){
			let sel = this.itemdetails[i];
			totCost += parseFloat(sel.TOTAL_COST);
			totPrice += parseFloat(sel.TOTAL_PRICE);
		}
		this.transactionProfile.TOTAL_COST = totCost;
		this.transactionProfile.TOTAL_PRICE = totPrice;
	}
	
	changeLotExpDate(detail){
		//console.log(detail);
		//this.bindChildObject ( this , false );
		let index = detail.index;
		this.bindChildObject ( this , true );
		this.getStocksOnhandWexpLot(this.itemdetails[index]).then ( ( res ) => {
			//res = res.stock;
			//console.log('WW',res);
			//if (res.stock.length > 0){
				this.itemdetails[index]['QTY_AS_OF'] = res.stock.length > 0 ? res.stock[0]['QUANTITY'] : 0;
				
			//}
		})
		.catch ( err=> {} );
		
		setTimeout( ( )=>{
			this.bindChildObject ( this , true );
		},200);
	}
	
	
	
	
	
	getStocksOnhand ( details ){
		return new Promise ( ( resolve , reject ) => {
			let request1 = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : "select * from inventory.item_in_warehouse where ID = (SELECT MAX(ID) FROM inventory.item_in_warehouse where COMPANY_CODE = ? and WAREHOUSE_CODE = ? and ITEM_CODE = ?)",
								db : 'DB',
								query_request : 'GET',
								index : 'stock',
								values : [
									session_data.COMPANY_CODE,
									'W01',
									details.ITEM_CODE ,
								]
							},	
								
						]
					}
								
				}
			};
				
			this.mainService.serverRequest( request1 , ( res ) => {
				let stck = JSON.parse(res).stock;
				resolve(stck);
			});
		});
	}
	
	convertUnits4 ( value , currentUnit, toUnit , units ){
		let u = !units ? this.units : units;
		let thisUnit = u[u.findIndex ( x => x.UNIT_NAME == currentUnit )];
		let toUnitConvert = u[u.findIndex ( x => x.UNIT_NAME == toUnit )];
		let multiplier = 1;
		//console.log( value,currentUnit, toUnit,'->',toUnitConvert['HEIRARCHY'] ,'<' , currentUnit,'->',thisUnit['HEIRARCHY'] )
		
		if (currentUnit == toUnit){
			return value;
		}
		
		else if ( toUnitConvert['HEIRARCHY'] < thisUnit['HEIRARCHY']  ){
			let next = thisUnit['HEIRARCHY']  ;
					
			while ( true ){
				let sel = u[ next ];
				
				if ( sel.HEIRARCHY == toUnitConvert.HEIRARCHY ){
					break;
				}
				else{
					multiplier *= sel.QTY;
				}
				
				
				next --;
			}
			
			//console.log(multiplier)
			return parseFloat (value / multiplier);
		}
		else{
			let next = toUnitConvert['HEIRARCHY']  ;
					
			while ( true ){
				let sel = u[ next ];
				
				if ( sel.HEIRARCHY == thisUnit.HEIRARCHY ){
					break;
				}
				else{
					multiplier *= sel.QTY;
				}
				
				
				next --;
			}
			
			//console.log(multiplier)
			
			return parseFloat (value * multiplier);
		}
	}
	
	
	
	
	cancel(  ){
		//console.log(this.transactionProfile);
		//console.log(this.modalData.arg.args[0]['ITEM_DETAILS']);
		
			if ( !confirm ( "Are you sure you want to cancel this transaction?" ) ){
				return;
			}
			
			if (this.transactionProfile.STATUS == 'Cancelled' || !this.isUpdate){
				alert('Cannot cancel because already cancelled!');
				return;
			}
		
		//console.log(this.modalData.arg.args[0]['ITEM_DETAILS']);
		let baseValues = {};
		let temps = {};		
		for ( let i in this.modalData.arg.args[0]['ITEM_DETAILS'] ){
			let sel = this.modalData.arg.args[0]['ITEM_DETAILS'][i];
			let units = [];
			
			for (let u in sel.UNIT_VALS){
				let selunit = sel.UNIT_VALS[u];
				units.push(selunit);
			}
			sel['UNITS_'] = units;
			
			//console.log(sel);
			
			let request1 = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							
							{
								sql : "select *  from inventory.item_in_warehouse where  ITEM_CODE = ? AND DOC_ID = ?",
								db : 'DB',
								query_request : 'GET',
								index : 'qty_in_ws1',
								values : [
									sel.ITEM_CODE,
									sel.DOC_ID,
								]
							},	
							
							

							
						]
					}
								
				}
			};
				
			this.mainService.serverRequest( request1 , ( res ) => {
				res = JSON.parse(res);
				//console.log(res);
				
				let request1 = {
					type: "POST",
					url : this.mainService.urls["generic"].url,
					data : {
						data : {
							request : 'generic',
							REQUEST_QUERY : [
								
								{
									sql : "select *  from inventory.item_in_warehouse iiw INNER JOIN inventory.alter_document ad ON ad.DOC_ID = iiw.DOC_ID   where iiw.ID < ? AND iiw.ITEM_CODE = ? AND ad.status != 'Cancelled' order by iiw.ID",
									db : 'DB',
									query_request : 'GET',
									index : 'qty_in_ws2',
									values : [
										res['qty_in_ws1'][0].ID,
										sel.ITEM_CODE,
										
									]
								},	
								
								{
									sql : `select *,iw.ID iwID, ad.ID adID,iw.UNIT_CONVERSION_ID,iw.EXPIRY_DATE,iw.DOC_ID,iw.ITEM_CODE,ad.status  from inventory.item_in_warehouse iw INNER JOIN inventory.alter_document ad ON ad.DOC_ID = iw.DOC_ID where iw.ID > ? AND iw.ITEM_CODE = ? AND status != 'Cancelled'`,
									//sql : "select *  from inventory.item_in_warehouse where ID > ? AND ITEM_CODE = ?",
									db : 'DB',
									query_request : 'GET',
									index : 'quantity_t_in_warehouse_1',
									values : [
										res['qty_in_ws1'][0].ID,
										sel.ITEM_CODE,
										
									]
								},	

								{
									sql : "select *  from inventory.item_in_warehouse  iiw INNER JOIN inventory.alter_document ad ON ad.DOC_ID = iiw.DOC_ID   where   iiw.ID < ? and iiw.ITEM_CODE = ?  AND iiw.EXPIRY_DATE = ? AND ad.status != 'Cancelled'",
									db : 'DB',
									query_request : 'GET',
									index : 'qty_in_wss22',
									values : [
										res['qty_in_ws1'][0].ID,
										sel.ITEM_CODE,
										//sel.LOT_NUMBER,
										sel.EXPIRY_DATE == '' ?  '0000-00-00' : sel.EXPIRY_DATE,
									]
								},	

								{
									sql : `select *,iw.ID iwID, ad.ID adID,iw.UNIT_CONVERSION_ID  from inventory.item_in_warehouse iw INNER JOIN inventory.alter_document ad ON ad.DOC_ID = iw.DOC_ID where iw.ID > ? AND iw.ITEM_CODE = ?
											 and iw.LOT_NUMBER = ? AND iw.EXPIRY_DATE = ? and ad.status != 'Cancelled' `,
									//sql : "select *  from inventory.item_in_warehouse where ID > ? AND ITEM_CODE = ?",
									db : 'DB',
									query_request : 'GET',
									index : 'quantity_t_in_warehouse_2',
									values : [
										res['qty_in_ws1'][0].ID,
										sel.ITEM_CODE,
										sel.LOT_NUMBER,
										sel.EXPIRY_DATE == '' ?  '0000-00-00' : sel.EXPIRY_DATE,
										
									]
								},				
							]
						}
									
					}
				};
					
				this.mainService.serverRequest( request1 , ( resl ) => {
					resl = JSON.parse(resl);
					
					//console.log(this.modalData.arg)
					let baseTotalQty = parseFloat( resl['qty_in_ws2'][ resl['qty_in_ws2'].length - 1 ]['TOTAL_QUANTITY'] );
					let base = baseTotalQty;
					//console.log(baseTotalQty,res['qty_in_ws1'][0].ID,sel.ITEM_NAME);
					//console.log(sel.ITEM_NAME,sel.EXPIRY_DATE,res['qty_in_ws1'][0].ID,resl['qty_in_wss22']);
					let indx = [];
					//console.log(resl['qty_in_ws2']);
					for (let i in resl['quantity_t_in_warehouse_1']){
						let selqtytw1 = resl['quantity_t_in_warehouse_1'][i];
						
						
						if ( selqtytw1.DOC_ID == sel.DOC_ID ){
							
							
						}
						else{
							//let selqtytw1 = resl['quantity_t_in_warehouse_1'][i];
							let uindex = sel['UNITS_'].findIndex( x => x.UNIT_CONVERSION_ID == selqtytw1.UNIT_CONVERSION_ID );
							
							if (uindex > 0){
								selqtytw1.B_QUANTITY = this.convertUnits4 ( parseFloat(selqtytw1.B_QUANTITY) , sel.UNITS_[uindex]['UNIT_NAME'], sel['UNITS_'][0].UNIT_NAME , sel['UNITS_'] );
								//selqtytw1.QUANTITY = this.convertUnits4 ( parseFloat(selqtytw1.QUANTITY) , sel.UNITS_[uindex]['UNIT_NAME'], sel['UNITS_'][0].UNIT_NAME , sel['UNITS_'] );
							}
							
							if (selqtytw1.STOCK_IN_OUT == 1){
								baseTotalQty += parseFloat(selqtytw1.B_QUANTITY);
							}
							else{
								baseTotalQty -= parseFloat(selqtytw1.B_QUANTITY);
							}
							
							
							let indxexp = resl['qty_in_ws2'].findIndex(x => x.EXPIRY_DATE == sel.EXPIRY_DATE);
							
							//console.log(indxexp)
							//let bib = 0;
							if (indxexp > -1){
								if (selqtytw1.EXPIRY_DATE == sel.EXPIRY_DATE){
									let qs = [];
									for (let b in resl['qty_in_ws2']){
										let selbb = resl['qty_in_ws2'][b];
										if (selbb.EXPIRY_DATE == selqtytw1.EXPIRY_DATE)
										qs.push(selbb);
									}
									
									if (selqtytw1.EXPIRY_DATE == sel.EXPIRY_DATE){
										if (temps[sel.ITEM_NAME]){
											if (temps[sel.ITEM_NAME][sel.EXPIRY_DATE]){
												if (selqtytw1.STOCK_IN_OUT == 1)
													temps[sel.ITEM_NAME][sel.EXPIRY_DATE]+=parseFloat(selqtytw1.B_QUANTITY)
												else
													temps[sel.ITEM_NAME][sel.EXPIRY_DATE]-=parseFloat(selqtytw1.B_QUANTITY)
											}
											else{
												//temps[sel.ITEM_NAME][sel.EXPIRY_DATE]=parseFloat(qs[qs.length - 1].QUANTITY) + parseFloat(selqtytw1.B_QUANTITY)
											}
										}else{
											
											temps[sel.ITEM_NAME]={};		
											if (selqtytw1.STOCK_IN_OUT == 1)
												temps[sel.ITEM_NAME][sel.EXPIRY_DATE]=parseFloat(qs[qs.length - 1].QUANTITY) + parseFloat(selqtytw1.B_QUANTITY)										
											else
												temps[sel.ITEM_NAME][sel.EXPIRY_DATE]=parseFloat(qs[qs.length - 1].QUANTITY) - parseFloat(selqtytw1.B_QUANTITY)										
											
										}
										
										//bib = temps[sel.ITEM_NAME][sel.EXPIRY_DATE]
										//console.log(sel.ITEM_NAME,sel.EXPIRY_DATE,parseFloat(qs[qs.length - 1].QUANTITY),selqtytw1.B_QUANTITY,temps[sel.ITEM_NAME][sel.EXPIRY_DATE],selqtytw1.STOCK_IN_OUT);
										let update = {
											sql : "update inventory.ITEM_IN_WAREHOUSE SET QUANTITY = ?, IS_CANCELLED = 1  WHERE DOC_ID = ? AND EXPIRY_DATE = ? AND ITEM_CODE = ?",
											db : 'DB',
											query_request : 'PUT',
											values : [
												temps[sel.ITEM_NAME][sel.EXPIRY_DATE],
												selqtytw1.DOC_ID,
												selqtytw1.EXPIRY_DATE,
												selqtytw1.ITEM_CODE
											]
										}
										let reqss = {
											type: "POST",
											url : this.mainService.urls["generic"].url,
											data : {
												data : {
													request : 'generic',
													REQUEST_QUERY : [update]
												}
																
											}
										};
										//alert("ASDAS");
										this.mainService.serverRequest( reqss , ( resl ) => {
											
										}); 
									
									}
									//console.log(sel.ITEM_NAME,sel.EXPIRY_DATE,qs[qs.length - 1].QUANTITY,temps[sel.ITEM_NAME][sel.EXPIRY_DATE]);
									
								}
							}
							else{
								if (selqtytw1.EXPIRY_DATE == sel.EXPIRY_DATE){
									if (temps[sel.ITEM_NAME]){
										if (temps[sel.ITEM_NAME][sel.EXPIRY_DATE]){
											if (selqtytw1.STOCK_IN_OUT == 1)
											temps[sel.ITEM_NAME][sel.EXPIRY_DATE]+=parseFloat(selqtytw1.B_QUANTITY)
											else
											temps[sel.ITEM_NAME][sel.EXPIRY_DATE]-=parseFloat(selqtytw1.B_QUANTITY)
										}
										else{
											temps[sel.ITEM_NAME][sel.EXPIRY_DATE]=parseFloat(selqtytw1.B_QUANTITY)
										}
									}else{
										
										temps[sel.ITEM_NAME]={};
										if (selqtytw1.STOCK_IN_OUT == 1)										
										temps[sel.ITEM_NAME][sel.EXPIRY_DATE]=+ parseFloat(selqtytw1.B_QUANTITY)		
										else
											temps[sel.ITEM_NAME][sel.EXPIRY_DATE]=- parseFloat(selqtytw1.B_QUANTITY)	
										
									}
									/* console.log([
											temps[sel.ITEM_NAME][sel.EXPIRY_DATE],
											selqtytw1.DOC_ID,
											sel.EXPIRY_DATE,
											sel.ITEM_CODE
										]); */
									//bib = temps[sel.ITEM_NAME][sel.EXPIRY_DATE]
									let update = {
										sql : "update inventory.ITEM_IN_WAREHOUSE SET QUANTITY = ?, IS_CANCELLED = 1  WHERE DOC_ID = ? AND EXPIRY_DATE = ? AND ITEM_CODE = ?",
										db : 'DB',
										query_request : 'PUT',
										values : [
											temps[sel.ITEM_NAME][sel.EXPIRY_DATE],
											sel.DOC_ID,
											sel.EXPIRY_DATE,
											sel.ITEM_CODE
										]
									}
									let request123 = {
										type: "POST",
										url : this.mainService.urls["generic"].url,
										data : {
											data : {
												request : 'generic',
												REQUEST_QUERY : [update]
											}
															
										}
									};
									//alert("ASDAS");
									this.mainService.serverRequest( request123 , ( resl ) => {
										
									}); 
								}
							}
							
							
							let temp = [
								baseTotalQty,
								selqtytw1.iwID,
								selqtytw1.ITEM_CODE
							];
							/* let temp2 = [
								bib,
								sel.EXPIRY_DATE,
								selqtytw1.DOC_ID,
							]; */
							
							let update = [{
								sql : "update inventory.ITEM_IN_WAREHOUSE SET TOTAL_QUANTITY = ?  WHERE ID = ?  AND ITEM_CODE = ?",
								db : 'DB',
								query_request : 'PUT',
								values : temp,
							}]
							
							
							
							
							let request123 = {
								type: "POST",
								url : this.mainService.urls["generic"].url,
								data : {
									data : {
										request : 'generic',
										REQUEST_QUERY : update
									}
													
								}
							};
							
							
							
							//alert("ASDAS");
							this.mainService.serverRequest( request123 , ( resl ) => {

							}); 
							
							//console.log(temp);
						}
						if ( i == resl['quantity_t_in_warehouse_1'].length	 ) break;
						//console.log(temps)
					}
					
					let temp = [
						0,
						0,
						1,
						sel.DOC_ID
					];
							
							
					let updates = [
						{
							sql : "update inventory.ITEM_IN_WAREHOUSE SET TOTAL_QUANTITY = ?,QUANTITY = ?,IS_CANCELLED = ?  WHERE DOC_ID = ? ",
							db : 'DB',
							query_request : 'PUT',
							values : temp,
						},
							
					]
					
					
					
							
							if (this.transactionProfile.TYPE == 'Sales Invoice'){
								
								updates .push({
									sql : "update inventory.sales_invoice SET  CANCELLED_BY = ?,CANCELLED_DATE = ?  WHERE ORNO = ?",
									db : 'DB',
									query_request : 'PUT',
									values : [
										session_data.ID,
										this.mainService.getCurrentDate(),
										//sel.STOCK_IN_OUT == 1 ? 0 : 1,
										//sel.DOC_ID,
										sel.DOC_ID
									]
								});
							}
					
							
					let request123S = {
						type: "POST",
						url : this.mainService.urls["generic"].url,
						data : {
							data : {
								request : 'generic',
								REQUEST_QUERY : updates
							}
													
						}
					};
					
					//console.log( resl['qty_in_ws2']);
							//alert("ASDAS");
					this.mainService.serverRequest( request123S , ( res1 ) => {
						//console.log(`123`,res1);
					}); 
					
					
				}); 
				
				
			}); 
			
		}
		
		let request3 = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
							
						{
							sql : "update inventory.alter_document SET STATUS = ?  WHERE DOC_ID = ?",
							db : 'DB',
							query_request : 'PUT',
							values : [
								'Cancelled' ,
								//sel.STOCK_IN_OUT == 1 ? 0 : 1,
								//sel.DOC_ID,
								this.transactionProfile.DOC_ID,
							]
						},
						
					]
				}
								
			}
		};
		//alert("ASDAS");
		//if ( confirm ("Are you sure you want to cancel?") )
		//if (!notCancel){
			 this.mainService.serverRequest( request3 , ( resl ) => {
				alert ("Done!");
						MainService.EventObject['transaction'].dispatch ('transaction:onUpdateTransaction' , {
								detail : {
									query : {
										
									}
								} 
						});
				this.onClose();
				this.modalData.parent.onClose();
			}); 
		//}
		
	}
	
	removeItem(arg){
		//console.log(arg);
		if (this.isUpdate){
			alert("Cannot Undo!");
			return;
		}
		
		if ( confirm ( "Are you sure you want to remove this?" ) ){
			setTimeout(()=>{
				$('#item-details-trans-modal-unit-table tbody tr#'+arg.INDEX).remove();
				this.itemdetails.splice(arg.INDEX ,1);
				//this.binds(this.controllerName,'#'+this.modalID);
				//this.bindChildObject ( this , false );
				//this.binds(this.controllerName,'#'+this.modalID);
				this.computeTotals();
				this.displayItems ( );
				this.binds(this.controllerName,'#'+this.modalID);
				this.bindChildObject ( this , false );
			
			},500);
		}
	}
	
	
	updateQuantities( sel ){
		//console.log(this.transactionProfile);
		//console.log(this.modalData.arg.args[0]['ITEM_DETAILS']);
		let baseIdOfInventoryInWarehouse = this.itemInWarehouseDetails [ this.itemInWarehouseDetails.length - 1 ][`ITEM_IN_WH_ID`];
		//console.log(this.itemInWarehouseDetails);
		let baseValues = {};
		let temps = {};		
		//console.log(baseIdOfInventoryInWarehouse);
		//console.log(sel);
		//let baseTotalQty = sel.
		let units = [];
			
		for (let u in sel.UNIT_VALS){
			let selunit = sel.UNIT_VALS[u];
			units.push(selunit);
		}
		
		sel['UNITS_'] = units;
		
		let request1 = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
									
						{
							sql : `select *,iw.ID iwID, ad.ID adID,iw.UNIT_CONVERSION_ID,iw.EXPIRY_DATE,iw.DOC_ID,iw.ITEM_CODE,ad.status  from inventory.item_in_warehouse iw INNER JOIN inventory.alter_document ad ON ad.DOC_ID = iw.DOC_ID where iw.ID > ? AND iw.ITEM_CODE = ?  AND status != 'Cancelled'  order by iw.ID asc`,
							//sql : "select *  from inventory.item_in_warehouse where ID > ? AND ITEM_CODE = ?",
							db : 'DB',
							query_request : 'GET',
							index : 'quantity_t_in_warehouse_1',
							values : [
								baseIdOfInventoryInWarehouse,
								sel.ITEM_CODE,
										
							]
						},	
						

						
					]
				}
									
			}
		};
		//return new Promise( (accept,reject) =>{			
			this.mainService.serverRequest( request1 , ( resl ) => {
				resl = JSON.parse(resl);
				let invinwhs = resl.quantity_t_in_warehouse_1;
				//console.log(resl);
				//let baseQuantityTotal = parseFloat(invinwhs[invinwhs.length - 1][`TOTAL_QUANTITY`]);
				let baseQuantityTotal = parseFloat(sel.base_total_qty);
				//console.log(1,sel.ITEM_NAME, sel.EXPIRY_DATE,baseQuantityTotal,baseIdOfInventoryInWarehouse,sel)
				for ( let io in invinwhs ){  
					let whssel = invinwhs[io];
					//console.log(whssel)
					
					//let uindex = sel['UNITS_'].findIndex( x => x.UNIT_CONVERSION_ID == whssel.UNIT_CONVERSION_ID );
								
					//if (uindex > 0){
					//	console.log(sel['UNITS_'],uindex)
						whssel.B_QUANTITY = this.convertUnits4 ( parseFloat( whssel.B_QUANTITY ), sel.UNITS_[0]['UNIT_NAME'], sel['UNITS_'][0].UNIT_NAME , sel['UNITS_']  );
						//selqtytw1.QUANTITY = this.convertUnits4 ( parseFloat(selqtytw1.QUANTITY) , sel.UNITS_[uindex]['UNIT_NAME'], sel['UNITS_'][0].UNIT_NAME , sel['UNITS_'] );
					//}
					
					if (whssel.STOCK_IN_OUT == 1){
						baseQuantityTotal += whssel.B_QUANTITY
					}
					else{
						baseQuantityTotal -= whssel.B_QUANTITY;
					}
					
					
					if (whssel.EXPIRY_DATE == sel.EXPIRY_DATE){
						if (baseValues[sel.ITEM_NAME]){
							if (whssel.STOCK_IN_OUT == 1){
								baseValues[sel.ITEM_NAME][sel.EXPIRY_DATE] += parseFloat(whssel.B_QUANTITY);
							}else{
								baseValues[sel.ITEM_NAME][sel.EXPIRY_DATE] -= parseFloat(whssel.B_QUANTITY);
							}
						}
						else{
							baseValues[sel.ITEM_NAME] = {};
							if (whssel.STOCK_IN_OUT == 1){
								baseValues[sel.ITEM_NAME][sel.EXPIRY_DATE] = parseFloat(sel.base_qty) + parseFloat(whssel.B_QUANTITY);
							}else{
								baseValues[sel.ITEM_NAME][sel.EXPIRY_DATE] = parseFloat(sel.base_qty) - parseFloat(whssel.B_QUANTITY);
							}
							
						}
						
						let request12 = {
							type: "POST",
							url : this.mainService.urls["generic"].url,
							data : {
								data : {
									request : 'generic',
									REQUEST_QUERY : [
													
										{
											sql : `UPDATE inventory.item_in_warehouse SET QUANTITY = ? WHERE ID = ? AND ITEM_CODE = ? AND DOC_ID=? AND EXPIRY_DATE = ?`,
											db : 'DB',
											query_request : 'PUT',
											//index : 'quantity_t_in_warehouse_1',
											values : [
												baseValues[sel.ITEM_NAME][sel.EXPIRY_DATE],
												whssel.iwID,
												whssel.ITEM_CODE,
												whssel.DOC_ID,
												whssel.EXPIRY_DATE,		
											]
										},	
									]
								}				
							}
						};
						this.mainService.serverRequest( request12 , ( resl ) => {});
						
						//console.log(whssel.iwID,sel.ITEM_NAME, sel.EXPIRY_DATE,sel.base_qty,baseValues[sel.ITEM_NAME][sel.EXPIRY_DATE],whssel.B_QUANTITY,whssel.STOCK_IN_OUT)
					}
					//console.log(whssel.iwID,sel.ITEM_NAME, sel.EXPIRY_DATE,baseQuantityTotal,baseValues,baseValues,whssel.B_QUANTITY)
					let request123 = {
						type: "POST",
						url : this.mainService.urls["generic"].url,
						data : {
							data : {
								request : 'generic',
								REQUEST_QUERY : [	
									{
										sql : `UPDATE inventory.item_in_warehouse SET TOTAL_QUANTITY = ? WHERE ID = ? AND ITEM_CODE = ? AND DOC_ID=? `,
										db : 'DB',
										query_request : 'PUT',
										//index : 'quantity_t_in_warehouse_1',
										values : [
											baseQuantityTotal,
											whssel.iwID,
											whssel.ITEM_CODE,
											whssel.DOC_ID,	
										]
									},	
								]
							}				
						}
					};
					this.mainService.serverRequest( request123 , ( resl ) => {});
				}
				//accept();
			//});
		});
	}
	
	rearm(  ){
		let indxx = parseInt(this.itemInWarehouseDetails[this.itemInWarehouseDetails.length - 1][`ITEM_IN_WH_ID`]);
		let idofx = this.modalData.arg.args[0][`ID`];
		//console.log( this.modalData.arg.args[0] , indxx );
		let request1 = {	
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [		
						{
							sql : `select *,iw.ID iwID,iw.UNIT_CONVERSION_ID,iw.EXPIRY_DATE,iw.DOC_ID,iw.ITEM_CODE from inventory.item_in_warehouse iw where iw.ID > ?   order by iw.ID DESC`,
							db : 'DB',
							query_request : 'GET',
							index : 'quantity_t_in_warehouse_1',
							values : [
								indxx,
							]
						},
						{
							sql : `select * FROM alter_document WHERE ID > ? order by ID DESC`,
							db : 'DB',
							query_request : 'GET',
							index : 'indofx',
							values : [
								idofx,
							]
						},
					]
				}
									
			}
		};
		return new Promise( (accept,reject) => {
			this.mainService.serverRequest( request1 , ( resl ) => {
				let res = JSON.parse(resl);
				//res.quantity_t_in_warehouse_1[0]['iwID'] = parseFloat(res.quantity_t_in_warehouse_1[0]['iwID']) + this.itemdetails.length;
				//console.log(res.quantity_t_in_warehouse_1);
				//console.log(res);
				let request123 = {	
						type: "POST",
						url : this.mainService.urls["generic"].url,
						data : {
							data : {
								request : 'generic',
								REQUEST_QUERY : [	]
							}
												
						}
					};	
				for ( let i in res.quantity_t_in_warehouse_1 ){
					let sll = res.quantity_t_in_warehouse_1[i];
					let swid = parseInt(sll['iwID']) + this.itemdetails.length
					//console.log(indxx,swid,sll['iwID'])
					//sll['iwID'] + this.itemdetails.length
					
					/* this.mainService.serverRequest( request123 , ( resl ) => {
						accept ();
						
					}); */
					//console.log(sll,sll['iwID']);
					request123.data.data.REQUEST_QUERY.push ({
						sql : `UPDATE inventory.item_in_warehouse set ID = ? WHERE ID = ?`,
						db : 'DB',
						query_request : 'PUT',
						//index : 'quantity_t_in_warehouse_1',
						values : [
							swid,
							sll['iwID']
						]
					});
				}
				this.mainService.serverRequest( request123 , ( resl ) => {
					//console.log(res.indofx);
					let request1234 = {	
							type: "POST",
							url : this.mainService.urls["generic"].url,
							data : {
								data : {
									request : 'generic',
									REQUEST_QUERY : []
								}
													
							}
					};	
					for ( let i in res.indofx ){
						let sSll = res.indofx[i];
						let sxid = parseInt(sSll['ID']) + 1
						//console.log(sxid,sSll['ID'])
						//sll['iwID'] + this.itemdetails.length
						request1234.data.data.REQUEST_QUERY.push({
							sql : `UPDATE inventory.alter_document set ID = ? WHERE ID = ?`,
							db : 'DB',
							query_request : 'PUT',
							//index : 'quantity_t_in_warehouse_1',
							values : [
								sxid,
								sSll['ID']
							]
						});
						/*  */
						//console.log(sll,sll['iwID']);
					}
					this.mainService.serverRequest( request1234 , ( resl ) => {
						accept ();
					});
				});
			});
		});
	}
	
	
	save (){
		
		let sqty = 0
		this.bindChildObject(this,true);
		
		
		
		if (this.itemdetails.length == 0){
			alert("Please Add item details!");
			return;
		}
		
		if (this.isUpdate){
			alert("Cannot Edit Transaction!");
			return;
		}
		
		
		//console.log(this.itemInWarehouseDetails[ this.itemInWarehouseDetails.length - 1 ][`ITEM_IN_WH_ID`]);
		
		
		
		
		
		let c11 = this.itemdetails;
			//c11.splice(0,1);
			//console.log(c11)
		for ( let ix =0 ; ix < this.itemdetails.length ;ix++ ){
			let sel = this.itemdetails[ix];
			let EXP = 0;
			let LOT = 0;
			
			/* let tmpxxxx = this.itemdetails;
			
			tmpxxxx.splice (ix,1);
			//console.log(tmpxxxx)
			let exs1 = tmpxxxx.findIndex ( x => x.ITEM_CODE == sel.ITEM_CODE  );
			let exs2 = tmpxxxx.findIndex ( x => x.EXPIRY_DATE == sel.EXPIRY_DATE  );
			let exs3 = tmpxxxx.findIndex ( x => x.LOT_NUMBER == sel.LOT_NUMBER  ); */
			
			
			 for ( let ixx =0 ; ixx < c11.length ;ixx++ ){
				let sel2 = c11[ixx];
				let exs1 = c11.findIndex ( x => x.ITEM_CODE == sel2.ITEM_CODE   );
				
				if ( exs1 > -1 ){
					
					//if (sel2.LOT_NUMBER == sel.LOT_NUMBER )LOT++;
						
					if(sel.ITEM_CODE == sel2.ITEM_CODE){
						if (sel2.EXPIRY_DATE == sel.EXPIRY_DATE)EXP++;
					}
					
				}
				//console.log(sel,sel2,LOT,EXP);
			} 
			
			
			
			
			 if (  EXP > 1 ){
				alert("Item already exists!");
				return;
			} 
			//console.log(exs1,exs2,exs3);
			/* if ( exs1 > -1 ){
				if (exs2 > -1 ){
					alert("Item already exists!");
					return;
				}
			}
			else{
				//continue;
			} */
		}
		//console.log(this.transactionProfile);
		
		//console.log('items',this.itemdetails);
		let indexqRequestQuery ={
				sql : "INSERT INTO inventory.alter_document "+
				"(STOCK_IN_OUT,DOC_ID,REFFERENCE_DOC_ID,ACCOUNT_CODE,DATE_ENCODED,DOCUMENT_DATE,TYPE,STATUS,DESCRIPTION,COMPANY_CODE,SUPPLIER_ID,TOTAL_PRICE,TOTAL_COST,WAREHOUSE_CODE) "+
				"VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
				db : 'DB',
				query_request : 'INSERT',
				values : [
					this.transactionProfile.STOCK_IN_OUT  ,
					this.transactionProfile.DOC_ID ,
					this.transactionProfile.REFFERENCE_DOC_ID ,
					this.transactionProfile.ACCOUNT_CODE ,
					this.transactionProfile.DATE_ENCODED ,
					this.transactionProfile.DOCUMENT_DATE ,
					this.transactionProfile.TYPE ,
					this.transactionProfile.STATUS,
					this.transactionProfile.DESCRIPTION ,
					this.transactionProfile.COMPANY_CODE ,
					this.transactionProfile.SUPPLIER_ID,
					this.transactionProfile.TOTAL_PRICE ,
					this.transactionProfile.TOTAL_COST,
					this.transactionProfile.WAREHOUSE_CODE,
				]
		}
		
		if ( this.modalData.arg.args[0].REPLACE_DOCUMENT ){
		
			indexqRequestQuery = {
					sql : "INSERT INTO inventory.alter_document "+
					"(ID,STOCK_IN_OUT,DOC_ID,REFFERENCE_DOC_ID,ACCOUNT_CODE,DATE_ENCODED,DOCUMENT_DATE,TYPE,STATUS,DESCRIPTION,COMPANY_CODE,SUPPLIER_ID,TOTAL_PRICE,TOTAL_COST,WAREHOUSE_CODE) "+
					"VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
					db : 'DB',
					query_request : 'INSERT',
					values : [
						parseInt(this.modalData.arg.args[0][`ID`]) + 1,
						this.transactionProfile.STOCK_IN_OUT  ,
						this.transactionProfile.DOC_ID ,
						this.transactionProfile.REFFERENCE_DOC_ID ,
						this.transactionProfile.ACCOUNT_CODE ,
						this.transactionProfile.DATE_ENCODED ,
						this.transactionProfile.DOCUMENT_DATE ,
						this.transactionProfile.TYPE ,
						this.transactionProfile.STATUS,
						this.transactionProfile.DESCRIPTION ,
						this.transactionProfile.COMPANY_CODE ,
						this.transactionProfile.SUPPLIER_ID,
						this.transactionProfile.TOTAL_PRICE ,
						this.transactionProfile.TOTAL_COST,
						this.transactionProfile.WAREHOUSE_CODE,
					]
			}
		}
		
		
		
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [indexqRequestQuery]
				}
						
			}
		};
			let indxx = 0;
		
		if ( this.modalData.arg.args[0].REPLACE_DOCUMENT ){
			request.data.data.REQUEST_QUERY.push({
				sql : "UPDATE inventory.alter_document SET IS_REPLACED = ? WHERE ID = ?",
				db : "DB",
				query_request : "put",
				values : [
					1,
					this.modalData.arg.args[0][`ID`],
				]
			});
			indxx = parseInt(this.itemInWarehouseDetails[this.itemInWarehouseDetails.length - 1][`ITEM_IN_WH_ID`]);
		}
		
	
		
		
		request.data.data.REQUEST_QUERY.push({
			sql : "DELETE FROM inventory.item_details where DOC_ID = ?",
			db : 'DB',
			query_request : 'DEL',
			values : [this.transactionProfile.DOC_ID],
		});
		
		/* request.data.data.REQUEST_QUERY.push({
			sql : "DELETE FROM inventory.item_in_warehouse where DOC_ID = ?",
			db : 'DB',
			query_request : 'DEL',
			values : [this.transactionProfile.DOC_ID],
		}); */
		
		let tmp = {};
		
		
		
		for ( let i in this.itemdetails ){
			let sel = this.itemdetails[i];
			
			if (sel.ITEM_CODE==""){
				alert("One of the item fields is missing item definition!");
				return;
			}
			
			
			request.data.data.REQUEST_QUERY.push({
				sql : "INSERT INTO inventory.item_details "+
					  "(DEAL,REGULAR,STOCK_IN_OUT,ITEM_CODE, QUANTITY, UNIT_CONVERSION_ID, DOC_ID, COST_PER_UNIT, SELLING_PRICE_PER_UNIT, TOTAL_COST, TOTAL_PRICE, DATE_ENCODED, COMPANY_CODE,WAREHOUSE_CODE,EXPIRY_DATE,LOT_NUMBER) "+
					  "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
				db : 'DB',
				query_request : 'INSERT',
				values : [
					sel.DEAL,
					sel.REGULAR,
					this.transactionProfile['STOCK_IN_OUT'] ,
					sel.ITEM_CODE,
					sel.QUANTITY ,
					sel.UNIT_CONVERSION_ID ,
					this.transactionProfile.DOC_ID ,
					sel.COST_PER_UNIT ,
					sel.SELLING_PRICE_PER_UNIT ,
					sel.TOTAL_COST ,
					sel.TOTAL_PRICE ,
					sel.DATE_ENCODED ,
					sel.COMPANY_CODE,
					this.transactionProfile.WAREHOUSE_CODE ,
					sel.EXPIRY_DATE,
					sel.LOT_NUMBER,
				]
			});
			//	console.log (sel.ITEM_NAME,parseFloat(sel['QQ']) , parseFloat(sel['QUANTITY']) , sel );
			
			
			
			let alterQuantity = parseFloat(sel['QTY_AS_OF']);
			let alterQuantityTotal = parseFloat(sel['QTY_AS_OF_T']);
			// console.log(this.transactionProfile['STOCK_IN_OUT'] == 1,parseFloat(sel['QQ']),alterQuantityTotal)
			if (this.transactionProfile['STOCK_IN_OUT'] == 1){
				alterQuantity = alterQuantity + parseFloat(sel['QQ']);
				alterQuantityTotal = alterQuantityTotal + parseFloat(sel['QQ']);
			}
			else{
				alterQuantity = alterQuantity - parseFloat(sel['QQ']);
				alterQuantityTotal = alterQuantityTotal - parseFloat(sel['QQ']);
			}
			
			//this.itemdetails[i]['QTY_AS_OF'] = 0;
			//this.itemdetails[i]['QTY_AS_OF'] = s;
			//console.log(this.itemdetails[i]['QTY_AS_OF']);
			//console.log(this.itemdetails[i]['QTY_AS_OF'],parseFloat(sel['QQ']),s,sel['QTY_AS_OF']);
			//console.log('qq',parseFloat(sel['QUANTITY']) , 'ff',parseFloat(alterQuantity),'MM',sel['QTY_AS_OF']  );
			if ( alterQuantity < 0 && this.transactionProfile['STOCK_IN_OUT'] == 0 ){
				alert(`Cannot save transaction because ${sel.ITEM_NAME}'s quantity is greater than the remaining quantity!` );
				return;
			} 
			
			//this.itemdetails[i]['QTY_AS_OF'] = sqty;
			//console.log(this.itemdetails[i]['QTY_AS_OF']);
			
			if (tmp[sel.ITEM_CODE]){
				if (this.transactionProfile['STOCK_IN_OUT'] == 1){
					tmp[sel.ITEM_CODE] = tmp[sel.ITEM_CODE] + parseFloat(sel['QQ']);
				}
				else{
					tmp[sel.ITEM_CODE] = tmp[sel.ITEM_CODE] - parseFloat(sel['QQ']);
				}
			}
			else{
				tmp[sel.ITEM_CODE] = alterQuantityTotal;
			}
			
			//console.log(sel,alterQuantity)
			
			
			let siquel = `INSERT INTO inventory.item_in_warehouse (
				DOC_ID,
				ITEM_CODE,
				WAREHOUSE_CODE,
				B_QUANTITY,
				QUANTITY,
				TOTAL_QUANTITY,
				UNIT_CONVERSION_ID,
				QTY_AS_OF,
				COMPANY_CODE,
				EXPIRY_DATE,
				LOT_NUMBER) VALUES(?,?,?,?,?,?,?,?,?,?,?)`
				
			let arry =  [
					this.transactionProfile.DOC_ID ,
					sel.ITEM_CODE,
					this.transactionProfile.WAREHOUSE_CODE ,
					sel.QUANTITY ,
					alterQuantity,
					tmp[sel.ITEM_CODE],
					sel.UNIT_CONVERSION_ID ,
					this.transactionProfile.DOCUMENT_DATE ,
					session_data.COMPANY_CODE,
					sel.EXPIRY_DATE,
					sel.LOT_NUMBER,
				]
			if ( this.modalData.arg.args[0].REPLACE_DOCUMENT ){
				
				
				indxx = indxx + 1;
				siquel = `INSERT INTO inventory.item_in_warehouse (
					ID,
					DOC_ID,
					ITEM_CODE,
					WAREHOUSE_CODE,
					B_QUANTITY,
					QUANTITY,
					TOTAL_QUANTITY,
					UNIT_CONVERSION_ID,
					QTY_AS_OF,
					COMPANY_CODE,
					EXPIRY_DATE,
					LOT_NUMBER,
					IS_CANCELLED) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
				arry =  [
					indxx,
					this.transactionProfile.DOC_ID ,
					sel.ITEM_CODE,
					this.transactionProfile.WAREHOUSE_CODE ,
					sel.QUANTITY ,
					alterQuantity,
					tmp[sel.ITEM_CODE],
					sel.UNIT_CONVERSION_ID ,
					this.transactionProfile.DOCUMENT_DATE ,
					session_data.COMPANY_CODE,
					sel.EXPIRY_DATE,
					sel.LOT_NUMBER,
					0
				]
				
				sel['base_qty'] = alterQuantity;
				sel['base_total_qty'] = tmp[sel.ITEM_CODE];
				//console.log(indxx);
				this.updateQuantities(sel);
				//this.rearm();
			}
		
			request.data.data.REQUEST_QUERY.push({
				sql : siquel,
				db : 'DB',
				query_request : 'INSERT',
				values : arry
			});
			//console.log('ttt',this.itemdetails[i]);
			/* console.log(alterQuantity,
					alterQuantityTotal) */
		}
		
		
		//console.log(this.unitConversions);
		
		//load.render();
		//console.log('req',request);
		
		if (confirm("Are you sure this is final? You cannot undo/change this transaction once saved!")){
			
			if ( this.modalData.arg.args[0].REPLACE_DOCUMENT ){
				//setTimeout ( async () => {
					 this.rearm().then( (res) => {
						this.finalSave(request)
					 })
					 .catch(err=>{
						 
					 });
				//},1000);
			}
			else{
				this.finalSave(request);
			}
			
		}
		
		
		
		
	}
	
	finalSave(request){
		let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : "/inventory/sources/templates/modal/loading.modal.template.html",
			parent : this,
		});
		load.render();
		let requestcheck = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : "select DOC_ID from alter_document where DOC_ID = ? limit 1",
							db : 'DB',
							query_request : 'GET',
							index : 'req',
							values : [
								this.transactionProfile.DOC_ID ,
							]
						},	
					]
				}
						
			}
		};
		setTimeout(()=>{
			this.mainService.serverRequest( requestcheck , ( res ) => {
					if(JSON.parse(res).req.length > 0){
						alert("Transaction No. : "+this.transactionProfile.DOC_ID+" Already exists!");
						//break;
						load.onClose();
						return;	
					}
					this.mainService.serverRequest( request , ( res ) => {
					
						// SELECT * FROM `item_in_warehouse` WHERE QTY_AS_OF < '2021-02-26' ORDER BY QTY_AS_OF DESC,ID ASC LIMIT 1 TO GET BEG BAL RELATIVE ON DATE
						// 
						//console.log(Array.isArray(res));
						
						
						MainService.EventObject['transaction'].dispatch ('transaction:onUpdateTransaction' , {
								detail : {
									query : {
										
									}
								} 
						});
						alert("Success!");
						
						this.onClose();
						this.modalData.parent.onClose();
						load.onClose();
					});
			});
				
		},1000);
	}
	
	

	
	changeunitvalues( args ){
		//console.log(args);
		this.bindChildObject ( this , true );	
		if (args.index){
			setTimeout(()=>{
				this.autoComputeCostAndPrice ( args.index );
			},100);
		}
	}
	
	newItems (){
		let table = document.querySelector("#item-details-trans-modal-unit-table tbody");
		let s = this.itemdetails.length - 1;
		if (!this.isUpdate){
				let sel =  this.itemdetails[s];
				let tr = document.createElement ("tr");
					tr.setAttribute('id',s);
				let dsp = [
					'ITEM_NAME',
					'UNIT_NAME',
					//'LOT_NUMBER',
					'EXPIRY_DATE',
					'DEAL',
					'REGULAR',
					'QUANTITY',
					'COST_PER_UNIT',
					'SELLING_PRICE_PER_UNIT',
					'TOTAL_COST' ,
					'TOTAL_PRICE',
				];
				for ( let t in dsp ){
					let td = document.createElement ("td");
					let input = document.createElement("input");
						input.type='text';
					
						input.setAttribute('class','form-control');
						input.setAttribute('data-valuectrl','itemdetails.'+s+'.'+dsp[t]);
						input.setAttribute('data-params','{"index":"'+s+'"}');
						input.setAttribute('data-event','transactionProfile.change.changeunitvalues');
						
					//console.log(sel);
					
					if (dsp[t] == 'EXPIRY_DATE'){
						input.type = 'date';
						input.setAttribute('data-event','transactionProfile.change.changeLotExpDate');

					}
					
					if (dsp[t] == 'LOT_NUMBER'){
						input.setAttribute('data-event','transactionProfile.change.changeLotExpDate');
					}
					
					
					if (dsp[t] == 'ITEM_NAME'){
						//input.setAttribute('data-event','transactionProfile.change.changeunitvalues');
						input.setAttribute('data-event','transactionProfile.click.searchItem');
						input.setAttribute('data-params','{"index":"'+s+'"}');
					}
					
					if (dsp[t] == 'UNIT_NAME'){
						input = document.createElement("select");
						input.setAttribute('class','form-control');
						input.setAttribute('id',dsp[t]+'-'+s);
						input.setAttribute('data-valuectrl','itemdetails.'+s+'.'+dsp[t]);
						input.setAttribute('data-event','transactionProfile.change.changeunitvalues');
						input.setAttribute('data-params','{"index":"'+s+'","field":"'+dsp[t]+'"}');
						
					}
					
					if (dsp[t] == 'QUANTITY'){
						input.setAttribute('data-params','{"index":"'+s+'","field":"'+dsp[t]+'"}');
					}
					
					//if (dsp[t] != 'UNIT_NAME' && s == this.itemdetails.length - 1)
					td.appendChild(input);
					
					tr.appendChild(td);
				}
				
				let td = document.createElement ("td");
				let a = document.createElement("a");
					a.href='javascript:void(0)';
					a.setAttribute('class','btn btn-danger');
					a.setAttribute('data-event','itemprofilecontroller.click.removeItem');
					
					a.setAttribute('data-params','{"INDEX":"'+s+'"}');
					let it = document.createElement('i');
						it.setAttribute("class","icon-remove");
					a.appendChild(it);
				//console.log(sel);
				td.appendChild(a);
				tr.appendChild(td);
				table.appendChild(tr);	
			}
			else{
				alert("Cannot add more items!");
			}
	}
	
	displayItems ( ){
		let table = document.querySelector("#item-details-trans-modal-unit-table tbody");
			table.innerHTML = "";
		let s = 0;
		
		for ( ; s < this.itemdetails.length ; s++ ){
			if (true){
				let sel =  this.itemdetails[s];
				let tr = document.createElement ("tr");
					tr.setAttribute('id',s);
				let dsp = [
					'ITEM_NAME',
					'UNIT_NAME',
					//'LOT_NUMBER',
					'EXPIRY_DATE',
					'DEAL',
					'REGULAR',
					'QUANTITY',
					
					'COST_PER_UNIT',
					'SELLING_PRICE_PER_UNIT',
					'TOTAL_COST' ,
					'TOTAL_PRICE',
				];
				for ( let t in dsp ){
					let td = document.createElement ("td");
					let input = document.createElement("input");
						input.type='text';
				
						input.setAttribute('class','form-control');
						input.setAttribute('data-valuectrl','itemdetails.'+s+'.'+dsp[t]);
						input.setAttribute('data-params','{"index":"'+s+'"}');
						input.setAttribute('data-event','transactionProfile.keyup.changeunitvalues');
						
					if (dsp[t] == 'EXPIRY_DATE'){
						console.log(dsp[t]);
						input.type = 'date';
						input.setAttribute('data-event','transactionProfile.change.changeLotExpDate');

					}
					
					if (dsp[t] == 'LOT_NUMBER'){
						input.setAttribute('data-event','transactionProfile.change.changeLotExpDate');
					}
					
					//console.log(sel);
					if (dsp[t] == 'ITEM_NAME'){
						//input.setAttribute('data-event','transactionProfile.change.changeunitvalues');
						input.setAttribute('data-event','transactionProfile.click.searchItem');
						input.setAttribute('data-params','{"index":"'+s+'"}');
					}
					
					if (dsp[t] == 'UNIT_NAME'){
						input = document.createElement("select");
						input.setAttribute('class','form-control');
						input.setAttribute('id',dsp[t]+'-'+s);
						input.setAttribute('data-valuectrl','itemdetails.'+s+'.'+dsp[t]);
						input.setAttribute('data-event','transactionProfile.change.changeunitvalues');
						input.setAttribute('data-params','{"index":"'+s+'"}');
						//input.setAttribute('disabled','disabled');
						//console.log(sel,'a');
						for ( let i in sel['UNIT_VALS'] ){
							let ss = sel['UNIT_VALS'][i];
							let oo = document.createElement("option");
							oo.innerText = ss['UNIT_NAME'];
							input.appendChild(oo);
							
						}
						/* this.itemdetails[s].ITEM_CODE = detail.arg.ITEM_CODE;
						this.itemdetails[s].ITEM_NAME = detail.arg.ITEM_NAME; */
						/* this.itemdetails[s].UNIT_NAME = sel['UNIT_NAME'];
						this.itemdetails[s].UNIT_CONVERSION_ID = sel['UNIT_CONVERSION_ID']; */
						
						//this.autoComputeCostAndPrice(s);
					}
					if (dsp[t] == 'QUANTITY'){
						input.setAttribute('data-params','{"index":"'+s+'","field":"'+dsp[t]+'"}');
					}
					//if (dsp[t] != 'UNIT_NAME' && s == this.itemdetails.length - 1)
					td.appendChild(input);
					
					tr.appendChild(td);
				}
				
				let td = document.createElement ("td");
				let a = document.createElement("a");
					a.href='javascript:void(0)';
					a.setAttribute('class','btn btn-danger');
					a.setAttribute('data-event','itemprofilecontroller.click.removeItem');
					
					a.setAttribute('data-params','{"INDEX":"'+s+'"}');
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