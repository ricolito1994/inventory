import { Modal } from "../classes/modal.controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { MainService } from "../classes/main.service.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { TransactionMainModal } from "./transaction.modal.controller.class.js";

export class ItemStockCardModal extends Modal{

	constructor ( modalData ){
		super ( modalData );
		this.init ( modalData );
	}
	
	init ( modalData ){
		this.modalData = modalData;
		this.isUpdate = this.modalData.isUpdate;
		//this.itemdetails = this.modalData.arg.args[0];
		//this.units = this.itemdetails.UNIT;
		//console.log(this.modalData);
		//	this.itemname = this.modalData.arg.args[0]['ITEM_NAME'];
		
		this.expdate = '';
		this.dtoo = this.mainService.getCurrentDate();
		this.dfrm = this.mainService.addDays (this.dtoo , -7);
		this.stockCardInfo = [];
		//console.log(modalData);
		//console.log(this.units);
	}
	
	
	async constructs(){
		//setTimeout(()=>{
			//this.bindChildObject(this,this.elem);
		
		let itemdetails = await this.getItemDetails();
		this.itemdetails = itemdetails;
		//console.log(this.modalData.arg.args);
		this.units = this.itemdetails.UNIT;
		this.itemname = this.itemdetails['ITEM_NAME'];
		this.unittotal = this.units ? this.units[0]['HEIRARCHY'] : [];
		
		this.displayitems();
			
		//},2000);
		
		let selunit = document.getElementById('unit-total');
		
		for (let i in this.units){
			let sel = this.units[i];
			let opt = document.createElement('option');
			opt.innerText = sel.UNIT_NAME;
			opt.value = sel.HEIRARCHY;
			selunit.appendChild(opt);
		}
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
								{
									sql : "SELECT * FROM inventory.item_in_warehouse IIW WHERE IIW.ITEM_CODE = ? GROUP BY IIW.EXPIRY_DATE",
									db : 'DB',
									query_request : 'GET',
									index : 'EXPIRY_DATES',
									values : [
										item.ITEM_CODE,
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
					
					let expdom = document.querySelector('#expiry_dates');
					let options = `<option value=''>All</option>`;
					
					
					for (let i in res23.EXPIRY_DATES ){
						let sl = res23.EXPIRY_DATES[i];
						options+=`<option>${sl.EXPIRY_DATE}</option>`;
					}
					expdom.innerHTML = options;
					
					
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
	
	convertUnits ( q , m , unit ){
		let t = 1;
		
		let uu = this.units;
		
		if (!m){
			/* for ( let i = this.units.length - 1 ; i > 0 ; i-- ){
				console.log(i,uu[i]);
			} */
			//uu.reverse();
		}
		
		
		for ( let i in uu ){
			let sl = uu[i];
			t *= parseFloat(sl.QTY);
			
			let u = !unit ? this.unittotal  : unit; 
			//console.log(u , sl.HEIRARCHY , this.units[ u ]['HEIRARCHY'] , m , t);
			if ( sl.HEIRARCHY == this.units[ u ]['HEIRARCHY'] ){
				break;
			}
		}
						
						
		
		
		//console.log(this.units[this.unittotal]['UNIT_NAME'],q,t)
		return (!m ? q / t : q * t );
				
	}
	

	convert2units ( ){
		let converted1 = 0;
		return ( parseInt( converted1 )+1 == Math.round(  converted1 ) ? Math.round(  converted1 ) : parseInt(  converted1 ) );
	}
	
	//this.convertUnits3(sel,false,'REGULAR',this.units[this.unittotal].UNIT_NAME,sel.UNIT_NAME )
	
	convertUnits3 ( item , m , s , tounit , unitname , SV ){
		//console.log(tounit , unitname);
		let u = this.units;
		item[SV] = parseFloat(item[s]);
		//console.log(item[unitname],'asda')
		let thisUnit = u[u.findIndex ( x => x.UNIT_NAME == unitname )];
		//let frmUnit = u[u.findIndex ( x => x.UNIT_NAME == fromunit )];
		let toUnit = u[u.findIndex ( x => x.UNIT_NAME == tounit )];
		//console.log(item,s,thisUnit.UNIT_NAME , toUnit.UNIT_NAME);
		let multiplier = 1;
		//console.log(thisUnit,toUnit)
		if (thisUnit['HEIRARCHY'] > toUnit['HEIRARCHY']){
			let next = thisUnit['HEIRARCHY']  ;
					
			while ( true ){
				let sel = u[ next ];
							
						
				/* if (sel)
					multiplier *= sel.QTY; */
				//		console.log(toUnit.UNIT_NAME == sel.IS_EQUAL_TO)
				//		console.log(toUnit,toUnit.UNIT_NAME,sel.IS_EQUAL_TO,multiplier);
				if (toUnit.UNIT_NAME == sel.IS_EQUAL_TO){
					
					break;
				}
				else{
					multiplier *= sel.QTY;
				}
						
						
				next --;
			}
		}
		else{
			for (let i = thisUnit.HEIRARCHY ; i < u.length ; i++ ){
				let sel = u[i];
				//		console.log(sel)
				//
				if ( (sel.IS_EQUAL_TO == toUnit.UNIT_NAME) || (i == u.length - 1 && thisUnit.HEIRARCHY != 0)){
				//if ( (sel.IS_EQUAL_TO == toUnit.UNIT_NAME) ) {
					break;
				}
				else{
					//console.log( toUnit.UNIT_NAME,thisUnit.HEIRARCHY )
					multiplier *= sel.QTY;
				}
						
			}
					
					
		}
		
		//console.log(thisUnit['HEIRARCHY'] > toUnit['HEIRARCHY'] ? item.TOTAL_QUANTITY / multiplier : item.TOTAL_QUANTITY * multiplier );
		//console.log(unitname,tounit,item.TOTAL_QUANTITY,multiplier, thisUnit['HEIRARCHY'], toUnit['HEIRARCHY'] )
		//console.log(thisUnit['HEIRARCHY'] , toUnit['HEIRARCHY'] , item.TOTAL_QUANTITY,s);
		if (thisUnit['HEIRARCHY'] == toUnit['HEIRARCHY']){
			return parseFloat(item.TOTAL_QUANTITY);
		}
		else if ( thisUnit['HEIRARCHY'] > toUnit['HEIRARCHY']  ){
			return parseFloat(item.TOTAL_QUANTITY / multiplier );
		}
		else{
			return parseFloat(item.TOTAL_QUANTITY * multiplier );
		}
				
		//console.log(thisUnit['HEIRARCHY'] , toUnit['HEIRARCHY'],item.TOTAL_QUANTITY,multiplier);
				
		//resolve (!m ? item.TOTAL_QUANTITY / t : item.TOTAL_QUANTITY * t );
				
		return 0;	
	}
	
	
	convertUnits4 ( value , currentUnit, toUnit ){
		let u = this.units;
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
	
	
	displayitems(){
		this.stockCardInfo = [];
		
		let expdate1 = this.expdate !=='' ? `AND id.EXPIRY_DATE='${this.expdate}'`  : '';
		let expdate2 = this.expdate !=='' ? `AND iiw.EXPIRY_DATE='${this.expdate}'`  : '';
		
		let sql = `SELECT u.*,id.*,ad.*,imd.*,iiw.ID,iiw.TOTAL_QUANTITY,iiw.B_QUANTITY,iiw.QUANTITY AS QTTY,ad.TYPE as dtype,id.EXPIRY_DATE AS EXPIRY_DATE from inventory.alter_document ad 
				 inner join inventory.item_details id ON id.DOC_ID = ad.DOC_ID 
				 INNER JOIN inventory.item_master_data imd ON id.ITEM_CODE = imd.ITEM_CODE 
				 inner join inventory.unit u ON u.UNIT_CONVERSION_ID = id.UNIT_CONVERSION_ID 
				 left join ( 
					select ID, EXPIRY_DATE,DOC_ID,ITEM_CODE,B_QUANTITY,TOTAL_QUANTITY,QUANTITY 
					FROM inventory.item_in_warehouse 
				 ) iiw ON (iiw.EXPIRY_DATE = id.EXPIRY_DATE && iiw.DOC_ID = id.DOC_ID && iiw.ITEM_CODE = id.ITEM_CODE )
				 WHERE id.ITEM_CODE = ? and ( ad.DOCUMENT_DATE between ? and ? )  
				 AND imd.SUPPLIER_CODE = ?  ${expdate1} GROUP BY iiw.ID  
				 ORDER BY iiw.ID ASC  `;//INNER JOIN supplier s ON s.SUPPLIER_CODE = ad.SUPPLIER_ID 
		let stocks = 0;		 
	/* 	let sql = 'SELECT *,ad.TYPE as dtype,id.EXPIRY_DATE AS EXPIRY_DATE from alter_document  '+
				 'inner join `item_details` id ON id.DOC_ID = ad.DOC_ID '+
				 'INNER JOIN item_master_data imd ON id.ITEM_CODE = imd.ITEM_CODE '+
				 'inner join unit u ON u.UNIT_CONVERSION_ID = id.UNIT_CONVERSION_ID '+
				 'WHERE id.ITEM_CODE = ? and ( ad.DOCUMENT_DATE between ? and ? )  '+
				 'ORDER BY ad.id ASC'; */
				 
		let begbal = `SELECT * FROM inventory.item_in_warehouse iiw INNER JOIN inventory.unit u ON iiw.UNIT_CONVERSION_ID = u.UNIT_CONVERSION_ID WHERE iiw.ITEM_CODE = ? AND ( iiw.QTY_AS_OF < ? AND iiw.IS_CANCELLED = 0) ${expdate2}  ORDER BY iiw.ID DESC `;
				  
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : sql,
							db : 'DB',
							query_request : 'GET',
							index : 'items',
							values : [this.itemdetails.ITEM_CODE , this.dfrm , this.dtoo, this.itemdetails.SUPPLIER_CODE ]
						},	
						{
							sql : begbal,
							db : 'DB',
							query_request : 'GET',
							index : 'begbal',
							values : [this.itemdetails.ITEM_CODE ,this.dfrm],
						},	
						{
							sql : `SELECT *, iiw.TOTAL_QUANTITY AS QUANTITY,QUANTITY AS QQTY,iiw.ID as IIWID1 FROM inventory.item_in_warehouse iiw 
								   INNER JOIN  inventory.unit u ON u.UNIT_CONVERSION_ID = iiw.UNIT_CONVERSION_ID 
								   WHERE iiw.ITEM_CODE = ? AND ( iiw.QTY_AS_OF BETWEEN ? AND ? ) AND iiw.DOC_ID != '' ${expdate2} order by iiw.ID asc`,
								 //  "WHERE iiw.ITEM_CODE = ? AND ( iiw.QTY_AS_OF BETWEEN ? AND ? )  ",
								 //  " AND iiw.ID=(SELECT MAX(ID) FROM item_in_warehouse where DOCUMENT_DATE='"+this.dfrm+"')",
							//sql : "SELECT * FROM `item_in_warehouse` WHERE ITEM_CODE = ? AND ( QTY_AS_OF < ? ) ",
							//SELECT *,SUM(QUANTITY) FROM `item_in_warehouse` WHERE ITEM_CODE = 'ITEM1614858523' AND ( QTY_AS_OF BETWEEN '2021-03-04' AND '2021-03-06' ) GROUP BY LOT_NUMBER,EXPIRY_DATE
							db : 'DB',
							query_request : 'GET',
							index : 'bals',
							values : [this.itemdetails.ITEM_CODE ,this.dfrm , this.dtoo ]
						},	
					]
				}
						
			}
		};
	
		
		this.mainService.serverRequest( request , ( res ) => {
			
			let tbody = document.querySelector('#'+this.modalID + ' #stockcardtable tbody');
				tbody.innerHTML= '';
			
			let items = JSON.parse(res).items;
			//console.log(res);
			let begbal = JSON.parse(res).begbal;
			//console.log('begbal',begbal);
			let bals = JSON.parse(res).bals;
			
			//console.log(bals);
			//console.log('BB',begbal);
			let beginningbalance = begbal[0] ? begbal[0][(this.expdate !=='' ? 'B_QUANTITY' : 'TOTAL_QUANTITY')] : 0;
			//console.log(( typeof bals[0]!=='undefined', typeof items[0]!=='undefined'));
			//console.log(this.itemdetails.ITEM_CODE,'bals >',bals ,' items > ', items[0]);
			//console.log('bals',bals);
			//console.log('balbals',bals)
			//console.log(parseInt(bals[0]['HEIRARCHY']) , parseInt(items[0]['HEIRARCHY']))
			//console.log(begbal[0]);
			if(  typeof items[0]!=='undefined'){
				let q2 = parseFloat(items[0]['QUANTITY']);
			}
			//console.log(beginningbalance);
			/* if(items.length == 0){
				//if (begbal[0])
				//beginningbalance = q1;
			} */
			//console.log('begbal',this.units);
			//let converted = this.convertUnits(beginningbalance,true);
			let converted = this.convertUnits4(beginningbalance,this.units[this.unittotal].UNIT_NAME,this.units[this.unittotal].UNIT_NAME)
			let bbb = ( parseInt( converted)+1 == Math.round( converted) ? Math.round( converted) : parseInt( converted ) )
			
			let tr = document.createElement ('tr');
			
			
			let td0 = document.createElement ('td');
				td0.innerHTML = '<i class="icon-check-sign" style="color:green"></i> BEGGINING BALANCE';
			
			let td1 = document.createElement ('td');
				td1.innerText = this.dfrm;
			
			let td2 = document.createElement ('td');
				td2.innerText = "";
				
			let td9 = document.createElement ('td');
				td9.innerText = "";
				
			let td10 = document.createElement ('td');
				td10.innerText = "";
				
			let td11 = document.createElement ('td');
				td11.innerText = "";
				
			let td12 = document.createElement ('td');
				td12.innerText = "";	
				
			let td13 = document.createElement ('td');
				td13.innerText = "";
			
			let td3 = document.createElement ('td');
				td3.innerText = "";
				
			let td4 = document.createElement ('td');
				td4.innerText = 0;	
				
			let td5 = document.createElement ('td');
				td5.innerText = 0;	
			
			let td6 = document.createElement ('td');
				
				td6.innerText = bbb;
			
			let td7 = document.createElement ('td');
				
				td7.innerText = bbb;	
			
			let td8 = document.createElement ('td');
				
				td8.innerText = bbb;
			console.log(bbb);
			stocks = parseFloat(bbb);
			
			let td15 = document.createElement ('td');
				td15.innerText = this.units[this.unittotal]['UNIT_NAME'];;
			
				tr.appendChild(td0);
				tr.appendChild(td9);
				tr.appendChild(td10);
				
				tr.appendChild(td1);
				tr.appendChild(td11);
				tr.appendChild(td12);
				tr.appendChild(td13);
				tr.appendChild(td2);
				tr.appendChild(td4);
				tr.appendChild(td6);
				tr.appendChild(td5);
				
				tr.appendChild(td7);
				//tr.appendChild(td3);
				tr.appendChild(td8);
				tr.appendChild(td15);
				
				tbody.appendChild(tr);
				
			//let totalq = parseFloat(beginningbalance); 
			this.stockCardInfo.push({
				BEGBAL : true,
				DOCUMENT_DATE : this.dfrm,
				TQUANTITY : bbb
			});
			let rembalance = 0;
			//console.log('items',items)
			for ( let i in items ){
				
				let sel = items[i];
				//let total = parseFloat(res[0].QUANTITY);
				let tr = document.createElement ('tr');
					if (sel.STATUS=='Cancelled')
					tr.style.background = '#ef8080';
					
				let td0 = document.createElement ('td');
				//	td0.innerHTML = i==0 ? '<i class="icon-check-sign" style="color:green"></i> Beggining' : '';
				
				let td1 = document.createElement ('td');
					td1.innerText = sel.DOCUMENT_DATE;
					
				let td2 = document.createElement ('td');
					td2.innerText = sel.SUPPLIER_NAME;
					
				let td9 = document.createElement ('td');
					//td9.innerHTML = '<a href="javascript:void(0);" data-event="itemstockcardcontroller.click.opentransaction" data-params="{}">'+sel.DOC_ID+"</a>";
					let a = document.createElement('a');
						a.setAttribute('href','javascript:void(0)');
						a.setAttribute('data-event','itemstockcardcontroller.click.opentransaction');
						a.setAttribute('data-params','{"DOC_ID":"'+sel.DOC_ID+'"}');
						a.innerText = sel.DOC_ID;
				td9.appendChild(a);		
				
				
				let td10 = document.createElement ('td');
					td10.innerText = sel.dtype;
					
				let td11 = document.createElement ('td');
					td11.innerText = sel.STATUS;
				
				let td12 = document.createElement ('td');
					td12.innerText = sel.LOT_NUMBER;
				
				let td13 = document.createElement ('td');
					td13.innerText = sel.EXPIRY_DATE;
					
				
					//td4.innerText = this.units[this.unittotal]['UNIT_NAME'];
				
				let ccv = parseInt(this.unittotal)== parseInt(sel.HEIRARCHY);
				let dds = true;
				let fff = undefined;
				if (!ccv){
					if ( parseInt(this.unittotal) > parseInt(sel.HEIRARCHY) ){
						dds = true;
						fff = parseInt(this.unittotal);
					}
					else if ( parseInt(this.unittotal) < parseInt(sel.HEIRARCHY) ){
						dds = false;
						fff = parseInt(sel.HEIRARCHY);
					}
				}
				
				let td4 = document.createElement ('td');
					
					td4.innerText = this.units[ this.unittotal ].UNIT_NAME;
					sel['UNIT_NAME__'] = this.units[ this.unittotal ].UNIT_NAME;
				
				let td5 = document.createElement ('td');
				
				//let converted1 = this.convertUnits3(sel,false,'REGULAR',this.units[this.unittotal].UNIT_NAME,sel.UNIT_NAME )
				let converted1 = this.convertUnits4(sel.REGULAR,sel.UNIT_NAME,this.units[this.unittotal].UNIT_NAME);;
				let ssb1 = ( parseInt( converted1 )+1 == Math.round(  converted1 ) ? Math.round(  converted1 ) : parseInt(  converted1 ) );
					
					td5.innerText = ssb1;
					sel['REGULAR'] = ssb1;
				let td6 = document.createElement ('td');
				
				//sel['DEAL'] = this.convertUnits3(sel,false,'DEAL',this.units[0].UNIT_NAME,sel.UNIT_NAME);
				//console.log(sel);
				let converted2 = this.convertUnits4(sel.DEAL,sel.UNIT_NAME,this.units[this.unittotal].UNIT_NAME);
				
				//let converted2 =0;
				let ssb2 = ( parseInt( converted2 )+1 == Math.round(  converted2 ) ? Math.round(  converted2 ) : parseInt(  converted2 ) );
					td6.innerText = ssb2 ;;
					sel['DEAL_'] = ssb2;
				let td7 = document.createElement ('td');
				
				
				//let converted3 = this.convertUnits3(sel,false,'QUANTITY',this.units[this.unittotal].UNIT_NAME,sel.UNIT_NAME )
				let converted3 = this.convertUnits4(sel.QUANTITY,sel.UNIT_NAME,this.units[this.unittotal].UNIT_NAME);;
				let ssb3 = ( parseInt( converted2 )+1 == Math.round(  converted3 ) ? Math.round(  converted3 ) : parseInt(  converted3 ) );
					td7.innerHTML = ssb3+' '+ (sel.STOCK_IN_OUT == 1 ? '<b><i style="color:green" class="icon-circle-arrow-up">' : '<b><i style="color:red"  class="icon-circle-arrow-down">');
					 
				sel['QUANTITY'] = ssb3;
				
				//let td3 = document.createElement ('td');
				//	td3.innerHTML = sel.STOCK_IN_OUT == 1 ? '<b><i style="color:green" class="icon-circle-arrow-up"></i> IN</b>' : '<b><i style="color:red"  class="icon-circle-arrow-down"></i> OUT</b>';
					
				//	console.log('cel',sel);
				
				/* if (sel.STOCK_IN_OUT == 1){
					totalq += parseFloat(sel.QUANTITY);
				}
				else{
					totalq -= parseFloat(sel.QUANTITY);
				} */
				
				let index = bals.findIndex ( x => (x.DOC_ID == sel.DOC_ID) );
				//let indexx = bals.findIndex ( x => x.ID == sel.ID );
				
				//console.log( bals[indexx])
				//bals.units = this.units;
				//console.log(bals[i],`adxxx`);
				let td8 = document.createElement ('td');
				
				let qqmartin = (this.expdate !=='' ? 'QTTY' : 'TOTAL_QUANTITY');
				//console.log('balls',bals[i][qqmartin])
				//console.log('sss',sel);
				let ccu = this.convertUnits3(sel,false,qqmartin,this.units[this.unittotal].UNIT_NAME,this.units[0].UNIT_NAME,'TOTAL_QUANTITY' )
				//console.log(bals[i].IIWID1,bals[i].QUANTITY,ccu)
				//console.log(bals,index,this.units);
				//let bls = bals[index]['QUANTITY'] ;
				
				//let bls = ccu;
				if (sel.STATUS!== 'Cancelled'){
					if(sel.STOCK_IN_OUT == 1)
						stocks += ssb3;
					else
						stocks -=ssb3;
				}
				//console.log(ssb3);
				
				
				
				//let ccu = this.convertUnits(bls , true);
					let cccu =( parseInt( ccu)+1 == Math.round( ccu) ? Math.round( ccu) : parseInt( ccu ) );
					td8.innerText = cccu;
					
				let td15 = document.createElement ('td');
					td15.innerText = this.units[this.unittotal]['UNIT_NAME'];
					sel['TQUANTITY'] =  cccu;
				
				items[i]['TQUANTITY'] = cccu;
				console.log('TQ',ccu);
			
				
				
				tr.appendChild(td0);
				tr.appendChild(td9);
				tr.appendChild(td10);
				tr.appendChild(td1);
				tr.appendChild(td12);
				tr.appendChild(td13);
				tr.appendChild(td11);
				tr.appendChild(td2);
				tr.appendChild(td4);
				tr.appendChild(td6);
				tr.appendChild(td5);
				
				tr.appendChild(td7);
				//tr.appendChild(td3);
				tr.appendChild(td8);
				tr.appendChild(td15);
				
				tbody.appendChild(tr);
				//sel['TQUANTITY'] = bals[index]['QUANTITY'];
				this.stockCardInfo.push(sel);
			}
			//console.log('syaboo',items)
			let trt = document.createElement ('tr');
			for (let x = 0 ; x < 13 ; x++){
				let tdt = document.createElement ('td');
				if ( x == 12 ){
					let ssb = '';
					//let converted = this.convertUnits(bals[bals.length-1]['QUANTITY'] , true);
					//let ssb = ( parseInt( converted )+1 == Math.round(  converted ) ? Math.round(  converted ) : parseInt(  converted ) );
					tdt.innerHTML = '<b>'+ssb+'</b>';
				}
				if ( x == 10 ){
					tdt.innerHTML = '<b>Remaining Balance  </b>';
				}
				
				if ( x == 12 ){
					
					
					
					//tdt.innerHTML = `<b>${items[items.length - 1]['TQUANTITY'] } </b>`;
					tdt.innerHTML = `<B>${stocks}</B>`
				}
				trt.appendChild(tdt);
			}
			
			let td16 = document.createElement ('td');
				td16.innerText = this.units[this.unittotal]['UNIT_NAME'];
			
			trt.appendChild(td16);
			tbody.appendChild(trt);
			
			this.binds(this.controllerName,'#'+this.modalID);
			this.bindChildObject ( this , false );
		});	  
		
	}
	
	
	
	opentransaction(...A) {
		//alert("WEW");
		//console.log(arg[0].DOC_ID);
		let request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : "SELECT * FROM alter_document id WHERE id.DOC_ID = ? order by id.ID",
							db : 'DB',
							query_request : 'GET',
							index : 'TRANSACTION',
							values : [A[0].DOC_ID],

						},
						{
							sql : "SELECT *,id.UNIT_CONVERSION_ID as UNIT_CONVERSION_ID,id.EXPIRY_DATE as EXPIRY_DATE FROM `item_details` id INNER JOIN item_master_data imd ON imd.ITEM_CODE=id.ITEM_CODE WHERE id.DOC_ID = ? order by id.ID",
							db : 'DB',
							query_request : 'GET',
							index : 'ITEM_DETAILS',
							values : [A[0].DOC_ID],

						},
														
						{
							sql : "SELECT *,u.UNIT_CONVERSION_ID as UNIT_CONVERSION_ID,id.TOTAL_PRICE as TOTAL_PRICE,id.TOTAL_COST as TOTAL_COST FROM `item_details` id INNER JOIN item_master_data imd ON imd.ITEM_CODE=id.ITEM_CODE "+
								"inner join unit u ON u.ITEM_CODE=imd.ITEM_CODE WHERE id.DOC_ID = ?",
							db : 'DB',
							query_request : 'GET',
							index : 'UNIT_VALS',
							values : [A[0].DOC_ID],

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
		setTimeout(()=>{
			this.mainService.serverRequest( request , ( res ) => {
				res = JSON.parse(res);
												
				let itemdetails = res['ITEM_DETAILS'];
				let unitvals = res['UNIT_VALS'];
				let arg = res['TRANSACTION'][0];
				arg['ITEM_DETAILS'] = itemdetails;
				arg['UNIT_VALS'] = unitvals;
												
				let transaction = new TransactionMainModal({
					modalID :  "transactionmodal",
					controllerName : "transactionmodal",
					template : "/inventory/sources/templates/modal/transaction.main.modal.template.html",
					parent : this,
					isUpdate : true,
					args : [arg]
				});
				transaction.render();
				load.onClose();
			});
		},500);
										
	}
	
	
		
	
	printStockCard ( ) {
		this.mainService.openPage("POST" ,"/inventory/sources/templates/reports/itemmasterdata.stockard.report.template.php",{
			data : {
				//attobj : this.generateTimeSheet(),
				itemstockobj : this.stockCardInfo,
				datefrm : this.dfrm,
				dateto : this.dtoo,
			},
		},"_blank");
	}
	
	
	changefilter(){
		this.bindChildObject(this,this.elem);
		this.displayitems();
	}
	
}