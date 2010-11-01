// TODO: remove when these functions will be moved to the RichFaces.Event <!--

(function (rf) {
	rf.KEYS = {
		BACKSPACE: 8,	
		TAB: 9,
		RETURN: 13,
		ESC: 27,
		PAGEUP: 33,
		PAGEDOWN: 34,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		DEL: 46
	};
})(RichFaces);


$.extend(RichFaces.Event, {
	bindScrollEventHandlers: function(element, handler, component) {
		var elements = [];
		element = RichFaces.getDomElement(element).parentNode;
		while (element && element!=window.document.body)
		{
			if (element.offsetWidth!=element.scrollWidth || element.offsetHeight!=element.scrollHeight)
			{
				elements.push(element);
				RichFaces.Event.bind(element, "scroll"+component.getNamespace(), handler, component);
			}
			element = element.parentNode;
		}
		return elements;
	},
	unbindScrollEventHandlers: function(elements, component) {
		RichFaces.Event.unbind(elements, "scroll"+component.getNamespace());
	}
});
// -->

(function ($, rf) {
	
	rf.ui = rf.ui || {};
      
	rf.ui.InplaceBase =  function(id, options) {
    	$super.constructor.call(this, id);
    	var mergedOptions = $.extend({}, defaultOptions, options);
    	this.editEvent = mergedOptions.editEvent;
        this.noneCss = mergedOptions.noneCss; 
        this.changedCss = mergedOptions.changedCss;
        this.defaultLabel = mergedOptions.defaultLabel;
        this.state = mergedOptions.state;
        this.element = $(document.getElementById(id)); 
        this.editContainer = $(document.getElementById(id+"Edit"));
       	this.element.bind(this.editEvent, $.proxy(this.__editHandler, this));
       	this.isSaved = false;
        this.useDefaultLabel = false;
        this.editState = false;
	};
    
	rf.ui.InputBase.extend(rf.ui.InplaceBase);
	var $super = rf.ui.InplaceBase.$super;
	
	var defaultOptions = {
		editEvent: "click",
		state: "ready"
   	};
	
	$.extend(rf.ui.InplaceBase.prototype, ( function () {
		
		var STATE = {
				READY : 'ready', 
	    		CHANGED: 'changed', 
	    		DISABLE: 'disable', 
	    		EDIT: 'edit' 
		};
		
		return {
       		
       		getLabel: function() {
       		},
			
       		setLabel: function(value) {
       		}, 
       		
       		onshow: function(){
			}, 
			
			onhide: function() {
			},
			
			onsave: function() {
			}, 
			
			oncancel: function() {
			},
			
			isValueSaved: function() {
				return this.isSaved;
			},
			
			save: function() {
				var value = this.getValue()
       			if(value.length > 0) {
       				this.setLabel(value);
       			} else {
       				this.setLabel(this.defaultLabel);
       				this.useDefaultLabel = true;
       			}
				
				this.isSaved = true;

				this.__applyChangedStyles();
				this.__hide();
				this.onsave();
			}, 
			
			cancel: function(){
				var text = "";
   				if(!this.useDefaultLabel) {
   					text = this.getLabel()
   				} 
       			this.setValue(text);
       			this.isSaved = true;
           		this.__hide();
           		this.oncancel();
			},
       		
       		isEditState: function() {
       			return this.editState;
       		},
			
			__applyChangedStyles: function() {
				if(this.isValueChanged()) {
       				this.element.addClass(this.changedCss);
       			} else {
       				this.element.removeClass(this.changedCss);
       			}
			},
			
			__show: function() {
				this.scrollElements = rf.Event.bindScrollEventHandlers(this.id, this.__scrollHandler, this);
      			this.editState = true;
      			this.onshow();
			}, 
			
			__hide: function() {
				if(this.scrollElements) {
					rf.Event.unbindScrollEventHandlers(this.scrollElements, this);
					this.scrollElements = null;
				}
				this.editState = false;
      			this.editContainer.addClass(this.noneCss);
				this.onhide();
			},
			
			__editHandler: function(e) {
   				this.isSaved = false;
      			this.editContainer.removeClass(this.noneCss);
       			this.__show();
       		},       		
       		__scrollHandler: function(e) {
       			this.cancel();
       		},
       		
       		__setInputFocus: function() {
       			this.input.focus();
       		},
       		
 			destroy: function () {
       			$super.destroy.call(this);
 			}
		}
	
	})());
	
})(jQuery, window.RichFaces);
