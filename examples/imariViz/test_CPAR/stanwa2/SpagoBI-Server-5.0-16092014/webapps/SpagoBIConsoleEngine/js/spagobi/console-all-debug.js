/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
 Ext.ns("Sbi.settings");

Sbi.settings.console = {
  
		
	summaryPanel: {
		height: 300
	}		
		
	, chartWidget: {
		height: 130
	}

	, widgetPanel: {
		columnNumber:3
	}
    
	, gridPanel: {
		limit: 15		//number of rows for the page in the grid
	  , loadMask: true //enable the 'loading...' mask on the grid. Default false.
 	}
};

Sbi.settings.console.masterDetailWindow = {
	height: 350
};

Sbi.settings.console.storeManager = {
	limitSS: 15		//number of rows for the pagination server side
  , rowsLimit: 50	//number of rows totally managed by the console. It replace the original configuration <CONSOLE-TABLE-ROWS-LIMIT> presents in the engine-config 
};/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
 /* =============================================================================
 * ...
============================================================================= */
Ext.override(Ext.grid.GridView, {
	

	init : function(grid){
    	this.grid = grid;

    	this.templates = this.templates || {};
    	this.templates.hcell = new Ext.Template(
                '<td class="x-grid3-hd x-grid3-cell x-grid3-td-{id} {css}" style="{style}"><div {tooltip} {attr} class="x-grid3-hd-inner x-grid3-hd-{id} x-grid3-hd-{cls}" unselectable="on" style="{istyle}">', this.grid.enableHdMenu ? '<a class="x-grid3-hd-btn" href="#"></a>' : '',
                '{value}<img class="x-grid3-sort-icon" src="', Ext.BLANK_IMAGE_URL, '" />',
                '</div></td>'
        );
    	//enable the text selection of the grid cell (IE)
    	this.templates.cell = new Ext.Template(
    	                    '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
    	                    '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
    	                    "</td>"
    	);

    	this.initTemplates();
    	this.initData(grid.store, grid.colModel);
    	this.initUI(grid);
	}
	
	// private
   , renderHeaders : function(){
        var cm = this.cm, 
            ts = this.templates,
            ct = ts.hcell,
            cb = [], 
            p = {},
            len = cm.getColumnCount(),
            last = len - 1;
            
        for(var i = 0; i < len; i++){
            p.id = cm.getColumnId(i);
            p.cls = cm.getColumnById(p.id).cls || '';
            p.value = cm.getColumnHeader(i) || '';
            p.style = this.getColumnStyle(i, true);
            p.tooltip = this.getColumnTooltip(i);
            p.css = i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
            if(cm.config[i].align == 'right'){
                p.istyle = 'padding-right:16px';
            } else {
                delete p.istyle;
            }
            cb[cb.length] = ct.apply(p);
        }
        return ts.header.apply({cells: cb.join(''), tstyle:'width:'+this.getTotalWidth()+';'});
    }
});

/* =============================================================================
 * Force remote loading on refresh button click if the 
 * store is of tye PagingStore
============================================================================= */
Ext.override(Ext.PagingToolbar, {
	doRefresh: function(){
		if(this.store.lastParams) {
			delete this.store.lastParams;
		}
		this.doLoad(this.cursor);    
	}
});

/* =============================================================================
* Bug Fix: It is not possible to see the column hide menu when the sortable property
* is set to false
* See:
* - http://extjs.com/forum/showthread.php?p=124583
* - http://extjs.com/forum/showthread.php?t=17379
============================================================================= */
Ext.override(Ext.grid.ColumnModel, {
  isMenuDisabled : function(col) {
    return !!this.config[col].menuDisabled;
  }
}); 

Ext.override(Ext.grid.GridView, {
  // private
  handleHdOver : function(e, t) {
    var hd = this.findHeaderCell(t);
    if (hd && !this.headersDisabled) {
      this.activeHd = hd;
      this.activeHdIndex = this.getCellIndex(hd);
      var fly = this.fly(hd);
      this.activeHdRegion = fly.getRegion();
      if (!this.cm.isMenuDisabled(this.activeHdIndex)) {
        fly.addClass("x-grid3-hd-over");
        this.activeHdBtn = fly.child('.x-grid3-hd-btn');
        if (this.activeHdBtn) {
          this.activeHdBtn.dom.style.height = (hd.firstChild.offsetHeight-1)+'px';
        }
      }
    }
  }
});


/* =============================================================================
* Not so sure this override is still so useful. BTW it copies attributes passed by
* the server into node attributes property of the node if the node is a leaf. If the node is not
* a leaf attribute are handled normally (i.e. they are copied in attributes property
* of the attributes subobject of the node). This mean that in order to access to attributes
* passed in by the server you have to do like this node.attributes if the node is a leaf
* an like this node.attributes.attributes if the node is not a leaf. This is good in
* general because you do not want to access to attributes on a non leaf node. But
* if this is not the case this difference i n handling node's attributes is boaring and 
* error prone. The obvious fix of applying the same patch also to non leaf node does
* not work unfortunately because in the case of AsyncNode the attributes property of
* the node is used internally in order to handle asynchronous loading and/or asynchronous
* rendering. The best solution to apply in the near future is to move all attribute passed in by 
* the server into a nod first level property named differently (ex. props) both in the case
* of leaf and non-leaf nodes (Andrea Gioia)
============================================================================= */
Ext.override(Ext.tree.TreeLoader, {
    createNode : function(attr){
        // apply baseAttrs, nice idea Corey!
        if(this.baseAttrs){
            Ext.applyIf(attr, this.baseAttrs);
        }
        if(this.applyLoader !== false){
            attr.loader = this;
        }
        if(typeof attr.uiProvider == 'string'){
           attr.uiProvider = this.uiProviders[attr.uiProvider] || eval(attr.uiProvider);
        }
        
        var resultNode;
        if(attr.leaf) {
        	resultNode = new Ext.tree.TreeNode(attr);
        	resultNode.attributes = attr.attributes;
        } else {
        	resultNode = new Ext.tree.AsyncTreeNode(attr);
        }
        
        return resultNode;
    }
}) ; 


/* =============================================================================
* Change the behaviour of method setRoot. Thanks to this override everytime the 
* root node change the tree is properly refreshed in order to reflect the 
* modifications  in the structure.
============================================================================= */

Ext.override(Ext.tree.TreePanel, {
    initComponent : function(){
        Ext.tree.TreePanel.superclass.initComponent.call(this);

        if(!this.eventModel){
            this.eventModel = new Ext.tree.TreeEventModel(this);
        }

        // initialize the loader
        var l = this.loader;
        if(!l){
            l = new Ext.tree.TreeLoader({
                dataUrl: this.dataUrl
            });
        }else if(typeof l == 'object' && !l.load){
            l = new Ext.tree.TreeLoader(l);
        }
        this.loader = l;
        
        this.nodeHash = {};

        /**
        * The root node of this tree.
        * @type Ext.tree.TreeNode
        * @property root
        */
        // setRootNode destroys the existing root, so remove it first.
        if(this.root){
            var r = this.root;
            delete this.root;
            this.setRootNode(r);
        }

        this.addEvents(

            /**
            * @event append
            * Fires when a new child node is appended to a node in this tree.
            * @param {Tree} tree The owner tree
            * @param {Node} parent The parent node
            * @param {Node} node The newly appended node
            * @param {Number} index The index of the newly appended node
            */
           "append",
           /**
            * @event remove
            * Fires when a child node is removed from a node in this tree.
            * @param {Tree} tree The owner tree
            * @param {Node} parent The parent node
            * @param {Node} node The child node removed
            */
           "remove",
           /**
            * @event movenode
            * Fires when a node is moved to a new location in the tree
            * @param {Tree} tree The owner tree
            * @param {Node} node The node moved
            * @param {Node} oldParent The old parent of this node
            * @param {Node} newParent The new parent of this node
            * @param {Number} index The index it was moved to
            */
           "movenode",
           /**
            * @event insert
            * Fires when a new child node is inserted in a node in this tree.
            * @param {Tree} tree The owner tree
            * @param {Node} parent The parent node
            * @param {Node} node The child node inserted
            * @param {Node} refNode The child node the node was inserted before
            */
           "insert",
           /**
            * @event beforeappend
            * Fires before a new child is appended to a node in this tree, return false to cancel the append.
            * @param {Tree} tree The owner tree
            * @param {Node} parent The parent node
            * @param {Node} node The child node to be appended
            */
           "beforeappend",
           /**
            * @event beforeremove
            * Fires before a child is removed from a node in this tree, return false to cancel the remove.
            * @param {Tree} tree The owner tree
            * @param {Node} parent The parent node
            * @param {Node} node The child node to be removed
            */
           "beforeremove",
           /**
            * @event beforemovenode
            * Fires before a node is moved to a new location in the tree. Return false to cancel the move.
            * @param {Tree} tree The owner tree
            * @param {Node} node The node being moved
            * @param {Node} oldParent The parent of the node
            * @param {Node} newParent The new parent the node is moving to
            * @param {Number} index The index it is being moved to
            */
           "beforemovenode",
           /**
            * @event beforeinsert
            * Fires before a new child is inserted in a node in this tree, return false to cancel the insert.
            * @param {Tree} tree The owner tree
            * @param {Node} parent The parent node
            * @param {Node} node The child node to be inserted
            * @param {Node} refNode The child node the node is being inserted before
            */
            "beforeinsert",

            /**
            * @event beforeload
            * Fires before a node is loaded, return false to cancel
            * @param {Node} node The node being loaded
            */
            "beforeload",
            /**
            * @event load
            * Fires when a node is loaded
            * @param {Node} node The node that was loaded
            */
            "load",
            /**
            * @event textchange
            * Fires when the text for a node is changed
            * @param {Node} node The node
            * @param {String} text The new text
            * @param {String} oldText The old text
            */
            "textchange",
            /**
            * @event beforeexpandnode
            * Fires before a node is expanded, return false to cancel.
            * @param {Node} node The node
            * @param {Boolean} deep
            * @param {Boolean} anim
            */
            "beforeexpandnode",
            /**
            * @event beforecollapsenode
            * Fires before a node is collapsed, return false to cancel.
            * @param {Node} node The node
            * @param {Boolean} deep
            * @param {Boolean} anim
            */
            "beforecollapsenode",
            /**
            * @event expandnode
            * Fires when a node is expanded
            * @param {Node} node The node
            */
            "expandnode",
            /**
            * @event disabledchange
            * Fires when the disabled status of a node changes
            * @param {Node} node The node
            * @param {Boolean} disabled
            */
            "disabledchange",
            /**
            * @event collapsenode
            * Fires when a node is collapsed
            * @param {Node} node The node
            */
            "collapsenode",
            /**
            * @event beforeclick
            * Fires before click processing on a node. Return false to cancel the default action.
            * @param {Node} node The node
            * @param {Ext.EventObject} e The event object
            */
            "beforeclick",
            /**
            * @event click
            * Fires when a node is clicked
            * @param {Node} node The node
            * @param {Ext.EventObject} e The event object
            */
            "click",
            /**
            * @event checkchange
            * Fires when a node with a checkbox's checked property changes
            * @param {Node} this This node
            * @param {Boolean} checked
            */
            "checkchange",
            /**
            * @event dblclick
            * Fires when a node is double clicked
            * @param {Node} node The node
            * @param {Ext.EventObject} e The event object
            */
            "dblclick",
            /**
            * @event contextmenu
            * Fires when a node is right clicked. To display a context menu in response to this
            * event, first create a Menu object (see {@link Ext.menu.Menu} for details), then add
            * a handler for this event:<code><pre>
new Ext.tree.TreePanel({
    title: 'My TreePanel',
    root: new Ext.tree.AsyncTreeNode({
        text: 'The Root',
        children: [
            { text: 'Child node 1', leaf: true },
            { text: 'Child node 2', leaf: true }
        ]
    }),
    contextMenu: new Ext.menu.Menu({
        items: [{
            id: 'delete-node',
            text: 'Delete Node'
        }],
        listeners: {
            itemclick: function(item) {
                switch (item.id) {
                    case 'delete-node':
                        var n = item.parentMenu.contextNode;
                        if (n.parentNode) {
                            n.remove();
                        }
                        break;
                }
            }
        }
    }),
    listeners: {
        contextmenu: function(node, e) {
//          Register the context node with the menu so that a Menu Item's handler function can access
//          it via its {@link Ext.menu.BaseItem#parentMenu parentMenu} property.
            node.select();
            var c = node.getOwnerTree().contextMenu;
            c.contextNode = node;
            c.showAt(e.getXY());
        }
    }
});
</pre></code>
            * @param {Node} node The node
            * @param {Ext.EventObject} e The event object
            */
            "contextmenu",
            /**
            * @event beforechildrenrendered
            * Fires right before the child nodes for a node are rendered
            * @param {Node} node The node
            */
            "beforechildrenrendered",
           /**
             * @event startdrag
             * Fires when a node starts being dragged
             * @param {Ext.tree.TreePanel} this
             * @param {Ext.tree.TreeNode} node
             * @param {event} e The raw browser event
             */
            "startdrag",
            /**
             * @event enddrag
             * Fires when a drag operation is complete
             * @param {Ext.tree.TreePanel} this
             * @param {Ext.tree.TreeNode} node
             * @param {event} e The raw browser event
             */
            "enddrag",
            /**
             * @event dragdrop
             * Fires when a dragged node is dropped on a valid DD target
             * @param {Ext.tree.TreePanel} this
             * @param {Ext.tree.TreeNode} node
             * @param {DD} dd The dd it was dropped on
             * @param {event} e The raw browser event
             */
            "dragdrop",
            /**
             * @event beforenodedrop
             * Fires when a DD object is dropped on a node in this tree for preprocessing. Return false to cancel the drop. The dropEvent
             * passed to handlers has the following properties:<br />
             * <ul style="padding:5px;padding-left:16px;">
             * <li>tree - The TreePanel</li>
             * <li>target - The node being targeted for the drop</li>
             * <li>data - The drag data from the drag source</li>
             * <li>point - The point of the drop - append, above or below</li>
             * <li>source - The drag source</li>
             * <li>rawEvent - Raw mouse event</li>
             * <li>dropNode - Drop node(s) provided by the source <b>OR</b> you can supply node(s)
             * to be inserted by setting them on this object.</li>
             * <li>cancel - Set this to true to cancel the drop.</li>
             * <li>dropStatus - If the default drop action is cancelled but the drop is valid, setting this to true
             * will prevent the animated "repair" from appearing.</li>
             * </ul>
             * @param {Object} dropEvent
             */
            "beforenodedrop",
            /**
             * @event nodedrop
             * Fires after a DD object is dropped on a node in this tree. The dropEvent
             * passed to handlers has the following properties:<br />
             * <ul style="padding:5px;padding-left:16px;">
             * <li>tree - The TreePanel</li>
             * <li>target - The node being targeted for the drop</li>
             * <li>data - The drag data from the drag source</li>
             * <li>point - The point of the drop - append, above or below</li>
             * <li>source - The drag source</li>
             * <li>rawEvent - Raw mouse event</li>
             * <li>dropNode - Dropped node(s).</li>
             * </ul>
             * @param {Object} dropEvent
             */
            "nodedrop",
             /**
             * @event nodedragover
             * Fires when a tree node is being targeted for a drag drop, return false to signal drop not allowed. The dragOverEvent
             * passed to handlers has the following properties:<br />
             * <ul style="padding:5px;padding-left:16px;">
             * <li>tree - The TreePanel</li>
             * <li>target - The node being targeted for the drop</li>
             * <li>data - The drag data from the drag source</li>
             * <li>point - The point of the drop - append, above or below</li>
             * <li>source - The drag source</li>
             * <li>rawEvent - Raw mouse event</li>
             * <li>dropNode - Drop node(s) provided by the source.</li>
             * <li>cancel - Set this to true to signal drop not allowed.</li>
             * </ul>
             * @param {Object} dragOverEvent
             */
            "nodedragover"
        );
        if(this.singleExpand){
            this.on("beforeexpandnode", this.restrictExpand, this);
        }
    },

    setRootNode: function(node, load) {
    	//      Already had one; destroy it.    	
    	if (this.root) {
            this.root.destroy();
        }
    	
        if(!node.render){ // attributes passed
            node = this.loader.createNode(node);
        }
        this.root = node;
        node.ownerTree = this;
        node.isRoot = true;
        this.registerNode(node);
        if(!this.rootVisible){
            var uiP = node.attributes.uiProvider;
            node.ui = uiP ? new uiP(node) : new Ext.tree.RootTreeNodeUI(node); 
        }

//      If we had previously rendered a tree, rerender it.
        if (this.innerCt) {
            this.innerCt.update('');
            this.afterRender();
        }
        return node;
    }
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * Singleton object that handle all errors generated on the client side
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */


Ext.ns("Sbi.exception.ExceptionHandler");

Sbi.exception.ExceptionHandler = function(){
	// do NOT access DOM from here; elements don't exist yet
 
    // private variables
 
    // public space
	return {
	
		init : function() {
			//alert("init");
		}
		
		
		, onServiceRequestFailure : function(response, options) {
        	var errMessage;
        	
        	
        	
        	if(response !== undefined) {        		
        		if(response.responseText !== undefined) {
        			var content = Ext.util.JSON.decode( response.responseText );
        			if(content.errors !== undefined && content.errors.length > 0) {
        				for(var i = 0; i < content.errors.length; i++) {
        					if(!content.errors[i].message) continue;
        					if(!errMessage) errMessage = '';
        					errMessage += content.errors[i].message + '<br>';
        				}
        			}
        			
        			if(content.message) {
        				errMessage = errMessage || content.message;
        			}
        			
        		} 
        		if(!errMessage)	errMessage = 'An unspecified error occurred on the server side';
        	} else {
        		errMessage = 'Request has been aborted due to a timeout trigger';
        	}
        		
        	errMessage = errMessage || 'An error occurred while processing the server error response';
        	
        	if (errMessage.indexOf('Warning') >= 0) {
        		Sbi.Msg.showWarning(errMessage, 'Service Warning');
        	}
        	else{
        		Sbi.Msg.showError(errMessage, 'Service Error');
        	}
       	
        }
		
        , onStoreLoadException : function(proxy, type, action, options, response, arg) {
			
			var errMessage = 'Generic error';
        
			if(type === 'response') {
				errMessage = 'An error occurred while parsing server response: ' + arg;
			} else if(type === 'remote') {
				errMessage = 'An error occurred at the server side';
			}
			Sbi.Msg.showError(errMessage, 'Store loading error');
			
			// to do ...
			// dump some more contextual infos (dataset name, options)
			// test timeout exception
			// when type = remote show more info on the error
        }
        


	};
}();/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * ServiceRegistry - short description
  * 
  * Object documentation ...
  * 
  * by Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.service");

Sbi.service.ServiceRegistry = function(config) {
	
	config = config || {};
	
	this.baseUrl = Ext.apply({}, config.baseUrl || {}, {
		protocol: 'http'     
		, host: 'localhost'
	    , port: '8080'
	    , contextPath: 'SpagoBI'
	    , controllerPath: 'servlet/AdapterHTTP'    
	});
	
	this.baseParams = Ext.apply({}, config.baseParams || {}, {
		SBI_EXECUTION_ID: -1
	});
	
	this.defaultAbsolute = config.defaultAbsolute !== undefined?  config.defaultAbsolute: false; 
	this.defaultServiceType = config.defaultServiceType !== undefined?  config.defaultServiceType: 'action'; 
		
	//this.addEvents();	
	
	// constructor
    Sbi.service.ServiceRegistry.superclass.constructor.call(this);
};

Ext.extend(Sbi.service.ServiceRegistry, Ext.util.Observable, {
    
    // static contens and methods definitions
	baseUrl: null
	, baseParams: null
	, defaultAbsolute: null
	, defaultServiceType: null 
	
   
    // public methods
    
    , setBaseUrl : function(url) {
       Ext.apply(this.baseUrl, url); 
    }
        
    , getServiceUrl : function(s){
    	var serviceUrl;
    	
    	var baseUrlStr;
    	var serviceType;
    	var params;
               
        if(typeof s == 'string') {
        	s = {serviceName: s};
        }
        
        serviceType = s.serviceType || this.defaultServiceType;
        params = Ext.apply({}, s.baseParams || {}, this.baseParams);
                
        serviceUrl = this.getBaseUrlStr(s);
        serviceUrl += '?';
        serviceUrl += (serviceType === 'action')? 'ACTION_NAME': 'PAGE';
        serviceUrl += '=';
        serviceUrl += s.serviceName;
      
        for(var p in params){
        	if(params[p] !== null) {
        		serviceUrl += '&' + p + '=' + params[p];
        	}
        }
        
        return serviceUrl;
    }     
    
    , getBaseUrlStr: function(s) {
    	var baseUrlStr;

    	if (this.baseUrl.completeUrl !== undefined) {
    		baseUrlStr = this.baseUrl.completeUrl;
    	} else {
        	var isAbsolute = s.isAbsolute || this.defaultAbsolute;
        	var url = Ext.apply({}, s.baseUrl || {}, this.baseUrl);
        	
        	if(isAbsolute) {
        		baseUrlStr = url.protocol + '://' + url.host + ":" + url.port + '/' + url.contextPath + '/' + url.controllerPath;
        	} else {
        		baseUrlStr = '/' + url.contextPath+ '/' + url.controllerPath;
        	}
    	}
    	return  baseUrlStr;
    }
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi");

Sbi.Sync = function(){
    
	// private variables
	var FORM_ID = 'download-form';
	var METHOD = 'post';
	var createHtmlFn;
	
    // public space
	return {
		
		form: null
		
		, request: function(o) {
			var f = this.getForm();
			if(o.method) f.method = o.method;
			
			f.action = o.url;
			
			if(f.method === 'post') {
				this.resetForm();
				if(o.params) {
					this.replaceDomHelper();
					for(p in o.params) {
						this.addHiddenInput(p, o.params[p]);
					}
					this.restoreDomHelper();
				}
			}else {
				if(o.params) {
					f.action = Ext.urlAppend(f.action, Ext.urlEncode(o.params) );
				}
			}
			
			f.submit();
			
		}
	
		, resetForm: function() {
			var f = Ext.get(FORM_ID);
			var childs = f.query('input');
			
			for(var i = 0, l = childs.length; i < l; i++) {
				 var child = Ext.get(childs[i]);			
				 child.remove();
				
			}
		}
		
		, replaceDomHelper: function() {
			createHtmlFn = Ext.DomHelper.createHtml;
			Ext.DomHelper.createHtml = function(o){
		        var b = '',
	            attr,
	            val,
	            key,
	            keyVal,
	            cn;

		        if(Ext.isString(o)){
		            b = o;
		        } else if (Ext.isArray(o)) {
		            for (var i=0; i < o.length; i++) {
		                if(o[i]) {
		                    b += createHtml(o[i]);
		                }
		            };
		        } else {
		            b += '<' + (o.tag = o.tag || 'div');
		            Ext.iterate(o, function(attr, val){
		                if(!/tag|children|cn|html$/i.test(attr)){
		                    if (Ext.isObject(val)) {
		                        b += ' ' + attr + '=\'';
		                        Ext.iterate(val, function(key, keyVal){
		                            b += key + ':' + keyVal + ';';
		                        });
		                        b += '\'';
		                    }else{
		                        b += ' ' + ({cls : 'class', htmlFor : 'for'}[attr] || attr) + '=\'' + val + '\'';
		                    }
		                }
		            });
		            // Now either just close the tag or try to add children and close the tag.
		            var emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i;
		            if (emptyTags.test(o.tag)) {
		                b += '/>';
		            } else {
		                b += '>';
		                if ((cn = o.children || o.cn)) {
		                    b += createHtml(cn);
		                } else if(o.html){
		                    b += o.html;
		                }
		                b += '</' + o.tag + '>';
		            }
		        }
		        return b;
			}
		}
		
		, restoreDomHelper: function() {
			if(!createHtmlFn) {
				alert("Impossible to restore createHtml in DomHelper object");
				return;
			}
			Ext.DomHelper.createHtml = createHtmlFn;
		}
		
		
		, addHiddenInput: function(name, value) {			
			var f = Ext.get(FORM_ID);
			var dh = Ext.DomHelper;
			dh.append(f, {
			    tag: 'input'
			    , type: 'hidden'
			    , name: name
			    , value: value
			});
		}
	
		, getForm: function() {
			//by unique request
			if(this.form === null) {
				this.form = document.getElementById(FORM_ID);
				if(!this.form) {
					var dh = Ext.DomHelper;
					this.form = dh.append(Ext.getBody(), {
					    id: FORM_ID
					    , tag: 'form'
					    , method: METHOD
					    , cls: 'download-form'
					});
				}
			}
			return this.form;
		}
	
	}
}();	/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Functions
  * 
  *  [list]
  * 
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.console.commons");

Sbi.console.commons.Format = function(){
 
	return {
		/**
         * Cut and paste from Ext.util.Format
         */
        date : function(v, format){

			format = format || "m/d/Y";
			
			if(typeof format === 'string') {
				format = {
					dateFormat: format,
			    	nullValue: ''
				};
			}
			
			
            if(!v){
                return format.nullValue;
            }
            
            if(!(v instanceof Date)){
                v = new Date(Date.parse(v));
            }
          
            
            v = v.dateFormat(format.dateFormat);
         
            return v;
        }

        /**
         * Cut and paste from Ext.util.Format
         */
        , dateRenderer : function(format){
            return function(v){
                return Sbi.console.commons.Format.date(v, format);
            };
         
        }
        
        ,timestamp : function(v, format){

			format = format || "m/d/Y H:i:s";
			
			if(typeof format === 'string') {
				format = {
					timestampFormat: format,
			    	nullValue: ''
				};
			}
			
			
            if(!v){
                return format.nullValue;
            }
            
            if(!(v instanceof Date)){
                v = new Date(Date.parse(v));
            }
          
            
            v = v.dateFormat(format.dateFormat);
         
            return v;
        }

        /**
         * Cut and paste from Ext.util.Format
         */
        , timestampRenderer : function(format){
            return function(v){
                return Sbi.console.commons.Format.timestamp(v, format);
            };
         
        }
        
        
        /**
         * thanks to Condor: http://www.extjs.com/forum/showthread.php?t=48600
         */
        , number : function(v, format)  {
    		
        	format = Ext.apply({}, format || {}, {
	    		decimalSeparator: '.',
	    		decimalPrecision: 2,
	    		groupingSeparator: ',',
	    		groupingSize: 3,
	    		currencySymbol: '',
	    		nullValue: ''
	    		
    		});

        	if(v === undefined || v === null) {
        		return format.nullValue;
        	}
        	
        	if (typeof v !== 'number') {
    			v = String(v);
    			if (format.currencySymbol) {
    				v = v.replace(format.currencySymbol, '');
    			}
    			if (format.groupingSeparator) {
    				v = v.replace(new RegExp(format.groupingSeparator, 'g'), '');
    			}
    			if (format.decimalSeparator !== '.') {
    				v = v.replace(format.decimalSeparator, '.');
    			}
    			v = parseFloat(v);
    		}
    		var neg = v < 0;
    		v = Math.abs(v).toFixed(format.decimalPrecision);
    		var i = v.indexOf('.');
    		if (i >= 0) {
    			if (format.decimalSeparator !== '.') {
    				v = v.slice(0, i) + format.decimalSeparator + v.slice(i + 1);
    			}
    		} else {
    			i = v.length;
    		}
    		if (format.groupingSeparator) {
    			while (i > format.groupingSize) {
    				i -= format.groupingSize;
    				v = v.slice(0, i) + format.groupingSeparator + v.slice(i);
    			}
    		}
    		if (format.currencySymbol) {
    			v = format.currencySymbol + v;
    		}
    		if (neg) {
    			v = '-' + v;
    		}
    		return v;
        }   
        
        , numberRenderer : function(format){
            return function(v){
                return Sbi.console.commons.Format.number(v, format);
            };
        }
        
        , string : function(v, format) {
        	format = Ext.apply({}, format || {}, {
	    		trim: true,
	    		maxLength: null,
	    		ellipsis: true,
	    		changeCase: null, // null | 'capitalize' | 'uppercase' | 'lowercase'
	    		prefix: '',
	    		suffix: '',
	    		nullValue: ''
    		});
        	
        	if(!v){
                return format.nullValue;
            }
        	
        	if(format.trim) v = Ext.util.Format.trim(v);
        	if(format.maxLength) {
        		if(format.ellipsis === true) {
        			v = Ext.util.Format.ellipsis(v, format.maxLength);
        		} else {
        			v = Ext.util.Format.substr(v, 0, format.maxLength);
        		}
        	}
        	if(format.changeCase){
        		if(format.changeCase === 'capitalize') {
        			v = Ext.util.Format.capitalize(v);
        		} else if(format.changeCase === 'uppercase') {
        			v = Ext.util.Format.uppercase(v);
        		} else if(format.changeCase === 'lowercase') {
        			v = Ext.util.Format.lowercase(v);
        		}        		
        	}
        	if(format.prefix) v = format.prefix+ v;
        	if(format.suffix) v =  v + format.suffix;
        	
        	return v;
        }
        
        , stringRenderer : function(format){
            return function(v){
                return Sbi.console.commons.Format.string(v, format);
            };
        }
       
        , 'boolean' : function(v, format) {
        	format = Ext.apply({}, format || {}, {
	    		trueSymbol: 'true',
	    		falseSymbol: 'false',
	    		nullValue: ''
    		});
        	
        	if(v === true){
        		 v = format.trueSymbol;
            } else if(v === true){
            	 v = format.falseSymbol;
            } else {
            	 v = format.nullValue;
            }
        	
        	return v;
        }
        
        , booleanRenderer : function(format){
            return function(v){
                return Sbi.console.commons.Format['boolean'](v, format);
            };
        }
       
        
        , html : function(v, format) {
        	// format is not used yet but it is reserve for future use
        	// ex. format.cls, format.style
        	v = Ext.util.Format.htmlDecode(v);
        	return v;
        }
       
        , htmlRenderer : function(format){
            return function(v){
                return Sbi.console.commons.Format.html(v, format);
            };
        }
      
        , inlineBarRenderer : function(format){
            return function(v){
                v = (v / format.totValue) * 100; 
                v = Sbi.console.commons.Format.number(v, {decimalPrecision: 2});
                var tip = (format.tooltip !== undefined)? format.tooltip : v;
                return '<div title="'+ tip + '" style="width:' +  v  + '%;height:10px;border:1px solid #000;background:' + format.color + ';"/>'
            };
        }

        , inlinePointRenderer : function(format){  
        	/* v: value
        	 * p: position (?)
        	 * rec: actual record data
        	 * */
            return function(v, p, rec){               	
               var localThreshold = format.threshold;
               var width = (format.width === undefined) ? "100%" : format.width+"px";
               var originalTooltip;
               var localTooltip;
               var srcIcon;              
               var nameTooltipFields;
               var updateFieldsInTooltip = false;
               
               if (format.thresholdType == 'dataset' && format.nameFieldThr !== undefined){            	 
            	   localThreshold = rec.get(format.nameFieldThr);           	      
	        	   updateFieldsInTooltip = true;
               }
               
               if (v > localThreshold) { 
            	   originalTooltip = format.tooltip;
            	   srcIcon = "../img/ico_point_"+ format.color +".gif";
            	   nameTooltipFields = format.nameTooltipField;
               }else {  
            	   return '';
               }
               
               localTooltip = originalTooltip;
               
               //gets threshold from each rows of the dataset and gets relative tooltip
               if (updateFieldsInTooltip){            	 
            	 //substitute tooltips fields
            	 if (nameTooltipFields && nameTooltipFields !== undefined ){	
            		 for (var e in nameTooltipFields){
        		    	var elem = nameTooltipFields[e];
						var tmpTooltipValue = rec.get(elem.value);
						if (tmpTooltipValue){
							var newTooltip = originalTooltip.replace("$F{" + elem.name + "}", tmpTooltipValue);
							originalTooltip =  newTooltip;
						}
        		    }
            		 localTooltip = originalTooltip;
            	 }            	
               }
                
               return '<div align=center title="'+ localTooltip + '" style="width:'+ width +'"><img src="'+ srcIcon + '"></img></div>';
            };
        }
        
        , inlineSemaphoreRenderer : function(format){  
        	/* v: value
        	 * p: position (?)
        	 * rec: actual record data
        	 * */
            return function(v, p, rec){              
               var localThrFirstInt = format.thresholdFirstInt;
               var localThrSecondInt = format.thresholdSecondInt;   
               var width = (format.width === undefined) ? "100%" : format.width+"px";
               var originalTooltip;
               var localTooltip;
               var srcIcon;              
               var nameTooltipFields;
               var updateFieldsInTooltip = false;
               
               if (format.thresholdType == 'dataset' && format.thresholdFirstInt !== undefined
            		   && format.thresholdSecondInt !== undefined){            	 
	        	   localThrFirstInt = rec.get(format.nameFieldThrFirstInt);            	      
	        	   localThrSecondInt = rec.get(format.nameFieldThrSecondInt);
	        	   updateFieldsInTooltip = true;
               }
               
               if (v > localThrSecondInt) { 
            	   originalTooltip = format.tooltipRed || format.tooltip;
            	   srcIcon = "../img/ico_point_red.gif";
            	   nameTooltipFields = format.nameTooltipFieldRed;
               } else if (v <= localThrSecondInt && v >= localThrFirstInt) { 
            	   originalTooltip = format.tooltipYellow || format.tooltip;
            	   srcIcon = "../img/ico_point_yellow.gif";
            	   nameTooltipFields = format.nameTooltipFieldYellow;
               } else {  
            	   originalTooltip = format.tooltipGreen || format.tooltip;
            	   srcIcon = "../img/ico_point_green.gif";
            	   nameTooltipFields = format.nameTooltipFieldGreen;
               }
               
               localTooltip = originalTooltip;
               
               //gets threshold from each rows of the dataset and gets relative tooltip
               if (updateFieldsInTooltip){            	 
            	 //substitute tooltips fields
            	 if (nameTooltipFields && nameTooltipFields !== undefined ){	
            		 for (var e in nameTooltipFields){
        		    	var elem = nameTooltipFields[e];
						var tmpTooltipValue = rec.get(elem.value);
						if (tmpTooltipValue){
							var newTooltip = originalTooltip.replace("$F{" + elem.name + "}", tmpTooltipValue);
							originalTooltip =  newTooltip;
						}
        		    }
            		 localTooltip = originalTooltip;
            	 }            	
               }
                
               return '<div align=center title="'+ localTooltip + '" style="width:'+ width +'"><img src="'+ srcIcon + '"></img></div>';
            };
        }
        
	};
	
}();
/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Functions
  * 
  *  [list]
  * 
  * 
  * Authors
  * 
  * - Andrea Gioia (adrea.gioia@eng.it)
  */

Ext.ns("Sbi");

Sbi.Msg = function(){
    
	// private variables
	// ...
	
    // public space
	return {

		showError : function(errMessage, title) {
    		var m = errMessage || 'Generic error';
    		var t = title || 'Error';
    	
    		Ext.MessageBox.show({
	       		title: t
	       		, msg: m
	       		, buttons: Ext.MessageBox.OK     
	       		, icon: Ext.MessageBox.ERROR
	       		, modal: false
	   		});
	    },
    
	    showWarning : function(errMessage, title) {
	    	var m = errMessage || 'Generic warning';
	    	var t = title || 'Warning';
	    	
	    	Ext.MessageBox.show({
	       		title: t
	       		, msg: m
	       		, buttons: Ext.MessageBox.OK     
	       		, icon: Ext.MessageBox.WARNING
	       		, modal: false
	   		});
	    }, 
	    
	    showInfo : function(errMessage, title) {
	    	var m = errMessage || 'Generic info';
	    	var t = title || 'Info';
	    	
	    	Ext.MessageBox.show({
	       		title: t
	       		, msg: m
	       		, buttons: Ext.MessageBox.OK     
	       		, icon: Ext.MessageBox.INFO
	       		, modal: false
	   		});
	    },
	    
	    unimplementedFunction: function(fnName) {
			var msg = fnName? 
					'Sorry, the functionality [' + fnName + '] has not been implemented yet':
					'Sorry, this functionality has not been implemented yet';
			
			Sbi.Msg.showInfo(msg, 'Unimplemented functionality');
	    },
	    
	    deprectadeFunction: function(fnClass, fnName) {
	    	var msg = fnName + ' in class ' + fnClass + 'is deprecated';
			
	    	Sbi.Msg.showWarning(msg, 'Deprecated functionality');
	    }
	}
}();	

Sbi.Assert = function(){
 
    // private variables
	
    // public space
	return {
		assertTrue: function(condition, msg) {
			if(!condition) Sbi.Msg.showError(msg);
		}
	
		, assertDefined: function(o, msg) {
			Sbi.Assert.assertTrue( (o !== undefined && o !== null),  msg);
		}
        
	};
}();	


/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  

Ext.ns("Sbi.commons");

Sbi.commons.JSON = new (function(){
    var useHasOwn = {}.hasOwnProperty ? true : false;
    
    // crashes Safari in some instances
    //var validRE = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;
    
    var pad = function(n) {
        return n < 10 ? "0" + n : n;
    };
    
    var m = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"' : '\\"',
        "\\": '\\\\'
    };

    var encodeString = function(s){
        if (/["\\\x00-\x1f]/.test(s)) {
            return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                var c = m[b];
                if(c){
                    return c;
                }
                c = b.charCodeAt();
                return "\\u00" +
                    Math.floor(c / 16).toString(16) +
                    (c % 16).toString(16);
            }) + '"';
        }
        return '"' + s + '"';
    };
    
    var encodeArray = function(o){
        var a = ["["], b, i, l = o.length, v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }
                        a.push(v === null ? "null" : Sbi.commons.JSON.encode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
    };
    
    /*
    var encodeDate = function(o){
        return '"' + o.getFullYear() + "-" +
                pad(o.getMonth() + 1) + "-" +
                pad(o.getDate()) + "T" +
                pad(o.getHours()) + ":" +
                pad(o.getMinutes()) + ":" +
                pad(o.getSeconds()) + '"';
    };
    */
    
    var encodeDate = function(o){
    	o = encodeString(Ext.util.Format.date(o, 'd/m/Y'))
        return o;
    };
    
  
    /**
     * Encodes an Object, Array or other value
     * @param {Mixed} o The variable to encode
     * @return {String} The JSON string
     */
    this.encode = function(o){
        if(typeof o == "undefined" || o === null){
            return "null";
        }else if(o instanceof Array){
            return encodeArray(o);
        }else if(o instanceof Date){
            return encodeDate(o);
        }else if(typeof o == "string"){
            return encodeString(o);
        }else if(typeof o == "number"){
            return isFinite(o) ? String(o) : "null";
        }else if(typeof o == "boolean"){
            return String(o);
        }else {
            var a = ["{"], b, i, v;
            for (i in o) {
                if(!useHasOwn || o.hasOwnProperty(i)) {
                    v = o[i];
                    switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if(b){
                            a.push(',');
                        }
                        a.push(this.encode(i), ":",
                                v === null ? "null" : this.encode(v));
                        b = true;
                    }
                }
            }
            a.push("}");
            return a.join("");
        }
    };
    
    /**
     * Decodes (parses) a JSON string to an object. If the JSON is invalid, this function throws a SyntaxError.
     * @param {String} json The JSON string
     * @return {Object} The resulting object
     */
    this.decode = function(json){
        return eval("(" + json + ')');
    };
})();

/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
 Ext.ns("Sbi.locale");

Sbi.locale.dummyFormatter = function(v){return v;};

Sbi.locale.formatters = {
	'int': Sbi.locale.dummyFormatter,
	'float': Sbi.locale.dummyFormatter,
	'string': Sbi.locale.dummyFormatter,		
	'date': Sbi.locale.dummyFormatter,		
	'timestamp': Sbi.locale.dummyFormatter,
	'boolean': Sbi.locale.dummyFormatter,
	'html': Sbi.locale.dummyFormatter,
	inlineBar: Sbi.locale.dummyFormatter,
	inlinePoint: Sbi.locale.dummyFormatter
};


if(Sbi.console.commons.Format){
	if(Sbi.locale.formats) {
		Sbi.locale.formatters['int']  = Sbi.console.commons.Format.numberRenderer(Sbi.locale.formats['int']);		
		Sbi.locale.formatters['float']  = Sbi.console.commons.Format.numberRenderer(Sbi.locale.formats['float']);		
		Sbi.locale.formatters['string']  = Sbi.console.commons.Format.stringRenderer(Sbi.locale.formats['string']);		
		Sbi.locale.formatters['date']   = Sbi.console.commons.Format.dateRenderer(Sbi.locale.formats['date']);		
		Sbi.locale.formatters['timestamp']   = Sbi.console.commons.Format.dateRenderer(Sbi.locale.formats['timestamp']);
		Sbi.locale.formatters['boolean'] = Sbi.console.commons.Format.booleanRenderer(Sbi.locale.formats['boolean']);
		Sbi.locale.formatters['html']    = Sbi.console.commons.Format.htmlRenderer();
		Sbi.locale.formatters.inlineBar    = Sbi.console.commons.Format.inlineBarRenderer();
		Sbi.locale.formatters.inlinePoint = Sbi.console.commons.Format.inlinePointRenderer();
	} else {
		Sbi.locale.formatters['int'] = Sbi.console.commons.Format.numberRenderer( );	
		Sbi.locale.formatters['float'] = Sbi.console.commons.Format.numberRenderer( );	
		Sbi.locale.formatters['string']  = Sbi.console.commons.Format.stringRenderer( );		
		Sbi.locale.formatters['date']   = Sbi.console.commons.Format.dateRenderer( );		
		Sbi.locale.formatters['timestamp'] = Sbi.console.commons.Format.timestampRenderer( );
		Sbi.locale.formatters['boolean'] = Sbi.console.commons.Format.booleanRenderer( );
		Sbi.locale.formatters['html']     = Sbi.console.commons.Format.htmlRenderer();
		Sbi.locale.formatters.inlineBar   = Sbi.console.commons.Format.inlineBarRenderer();
		Sbi.locale.formatters.inlinePoint = Sbi.console.commons.Format.inlinePointRenderer();
	}
}


Sbi.locale.localize = function(key) {
	if(!Sbi.locale.ln) {return key;}
	return Sbi.locale.ln[key] || key;
};

Sbi.locale.getLNValue = function(obj){
    var value = obj; 
	if (obj !== undefined && obj.indexOf('LN(')>=0){					
			var lenIdx = (obj.indexOf(')')) - (obj.indexOf('LN(')+3);
			var idx  = obj.substr(obj.indexOf('LN(')+3,lenIdx);
			value = LN(idx);    			
	}
	return value;
};

// alias
LN = Sbi.locale.localize;
FORMATTERS = Sbi.locale.formatters;




/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - name (mail)
  */

Ext.ns("Sbi.console");

Sbi.console.StorePlugin = function(config) {
	
		var defaultSettings = {
			filters: {}
		};
		
		if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.storePlugin) {
			defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.storePlugin);
		}
		
		var c = Ext.apply(defaultSettings, config || {});
		
		Ext.apply(this, c);
		
	
		// constructor
		Sbi.console.StorePlugin.superclass.constructor.call(this, c);
    
		this.store.filterPlugin = this;
		this.store.addEvents('filterschange');
		
};

