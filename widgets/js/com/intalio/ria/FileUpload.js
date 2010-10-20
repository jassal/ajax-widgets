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
    var html = '<form name="IntalioInternal_FileUploadForm_' + id + '" ' +
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
               '</iframe>';
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
  }
  
  
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
});

