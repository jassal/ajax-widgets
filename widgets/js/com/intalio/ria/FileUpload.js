/*
 *  Copyright (C) 2009, Intalio Inc.
 *
 *  The program(s) herein may be used and/or copied only with the
 *  written permission of Intalio Inc. or in accordance with the terms
 *  and conditions stipulated in the agreement/contract under which the
 *  program(s) have been supplied.
 */
jsx3.require("jsx3.gui.Form", "jsx3.gui.Block");

jsx3.lang.Class.defineClass("com.intalio.ria.FileUpload", jsx3.gui.Block, [jsx3.gui.Form], function(FileUpload,FileUpload_prototype) {

  var fileName = "";
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
    var html = "";
    var matrixParent = this.getAncestorOfType(jsx3.gui.Matrix);
    if(matrixParent){
	//construction of html suitable for matrix taking into consideration the
	//the CDF records already present
	this._recordIdFormNameMap = {};
	this._recordIdIFrameNameMap = {};
	var newId, recordId, recordIds = matrixParent.getRecordIds();
	if(matrixParent.getAutoRow() == jsx3.Boolean.TRUE){
	    recordId = 'jsxautorow';
	    newId = this.getId()+"_"+recordId;
	    html += '<div>' + this.__getMatrixFileUploadHTMLFragment(newId) + '</div>';
	    this._recordIdFormNameMap[recordId] = 'IntalioInternal_FileUploadForm_' + newId;
	    this._recordIdIFrameNameMap[recordId] = 'IntalioInternal_FileUploadHiddenIFrame_' + newId;
	}
	for(var i=0;i<recordIds.length;i++){
	    recordId = recordIds[i];
	    newId = this.getId()+"_"+recordId;
	    html += '<div>' + this.__getMatrixFileUploadHTMLFragment(newId) + '</div>';
	    this._recordIdFormNameMap[recordId] = 'IntalioInternal_FileUploadForm_' + newId;
	    this._recordIdIFrameNameMap[recordId] = 'IntalioInternal_FileUploadHiddenIFrame_' + newId;
	}
    } else{
     html = '<div><form name="IntalioInternal_FileUploadForm_' + id + '" ' +
	   'target="IntalioInternal_FileUploadHiddenIFrame_' + id + '" ' +
	   'action="/gi/fileupload" method="post" enctype="multipart/form-data">' +
	 '<input name="attachmentFile" type="file" ' +
	     'id="IntalioInternal_FileUploadInput_' + id + '" ' +
	     this.paintInputSize() + '/>' +
	 '<label name="attachmentFileLabel" id="IntalioInternal_FileUploadInputLabel_' +
	     id + '" ' + '>' + fileName + '</label>' +
	 '<input type="hidden" name="participantToken" value="" ' +
	     'id="IntalioInternal_FileUploadToken_' + id + '"/>' +
       '</form>' +
       '<iframe name="IntalioInternal_FileUploadHiddenIFrame_' + id + '" ' +
	   'id="IntalioInternal_FileUploadHiddenIFrame_' + id + '" ' +
	   'src="about:blank" style="display:none;">' +
       '</iframe></div>';
    }
    return this.jsxsuper(html);
  };
  
  /**
   * paint input size
   */
  FileUpload_prototype.paintInputSize = function() {
    var size = this.getInputSize();
    if (isNaN(size)) {
      size = 40;
    } else {
      size = parseInt(size);
    }
    
    return ' size="' + size + '"';
  };
  
  /**
   * input size
   */
  FileUpload_prototype.getInputSize = function() {
    return;
  };  
  
  /**
  * validation
  */
  FileUpload_prototype.doValidate = function() {
	this.setValidationState(1);
	var objGUI = this.getRendered();
    if (objGUI != null) {
		if(this.getRequired()){
			var inputElem = objGUI.ownerDocument.getElementById("IntalioInternal_FileUploadInput_"+this.getId());
			if(!inputElem.value) this.setValidationState(0);
		}			
	}
	return this.getValidationState();
  };
  
  
  /**
   * gets the url value returned from the server 
   */
  FileUpload_prototype.getValue = function() {
    var retval = "";
    
    var objGUI = this.getRendered();
    if (objGUI != null) {
      var frame = objGUI.ownerDocument.getElementById("IntalioInternal_FileUploadHiddenIFrame_" + this.getId());
      if (frame != null) {
        // cross-browser method to access iframe document
        var doc = frame.contentWindow || frame.contentDocument;
        if (doc.document) {
          doc = doc.document;
        }          
 
        if (doc != null) {
          var body = doc.body.innerHTML;
          if (body.length > 4 && body.indexOf("OK: ") == 0) {
            var url = body.substr(4);
            retval = url.trim();
          }
        }
      }
    }

    return retval;
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
	      fileName = labelValue;
	  }
      }
  };
  
    // retruns the fragment that needs to be added corresponding to each record in a matrix
    FileUpload_prototype.__getMatrixFileUploadHTMLFragment = function(id) {
	var html = '<form name="IntalioInternal_FileUploadForm_' + id + '" ' +
			'target="IntalioInternal_FileUploadHiddenIFrame_' + id + '" ' +
			'action="/gi/fileupload" method="post" enctype="multipart/form-data" style="display:none;">' +
				'<input name="attachmentFile" type="file"  ' +
				'id="IntalioInternal_FileUploadInput_' + id + '" ' +
				this.paintInputSize() + '/>' +
				'<input type="hidden" name="participantToken" value="" ' +
				'id="IntalioInternal_FileUploadToken_' + id + '"/>' +
			'</form>'+
			'<iframe name="IntalioInternal_FileUploadHiddenIFrame_' + id + '" ' +
			    'id="IntalioInternal_FileUploadHiddenIFrame_' + id + '" ' +
			    'src="about:blank" style="display:none;">' +
			'</iframe>';
	return html;
    };

    //adds the new file uplaod fragment corresponding to a new record to the DOM
    FileUpload_prototype.__addFileUploadForRecord = function(recordId){
	var objGUI = this.getRendered();
	var _newDiv = objGUI.ownerDocument.createElement('div');
	var id = this.getId()+"_"+recordId;
	objGUI.appendChild(_newDiv);
	_newDiv.innerHTML = this.__getMatrixFileUploadHTMLFragment(id);
	//this.__addCustomMethodToFrames();
	return id;
    };

    FileUpload_prototype.__addCustomMethodToFrames = function(){
	var __me = this, frame ,
	frames = this.__getDOMElements([{tagName: 'DIV'},{tagName: 'IFRAME'}]);
	for(var i = 0; i < frames.length; i++){
	    frame = frames[i].element;
	    frame.__updateMatrixRecordValues = function(){
		__me.__syncMatrixRecordValues();
	    }
	}
    }
    
    //matrix event listener
    FileUpload_prototype.matrixEventCallback = function(objEvent){	
	try{
	    switch(objEvent.subject){
		case jsx3.gui.Interactive.BEFORE_APPEND: // before a record is added to the matrix
		    var record = objEvent.context.objRECORD;
		    var recordId = record.jsxid;
		    var newId = this.__addFileUploadForRecord(recordId);

		    var temp = this._recordIdFormNameMap['jsxautorow'];
		    this._recordIdFormNameMap['jsxautorow'] = 'IntalioInternal_FileUploadForm_' + newId;
		    this._recordIdFormNameMap[recordId] = temp;

		    temp = this._recordIdIFrameNameMap['jsxautorow'];
		    this._recordIdIFrameNameMap['jsxautorow'] = 'IntalioInternal_FileUploadHiddenIFrame_' + newId;
		    this._recordIdIFrameNameMap[recordId] = temp;		    
		    break;
		case jsx3.gui.Interactive.AFTER_APPEND: //after a record is added to the matrix
		    //nothing to do
		    break;
		case jsx3.gui.Interactive.BEFORE_EDIT: // before a cell is opened in edit mode
		    var recordId = objEvent.context.strRECORDID;
		    this._matrixCurrentRecord = recordId;

		    var curForm, parentDiv;
		    var forms = this.__getDOMElements([{tagName: 'DIV'},{tagName: 'FORM'}]);
		    
		    if(forms){
			for(var i=0; i<forms.length; i++){
			    if(forms[i] && forms[i].element){
				curForm = forms[i].element;
				parentDiv = forms[i].parent;
				parentDiv.style.display = "none";
				curForm.style.display = "none";
				if(curForm.getAttribute("name") == this._recordIdFormNameMap[recordId]){
				    parentDiv.style.display = "block";
				    curForm.style.display = "block";
				}
			    }
			}
		    }
		    break;
		case jsx3.gui.Interactive.AFTER_EDIT: //after completion of editing of a cell
		    var forms = this.__getDOMElements([{tagName: 'DIV'},{tagName: 'FORM'}]);
		    if(forms){
			for(var i=0; i<forms.length; i++){
			    if(forms[i] && forms[i].element){
				curForm = forms[i].element;
				curForm.style.display = "none";
			    }
			}
		    }

		    break;		
		case 'recordDeleted': //custom event, triggering mechanism added in the matrix table prototype xml
		    var recordId = objEvent.context.strRECORDID;
		    var _name = this._recordIdFormNameMap[recordId];
		    var _form = this.__getDOMElement([{
			tagName: 'DIV'
		    },
		    {
			tagName: 'FORM',
			attrName:'name',
			attrValue:_name
		    }]);
		    
		    var _div = _form.parent;
		    _div.parentNode.removeChild(_div);
		    delete this._recordIdFormNameMap[recordId];
		    delete this._recordIdIFrameNameMap[recordId];
		    break;
	    }
	    
	    this.__addCustomMethodToFrames();

	}catch(e){
	    //nothing to do
	}
	return true;
    }

    /** Start of methods inherited from jsx3.gui.Matrix.EditMask **/
    FileUpload_prototype.emInit = function(objColumn) {
	this.jsxsupermix(objColumn);
	var matrixParent = this.getAncestorOfType(jsx3.gui.Matrix);
	if(matrixParent){
	    //subscribing an event listener to all the events published by the matrix parent
	    matrixParent.subscribe("*",this,"matrixEventCallback");
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

	//this.emSetValue(strValue);

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


    FileUpload_prototype.getMaskValue = function(){
	return this.__getValue()
    }
    /** End of methods inherited from jsx3.gui.Matrix.EditMask **/

    
    //Returns the value of input field before the form submission
    FileUpload_prototype.__getValue = function(/*optional*/inRecordId){
	var matrixParent = this.getAncestorOfType(jsx3.gui.Matrix);
	if(matrixParent){
	    var recordId;
	    if(inRecordId){
		recordId = inRecordId;
	    }else{
		var es = this.emGetSession();
		recordId = es.recordId;
	    }
	    if (recordId){
		var formName = this._recordIdFormNameMap[recordId];
		var fileInput = this.__getDOMElement([{
		    tagName: 'DIV'
		},
		{
		    tagName: 'FORM',
		    attrName:'name',
		    attrValue:formName
		},
		{
		    tagName: 'INPUT',
		    attrName:'type',
		    attrValue:'file'
		}]);
		return ((fileInput) ? fileInput.element.value : null);
	    }
	    else{
		return null;
	    }
	}else{
	    var fileInput = this.__getDOMElement([
		    {tagName: 'DIV'},
		    {tagName: 'FORM'},
		    {tagName: 'INPUT', attrName:'type', attrValue:'file'}]);

	    return ((fileInput) ? fileInput.element.value : null);
	  }
    }

    FileUpload_prototype.__getValueFromIframe = function(recordId) {
	var retval = "";
	var iFrameName = this._recordIdIFrameNameMap[recordId];
	var frame = this.__getDOMElement([
	{   tagName: 'DIV'  },
	{
	    tagName: 'IFRAME',
	    attrName:'name',
	    attrValue:iFrameName
	}]);

	frame = frame.element;
	if (frame) {
	    // cross-browser method to access iframe document
	    var doc = frame.contentWindow || frame.contentDocument;
	    if (doc.document) {
		doc = doc.document;
	    }

	    if (doc != null) {
		var body = doc.body.innerHTML;
		if (body.length > 4 && body.indexOf("OK: ") == 0) {
		    var url = body.substr(4);
		    retval = url.trim();
		}
	    }
	}
	return retval;
    };
    
    //Used to remove the value of the file uplaod input field
    FileUpload_prototype.setEmptyValue = function(){
	var objGUI = this.getRendered();
	var fileInput = objGUI.ownerDocument.getElementById("IntalioInternal_FileUploadInput_"+this.getId());
	if(fileInput){
	    fileInput.value = null;
	}
	return this;
    }

    //Helper method used to sync the values of the records of the matrix
    //with the values of the file upload controls
    FileUpload_prototype.__syncMatrixRecordValues = function(){
	if(!this._recordIdFormNameMap){
	    return false;
	}
	var matrix = this.getAncestorOfType(jsx3.gui.Matrix);
	for(var i in this._recordIdFormNameMap){
	    //variable i will contain the record ID
	    if(matrix.getRecordNode(i)){
		//get the value from the corresponding iframe and put in the record
		val = this.__getValueFromIframe(i);
		//using the setValueForRecord of column to update the corresponding record
		this.getParent().setValueForRecord(i,val);

	    }else{
		delete this._recordIdFormNameMap[i];
		delete this._recordIdIFrameNameMap[i];
	    }
	}
    };
    
    /************* Start of helper function used for DOM search *************/
     FileUpload_prototype.__getDOMElement = function(/*array*/path,findInside){
	var matches = this.__getDOMElements(path,findInside);
	if(matches){
	    return matches[0];
	} else{
	    return false;
	}
    };

    FileUpload_prototype.__getDOMElements = function(/*array*/path,findInside){
	if(!findInside) findInside = this.getRendered();
	var elems, parents = [findInside];
	for(var i=0; i < path.length; i++){
	    elems = this.__getDOMMatches(path[i],parents);
	    if(elems){
		//change the parents array for the next iteration
		parents = [];
		for(j=0; j < elems.length; j++){
		    if(elems[j].element){
			parents.push(elems[j].element);
		    }
		}
	    }
	    else{		
		return false;
	    }
	}
	return elems;
    };

    FileUpload_prototype.__getDOMMatches = function(pathItem,/*array*/findInside){
	var elems = [],matches=false,j;
	for(var i=0;i<findInside.length;i++){
	    matches = this.__getDOMMatchesHelper(pathItem,findInside[i]);
	    if(matches){
		for(j=0;j<matches.length;j++){
		    elems.push(matches[j]);
		}
	    }
	}
	return elems;
    };


    /**
   * Helper method used to get the elements in the File uplaod component
   **/
    FileUpload_prototype.__getDOMMatchesHelper = function(pathItem, parent){	
	var outArr = [], foundTheOne, child;
	if(parent && parent.childNodes){
	    for(var i = 0 ; i < parent.childNodes.length ; i++){
		child = parent.childNodes[i];
		if(this.__isDOMMatch(pathItem,child)){
		    foundTheOne = true;
		    outArr.push({
			element:child,
			parent:parent,
			index:i
		    })
		}
	    }
	}

	if(foundTheOne){
	    return outArr;
	}
	else{	    
	    return false;
	}
    };

    FileUpload_prototype.__isDOMMatch = function(pathItem,htmlelement){
	var tagFound = (pathItem.tagName && (htmlelement.tagName.toUpperCase() == pathItem.tagName.toUpperCase())) || (!pathItem.tagName);
	var attrFound = ( pathItem.attrName && (htmlelement.getAttribute(pathItem.attrName) == pathItem.attrValue)) || (!pathItem.attrName);
	if(tagFound && attrFound){
	    return true;
	}
	else{
	    return false;
	}
    };
    /************* End of helper function used for DOM search ****************/

});

