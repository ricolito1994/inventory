import { ServerRequest } from '../classes/serverrequest.service.class.js';
import { SocketClient } from "../classes/socket.client.class.js";

export class MainService {
	
	static EventObject = {};
	
	constructor ( rootDirectory , sessionData ){
		this.urls = {
			"auth" : { url : rootDirectory+'/scripts/server/routes/auth.route.server.php' },
			"generic" : { url : rootDirectory+'/scripts/server/routes/profile.route.server.php' }
		}
		
		if ( sessionData )
		this.sessionData = sessionData;
		this.sourcesDirectory = rootDirectory;
		this.listeners = [];
		
		this.months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		
		
		Date.prototype.toDateInputValue = function() {
			var local = new Date(this);
			local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
			return local.toJSON().slice(0,10);
		};
		
		Date.prototype.addDays = function(days) {
			this.setDate(this.getDate() + parseInt(days));
			return this;
		};
		
		
		Date.prototype.minusDays = function(days) {
			this.setDate(this.getDate() - parseInt(days));
			return this;
		};
		
	}
	
	addDays ( date, days ){
		return new Date(date).addDays( parseInt(days) ).toDateInputValue();
	}
	
	minusDays ( date, days ){
		return new Date(date).minusDays( parseInt(days) ).toDateInputValue();
	}
	
	/* unique session id for socket identity */
	makeid (length) {
	   let result           = '';
	   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@_+';
	   let charactersLength = characters.length;
	   for ( let i = 0; i < length; i++ ) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	}
	
	serverRequest ( serverRequestObject , thenCallback , catchCallback , async ){
		return new ServerRequest ( serverRequestObject ).queryRequest( async )
			.then( thenCallback )
			.catch ( catchCallback );
	}
	
	serverRequestFileUpload ( serverRequestObject , thenCallback , catchCallback , async ){
		return new ServerRequest ( serverRequestObject ).queryRequestFileUpload( async )
			.then( thenCallback )
			.catch ( catchCallback );
	}
	
	openPage (verb, url, data, target) {
		var form = document.createElement("form");
		form.action = url;
		form.method = verb;
		form.target = target || "_self";
		if (data) {
			for (var key in data) {
			  var input = document.createElement("textarea");
			  input.name = key;
			  input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
			  form.appendChild(input);
			}
		}
		form.style.display = 'none';
		document.body.appendChild(form);
		form.submit();
	}
	
	openPopupWindow (verb, url, data,settings){
		var form = document.createElement("form");
		form.action = url;
		form.method = verb;
		//form.target = target || "_self";
		form.target='newindow';
		if (data) {
			for (var key in data) {
			  var input = document.createElement("textarea");
			  input.name = key;
			  input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
			  form.appendChild(input);
			}
		}
		form.style.display = 'none';
		document.body.appendChild(form);
		settings = !settings ? 'toolbars=0,width=400,height=800,left=200,top=200,scrollbars=1,resizable=1' : settings;
		window.open(url,'newindow',settings);
		form.submit();
	}
	
	
	socketON(){
		if (!this.SocketClient){
			//if (!this.SocketClient.isConnected){
				//this.SocketClient = new SocketClient ( 'ws://localhost:8090/socketserver/socket_route.php' , this );
				//this.SocketClient._onConnect();
			//}
		}
		
	}
	
	getThisService(){
		return this;
	}

	getCookie(cookieName) {
		var name = cookieName + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var cookieArray = decodedCookie.split(';');
	  
		for (var i = 0; i < cookieArray.length; i++) {
		  var cookie = cookieArray[i];
		  while (cookie.charAt(0) === ' ') {
			cookie = cookie.substring(1);
		  }
		  if (cookie.indexOf(name) === 0) {
			return cookie.substring(name.length, cookie.length);
		  }
		}
		return "";
	}

