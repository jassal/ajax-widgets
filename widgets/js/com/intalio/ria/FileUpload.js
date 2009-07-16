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
   * disallow setting the value of the file input (security violation)
   */
  FileUpload_prototype.setValue = function(strValue) {};
});

