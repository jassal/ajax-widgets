/*
 *  Copyright (C) 2009, Intalio Inc.
 *
 *  The program(s) herein may be used and/or copied only with the
 *  written permission of Intalio Inc. or in accordance with the terms
 *  and conditions stipulated in the agreement/contract under which the
 *  program(s) have been supplied.
 */
jsx3.require("jsx3.gui.Form", "jsx3.gui.Block", "jsx3.gui.IFrame");

jsx3.lang.Class.defineClass("com.intalio.ria.FileUpload", jsx3.gui.Block, [jsx3.gui.Form], function(FileUpload,FileUpload_prototype) {
  
  var Event = jsx3.gui.Event;
  var Interactive = jsx3.gui.Interactive;
  
  /**
   * main method
   */
  FileUpload_prototype.init = function(strName,vntLeft,vntTop,vntWidth,vntHeight) {
    this.jsxsuper(strName,vntLeft,vntTop,vntWidth,vntHeight);
  };

  /**
   * paint override
   */
  FileUpload_prototype.paint = function() {
    this.applyDynamicProperties();
    var id = this.getId();
    var html = "<span></span>";
    var parent = this.getParent();
	this._initialize();
    if(!parent.isType('jsx3.gui.Matrix.Column')){	
     html = '<div class="markerClass">'+
	 '<form name="IntalioInternal_FileUploadForm_' + id + '" ' +
	   'id="IntalioInternal_FileUploadForm_' + id + '" ' +
	   'target="' + com.intalio.ria.FileUpload.jsxiframe.getIFrameId() + '" ' +
	   'action="/gi/fileupload" method="post" enctype="multipart/form-data" '+
	   'style="padding:0;margin:0;">' +
	 '<input name="attachmentFile" type="file" ' +
	     'id="IntalioInternal_FileUploadInput_' + id + '" ' +
	     this.paintInputSize() + '/>' +
	 '<label name="attachmentFileLabel" id="IntalioInternal_FileUploadInputLabel_' +
	     id + '" ' + '>' + ((this.fileName)? this.fileName : "") + '</label>' +
	 '<input type="hidden" name="participantToken" value="" ' +
	     'id="IntalioInternal_FileUploadToken_' + id + '"/>' +
       '</form></div>';	   
    }
	
	//added paint() logic in jsx3.gui.Block here instead of using this.jsxsuper() for performance reasons
	var eventMap = {};
    if (this.hasEvent(Interactive.JSXDOUBLECLICK))
      eventMap[Event.DOUBLECLICK] = true;
    if (this.hasEvent(Interactive.JSXCLICK))
      eventMap[Event.CLICK] = true;
    if (this.hasEvent(Interactive.JSXKEYDOWN))
      eventMap[Event.KEYDOWN] = true;

    var strSuppl = "";

    if (this.getCanSpy() == 1) {
      eventMap[Event.MOUSEOVER] = true;
      eventMap[Event.MOUSEOUT] = true;
    }

    if (this.getCanMove() == 1) {
      if (this.getCanMove() == 1) {
        eventMap[Event.MOUSEDOWN] = "doBeginMove";
      }
    } else if (this.getMenu() != null) {
      eventMap[Event.MOUSEUP] = true;
    } else if (this.getCanDrop() == 1) {
      eventMap[Event.MOUSEUP] = true;
    }

    if (eventMap[Event.MOUSEDOWN] == null && this.getCanDrag() == 1) {
      eventMap[Event.MOUSEDOWN] = "doBeginDrag";
      strSuppl += ' JSXDragId="' + id + '" JSXDragType="JSX_GENERIC"';
    }

    //get custom 'view' properties(custom props to add to the rended HTML tag)
    var strEvents = this.renderHandlers(eventMap, 0) + strSuppl;
    var strAttributes = this.renderAttributes(null, true);

    //render the outer-most box
    var b1 = this.getBoxProfile(true);
    b1.setAttributes(this.paintIndex() + this.paintTip() + strEvents + ' id="' + id + '"' + this.paintLabel() + ' class="' + this.paintClassName() + '" ' + strAttributes);
    b1.setStyles(this.paintFontSize() + this.paintBackgroundColor() + this.paintBackground() + this.paintColor() + this.paintOverflow() + this.paintFontName() + this.paintZIndex() + this.paintFontWeight() + this.paintTextAlign() + this.paintCursor() + this.paintVisibility() + this.paintBlockDisplay() + this.paintCSSOverride());
    return b1.paint().join(html + this.paintChildren());
  };
  
  FileUpload_prototype.isCandidateForUpload = function(){
  	var parent, column, matrix, recordId;
	parent = this.getParent();
  	if(parent.instanceOf(com.intalio.ria.FileUpload)){
		column = parent.getParent();
		if(column.isType('jsx3.gui.Matrix.Column')){
			matrix = column.getParent();
			recordId = this.getMatrixRecordId();
			if(recordId && matrix.getRecordNode(recordId)){
				return this.getFileInputFieldValue();
			}else{
				var node = this.getRendered();
				if(node) jsx3.html.removeNode(node);
				parent.removeChild(this);
			}
		}
	} else {
		return this.getFileInputFieldValue();
	}
  }
  
  FileUpload_prototype.getURL = function(){
  	return (this.URL)? this.URL : null; 
  }
  
  FileUpload_prototype.setURL = function(strURL){
  	this.URL = strURL;
	var matrix, parent;
	parent = this.getParent();
	if(parent.instanceOf(com.intalio.ria.FileUpload)){
		column = parent.getParent();
		if(column.isType('jsx3.gui.Matrix.Column')){
			matrix = column.getParent();
			recordId = this.getMatrixRecordId();
			if(matrix.getRecordNode(recordId)){
				column.setValueForRecord(recordId,strURL);
		    }
		}
	}
  }
  
  FileUpload_prototype.setMatrixRecordId = function(recordId){
  	this.jsxmatrixrecordid = recordId;
  }
  
  FileUpload_prototype.getMatrixRecordId = function(){
  	return this.jsxmatrixrecordid;
  }
  
  FileUpload_prototype.setParticipantToken = function(strToken){
    var token = this._getElementById('IntalioInternal_FileUploadToken_' + this.getId());
	if(token) token.value = strToken;
  }
  
  FileUpload_prototype.submit = function(){
    var form = this._getElementById('IntalioInternal_FileUploadForm_' + this.getId());
	if(form) form.submit();
  }
  
  FileUpload_prototype.getFileInputFieldValue = function(){
  	var input = this._getElementById('IntalioInternal_FileUploadInput_' + this.getId());
	return (input)? input.value : null;
  }
  
  /**
   * paint input size
   */
  FileUpload_prototype.paintInputSize = function() {
    return ' size="40"';
  };
  
  /**
  * validation
  */
  FileUpload_prototype.doValidate = function() {
	this.setValidationState(1);
	var objGUI = this.getRendered();
    if (objGUI != null) {
		if(this.getRequired()){
			if(!this.getFileInputFieldValue()){
				this.setValidationState(0);
			}		
		}
	}
	return this.getValidationState();
  };
  
  /**
   * gets the url value returned from the server 
   */
  FileUpload_prototype.getValue = function() {
    return this.getURL();
  };  
  
  /**
   * disallow setting the value of the file input (security violation). set the value to the label instead.
   */
  	FileUpload_prototype.setValue = function(strValue) {
		var objGUI = this.getRendered();
		if (objGUI != null) {
			var label = objGUI.ownerDocument.getElementById("IntalioInternal_FileUploadInputLabel_" + this.getId());
			if (label != null) {
			  // show only the file name without the path
			  var labelValue = (strValue == null) ? "" : "" + strValue.substring(strValue.lastIndexOf('/')+1, strValue.length);
			  this.fileName = labelValue;
			}
		}
		if(strValue.indexOf('http://') === 0){
			this.setURL(strValue);
		}
  	};

    //matrix event listener
    FileUpload_prototype.matrixEventCallback = function(objEvent){
		try{
		    switch(objEvent.subject){
				case jsx3.gui.Interactive.BEFORE_APPEND: // before a record is added to the matrix
				    var record = objEvent.context.objRECORD;
				    var recordId = record.jsxid;
					this.jsxfileupload[recordId] = this.jsxfileupload['jsxautorow'];
					this.jsxfileupload[recordId].setMatrixRecordId(recordId);
					this.jsxfileupload['jsxautorow'] = null;
					this._addControlForRecord('jsxautorow',true);
				    break;
				case jsx3.gui.Interactive.AFTER_APPEND: //after a record is added to the matrix
				    //nothing to do
				    break;
				case jsx3.gui.Interactive.BEFORE_EDIT: // before a cell is opened in edit mode
					if(this.getParent() == objEvent.context.objCOLUMN){
						var child, children, recordId;
						children = this.getChildren();
						recordId = objEvent.context.strRECORDID;
						if(!this.jsxfileupload[recordId]){
							this._addControlForRecord(recordId,true);
						}
						for(i=0;i<children.length;i++){
							child = children[i];
							if(child.instanceOf(com.intalio.ria.FileUpload)){
								if(this.jsxfileupload[recordId].getId() == child.getId()){
									child.setDisplay(jsx3.gui.Block.DISPLAYBLOCK,true);						
								} else{
									child.setDisplay(jsx3.gui.Block.DISPLAYNONE,true);
								}
							}
						}
					}
				    break;
				case jsx3.gui.Interactive.AFTER_EDIT: //after completion of editing of a cell
					//nothing to do
				    break;		
				case 'recordDeleted': //custom event, triggering mechanism added in the matrix table prototype xml					
				    var recordId = objEvent.context.strRECORDID;
					this._removeControlOfRecord(recordId,true);
				    break;
		    }
		}catch(e){
		    //nothing to do
		}
		return true;
    }
	
	/** Start of methods inherited from jsx3.gui.Matrix.EditMask **/
    FileUpload_prototype.emInit = function(objColumn) {
		this.jsxsupermix(objColumn);
		var matrixAncestor = objColumn.getParent();
		if(matrixAncestor){
		    //subscribing an event listener to all the events published by the matrix parent
		    matrixAncestor.subscribe("*",this,"matrixEventCallback");
		}		
    };

    FileUpload_prototype.emBeginEdit = function(strValue, objTdDim, objPaneDim, objMatrix, objColumn, strRecordId, objTD) {
	    if (this.emGetType() == jsx3.gui.Matrix.EditMask.NORMAL) {
			this.setRelativePosition(jsx3.gui.Block.ABSOLUTE, true);
			this.emUpdateDisplay(objTdDim, objPaneDim);
			this.setDisplay(jsx3.gui.Block.DISPLAYBLOCK, true);
			this.setZIndex(10, true);
			this.focus();
			this.emFocus();
	    }
		this.emSetValue(strValue);
    };

    FileUpload_prototype.emEndEdit = function() {
		if (this.emGetType() == jsx3.gui.Matrix.EditMask.NORMAL) {
	    	this.emRestoreDisplay();
		}
		return this.emGetValue();
    };

    FileUpload_prototype.emGetValue = function(){		
		return this.getMaskValue();
    }
	
	FileUpload_prototype.emSetValue = function(strValue){
		if(strValue && strValue.indexOf('http://') === 0){
			this.setURL(strValue);
		}
	}

    FileUpload_prototype.getMaskValue = function(inRecordId){
		var columnParent = this.getParent();
		if(columnParent){
		    var recordId = (inRecordId)? inRecordId : this.emGetSession().recordId;
		    if (recordId) return this.jsxfileupload[recordId].getFileInputFieldValue();
		    else return null;
		}else{
	    	return this.getFileInputFieldValue();
	  	}
    }
	
    /** End of methods inherited from jsx3.gui.Matrix.EditMask **/

    
    //Used to remove the value of the file uplaod input field
    FileUpload_prototype.setEmptyValue = function(){
		var objGUI = this.getRendered();
		var fileInput = objGUI.ownerDocument.getElementById("IntalioInternal_FileUploadInput_"+this.getId());
		if(fileInput){
		    fileInput.value = null;
		}
    }
	
	FileUpload_prototype._initialize = function(){
		this.jsxfileupload = (this.jsxfileupload) ? this.jsxfileupload : {};
		if(!com.intalio.ria.FileUpload.jsxiframe){
			com.intalio.ria.FileUpload.jsxiframe = new jsx3.gui.IFrame("IntalioInternal_FileUploadHiddenIFrame");	
		}
		objColumn = this.getParent();
		if(objColumn.isType('jsx3.gui.Matrix.Column')){
			var matrixAncestor = objColumn.getParent();
			recordIds = matrixAncestor.getRecordIds();
			if(matrixAncestor.getAutoRow() == jsx3.Boolean.TRUE){
				recordIds.push('jsxautorow');
			}	
			for(i=0;i<recordIds.length;i++){
			    this._addControlForRecord(recordIds[i]);
			}
		}
		
		if(!FileUpload.jsxiframe.getRendered()){
			FileUpload.jsxiframe.setDisplay(jsx3.gui.Block.DISPLAYNONE);
			var root = this.getServer().getRootBlock();
			root.setChild(FileUpload.jsxiframe);
			jsx3.html.insertAdjacentHTML(root.getRendered(), "beforeEnd", FileUpload.jsxiframe.paint());
		}
	}
	
	FileUpload_prototype._addControlForRecord = function(recordId,bRepaint){
		if(!this.jsxfileupload) this.jsxfileupload = {};
		if(!this.jsxfileupload[recordId]){
			this.jsxfileupload[recordId] = new com.intalio.ria.FileUpload();
			this.setChild(this.jsxfileupload[recordId]);
			this.jsxfileupload[recordId].setDisplay(jsx3.gui.Block.DISPLAYNONE);
			this.jsxfileupload[recordId].setMatrixRecordId(recordId);
			if(bRepaint){
				jsx3.html.insertAdjacentHTML(this.getRendered(), "beforeEnd", this.jsxfileupload[recordId].paint());
			}
		}
	}
	
	FileUpload_prototype._removeControlOfRecord = function(recordId,bRepaint){
		if(!this.jsxfileupload) this.jsxfileupload = {};
		if (this.jsxfileupload[recordId]) {
			if(bRepaint){
				var node = this.jsxfileupload[recordId].getRendered();
				if(node) jsx3.html.removeNode(node);
		    	if(this.jsxfileupload[recordId]) delete this.jsxfileupload[recordId];	
			}
			this.removeChild(this.jsxfileupload[recordId]);
		}
	}
	
	FileUpload_prototype._getElementById = function(strId){
	  	var doc = this.ownerDocument || (this.getElementById ? this : null);
	  	if (doc == null) doc = this.getDocument();
		return (doc != null) ? doc.getElementById(strId) : null;
  	}
	
});