Ext.extend(Sbi.console.StorePlugin, Ext.util.Observable, {
    
    store: null
    , filters: null
   
    // public methods
	, removeFilter: function(fieldName) {
		delete this.filters[fieldName];
	}

    , addFilter: function(fieldName, filter) {	
		this.filters[fieldName] = filter;
	}

	, getFilter: function(fieldName) {
		return this.filters[fieldName];
	}

	, resetFilters: function() {
		filters = {};
	}
	
   //filters functions
   , applyFilters: function() {
	   //apply the ordering if it's presents
       if (this.store.getSortState() !== undefined){
      		this.store.sort(this.store.getSortState().field, this.store.getSortState().direction);
       }

       /*
        * Apply the filters.
        * The filters object is a multidimensional array (ie: filters=[<col1>:[<val1>, <val2>],
        *							   					              [<col2>:[<val3>, <val4>]])
        * In the application of filters each filter column works in AND condition with filters of others columns, 
        * while works in OR condition with all its values. 
        * (In the example the filter of col1 is in AND with the filter on col2; BUT to satisfy the col1 is necessary 
        *  at least one between val1 and val2.)
        * So, this method uses three flags to manage this situation:
        *  - isVisible: defines if the record matches the current condition
        *  - isVisibilePrec: defines the visibility of the previous condition
        *  - isVisibileRet: defines the real value returned
        */
      
	   this.store.filterBy(function(record,id){		
		   var isVisible = false; //flag for single condition (multivalue)
		   var isVisiblePrec = true;
		   var isVisibleRet = true;
		   for(var f in this.filters){ 	// cycles on all filters
			   var tmpValues = this.filters[f];
			   for(var val in tmpValues){  		//cycles on the single value for each condition (logical OR case)
				   if (tmpValues[val] !== undefined){
					   if(record.data[f] === tmpValues[val]) {						
						   //return true;  						   
						   isVisible = true;
					   }	
				   }
			   }
			   
			   isVisibleRet = (isVisible && isVisiblePrec);
			   isVisiblePrec =  isVisible;
			   isVisible = false; //reset value
		   }
		   //return false;				   
		   return isVisibleRet;
	   }, this);
	   
	   this.fireEvent('filterschange', this.store, this.filters);
	       	    
   }
   
	// just for test: remove asap
	, getFilters: function(fieldName) {
		return this.filters;
	}
    
    // private methods
    
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
 /*
 * PagingStore for Ext 3 - v0.4.1
 */
Ext.ns('Ext.ux.data');
Ext.ux.data.PagingStore = Ext.extend(Ext.data.Store, {
    destroy: function() {
        if (this.storeId) {
            Ext.StoreMgr.unregister(this);
        }
        this.data = this.allData = this.snapshot = null;
        Ext.destroy(this.proxy);
        this.reader = this.writer = null;
        this.purgeListeners();
    },
    add: function(records) {
        records = [].concat(records);
        if (records.length < 1) {
            return;
        }
        for (var i = 0, len = records.length; i < len; i++) {
            records[i].join(this);
        }
        var index = this.data.length;
        this.data.addAll(records);
        if (this.allData) {
            this.allData.addAll(records);
        }
        if (this.snapshot) {
            this.snapshot.addAll(records);
        }
        this.fireEvent("add", this, records, index);
    },
    remove: function(record) {
        var index = this.data.indexOf(record);
        if(index > -1){
            this.data.removeAt(index);
        }
        if (this.allData) {
            this.allData.remove(record);
        }
        if (this.snapshot) {
            this.snapshot.remove(record);
        }
        if (this.pruneModifiedRecords) {
            this.modified.remove(record);
        }
        if(index > -1){
            this.fireEvent("remove", this, record, index);
        }
    },
    removeAll: function() {
        this.data.clear();
        if (this.allData) {
            this.allData.clear();
        }
        if (this.snapshot) {
            this.snapshot.clear();
        }
        if (this.pruneModifiedRecords) {
            this.modified = [];
        }
        this.fireEvent("clear", this);
    },
    insert: function(index, records) {
        records = [].concat(records);
        for (var i = 0, len = records.length; i < len; i++) {
            this.data.insert(index, records[i]);
            records[i].join(this);
        }
        if (this.allData) {
            this.allData.addAll(records);
        }
        if (this.snapshot) {
            this.snapshot.addAll(records);
        }
        this.fireEvent("add", this, records, index);
    },
    getById: function(id) {
        return (this.snapshot || this.allData || this.data).key(id);
    },
    execute: function(action, rs, options) {
        if (!Ext.data.Api.isAction(action)) {
            throw new Ext.data.Api.Error('execute', action);
        }
        options = Ext.applyIf(options || {}, {params: {}});
        var doRequest = true;
        if (action === "read") {
            doRequest = this.fireEvent('beforeload', this, options);
        }
        else {
            if (this.writer.listful === true && this.restful !== true) {
                rs = (Ext.isArray(rs)) ? rs: [rs];
            }
            else if (Ext.isArray(rs) && rs.length == 1) {
                rs = rs.shift();
            }
            if ((doRequest = this.fireEvent('beforewrite', this, action, rs, options)) !== false) {
                this.writer.write(action, options.params, rs);
            }
        }
        if (doRequest !== false) {
            //var params = Ext.apply(options.params || {}, this.baseParams);
            var params = Ext.apply({}, options.params, this.baseParams);
            if (this.writer && this.proxy.url && !this.proxy.restful && !Ext.data.Api.hasUniqueUrl(this.proxy, action)) {
                params.xaction = action;
            }
            if (action === "read" && this.isPaging(params)) {
                (function() {
                    if (this.allData) {
                        this.data = this.allData;
                        delete this.allData;
                    }
                    this.applyPaging();
                    this.fireEvent("datachanged", this);
                    var r = [].concat(this.data.items);
                    this.fireEvent("load", this, r, options);
                    if (options.callback) {
                        options.callback.call(options.scope || this, r, options, true);
                    }
                }).defer(1, this);
                return true;
            }
            this.proxy.request(Ext.data.Api.actions[action], rs, params, this.reader, this.createCallback(action, rs), this, options);
        }
        return doRequest;
    },
    loadRecords: function(o, options, success) {
        if (!o || success === false) {
            if (success !== false) {
                this.fireEvent("load", this, [], options);
            }
            if (options.callback) {
                options.callback.call(options.scope || this, [], options, false, o);
            }
            return;
        }
        var r = o.records, t = o.totalRecords || r.length;
        if (!options || options.add !== true) {
            if (this.pruneModifiedRecords) {
                this.modified = [];
            }
            for (var i = 0, len = r.length; i < len; i++) {
                r[i].join(this);
            }
            if (this.allData) {
                this.data = this.allData;
                delete this.allData;
            }
            if (this.snapshot) {
                this.data = this.snapshot;
                delete this.snapshot;
            }
            this.data.clear();
            this.data.addAll(r);
            this.totalLength = t;
            this.applySort();
            if (!this.allData) {
                this.applyPaging();
            }
            if (r.length != this.getCount()) {
                r = [].concat(this.data.items);
            }
            this.fireEvent("datachanged", this);
        } else {
            this.totalLength = Math.max(t, this.data.length + r.length);
            this.add(r);
        }
        this.fireEvent("load", this, r, options);
        if (options.callback) {
            options.callback.call(options.scope || this, r, options, true);
        }
    },
    loadData: function(o, append) {
        this.isPaging(Ext.apply({}, this.lastOptions ? this.lastOptions.params : null, this.baseParams));
        var r = this.reader.readRecords(o);
        this.loadRecords(r, {add: append}, true);
    },
    getTotalCount: function() {
        return this.allData ? this.allData.getCount() : this.totalLength || 0;
    },
    sortData: function(f, direction) {
        direction = direction || 'ASC';
        var st = this.fields.get(f).sortType;
        var fn = function(r1, r2) {
            var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
        };
        if (this.allData) {
            this.data = this.allData;
            delete this.allData;
        }
        this.data.sort(direction, fn);
        if (this.snapshot && this.snapshot != this.data) {
            this.snapshot.sort(direction, fn);
        }
        this.applyPaging();
    },
    filterBy: function(fn, scope) {
        this.snapshot = this.snapshot || this.allData || this.data;
        delete this.allData;
        this.data = this.queryBy(fn, scope || this);
        this.applyPaging();
        this.fireEvent("datachanged", this);
    },
    queryBy: function(fn, scope) {
        var data = this.snapshot || this.allData || this.data;
        return data.filterBy(fn, scope || this);
    },
    collect: function(dataIndex, allowNull, bypassFilter) {
        var d = (bypassFilter === true ? this.snapshot || this.allData || this.data: this.data).items;
        var v, sv, r = [], l = {};
        for (var i = 0, len = d.length; i < len; i++) {
            v = d[i].data[dataIndex];
            sv = String(v);
            if ((allowNull || !Ext.isEmpty(v)) && !l[sv]) {
                l[sv] = true;
                r[r.length] = v;
            }
        }
        return r;
    },
    clearFilter: function(suppressEvent) {
        if (this.isFiltered()) {
            this.data = this.snapshot;
            delete this.allData;
            delete this.snapshot;
            this.applyPaging();
            if (suppressEvent !== true) {
                this.fireEvent("datachanged", this);
            }
        }
    },
    isFiltered: function() {
        return this.snapshot && this.snapshot != (this.allData || this.data);
    },
    isPaging: function(params) {
        var pn = this.paramNames, start = params[pn.start], limit = params[pn.limit];
        if ((typeof start != 'number') || (typeof limit != 'number')) {
            delete this.start;
            delete this.limit;
            this.lastParams = params;
            return false;
        }
        this.start = start;
        this.limit = limit;
        delete params[pn.start];
        delete params[pn.limit];
        var lastParams = this.lastParams;
        this.lastParams = params;
        if (!this.proxy) {
            return true;
        }
        if (!lastParams) {
            return false;
        }
        for (var param in params) {
            if (params.hasOwnProperty(param) && (params[param] !== lastParams[param])) {
                return false;
            }
        }
        for (param in lastParams) {
            if (lastParams.hasOwnProperty(param) && (params[param] !== lastParams[param])) {
                return false;
            }
        }
        return true;
    },
    applyPaging: function() {
        var start = this.start, limit = this.limit;
        if ((typeof start == 'number') && (typeof limit == 'number')) {
            var allData = this.data, data = new Ext.util.MixedCollection(allData.allowFunctions, allData.getKey);
            data.items = allData.items.slice(start, start + limit);
            data.keys = allData.keys.slice(start, start + limit);
            var len = data.length = data.items.length;
            var map = {};
            for (var i = 0; i < len; i++) {
                var item = data.items[i];
                map[data.getKey(item)] = item;
            }
            data.map = map;
            this.allData = allData;
            this.data = data;
        }
    }
});
Ext.ux.data.PagingDirectStore = function(c) {
    c.batchTransactions = false;
    Ext.ux.data.PagingDirectStore.superclass.constructor.call(this, Ext.apply(c, {
        proxy: (typeof(c.proxy) == 'undefined') ? new Ext.data.DirectProxy(Ext.copyTo({}, c, 'paramOrder,paramsAsHash,directFn,api')) : c.proxy,
        reader: (typeof(c.reader) == 'undefined' && typeof(c.fields) == 'object') ? new Ext.data.JsonReader(Ext.copyTo({}, c, 'totalProperty,root,idProperty'), c.fields) : c.reader
    }));
};
Ext.extend(Ext.ux.data.PagingDirectStore, Ext.ux.data.PagingStore, {});
Ext.reg('pagingdirectstore', Ext.ux.data.PagingDirectStore);
Ext.ux.data.PagingJsonStore = Ext.extend(Ext.ux.data.PagingStore, {
    constructor: function(config) {
        Ext.ux.data.PagingJsonStore.superclass.constructor.call(this, Ext.apply(config, {
            reader: new Ext.data.JsonReader(config)
        }));
    }
});
Ext.reg('pagingjsonstore', Ext.ux.data.PagingJsonStore);
Ext.ux.data.PagingXmlStore = Ext.extend(Ext.ux.data.PagingStore, {
    constructor: function(config) {
        Ext.ux.data.PagingXmlStore.superclass.constructor.call(this, Ext.apply(config, {
            reader: new Ext.data.XmlReader(config)
        }));
    }
});
Ext.reg('pagingxmlstore', Ext.ux.data.PagingXmlStore);
Ext.ux.data.PagingArrayStore = Ext.extend(Ext.ux.data.PagingStore, {
    constructor: function(config) {
        Ext.ux.data.PagingArrayStore.superclass.constructor.call(this, Ext.apply(config, {
            reader: new Ext.data.ArrayReader(config)
        }));
    },
    loadData: function(data, append) {
        if (this.expandData === true) {
            var r = [];
            for (var i = 0, len = data.length; i < len; i++) {
                r[r.length] = [data[i]];
            }
            data = r;
        }
        Ext.ux.data.PagingArrayStore.superclass.loadData.call(this, data, append);
    }
});
Ext.reg('pagingarraystore', Ext.ux.data.PagingArrayStore);
Ext.ux.data.PagingSimpleStore = Ext.ux.data.PagingArrayStore;
Ext.reg('pagingsimplestore', Ext.ux.data.PagingSimpleStore);
/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.data");

Sbi.data.MemoryStore = function(config) {
	this.alias2NameMap = {};
	this.dsLabel = config.datasetLabel;
	if(!config.url) {
		var serviceConfig;
		if(config.serviceName) {
			serviceConfig = {serviceName: config.serviceName};
			if(config.baseParams) {
				serviceConfig.baseParams = config.baseParams;
				delete config.baseParams;
			}
			delete config.serviceName;
			
			config.url = Sbi.config.serviceRegistry.getServiceUrl( serviceConfig );
		} else if(config.datasetLabel)	{
			serviceConfig = {serviceName: 'GET_CONSOLE_DATA_ACTION'};
				
			config.baseParams = config.baseParams || {};
			config.baseParams.ds_label = config.datasetLabel;
			config.baseParams.ds_rowsLimit = config.rowsLimit || -1;
			config.baseParams.ds_memoryPagination = config.memoryPagination;
			this.dsLabel = config.baseParams.ds_label;
			serviceConfig.baseParams = config.baseParams;			
			delete config.datasetLabel;
			delete config.baseParams;			
			config.url = Sbi.config.serviceRegistry.getServiceUrl( serviceConfig );
		}	
	}
	
	this.refreshTime = config.refreshTime;	
	delete config.refreshTime;
	
	Sbi.data.MemoryStore.superclass.constructor.call(this, config);
};

Ext.extend(Sbi.data.MemoryStore, Ext.ux.data.PagingJsonStore, {
	    
	alias2FieldMetaMap: null
	, refreshTime: null
	, dsLabel: null
	
    // -- public methods ----------------------------------------------------------------
	
	/*
	, refresh: function() {
		alert('Super refresh: '  + Sbi.data.MemoryStore.superclass.onRender.refresh);
	 	delete this.store.lastParams;
	 	this.doLoad(this.cursor);   
	}
	*/
	
	, getFieldMetaByAlias: function(alias) {
		// assert
		if(!this.alias2FieldMetaMap) {			
			Sbi.Msg.showError('Impossible to [getFieldMetaByAlias of '+ alias+' ]. Store '+this.dsLabel+' has not loaded yet.', 'Wrong function call');
			//return null;
		}
	
		var m = this.alias2FieldMetaMap[alias];
		if(m){
			if(m.length === 0) {
				m = undefined;
			} else if(m.length === 1) {
				m = m[0];
			} else {
				m = m[0];
				alert('Warning: there are [' + m.length + '] fields whose alias is [' + alias + ']. Only the first one will be used');
			}
		}
		return m;
	}

	, getFieldNameByAlias: function(alias) {
		var fname;
		var fmeta = this.getFieldMetaByAlias(alias);
		if(fmeta) {
			fname = fmeta.name;
		}
		return fname;
	}
	
	, loadStore: function(){
		this.load({
			params: {}, 
			callback: function(){this.ready = true;}, 
			scope: this, 
			add: false
		});
	}
    
	, getDsLabel: function(){
		return this.dsLabel;
	}
	
    // -- private methods ----------------------------------------------------------------
   
    , onMetaChange : function(meta){
		this.alias2FieldMetaMap = {};
		var fields = meta.fields;
		for(var i = 0, l = fields.length, f; i < l; i++) {
			f = fields[i];
			if( typeof f === 'string' ) {
				f = {name: f};
			}
			f.header = f.header || f.name;
			if(!this.alias2FieldMetaMap[f.header]) {
				this.alias2FieldMetaMap[f.header] = new Array();
			}
			this.alias2FieldMetaMap[f.header].push(f);
		}
		
		Sbi.data.MemoryStore.superclass.onMetaChange.call(this, meta);
    }

   
    
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.data");

Sbi.data.Store = function(config) {
	this.alias2NameMap = {};
	this.dsLabel = config.datasetLabel;
	
	if(!config.url) {
		var serviceConfig;
		if(config.serviceName) {
			serviceConfig = {serviceName: config.serviceName};
			if(config.baseParams) {
				serviceConfig.baseParams = config.baseParams;
				delete config.baseParams;
			}
			delete config.serviceName;
			
			config.url = Sbi.config.serviceRegistry.getServiceUrl( serviceConfig );
		} else if(config.datasetLabel)	{
			serviceConfig = {serviceName: 'GET_CONSOLE_DATA_ACTION'};
						
			config.baseParams = config.baseParams || {};
			config.baseParams.ds_label = config.datasetLabel;
			config.baseParams.ds_limitSS = config.limitSS || -1;
			config.baseParams.rowsLimit = config.rowsLimit || -1;
			config.baseParams.ds_memoryPagination = config.memoryPagination;
			this.dsLabel = config.baseParams.ds_label;
			serviceConfig.baseParams = config.baseParams;			
			delete config.datasetLabel;
			delete config.baseParams;			
			
			config.url = Sbi.config.serviceRegistry.getServiceUrl( serviceConfig );
		}	
	}
	
	this.refreshTime = config.refreshTime;	
	delete config.refreshTime;
	
	Sbi.data.Store.superclass.constructor.call(this, config);
};

Ext.extend(Sbi.data.Store, Ext.data.JsonStore, {
//Ext.extend(Sbi.data.Store, Ext.ux.data.PagingJsonStore, {	
	
    
	alias2FieldMetaMap: null
	, refreshTime: null
	, dsLabel: null
	
    // -- public methods ----------------------------------------------------------------
	
	/*
	, refresh: function() {
		alert('Super refresh: '  + Sbi.data.Store.superclass.onRender.refresh);
	 	delete this.store.lastParams;
	 	this.doLoad(this.cursor);   
	}
	*/
	
	, getFieldMetaByAlias: function(alias) {
		// assert
		if(!this.alias2FieldMetaMap) {
			Sbi.Msg.showError('Impossible to [getFieldMetaByAlias]. Store has not loaded yet.', 'Wrong function call');
		}
	
		var m = this.alias2FieldMetaMap[alias];
		if(m){
			if(m.length === 0) {
				m = undefined;
			} else if(m.length === 1) {
				m = m[0];
			} else {
				m = m[0];
				alert('Warning: there are [' + m.length + '] fields whose alias is [' + alias + ']. Only the first one will be used');
			}
		}
		return m;
	}

	, getFieldNameByAlias: function(alias) {
		var fname;
		var fmeta = this.getFieldMetaByAlias(alias);
		if(fmeta) {
			fname = fmeta.name;
		}
		return fname;
	}
	
	, loadStore: function(){
		this.load({
			params: {}, 
			callback: function(){this.ready = true;}, 
			scope: this, 
			add: false
		});
	}
    
	, getDsLabel: function(){
		return this.dsLabel;
	}
	
    // -- private methods ----------------------------------------------------------------
   
    , onMetaChange : function(meta){
		this.alias2FieldMetaMap = {};
		var fields = meta.fields;
		for(var i = 0, l = fields.length, f; i < l; i++) {
			f = fields[i];
			if( typeof f === 'string' ) {
				f = {name: f};
			}
			f.header = f.header || f.name;
			if(!this.alias2FieldMetaMap[f.header]) {
				this.alias2FieldMetaMap[f.header] = new Array();
			}
			this.alias2FieldMetaMap[f.header].push(f);
		}
		
		Sbi.data.Store.superclass.onMetaChange.call(this, meta);
    }

   
    
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.StoreManager = function(config) {

		var defaultSettings = {
			
		};
		
		if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.storeManager) {
			defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.storeManager);
		}
		
		var c = Ext.apply(defaultSettings, config || {});
		Ext.apply(this, c);
		
		this.init(c.datasetsConfig);
		
		// constructor
		Sbi.console.StoreManager.superclass.constructor.call(this, c);
};

Ext.extend(Sbi.console.StoreManager, Ext.util.Observable, {
    
	stores: null
   
	//  -- public methods ---------------------------------------------------------
    
	, addStore: function(s) {
		if (s.dsLabel !== undefined){
			s.ready = s.ready || false;
			s.storeType = s.storeType || 'ext';
			s.filterPlugin = new Sbi.console.StorePlugin({store: s});
			
			this.stores.add(s);
					
			
			if(s.refreshTime) {
				var task = {
					run: function(){
						//if the console is hidden doesn't refresh the datastore
						if(s.stopped) return;
						
						// if store is paging...
						if(s.lastParams) {
							// ...force remote reload
							delete s.lastParams;
						}
						s.load({
							params: s.pagingParams || {}, 
							callback: function(){this.ready = true;}, 
							scope: s, 
							add: false
						});
					},
					interval: s.refreshTime * 1000 //1 second
				};
				Ext.TaskMgr.start(task);
			}
		}
	}

	, getStore: function(storeId) {
		return this.stores.get(storeId);
	}
	
	/*
	 * storeId is optional: in case it is not specified, all stores are stopped
	 */
	, stopRefresh: function(value, storeId){
		if (storeId) { // if a storeId is defined, stopRefresh only on it
			var s = this.stores.get(storeId);
			s.stopped = value;
		} else { // if a storeId is NOT defined, stopRefresh on ALL stores
			for(var i = 0, l = this.stores.length, s; i < l; i++) {
				var s = this.stores.get(i);		
				if (s.dsLabel !== undefined){
					s.stopped = value;					
				}
			}
		}
	}
	
	//refresh All stores of the store manager managed
	, forceRefresh: function(){		
		for(var i = 0, l = this.stores.length; i < l; i++) {
			var s = this.getStore(i);			
			//s.stopped = false; 
			if (s !== undefined && s.dsLabel !== undefined && s.dsLabel !== 'testStore' && !s.stopped){					
				s.load({
					params: s.pagingParams || {},
					callback: function(){this.ready = true;}, 
					scope: s, 
					add: false
				});
			}
		}
	}

	
	
	//  -- private methods ---------------------------------------------------------
    
    , init: function(c) {
		c = c || [];
	
		this.stores = new Ext.util.MixedCollection();
		this.stores.getKey = function(o){
            return o.storeId;
        };
		
		for(var i = 0, l = c.length, s; i < l; i++) {
			if (c[i].memoryPagination !== undefined &&  c[i].memoryPagination === false){
				//server pagination	
				s = new Sbi.data.Store({
					storeId: c[i].id
					, datasetLabel: c[i].label
					, autoLoad: false
					, refreshTime: c[i].refreshTime
					, limitSS: this.limitSS
					, memoryPagination: c[i].memoryPagination || false 
				});
			}else{
				//local pagination (default)		
				s = new Sbi.data.MemoryStore({
					storeId: c[i].id
					, datasetLabel: c[i].label
					, autoLoad: false
					, refreshTime: c[i].refreshTime
					, rowsLimit:  c[i].rowsLimit || this.rowsLimit
					, memoryPagination: c[i].memoryPagination || true	//default pagination type is client side
				});
			}
			s.ready = c[i].ready || false;
			s.storeType = 'sbi';
			
			//to optimize the execution time, the store is created with the stopped property to false, so it's loaded
			//when the component (widget or grid) is viewed. 
			s.stopped = true;
			
			this.addStore(s);
		}
	
		// for easy debug purpose
		var testStore = new Ext.data.JsonStore({
			id: 'testStore'
			, fields:['name', 'visits', 'views']
	        , data: [
	            {name:'Jul 07', visits: 245000, views: 3000000},
	            {name:'Aug 07', visits: 240000, views: 3500000},
	            {name:'Sep 07', visits: 355000, views: 4000000},
	            {name:'Oct 07', visits: 375000, views: 4200000},
	            {name:'Nov 07', visits: 490000, views: 4500000},
	            {name:'Dec 07', visits: 495000, views: 5800000},
	            {name:'Jan 08', visits: 520000, views: 6000000},
	            {name:'Feb 08', visits: 620000, views: 7500000}
	        ]
	    });
		
		testStore.ready = true;
		testStore.storeType = 'ext';
		
		this.addStore(testStore);
		
	}
    
    
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * see ...
  *  - docs: http://www.fusioncharts.com/free/docs/
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.chart");


Sbi.chart.FusionFreeChart = function(config) {	
	Sbi.chart.FusionFreeChart.superclass.constructor.call(this, config);
};

Ext.extend(Sbi.chart.FusionFreeChart, Ext.FlashComponent, {
    
   
    // -- public methods -------------------------------------------------------------------
    
   
    
    
    // -- private methods ------------------------------------------------------------------
    
	initComponent : function(){
		Sbi.chart.FusionFreeChart.superclass.initComponent.call(this);
    	if(!this.url){
        	this.url = Sbi.chart.FusionFreeChart.CHART_URL;
    	}
    	   	
    	this.autoScroll = true;
    	
    	this.flashVars = {
    		scaleMode: 'exactfit'
    	};
	}

	,  onRender : function(ct, position){
		
		
		this.flashVars.chartWidth = ct.getWidth();
		this.flashVars.chartHeight = ct.getHeight();
		this.flashVars.dataXML = this.encodeDataXML(
				"<graph caption='Fusion Free Chart' xAxisName='Month' yAxisName='Units' showNames='1' decimalPrecision='0' formatNumberScale='0'><set name='Jan' value='462' color='AFD8F8' /><set name='Feb' value='857' color='F6BD0F' /><set name='Mar' value='671' color='8BBA00' /><set name='Apr' value='494' color='FF8E46'/><set name='May' value='761' color='008E8E'/><set name='Jun' value='960' color='D64646'/><set name='Jul' value='629' color='8E468E'/><set name='Aug' value='622' color='588526'/><set name='Sep' value='376' color='B3AA00'/><set name='Oct' value='494' color='008ED6'/><set name='Nov' value='761' color='9D080D'/><set name='Dec' value='960' color='A186BE'/></graph>"
		);
		Sbi.chart.FusionFreeChart.superclass.onRender.call(this, ct, position);
		
        //this.testFn.defer(2000, this);
	}
	
	//This function :
	//fixes the double quoted attributes to single quotes
	//Encodes all quotes inside attribute values
	//Encodes % to %25 and & to %26;
	, encodeDataXML: function(strDataXML){
		
			var regExpReservedCharacters=["\\$","\\+"];
			var arrDQAtt=strDataXML.match(/=\s*\".*?\"/g);
			if (arrDQAtt){
				for(var i=0;i<arrDQAtt.length;i++){
					var repStr=arrDQAtt[i].replace(/^=\s*\"|\"$/g,"");
					repStr=repStr.replace(/\'/g,"%26apos;");
					var strTo=strDataXML.indexOf(arrDQAtt[i]);
					var repStrr="='"+repStr+"'";
					var strStart=strDataXML.substring(0,strTo);
					var strEnd=strDataXML.substring(strTo+arrDQAtt[i].length);
					var strDataXML = strStart+repStrr+strEnd;
				}
			}
			
			strDataXML=strDataXML.replace(/\"/g,"%26quot;");
			strDataXML=strDataXML.replace(/%(?![\da-f]{2}|[\da-f]{4})/ig,"%25");
			strDataXML=strDataXML.replace(/\&/g,"%26");

			return strDataXML;

	}
	
	, testFn: function() {
    	this.swf.setDataXML("<graph caption='Monthly Unit Sales' xAxisName='Month' yAxisName='Units' showNames='1' decimalPrecision='0' formatNumberScale='0'><set name='Jan' value='462' color='AFD8F8' /><set name='Feb' value='857' color='F6BD0F' /><set name='Mar' value='671' color='8BBA00' /><set name='Apr' value='494' color='FF8E46'/><set name='May' value='761' color='008E8E'/><set name='Jun' value='960' color='D64646'/><set name='Jul' value='629' color='8E468E'/><set name='Aug' value='622' color='588526'/><set name='Sep' value='376' color='B3AA00'/><set name='Oct' value='494' color='008ED6'/><set name='Nov' value='761' color='9D080D'/><set name='Dec' value='960' color='A186BE'/></graph>");
    }
    
});





Sbi.chart.FusionFreeChart.CHART_URL = '/SpagoBIConsoleEngine/swf/fusionchartfree/FCF_Column3D.swf';/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.chart");


Sbi.chart.OpenFlashChart = function(config) {	
	Sbi.chart.OpenFlashChart.superclass.constructor.call(this, config);
};

Ext.extend(Sbi.chart.OpenFlashChart, Ext.FlashComponent, {
    
   
    // -- public methods -------------------------------------------------------------------
    
   
    
    
    // -- private methods ------------------------------------------------------------------
    
	initComponent : function(){
		Sbi.chart.OpenFlashChart.superclass.initComponent.call(this);
    	if(!this.url){
        	this.url = Sbi.chart.OpenFlashChart.CHART_URL;
    	}
    	   	
    	this.autoScroll = true;
    	
    	this.flashVars = {
    		paramWidth: 100
    		, paramHeight: 100
    		, minValue: -100
    		, maxValue: 100
    		, lowValue: -50
    		, highValue: 50
    	};
    	
	}

	,  onRender : function(ct, position){
		
		this.flashVars.paramWidth = ct.getWidth();
		this.flashVars.paramHeight = ct.getHeight();
				
		Sbi.chart.OpenFlashChart.superclass.onRender.call(this, ct, position);
		
        //this.testFn.defer(2000, this);
	}
	
	, testFn: function() {
    	this.swf.load();
    }
    
});



/*
function open_flash_chart_data()
{
	var s = Ext.util.JSON.encode({
		"elements": [
		{
			"type": "bar",
			"values": [9, 8, 7, 6, 5, 4, 3, 2, 1]
		}
		]
		, "title": {
			"text": "Chart di prova"
		}
	});
	return s;
}
*/
function open_flash_chart_data() {
	
	var s = Ext.util.JSON.encode({ 
		"elements": [ { 
			"type": "bar_sketch", 
			"colour": "#81AC00", 
			"outline-colour": "#567300", 
			"offset": 5, 
			"values": [ { "top": 3, "tip": "Hello #val#" }, 
			            1, 2, 3, 
			            { "top": 3, "tip": "Hello #val#" }, 
			            { "top": 3, "tip": "Hello #val#" },
			            { "top": 3, "tip": "Hello #val#" }, 
			            { "top": 3, "tip": "Hello #val#" }, 
			            { "top": 3, "tip": "Hello #val#" }, 
			            { "top": 3, "tip": "Hello #val#" }, 
			            10, 11 ] 
		} ], 
		"title": { "text": "Open Flash Chart", "style": "{color: #567300; font-size: 14px}" } ,
		"bg_colour": "#FFFFFF"
	});
	return s;
}





Sbi.chart.OpenFlashChart.CHART_URL = '/SpagoBIConsoleEngine/swf/openflashchart/open-flash-chart.swf';/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.chart");


Sbi.chart.SpagoBIChart = function(config) {	
	
	this.bindStoreBeforeSwfInit = config.bindStoreBeforeSwfInit || false;
	
	// because swfInit do not work for spago chart...
	/*
	if(this.bindStoreBeforeSwfInit) {
		this.bindStore(config.store, true);
	} else {
		this.store = config.store;
	}
	*/
	//... always bind store in constructor
	this.bindStore(config.store, true);
	
	if(config.bindStoreBeforeSwfInit) { delete config.bindStoreBeforeSwfInit; }
	if(config.store) { delete config.store; }
	
	
	
	// encode
	var c = Ext.apply({}, config);

	if (c.storeManager){
		this.storeManager = c.storeManager;
		delete c.storeManager;
	}
	
	if(c.ownerCt) {
		delete c.ownerCt;
	}
		
	for(p in c) {
		if( (typeof c[p]) === 'object') {
			c[p] = Ext.util.JSON.encode(c[p]);
			c[p] = c[p].replace(new RegExp('"','g'), '|');
		}
	}
	
	this.flashVars = Ext.applyIf(c, this.CHART_DEFAULT_CONFIG);
	

	this.flashVars.scale = 'exactfit'; 
	this.flashParams = this.flashParams || {};
	this.flashParams.scale = 'exactfit';
	this.flashVars.isIE = Ext.isIE;

	Sbi.chart.SpagoBIChart.superclass.constructor.call(this, config);
	/*
	if(c.xtype === 'chart.sbi.livelines') {
		alert(this.includeFields + ' - ' +  config.includeFields);
	}
	*/
};

Ext.extend(Sbi.chart.SpagoBIChart, Ext.FlashComponent, {
    
	store: null
	, storeMeta: null
	, bindStoreBeforeSwfInit: null
	, url: null
	, isLastWidget: null
	
	// if it is good for ext chart it is also good for us :)
	//, disableCaching: Ext.isIE || Ext.isOpera
	, disableCaching: false //the cache is ever active
    , disableCacheParam: '_dc'
	
	
	
    // -- public methods -------------------------------------------------------------------
    
   
    
    
    // -- private methods ------------------------------------------------------------------
    
	, initComponent : function(){
		Sbi.chart.SpagoBIChart.superclass.initComponent.call(this);
    	if(!this.url){
        	this.url = Sbi.chart.SpagoBIChart.CHART_BASE_URL + this.CHART_SWF;
    	}
    	if(this.disableCaching){
            this.url = Ext.urlAppend(this.url, String.format('{0}={1}', this.disableCacheParam, new Date().getTime()));
        }
    	   	
    	this.addEvents(
    		'beforerefresh'
    		, 'refresh'
    	);

    	this.autoScroll = true;  	
	}
	
	, isSwfReady: function() {
		return true;
	}

	// never invoked for the moment
	, onSwfReady : function(isReset){
        Ext.chart.Chart.superclass.onSwfReady.call(this, isReset);
        alert('onSwfReady');
        if(!isReset && !this.bindStoreBeforeSwfInit){
        	alert('Bind store');
            this.bindStore(this.store, true);
        }
        
        this.refresh.defer(10, this);
    }


	, refresh: function() {
		if( !this.isSwfReady() ) {
			if(this.bindStoreBeforeSwfInit) {
				// some charts can queue pending data refresh and then apply 
				// them as soon as the swf object is initialized
				this.onPendingRefresh();
			}
			return;
		}
		
		if(this.fireEvent('beforerefresh', this) !== false){
			this.onRefresh();			
			this.fireEvent('refresh', this);
		}
    	
    }
	
	, onRefresh: Ext.emptyFn
	
	, onPendingRefresh: function() {
		alert('Chart is unable to handle incoming data before inizialization');
	}
	
    , bindStore : function(store, initial){
        if(!initial && this.store){
        	this.unbindStore(store !== this.store && this.store.autoDestroy);
        }
        
        if(store){
        	store.on("datachanged", this.refresh, this);
            store.on("add", this.refresh, this);
            store.on("remove", this.refresh, this);
            store.on("update", this.refresh, this);
            store.on("clear", this.refresh, this);
            store.on('metachange', this.onStoreMetaChange, this);
        }
        
        this.store = store;
        if(store && !initial){
            this.refresh();
        }
    }
    
    , unbindStore: function(destroy) {
    	destroy = destroy || false;
    	if(destroy){
            this.store.destroy();
        }else{
            this.store.un("datachanged", this.refresh, this);
            this.store.un("add", this.refresh, this);
            this.store.un("remove", this.refresh, this);
            this.store.un("update", this.refresh, this);
            this.store.un("clear", this.refresh, this);
            this.store.un('metachange', this.onStoreMetaChange, this);
        }
    }
	
	, onStoreMetaChange: function(s, m) {
		this.storeMeta = m;
	}
	
});

Sbi.chart.SpagoBIChart.CHART_BASE_URL =  '/SpagoBIConsoleEngine/swf/spagobichart/';


Sbi.chart.Multileds = Ext.extend(Sbi.chart.SpagoBIChart, {
	
	CHART_SWF: 'multileds.swf'
	, CHART_DEFAULT_CONFIG: {
		//title:'SpagoBI Multileds'
			fields: Ext.util.JSON.encode([
		    {
		    	header: 'EffortIdx',
		    	name:'EffortIndex', 
		    	descValue:'descEffortIndex',
		    	rangeMaxValue: 100, 
		    	secondIntervalUb: 66, 
		    	firstIntervalUb: 10, 
		    	rangeMinValue: 0
		    }, {
		    	header: 'Compet.',
		    	name:'Competitiveness', 
		    	descValue:'descCompetitiveness',
		    	rangeMaxValue: 100, 
		    	secondIntervalUb: 66, 
		    	firstIntervalUb: 33, 
		    	rangeMinValue: 0
		    }, {
		    	header: 'CostOpt.',
		    	name:'CostOptimization', 
		    	descValue:'descCostOptimization',
		    	rangeMaxValue: 100, 
		    	secondIntervalUb: 66, 
		    	firstIntervalUb: 33, 
		    	rangeMinValue: 0
		    }, {
		    	header: 'Health',
		    	name:'Health', 
		    	descValue:'descHealth',
		    	rangeMaxValue: 100, 
		    	secondIntervalUb: 66, 
		    	firstIntervalUb: 33, 
		    	rangeMinValue: 0
		    }
		])
	}
		
	, isSwfReady: function() {
		return !!this.swf.loadData;
	}
	
	, onRefresh: function() {
			var data = {};
			var rec = this.store.getAt(0);
			if(rec) {
				var fields = this.storeMeta.fields;
				for(var i = 0, l = fields.length, f; i < l; i++) {
					f = fields[i];
					//alert("f: " + f.toSource());
					if( (typeof f) === 'string') {
						f = {name: f};
					}
					var alias = f.header || f.name;
					if(alias === 'recNo') continue;
					//data[alias] = rec.get(f.name);
					
					var tmpDescValue = this.getDescriptionColumn(alias);
					if (tmpDescValue!== undefined && tmpDescValue != ''){											
						data[alias] = rec.get(f.name) + '|' + rec.get(this.store.getFieldNameByAlias(tmpDescValue));
					}else{
						data[alias] = rec.get(f.name);
					}
				}
				this.swf.loadData(data);
			}
	}
	
	// checks if the column is configurated as visible into template
	, getDescriptionColumn: function(alias){
		if (this.fields === undefined) return '';
		
		var desc = '';
		for (var i = 0; i < this.fields.length; i++){
			if (alias === this.fields[i].name ){
				desc = this.fields[i].descValue;
				break;
			}				
		}
		return desc;	
		
	}
});
Ext.reg('chart.sbi.multileds', Sbi.chart.Multileds);


Sbi.chart.Livelines = Ext.extend(Sbi.chart.SpagoBIChart, {
	
	CHART_SWF: 'livelines.swf'
	, CHART_DEFAULT_CONFIG: {
		rangeMinValue: 0
		, rangeMaxValue: 120 
		, stepY: 40
		, domainValueNumber: 18
		, title:'SpagoBI Liveline'
	}
	
	, isSwfReady: function() {
		return !!this.swf.loadData;
	}
	
	, onRefresh: function() {
			var data = {};
			var rec = this.store.getAt(0);
			if(rec) {
				var fields = this.storeMeta.fields;
				for(var i = 0, l = fields.length, f; i < l; i++) {
					f = fields[i];
					if( (typeof f) === 'string') {
						f = {name: f};
					}
					var alias = f.header || f.name;
					if(alias === 'recNo' || !this.isVisible(alias)) continue;
					
					data[alias] = rec.get(f.name);				
				}
				this.swf.loadData(data);
			}
			
	}
	
	// checks if the column is configurated as visible into template
	, isVisible: function(alias){
		if (this.fields === undefined) return true;
		
		var isVisible = false;
		for (var i = 0; i < this.fields.length; i++){
			if (alias === this.fields[i] ){
				isVisible = true;
				break;
			}				
		}
		
		if(this.includeFields !== undefined && this.includeFields === false) {
			isVisible = !isVisible;
		}
		
		return isVisible;	
		
	}
});
Ext.reg('chart.sbi.livelines', Sbi.chart.Livelines);


Sbi.chart.Speedometer = Ext.extend(Sbi.chart.SpagoBIChart, {
	
	CHART_SWF: 'speedometer.swf'
	, CHART_DEFAULT_CONFIG: {
		minValue: 0
		, maxValue: 100
		, lowValue: 33
		, highValue: 66
		, field: 'EffortIndex'
	}
		
	, isSwfReady: function() {
		return !!this.swf.setValue;
	}

	, onRender : function(ct, position) {
		//this.flashVars.paramWidth = ct.getWidth();
		//this.flashVars.paramHeight = ct.getHeight();
		Sbi.chart.SpagoBIChart.superclass.onRender.call(this, ct, position);
	}
	
	
	, onRefresh: function() {
		var value;
		var rec = this.store.getAt(0);
		if(rec) {
			var fName = this.store.getFieldNameByAlias(this.flashVars.field);			
			var tmpDescValue = this.flashVars.descValue;
			if (tmpDescValue!== undefined && tmpDescValue != ''){											
				value = rec.get(fName) + '|' + rec.get(this.store.getFieldNameByAlias(tmpDescValue));
			}else{
				value = rec.get(fName);
			}
			//value = rec.get(fName);
		}
		this.swf.setValue(value);			
	}
	
});
Ext.reg('chart.sbi.speedometer', Sbi.chart.Speedometer);

Sbi.chart.Semaphore = Ext.extend(Sbi.chart.SpagoBIChart, {
	
	CHART_SWF: 'semaphore.swf'
	, CHART_DEFAULT_CONFIG: {
	//	title: 'Title',
  	    header: 'Effort',
    	field:'EffortIndex', 
    	orientation:'vertical',
    	rangeMaxValue: 100, 
    	rangeSecondInterval: 66, 
    	rangeFirstInterval: 10, 
    	rangeMinValue: 0
	}
		
	, isSwfReady: function() {
		//return this.swf.setValue;
		return !!this.swf.setValue;
	}

	, onRender : function(ct, position) {		
		Sbi.chart.SpagoBIChart.superclass.onRender.call(this, ct, position);
	}
	
	, onRefresh: function() {
		var value;
		var rec = this.store.getAt(0);
		if(rec) {
			var fName = this.store.getFieldNameByAlias(this.flashVars.field);
			var tmpDescValue = this.flashVars.descValue;
			if (tmpDescValue!== undefined && tmpDescValue != ''){											
				value = rec.get(fName) + '|' + rec.get(this.store.getFieldNameByAlias(tmpDescValue));
			}else{
				value = rec.get(fName);
			}
		//	value = rec.get(fName);
		}
		
		this.swf.setValue(value);			
	}
});
Ext.reg('chart.sbi.semaphore', Sbi.chart.Semaphore);


/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.Widget = function(config) {	
		var defaultSettings = {
			defaultMsg: ' '
		};

		if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.widget) {
			defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.widget);
		}
		var c = Ext.apply(defaultSettings, config || {});
		
		Ext.apply(this, c);
		this.msgPanel = new Ext.Panel({
			html: this.defaultMsg
		});
		if (this.linkableDoc !== undefined){
			//create the toolbar with the link vs external document
			var buttonLink = [];
			buttonLink.push({
				text: this.linkableDoc.text
				, tooltip: (this.linkableDoc.tooltip === undefined) ? "" : this.linkableDoc.tooltip
				, styles: {font:{style: 'bold'}}
				, documentConf: this.linkableDoc 
				, executionContext: this.executionContext
				, handler: this.execCrossNavigation
				, scope: this
			});
		
			this.toolLink = new Ext.Toolbar({autoWidth: true,  items: buttonLink});			
			delete this.linkableDoc;
		}
		if (this.toolLink !== undefined){
			c = Ext.apply(c, {  	
				header: false,
				tbar: this.toolLink,
		      	items: [this.msgPanel]
			});
		}else{	
			c = Ext.apply(c, {  				
		      	items: [this.msgPanel]
			});
		}	
		// constructor
		Sbi.console.Widget.superclass.constructor.call(this, c);	
};

Ext.extend(Sbi.console.Widget, Ext.Panel, {
    services: null
    , parentContainer: null
    
   
    //  -- public methods ---------------------------------------------------------
    
    , setParentContainer: function(c) {	
		this.parentContainer = c;	
	}

	, getStore: function(storeiId) {
		var store;
		
		if(this.parentContainer) {
			var sm = this.parentContainer.getStoreManager();
			if(sm) {
				store = sm.getStore(storeiId);
			} else {
				alert("getStore: storeManager not defined");
			}
		} else {
			alert("getStore: container not defined");
		}	
		return store;
	}
    
    //  -- private methods ---------------------------------------------------------
    
	, onRender: function(ct, position) {	
		Sbi.console.Widget.superclass.onRender.call(this, ct, position);	
	}
	
	, execCrossNavigation: function (b){	
		if(sendMessage === undefined) {
			Sbi.Msg.showError(
					'function [sendMessage] is not defined',
					'Cross navigation error'
			);
			return;
		}
		
		if( (typeof sendMessage) !== 'function') {
			Sbi.Msg.showError(
					'[sendMessage] is not a function',
					'Cross navigation error'
			);
			return;
		}
		
		var msg = {
			label: b.documentConf.label
			, windowName: this.name										
		};
			
		var separator = '';
		//adds static parameters
		if(b.documentConf.staticParams) {
			msg.parameters = '';		
			for(p in b.documentConf.staticParams) {
				msg.parameters += separator + p + '=' + b.documentConf.staticParams[p];
				separator = '&';
			}
			//alert("msg.parameters: " + msg.parameters.toSource());
		}
		
    //adds dynamic parameters (environment type) 
		if(b.documentConf.dynamicParams) {
			if (msg.parameters === undefined) msg.parameters = '';	
		    var msgErr = ""; 
		    for (var i=0, l=b.documentConf.dynamicParams.length; i < l; i++){     
	  		  var param = b.documentConf.dynamicParams[i];
	  		  for(p in param) {
				  var label = param[p];
			      if (p != 'scope'){
			    	if (param['scope'] === 'env'){ 
			            if (b.executionContext[label] === undefined) {              	 	 	      
				 	 	        msgErr += 'Parameter "' + p + '" undefined into request. <p>';
			            } else {          	 	 		           	 	 		  
			  	 	 		    msg.parameters += separator + p + '=' + b.executionContext[label];
					            separator = '&';
			                } 	 		 
			 	    	}          	 	 		   
			 	    }
			    }//for (p in tmp)
	    	}//for
		}
		//alert("msg.parameters: " + msg.parameters.toSource());
		sendMessage(msg, 'crossnavigation');	
	}
    
    
    
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * WidgetContainer
  * 
  * handle:
  *  - widgets lifecycle management: register, unregister, lookup
  *  - shared resources: through env
  *  - intra-widgets comunications: sendMessage (asyncronous: point to point or broadcast)
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.WidgetContainer = function(config) {
	
		var defaultSettings = {
			
		};
		
		if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.widgetContainer) {
			defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.widgetContainer);
		}
		
		var c = Ext.apply(defaultSettings, config || {});
		
		Ext.apply(this, c);

		this.init();
	

		// constructor
		Sbi.console.WidgetContainer.superclass.constructor.call(this, c);
};

Ext.extend(Sbi.console.WidgetContainer, Ext.util.Observable, {
    
    widgets: null
    , env: null
    , storeManager: null
    
   
    //  -- public methods ---------------------------------------------------------
        
    , register: function(w) {
		this.widgets.addAll(w);
	}

	, unregister: function(w) {
		this.remove(w);
	}
	
	, lookup: function(w) {
		this.widgets.get(w);
	}
	
	, getWidgets: function() {
		return this.widgets;
	}
	
	, getStoreManager: function() {
		return this.storeManager;
	}
	
	
    
    //  -- private methods ---------------------------------------------------------
    
    , init: function() {
  
    	if(!this.storeManager) {
    		alert("Store manager not defined");
    		this.storeManager = new Ext.util.MixedCollection();
	    	var testStore = new Ext.data.JsonStore({
		        fields:['name', 'visits', 'views'],
		        data: [
		            {name:'Jul 07', visits: 245000, views: 3000000},
		            {name:'Aug 07', visits: 240000, views: 3500000},
		            {name:'Sep 07', visits: 355000, views: 4000000},
		            {name:'Oct 07', visits: 375000, views: 4200000},
		            {name:'Nov 07', visits: 490000, views: 4500000},
		            {name:'Dec 07', visits: 495000, views: 5800000},
		            {name:'Jan 08', visits: 520000, views: 6000000},
		            {name:'Feb 08', visits: 620000, views: 7500000}
		        ]
		    });
	    	this.storeManager.add('testStore', testStore);
    	}
    	
    	this.widgets = new Ext.util.MixedCollection();
    	this.widgets.on('add', this.onWidgetAdd, this);
    	this.widgets.on('remove', this.onWidgetRemove, this);
	}
    
    , onWidgetAdd: function(index, widget, key) {
    	widget.setParentContainer(this);
    }
    
    , onWidgetRemove: function(widget, key) {
    	widget.setParentContainer(null);
    }
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * WidgetPanel
  * 
  * handle layout of widgets (maybe also d&d)
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.WidgetPanel = function(config) {
	
		var defaultSettings = {
			layout:'table'
		  , layoutConfig: {
			   tableAttrs: {
                    style: {width: '100%', height:'100%'}
              }
            }
		};
		
		if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.widgetPanel) {
			defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.widgetPanel);
		}	
		var c = Ext.apply(defaultSettings, config || {});
	
		//for retrocompatibility with 'column' type layout. 
		if (c.layout !== undefined && c.layout === 'column'){
			delete c.layout;
			c.layout = {}; 
			c.layoutConfig = {};
			c.layout = 'table';
			c.layoutConfig.columns = c.columnNumber;
			c.layoutConfig.tableAttrs = {};
			c.layoutConfig.tableAttrs.style = {};
			c.layoutConfig.tableAttrs.style['float'] = 'left';
		//	c.layoutConfig.tableAttrs.style.width = '100%';

			delete c.columnNumber;
			delete c.columnWidths;		
		}	
		this.widgetContainer = new Sbi.console.WidgetContainer({storeManager: c.storeManager});
		if(c.storeManager) {
			delete c.storeManager;
		}

		if(c.items !== undefined) {
			this.widgetContainer.register(c.items);
			var x = c.items[0];
			delete c.items;
		}	
		Ext.apply(this, c);
		// constructor
		Sbi.console.WidgetPanel.superclass.constructor.call(this, c);	
    
};

Ext.extend(Sbi.console.WidgetPanel, Sbi.console.Widget, {
    
	 widgetContainer: null
    
    //  -- public methods ---------------------------------------------------------
   
    , addWidget: function(widget) {	
		this.widgetContainer.register(widget);	
	}
    
    //  -- private methods ---------------------------------------------------------
    
    , onRender: function(ct, position) {	
    	
		Sbi.console.WidgetPanel.superclass.onRender.call(this, ct, position);
	
	    this.items.each( function(item) {
			this.items.remove(item);
	        item.destroy();           
	    }, this); 
	    
		var widgets = this.widgetContainer.getWidgets();
	
		widgets.each(function(widget, index, length) {
			this.add(widget);
		}, this);	
	}

}); /** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.chart.Chart.CHART_URL = '/SpagoBIConsoleEngine/swf/yuichart/charts.swf';

Ext.ns("Sbi.console");

Sbi.console.ChartWidget = function(config) {
		var defaultSettings = {
			height: 170,
			dataset: 'testStore'
	        , widgetConfig: {
	           	type: 'chart.ext.line'
	        	, xField: 'name'
	            , yField: 'visits'
	        }
		};	
		
		if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.chartWidget) {
			defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.chartWidget);
		}
		
		var c = Ext.apply(defaultSettings, config || {});		
		if(c.dataset) {
			if((typeof c.dataset) === 'string' ) {
				c.storeName = c.dataset;
			} else {
				c.storeConfig = c.dataset;
			}
			delete c.dataset;
		}		
		Ext.apply(this, c);	
		// constructor
		Sbi.console.ChartWidget.superclass.constructor.call(this, c);
		
};

Ext.extend(Sbi.console.ChartWidget, Sbi.console.Widget, {
    
	
	store: null
	, storeName: null
	, storeConfig: null
	
	, widgetConfig: null
	, chart: null
	, parentContainer: null
	
	, YUI_CHART_LINE: 'chart.ext.line'
	, YUI_CHART_BAR: 'chart.ext.bar'
	, YUI_CHART_PIE: 'chart.ext.pie'
	, SBI_CHART_SPEEDOMETER: 'chart.sbi.speedometer'
	, SBI_CHART_LIVELINES: 'chart.sbi.livelines'
	, SBI_CHART_MULTILEDS: 'chart.sbi.multileds'
	, SBI_CHART_SEMAPHORE: 'chart.sbi.semaphore'
	, OFC_CHART_BAR: 'chart.of.bar'
	, FCF_CHART_BAR: 'chart.fcf.bar'
		
	
    //  -- public methods ---------------------------------------------------------
    
   
    
    //  -- private methods ---------------------------------------------------------
	
	

	, onRender: function(ct, position) {
		
		Sbi.console.ChartWidget.superclass.onRender.call(this, ct, position);	
		
		if(!this.store) {
			if(this.storeName) {
				this.store = this.getStore(this.storeName);
			} else if(this.storeConfig) {
				alert('ChartWidget: sorry unable to create a private dataset from config');
			} else {
				return;
			}
		}

		
		//if(this.store.proxy) {
		//if( !this.store.ready &&  this.store.proxy && !this.store.proxy.getConnection().isLoading()){		
		if( !this.store.ready &&  this.store.proxy ){
			//since the store is loaded with the stopped property setted to false, the ready property is forced to true:
			this.store.ready = true;			
			this.store.load({
				params: {}, 
				callback: function(){this.store.ready = true;}, 
				scope: this, 
				add: false
			});
		}

		
		this.chart = null;
		if(this.store.ready === true) {
			this.initChart();
		} else {
			this.store.on('load', this.initChart, this);
		}	
	}

	, initChart: function() {	
		if(this.chart == null) {
			this.store.un('load', this.initChart, this);
		}

		this.chart = this.createChart(this.widgetConfig);
		
		this.items.each( function(item) {
			this.items.remove(item);
	        item.destroy();           
	    }, this);   
		
		if(this.chart !== null) {
			this.add(this.chart);
			this.doLayout();
		}	
	}
    
	, createChart: function(chartConfig) {
			
		var chart = null;
		
		chartConfig = chartConfig || {};
		
		var chartType = chartConfig.type;
		
		if(chartType === this.YUI_CHART_LINE) {
			chart = this.createLineChart(chartConfig);
		} else if(chartType === this.YUI_CHART_BAR) {
			chart = this.createBarChart(chartConfig);
		} else if(chartType === this.YUI_CHART_PIE){
			chart = this.createPieChart(chartConfig);
		} else if(chartType === this.SBI_CHART_SPEEDOMETER 
				|| chartType === this.SBI_CHART_LIVELINES
				|| chartType === this.SBI_CHART_MULTILEDS
				|| chartType === this.SBI_CHART_SEMAPHORE){
			
			chartConfig.domainTimeInterval = this.store.refreshTime;
			chart = this.createSpagoBIChart(chartConfig);
			
		} else if(chartType === this.OFC_CHART_BAR){
			chart = this.createOFBarChart(chartConfig);
		} else if(chartType === this.FCF_CHART_BAR){
			chart = this.createFCFBarChart(chartConfig);
		} else {
			Sbi.Msg.showError('Chart type [' + chartType + '] not supported by [ChartWidget]');
		}
		
		//chart.addListener('refresh', this.refreshStore , this);
		
		return chart;
	}
	
	, createSpagoBIChart: function(chartConfig) {
			
		chartConfig.store = this.store;	
		chartConfig.xtype = chartConfig.type;	
		delete chartConfig.type; 	

		return new Ext.Panel({
			//layout:'fit',
			height : this.height
			//, width : this.width //don't put this attribute value: the static version will not work!
		    , items: [chartConfig]
		    , border: false
		    , bodyBorder: false
		    , hideBorders: true
		});			
	}
	
	, createLineChart: function(chartConfig) {
		
		// type attribute is reseved 
		delete chartConfig.type;
		var c = Ext.apply({}, chartConfig, {
			xtype: 'linechart'
			, xField: 'category'
            , yField: 'value'
	        , store: this.store
			, listeners: {
				itemclick: function(o){
					//var rec = this.store.getAt(o.index);
					//alert('Item Selected', 'You chose ' + rec.get('name'));
				}
			}
		});
		
		c.xField = this.getFieldNameByAlias(c.xField);
		c.yField = this.getFieldNameByAlias(c.yField);
		
		return new Ext.Panel({
	        layout:'fit'
	        , height: this.height
	        , items: c
	        , border: false
	    });
	}
	
	
	, createBarChart: function(chartConfig) {
		// type attribute is reseved 
		delete chartConfig.type;
		var c = Ext.apply({}, chartConfig, {
			xtype: 'columnchart'
			, xField: 'category'
	        , yField: 'value'
			, store: this.store
			, listeners: {
				itemclick: function(o){
					var rec = this.store.getAt(o.index);
					alert('Item Selected', 'You chose ' + rec.get('column-2'));
				}
			}
		});
		
		c.xField = this.getFieldNameByAlias(c.xField);
		c.yField = this.getFieldNameByAlias(c.yField);
		
		
		
		return new Ext.Panel({
			layout:'fit'
		    , height: this.height	
		    , width: this.width
		    , items: c
		});		
	}
	
	, createPieChart: function(chartConfig) {
		// type attribute is reseved 
		delete chartConfig.type;
		
		var c = Ext.apply({}, chartConfig, {
			xtype: 'piechart'
			, dataField: 'value'
	        , categoryField: 'category'
			, store: this.store
	        , extraStyle:
	         {
	         	legend:
	            {
	            	display: 'bottom',
	                padding: 5,
	                font:
	                {
	                	family: 'Tahoma',
	                    size: 13
	                }
	            }
	         }
		});
		
		c.categoryField = this.getFieldNameByAlias(c.categoryField);
		c.dataField = this.getFieldNameByAlias(c.dataField);
		
		
		return new Ext.Panel({
			layout:'fit'	
			, height: this.height	
			, items: c
		});
	}
	
	, createOFBarChart: function(chartConfig) {
		
		return new Ext.Panel({
			layout:'fit'
		    , height: this.height	
		    , items: [new Sbi.chart.OpenFlashChart()]
		});		
	}
	
	, createFCFBarChart: function(chartConfig) {
		
		return new Ext.Panel({
			layout:'fit'
		    , height: this.height	
		    , items: [new Sbi.chart.FusionFreeChart()]
		});		
	}
	
	
	
	, getFieldNameByAlias: function(alias) {
		var fname;
		
		fname = alias;
		if(this.store.getFieldNameByAlias) {
			fname = this.store.getFieldNameByAlias(alias);
			if(!fname) {
				Sbi.Msg.showError(
					'Dataset [' + this.storeId + '] does not contain a field whose alias is  [' + alias + ']', 
					'Error in chart configuration'
				);
				fname = alias;
			}
		}
		
		return fname;
	}
	
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  * - Antonella Giachino (antonella.giachino@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.SummaryPanel = function(config) {
	
		var defaultSettings = {
			layout: 'fit'
			, region: 'north'
			, height: 410
			, split: true
			//, collapseMode: 'mini'
			, collapsible: true
	        , collapseFirst: false
		};
		
		if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.summaryPanel) {
			defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.summaryPanel);
		}
		
		var c = Ext.apply(defaultSettings, config || {});
		Ext.apply(this, c);

		var widgetPanelConfig = this.initWidgetPanelConfig(c);
		var widgetPanel = new Sbi.console.WidgetPanel(widgetPanelConfig);
		
		c = Ext.apply(c, {  	
			items: [widgetPanel]
		});
			
		// constructor
		Sbi.console.SummaryPanel.superclass.constructor.call(this, c);	
		
		//this.on('expand', this.storeManager.forceRefresh, this);
		//this.on('collapse', this.collapsePanel, this);
		this.on('expand', this.expandPanel, this);
		 
		//add task: checks if all widgets have the isSWFReady setted to true. In this case force the refresh of datasets

		var datasetsTask = this.datasets;
		var isCompositeTask = this.isComposite;
		var task = {};
		task = {
					run: function(){
						var allWidgetsReady = false;
						//if (!isComposite){		
						if (!isCompositeTask){		
							//each panel could contains more charts					
							for (var k=0, l3 = widgetPanelConfig.items.length; k < l3; k++){
								var tmpWidget = widgetPanelConfig.items[k].chart;
								if (tmpWidget === undefined) break;
								for (var x=0, l4 = tmpWidget.items.length; x < l4; x++){
									var tmpChart = tmpWidget.items.get(x);
									
									if (tmpChart !== null && tmpChart !== undefined && !tmpChart.isSwfReady ){							
										allWidgetsReady = false;
										break;
									}else {								
										allWidgetsReady = true;								
									}
									
								}
								
								if (!allWidgetsReady){
									break;
								}
							}
						} else{								
							//each panel could contains more charts 
							for (var k=0, l3 = widgetPanelConfig.items.length; k < l3; k++){
								
								for (p = 0; p < widgetPanelConfig.items[k].items.length; p++){
									var tmpWidget = widgetPanelConfig.items[k].items.get(p).chart;
									if (tmpWidget === undefined || tmpWidget === null) break;
									for (var x=0, l4 = tmpWidget.items.length; x < l4; x++){
										var tmpChart = tmpWidget.items.get(x);
										
										if (tmpChart !== null && tmpChart !== undefined && !tmpChart.isSwfReady ){							
											allWidgetsReady = false;
											break;
										}else {								
											allWidgetsReady = true;								
										}										
									}
									
									if (!allWidgetsReady){
										break;
									}
								}
								if (!allWidgetsReady){
									break;
								}
							}								
						} 
						if (allWidgetsReady && k == l3  ) {
							if ( widgetPanelConfig.storeManager !== null && widgetPanelConfig.storeManager !== undefined){
								//for (ds in datasets){
								for (ds in datasetsTask){									
									//sets the single store as refreshable 
									var tmpStore = widgetPanelConfig.storeManager.getStore(ds);									
									if (tmpStore !== undefined){										
										tmpStore.stopped = false;
									}
								}								
								widgetPanelConfig.storeManager.forceRefresh();
								//stops the task
								Ext.TaskMgr.stop(task);								
							}
						}
							
					},
					interval: 10 //milliseconds
				};
			
				//starts the task
				Ext.TaskMgr.start(task);
};
		

Ext.extend(Sbi.console.SummaryPanel, Ext.Panel, {
    
    services: null,
	datasets: [],
	isComposite: false,
	
    //  -- public methods ---------------------------------------------------------
    
    
    
    //  -- private methods ---------------------------------------------------------	
	initWidgetPanelConfig: function(config){
		var widgetPanelConfig = config.layoutManagerConfig || {};
		widgetPanelConfig.executionContext = config.executionContext;
		widgetPanelConfig.storeManager = this.storeManager;
		widgetPanelConfig.items = [];
		
		for(var i = 0, l1 = config.charts.length ; i < l1; i++) {
			if(config.charts[i].widgetConfig.type === 'chart.composite') {
				//composite widget
				this.isComposite = true;
				
				//sets the general style of the table 
				widgetPanelConfig.layoutConfig = config.layoutManagerConfig.layoutConfig || {};
				widgetPanelConfig.layoutConfig.tableAttrs = config.layoutManagerConfig.layoutConfig.tableAttrs || {style: {width: '100%'}};
				
				var compositeWidgetPanelConfig = {};
				//******** DEFAULTS configuration applied to each contained panel **********
				
				//dataset 			
				var defaultDataset = widgetPanelConfig.defaults.dataset;						
				//width 
				var defaultWidth =  (widgetPanelConfig.defaults.columnWidthDefault === undefined) ? .1 : widgetPanelConfig.defaults.columnWidthDefault;				
				//heigth 
				var defaultHeight =  (widgetPanelConfig.defaults.columnHeightDefault === undefined) ? .1: widgetPanelConfig.defaults.columnHeightDefault;

			
				//**************** configuration about the SINGLE contained panel *************
				 
				//title
				if (config.charts[i].widgetConfig.linkableDoc !== undefined){
					compositeWidgetPanelConfig.title = (config.charts[i].widgetConfig.linkableDoc.text === undefined) ? "": config.charts[i].widgetConfig.linkableDoc.text;
				}else {
					compositeWidgetPanelConfig.title = (config.charts[i].widgetConfig.title === undefined) ? "" :  config.charts[i].widgetConfig.title;			
				}			
				//colspan
				compositeWidgetPanelConfig.colspan = (config.charts[i].widgetConfig.colspan === undefined) ? 1 : config.charts[i].widgetConfig.colspan;				
				//rowspan
				compositeWidgetPanelConfig.rowspan = (config.charts[i].widgetConfig.rowspan === undefined) ? 1 : config.charts[i].widgetConfig.rowspan;
				//dataset 
				componentDataset = config.charts[i].widgetConfig.dataset;
				//width 
				var componentWidth = config.charts[i].widgetConfig.width;								
				//height 
				var componentHeight = config.charts[i].widgetConfig.height;	
				
				compositeWidgetPanelConfig.storeManager = this.storeManager;
				compositeWidgetPanelConfig.items = [];
								
				for(var j = 0, l2 = config.charts[i].widgetConfig.subcharts.length ; j < l2; j++) {
					var configSubChart = {};
					configSubChart = config.charts[i].widgetConfig.subcharts[j];									
					
					//sets the DATASET; the order for getting values are: single widget, single panel, table
					if (configSubChart.dataset === undefined){
						if (componentDataset !== undefined){
							configSubChart.dataset = componentDataset;
						}
						else{
							configSubChart.dataset = defaultDataset;
						}
					}					
					this.datasets[configSubChart.dataset] = configSubChart.dataset ;
					
					//sets the WIDTH of single element; the order for getting values are: single widget, single panel, table
					if (configSubChart.width === undefined){
						if (componentWidth !== undefined){
							configSubChart.width = componentWidth/l2; //divides total space by the number of elements
						}
						else{
							configSubChart.width = defaultWidth/l2; //divides default total space by the number of elements
						}
					}					
					//apply the colspan
					configSubChart.width = (configSubChart.width * compositeWidgetPanelConfig.colspan);				
										
					//percentage dimensions: the single widget occupies the total space; otherwise if the value is not a valid number,
					//deletes the property from configuration (for IE problem) 
					if (configSubChart.width <= 1){						
						configSubChart.width = "100%";								
					}else if (configSubChart.width === undefined || isNaN(configSubChart.width) ){
						delete configSubChart.width;						
					}
					
					//sets the HEIGHT of single element; the order for getting values are: single widget, single panel, table
					if (configSubChart.height === undefined){
						if (componentHeight !== undefined){
							configSubChart.height = componentHeight; 
						}
						else{
							configSubChart.height = defaultHeight;
						}
					}					
					//apply the rowspan
					configSubChart.height = (configSubChart.height * compositeWidgetPanelConfig.rowspan);
				
					//percentage dimensions: the single widget occupies the total space; otherwise if the value is not a valid number,
					//deletes the property from configuration (for IE problem) 
					if (configSubChart.height <= 1){						
						configSubChart.height = "100%";			
					}else if (configSubChart.height === undefined || isNaN(configSubChart.height) ){
						delete configSubChart.height;							
					}
					configSubChart.executionContext = widgetPanelConfig.executionContext;
					
					//sets the dimensions on the parent panel
					compositeWidgetPanelConfig.width = (componentWidth > configSubChart.width)? componentWidth : configSubChart.width;
					compositeWidgetPanelConfig.height = (componentHeight > configSubChart.height)? componentHeight : configSubChart.height;	
					compositeWidgetPanelConfig.linkableDoc = config.charts[i].linkableDoc;
					compositeWidgetPanelConfig.executionContext = widgetPanelConfig.executionContext;
					compositeWidgetPanelConfig.items.push(new Sbi.console.ChartWidget(configSubChart));
				}
				var compositeWidgetPanel = new Sbi.console.WidgetPanel(compositeWidgetPanelConfig);

				widgetPanelConfig.items.push(compositeWidgetPanel);

			} else {
				//simple widget
				this.datasets[config.charts[i].dataset] = config.charts[i].dataset;				
				widgetPanelConfig.items.push(new Sbi.console.ChartWidget(config.charts[i]));
			}
		}		
		
		widgetPanelConfig.autoScroll = {};
		widgetPanelConfig.autoScroll = true;
		return widgetPanelConfig;		
	}

	, expandPanel: function(p){
		//WORK-AROUND for IE: that's the problem: if the user collapse the summaryPanel and expand it
		// the widgets don't refresh its values. Probably the problem is in the call of the method loadData
		//of the single swf widget because the dataset is regularly loaded
		/*
		// if (Ext.isIE){
			 //var bckItems = [];
			 var bckItems = Ext.apply({}, this.items);    
			 //this.items.each(function(item){            
		     //       this.items.remove(item);
		     //       item.destroy();           
		     //   }, this); 
			 this.items = [];
			 this.items = bckItems;
			 this.doLayout();
		 //}
	//	 this.resumeEvents();
		 */
	}
	
	//, collapsePanel: function(){
	//	this.suspendEvents();						
	//} 
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Antonella Giachino (antonella.giachino@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.DownloadLogsWindow = function(config) {
	/**
	 * example of action calling:
	 * http://localhost:8080/SpagoBI/servlet/AdapterHTTP?ACTION_NAME=DOWNLOAD_ZIP&DIRECTORY=C:/logs&BEGIN_DATE=01/03&END_DATE=30/04&BEGIN_TIME=14:00&END_TIME=15:00
	 */
	
	var defaultSettings = Ext.apply({}, config || {}, {
		title: 'Download windows'
		, width: 500
		, height: 300
		, hasBuddy: false		
	});
	
		
	if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.downloadLogsWindow) {
		defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.downloadLogsWindow);
	}
		
	var c = Ext.apply(defaultSettings, config || {});

	Ext.apply(this, c);
		
	this.initFormPanel(c.options);	

	this.closeButton = new Ext.Button({
		text: LN('sbi.console.downloadlogs.btnClose'),
		handler: function(){
        	//this.hide();
        	this.close();
        }
        , scope: this
	});
	
	this.downloadButton = new Ext.Button({
		text: LN('sbi.console.downloadlogs.btnDownload')
		, handler: function() {
			//check parameters
			if (!this.checkParameters()) { return; }			
			
			
        	this.fireEvent('checked', this, this.target);
        	//this.hide();
			this.close();
        }
        , scope: this
	});
	

	c = Ext.apply(c, {  	
		layout: 'fit'
	//,	closeAction:'hide'
	,	closeAction:'close'
	,	constrain: true
	,	plain: true
	,	modal:true
	,	title: this.title
	,	buttonAlign : 'center'
	,	buttons: [this.closeButton, this.downloadButton]
	,	items: [this.formPanel]
	});

	// constructor
	Sbi.console.DownloadLogsWindow.superclass.constructor.call(this, c);
	
	this.addEvents('checked');
    
};

Ext.extend(Sbi.console.DownloadLogsWindow, Ext.Window, {

    serviceName: null
    , formPanel: null
    , initialDate: null
    , finalDate: null
    , initialTime: null
    , finalTime: null
    , paths: null
    

    // this is the object uppon witch the window has been opened, usually a record
    , target: null
    
   , closeButton: null
   , downloadButton: null
    
    // public methods
   , downloadLogs: function(action, r, index, params) {
		
		//by unique request
		var form = document.getElementById('download-form');
		if(!form) {
			var dh = Ext.DomHelper;
			form = dh.append(Ext.getBody(), {
			    id: 'download-form'
			    , tag: 'form'
			    , method: 'post'
			    , cls: 'download-form'
			});
		}
		//call by ajax for test correct file
		params = Ext.apply(params, {
  			message: action.name, 
        	userId: Sbi.user.userId ,
        	BEGIN_DATE: this.initialDate.value,
        	END_DATE: this.finalDate.value,
        	BEGIN_TIME: this.initialTime.value,
        	END_TIME: this.finalTime.value,
        //	PREFIX1: (params.PREFIX1 !== undefined && params.PREFIX1 !== null)?params.PREFIX1:"",
        //	PREFIX2: (params.PREFIX2 !== undefined && params.PREFIX2 !== null)?params.PREFIX2:"",
        	DIRECTORY: (this.paths !== null)?this.paths.value:params.DIRECTORY
        	//DIRECTORY: params.DIRECTORY
  		}); 

  		Ext.Ajax.request({
	       	url: params.URL			       
	       	, params: params 			       
	    	, success: function(response, options) {
	    		if(response !== undefined && response.responseText !== undefined) {
	    				var path = (this.paths === null)? params.DIRECTORY : this.paths.value;
	    				
						//call by submit to download really 
	    				var actionStr  = params.URL +  								 
									  '&DIRECTORY=' + path + 
									  '&BEGIN_DATE=' + this.initialDate.value + '&END_DATE=' + this.finalDate.value + 
									  '&BEGIN_TIME=' + this.initialTime.value + '&END_TIME=' + this.finalTime.value;
			 
						if (params.PREFIX1 !== undefined && params.PREFIX1 !== null){
							actionStr += '&PREFIX1=' + params.PREFIX1;
						}
						if (params.PREFIX2 !== undefined && params.PREFIX2 !== null){
							actionStr += '&PREFIX2=' + params.PREFIX2;
						}								
						form.action = actionStr;
						form.submit();
										      		
    			} else {
    				Sbi.Msg.showError('Server response is empty', 'Service Error');
    			}
	    	}
	    	, failure: Sbi.exception.ExceptionHandler.onServiceRequestFailure
	    	, scope: this     
	    });
		//call by submit to download really
  		/*
		form.action = params.URL +  '&PREFIX=' + params.PREFIX +  '&DIRECTORY=' + params.DIRECTORY + 
					  '&BEGIN_DATE=' + this.initialDate.value + '&END_DATE=' + this.finalDate.value + 
					  '&BEGIN_TIME=' + this.initialTime.value + '&END_TIME=' + this.finalTime.value;
		form.submit();
	*/
	}

    
    // private methods

    , initFormPanel: function(options) {
    	
    	var elements = [];
    	
    	this.initialDate = new Ext.form.DateField({
            fieldLabel: LN('sbi.console.downloadlogs.initialDate') 
          , width: 150
          , format: 'd/m'
          , allowBlank: false
        });
    	
    	elements.push(this.initialDate);
    	
    	this.initialTime = new Ext.form.TimeField({
    		 					 fieldLabel: LN('sbi.console.downloadlogs.initialTime') 
    		 				   , width: 150
    						   , increment: 30
    						   , format: 'H:i'
    						});
    	 
    	elements.push(this.initialTime);
    			
    	this.finalDate = new Ext.form.DateField({
            fieldLabel: LN('sbi.console.downloadlogs.finalDate')            			   
          , width: 150
          , format: 'd/m'
          , allowBlank: false
        });
    	elements.push(this.finalDate);
    	
    	this.finalTime = new Ext.form.TimeField({
					    	   fieldLabel: LN('sbi.console.downloadlogs.finalTime') 
					    	 , width: 150
							 , increment: 30
							 , format: 'H:i'
    						});
    	elements.push(this.finalTime);
    			
    	//adds a combo with all paths defined into template (ONLY if they are more than one!)
    	var directories = options.staticParams.DIRECTORY;
    	
    	if (Ext.isArray(directories) && directories.length > 1){
    		var data = [];
        	var store = new Ext.data.JsonStore({
				   fields:['name', 'value'],
		           data: []
			   });
    		for(var p = 0, len = directories.length; p < len; p++) {
    			 var row = {
    					  name: directories[p]
    				    , value: directories[p]
    				   };
    			 data.push(row);
    				   
    		}
    		
    		store.loadData(data, false);
			   
		     var combDefaultConfig = {
				   width: 350,
			       displayField:'name',
			       valueField:'value',
			       fieldLabel: LN('sbi.console.downloadlogs.path') ,
			       typeAhead: true,
			       triggerAction: 'all',
			       emptyText:'',
			       //selectOnFocus:true,
			       selectOnFocus:false,
			       validateOnBlur: false,
			       allowBlank:false,
			       mode: 'local'
		     };
			 
    		 this.paths = new Ext.form.ComboBox(
    				 Ext.apply(combDefaultConfig, {	    
			    	   store: store
    				})
  			 );	
    		 
    		 elements.push(this.paths);
    	}else{
    		this.paths = null;
    	}
    	
    	
    	
    	this.formPanel = new  Ext.FormPanel({
    		  title:  LN('sbi.console.downloadlogs.title'),
    		  margins: '50 50 50 50',
	          labelAlign: 'left',
	          bodyStyle:'padding:5px',
	          width: 850,
	          height: 600,
	          layout: 'form',
	          trackResetOnLoad: true,
	          //items: [this.initialDate, this.initialTime, this.finalDate, this.finalTime, this.paths]
	          items: elements
	      });
    	 
    }
    
    , checkParameters: function(){
    	if (this.initialDate.getValue() === undefined ||  this.initialDate.getValue() === ''){
			Sbi.Msg.showWarning( LN('sbi.console.downloadlogs.initialDateMandatory'));
			this.initialDate.focus();
			return false;
		}
		if (this.initialTime.getValue() === undefined ||  this.initialTime.getValue() === ''){
			Sbi.Msg.showWarning( LN('sbi.console.downloadlogs.initialTimeMandatory'));
			this.initialTime.focus();
			return false;
		}
		if (this.finalDate.getValue() === undefined ||  this.finalDate.getValue() === ''){
			Sbi.Msg.showWarning( LN('sbi.console.downloadlogs.finalDateMandatory'));
			this.finalDate.focus();
			return false;
		}
		if (this.finalTime.getValue() === undefined ||  this.finalTime.getValue() === ''){
			Sbi.Msg.showWarning( LN('sbi.console.downloadlogs.finalTimeMandatory'));
			this.finalTime.focus();
			return false;
		}
		if (this.initialDate.getValue() > this.finalDate.getValue()){
			Sbi.Msg.showWarning( LN('sbi.console.downloadlogs.rangeInvalid'));
			this.initialDate.focus();
			return false;
		}

		if (this.paths !== null && (this.paths.getValue()  === undefined ||  this.paths.getValue() === '')){
			Sbi.Msg.showWarning( LN('sbi.console.downloadlogs.pathsMandatory'));
			this.paths.focus();
			return false;
		}
		return true;
    }
    
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.MasterDetailWindow = function(config) {


	var defaultSettings = Ext.apply({}, config || {}, {
		title: 'Master/Detail windows'
		, width: 500
		, height: 300
		, hasBuddy: false		
	});
	
		
	if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.masterDetailWindow) {
		defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.masterDetailWindow);
	}
		
	var c = Ext.apply(defaultSettings, config || {});
		
	Ext.apply(this, c);
		
	this.initMainPanel(c);	


	this.okButton = new Ext.Button({
		text: LN('sbi.console.error.btnClose'),
		handler: function(){
        	this.hide();
        }
        , scope: this
	});
	
	this.checkButton = new Ext.Button({
		text: 'Mark as checked',
		handler: function() {
			this.hide();
        	this.fireEvent('checked', this, this.target);
        }
        , scope: this
	});
	
	c = Ext.apply(c, {  	
		layout: 'fit',
		closeAction:'hide',
		constrain: true,
		plain: true,
		modal:true,
		title: this.title,
		buttonAlign : 'center',
		buttons: [this.okButton, this.checkButton],
		items: [this.mainPanel]
	});

	// constructor
	Sbi.console.MasterDetailWindow.superclass.constructor.call(this, c);
	
	this.addEvents('checked');
    
};

Ext.extend(Sbi.console.MasterDetailWindow, Ext.Window, {
    
	mainPanel: null
	, masterPanel: null
	, grid: null
	, detailPanel: null
	, detailText: null
    , store: null
    , detailField: null
    , serviceName: null
    
    // this is the object uppon witch the window has been opened, usually a record
    , target: null
    
   , okButton: null
   , checkButton: null
    
    // public methods
    
   
    , setTarget: function(t) {
		this.target = t;
	}
    
    , reloadMasterList: function(params) {
		this.clearDetailPanel();
		this.store.load({
			params: params
		});
	}

	, clearDetailPanel: function() {
		this.detailText.reset();
	}
    
    // private methods
    
    , initMainPanel: function() {
		this.initMasterlPanel();
		this.initDetailPanel();
		
		this.mainPanel = new Ext.Panel({
			layout: 'border',
		    frame: false, 
		    border: false,
		    bodyStyle:'background:#E8E8E8;',
		    style:'padding:3px;',
		    items: [this.masterPanel, this.detailPanel]
		});
    }

	, initMasterlPanel: function() {
		
		this.columnModel = new Ext.grid.ColumnModel([
			new Ext.grid.RowNumberer(), 
			{
				header: "Data",
			    dataIndex: 'data',
			    width: 100
			}
		]);
		
		this.store = new Sbi.data.Store({
			serviceName: this.serviceName
			//datasetLabel: 'testConsole2'
			, autoLoad: false
		}); 
		
		this.store.on('exception', Sbi.exception.ExceptionHandler.onStoreLoadException, this);
		this.store.on('metachange', function( store, meta ) {
			var i;

			var tmpMeta =  Ext.apply({}, meta); // meta;
			
			this.detailField = tmpMeta.detailProperty;
			
			var fields = tmpMeta.fields;
			tmpMeta.fields = new Array(fields.length);
			for(i = 0; i < fields.length; i++) {
				if( (typeof fields[i]) === 'string') {
					fields[i] = {name: fields[i]};
				}
				tmpMeta.fields[i] = Ext.apply({}, fields[i]);
			}
			
			//adds numeration column    
			tmpMeta.fields[0] = new Ext.grid.RowNumberer();
		
	    	//update columnmodel configuration
			this.grid.getColumnModel().setConfig(tmpMeta.fields);
		
		}, this);
		
		this.grid =  new Ext.grid.GridPanel({			
			layout: 'fit'
			, title: this.action.titleWin
			, loadMask: true
			, viewConfig: {
		    	forceFit:false,
		        autoFill: true,
		        enableRowBody:true,
		        showPreview:true
		    }
			, store: this.store
			, cm: this.columnModel
		});
		
		this.grid.on("rowclick", function(grid,  rowIndex, e){
	       	var record = this.store.getAt( rowIndex );
	       	if(!this.detailField) return;
	       	var detailValue = record.get(this.detailField);
	       	
	       	if(!detailValue) return;
	       	detailValue = detailValue.replace(/</g, '\n <');
	       	this.detailText.setValue(detailValue);
	       	//this.detailText.setValue(Ext.util.Format.htmlEncode(detailValue));
		}, this);
		
		this.masterPanel = new Ext.Panel({
			region:'north',
    		split: true,
    		frame:false,
    		border:false,
    		height: 120,
    	    bodyStyle:'padding:5px;background:#E8E8E8;border-width:1px;border-color:#D0D0D0;',
    	    style: 'padding-bottom:3px',
		    //html: 'Io sono il master ...'
    	    items: [this.grid]
		});
		
		// dirty fix: without it do not fit :(
		this.store.on('load', function() {
			this.grid.setHeight( this.masterPanel.getSize().height - 12 );
			this.grid.setWidth( this.masterPanel.getSize().width - 12 );
		}, this);
		this.masterPanel.on('resize', function(panel, w, h, w1, h1) {
			this.grid.setHeight( this.masterPanel.getSize().height - 12 );
			this.grid.setWidth( this.masterPanel.getSize().width - 12 );
		}, this);
		// dirty fix
	}

	, initDetailPanel: function() {
		//HTMLEditor isn't used because hide XML tags.
		/*
		this.detailText = new Ext.form.HtmlEditor({
			 enableAlignments : false,
	    	 enableColors : false,
	    	 enableFont :  false,
	    	 enableFontSize : false, 
	    	 enableFormat : false,
	    	 enableLinks :  false,
	    	 enableLists : false,
	    	 enableSourceEdit : false,
	    	 autoScroll: true
		});*/
		
		this.detailText = new Ext.form.TextArea({			
	    	 autoScroll: true
		});				
		
		//this.detailText.setValue('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed nibh ipsum. Ut dui nulla, viverra vitae condimentum eget, faucibus id quam. Praesent dapibus velit ut sem tincidunt pretium. Quisque scelerisque nisl in turpis ornare at vulputate nulla varius. Donec ut sem sed nunc accumsan mattis. In hac habitasse platea dictumst. Nulla et est eros, quis aliquet massa. Aliquam non ante ut sapien tincidunt porttitor. Duis commodo tincidunt egestas. Pellentesque eget pulvinar quam. Etiam lorem augue, fringilla et commodo in, viverra nec leo. Fusce molestie vehicula neque, sit amet tempus neque mattis vitae. Donec viverra vestibulum lectus, sit amet vestibulum ligula auctor sed. Maecenas lorem urna, congue id auctor eu, pharetra a libero. Quisque aliquam, enim nec auctor molestie, mi ipsum convallis dui, non condimentum leo quam nec dui. Fusce augue nisl, laoreet at tincidunt ut, malesuada et tellus. Maecenas sit amet nulla nisi, id rutrum orci. ');	
		this.detailText.setReadOnly(true);
		
		this.detailPanel = new Ext.Panel({
			region:'center',
		    frame: false, 
		    border: false,
		    autoScroll: false,
		    height: 'auto',
		    //html: '... e io sono il detail'
		    items: [
			    new Ext.Panel({
			    	layout: 'fit'
			    	, bodyStyle:'padding:5px;background:#E8E8E8;border-width:1px;border-color:#D0D0D0;'
			    	, items: [this.detailText]
			    })
		    ]
		});
		
		// dirty fix: without it do not fit :(
		this.detailPanel.on('resize', function(panel, w, h, w1, h1) {
			this.detailText.setHeight( this.detailPanel.getSize().height - 12 );
		}, this);
		// dirty fix
	}
    
    
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.WaitWindow = function(config) {
	

	var defaultSettings = Ext.apply({}, config || {}, {
		title: 'Please wait'
		, width: 500
		, height:150
		, hasBuddy: false		
	});
	
		
	if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.waitWindow) {
		defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.waitWindow);
	}
		
	var c = Ext.apply(defaultSettings, config || {});
		
	Ext.apply(this, c);
		
	this.initMainPanel(c);	


	this.okButton = new Ext.Button({
		text: LN('sbi.console.error.btnClose'),
		handler: function(){
        	this.hide();
        }
        , scope: this
	});
	
	
	
	c = Ext.apply(c, {  	
		layout: 'fit',
		closeAction:'hide',
		constrain: true,
		plain: true,
		modal:true,
		title: this.title,
		buttonAlign : 'center',
		buttons: [this.okButton],
		items: [this.mainPanel]
	});

	// constructor
	Sbi.console.WaitWindow.superclass.constructor.call(this, c);    
};

Ext.extend(Sbi.console.WaitWindow, Ext.Window, {
    
	mainPanel: null
   , okButton: null
   , statusText: null
   , startingTxt: 'Please wait, somethings is happening at the server side'
   , startedTxt:  'Server side finished to do whatever it was doing'
   , progressTickNo: null 
  
    
    // public methods
    
   	, start: function() {
		this.progressTickNo = 0;
		this.statusText.setText( this.startingTxt );
		this.okButton.disable();
		this.progressBar.wait({
            interval:200,
            increment:15
        });
	}

	, stop: function(msg) {
		this.progressBar.reset();
		this.progressBar.updateProgress(1,'',true);
		this.statusText.setText(msg || this.startedTxt);
		this.okButton.enable();
		
	}
   
   
    // private methods
    
    , initMainPanel: function() {
		this.progressBar = new Ext.ProgressBar({
		    
	    });
		
		this.progressBar.on('update', function(pb){
			this.progressTickNo++;
			var tailingDotsNum = this.progressTickNo%5;
			var tailingDotsStr = '.';
			for(var i = 0; i < tailingDotsNum; i++) {
				tailingDotsStr += '.'
			}
			this.statusText.setText( this.startingTxt + tailingDotsStr);
	    }, this);
		
		this.statusText = new Ext.form.Label({
	        text: 'Proecess is starting up ...'
	        , style:'padding-top:10px;font-size:16;'
	    });
	
		this.mainPanel = new Ext.Panel({
			layout: {
            	type:'vbox',
            	padding:'10',
            	align:'stretch'
        	},

		    frame: false, 
		    border: false,
		    bodyStyle:'background:#E8E8E8;',
		    style:'padding:3px;',
		    items: [this.progressBar, this.statusText]
		});
    }
    
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  * - Antonella Giachino (antonella.giachino@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.NavigationToolbar = function(config) {
	
		var defaultSettings = {
			//title: LN('sbi.qbe.queryeditor.title')
		};
		
		if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.navigationToolbar) {
			defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.navigationToolbar);
		}
		
		var c = Ext.apply(defaultSettings, config || {});
		var documentsConfig = c.documents || [];
		documentsConfig.executionContext = c.executionContext;
		delete c.documents;
		delete c.executionContext;
		
		Ext.apply(this, c);
				
		this.initToolbarButtons(documentsConfig);
	
		c = Ext.apply(c, {  	
	      	items: this.toolbarButtons
		});

		// constructor
		Sbi.console.NavigationToolbar.superclass.constructor.call(this, c);
    
};

Ext.extend(Sbi.console.NavigationToolbar, Ext.Toolbar, {
    
    services: null
    , toolbarButtons: null
    
   
    //  -- public methods ---------------------------------------------------------
    
    //  -- private methods ---------------------------------------------------------
    ,initToolbarButtons: function(documentsConfig) {
		
		this.toolbarButtons = [];
		
		for(var i = 0, l = documentsConfig.length; i < l; i++){
			var d = documentsConfig[i];
			
			this.toolbarButtons.push({
				text: d.text
				, tooltip: d.tooltip
				, documentConf: d 
				, executionContext: documentsConfig.executionContext
				, handler: this.execCrossNavigation
				, scope: this
			});
		}
	}

	, execCrossNavigation: function (b){
		
		if(sendMessage === undefined) {
			Sbi.Msg.showError(
					'function [sendMessage] is not defined',
					'Cross navigation error'
			);
			return;
		}
		
		if( (typeof sendMessage) !== 'function') {
			Sbi.Msg.showError(
					'[sendMessage] is not a function',
					'Cross navigation error'
			);
			return;
		}
		
		var msg = {
			label: b.documentConf.label
			, windowName: this.name										
		};
			
		var separator = '';
		//adds static parameters
		if(b.documentConf.staticParams) {
			msg.parameters = '';		
			for(p in b.documentConf.staticParams) {
				msg.parameters += separator + p + '=' + b.documentConf.staticParams[p];
				separator = '&';
			}
			//alert("msg.parameters: " + msg.parameters.toSource());
		}
		
    //adds dynamic parameters (environment type) 
		if(b.documentConf.dynamicParams) {
		    var msgErr = ""; 
		    for (var i=0, l=b.documentConf.dynamicParams.length; i < l; i++){     
  		    var tmp = b.documentConf.dynamicParams[i];
          for(p in tmp) {
     	 	    if (p != 'scope'){
       	 		 //  var param = {};   
               if (tmp['scope'] === 'env'){ 
                    if (b.executionContext[p] === undefined) {              	 	 	      
        	 	 	        msgErr += 'Parameter "' + p + '" undefined into request. <p>';
                    } else {          	 	 		           	 	 		  
          	 	 		    msg.parameters += separator + tmp[p] + '=' + b.executionContext[p];
  				            separator = '&';
                    } 	 		 
                }          	 	 		   
    	      }
    	   }
  	    if  (msgErr != ""){
  	    	Sbi.Msg.showError(msgErr, 'Service Error');
        }	
    	}
		}
	//	alert("msg.parameters: " + msg.parameters.toSource());
		sendMessage(msg, 'crossnavigation');
	}
    
    
    
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
 // JavaScript Document
Ext.grid.CheckColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
  };

  Ext.grid.CheckColumn.prototype = {
    init : function(grid){
        this.grid = grid;
        //alert(this.header + ': ' + this.grid);
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    onMouseDown : function(e, t){
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
        }
    },

    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; 
        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }
  };
  
  Ext.grid.ButtonColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
  };

  Ext.grid.ButtonColumn.prototype = {
    init : function(grid){
        this.grid = grid;
        if(this.grid.rendered === true) {
         var view = this.grid.getView();
            view.mainBody.on('click', this.onClick, this);
        } else {
         this.grid.on('render', function(){
             var view = this.grid.getView();
             view.mainBody.on('click', this.onClick, this);
         }, this);
        }
    },

    onClick : function(e, t){
        if(t.className && t.className.indexOf('x-mybutton-'+this.id) != -1){
            e.stopEvent();
            this.clickHandler(e,t);
            /*
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            this.grid.store.remove(record);
            */
        }
    },
    clickHandler:function(e, t){
      var index = this.grid.getView().findRowIndex(t);
      var record = this.grid.store.getAt(index);
      //alert('index: ' + index + '; column-value: ' + record.data[this.dataIndex]);
    },

    renderer : function(v, p, record){
        return '<center><img class="x-mybutton-'+this.id+'" width="13px" height="13px" src="' + this.imgSrc + '" title= "' + this.tooltip + '"/></center>';
    }
  };/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
 Ext.ns("Sbi.console");


Sbi.console.InlineActionColumn = function(config){
	
	
	config = Ext.apply({
		hideable: true
		, width: 25
	}, config || {});
	
	config.options = config.config;
	config.tooltip = config.tooltip || {};
	config.handler = config.handler || Ext.emptyFn;
	config.scope = config.scope || this;

	delete config.config;
	
	Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    if(!this.dataIndex) {
    	this.dataIndex = this.name + "_" + this.id;
    }
    this.renderer = this.renderer.createDelegate(this);
    
    // parent constructor
    Sbi.console.InlineActionColumn.superclass.constructor.call(this, config);
    
    if(this.grid) this.init(this.grid);
};


Ext.extend(Sbi.console.InlineActionColumn, Ext.util.Observable, {
	
	grid: null
	
	// action name and options
	, name: null
	, options: null
	
	// click handler function
	, handler: null
	, scope: null
	
	// control column. If flagColumn is defined and its value is equal to 
	// UNFLAGGED_VALUE the button will be not active (i.e. not visible and actionable)
	, flagColumn: null
	, UNFLAGGED_VALUE: 0
	
	// -- public methods --------------------------------------------------------------------------
	, isActive: function(record) {
		var active = true;
		if(this.flagColumn) {
			var v, s;
			
			s = this.grid.store;
			v = record.get(s.getFieldNameByAlias(this.flagColumn));
	    	if (v === undefined || v === null) {
	    		Sbi.Msg.showError('Impossible to draw button column [' + this.dataIndex + ']. Dataset [' + s.storeId + ']does not contain column [' + this.flagColumn + ']');
	    	};
	    	active = (this.UNFLAGGED_VALUE !== v);
	    	//alert(v + ' !== '+ this.UNFLAGGED_VALUE + ' : ' + active);
		}
			
		return active;
	}

	
	
	// -- private methods -------------------------------------------------------------------------
	, init : function(grid){
		this.grid = grid;
        if(this.grid.rendered === true) {
        	var view = this.grid.getView();
            view.mainBody.on('click', this.onClick, this);
        } else {
        	this.grid.on('render', function(){
        		var view = this.grid.getView();
        		view.mainBody.on('click', this.onClick, this);
        	}, this);
        }
    }

    , onClick : function(e, t){
        if(t.className && t.className.indexOf('x-mybutton-'+this.id) != -1){
            e.stopEvent();
            
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);   
            this.handler.call(this.scope, this, record, index, this.options);          
        }
    }
       

    , renderer : function(v, p, record){
    	if(this.isActive(record) === false) {
    		return '';
    	}
        return '<center><img class="x-mybutton-'+this.id+'" width="13px" height="13px" src="' + this.imgSrc + '" title= "' + this.tooltip + '"/></center>';
    }
  });/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
 Ext.ns("Sbi.console");


Sbi.console.InlineToggleActionColumn = function(config){
	
    // parent constructor
    Sbi.console.InlineToggleActionColumn.superclass.constructor.call(this, config);
  
};


Ext.extend(Sbi.console.InlineToggleActionColumn, Sbi.console.InlineActionColumn, {
	
	toggleOnClick: true
	
	, checkColumn: null

	, CHECKED_VALUE: 1
	, UNCHECKED_VALUE: 0
	
	// -- public methods ------------------------------------------------------------------------
	
	, isBoundToColumn: function() {
		return (this.checkColumn !== null);
	}

	

	, getBoundColumnValue: function(record) {
		var v, s;
		
		s = this.grid.store;
		v = record.get(s.getFieldNameByAlias(this.checkColumn));
    	if (v === undefined || v === null) {
    		Sbi.Msg.showError('Impossible to draw toggle column [' + this.dataIndex + ']. Dataset [' + s.storeId + ']does not contain column [' + this.checkColumn + ']');
    	} /*else if(v !== this.CHECKED_VALUE && v !== this.UNCHECKED_VALUE) {
    		Sbi.Msg.showError('Column [' + this.checkColumn + '] of dataset [' + s.storeId + '] contains a wrong value [' + v + ']. Impossible to determinate the state of the bounded togle column [' + this.checkColumn + ']');
    	}*/
    	return v;
	}
	
	, setBoundColumnValue: function(record, value) {
		var s;
		s = this.grid.store;
		record.set (s.getFieldNameByAlias(this.checkColumn), value );
	}
	
	
	, isChecked: function(record) {
		var v, active;
		if(this.isBoundToColumn()) {
			v = this.getBoundColumnValue(record);
			
	    	active = (v === this.CHECKED_VALUE);
	    	//alert(v + ' === '+ this.CHECKED_VALUE + ' : ' + active);
		}
		
		return active;		
	}
	
	, setChecked: function(record, b) {
		if(this.isBoundToColumn()) {
			this.setBoundColumnValue(record, (b? this.CHECKED_VALUE: this.UNCHECKED_VALUE));
		}
	}
	
	, toggle: function(record) {
		this.setChecked(record, !this.isChecked(record));
	}

	

	
	
	// -- private methods ------------------------------------------------------------------------

    , onClick : function(e, t){

        if(t.className && t.className.indexOf('x-mybutton-'+ this.id) != -1){
            e.stopEvent();
            
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);   
            //if in configuration is set that the action is usable only once, it doesn't change the check if it's yet checked
            if(!this.isChecked(record) || 
            		this.singleExecution === undefined || this.singleExecution == false) {            	
            	if(this.toggleOnClick) this.toggle(record);  
            	this.handler.call(this.scope, this, record, index, this.options);
            }
        }
    }


    , renderer : function(v, p, record){
    	
    	if(this.isActive(record) === false) {
    		return '';
    	}

	    if (this.isChecked(record)) {
	    	img = '<center><img class="x-mybutton-'+this.id+'" width="13px" height="13px" src="' + this.imgSrcInactive + '" title= "' + this.tooltipInactive + '"/></center>';
	    } else {
	    	img = '<center><img class="x-mybutton-'+this.id+'" width="13px" height="13px" src="' + this.imgSrcActive + '" title= "' + this.tooltipActive + '"/></center>';  
	    }	    		
    	
        return img;
    }
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
 Ext.ns("Sbi.console");


Sbi.console.InlineCheckColumn = function(config){
	
	
	config = Ext.apply({
		hideable: true
		, width: 25
	}, config || {});
	
	config.tooltip = config.tooltip || {};
	config.handler = config.handler || Ext.emptyFn;
	config.scope = config.scope || this;

	delete config.config;
	
	Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    if(!this.dataIndex) {
    	this.dataIndex = this.name + "_" + this.id;
    }
    this.renderer = this.renderer.createDelegate(this);
    
    // parent constructor
    Sbi.console.InlineCheckColumn.superclass.constructor.call(this, config);
    
    if(this.grid) this.init(this.grid);
};


Ext.extend(Sbi.console.InlineCheckColumn, Ext.util.Observable, {
	
	grid: null

	// click handler function
	, handler: null
	, scope: null
	
	, masterCheckValue: null
	, listRowsSelected: []
	// control column. If flagColumn is defined and its value is equal to 
	// UNFLAGGED_VALUE the button will be not active (i.e. not visible and actionable)
	, flagColumn: null
	, UNFLAGGED_VALUE: 0
	, CHECKED_VALUE: 1
	, UNCHECKED_VALUE: 0
	
	// -- public methods --------------------------------------------------------------------------
	, isActive: function(record) {
		var active = true;
		if(this.flagColumn) {
			var v, s;
			
			s = this.grid.store;
			v = record.get(s.getFieldNameByAlias(this.flagColumn));
	    	if (v === undefined || v === null) {
	    		Sbi.Msg.showError('Impossible to draw check column [' + this.dataIndex + ']. Dataset [' + s.storeId + ']does not contain column [' + this.flagColumn + ']');
	    	};
	    	active = (this.UNFLAGGED_VALUE !== v);
	    	//alert(v + ' !== '+ this.UNFLAGGED_VALUE + ' : ' + active);
		}
			
		return active;
	}
	
	, setChecked: function(b, record) {		
		this.masterCheckValue = (b) ? this.CHECKED_VALUE: this.UNCHECKED_VALUE;
		var s = this.grid.store;
		var origValue = record.get(s.getFieldNameByAlias(this.flagColumn));
		var newValue = (origValue === 1 || origValue === '1' ) ? 'true' : '1';
		record.set (s.getFieldNameByAlias(this.flagColumn), newValue );
	}
	
	// -- private methods -------------------------------------------------------------------------
	, init : function(grid){
		this.grid = grid;
        if(this.grid.rendered === true) {
        	var view = this.grid.getView();
            view.mainBody.on('click', this.onClick, this);
        } else {
        	this.grid.on('render', function(){
        		var view = this.grid.getView();
        		view.mainBody.on('click', this.onClick, this);
        	}, this);
        }
    }

	, toggle: function(record) {
		this.setChecked(this.masterCheckValue, record);
	}

    , onClick : function(e, t){
    	if(t.className && (t.className.indexOf('x-mygrid3-check-col-'+ this.id) != -1 ||
    					   t.className.indexOf('x-mygrid3-check-col-on-'+ this.id) != -1) ){
    		e.stopEvent();
	        
	        var index = this.grid.getView().findRowIndex(t);
	        var record = this.grid.store.getAt(index);   
	        //add or remove the columnId from the general list
	        var s = this.grid.store;
	        //this.grid.isDisable = false; 
	        this.updateValuesList(record.get(s.getFieldNameByAlias(this.columnID)));
	        this.toggle(record);       
	        this.handler.call(this.scope, this.listRowsSelected);   
    	}
    }
       
    , updateValuesList: function (value){
    	var isDeleted = false;
    	var pos = this.getPositionEl(value, this.listRowsSelected);
    	if (pos != -1){
    		delete this.listRowsSelected[pos];
			isDeleted = true;
			this.masterCheckValue = this.UNCHECKED_VALUE; //set new check value
    		
    	}    	
    	if (!isDeleted){
    		this.listRowsSelected.push(value);
    		this.masterCheckValue = this.CHECKED_VALUE;		//set new check value
    	}
    }
    
    , getPositionEl: function(value, lst) {    	
		//check if the row is in the listRowsSelected (pagination management)
    	//returns the position element into the array 
    	var toReturn = -1;    	
    	if (lst == null)  return toReturn;
    	
    	for(var i=0; i<lst.length; i++) {
    		if (lst[i] == value ){
    			toReturn = i;
    			break;
    		}   		
    	}
    	return toReturn;	
	}

    , renderer : function(v, p, record){
    	var s = this.grid.store;
    	var value = record.get(s.getFieldNameByAlias(this.columnID));
    	
		if (this.grid.isDirty || this.grid.isDisable){
			this.listRowsSelected = this.grid.selectedRowsId;
		}
    	var isHidePosition = this.getPositionEl(value, this.grid.hideSelectedRow);
    	if(this.isActive(record) === false ||  isHidePosition !== -1) {
    		this.grid.isDisable = false; //reset for next element
    		return '';
    	}
    	p.css += ' x-grid3-check-col-td';    	
    	var toReturn = '';
    	if(	value == undefined || this.getPositionEl(value, this.listRowsSelected) == -1){
    		toReturn = '<div class="x-grid3-check-col x-mygrid3-check-col-'+this.id+ + '" title= "' + this.tooltipInactive + '">&#160;</div>';
    	}
    	else{    		
    		toReturn = '<div class="x-grid3-check-col-on x-mygrid3-check-col-on-'+this.id+ + '" title= "' + this.tooltipActive + '">&#160;</div>';
    	}
        return toReturn;
    }
  });/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Antonella Giachino (antonella.giachino@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.ActionButton = function(config) {

		var defaultSettings = {
			//id: 'ActionButton'
			iconCls: config.actionConf.type
			,tooltip: (config.actionConf.tooltip === undefined)?config.actionConf.type : config.actionConf.tooltip 
			,hidden: config.actionConf.hidden
			,scope:this
		};
		
		if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.actionButton) {
			defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.actionButton);
		}
	
		var c = Ext.apply(defaultSettings, config || {});
	
		Ext.apply(this, c);

	    this.initServices();
	    
        c = Ext.apply(c, this);
      
      
	    // constructor
	    Sbi.console.ActionButton.superclass.constructor.call(this, c);
	    this.on('click', this.execAction, this);
	    this.store.on('load', this.initButton, this);
        this.addEvents('toggleIcons');      
        // invokes before each ajax request 
        //Ext.Ajax.on('beforerequest', this.showMask, this);   
        // invokes after request completed 
        //Ext.Ajax.on('requestcomplete', this.hideMask, this);            
        // invokes if exception occured 
        //Ext.Ajax.on('requestexception', this.hideMask, this);   
}; 

Ext.extend(Sbi.console.ActionButton, Ext.Button, {
    
    services: null
    , isActive: null
    , ACTIVE_VALUE: 1
	, INACTIVE_VALUE: 0
	, USER_ID: 'userId'
	, ERRORS: 'errors'
	, ALARMS: 'alarms'
	, VIEWS: 'views'
	, MONITOR: 'monitor'
	, MONITOR_INACTIVE: 'monitor_inactive'
	, SELECT_ROWS: 'selectRow'
	, UNSELECT_ROWS: 'unselectRow'
	, INVERT_SELECT_ROWS: 'invertSelectionRow'
	, loadMask: null
	, columnID : null
		
	, FILTERBAR_ACTIONS: {		
		  monitor: {serviceName: 'UPDATE_ACTION', images: 'monitor'}
		, monitor_inactive: {serviceName: 'UPDATE_ACTION', images: 'monitor_inactive'}
		, errors: {serviceName: 'UPDATE_ACTION', images: {active: 'errors', inactive: 'errors_inactive'}} 
		, alarms: {serviceName: 'UPDATE_ACTION', images: {active: 'alarms', inactive: 'alarms_inactive'}}
		, views: {serviceName: 'UPDATE_ACTION', images: {active: 'views', inactive: 'views_inactive'}}
		, refresh: {serviceName: 'REFRESH_ACTION', images: {active: 'refresh', inactive: 'refresh'}}
	}
   
    // public methods

	//This method search the dynamic parameter value before in the request, if it isn't found it search into filter.
	//If it isn't found again it shows a message error.
	, resolveParameters: function(parameters, context) {
		var results = {};  

		results = Ext.apply(results, parameters.staticParams);
		
		var dynamicParams = parameters.dynamicParams;
	    if(dynamicParams) {        	
	    	var msgErr = ""; 
	    	var useSelRows = false;
	      	for (var i = 0, l = dynamicParams.length; i < l; i++) {      		     
	      		var param = dynamicParams[i]; 
	      		if (param.useSelectedRow !== undefined && param.useSelectedRow == true){	      			
	      			useSelRows = true;
	      		}
	        	for(p in param) { 
	        		if(p === 'scope') continue;	      
	        		if(p === 'useSelectedRow') continue;	
	        		//Searchs into request
        			if (param.scope === 'env'){ 
        			  var tmpNamePar =  param[p];
        			  if (useSelRows){
        				  var tb = this.ownerCt;
        				  var gridConsole = tb.ownerCt;
        				  var finalSelectedRowsId = this.cleanList(gridConsole.selectedRowsId);
        				  if (finalSelectedRowsId == null || finalSelectedRowsId.length == 0){
        					  var msgWar = 'Parameter "' + tmpNamePar + '" has not values selected. Default value is used.<p>';
        					  Sbi.Msg.showWarning(msgWar, 'Service Warning');
        				  }else{
	                    	  results[p] = finalSelectedRowsId;	  	                    	  
	                    	  this.columnID = tmpNamePar;
        				  }
        				  useSelRows = false; //reset flag
        			  } else if (p !== this.USER_ID && context[tmpNamePar] === undefined) {
	            		  // msgErr += 'Parameter "' + tmpNamePar + '" undefined into request. <p>';
                      } else if (!useSelRows){   
                    	  results[p] = context[tmpNamePar];                    	  
                      }		            	
	                }          	 	 		   	          		    
	        	 }          			   
	      	} 
	      	
	      	var metaParams = parameters.metaParams;
		    if(metaParams) {  
		    	results['metaParams'] = Ext.util.JSON.encode(metaParams);
		    }
	      	
	        if  (msgErr != ""){
	        	Sbi.Msg.showError(msgErr, 'Service Error');
	        }		  
	    }
	    
	    return results;
	}
	
	, cleanList: function(lst){
		var toReturn = [];
		if (lst == null) return lst;
		
		for (var i=0, l=lst.length; i<l; i++){
			var el = lst[i];
			if (el !== undefined && el !== ''){
				toReturn.push(el);
			}
		}
		
		return toReturn;
		
	}
    , execAction: function(){
    	//if the action is executable only once and it's disabled, do nothing
    	if (this.actionConf.singleExecution !== undefined && this.actionConf.singleExecution == true && 
    			(this.isActive !== undefined && this.isActive == false)){
    		return;
    	}
    	//views a confirm message if it's configurated
    	if (this.actionConf.msgConfirm !== undefined && this.actionConf.msgConfirm !== ''){
    		Ext.MessageBox.confirm(
    				"Confirm",
    	            this.actionConf.msgConfirm,            
    	            function(btn, text) {
    					 if (btn == 'yes') {
    						 this.execRealAction();
    					 }
    				},    	            
	            this
			);  
    	}else{
    		this.execRealAction();
    	}
	}
 

    // private methods
    , initServices: function() {
    	this.services = this.services || new Array();	
		this.images = this.images || new Array();	
				
		for(var actionName in this.FILTERBAR_ACTIONS) {
			var actionConfig = this.FILTERBAR_ACTIONS[actionName];
			this.services[actionName] = this.services[actionName] || Sbi.config.serviceRegistry.getServiceUrl({
				serviceName: actionConfig.serviceName
				, baseParams: new Object()
			});
		}
    }
    
    , initButton: function(){    	
    	//icons about monitoring are ever enabled
    	if (this.actionConf.type === this.MONITOR || this.actionConf.type === this.MONITOR_INACTIVE){
    		return;
    	}
    	
    	if (this.actionConf.type === this.SELECT_ROWS || this.actionConf.type === this.UNSELECT_ROWS ||
    		this.actionConf.type === this.INVERT_SELECT_ROWS){
	    	if (this.actionConf.imgSrc !== undefined){
				//creates css dynamically if it's an extra-icon
				var tmpImgName = this.actionConf.imgSrc.substr(0,this.actionConf.imgSrc.indexOf(".") );
				if (Ext.util.CSS.getRule('.' + tmpImgName) == null){
					Ext.util.CSS.createStyleSheet('.'+tmpImgName+' { background-image: url(../img/'+this.actionConf.imgSrc+') !important; }');
				}
				this.setIconClass(tmpImgName);    				
			}
	    	return;
    	}
    	//checks if the button is active (when the action is errors or alarms)
    	if (this.actionConf.type === this.ERROR || this.actionConf.type === this.ALARMS ||
    		this.actionConf.type === this.VIEWS && this.actionConf.flagColumn !== undefined){
    		var flagCol = this.store.getFieldNameByAlias(this.actionConf.flagColumn);    
        	if (flagCol === undefined ){
        		return;
        	}else{
        		var flagValue = this.store.findExact(flagCol, this.ACTIVE_VALUE);
        		if (flagValue === -1) {
        			this.hide();
        			return;
        		}
        	}    		
    	}

    	var isCheck = this.store.getFieldNameByAlias(this.actionConf.checkColumn);
    	if (isCheck !== undefined ){
    		//checkValue: -1 if all rows are ACTIVE, greater then -1 when ther's almost one active 
    		var checkValue = this.store.findExact(isCheck,this.INACTIVE_VALUE);
    		if (checkValue > -1){  //there's any inactive --> enable active actions
    			if (this.actionConf.imgSrcActive !== undefined){
    				//creates css dynamically if it's an extra-icon
    				var tmpImgName = this.actionConf.imgSrcActive.substr(0,this.actionConf.imgSrcActive.indexOf(".") );
    				if (Ext.util.CSS.getRule('.' + tmpImgName) == null){
    					Ext.util.CSS.createStyleSheet('.'+tmpImgName+' { background-image: url(../img/'+this.actionConf.imgSrcActive+') !important; }');
    				}
    				this.setIconClass(tmpImgName);    				
    			}else{    			
    				this.setIconClass(this.FILTERBAR_ACTIONS[ this.actionConf.type ].images[ "active"]);
    			}
    			this.isActive = true;
    			this.setTooltip(this.actionConf.tooltipInactive);
    		}else{      
    			if (this.actionConf.imgSrcInactive !== undefined){
    				var tmpImgName = this.actionConf.imgSrcInactive.substr(0,this.actionConf.imgSrcInactive.indexOf(".") );
    				if (Ext.util.CSS.getRule('.' + tmpImgName) == null){
    					Ext.util.CSS.createStyleSheet('.'+tmpImgName+' { background-image: url(../img/'+this.actionConf.imgSrcInactive+') !important; }');
    				}
    				this.setIconClass(tmpImgName);
    			}else{  
    				this.setIconClass(this.FILTERBAR_ACTIONS[ this.actionConf.type ].images["inactive"]); 
    			} 
    			this.isActive = false;
	    		this.setTooltip(this.actionConf.tooltipActive);    			
    	    }
    	}else {
	    	//if the checkColumn is undefined gets the srcActive image (for default)
	    	if (this.actionConf.imgSrcActive !== undefined){
				//creates css dynamically if it's an extra-icon
				var tmpImgName = this.actionConf.imgSrcActive.substr(0,this.actionConf.imgSrcActive.indexOf(".") );
				if (Ext.util.CSS.getRule('.' + tmpImgName) == null){
					Ext.util.CSS.createStyleSheet('.'+tmpImgName+' { background-image: url(../img/'+this.actionConf.imgSrcActive+') !important; }');
				}
				this.setIconClass(tmpImgName);    		
			}else{    			
				this.setIconClass(this.FILTERBAR_ACTIONS[ this.actionConf.type ].images[ "active"]);
			}
			this.isActive = true;
			this.setTooltip(this.actionConf.tooltipInactive);
    	}
    }
  
    //updates checkColumn value in each store's row
    , setCheckValue: function(columnAlias, value, disableCheck){
    	var tb = this.ownerCt;
		var gridConsole = tb.ownerCt;
		if (gridConsole.selectedRowsId == null)  gridConsole.selectedRowsId = [];
		
		if (this.actionConf.hideSelectedRow !== undefined && this.actionConf.hideSelectedRow == true &&
				gridConsole.hideSelectedRow == null) {
			gridConsole.hideSelectedRow = [];
		}
		var s = gridConsole.store;
    	for (var i=0, l= s.getCount(); i < l; i++){
    		var record = s.getAt(i); 
            var valueID = record.get(s.getFieldNameByAlias(this.columnID));
            /*    var posValue = tb.getPositionEl(valueID, gridConsole.selectedRowsId);
           if (posValue !== -1){
            	delete gridConsole.selectedRowsId[posValue];
            	gridConsole.hideSelectedRow.push(valueID);
            }
            */
            if (disableCheck){     
            	var posHideValue = tb.getPositionEl(valueID, gridConsole.hideSelectedRow);
        		if  (posHideValue !== -1){
        			gridConsole.isDisable = true; //to hide the checkbox
        			gridConsole.isDirty = false;        			
        		}else{        		
        			//gridConsole.selectedRowsId = [];
        			gridConsole.isDisable = false;
        			gridConsole.isDirty = true;	 //to clean the checkbox
        		}
        	}             
            record.set (s.getFieldNameByAlias(columnAlias), value );
        } 
    	if (value === this.ACTIVE_VALUE){
    		if (this.actionConf.imgSrcInactive !== undefined){
				//creates css dynamically if it's an extra-icon
				var tmpImgName = this.actionConf.imgSrcInactive.substr(0,this.actionConf.imgSrcInactive.indexOf(".") );
				if (Ext.util.CSS.getRule('.' + tmpImgName) == null){
					Ext.util.CSS.createStyleSheet('.'+tmpImgName+' { background-image: url(../img/'+this.actionConf.imgSrcInactive+') !important; }');
				}
				this.setIconClass(tmpImgName);    				
			}else{    			
				this.setIconClass(this.FILTERBAR_ACTIONS[ this.actionConf.type ].images[ "inactive"]);
			}
    		this.isActive = false;
    	}else{
    		if (this.actionConf.imgSrcActive !== undefined){
				var tmpImgName = this.actionConf.imgSrcActive.substr(0,this.actionConf.imgSrcActive.indexOf(".") );
				if (Ext.util.CSS.getRule('.' + tmpImgName) == null){
					Ext.util.CSS.createStyleSheet('.'+tmpImgName+' { background-image: url(../img/'+this.actionConf.imgSrcActive+') !important; }');
				}
				this.setIconClass(tmpImgName);
			}else{  
				this.setIconClass(this.FILTERBAR_ACTIONS[ this.actionConf.type ].images["active"]); 
			} 
    		this.isActive = true;
    	}
    }

    , execRealAction: function(){    	
    	checkCol = this.actionConf.checkColumn;
    	
    	if (this.actionConf.type === 'selectRow' || this.actionConf.type === 'unselectRow' || 
    		this.actionConf.type === 'invertSelectionRow'){
    		this.fireEvent('toggleIcons', this, null);
    		return;
    	}else if (this.actionConf.type === 'monitor' || this.actionConf.type === 'monitor_inactive'){     		    	
    		this.store.filterPlugin.removeFilter(this.store.getFieldNameByAlias(this.actionConf.checkColumn));
    		var newFilter = new Array();
    		newFilter.push((this.actionConf.type === 'monitor') ? this.ACTIVE_VALUE : this.INACTIVE_VALUE);    	
    		this.store.filterPlugin.addFilter(this.store.getFieldNameByAlias(this.actionConf.checkColumn), newFilter);    		
    		this.store.filterPlugin.applyFilters();	   
    		this.hideMask();
    		return;
    	}else if (this.actionConf.type === 'refresh'){    	
    		if(this.store.pagingParams && this.store.pagingParams.paginator) {
    			if(this.store.lastParams) {
    				delete this.store.lastParams;
    			}
    			var paginator = this.store.pagingParams.paginator;
    			paginator.doLoad(paginator.cursor); 
    		} else {
    			this.store.loadStore();    
    		}
    		var tb = this.ownerCt;
    		tb.ownerCt.selectedRowsId = [];
    		tb.ownerCt.hideSelectedRow = [];
    		tb.ownerCt.isDisable = false;
    		tb.ownerCt.isDirty = true;
    		this.hideMask();
    		return;
    	} else if (this.actionConf.type === 'errors' || this.actionConf.type === 'errors_inactive'){  
    		if (this.isActive !== undefined && this.isActive == true){
    			flgCheck = this.ACTIVE_VALUE;
    		}else if (this.isActive !== undefined && this.isActive == false){
    			flgCheck = this.INACTIVE_VALUE;
    		}else{
    			flgCheck = (this.iconCls === 'errors')? this.ACTIVE_VALUE: this.INACTIVE_VALUE; 
    		}    		   		    	
    	} else if (this.actionConf.type === 'alarms' || this.actionConf.type === 'alarms_inactive'){   
    		if (this.isActive !== undefined && this.isActive == true){
    			flgCheck = this.ACTIVE_VALUE;
    		}else if (this.isActive !== undefined && this.isActive == false){
    			flgCheck = this.INACTIVE_VALUE;
    		}else{
    			flgCheck = (this.iconCls === 'alarms')? this.ACTIVE_VALUE: this.INACTIVE_VALUE;    		
    		}    		
    	} else if (this.actionConf.type === 'views' || this.actionConf.type === 'views_inactive'){     
    		if (this.isActive !== undefined && this.isActive == true){
    			flgCheck = this.ACTIVE_VALUE;
    		}else if (this.isActive !== undefined && this.isActive == false){
    			flgCheck = this.INACTIVE_VALUE;
    		}else{
    			flgCheck = (this.iconCls === 'views')? this.ACTIVE_VALUE: this.INACTIVE_VALUE;
    		}
    	}
    	
    	//if in configuration is set that the action is usable only once, it doesn't change the check if it's yet checked
        if(flgCheck != null  && flgCheck === this.INACTIVE_VALUE &&
        		this.actionConf.singleExecution !== undefined && this.actionConf.singleExecution == true){
        	this.hideMask();
        	return;            	
        }
        
        this.executionContext[checkCol] = flgCheck;
		
		var params = this.resolveParameters(this.actionConf.config, this.executionContext);		
		params = Ext.apply(params, {
				message: this.actionConf.type, 
				userId: Sbi.user.userId 
			}); 
		
		this.showMask();		
		Ext.Ajax.request({
		url: this.services[this.actionConf.type]	       
       	, params: params 			       
    	, success: function(response, options) {
    		if(response !== undefined && response.responseText !== undefined) {
					var content = Ext.util.JSON.decode( response.responseText );
					if (content !== undefined) {				      			  
					//	alert(content.toSource());
					}	
					//if by configuration is required a refresh of the dataset, it executes the store's load method,
					//otherwise it changes the icons by the toggle (default)
					this.hideMask();					
					this.updateHideSelectedRowList();
					if (this.refreshDataAfterAction !== undefined && this.refreshDataAfterAction === true ){
						var tb = this.ownerCt;
			    		tb.ownerCt.selectedRowsId = [];
			    		tb.ownerCt.isDisable = false;
			    		tb.ownerCt.isDirty = true;
						this.store.loadStore();
					} else {
						//fire events to toggle all icons of the same type
						this.setCheckValue(this.actionConf.checkColumn, flgCheck, true);    
						this.fireEvent('toggleIcons', this, flgCheck);
					}
			} else {
				this.hideMask();
				Sbi.Msg.showError('Server response is empty', 'Service Error');
			}
    	}
    	, failure: function (response, options){
    		this.hideMask();
    		Sbi.exception.ExceptionHandler.onServiceRequestFailure(response, options);
    	}
    	, scope: this     
	    });  
		
		//this.hideMask.defer(2000, this);
		
    }
    
    , updateHideSelectedRowList: function(){
    	var tb = this.ownerCt;
		var gridConsole = tb.ownerCt;
		var addHide = false;
		if (this.actionConf.hideSelectedRow !== undefined && this.actionConf.hideSelectedRow == true){
			addHide = true;
		}
		if (addHide && gridConsole.hideSelectedRow == null) {			
			gridConsole.hideSelectedRow = [];
		}
		for (var i=0, l=gridConsole.selectedRowsId.length; i<l; i++){
			var valueID = gridConsole.selectedRowsId[i];
			var posHideValue = tb.getPositionEl(valueID, gridConsole.hideSelectedRow);
			delete gridConsole.selectedRowsId[i];
			if (posHideValue == -1 && addHide){	        	
	        	gridConsole.hideSelectedRow.push(valueID);
	        }
		}
		
    }
    
    /**
	 * Opens the loading mask 
	 */
    , showMask : function(){
    	this.un('afterlayout',this.showMask,this);
    	if (this.loadMask == null) {        		    	    		
    		this.loadMask = new Ext.LoadMask(Ext.getBody(), {msg: "Loading.."});
    	}
    	if (this.loadMask){
    		this.loadMask.show();
    	}
    }

	/**
	 * Closes the loading mask
	*/
	, hideMask: function() {
    	if (this.loadMask && this.loadMask != null) {	
    		this.loadMask.hide();
    	}
	} 
	
});
    
/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  * - Antonella Giachino (antonella.giachino@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.FilteringToolbar = function(config) {

	var defaultSettings = {
	    autoWidth: true
	  , width:'100%'
	  , filters: {}
	};
		
	if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.filteringToolbar) {
		defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.filteringToolbar);
	}

	
	var c = Ext.apply(defaultSettings, config || {});
	Ext.apply(this, c);
	
	this.services = this.services || new Array();	
	this.services['createexportfile'] = this.services['createexportfile'] || Sbi.config.serviceRegistry.getServiceUrl({
		serviceName: 'CREATE_EXPORT_FILE_ACTION'
		, baseParams: new Object()
	});
	this.services['getexportfile'] = this.services['getexportfile'] || Sbi.config.serviceRegistry.getServiceUrl({
		serviceName: 'GET_TEMPORARY_FILE_ACTION'
		, baseParams: new Object()
	});
	// constructor
	Sbi.console.FilteringToolbar.superclass.constructor.call(this, c);
	
	this.addEvents('beforefilterselect');

};

Ext.extend(Sbi.console.FilteringToolbar, Ext.Toolbar, {
    
	services: null
	, store: null
	, filterStores: null	
	, cbFilters: null
	, buttons: []


	
	// -- public methods -----------------------------------------------------------------
    
    
	// -- private methods ---------------------------------------------------------------
	, onRender : function(ct, position) { 
		Sbi.console.FilteringToolbar.superclass.onRender.call(this, ct, position);		     
	}

	//adds action buttons
	, addActionButtons: function(){
  	    var b;
  	    var conf = {}; 
        conf.executionContext = this.filterBar.executionContext;
        var exportName = this.filterBar.exportName;
        conf.store = this.store;
        conf.refreshDataAfterAction = this.filterBar.refreshDataAfterAction;
		this.addFill();
		if (this.filterBar.actions){
      		for(var i=0; i < this.filterBar.actions.length; i++){
      		   if (this.filterBar.actions[i].type == undefined) this.filterBar.actions[i].type = this.filterBar.actions[i].name;
      		   conf.actionConf = this.filterBar.actions[i];
      		   conf.actionConf.tooltip = Sbi.locale.getLNValue(conf.actionConf.tooltip);
      		   conf.actionConf.tooltipInactive = Sbi.locale.getLNValue(conf.actionConf.tooltipInactive);
      		   conf.actionConf.tooltipActive = Sbi.locale.getLNValue(conf.actionConf.tooltipActive);
      		   conf.actionConf.msgConfirm = Sbi.locale.getLNValue(conf.actionConf.msgConfirm);
    		   b = new Sbi.console.ActionButton(conf);
    		   b.on('toggleIcons', this.onToggleIcons, this);
        	   this.addButton(b);	
        	   this.buttons.push(b);        	  
        	}	
        }
		//adds export button
		var menuItems = new Array();
		var types = new Array();		
		types.push('XLS');
		types.push('CSV');
		//types.push('PDF'); //to be implemented
		var menuBtn = null;
		if(types.length != 1){
			for(k=0; k< types.length; k++){
				var type = types[k];							
				var iconname = 'icon-'+type.toLowerCase();
				
				var itemExp = new Ext.menu.Item({
		            text: type
		            , group: 'group_2'
		            , iconCls: iconname 
					, width: 15
					, scope:this
					, docType : type
					, href: ''
					, exportName: exportName
		        });
				itemExp.addListener('click', this.exportConsole, this, type);
				menuItems.push(itemExp); 
		 
			}
			var menu0 = new Ext.menu.Menu({
				id: 'basicMenu_0',
				items: menuItems    
				});	
			
			menuBtn = new Ext.Toolbar.Button({
				tooltip: 'Exporters'
				, path: 'Exporters'	
				, iconCls: 'icon-export' 	
	            , menu: menu0
	            , width: 15
	            , cls: 'x-btn-menubutton x-btn-text-icon bmenu '
	        });

		}else{
			var type = types[0];	
			var iconname = 'icon-'+type.toLowerCase();
			menuBtn = new Ext.Toolbar.Button({
                text: type
                , group: 'group_2'
                , iconCls: iconname 
		     	, scope: this
				, width: 15
				, href: ''
				, docType : type
			});			
			menuBtn.addListener('click', this.exportConsole, this, type);
		}
 	    this.addButton(menuBtn);
	}
	, exportConsole: function(item) {
		var format = item.docType;
		var exportName= item.exportName;
	
		var gridConsole = this.ownerCt;
		var columnConfigs = gridConsole.columnConfig;
		
		//gets colModel to retrieve order
		var colModArray = gridConsole.colModel.fields;
		
		//gets store reader metadata to retrieve dataIndex
		var storeMetaArray = gridConsole.store.reader.meta.fields;

		//different dataset to export
		var dsExport;
		var metaCols = new Array();
		if (gridConsole.datasetExport != null){
			dsExport = gridConsole.datasetExport.datasetExp || "";
			var exportColumnConfig = gridConsole.datasetExport.columnConfig;
			
			for(p in exportColumnConfig) {
				var column = {};
				column[p] = exportColumnConfig[p];
				metaCols.push(column);    
			}
		}
		
		var dsHeadersLabel = (gridConsole.storeLabels !== undefined && gridConsole.storeLabels !== null)? gridConsole.storeLabels.dsLabel : "";
		
		//var meta = this.orderMetaColumns(colModArray, storeMetaArray , columnConfigs);
		var meta = new Array();
		for(p in columnConfigs) {
			var column = {};
			column[p] = columnConfigs[p];
			meta.push(column);    
		}
		
		
		if (gridConsole.datasetExport != null){
			dsExport = gridConsole.datasetExport.datasetExp || "";
			var exportColumnConfig = gridConsole.datasetExport.columnConfig;
			
			for(p in exportColumnConfig) {
				var column = {};
				column[p] = exportColumnConfig[p];
				metaCols.push(column);    
			}
		}
		var output = 'application/vnd.ms-excel';
		if(format == 'PDF'){
			output = 'application/pdf';
		}
		if(format == 'CSV'){
			output = 'text/csv';
		}
		if(exportName == undefined){
			exportName ='';
		}
		//check if specific datasource for export is definied
		var params = null;
		if (gridConsole.datasetExport != null){
			params = {
					mimeType: output
					//, responseType: 'attachment'
					, datasetLabel: dsExport
					, datasetHeadersLabel: dsHeadersLabel
					, meta: Ext.util.JSON.encode(metaCols)
					, exportName: exportName
				};
		}
		else {
			params = {
					mimeType: output
					//, responseType: 'attachment'
					, datasetLabel: gridConsole.store.dsLabel
					, datasetHeadersLabel: dsHeadersLabel
					, meta: Ext.util.JSON.encode(meta)
					, exportName: exportName
				};
		}
		
		this.ownerCt.stopLoading();
		this.ownerCt.showMask();
		
  		Ext.Ajax.request({
	       	url: this.services['createexportfile']			       
	       	, params: params 			       
	    	, success: this.onExportFileSuccess
	    	, failure: this.onExportFileFailure
	    	, scope: this     
	    });
		
	}
	
	,
	onExportFileSuccess : function (response, options) {
		this.ownerCt.hideMask();
		this.ownerCt.restartLoading();
		if (response !== undefined && response.responseText !== undefined) {
			var responseJson = Ext.util.JSON.decode( response.responseText );
			Sbi.Sync.request({
				url : this.services['getexportfile']
				, params : {
					name : responseJson.name
					, extension : responseJson.extension
				}
			});
		} else {
			Sbi.Msg.showError('Server response is empty', 'Service Error');
		}
	}
	
	,
	onExportFileFailure : function (response, options) {
		this.ownerCt.hideMask();
		this.ownerCt.restartLoading();
		Sbi.exception.ExceptionHandler.onServiceRequestFailure(response, options);
	}
	
	
	, orderMetaColumns : function(colModArray, storeMetaArray, columnConfig){
		var result = new Array();
		if(colModArray != null && colModArray !== undefined){
			for(i=0; i<colModArray.length; i++){
				var colItem = colModArray[i];
				if(colItem !== undefined && colItem.dataIndex !== ''){
					var header = colItem.header;
					for(j=0; j<storeMetaArray.length; j++){
						var storeItem = storeMetaArray[j];
						if(storeItem !== undefined && (colItem.dataIndex == storeItem.dataIndex)){
							var colName= storeItem.header;
							var metaObj = {};
							metaObj[colName] = columnConfig[colName];

							result.push(metaObj);
							break;
						}
					}
				}
			}
		}
		return result;
	}
	 //defines fields depending from operator type
	 , createFilterField: function(operator, header, dataIndex){
		   if (operator === 'EQUALS_TO') {
			   //single value
			   this.filterStores = this.filterStores || {}; 
			   this.cbFilters = this.cbFilters || {};
			   var s = new Ext.data.JsonStore({
				   fields:['name', 'value', 'description'],
		           data: []
			   });
			   this.filterStores[dataIndex] = s;
			 
			   //this.store.on('load', this.reloadFilterStore.createDelegate(this, [dataIndex]), this);
		     
			   var combDefaultConfig = {
					   width: 130,
				       displayField:'name',
				       valueField:'value',
				       typeAhead: true,
				       triggerAction: 'all',
				       emptyText:'...',
				       //selectOnFocus:true,
				       selectOnFocus:false,
				       validateOnBlur: false,
				       mode: 'local'
			   };
			   
			   
			   var cb = new Ext.form.ComboBox(
			       Ext.apply(combDefaultConfig, {
			    	   store: s,
				       index: dataIndex,
				       listeners: {
						   'select': {
						   		fn: function(combo, record, index) {
									var field = combo.index;
									var exp = record.get(combo.valueField);									
									this.onFilterSelect(field, exp);	
								},
								scope: this
							}
					   }
			       	})
			   );	

			   this.addText("    " + header + "  ");
			   this.addField(cb);	
			   //adds the combo field to a temporary array to manage the workaround on the opening on each refresh
			   this.cbFilters[dataIndex] = cb;
			   
	     }else if (operator === 'IN') {
	    	 //multivalue
	    	 this.filterStores = this.filterStores || {};	    	 
	    	 var smLookup = new Ext.grid.CheckboxSelectionModel( {singleSelect: false } );
	    	 var cmLookup =  new Ext.grid.ColumnModel([
		    	                                          new Ext.grid.RowNumberer(),		    	                                          
						                    		      {header: "Data", dataIndex: 'value', width: 75},
						                    		      smLookup
						                    		    ]);
	    	 var baseConfig = {
	    			     width: 130
				       , name : dataIndex
				       , emptyText:'...'
					   , allowBlank: true
					   , cm: cmLookup
					   , sm: smLookup
					};
	    	
	    	 var s = new Ext.ux.data.PagingJsonStore({	  
	    	//var s = new Ext.ux.data.PagingStore({	   
				   fields:['name', 'value', 'description'],
		           data: [],
		           lastOptions: {params: {start: 0, limit: 20}}
			   });
	    	
			 this.filterStores[dataIndex] = s;
			
	    	 var lk = new Sbi.console.LookupField(Ext.apply(baseConfig, {
				  	  store: s
					, params: {}
					, singleSelect: false
					, displayField: 'value'
					, valueField: 'value'
					, listeners: {
							   'select': {
							   		fn: function(values) {							   			
							   			var exp =  new Array();
										var field = dataIndex;
										
										for(var val in values){ 
											if (val !== '...'){
												exp.push(val);
											}else{
												exp =  new Array();
											}
										}										
										this.onFilterSelect(field, exp);	  
									},
									scope: this
								}				     					
						   }
			}));
	    	 
	    	this.addText("    " + header + "  ");
			this.addField(lk);	
			
	     }else {
	    	 Sbi.Msg.showWarning('Filter operator type [' + operator + '] not supported');
	     }
	  
	 }
	   
	 , reloadFilterStores: function() {
		for(var fs in this.filterStores) {
			this.reloadFilterStore(fs);
		}
		this.store.filterPlugin.applyFilters();
	}
	    
	 , reloadFilterStore: function(dataIdx) {
		 var distinctValues; 
		 var data;
      
		 var s = this.filterStores[dataIdx];
		
		 if(!s) {
		   Sbi.msg.showError('Impossible to refresh filter associated to column [' + dataIdx + ']');
		   return;
		 }
		 
		 this.store.clearFilter( true );
	   
		 distinctValues = this.store.collect(dataIdx, true, true);
		 data = [];
	   
		 //define the empty (for reset) element
	   	 var firstRow = {
	        name: '...'
		  , value: '...'
		  , description: ''
	   	 };
	    	data.push(firstRow);
      
	     for(var i = 0, l = distinctValues.length; i < l; i++) {
		   var row = {
			  name: distinctValues[i]
		    , value: distinctValues[i]
		    , description: distinctValues[i]
		   };
		   data.push(row);
	   	 }

	   	 // replace previous records with the new one
	   	 s.loadData(data, false);	   	 
	   	 
	   	 //WORKAROUND: when the user selects an item from the combo and stay on it, this combo is opened on each refresh.
	   	 //This workaround force the closure of the combo.
	   	 if (this.cbFilters !== null && this.cbFilters !== undefined){
		   	 var cb = this.cbFilters[dataIdx];
		   	 if (cb){
		   		 cb.collapse();
		   	 }
	   	 }
	}
   
	 //adds the single filter or delete if it's the reset field
	 , onFilterSelect: function(f, exp) { 
		 if(this.fireEvent('beforefilterselect', this, f, exp) !== false){	
			 if (exp === '...' || exp.length == 0){
				   this.store.filterPlugin.removeFilter(f);
			 }else{
			   if (!Ext.isArray(exp)){
				   var arExp =  new Array();
				   arExp.push(exp);
				   exp = arExp;
			   }
			   this.store.filterPlugin.addFilter(f, exp );
			 }
			 this.store.filterPlugin.applyFilters();
		 }
	 }
	 
	 , onToggleIcons: function(action, flgCheck){
		 var gridConsole = this.ownerCt;
		 var s = gridConsole.store;
		 var isDirty = false;			 
		 if (gridConsole.selectedRowsId == null) gridConsole.selectedRowsId = [];	
		 
		 if (action.actionConf.type == 'selectRow' || action.actionConf.type == 'unselectRow' || 
			 action.actionConf.type == 'invertSelectionRow' ){			 		 			
			 for(var i=0; i< s.getCount(); i++){
				 var record = s.getAt(i);
				 var value = record.get(s.getFieldNameByAlias(action.actionConf.columnID));
				 var isVisible = record.get(s.getFieldNameByAlias(action.actionConf.flagColumn));
				 var posValue = this.getPositionEl(value, gridConsole.selectedRowsId);
				 if (action.actionConf.type == 'selectRow'  && (isVisible == 1 || isVisible == 'true')){
					 if (posValue == -1){
						 isDirty = true;
						 gridConsole.selectedRowsId.push(value);
					 }
				 }else if (action.actionConf.type == 'unselectRow'){
					 if (posValue != -1){
						 isDirty = true;
						 delete gridConsole.selectedRowsId[posValue];
					 }
				 }else if (action.actionConf.type == 'invertSelectionRow' && (isVisible == 1 || isVisible == 'true')){
					 isDirty = true;
					 if ( posValue == -1){						 
						 gridConsole.selectedRowsId.push(value);						
					 }else{
						 delete gridConsole.selectedRowsId[posValue];
					 }		
				 }
				 
				 if (isDirty){
					 //update the check (fisical field to force a refresh of rendering)
					 gridConsole.isDirty = isDirty;
					 var newValue = (isVisible === 1 || isVisible === '1' ) ? 'true' : '1';
					 record.set (s.getFieldNameByAlias(action.actionConf.flagColumn), newValue );
					 isDirty = false;
				 }				
			 }			 
			 return;
		 }
		 
		//toggles all icons of the same family
		 for (var i=0, l= this.buttons.length; i<l; i++ ){
			var cleanCheckBox = false;
			var btn = this.buttons[i];
			if (btn.actionConf.type == action.actionConf.type && btn.actionConf.name !== action.actionConf.name){
				btn.setCheckValue(btn.actionConf.checkColumn, flgCheck, false);   
			}			
		}
		
    }
	 
   , getPositionEl: function(value, lst) {	    	
			//check if the row is in the listRowsSelected (pagination management)
	    	//returns the position element into the array 
	    	var toReturn = -1;    	
	    	
	    	if (lst == null) return toReturn;
	        
	    	for(var i=0; i<lst.length; i++) {
	    		if (lst[i] == value ){
	    			toReturn = i;
	    			break;
	    		}   		
	    	}
	    	return toReturn;	
	}
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Antonella Giachino (antonella.giachino@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.CustomFilteringToolbar = function(config) {

		var defaultSettings = {
		    showIfEmpty: true
		    //, emptyMsg: 'No filters'
		    , tbInizialzed: false
		};
		
		
		
		if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.customFilteringToolbar) {
			defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.customFilteringToolbar);
		}
		
		var c = Ext.apply(defaultSettings, config || {});
		Ext.apply(this, c);
		
		if(this.showIfEmpty === true) {
			c = Ext.apply(c, {
				items: [{
					xtype: 'tbtext',
		            text: this.emptyMsg
				}]
			});
		}
		
		// constructor
		Sbi.console.CustomFilteringToolbar.superclass.constructor.call(this, c);
		
		//adds events		
		if (this.store !== undefined){
			this.store.on('metachange', this.onMetaChange, this);
		}
};

Ext.extend(Sbi.console.CustomFilteringToolbar, Sbi.console.FilteringToolbar, {  
    
	services: null
   // , customFilterBar: null
    , tbInizialzed: null
    
    // automatic: all dataset fields are added as filter
    , AUTOMATIC_FILTERBAR: 'automatic'
    	//custom: only configurated fields are added as filter  
    , CUSTOM_FILTERBAR: 'custom'
    
    // -- public methods ---------------------------------------------------------------
      
    
    
    // -- private methods ---------------------------------------------------------------
   
    , onRender : function(ct, position) {
		Sbi.console.CustomFilteringToolbar.superclass.onRender.call(this, ct, position);
    }
    
    , onMetaChange: function( store, meta ) {
    	var i;
    	if(this.tbInizialzed === false) {
	    	if (this.filterBar.type ===  this.AUTOMATIC_FILTERBAR){
	    	   for(i = 0; i < meta.fields.length; i++) { 		  
	    		   if (meta.fields[i].header && meta.fields[i].header !== ''){   
	    			   this.createFilterField(this.filterBar.defaults.operator,  meta.fields[i].header, store.getFieldNameByAlias(meta.fields[i].header));
	    		   }
	    	   } 
	    		this.store.on('load', this.reloadFilterStores, this);
	      	} else if(this.filterBar.type === this.CUSTOM_FILTERBAR){
	        	for(i = 0; i < meta.fields.length; i++) { 		           
	        		 if (meta.fields[i].header &&  meta.fields[i].header !== '' && this.isConfiguratedFilter(meta.fields[i].header)){         		     	
	                  this.createFilterField(this.getFilterOperator(meta.fields[i].header), this.getColumnText(meta.fields[i].header),  store.getFieldNameByAlias(meta.fields[i].header));  	                  
	            	}        		  
	        	} 
	        	this.store.on('load', this.reloadFilterStores, this);
	      	} else {
	      		Sbi.Msg.showError('Toolbar type [' + this.filterBar.type + '] is not supported');
	      	}	

			this.addActionButtons();    					
			
	       	this.doLayout();
       	
	       	this.tbInizialzed = true;
    	}
    }
	
    //returns true if the input field is a filter defined into template, false otherwise.
    , isConfiguratedFilter: function (field){   
          if (this.filterBar.filters){    
            for(var i=0, l=this.filterBar.filters.length; i<l; i++) {              
              if (field === this.filterBar.filters[i].column)
                return true;
        		}
        	}
          return false;
    }
    
    , getColumnText: function (columnName){  
        if (this.filterBar.filters){       
          for(var i=0, l=this.filterBar.filters.length; i<l; i++) {              
            if (columnName === this.filterBar.filters[i].column)
              return this.filterBar.filters[i].text;
      		}
      	}
        return columnName;
    }
   
    , getFilterOperator: function (columnName){         
      	for(var i=0, l=this.filterBar.filters.length; i<l; i++) {              
            if (columnName === this.filterBar.filters[i].column)
              return this.filterBar.filters[i].operator;
  		}
      	return null;
    }
    
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
 
 
 

/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.LookupField = function(config) {
	
	Ext.apply(this, config);
	
	this.store = config.store;
	if(config.cm){
	    this.cm = config.cm;
    }
	
	if(config.sm){
	    this.sm = config.sm;
    }
	
	if(config.valueField){
	    this.valueFieldName = config.valueField;
    }
	
	if(config.descField && config.descField !== ''){
	    this.displayFieldName = config.descField;
    }else{
    	 this.displayFieldName = config.valueField || '';
    }
	
	//displayField and valueField are yet setted only with the filtering management
	if(config.displayField && config.displayField !== ''){
    	 this.displayField = config.displayField || '';
    }
	
	if(config.valueField && config.valueField !== ''){
   	 this.valueField = config.valueField || '';
   }
	
	if(config.loadStore){
	    this.loadStore = config.loadStore;
    }
	
	this.store.on('metachange', function( store, meta ) {
		this.updateMeta( meta );
	}, this);
	this.store.on('load', function( store, records, options  ) {
		this.applySelection();		
	}, this);
		
	if(config.drawFilterToolbar!=null && config.drawFilterToolbar!=undefined && config.drawFilterToolbar==false){
		this.drawFilterToolbar = false;
	}else{
		this.drawFilterToolbar = true;
	}
	this.drawFilterToolbar = config.drawFilterToolbar;
	this.store.baseParams  = config.params;
	this.params = config.params;
	this.initWin();
	
	var c = Ext.apply({}, config, {
		triggerClass: 'x-form-search-trigger'
		, enableKeyEvents: true
		,  width: 150
	});   
	
	// constructor
	Sbi.console.LookupField.superclass.constructor.call(this, c);
	
	
	this.on("render", function(field) {
		field.trigger.on("click", function(e) {
			this.onLookUp(); 
		}, this);
	}, this);
	
	this.on("render", function(field) {
		field.el.on("keyup", function(e) {
			this.xdirty = true;
		}, this);
	}, this);
	

};

Ext.extend(Sbi.console.LookupField, Ext.form.TriggerField, {
    
	// ----------------------------------------------------------------------------------------
	// members
	// ----------------------------------------------------------------------------------------
    
	// STATE MEMBERS
	  valueField: null
	, valueFieldName: null
	, displayField: null
	, displayFieldName: null
	, columnField: null
    
    , drawFilterToolbar: null
    
    // oggetto (value: description, *)
    , xvalue: null
    // oggetto (value: description, *)
    , xselection: {} //null
    , xdirty: false
    , xTempValue: null
    , singleSelect: true
    
    , paging: true
    , start: 0 
    , limit: 20
    , loadStore: null
    
	// SUB-COMPONENTS MEMBERS
	, store: null
	, sm: null
	, cm: null
    , grid: null
    , win: null
    
       
   
    // ----------------------------------------------------------------------------------------
    // public methods
	// ----------------------------------------------------------------------------------------
    
    
    , getValue : function(){
		this.clean();
		var v = [];
		this.xvalue = this.xvalue || {};
	
		for(p in this.xvalue) {
			v.push(p);
		}
			
		if(this.singleSelect === true) {
			v = (v.length > 0)? v[0] : '';
		}
		return v;
	}

	/**
	 * v: 
	 *  - object -> multivalue with values/descriptions
	 *  - array -> multivalue with only values
	 *  - string -> single value
	 */
	, setValue : function(v){	 
		if(typeof v === 'object') {
			this.xvalue = {};
			
			if(v instanceof Array) {
				var t = {};
				for(var i = 0; i < v.length; i++) {
					t[ v[i] ] = v[i];
				}
				v = t;
			}
			Ext.apply(this.xvalue, v);
			var displayText = '';
			for(p in this.xvalue) {
				displayText += this.xvalue[p] + ';';
			}	
			if(this.singleSelect === true) {
				displayText = displayText.substr(0, displayText.length-1);
			}
			Sbi.console.LookupField.superclass.setValue.call(this, displayText);
		} else {
			this.xvalue = {};
			this.xvalue[v] = v;
			Sbi.console.LookupField.superclass.setValue.call(this, v);
		}
	}
	
	
    
    // private methods
    , initWin: function() {
    	if(!this.cm){
			this.cm = new Ext.grid.ColumnModel([
			   new Ext.grid.RowNumberer(),
		       {
		       	  header: "Data",
		          dataIndex: 'data',
		          width: 75
		       }
		    ]);
    	}
		
		var pagingBar = new Ext.PagingToolbar({
	        pageSize: this.limit,
	        store: this.store,
	        displayInfo: true,
	        displayMsg: '', //'Displaying topics {0} - {1} of {2}',
	        emptyMsg: "No topics to display",
	        
	        items:[
	               '->'
	               , {
	            	   text: LN('sbi.console.promptables.lookup.Annulla')
	            	   , listeners: {
		           			'click': {
		                  		fn: this.onCancel,
		                  		scope: this
		                	} 
	               		}
	               } , {
	            	   text: LN('sbi.console.promptables.lookup.Confirm')
	            	   , listeners: {
		           			'click': {
		                  		fn: this.onOk,
		                  		scope: this
		                	} 
	               		}
	               }
	        ]
	    });
		
		if(this.drawFilterToolbar){
			this.filteringToolbar = new Sbi.console.FilteringToolbar({store: this.store});
		}
		if (!this.sm){
			this.sm = new Ext.grid.CheckboxSelectionModel( {singleSelect: this.singleSelect } );
    	}
		this.sm.on('rowselect', this.onSelect, this);
		this.sm.on('rowdeselect', this.onDeselect, this);

		if(this.drawFilterToolbar){
			this.gridLookup = new Ext.grid.GridPanel({
				store: this.store
	   	     	, cm: this.cm
	   	     	, sm: this.sm
	   	     	, frame: false
	   	     	, border:false  
	   	     	, collapsible:false
	   	     	, loadMask: true
	   	     	, viewConfig: {
	   	        	forceFit:true
	   	        	, enableRowBody:true
	   	        	, showPreview:true
	   	     	}	
				, tbar: this.filteringToolbar
		        , bbar: pagingBar
			});
		}else{
			this.gridLookup = new Ext.grid.GridPanel({
				store: this.store
	   	     	, cm: this.cm
	   	     	, sm: this.sm
	   	     	, frame: false
	   	     	, border:false  
	   	     	, collapsible:false
	   	     	, loadMask: true
	   	     	, viewConfig: {
	   	        	forceFit:true
	   	        	, enableRowBody:true
	   	        	, showPreview:true
	   	     	}	
		        , bbar: pagingBar
			});
		}
		
		this.win = new Ext.Window({
			title: LN('sbi.console.promptables.lookup.Select') ,   
            layout      : 'fit',
            width       : 580,
            height      : 300,
            closeAction :'hide',
            plain       : true,
            items       : [this.gridLookup]
		});
	}
    
    , updateMeta: function(meta) {
    	if(this.gridLookup){			
			meta.fields[0] = new Ext.grid.RowNumberer();
			meta.fields[ meta.fields.length ] = this.sm;
			this.gridLookup.getColumnModel().setConfig(meta.fields);
			//sets the correct displayField
			for(i = 0; i < meta.fields.length; i++) {
				if (meta.fields[i].header == this.valueFieldName){
					this.valueField = meta.fields[i].name;
					break;
				}				
			}
			for(i = 0; i < meta.fields.length; i++) {
				if (meta.fields[i].header == this.displayFieldName){
					this.displayField = meta.fields[i].name;
					break;
				}				
			}
		} else {
		   alert('ERROR: store meta changed before grid instatiation');
		}
	}
    
    , resetSelection: function() {
    	this.xselection = Ext.apply({}, this.xvalue);    
   	}
    
    , onSelect: function(sm, rowIndex, record) {
    	if(this.singleSelect === true){
    		this.xselection = {};
    	}
    	this.xselection[ record.data[this.valueField] ] = record.data[this.displayField];
    }
    
    , onDeselect: function(sm, rowIndex, record) {
    	if( this.xselection[ record.data[this.displayField]] ) {
    		delete this.xselection[ record.data[this.displayField]];
    	}else if( this.xselection[ record.data[this.valueField]] ) {
    		delete this.xselection[ record.data[this.valueField]];
    	}   	
    }
    
    , applySelection: function() {
    	//this.resetSelection();
    	
    	if(this.gridLookup) {    		    		
			var selectedRecs = [];
			this.gridLookup.getStore().each(function(rec){
		        if(this.xselection[ rec.data[this.valueField]] !== undefined){
		        	selectedRecs.push(rec);
		        }
		    }, this);
			
			if(selectedRecs.length>0){
				this.sm.selectRecords(selectedRecs);
			}
		 }		
    }
	
    , clean: function() {
    	if(this.xdirty) {
    		
	    	var text = Sbi.console.LookupField.superclass.getValue.call(this);

	    	var values = text.split(';');

	    	this.xvalue = {};
	    	if(text.trim() === '') return;
	    	var ub = (this.singleSelect === true)? 1: values.length;
	    	for(var i = 0; i < ub; i++) {
	    		this.xvalue[ '' + values[i] ] = values[i];
	    	}
	    	this.xdirty = false;
    	}
    }
    
	, onLookUp: function() {
		this.resetSelection();
		this.clean();		
		this.win.show(this);
		
		var p = Ext.apply({}, {
			start: this.start
		  , limit: this.limit
		});
		this.store.load({params: p});
	}
	
	, onOk: function() {
		this.setValue(this.xselection);
		this.fireEvent('select', this.xselection);
		this.win.hide();			
	}
	
	, onCancel: function() {			
		this.resetSelection();
		this.win.hide();		
	}
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Antonella Giachino (antonella.giachino@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.PromptablesWindow = function(config) {

	var defaultSettings = Ext.apply({}, config || {}, {
		title: 'Parameters window'
		, width: 500
		, height: 300
		, hasBuddy: false	
		, modal: true
	});

	if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.promptablesWindow) {
		defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.promptablesWindow);
	}
		
	var c = Ext.apply(defaultSettings, config || {});

	Ext.apply(this, c);
		
	this.initFormPanel();
	
	this.closeButton = new Ext.Button({
		text: LN('sbi.console.promptables.btnClose'),
		handler: function(){
        	this.destroy();
        }
        , scope: this
	});
	
	this.okButton = new Ext.Button({
		text: LN('sbi.console.promptables.btnOK'),
		handler: function(){
        	//this.hide();			
        	this.fireEvent('click', this, this.getFormState());
        	this.close();
        }
        , scope: this
	});
	
	

	c = Ext.apply(c, {  	
		layout: 'fit'
	//,	closeAction:'hide'
	,	closeAction:'close'
	,	constrain: true
	,	plain: true
	,	modal:true
	,	title: this.title
	,	buttonAlign : 'center'
	,	buttons: [this.closeButton, this.okButton]
	,	items: [this.formPanel]
	});

	// constructor
	Sbi.console.PromptablesWindow.superclass.constructor.call(this, c);
	
	this.addEvents('click');
    
};

Ext.extend(Sbi.console.PromptablesWindow, Ext.Window, {

    serviceName: null
    , formPanel: null
    
   , fieldMap: null
   , okButton: null
   , closeButton: null
   , dateFormat: null
    
    // public methods

    
    // private methods

    , initFormPanel: function() {	
		var fields = [];
		this.fieldMap = {};
		
		for(var i = 0, l = this.promptables.length; i < l; i++) { 
			var tmpLabel = null;
			var tmpName = null;
			var param = this.promptables[i]; 
			var tmpParamConfig = null;
			var tmpField = null;
			//defining label (it's variable)
			for(p in param) {    		
        		if (p !== 'values' && p !== 'scope' && p !== 'defaultValue'){
        			tmpLabel = param[p];
        			tmpName = p;
        		}
			}						
			
			tmpParamConfig = param;
			
			tmpField = this.createParameterField(tmpLabel, tmpName, tmpParamConfig);
    		fields.push(tmpField);
			this.fieldMap[tmpName] = tmpField;			
        } //for
	
    	this.formPanel = new  Ext.FormPanel({
    		  //title:  LN('sbi.console.promptables.title'),
    		  margins: '50 50 50 50',
	          labelAlign: 'left',
	          bodyStyle:'padding:5px',
	          autoScroll:true,
	          width: 850,
	          height: 600,
	          labelWidth: 150,
	          layout: 'form',
	          trackResetOnLoad: true,
	          items: fields
	      }); 
    }

	, getFormState: function() {
    	var state = {};
		var index = null;
    	for(f in this.fieldMap) {
    		//sets the default value if it's defined into the template 
    		index = f;
    		if (f.indexOf('__') >= 0){
    			index = f.substr(0, f.indexOf('__'));
    		}
    		//when the field is visible and the value is yet empty checks the default value
    		//if (this.fieldMap[f].isVisible() && state[index] === undefined || state[index] === null || state[index] === '' ){
    		if (this.fieldMap[f].isVisible() && state[index] === undefined || state[index] === null ){
    			
    			var tmpField = this.fieldMap[f];
    			var tmpFieldValue = tmpField.getValue();
    			var tmpDefaultValue = tmpField.defaultValue;    	
    			//if (tmpDefaultValue === undefined || tmpDefaultValue === null || tmpDefaultValue == '' ){
    			if (tmpDefaultValue === undefined || tmpDefaultValue === null  ){
					tmpDefaultValue = (tmpFieldValue !== null)?tmpFieldValue.defaultValue:'' ;
				} 
    			if ((tmpFieldValue === undefined || tmpFieldValue === null || tmpFieldValue == '') && 
    				 tmpDefaultValue !== undefined){
   	    			state[index] = tmpDefaultValue.trim();
   	    		}else {    		
	    			//the field is correctly valorized:
	    			if (tmpField.getXTypes().indexOf('/datefield') >= 0){
	    				//if it's a date: sets its format
	    				state[index] = Sbi.console.commons.Format.date(tmpFieldValue , this.dateFormat);
	    			}else{	
	    				//sets the current value
	    				state[index] = tmpFieldValue;
	    			}
	    		}
    		}    		
    	}
    	//alert('state: ' + state.toSource());
    	return state;
    }
    
	, createStore: function(config) {
		var store;
		var params = {};
		
		if (config.datasetLabel){
			//the store is created by the result of a dataset
			params.ds_label = config.datasetLabel;	

			var serviceConfig;
			serviceConfig = {serviceName: 'GET_CONSOLE_DATA_ACTION'};
			serviceConfig.baseParams = params;	
			
			store = new Ext.data.JsonStore({
				url: Sbi.config.serviceRegistry.getServiceUrl( serviceConfig )
			});
			
		} else if (config.data){
			//the store is created by fix values
			store = new Ext.data.SimpleStore({
	              fields: ['column_1','column_2']
	            , data: config.data
	        });
		}else{
			Sbi.Msg.showError('Store not defined for the prompt.', 'Service Error');
		}
		
		store.on('exception', Sbi.exception.ExceptionHandler.onStoreLoadException, this);
		
		return store;
		
	}
	
	, createTextField: function(label, name, param){
		var field = new Ext.form.TextField({
  		  fieldLabel: label 
  		  	  , name: name
	          , width: 250 
	          , defaultValue: param.defaultValue 
	        });
		return field;
	}
	
	, createDataField: function(label, name, param){
		this.dateFormat = param.values.format || 'd/m/Y';
		
		var field = new Ext.form.DateField({
		  fieldLabel: label || param.title
		  , name: name
          , width: 250  
          , format: param.values.format || 'd/m/Y'
          , defaultValue: param.defaultValue 
        });
		
		return field;
	}
	
	, createComboField: function(label, name, param){
		
		var tmpStore = null; 
		var tmpValueField = 'column_1';
		var tmpValueText = 'column_2';
		
		tmpStore = this.createStore(param.values);
		
		if (param.values.datasetLabel){    				
			tmpStore.load();
		}
		var field = new Ext.form.ComboBox({
		    fieldLabel: label || param.title,
		    name: name,
            width: 250,    	    
            store: tmpStore,
	        valueField: tmpValueField,	
	        displayField: tmpValueText,
	        mode : 'local',
	        typeAhead: true,
	        emptyText:'Select ...',
	        selectOnFocus:true,
	        triggerAction: 'all',
	        defaultValue: param.defaultValue 
		 });        		 
		
		return field;
	}
	
	, createCheckListField: function(label, name, param){
		var smLookup = new Ext.grid.CheckboxSelectionModel( {singleSelect: false } );
		var cmLookup =  new Ext.grid.ColumnModel([
    	                                          new Ext.grid.RowNumberer(),		    	                                          
				                    		      {header: "Data", dataIndex: 'value', width: 75},
				                    		      smLookup
				                    		    ]);
		var tmpStore = null; 
		tmpStore = this.createStore(param.values);
		
		
		tmpStore.on('beforeload', function(store, o) {
			var p = Sbi.commons.JSON.encode(this.getFormState());
			o.params.PARAMETERS = p;
			return true;
		}, this);
		
		
		var baseConfig = {
			       fieldLabel: label || param.title
				  // , name : p.id
				   , name : name
				   , width: 250
				   , sm: smLookup
				   , cm: cmLookup
				   , allowBlank: !p.mandatory
				   , valueField: (param.values.valueField)?param.values.valueField:'code'
				   , descField: (param.values.descField)?param.values.descField:''		
				   //, displayField: (param.values.descField)?param.values.valueField:'value'
				   , defaultValue: param.defaultValue
				};
		var field = new Sbi.console.LookupField(Ext.apply(baseConfig, {
			  	  store: tmpStore
				//, params: params
				, params: {}
				, singleSelect: false
				
		}));	 
		
		return field;
	}
	
	, createListField: function(label, name, param){
		var tmpStore = null; 
		tmpStore = this.createStore(param.values);
		
		tmpStore.on('beforeload', function(store, o) {
			var p = Sbi.commons.JSON.encode(this.getFormState());
			o.params.PARAMETERS = p;
			return true;
		}, this);
		
		
		var baseConfig = {
			       fieldLabel: label || param.title
				  // , name : p.id
				   , name : name
				   , width: 250
				   , allowBlank: !p.mandatory
				   , valueField: (param.values.valueField)?param.values.valueField:'code'
				   , descField: (param.values.descField)?param.values.descField:''
				   , defaultValue: param.defaultValue
				};
		
		var field = new Sbi.console.LookupField(Ext.apply(baseConfig, {
			  	  store: tmpStore
				//, params: params
			  	, params: {}
				, singleSelect: true
		})); 
		
		return field;
	}
	
	, createRadioGroupField: function(label, name, param){
		var options = [];
		var tmpParamConfig = null;
		var tmpField = null;
		
		
		for(var j = 0, l2 = param.values.options.length; j < l2; j++) {			
			tmpParamConfig = param.values.options[j];
			var idRadio =  name + '__' + j;
			
			//adds the radio as the first field			
			tmpField =  {
						 id: idRadio,
						 name: name,
		                 labelSeparator: '',
		                 boxLabel: tmpParamConfig.values.title || '',		                 
		                 inputValue: idRadio
			            };
			options.push(tmpField);
			//adds all sub parameters		
			if (tmpParamConfig.defaultValue === undefined || tmpParamConfig.defaultValue === null){
				tmpParamConfig.defaultValue =  param.defaultValue;
			}
			var tmpParam = this.createParameterField(label, idRadio, tmpParamConfig);
			tmpParam.setVisible(false) ;			
			options.push(tmpParam);			
			this.fieldMap[idRadio] = tmpParam;
			var radioField = new Ext.form.RadioGroup({			
				id: name,
				name: name,
	            fieldLabel: label,	  	            
	            width: 250, 
	            autoHeight: true,
	            autoScroll: true,
	    	    xtype: 'fieldset',
	    	    border: false,
	    	    defaultType: 'radio', // each item will be a radio button
	    	    columns: 2,
	    	    items: options,
	    	    defaultValue: param.defaultValue
	    	});

			radioField.addListener('change', this.changeRadioField , this);
			
		}

		return radioField;
	}
	, createParameterField: function (label, name, param){
		var tmpField = null;
		if (param.values === undefined || param.values.type == 'text'){        			
			//default is a textarea
			tmpField = this.createTextField(label, name, param);        		          		
		}else if (param.values.type == 'data'){  
			//data
			tmpField = this.createDataField(label, name, param);   
		}  else if (param.values.type == 'combo'){	
			//combobox     			
			tmpField = this.createComboField(label, name, param);    			    					 
		} else if (param.values.type == 'checkList'){
			//multivalue management
			tmpField = this.createCheckListField(label, name, param);    	
			
		} else if (param.values.type == 'lookup'){
			//singlevalue management
			tmpField = this.createListField(label, name, param);        			
  		} else if (param.values.type == 'group'){
			//group radio management
  			tmpField = this.createRadioGroupField(label, name, param);        			
  		}
		
		if (param.values !== undefined && param.values.defaultValue !== undefined){
			tmpField.defaultValue = param.values.defaultValue;
		}
		
		return tmpField;
	}
	
	, changeRadioField: function(radioGroup, radio){		
		
		var currentRadioId = radio.getItemId().substr(0, radio.getItemId().indexOf('__'));	
		for(f in this.fieldMap) {			
			var tmpField = this.fieldMap[f];
			var tmpFieldId =  tmpField.name || tmpField.id;
			if (tmpFieldId == radio.getItemId()){				
				tmpField.setVisible(true);
				//tmpField.setValue(''); //resets the field value to '' (system default)
		//		tmpField.doLayout();
			}else if (tmpFieldId.substr(0, tmpFieldId.indexOf('__')) === currentRadioId ){
				//disables others fields of the group
				tmpField.setVisible(false);				
			}
    		 	
    	}
    	
	}
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  * - Antonella Giachino (antonella.giachino@eng.it)
  */
 
Ext.ns("Sbi.console");

Sbi.console.GridPanel = function(config) {

		var defaultSettings = {
			layout: 'fit'
			, loadMask: false
		    , viewConfig: {
	          	forceFit:false,
	           	autoFill: true,
	           	enableRowBody:true,
	           	showPreview:true
	        }
			, start: 0
			, limit: 5
		};
		
		if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.gridPanel) {
			defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.gridPanel);
		}
		
		var c = Ext.apply(defaultSettings, config || {});
		
		c.storeId = c.dataset;
		c.storeLabelsId = c.datasetLabels;
		delete c.dataset;	
		var tableConfig = c.table || {};
		var filterConfig =  c.filterBar || {};
		filterConfig.executionContext = c.executionContext;
		filterConfig.exportName = c.exportName;
		Ext.apply(this, c);
		
		this.initServices();
		this.initStore();		
		this.initColumnModel();
		this.initSelectionModel();	
		this.initFilterBar(filterConfig);
		this.initPagingBar();
		
		Ext.QuickTips.init() ;
		Ext.apply(Ext.QuickTips.getQuickTip(), {
		    maxWidth: 200,
		    minWidth: 100,
		    showDelay: 50,
		    dismissDelay: 0,
		    closable: true,
		 //   title: 'Valore',
		    trackMouse: true
		});
		
		if (this.store !== undefined){
			this.store.pagingParams = {
				start: this.start
			  , limit: this.limit
			  , paginator: this.pagingBar
			};
		
		
			this.pagingBar.refresh.hide();
			this.pagingBar.on('change', function() {
				this.store.pagingParams.start = this.pagingBar.cursor;
			}, this);
			
			this.filterBar.on('beforefilterselect', function() {
				this.pagingBar.moveFirst();
			}, this);
			
			if(this.store.filterPlugin) {
				this.store.filterPlugin.on('filterschange', function(s, f) {
					this.pagingBar.onLoad(this.store, [], {params: this.store.pagingParams || {}});
				}, this);
			}
		}
		
		var c = Ext.apply(c, {
			store: this.store
			, cm: this.columnModel
			, sm: this.selectionModel
			, tbar: this.filterBar
			, bbar: this.pagingBar
		});   
		
		
		// constructor
		Sbi.console.GridPanel.superclass.constructor.call(this, c);
		
		this.addEvents('lock');
		this.addEvents('unlock');
		
};

Ext.extend(Sbi.console.GridPanel, Ext.grid.GridPanel, {
    
	services: null
	// grid
	, store: null
	, storeLabels: null
	, columnModelLabels: null
	, columnModel: null
	, selectionModel: null
	, tempColumnModel: null
	, headersToHide: null
	, fieldsMap: null
	, selectedRowsId: null
	, hideSelectedRow: null
	
	// popup
	, waitWin: null
	, errorWin: null
	, alarmWin: null
	, logsWin: null
	, promptWin: null
	// popup dataset label postfix (the complete name is given by <table_dataset_label><postfix> ie: 'testConsoleErrors')
	, errorDs: 'Errors'
	, alarmDs: 'Alarms'
	, loadMask: null
	
	// configuration bloks
	, filterBar: null
	, inlineCharts: null
	, inlineActions: null
    , AUTOMATIC_FILTERBAR: 'automatic'		// automatic: all dataset fields are added as filter
    , CUSTOM_FILTERBAR: 'custom'			//custom: only configurated fields are added as filter  
    , ACTIVE_VALUE: 1
	, INACTIVE_VALUE: 0
	, USER_ID: 'userId'
	
	
	
	, GRID_ACTIONS: {
		start: {serviceName: 'START_WORK', images: {active:'../img/ico_start.gif', inactive:'../img/ico_start_gray.gif'}}
		, stop: {serviceName: 'STOP_WORK', images: {active:'../img/ico_stop.gif', inactive:'../img/ico_stop_gray.gif'}}
		, informationlog: {serviceName: 'DOWNLOAD_ZIP', images: '../img/ico_download_logs.gif'}
		, crossnav: {serviceName: 'CROSS_ACTION', images: {cross_detail: '../img/ico_cross_detail.gif', popup_detail: '../img/ico_popup_detail.gif'}}
		, monitor: {serviceName: 'UPDATE_ACTION', images: {inactive: '../img/ico_monitor.gif', active: '../img/ico_monitor_gray.gif'}}
		, errors: {serviceName: 'UPDATE_ACTION', images: {active: '../img/ico_errors.gif', inactive: '../img/ico_errors_gray.gif'}} 
		, alarms: {serviceName: 'UPDATE_ACTION', images: {active: '../img/ico_alarms.gif', inactive: '../img/ico_alarms_gray.gif'}}
		, views: {serviceName: 'UPDATE_ACTION', images: {active: '../img/ico_views.gif', inactive: '../img/ico_views_gray.gif'}} 
		, refresh: {serviceName: 'REFRESH_ACTION', images: '../img/ico_refresh.gif'}
		, genericUpdate: {serviceName: 'UPDATE_ACTION'}
		, notifyStartAction: {serviceName: 'NOTIFY_START_ACTION'}
		
	}
   
    //  -- public methods ---------------------------------------------------------
    
    
	, resolveParameters: function(parameters, record, context, callback) {		
		
		if (parameters == undefined) return;
		
		var results = {};  
		var promptables;
		
		
		var staticParams = parameters.staticParams || "";
		
		results = Ext.apply(results, staticParams);
		var dynamicParams = parameters.dynamicParams || "";
		
		
	    if(dynamicParams) { 
	    	var msgErr = ""; 
	    	for (var i = 0, l = dynamicParams.length; i < l; i++) { 
	    	 	var param = dynamicParams[i];              
		              if (param.scope === 'dataset') {		            	  
			               for(p in param) {
			            	   if(p === 'scope') continue;			            	   
			                   if(record.get(this.store.getFieldNameByAlias(param[p])) === undefined) {         			                   
			                    msgErr += 'Parameter "' + param[p] + '" undefined into dataset.<p>';
					           } else {
					              results[p] = record.get(this.store.getFieldNameByAlias(param[p])); 
					           }
			               }
		              } else if (param.scope === 'env'){ 		            	  
			               for(p in param) { 
			                if(p === 'scope') continue;			              			            	  		                
			                  var tmpNamePar =  param[p];
			            	  if (p !== this.USER_ID && context[tmpNamePar] === undefined) {
			            		   msgErr += 'Parameter "' + tmpNamePar + '" undefined into request. <p>';
		                      } else {                                   
		                       results[p] = context[tmpNamePar];
		                      }
			               }
	                 } else if (param.scope === 'promptable'){   
		                  promptables = promptables || [];
		                  promptables.push(param);
	                 }	                 
	           }   
	    		//gets metadata params (linked to dynamic params)
		    	var metaParams = parameters.metaParams;
			    if(metaParams) {  
			    	results['metaParams'] = Ext.util.JSON.encode(metaParams);
			    }
	      	}
	  
        if  (msgErr != ""){
        	Sbi.Msg.showError(msgErr, 'Service Error');
        }	
       
      	//if there are some promptable field, it shows a popup for the insertion
      	if (promptables !== undefined){
    			this.promptWin = new Sbi.console.PromptablesWindow({
    				promptables: promptables	    					
    			});
    			this.promptWin.on('click', function(win, pp) {
    				Ext.apply(results, pp);
    			    callback.call (this, results);	    								
    			}, this);
      		this.promptWin.show();
      		this.promptWin.on('close', function() {
      			this.fireEvent('unlock', this);
      			}, this);
      	}
      	else {
      		callback.call (this, results);      		
      	}
	}
	
	, execCrossNav: function(actionName, record, index, options){	
		this.showMask();
		var msg = {
			label: options.document.label
	    	, windowName: this.name	||  parent.name // parent.name is used in document composition context			
	    	, target: (options.target === 'new')? 'self': 'popup'	    	
	    	, typeCross: 'EXTERNAL' //for manage correctly the IE workaround in document composition context 
	    }; 
		if (msg.target === 'popup'){
			msg.width = options.width || 500;
			msg.height = options.height || 300;
		}
		
		var callback = function(params){
			var separator = '';
			msg.parameters = '';
			for(p in params) {
				var values = params[p];
	        	if (Ext.isArray(values)){
	        		//multiple values management (...&P1=val1&P1=val2&P1=val3...)
	        		for (var i=0; i< values.length; i++){
	        			msg.parameters += separator + p + '=' + ((values[i]==='%')?'%25':values[i]);
	        		}
	        	} else
	        		msg.parameters += separator + p + '=' +  ((params[p]==='%')?'%25':params[p]);
	        	
				separator = '&';
			}
			if (this.executionContext.EXECUTION_CONTEXT !== undefined && 
					this.executionContext.EXECUTION_CONTEXT === 'DOCUMENT_COMPOSITION'){				
				//document composition context				
				if (params.typeCross !== undefined && params.typeCross == 'INTERNAL'){
					//internal cross	
					var frameName = "iframe_" + this.executionContext.DOCUMENT_LABEL;
		    		parent.execCrossNavigation(frameName, msg.label ,  msg.parameters );
		    		
				}else{
					//external cross
					parent.sendMessage(msg, 'crossnavigation');
				}
			}else{
				sendMessage(msg, 'crossnavigation');
			}
			this.hideMask.defer(2000, this);
		};
		
		this.resolveParameters(options.document, record, this.executionContext, callback);
	}

	
	, execAction: function(action, r, index, options) {	
		
		//toggles all icons of the same family
		var fields = this.getFieldsToToggle(action);
		for(var i = 0, l = fields.length; i < l; i++){ 
			var field = fields[i];
			if (field.toggle) field.toggle(r);
		}

		var callback = function(params){

			params = Ext.apply(params, {
	  			message: action.type, 
	        	userId: Sbi.user.userId 
	  		}); 
			
	  		Ext.Ajax.request({
		       	url: this.services[action.type] 			       
		       	, params: params 			       
		    	, success: function(response, options) {
		    		if(response !== undefined && response.responseText !== undefined) {
							var content = Ext.util.JSON.decode( response.responseText );
							if (content !== undefined) {				      			  
							//	alert(content.toSource());
							}				      		
	    			} else {
	    				Sbi.Msg.showError('Server response is empty', 'Service Error');
	    			}
		    	}
		    	, failure: Sbi.exception.ExceptionHandler.onServiceRequestFailure
		    	, scope: this     
		    });
		};
		this.resolveParameters(options, r, this.executionContext, callback);
    }
	
	, toggleMonitor: function(action, r, index, options) {
		//force the list refresh	                   
        this.store.filterPlugin.applyFilters();	            
        this.execAction(action, r, index, options);
	}

	, showErrors: function(action, r, index, options) {
		if(this.errorWin === null) {
			this.errorWin = new Sbi.console.MasterDetailWindow({
				serviceName: 'GET_ERROR_LIST_ACTION'
			  , action: action				
			});
			this.errorWin.on('show', function() {
      			this.fireEvent('lock', this);
      			}, this);
			this.errorWin.on('checked', function(win, record) {
				this.errorWin.action.toggle(record);
				this.execAction(this.errorWin.action, record, null, options);
				if(this.errorWin.action.isChecked(record)) {
					this.errorWin.checkButton.setText(LN('sbi.console.error.btnSetNotChecked'));
				} else {
					this.errorWin.checkButton.setText(LN('sbi.console.error.btnSetChecked'));
				}				
			}, this);
			this.errorWin.on('hide', function() {
      			this.fireEvent('unlock', this);
      			}, this);
		}
		var callback = function(params){ 
			params.ds_label = this.store.getDsLabel() + this.errorDs;
			this.errorWin.reloadMasterList(params);
			this.errorWin.setTarget(r);
			var isChecked = action.isChecked(r);
			if(isChecked) {
				this.errorWin.checkButton.setText(LN('sbi.console.error.btnSetNotChecked'));
			} else if(!isChecked){
				this.errorWin.checkButton.setText(LN('sbi.console.error.btnSetChecked'));
			}
			this.errorWin.show();
		};
		this.resolveParameters(options, r, this.executionContext, callback);
		
	}
	
	, showAlarms: function(action, r, index, options) {
		if(this.alarmWin === null) {
			this.alarmWin = new Sbi.console.MasterDetailWindow({
				serviceName: 'GET_WARNING_LIST_ACTION'
			  , action: action
			});
			this.alarmWin.on('show', function() {
      			this.fireEvent('lock', this);
      			}, this);
			this.alarmWin.on('checked', function(win, record) {
				this.alarmWin.action.toggle(record);
				this.execAction(action, record, null, options);
				if(this.alarmWin.action.isChecked(record)) {
					this.alarmWin.checkButton.setText(LN('sbi.console.error.btnSetNotChecked'));
				} else {
					this.alarmWin.checkButton.setText(LN('sbi.console.error.btnSetChecked'));
				}	
			}, this);
			this.alarmWin.on('hide', function() {
      			this.fireEvent('unlock', this);
      			}, this);
		}

		//var params = {};
		var callback = function(params){ 			
			params.ds_label = this.store.getDsLabel() + this.alarmDs;
			this.alarmWin.reloadMasterList(params);
			
			
			this.alarmWin.setTarget(r);
			if(action.isChecked(r)) {
				this.alarmWin.checkButton.setText(LN('sbi.console.error.btnSetNotChecked'));
			} else {
				this.alarmWin.checkButton.setText(LN('sbi.console.error.btnSetChecked'));
			}
			this.alarmWin.show();
		};
		this.resolveParameters(options, r, this.executionContext, callback);
		
	}
	
	, startProcess: function(action, r, index, options) {
		this.fireEvent('lock', this);
		
		if(action.isChecked(r)) {
			Sbi.Msg.showWarning('Process is already running');
			return;
		}
	
		var callback = function(params){ 	
			//split the array values in a single string
			for(p in params) { 
				var tmpPar = params[p];
				if(Ext.isArray(tmpPar)) {		
					var strValue = "";
					for(var i = 0; i < tmpPar.length; i++) {
						strValue +=	tmpPar[i]+',';
					}
					strValue = strValue.substr(0,strValue.length-1);
					params[p] = strValue;
				}	
			}
			
			params = Ext.apply(params, {
				userId: Sbi.user.userId 
	          , DOCUMENT_LABEL: options.document.label
	  		}); 
			
			if(this.waitWin === null) {
				this.waitWin = new Sbi.console.WaitWindow({});
			}
			this.waitWin.startingTxt = 'Starting process';
			this.waitWin.start();
			this.waitWin.show();
	  		Ext.Ajax.request({
		       	url: this.services[action.type] 			       
		       	, params: params 			       
		    	, success: function(response, options) {
	  				
		    		if(!response || !response.responseText) {
		    			Sbi.Msg.showError('Server response is empty', 'Service Error');
		    			return;
		    		}
	  				var content = Ext.util.JSON.decode( response.responseText );
	  				action.setBoundColumnValue(r, content.pid);
	  				//this.waitWin.stop('Proecess started succesfully');
					//action.toggle(r);	
					if (params.stmt){
						params.pid = content.pid;
						//calls the update action (if there's a stmt definition)
						Ext.Ajax.request({
					       	url: this.services['notifyStartAction'] 			       
					       	, params: params 			       
					    	, success: function(response, options) {
					    		if(response !== undefined && response.responseText !== undefined) {
										var content = Ext.util.JSON.decode( response.responseText );
										if (content !== undefined) {				      			  
										//	alert(content.toSource());
										}				      		
				    			} else {
				    				Sbi.Msg.showError('Server response is empty', 'Service Error');
				    			}
					    	}
					    	, failure: Sbi.exception.ExceptionHandler.onServiceRequestFailure
					    	, scope: this     
					    });
					}
					this.waitWin.stop('Process started succesfully');
					action.toggle(r);
		    	}
		    	, failure: function(response, options) {
		    		Sbi.exception.ExceptionHandler.onServiceRequestFailure(response, options);
		    		this.waitWin.stop('Impossible to start process');
		    	}
		    	, scope: this     
		    });
		};
		this.resolveParameters(options.document, r, this.executionContext, callback);
	}
	
	, stopProcess: function(action, r, index, options) {
		if(action.isChecked(r)) {
			Sbi.Msg.showWarning('Process is already stopped');
			return;
		}

		var callback = function(params){
			params = Ext.apply(params, {
	        	userId: Sbi.user.userId 
	          , DOCUMENT_LABEL: options.document.label
	  		}); 
			
			if(this.waitWin === null) {
				this.waitWin = new Sbi.console.WaitWindow({});
			}
			this.waitWin.startingTxt = 'Stopping process';
			this.waitWin.start();
			this.waitWin.show();
			
			Ext.Ajax.request({
		       	url: this.services[action.type] 			       
		       	, params: params 			       
		    	, success: function(response, options) {
	  				
		    		if(!response || !response.responseText) {
		    			Sbi.Msg.showError('Server response is empty', 'Service Error');
		    			return;
		    		}
	  				var content = Ext.util.JSON.decode( response.responseText );
	  				action.setBoundColumnValue(r, content.pid);
	  				this.waitWin.stop('Proecess stopped succesfully');
					action.toggle(r);
					
					if (params.stmt){						
						//calls the update action (if there's a stmt definition)
						Ext.Ajax.request({
					       	url: this.services['genericUpdate'] 			       
					       	, params: params 			       
					    	, success: function(response, options) {
					    		if(response !== undefined && response.responseText !== undefined) {
										var content = Ext.util.JSON.decode( response.responseText );
										if (content !== undefined) {				      			  
										//	alert(content.toSource());
										}				      		
				    			} else {
				    				Sbi.Msg.showError('Server response is empty', 'Service Error');
				    			}
					    	}
					    	, failure: Sbi.exception.ExceptionHandler.onServiceRequestFailure
					    	, scope: this     
					    });
					}
		    	}
		    	, failure: function(response, options) {
		    		Sbi.exception.ExceptionHandler.onServiceRequestFailure(response, options);
		    		this.waitWin.stop('Impossible to stop process');
		    	}
		    	, scope: this     
		    });
		};
		this.resolveParameters(options.document, r, this.executionContext, callback);
		
	}
	
	, downloadLogs: function(action, r, index, options) {	
		var callback = function(params){
			var url =  Sbi.config.spagobiServiceRegistry.getServiceUrl({serviceName: 'DOWNLOAD_ZIP'
				     , baseParams: new Object()
					});
			
			params = Ext.apply(params, {
				USER_ID: Sbi.user.userId 
			  , URL: url
			}); 
			
			//if(this.logsWin === null) {
				this.logsWin = new Sbi.console.DownloadLogsWindow({
				serviceName: 'DOWNLOAD_ZIP' 
				, action: action
				, options: options
				});							
			//}
			
			this.logsWin.on('checked', function(win, record) {	
				this.logsWin.downloadLogs(action, record, null, params);
				this.logsWin = null;
			}, this);
			
			this.logsWin.show();
		};
		
		this.resolveParameters(options, r, this.executionContext, callback);
		

	},
	
	updateSelectedRows: function(listRowsSelected){
		if (this.selectedRowsId == null){ 
			this.selectedRowsId = []; 
		}
		this.selectedRowsId = listRowsSelected;
	}
	
	,
	stopLoading : function () {
		this.storeManager.stopRefresh(true, this.storeId);
	}
	
	,
	restartLoading : function () {
		this.storeManager.stopRefresh(false, this.storeId);
	}
	
	
    //  -- private methods ---------------------------------------------------------
    
    
    , initServices: function() {
    	this.services = this.services || new Array();	
		this.images = this.images || new Array();	
				
		for(var actionName in this.GRID_ACTIONS) {
			var actionConf = this.GRID_ACTIONS[actionName];
			if(actionName === 'start') {
				this.services[actionName] = this.services[actionName] || Sbi.config.commonjServiceRegistry.getServiceUrl({
					serviceName: actionConf.serviceName
					, baseParams: new Object()
				});
			} else if(actionName === 'stop') {
				this.services[actionName] = this.services[actionName] || Sbi.config.commonjServiceRegistry.getServiceUrl({
					serviceName: actionConf.serviceName
					, baseParams: new Object()
				});
			}else if(actionName === 'informationlog') {
				this.services[actionName] = this.services[actionName] || Sbi.config.spagobiServiceRegistry.getServiceUrl({
					serviceName: actionConf.serviceName
					, baseParams: new Object()
				});
			} else {
				this.services[actionName] = this.services[actionName] || Sbi.config.serviceRegistry.getServiceUrl({
					serviceName: actionConf.serviceName
					, baseParams: new Object()
				});
			}
		}
    }
    
	, initStore: function() {		
		this.store = this.storeManager.getStore(this.storeId);
		if (this.store === undefined) {
			Sbi.Msg.showError('Dataset with identifier [' + this.storeId + '] is not correctly configurated');			
		}else{
			this.store.remoteSort = false;  //local type		
			this.store.on('exception', Sbi.exception.ExceptionHandler.onStoreLoadException, this);
			this.store.on('load', this.onLoad, this);
			this.store.on('metachange', this.onMetaChange, this);
		}
	}

	, initColumnModel: function() {	
		this.columnModel = new Ext.grid.ColumnModel([
			new Ext.grid.RowNumberer(), 
			{
				header: "Data",
			    dataIndex: 'data',
			    width: 150
			}
		]);
		this.columnModel.defaultSortable = true;  		
	}
	
	, initSelectionModel: function() {
		this.selectionModel = new Ext.grid.RowSelectionModel({
			singleSelect: false
		});
	}
	
	, initFilterBar: function(filterBarConf) {
		if (filterBarConf.type === 'default') {
			Sbi.Msg.showError('Toolbar of type [' + filterBarConf.type + '] is not yet supported');
		} else if (filterBarConf.type === this.CUSTOM_FILTERBAR || filterBarConf.type === this.AUTOMATIC_FILTERBAR) {
		    this.filterBar = new Sbi.console.CustomFilteringToolbar({filterBar: filterBarConf, store: this.store});   
		}  else {
			Sbi.Msg.showError('Toolbar of type [' + filterBarConf.type + '] is not supported');
		}
	}
	
	//redefines the renderer for inline charts.
	/*
	, updateInLineCharts: function(){

		for(var j = 0, len = this.inlineCharts.length; j < len; j++) {
			var idx = this.getColumnModel().findColumnIndex(this.store.getFieldNameByAlias(this.inlineCharts[j].column));
			this.getColumnModel().setRenderer(idx, this.createInlineChartRenderer(this.inlineCharts[j]) );			
		}
	}*/
	
	, updateMetaStructure: function(cm, headerToHide, fieldsMap){
		for(var i = 0, len = headerToHide.length; i < len; i++) {
			//hides the column with the description of the header
			if (cm.fields[fieldsMap[headerToHide[i]]] !== undefined)
				cm.fields[fieldsMap[headerToHide[i]]].hidden = true;
		}
		//adds numeration column    
		cm.fields[0] = new Ext.grid.RowNumberer();
		//update columnmodel configuration
		this.getColumnModel().setConfig(cm.fields);
	    this.reconfigure(this.store,cm);
	}
	
	, initPagingBar: function() {
		this.pagingBar = new Ext.PagingToolbar({
            pageSize: this.limit,
            store: this.store,
            displayInfo: true
        });
	}
	
	// -- callbacks ---------------------------------------------------------------------------------------------
	//defines the max, min and tot value on all records (only for columns visualized as chart)
	, onLoad: function(){
		var numRec = this.store.getCount();
		
		//redefines the columns labels if they are dynamics
		var tmpMeta = this.getColumnModel();
		var fields = tmpMeta.config;
		var metaIsChanged = false;
		var headerToHide = [];
		var fieldsMap = {};
		tmpMeta.fields = new Array(fields.length);
	 
		for(var i = 0, len = fields.length; i < len; i++) {
			if(fields[i].headerType !== undefined && fields[i].headerType.toUpperCase() === 'DATASET'){
				//-------------------------------------------------------------------------------//
				// 	subsitutes the grid header values with the dataset header fields			 //
				//-------------------------------------------------------------------------------//
				var tmpRec = this.store.getAt(0);
				if (tmpRec !== undefined) {
			    	var tmpHeader =  tmpRec.get(this.store.getFieldNameByAlias(fields[i].header));
			    	if (tmpHeader !== undefined){	
			    		metaIsChanged = true;
			    		fieldsMap[fields[i].header] = (fields[i].id+1);
			    		headerToHide.push(fields[i].header);
			    		if (tmpHeader === "") {
			    			tmpHeader = "header__" + i;
			    			fieldsMap[tmpHeader] = (fields[i].id);
			    			headerToHide.push(tmpHeader);
			    		}else{
				    		fields[i].header = tmpHeader;				    		
			    		}
			    		tmpMeta.fields[i] = Ext.apply({}, fields[i]);
			    	}
				}else 
					tmpMeta.fields[i] = Ext.apply({}, fields[i]);				
		    }else if (fields[i].headerType !== undefined && fields[i].headerType.toUpperCase() === 'I18N'){
		    	//-------------------------------------------------------------------------------//
				// subsitutes the grid header values with the label presents into file 			 //
		    	// (ex: \webapps\SpagoBIConsoleEngine\user_messages\it.js)						 //
				//-------------------------------------------------------------------------------//
		    	var tmpHeader = LN(fields[i].header);
		    	if (tmpHeader !== undefined){
		    		metaIsChanged = true;
		    		fields[i].header = tmpHeader;		    		
		    		tmpMeta.fields[i] = Ext.apply({}, fields[i]);
		    	}else{
					tmpMeta.fields[i] = Ext.apply({}, fields[i]);
		    	}
	    	}else{
		    	//without substitution; manteins the header defined into the columnConfig section
	    		tmpMeta.fields[i] = Ext.apply({}, fields[i]);
	    	}
		}
		
		//-------------------------------------------------------------------------------//
		// 	inline charts updating														 //
		//-------------------------------------------------------------------------------//
		if (this.inlineCharts !== undefined && this.inlineCharts !== null) {
			var minValue = 0;
			var maxValue = 0;
			var totValue = 0;
			var idxFieldThreshold = 0;
			var idxFieldColumn = 0;
			var pointChartConfig = {};		
			var nameFieldThr = "";
			var nameFieldThrFirstInt = "";
			var nameFieldThrSecondInt = "";
			var tooltip = "";
			//var fieldsMap = {};
				
			for(var p = 0, len = this.inlineCharts.length; p < len; p++) {
				minValue = 0;
				maxValue = 0;
				totValue = 0;	
				if (this.inlineCharts[p] !== undefined){		
					for (var i=0; i < numRec; i++){
						var tmpRec = this.store.getAt(i);
						var tmpValue = tmpRec.get(this.store.getFieldNameByAlias(this.inlineCharts[p].column));						
						if ((this.inlineCharts[p].type == 'point' || this.inlineCharts[p].type == 'semaphore') &&
							 this.inlineCharts[p].thresholdType == 'dataset'){ 
							if(this.inlineCharts[p].threshold !== undefined || this.inlineCharts[p].thresholdFirstInt !== undefined || 
								  this.inlineCharts[p].thresholdSecondInt !== undefined) {
								//gets thresholds value dinamically (from dataset)
								pointChartConfig = Ext.apply({}, this.inlineCharts[p] || {});
								//internationalize tooltips
								pointChartConfig.tooltip =  Sbi.locale.getLNValue(pointChartConfig.tooltip);
								pointChartConfig.tooltipGreen =  Sbi.locale.getLNValue(pointChartConfig.tooltipGreen);
								pointChartConfig.tooltipYellow =  Sbi.locale.getLNValue(pointChartConfig.tooltipYellow);
								pointChartConfig.tooltipRed =  Sbi.locale.getLNValue(pointChartConfig.tooltipRed);
								metaIsChanged = true;
								idxFieldColumn = this.getColumnModel().findColumnIndex(this.store.getFieldNameByAlias(this.inlineCharts[p].column));
								if (this.inlineCharts[p].threshold !== undefined){
									nameFieldThr = this.getNameFieldForThreshold(this.inlineCharts[p].threshold, fieldsMap, headerToHide);
									pointChartConfig.nameFieldThr = nameFieldThr;
								}
								if (this.inlineCharts[p].thresholdFirstInt !== undefined){
									nameFieldThrFirstInt = this.getNameFieldForThreshold(this.inlineCharts[p].thresholdFirstInt, fieldsMap, headerToHide);
									pointChartConfig.nameFieldThrFirstInt = nameFieldThrFirstInt;
								}
								if (this.inlineCharts[p].thresholdSecondInt !== undefined){
									nameFieldThrSecondInt = this.getNameFieldForThreshold(this.inlineCharts[p].thresholdSecondInt, fieldsMap, headerToHide);
									pointChartConfig.nameFieldThrSecondInt = nameFieldThrSecondInt;
								}
								//check the tooltip, before try to international it, then substitutes the field value														
								pointChartConfig = this.getTooltipFromFields(pointChartConfig, fieldsMap, headerToHide );

								var renderer = this.createInlineChartRenderer(pointChartConfig);
								if( renderer !== null ) {
									fields[idxFieldColumn].renderer = renderer;
						    		tmpMeta.fields[idxFieldColumn] = Ext.apply({}, fields[idxFieldColumn]);
								}
							}
						}else if ((this.inlineCharts[p].type == 'point' || this.inlineCharts[p].type == 'semaphore') && 
								   this.inlineCharts[p].thresholdType == 'env'){
							if(this.inlineCharts[p].threshold !== undefined || this.inlineCharts[p].thresholdFirstInt !== undefined || 
									  this.inlineCharts[p].thresholdSecondInt !== undefined) {
								idxFieldColumn = this.getColumnModel().findColumnIndex(this.store.getFieldNameByAlias(this.inlineCharts[p].column));
								pointChartConfig = Ext.apply({}, this.inlineCharts[p] || {});
								//internationalize tooltips
								pointChartConfig.tooltip =  Sbi.locale.getLNValue(pointChartConfig.tooltip);
								pointChartConfig.tooltipGreen =  Sbi.locale.getLNValue(pointChartConfig.tooltipGreen);
								pointChartConfig.tooltipYellow =  Sbi.locale.getLNValue(pointChartConfig.tooltipYellow);
								pointChartConfig.tooltipRed =  Sbi.locale.getLNValue(pointChartConfig.tooltipRed);
								metaIsChanged = true;
								pointChartConfig.threshold = this.executionContext[this.inlineCharts[p].threshold];
								pointChartConfig.thresholdFirstInt = this.executionContext[this.inlineCharts[p].thresholdFirstInt];
								pointChartConfig.thresholdSecondInt = this.executionContext[this.inlineCharts[p].thresholdSecondInt];
								pointChartConfig = this.getTooltipFromEnv(pointChartConfig);
								
		  						var renderer = this.createInlineChartRenderer(pointChartConfig);
								if( renderer !== null ) {
									fields[idxFieldColumn].renderer = renderer;
						    		tmpMeta.fields[idxFieldColumn] = Ext.apply({}, fields[idxFieldColumn]);
								}
							}
			            }else if (this.inlineCharts[p].type == 'bar'){
							if (tmpValue !== undefined){
								totValue = totValue + tmpValue;
								if ( tmpValue < minValue || i === 0) minValue = tmpValue;
								
								if ( tmpValue > maxValue ) maxValue = tmpValue;
							}
						}
					}  
					if (numRec > 0 && this.inlineCharts[p].type == 'bar'){
						//update initial value config with news								
						this.inlineCharts[p].maxValue = maxValue;
						this.inlineCharts[p].minValue = minValue;
						this.inlineCharts[p].totValue = totValue; 	
							
						var idx = this.getColumnModel().findColumnIndex(this.store.getFieldNameByAlias(this.inlineCharts[p].column));
						this.getColumnModel().setRenderer(idx, this.createInlineChartRenderer(this.inlineCharts[p]) );
					}
				}
			}
		}
		
		if (this.storeLabelsId !== undefined){
			//check to change headers with internationalized dataset
  		this.tempColumnModel = tmpMeta;
  		this.headersToHide = headerToHide;
  		this.fieldsMap = fieldsMap;
		  this.loadStoreForHeaders();
		}
		else{
		  if (metaIsChanged) this.updateMetaStructure(tmpMeta, headerToHide, fieldsMap);
		}
	}
	
	, onMetaChange: function( store, meta ) {
		var i;
	    var fieldsMap = {};

		var tmpMeta =  Ext.apply({}, meta); // meta;
		var fields = tmpMeta.fields;
		tmpMeta.fields = new Array(fields.length);
		
		for(i = 0; i < fields.length; i++) {
			if( (typeof fields[i]) === 'string') {				
				fields[i] = {name: fields[i]};
			}
			
			if (this.columnId !== undefined && this.columnId === fields[i].header ){
				fields[i].hidden = true;
			}
			tmpMeta.fields[i] = Ext.apply({}, fields[i]);
			fieldsMap[fields[i].name] = i;
		}
		
		var inlineChartMap = {};
		if (this.inlineCharts) { 
			for(var j = 0, len = this.inlineCharts.length; j < len; j++) {
				inlineChartMap[ this.inlineCharts[j].column ] = this.inlineCharts[j];
			}
		}
		
		for(i = 0; i < tmpMeta.fields.length; i++) {	
			var t = Ext.apply({}, this.columnConfig[tmpMeta.fields[i].header] || {},  this.columnDefaultConfig);
		    tmpMeta.fields[i] = Ext.apply(tmpMeta.fields[i], t);
		    
			if(tmpMeta.fields[i].type) {
				var tmpType = tmpMeta.fields[i].type;					
				if (tmpType == 'date' || tmpType == 'timestamp'){
					tmpMeta.fields[i].renderer  =  Sbi.locale.formatters[tmpType];
				}else{							
					tmpMeta.fields[i].renderer = this.renderTooltip.createDelegate(this);
				}
			}
			   
			if(tmpMeta.fields[i].subtype && tmpMeta.fields[i].subtype === 'html') {
				tmpMeta.fields[i].renderer  =  Sbi.locale.formatters['html'];
			}
			
			tmpMeta.fields[i].sortable = true;
	   
			var chartConf = null;
			if( (chartConf = inlineChartMap[tmpMeta.fields[i].header]) !== undefined ) {
				var renderer = this.createInlineChartRenderer(chartConf);
				if( renderer !== null ) {
					tmpMeta.fields[i].renderer  =  renderer;
				} else{
					Sbi.Msg.showWarning('Impossible to create inlineChart on column [' + tmpMeta.fields[i].header + ']');
				}
			}
			
		} 

	    //adds inline action buttons
		if (this.inlineActions) {
			for(var i = 0, l = this.inlineActions.length; i < l; i++){ 
				if ( this.inlineActions[i].type == undefined)  this.inlineActions[i].type =  this.inlineActions[i].name;
				var column = this.createInlineActionColumn(this.inlineActions[i]);					
				if(column !== null) {
					
					if (this.inlineActions[i].imgSrcInactive !== undefined){
						var tmpImgName = this.inlineActions[i].imgSrcInactive.substr(0,this.inlineActions[i].imgSrcInactive.indexOf(".") );
						if (Ext.util.CSS.getRule('.x-grid3-hd-' + tmpImgName + '_header') == null){
							var tmpCSS = '.x-grid3-hd-' + tmpImgName	+ '_header { background: url(../img/'+this.inlineActions[i].imgSrcInactive+') center center no-repeat; height:20px;}';
		    				Ext.util.CSS.createStyleSheet(tmpCSS);
						}
						column.cls = tmpImgName	+ '_header';
					}
					else{
						column.cls = this.inlineActions[i].type + '_header';
					}
					tmpMeta.fields.push( column );
				} else {
					Sbi.Msg.showWarning('Impossible to create inlineActionColumn [' + this.inlineActions[i].type + ']');
				}
				//hides the configuration column linked to inlineActions				
				var tmpName; 
				if(this.inlineActions[i].checkColumn) {
					tmpName = this.store.getFieldNameByAlias(this.inlineActions[i].checkColumn);						
					if (tmpName !== undefined)  tmpMeta.fields[fieldsMap[tmpName]].hidden = true;
				}
				if(this.inlineActions[i].flagColumn) {
					tmpName = this.store.getFieldNameByAlias(this.inlineActions[i].flagColumn);						
					if (tmpName !== undefined)  tmpMeta.fields[fieldsMap[tmpName]].hidden = true;
				}
				
  	  		}	
		}
		//hides flag icons column for massive actions 
		if (this.filterBar.actions) {
			for(var i = 0, l = this.filterBar.actions.length; i < l; i++){
				var massiveAction =  this.filterBar.actions[i];
				if (massiveAction.flagColumn !== undefined){
					var tmpName = this.store.getFieldNameByAlias(massiveAction.flagColumn);						
					if (tmpName !== undefined)  tmpMeta.fields[fieldsMap[tmpName]].hidden = true;
				}
			}
		}
		
		//adds numeration column    
		tmpMeta.fields[0] = new Ext.grid.RowNumberer();
	    //update columnmodel configuration
		this.getColumnModel().setConfig(tmpMeta.fields);
	}

	
	, createInlineChartRenderer: function(config) {
		var chartRenderer = null;
		if(config.type === 'bar') {
			renderer  =  Sbi.console.commons.Format.inlineBarRenderer(config);
		} else if(config.type === 'point') {			
			renderer  =  Sbi.console.commons.Format.inlinePointRenderer(config);
		} else if(config.type === 'semaphore') {			
			renderer  =  Sbi.console.commons.Format.inlineSemaphoreRenderer(config);
		} else{
			Sbi.Msg.showWarning('InlineChart type [' + chartConf.type + '] is not supported');
		}
		return renderer;
	}
		
	, createInlineActionColumn: function(config) {
		
		var inlineActionColumn = null;
		var inlineActionColumnConfig = config;
		
		inlineActionColumnConfig = Ext.apply({
			grid: this
			, scope: this
		//	, headerIconCls: inlineActionColumnConfig.type + '_header'
		}, inlineActionColumnConfig);
		
		inlineActionColumnConfig.tooltip = Sbi.locale.getLNValue(inlineActionColumnConfig.tooltip);
		inlineActionColumnConfig.tooltipInactive = Sbi.locale.getLNValue(inlineActionColumnConfig.tooltipInactive);
		inlineActionColumnConfig.tooltipActive = Sbi.locale.getLNValue(inlineActionColumnConfig.tooltipActive);
		
		//updates img source if it's necessary (only for actionButton)
		if(inlineActionColumnConfig.type !== 'selectRow') {
			if (inlineActionColumnConfig.imgSrcActive !== undefined){
				inlineActionColumnConfig.imgSrcActive = '../img/' + inlineActionColumnConfig.imgSrcActive;
			}
			else if (this.GRID_ACTIONS[ inlineActionColumnConfig.type ].images['active'] !== undefined){
				inlineActionColumnConfig.imgSrcActive = this.GRID_ACTIONS[ inlineActionColumnConfig.type ].images['active'];			
			}
			if (inlineActionColumnConfig.imgSrcInactive !== undefined){
				inlineActionColumnConfig.imgSrcInactive = '../img/' + inlineActionColumnConfig.imgSrcInactive;
			}else if (this.GRID_ACTIONS[ inlineActionColumnConfig.type ].images['inactive'] !== undefined){
				inlineActionColumnConfig.imgSrcInactive = this.GRID_ACTIONS[inlineActionColumnConfig.type ].images['inactive'];
			}
		}
		
		if (inlineActionColumnConfig.type === 'crossnav'){
			if (inlineActionColumnConfig.imgSrc !== undefined){
				inlineActionColumnConfig.imgSrc = '../img/' + inlineActionColumnConfig.imgSrc;
			}else{
				// for default
				inlineActionColumnConfig.imgSrc = this.GRID_ACTIONS[ inlineActionColumnConfig.type ].images['cross_detail'];
				if (inlineActionColumnConfig.config){			
					if (inlineActionColumnConfig.config.target === 'self') {					
						inlineActionColumnConfig.imgSrc = this.GRID_ACTIONS[ inlineActionColumnConfig.type ].images['popup_detail'];	
					}
				}
			}
			inlineActionColumnConfig.handler = this.execCrossNav;
			inlineActionColumn = new Sbi.console.InlineActionColumn(inlineActionColumnConfig);
			
		}else if (inlineActionColumnConfig.type === 'monitor'){		
			inlineActionColumnConfig.handler = this.toggleMonitor;
				
			//set the filter for view only active items (default)
			var tmpName = this.store.getFieldNameByAlias(inlineActionColumnConfig.checkColumn);
			if (tmpName !== undefined){
				if (this.store.filterPlugin.getFilter(tmpName) === undefined) {					
					var tmpValue = new Array();
					tmpValue.push(this.ACTIVE_VALUE );
					this.store.filterPlugin.addFilter (tmpName, tmpValue);
				}
			}
						
			inlineActionColumn = new Sbi.console.InlineToggleActionColumn(inlineActionColumnConfig);			
				
		} else if (inlineActionColumnConfig.type === 'errors'){	
			inlineActionColumnConfig.toggleOnClick = false;
			inlineActionColumnConfig.handler = this.showErrors;
			
			inlineActionColumn = new Sbi.console.InlineToggleActionColumn(inlineActionColumnConfig);	
			
		} else if (inlineActionColumnConfig.type === 'alarms'){	
			inlineActionColumnConfig.toggleOnClick = false;
			inlineActionColumnConfig.handler = this.showAlarms;
			inlineActionColumn = new Sbi.console.InlineToggleActionColumn(inlineActionColumnConfig);	
			
		} else if (inlineActionColumnConfig.type === 'views'){	
			inlineActionColumnConfig.toggleOnClick = true;			
			inlineActionColumnConfig.handler = this.execAction;
			inlineActionColumn = new Sbi.console.InlineToggleActionColumn(inlineActionColumnConfig);	
			
		} else if (inlineActionColumnConfig.type === 'start'){	
			inlineActionColumnConfig.toggleOnClick = false;
			//inlineActionColumnConfig.toggleOnClick = true; //refresh automatico delle icone?
			inlineActionColumnConfig.handler = this.startProcess;
			inlineActionColumnConfig.isChecked = function(record) {
				var v, active;
				if(this.isBoundToColumn()) {
					v = this.getBoundColumnValue(record);
				//	alert('myIsCHecked-v: ' + v);
			    	active = (v != 0);
				}
				
				return active;		
			};
			inlineActionColumnConfig.setChecked = function(record, b) {
				var v, s;
				if(this.isBoundToColumn()) {
					s = this.grid.store;
					if(b) {
						record.set (s.getFieldNameByAlias(this.checkColumn), '34' );
					}
				}
			};
			inlineActionColumn = new Sbi.console.InlineToggleActionColumn(inlineActionColumnConfig);
		
		} else if (inlineActionColumnConfig.type === 'stop'){			
			inlineActionColumnConfig.toggleOnClick = false;
			//inlineActionColumnConfig.toggleOnClick = true; //refresh automatico delle icone?
			inlineActionColumnConfig.handler = this.stopProcess;
			inlineActionColumnConfig.isChecked = function(record) {
				var v, active;
				if(this.isBoundToColumn()) {
					v = this.getBoundColumnValue(record);					
			    	active = (v == 0);
				}
				
				return active;		
			};
			inlineActionColumnConfig.setChecked = function(record, b) {
				var v, s;
				if(this.isBoundToColumn()) {
					s = this.grid.store;
					if(b) {
						record.set (s.getFieldNameByAlias(this.checkColumn), 0 );
					}
				}
			};
			inlineActionColumn = new Sbi.console.InlineToggleActionColumn(inlineActionColumnConfig);
			
		}else if (inlineActionColumnConfig.type === 'informationlog'){			
			inlineActionColumnConfig.imgSrc = this.GRID_ACTIONS[ inlineActionColumnConfig.type ].images;
			inlineActionColumnConfig.handler = this.downloadLogs;			
			inlineActionColumn = new Sbi.console.InlineActionColumn(inlineActionColumnConfig);
			
		}else if (inlineActionColumnConfig.type === 'selectRow'){							
			inlineActionColumnConfig.handler = this.updateSelectedRows;		
			inlineActionColumn = new Sbi.console.InlineCheckColumn(inlineActionColumnConfig); 	
			inlineActionColumn.masterCheckValue = null; //reset value
		} else {
			inlineActionColumnConfig.imgSrc = this.GRID_ACTIONS[ inlineActionColumnConfig.type ].images;
			inlineActionColumnConfig.handler = this.execAction;
			inlineActionColumn = new Sbi.console.InlineActionColumn(inlineActionColumnConfig);
		}
		return inlineActionColumn;
	}
	
	, getFieldsToToggle: function(action){
		var toReturn = [];
		for (var i=0, l= this.columnModel.fields.length; i<l; i++ ){
			var cmf = this.columnModel.fields[i];
			if (cmf.type == action.type && cmf.name !== action.name){
				toReturn.push(cmf);
			}			
		}
		return toReturn;
	}
	
	, getTooltipFromFields: function(chartConfig, fieldsMap, headerToHide){			
		var tooltipToCheck;
		
		if ((chartConfig.tooltip && chartConfig.tooltip.indexOf("$F{") === -1) &&
			(chartConfig.tooltipGreen && chartConfig.tooltipGreen.indexOf("$F{") === -1) &&
			(chartConfig.tooltipYellow && chartConfig.tooltipYellow.indexOf("$F{") === -1) &&
			(chartConfig.tooltipRed && chartConfig.tooltipRed.indexOf("$F{") === -1)){
			return chartConfig;
		}
		
		if (chartConfig.tooltip !== undefined){
			chartConfig.nameTooltipField = this.getFieldsConfiguration(chartConfig.tooltip, fieldsMap, headerToHide);
		}
		if (chartConfig.tooltipGreen !== undefined){
			chartConfig.nameTooltipFieldGreen = this.getFieldsConfiguration(chartConfig.tooltipGreen, fieldsMap, headerToHide);
		}
		if (chartConfig.tooltipYellow !== undefined){
			chartConfig.nameTooltipFieldYellow = this.getFieldsConfiguration(chartConfig.tooltipYellow, fieldsMap, headerToHide);
		}
		if (chartConfig.tooltipRed !== undefined){
			chartConfig.nameTooltipFieldRed = this.getFieldsConfiguration(chartConfig.tooltipRed, fieldsMap, headerToHide);
		}
				
		return chartConfig;
	}
	
	, getFieldsConfiguration: function(tooltipToCheck, fieldsMap, headerToHide){
		var startFieldTooltip;
		var lenFieldTooltip;
		var nameTooltipField;
		var idxFieldTooltip;	
		var arNameTooltipField;
		var elTooltipField;
		
		arNameTooltipField = new Array();								
		while (tooltipToCheck.indexOf("$F{") !== -1){
			elTooltipField = {};
			startFieldTooltip = tooltipToCheck.indexOf("$F{")+3;
			lenFieldTooltip = tooltipToCheck.indexOf("}")-startFieldTooltip;
			nameTooltipField =  tooltipToCheck.substr(startFieldTooltip,lenFieldTooltip);
			idxFieldTooltip = this.getColumnModel().findColumnIndex(this.store.getFieldNameByAlias(nameTooltipField));
			fieldsMap[nameTooltipField] = idxFieldTooltip;					
			if (headerToHide.indexOf(nameTooltipField)<0) headerToHide.push(nameTooltipField); //hides the column with the tooltip
			
			elTooltipField.name = nameTooltipField;
			elTooltipField.value = this.store.getFieldNameByAlias(nameTooltipField);
			arNameTooltipField.push(elTooltipField);
			
			tooltipToCheck = tooltipToCheck.replace("$F{" + nameTooltipField + "}", "");
		}
		return arNameTooltipField;
	}
	
	, getTooltipFromEnv: function(chartConfig){			
		var tooltipToCheck;
		
		if ((chartConfig.tooltip && chartConfig.tooltip.indexOf("$P{") === -1) &&
			(chartConfig.tooltipGreen && chartConfig.tooltipGreen.indexOf("$P{") === -1) &&
			(chartConfig.tooltipYellow && chartConfig.tooltipYellow.indexOf("$P{") === -1) &&
			(chartConfig.tooltipRed && chartConfig.tooltipRed.indexOf("$P{") === -1)){
			return chartConfig;
		}
		
		if (chartConfig.tooltip !== undefined){
			chartConfig.tooltip = this.getVarConfiguration(chartConfig.tooltip);
		}
		if (chartConfig.tooltipGreen !== undefined){
			chartConfig.tooltipGreen = this.getVarConfiguration(chartConfig.tooltipGreen);
		}
		if (chartConfig.tooltipYellow !== undefined){
			chartConfig.tooltipYellow = this.getVarConfiguration(chartConfig.tooltipYellow);
		}
		if (chartConfig.tooltipRed !== undefined){
			chartConfig.tooltipRed = this.getVarConfiguration(chartConfig.tooltipRed);
		}
				
		return chartConfig;
	}
	
	, getVarConfiguration: function(tooltipToCheck){
		var startFieldTooltip;
		var lenFieldTooltip;
		var nameTooltipField;
	
		while (tooltipToCheck.indexOf("$P{") !== -1){
			startFieldTooltip = tooltipToCheck.indexOf("$P{")+3;
			lenFieldTooltip = tooltipToCheck.indexOf("}")-startFieldTooltip;
			nameTooltipField =  tooltipToCheck.substr(startFieldTooltip,lenFieldTooltip);																
			if (nameTooltipField){
					var tmpTooltipValue = this.executionContext[nameTooltipField] || " ";
					if (tmpTooltipValue){
						var newTooltip = tooltipToCheck.replace("$P{" + nameTooltipField + "}", tmpTooltipValue);
						tooltipToCheck = newTooltip;
					}
			}else 
				break;
		}
		
		return tooltipToCheck;
	}
	
	, getNameFieldForThreshold: function(labelThr, fieldsMap, headerToHide){
		idxFieldThreshold = this.getColumnModel().findColumnIndex(this.store.getFieldNameByAlias(labelThr));
		fieldsMap[labelThr] = idxFieldThreshold;
		if (headerToHide.indexOf(labelThr)<0) headerToHide.push(labelThr); //hides the column with the configuration
		nameFieldThreshold = this.store.getFieldNameByAlias(labelThr);
		return nameFieldThreshold;
	}
	
	, loadStoreForHeaders: function(){
		//load optional dataset with lables for i18N management:			
		this.storeLabels = this.storeManager.getStore(this.storeLabelsId);
		
		if (this.storeLabels === undefined) {
			Sbi.Msg.showError('Dataset with identifier [' + this.storeLabelsId + '] is not correctly configurated');			
		}else{					
			this.storeLabels.on('exception', Sbi.exception.ExceptionHandler.onStoreLoadException, this);
			this.storeLabels.on('metachange', this.onMetaChangeLabels, this);
			this.storeLabels.on('load', this.changeLabelsByDatatset, this);
			this.storeLabels.loadStore();	
		}
		
	}
	, onMetaChangeLabels: function( store, meta ) {
	 	var fieldsMap = {};
		var tmpMeta =  Ext.apply({}, meta); // meta;
		var fields = tmpMeta.fields;
		tmpMeta.fields = new Array(fields.length);
		
		for(i = 0; i < fields.length; i++) {
			if( (typeof fields[i]) === 'string') {
				fields[i] = {name: fields[i]};
			}
			
			if (this.columnId !== undefined && this.columnId === fields[i].header ){
				fields[i].hidden = true;
			}
			tmpMeta.fields[i] = Ext.apply({}, fields[i]);
			fieldsMap[fields[i].name] = i;
		}
		this.columnModelLabels = tmpMeta.fields;
		if (this.storeLabels.alias2FieldMetaMap == null){
			this.storeLabels.alias2FieldMetaMap = this.columnModelLabels;
		}
	}
	, changeLabelsByDatatset: function(){

		var tmpMeta = this.tempColumnModel;
		var fields = tmpMeta.config;
		var idxLocale = null;
		var idxLabel = null;
		var idxCode = null;
		for(var i = 0, len = fields.length; i < len; i++) {
			if (fields[i] !== undefined && fields[i].headerType !== undefined && fields[i].headerType.toUpperCase() === 'DATASETI18N'){
		    	//-------------------------------------------------------------------------------//
				// 	subsitutes the grid header values with the specific dataset labels.
		    	// This dataset should returns 3 fields: code, label, locale (it_IT, en_US, fr_FR, es_ES)
		    	// Ex: cod_UnitSales, Unit Sales, en_US 													 
				//-------------------------------------------------------------------------------//		
		    	if (this.storeLabels.alias2FieldMetaMap !== undefined && this.storeLabels.alias2FieldMetaMap !==  null ){
		    		if (idxLabel == null || idxLocale == null || idxCode == null){
				    	idxLocale = (this.storeLabels.getFieldMetaByAlias("LOCALE") !== undefined)?this.storeLabels.getFieldMetaByAlias("LOCALE") :
				    		this.storeLabels.getFieldMetaByAlias("locale");
				    	if (idxLocale !== undefined) idxLocale = idxLocale.dataIndex;
				    	idxCode = (this.storeLabels.getFieldMetaByAlias("CODE") !== undefined)?this.storeLabels.getFieldMetaByAlias("CODE") :
				    		this.storeLabels.getFieldMetaByAlias("code");
				    	if (idxCode !== undefined) idxCode = idxCode.dataIndex;		    	
				    	idxLabel = (this.storeLabels.getFieldMetaByAlias("LABEL") !== undefined)?this.storeLabels.getFieldMetaByAlias("LABEL") :
				    		this.storeLabels.getFieldMetaByAlias("label");
				    	if (idxLabel !== undefined) idxLabel = idxLabel.dataIndex;
		    		}
		    	}
		    	if (idxLocale == undefined || idxCode == undefined || idxLabel == undefined){
		    		Sbi.Msg.showError(LN('sbi.console.localization.columnsKO'), 'Service Error');
		    		tmpMeta.fields[i] = Ext.apply({}, fields[i]);
		    	}else{
			    	//apply filter on labelsStore:
		    		
			    	var idxRec = this.storeLabels.findBy(function(record){				    		
			    	   if (idxLocale !== undefined && idxCode !== undefined){
			    		  if(record.data[idxLocale] === Sbi.user.locale && 
			    		     record.data[idxCode] === fields[i].header) {		
	  						   return true;  						   
	  					   }	
			    	   } 	
			  		   return false;				   
			  	   }, this);
			  	   
		    		//var idxRec = this.findByLocaleAndCode(idxLocale, Sbi.user.locale, idxCode, fields[i].header);
			    	var tmpRec = this.storeLabels.getAt(idxRec);		    	
					if (tmpRec !== undefined) {
						var tmpHeader =  tmpRec.get(idxLabel);
				    	if (tmpHeader !== undefined){	
				    		metaIsChanged = true;
				    		fields[i].header = tmpHeader;		    		
				    		tmpMeta.fields[i] = Ext.apply({}, fields[i]);
				    	}else{
							tmpMeta.fields[i] = Ext.apply({}, fields[i]);
				    	}	
					}else 
						tmpMeta.fields[i] = Ext.apply({}, fields[i]);	
		    	}
	    	}else {
	    		tmpMeta.fields[i] = Ext.apply({}, fields[i]);
	    	}	
		}
	
		this.updateMetaStructure(tmpMeta, this.headersToHide, this.fieldsMap);
	}
	
	, findByLocaleAndCode: function(idxLocale, locale, idxCode, code) {
		for (var count = 0; count < this.storeLabels.getCount(); count++) {			
			var aRecord = this.storeLabels.getAt(count);
			if (aRecord.get(idxLocale) == locale  && aRecord.get(idxCode) == code ) {
				alert("return: " + count);
					return count;
			}
		}		
		return -1;
	}
	
	/**
	 * Opens the loading mask 
	 */
    , showMask : function(){
    	this.un('afterlayout',this.showMask,this);
    	if (this.loadMask == null) {    		
    		this.loadMask = new Ext.LoadMask('GridPanel', {msg: "Loading.."});
    	}
    	if (this.loadMask){
    		this.loadMask.show();
    	}
    }

	/**
	 * Closes the loading mask
	*/
	, hideMask: function() {
    	if (this.loadMask && this.loadMask != null) {	
    		this.loadMask.hide();
    	}
	} 
	
	,renderTooltip:function(val, cell, record) {	
		// get data
		var data = record.data;
		 
		// return markup
		return '<div qtip="' + val +'">' + val + '</div>';
	}
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  * - Antonella Giachino (antonella.giachino@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.DetailPage = function(config) {
		var defaultSettings = {
			title: LN('sbi.console.detailpage.title')
			, layout: 'fit'
		};
		
		if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.detailPage) {
			defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.detailPage);
		}
		
		var c = Ext.apply(defaultSettings, config || {});
		var navigationBarConfig = c.navigationBar || {};
		navigationBarConfig.executionContext = c.executionContext;
		delete c.navigationBar;
		var tableConfig = c.table || {};
		tableConfig.executionContext = c.executionContext;
		tableConfig.storeManager = c.storeManager;
		tableConfig.exportName = c.exportName;
		delete c.table;
		Ext.apply(this, c);
		

		
		this.initNavigationToolbar(navigationBarConfig);
		this.initGridPanel(tableConfig);
		
		c = Ext.apply(c, {  	
			//html: this.msg
			tbar: this.navigationToolbar
	      	, items: [this.gridPanel]	      	
		});

		// constructor
		Sbi.console.DetailPage.superclass.constructor.call(this, c);
    
};

Ext.extend(Sbi.console.DetailPage, Ext.Panel, {
    
    services: null
    , navigationToolbar: null
    , gridPanel: null
   
    //  -- public methods ----------------------------------------------------------
    
    , getStore: function() {
		return this.gridPanel.store;
	}

	, getStoreLabels: function() {
		return this.gridPanel.storeLabels;
	}
    
    //  -- private methods ---------------------------------------------------------
    , initNavigationToolbar: function(navigationBarConf) {
    	this.navigationToolbar = new Sbi.console.NavigationToolbar(navigationBarConf);
    }
    
    , initGridPanel: function(conf){       
      this.gridPanel = new Sbi.console.GridPanel(conf);
    }
    
    
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  * - Antonella Giachino (antonella.giachino@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.DetailPanel = function(config) {

		var defaultSettings = {
			layout: 'fit'
			, bodyStyle: 'padding: 8px'
			, region: 'center'
		};
		
		if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.detailPanel) {
			defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.detailPanel);
		}
		
		var c = Ext.apply(defaultSettings, config || {});		
		
		var pagesConfig = c.pages || [];
		pagesConfig.executionContext = c.executionContext;
		pagesConfig.storeManager = c.storeManager;
		delete c.pages;
		
		Ext.apply(this, c);
		
		this.initDetailPages(pagesConfig);
		this.initTabPanel();
		
		c = Ext.apply(c, {  
	      	items: [this.tabPanel]
		});

		// constructor
		Sbi.console.DetailPanel.superclass.constructor.call(this, c);
    
		//this.addEvents();
};

Ext.extend(Sbi.console.DetailPanel, Ext.Panel, {
    
    //services: null
    pages: null
    , activePage: null
    , tabPanel: null
    
   
    //  -- public methods ---------------------------------------------------------
    
    , getActivePage: function() {
		return this.activePage;
	}
    
    //  -- private methods ---------------------------------------------------------
    
    , initDetailPages: function(pagesConfig) {
    	
		this.pages = new Array();
		var detailPage = null;		
		for(var i = 0, l = pagesConfig.length; i < l; i++) {
		  var conf = pagesConfig[i];
		  conf.executionContext = pagesConfig.executionContext; 
		  conf.storeManager = pagesConfig.storeManager;
		  var pageTitle = this.getTitlePage(conf);
		  conf.title = pageTitle;
		  detailPage = new Sbi.console.DetailPage(conf);
		  this.pages.push(detailPage);
		  //actives only the first tab dataset
		  //var s = conf.storeManager.getStore(detailPage.getStore().getDsLabel());
		  var s = conf.storeManager.getStore(conf.table.dataset);
		  if (s !== undefined){
			  if (i===0){
				  s.stopped = false;
			  }else{
				  s.stopped = true;
			  }		  
		  }
		}
	}

	, initTabPanel: function() {
		this.tabPanel = new Ext.TabPanel({
      		activeTab: 0
      		, items: this.pages
      	});

		this.tabPanel.on('tabchange',function (tabPanel, tab) {
			
			if (tabPanel !== undefined && tab !== undefined && this.activePage != undefined){
				for(var i = 0, l = this.pages.length; i < l; i++) {
					  var tmpPage =  this.pages[i];
					  var s = tmpPage.getStore();
					  //loads only the first tab dataset
					  if (tmpPage.getStore().getDsLabel() === this.activePage.getStore().getDsLabel()){
						  s.stopped = true;						 
					  }else if (tmpPage.getStore().getDsLabel() === tab.getStore().getDsLabel()){
						  s.stopped = false;
						  
						  //force refresh data
						  s.load({
								params: {}, 
								callback: function(){this.ready = true;}, 
								scope: s, 
								add: false
							});
							
					  }						  
					}
				
			}
			this.activePage = tab;
		}, this );
	}
    , getTitlePage: function(conf){
    	//internationalizes and substitutes parameter values if its necessary
    	var titlePage =  Sbi.locale.getLNValue(conf.title);
    	if (titlePage.indexOf("$P{") !== -1){
    		titlePage = this.getVarConfiguration(titlePage, conf);
    	}
    	return titlePage;
    	
    }
    , getVarConfiguration: function(titleToCheck, conf){
		var startFieldTitle;
		var lenFieldTitle;
		var nameTitleField;
	
		while (titleToCheck.indexOf("$P{") !== -1){
			startFieldTitle = titleToCheck.indexOf("$P{")+3;
			lenFieldTitle = titleToCheck.indexOf("}")-startFieldTitle;
			nameTitleField =  titleToCheck.substr(startFieldTitle,lenFieldTitle);																
			if (nameTitleField){
					var tmpTitleValue = conf.executionContext[nameTitleField] || " ";
					if (tmpTitleValue == "%") tmpTitleValue = " ";					
					
					if (tmpTitleValue){
						var newTitle = titleToCheck.replace("$P{" + nameTitleField + "}", tmpTitleValue);
						titleToCheck = newTitle;
					}
			}else 
				break;
		}
		
		return titleToCheck;
	}
    
});/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
  
 
  
 
/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Andrea Gioia (andrea.gioia@eng.it)
  * - Antonella Giachino (antonella.giachino@eng.it)
  */

Ext.ns("Sbi.console");

Sbi.console.ConsolePanel = function(config) {

	var defaultSettings = {
		title: LN('sbi.console.consolepanel.title'),
		layout: 'border'
	};
		
	if(Sbi.settings && Sbi.settings.console && Sbi.settings.console.consolePanel) {
		defaultSettings = Ext.apply(defaultSettings, Sbi.settings.console.consolePanel);
	}
		
	var c = Ext.apply(defaultSettings, config || {});
	
	var datasetsConfig = c.datasets || [];
	delete c.datasets;
	
	var summaryPanelConfig = c.summaryPanel;
	if(summaryPanelConfig) summaryPanelConfig.executionContext = c.executionContext; 
	delete c.summaryPanel;
	
	var detailPanelConfig = c.detailPanel;
	if(detailPanelConfig) detailPanelConfig.executionContext = c.executionContext; 
	delete c.detailPanel;
		
	Ext.apply(this, c);
		
	this.services = this.services || new Array();	
	this.services['export'] = this.services['export'] || Sbi.config.serviceRegistry.getServiceUrl({
		serviceName: 'EXPORT_ACTION'
	  , baseParams: new Object()
	});
	
	
	
	this.initStoreManager(datasetsConfig);
	
	var items = new Array();	
	
	
	if (summaryPanelConfig !== undefined){
		summaryPanelConfig.storeManager = this.storeManager;
		this.initSummaryPanel(summaryPanelConfig);
		items.push(this.summaryPanel);		
	}
	
	if (detailPanelConfig !== undefined){
		detailPanelConfig.storeManager = this.storeManager;
		this.initDetailPanel(detailPanelConfig);
		items.push(this.detailPanel);
	} 
	
	if(this.detailPanel === null) {
		if(!this.summaryPanel === null) {
			items.push({region: 'center', html: 'The console is empty. Please check the template.'});
		} else {
			this.summaryPanel.region = 'center';
		}
	}
	
	// just for test export function
	/*
	items.push({
		title: 'Export panel'
		, hidden: true
		
		, region: 'south'
		, tools: [{
			id:'gear',
			qtip: LN('export as text'),
				hidden: false,
				handler: this.exportConsole,
				scope: this
			}]
		, html: 'Click on the button up here to export console document'
	});
	*/
	c = Ext.apply(c, {  	
		items: items
	});
	
	
	// constructor
	Sbi.console.ConsolePanel.superclass.constructor.call(this, c);
	
	//WORKAROUND: on FF is possible to have a problem with the definition of the objects because is faster than other browser,
	//so it gives the error: 'onhostmessage is not defined.' So, now, it forces a pause before to define the callbacks on events
	if (Ext.isIE){
		onhostmessage(this.exportConsole, this, false, 'export');
		onhostmessage(this.onHide, this, false, 'hide');
		onhostmessage(this.onShow, this, false, 'show');
	}else{
		var that = this;
		var setHostMsg = function(){
			that.setHostMessagges();
		}; 
		setTimeout(setHostMsg, 8000); 
	}
	
	//manages the stop refresh on popup windows call
	if (this.detailPanel){
		for(var i = 0; i< this.detailPanel.pages.length; i++){
			this.detailPanel.pages[i].gridPanel.on('lock', this.onHide, this);
			this.detailPanel.pages[i].gridPanel.on('unlock', this.onShow, this);
		}
	}
	
	//this.refreshData();

};

Ext.extend(Sbi.console.ConsolePanel, Ext.Panel, {
    
    services: null
    , storeManager: null
    , summaryPanel: null
    , detailPanel: null
   
   
    //  -- public methods ---------------------------------------------------------
    
    
    
    //  -- private methods ---------------------------------------------------------
    
    , initStoreManager: function(datasetsConfig) {
	
		this.storeManager = new Sbi.console.StoreManager({datasetsConfig: datasetsConfig});
		
	}
    
    , initSummaryPanel: function(conf) {
		this.summaryPanel = new Sbi.console.SummaryPanel(conf);
	}

	, initDetailPanel: function(conf) {
		this.detailPanel = new Sbi.console.DetailPanel(conf);
	}
	
	, exportConsole: function(format) {
		var detailPage = this.detailPanel.getActivePage();
		var columnConfigs = detailPage.gridPanel.getColumnConfigs();
		var dsHeadersLabel = (detailPage.getStoreLabels() !== undefined)?detailPage.getStoreLabels().getDsLabel() : "";
		var params = {
			mimeType: 'application/pdf'
			, responseType: 'attachment'
			, datasetHeadersLabel: dsHeadersLabel	
			,meta: Ext.util.JSON.encode(columnConfigs)
		};
		Sbi.Sync.request({
			url: this.services['export']
		  , params: params
		});
	
	}

	
	//stop all datastore of the hidden console 
	, onHide: function(){
		this.storeManager.stopRefresh(true);
	}
	
	//active all datastore of the active console
	, onShow: function(datasetConfig){
		this.storeManager.stopRefresh(false);
	}
	
	, setHostMessagges: function() {
		onhostmessage(this.exportConsole, this, false, 'export');
		onhostmessage(this.onHide, this, false, 'hide');
		onhostmessage(this.onShow, this, false, 'show'); 
	}
	
	, refreshData: function(){
		this.storeManager.forceRefresh();
	}
	
	/*
	, pause:  function (millis){
		var date = new Date();
		var curDate = null;
	
		do { curDate = new Date(); }
		while(curDate-date < millis);
	}*/

});