	setCookie(cookieName, cookieValue, daysToExpire) {
		var expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + daysToExpire);
		var cookieString = cookieName + "=" + cookieValue + "; expires=" + expirationDate.toUTCString() + "; path=/";
		document.cookie = cookieString;
	}

	checkCookie(cookieName) {
		var name = cookieName + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var cookieArray = decodedCookie.split(';');
	  
		for (var i = 0; i < cookieArray.length; i++) {
		  var cookie = cookieArray[i];
		  while (cookie.charAt(0) === ' ') {
			cookie = cookie.substring(1);
		  }
		  if (cookie.indexOf(name) === 0) {
			return true;
		  }
		}
		return false;
	}
	
	loadTemplate ( path, id , callback , append , qselect ) {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function (e) { 
			if (xhr.readyState == 4 && xhr.status == 200) {
				if ( !append ){
					if ( !qselect )
						document.getElementById(id).innerHTML = xhr.responseText;
					else{
						if(document.querySelector(id))
						document.querySelector(id).innerHTML = xhr.responseText;
					}
				}else{
					$("#"+id).append (xhr.responseText);
				}
				callback();
			}
		 }
		xhr.open("GET", path, true);
		xhr.setRequestHeader("Cache-Control", "no-cache");
		xhr.setRequestHeader("Pragma", "no-cache");
		xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
		xhr.send();
	}
	
	isPromise(object){
	  if(Promise && Promise.resolve){
		return Promise.resolve(object) == object;
	  }else{
		return false;
	  }
	}//vgHjN4r4nmMD@qIfHn6K@An9
	
	children ( childrenObject , parentDOM , param , promiseValue ){
		//console.log ( 'aaa', param );
		let body = "";
		let childLen = childrenObject.length;
		let ch = 0;
		for ( ; ch < childLen ; ch++ ){
			let sel = childrenObject[ ch ];
			let dom = document.createElement ( sel.createElement );
			//console.log(sel.createElement,param);
			if ( sel.attributes ){
				for ( let dh = 0 ; dh < sel.attributes.length ; dh++ ){
					let selAttrb = sel.attributes[ dh ];
					let val = "";
					let isPromise = false;
					if ( ( this.isFunction(selAttrb.value) && !selAttrb.type ) || ( this.isFunction(selAttrb.value) && selAttrb.spec_val ) ){
						val = selAttrb.value( param );
					}
					else{
						val = selAttrb.value;
					}
					
					if ( !!val && typeof val.then === 'function' ){
						isPromise = true;
						val.then ( data => {
							
							dom [ selAttrb.attribute ] = data;
							
							
						})
						.catch ( err => {
							
						});
					}
					
					
					if ( typeof selAttrb.type == 'undefined' && !isPromise ){
						dom [ selAttrb.attribute ] = val;
					}else if (!isPromise) {
						switch ( selAttrb.type ){
							case "dataset":
								// selAttrb.type ; should always be 'dataset'
								
								dom[ selAttrb.type ][ selAttrb.attribute ] = val;
							
							break;
							case "newAttribute":
								/* 
									assign new attribute to the DOM 
									if there's any
								*/
							break;
							case "event":
								let params = param;
								if ( selAttrb.param ){
									params = selAttrb.param( params );
								}
								/* else if ( selAttrb.currentValue ){
									console.log ( dom.value , 'aaa' );
									params = dom.value;
								} */
								dom.addEventListener( selAttrb.attribute , val.bind('',params) );
							break;
						}
					}
					
				}
			}
			parentDOM.appendChild( dom );
			
			//if ( typeof sel.children != 'undefined' ){
			if ( sel.children ){
				this.children( sel.children, dom , param );
			}else{
				continue;
			}
			
		}
		
	}
	
	populateSYoption ( f, range , select ){
		for ( let s = f ; s <= range ; s++ ){
			let option = document.createElement( "option" );
				option.innerText = s;
			
			if ( this.isFunction(select.appendChild) )
				select.appendChild ( option );
		}
	}
	
	msToTime(duration) {
	  var milliseconds = parseInt((duration % 1000) / 100),
		seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	  hours = (hours < 10) ? "0" + hours : hours;
	  minutes = (minutes < 10) ? "0" + minutes : minutes;
	  seconds = (seconds < 10) ? "0" + seconds : seconds;

	  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
	}
	
	
	object2array ( parameters ){
		var converted = [];
		var counter = 0;
		for ( var index in parameters ){
			var arr  ={};
			arr[index] = parameters [ index ];
			converted [ counter ] = arr;
			counter++;
		}
		return converted;
	}
	
	string_2_object	( array , escapeCharacter ){
		var length = array.length;
		var object = {};
				
		for ( var s = 0 ; s < length ; s++ ){
			var split = array[s].split( escapeCharacter );
			object[ split[ 0 ] ] = split[ 1 ];
		}
		return object;		
	}
	
	
	create_arguments ( arg , CRUD_COMMAND ) {
		var parameters = '( ';
		var fields = '( ';
		var values = [];
		
		for ( var i = 0 ; i < arg.length ; i ++ ){
			for ( var index in arg[i] ){
				values[i] = arg[i][index];
				if ( i != arg.length - 1 ){
					fields += ' '+index+',';
					parameters += ' ?, ';
				}
				else{
					fields += ' '+index+' )';
					parameters += ' ? )';
				}
			}
		}

		return {
			fields : fields,
			params : parameters,
			values : values
		}
	}
	
	getCurrentDateActual ( ){
		let date = this.getCurrentDate ().split('-');
		
	}
	
	getCurrentDate (){
		return new Date().toDateInputValue(); 
	}
	
	
	getCurrentTimeTick ( callback ){
		setInterval(()=>{
			callback();
		},1000)
	}
	
	calculateAge ( birthDate , currentDate ){
		if ( parseInt(birthDate[1]) <= currentDate[1] ){
			if ( ( parseInt(birthDate[1]) == currentDate[1] && birthDate[2] <= currentDate[2] ) || parseInt(birthDate[1]) < currentDate[1] ){
				return ( (  currentDate[0] - birthDate[0] ) );
			}
		}
		return ( (  currentDate[0] - birthDate[0] ) - 1  );
	}
	
	generate_id_timestamp( keyword ) {
		var timestamp = Math.floor( Date.now() / 1000 );
		return keyword+''+timestamp;
	}
	
	isFunction(functionToCheck) {
		return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
	}
	
	time(){
		var str = "";

		//var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
		//var months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

		var now = new Date();
		
		var h = now.getHours().toString() >= 10 ? now.getHours().toString() : '0'+ now.getHours().toString();
		var m = now.getMinutes().toString() >= 10 ? now.getMinutes().toString() : '0'+ now.getMinutes().toString();
		var s = now.getSeconds().toString() >= 10 ? now.getSeconds().toString() : '0'+ now.getSeconds().toString();
		
		str +=  h +":" + m + ":"+ s;
		//document.getElementById("todaysDate").innerHTML = str;
		//console.log(str);
		//$('.time-change').val(str);
		//TIME_GLOBAL = str;
		return str;
	}
	
	paramBuilder ( potentialParams ){
		
	}
	
	listen (){
		
	}
	
	groupBy(list, keyGetter) {
		const map = new Map();
		list.forEach((item) => {
			 const key = keyGetter(item);
			 const collection = map.get(key);
			 if (!collection) {
				 map.set(key, [item]);
			 } else {
				 collection.push(item);
			 }
		});
		return map;
	}
		
	
	getCurrentAcademicYear ( ){
		//this.getCurrentDate() +' ' +
		let currentAcademicYear = (this.getCurrentDate().split('-')[0]);
		
		if ( new Date() > new Date(currentAcademicYear+'-06-01') ){
			return currentAcademicYear;
		}
		
		return currentAcademicYear - 1;
	}
	
	
	getCurrentYear( ){
		return this.getCurrentDate().split('-')[0];
	}
	
	
	
}
