import { Controller } from "./controller.class.js";

export class Modal extends Controller{
	
	constructor ( modalData ){
		super( modalData.controllerName , modalData.parent.mainService );
		this.controllerName = modalData.controllerName;
		this.modalID = modalData.modalID;
		this.template = modalData.template;
		this.params = modalData.params;
		this.parent = modalData.parent;
		this.service = this.parent.mainService;
		
	}
	
	render(){
		this.service.loadTemplate(this.template , "main-div" , ( ) => {
			$("#"+this.modalID).modal();
			this.listen();
			this.constructs();
			this.binds(this.controllerName,'#'+this.modalID);
			/* automatically populate schoolyear options */
			this.populatesy ( document.querySelector ( 'div#'+this.modalID ).children , this.controllerName );
			this.bindChildObject ( this , false );
		},true);
	}
	
	renderDiv( container ){
		this.service.loadTemplate(this.template , container , ( ) => {
			// this.listen();
			this.constructs();
			//console.log(this.modalID,this.controllerName,container);
			this.binds(this.controllerName,'#'+this.modalID);
			/* automatically populate schoolyear options */
			this.populatesy ( document.querySelector ( 'div#'+this.modalID ).children , this.controllerName );
			this.bindChildObject ( this , false );
		},true);
	}
	
	
	destroyModal (){
		this.unbinds (this);
		$('#'+this.modalID).remove();	
	}
	
	destroy(){
		this.unbinds (this);
		//console.log(this.modalID);
	}
	
	onClose(){
		$('#'+this.modalID).modal("hide");
		//console.log('onclode',this);
		setTimeout(()=>{
			this.destroyModal();
		},500);
	}
	
	closeModal() {
		
	}
	
	listen(){
	
		/* $( "#"+this.modalID ).unbind().on("hidden.bs.modal",  () => {
			this.onClose();
		}); */
		
		/* $('.modal').on('show.bs.modal', function(event) {
			var idx = $('.modal:visible').length;
			$(this).css('z-index', 1000 + (10 * idx));
		});
		
		$('.modal').on('shown.bs.modal', function(event) {
			var idx = ($('.modal:visible').length) -1; // raise backdrop after animation.
			$('.modal-backdrop').not('.stacked').css('z-index', 1000 + (10 * idx));
			$('.modal-backdrop').not('.stacked').addClass('stacked');
		}); */
		
		//$(document).ready(function() {

		$('.modal').on('hidden.bs.modal', function(event) {
			$(this).removeClass( 'fv-modal-stack' );
			$('body').data( 'fv_open_modals', $('body').data( 'fv_open_modals' ) - 1 );
		});

		$('.modal').on('shown.bs.modal', function (event) {
			// keep track of the number of open modals
			if ( typeof( $('body').data( 'fv_open_modals' ) ) == 'undefined' ) {
				$('body').data( 'fv_open_modals', 0 );
			}

			// if the z-index of this modal has been set, ignore.
			if ($(this).hasClass('fv-modal-stack')) {
				return;
			}

			$(this).addClass('fv-modal-stack');
			$('body').data('fv_open_modals', $('body').data('fv_open_modals' ) + 1 );
			$(this).css('z-index', 1040 + (10 * $('body').data('fv_open_modals' )));
			$('.modal-backdrop').not('.fv-modal-stack').css('z-index', 1039 + (10 * $('body').data('fv_open_modals')));
			$('.modal-backdrop').not('fv-modal-stack').addClass('fv-modal-stack'); 

		});        
		//});
	}
	
}