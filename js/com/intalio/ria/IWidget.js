/*
 *  Copyright (C) 2009, Intalio Inc.
 *
 *  The program(s) herein may be used and/or copied only with the
 *  written permission of Intalio Inc. or in accordance with the terms
 *  and conditions stipulated in the agreement/contract under which the
 *  program(s) have been supplied.
 */
 jsx3.require("com.intalio.ria.Image");
 
jsx3.Class.defineInterface("com.intalio.ria.IWidget", null, function(IWidget, IWidget_prototype) {

  IWidget_prototype.paintDiv = function(strId, strHtml) {
    var html = "<div id='" + strId + "'" + 
                  this.paintCSSClass() + ">" + 
                  this.paintLabel(strId) + 
                  strHtml + 
                  this.paintHelpImage() + 
                  this.paintErrorImage() + 
                  this.paintErrorMessage() + 
               "</div>";
    return html;
  };        
        
  /**
   * disallow adding children to this object
   */
  IWidget_prototype.onSetChild = function(objChild) {
      return false;
  }; 
  
  /**
   * css class
   */
  IWidget_prototype.paintCSSClass = function() {
    var cssClass = this.getCSSClass();
    return (cssClass == null ? "" : " class='" + cssClass + "'");
  };  
  
  IWidget_prototype.getCSSClass = function() {
      return "field";
  };
  
  /**
   * label
   */
  IWidget_prototype.paintLabel = function(strId) {
    return "<label for='" + strId + "'>" + this.riaLabelText + "</label>";  
  };
  
  IWidget_prototype.setLabelText = function(strText, bRepaint) {
    this.riaLabelText = strText;
    if (bRepaint) {
      this.getParent().repaint();   
    }
    return this;
  };  
  
  IWidget_prototype.getLabelText = function() {
    return this.riaLabelText;
  };
  
  /**
   * help image
   */
  IWidget_prototype.paintHelpImage = function() {
    return this.getHelpImage().paint();
  };  
  
  IWidget_prototype.getHelpImage = function() {
    if (this.help_image == null) {
      this.help_image = new com.intalio.ria.Image("IntalioInternal.help_image");
      this.help_image.setSrc(this.riaHelpImageSrc);
      this.help_image.setDisplay(this.riaHelpImageTip);
      this.help_image.setDisplay(this.riaHelpImageDisplay);
      this.help_image.setPadding("0 5 0 10");
      this.help_image.setOverflow(jsx3.gui.Block.OVERFLOWHIDDEN);
      this.help_image.setUriResolver(this.getUriResolver());      
    }
    
    return this.help_image;
  };
   
  IWidget_prototype.setHelpImageSrc = function(srcSrc, bRepaint) {
    this.riaHelpImageSrc = srcSrc;
    this.getHelpImage().setSrc(srcSrc);
    if (bRepaint) {
      this.getParent().repaint();   
    }    
    return this;
  };

  IWidget_prototype.getHelpImageSrc = function() {
    return this.riaHelpImageSrc;
  };
  
  IWidget_prototype.setHelpImageTip = function(strTip, bRepaint) {
    this.riaHelpImageTip = strTip;
    this.getHelpImage().setTip(strTip);
    if (bRepaint) {
      this.getParent().repaint();   
    }    
    return this;
  };
  
  IWidget_prototype.getHelpImageTip = function() {
    return this.riaHelpImageTip;
  };  
  
  IWidget_prototype.setHelpImageDisplay = function(DISPLAY, bUpdateView) {
    this.riaHelpImageDisplay = DISPLAY;      
    this.getHelpImage().setDisplay(DISPLAY);
    if (bUpdateView) {
      this.getParent().repaint();   
    }       
    return this;
  };  

  IWidget_prototype.getHelpImageDisplay = function() {
    return this.riaHelpImageDisplay;
  };     
  
  /**
   * error image
   */
  IWidget_prototype.paintErrorImage = function() {
    return this.getErrorImage().paint();
  };  
  
  IWidget_prototype.getErrorImage = function() {
    if (this.error_image == null) {
      this.error_image = new com.intalio.ria.Image("IntalioInternal.error_image");
      this.error_image.setSrc(this.riaErrorImageSrc);
      this.error_image.setDisplay(this.riaErrorImageTip);
      this.error_image.setDisplay(this.riaErrorImageDisplay);      
      this.error_image.setPadding("0 5 0 5");
      this.error_image.setOverflow(jsx3.gui.Block.OVERFLOWHIDDEN);
      this.error_image.setUriResolver(this.getUriResolver());
    }
    
    return this.error_image;
  };
   
  IWidget_prototype.setErrorImageSrc = function(srcSrc, bRepaint) {
    this.riaErrorImageSrc = srcSrc;      
    this.getErrorImage().setSrc(srcSrc);
    if (bRepaint) {
      this.getParent().repaint();   
    }        
    return this;
  };

  IWidget_prototype.getErrorImageSrc = function() {
    return this.riaErrorImageSrc;
  };

  IWidget_prototype.setErrorImageDisplay = function(DISPLAY, bUpdateView) {
    this.riaErrorImageDisplay = DISPLAY;      
    this.getErrorImage().setDisplay(DISPLAY);
    if (bUpdateView) {
      this.getParent().repaint();   
    }        
    return this;
  };  

  IWidget_prototype.getErrorImageDisplay = function() {
    return this.riaErrorImageDisplay;
  };
  
  /**
   * error message
   */
  IWidget_prototype.paintErrorMessage = function() {
    return this.getErrorMessage().paint();
  };  
  
  IWidget_prototype.getErrorMessage = function() {
    if (this.error_message == null) {
      this.error_message = new jsx3.gui.Block("IntalioInternal.error_message");
      this.error_message.setText(this.riaErrorMessageText);
      this.error_message.setDisplay(this.riaErrorMessageDisplay);
      this.error_message.setWidth(this.riaErrorMessageWidth);
      this.error_message.setClassName(this.riaErrorMessageCSSClass);
      this.error_message.setOverflow(jsx3.gui.Block.OVERFLOWHIDDEN);
    }
    
    return this.error_message;
  };
  
  IWidget_prototype.setErrorMessageText = function(strText, bRepaint) {
    this.riaErrorMessageText = strText;
    this.getErrorMessage().setText(strText);
    if (bRepaint) {
      this.getParent().repaint();   
    }        
    return this;
  };
  
  IWidget_prototype.getErrorMessageText = function() {
    return this.riaErrorMessageText;
  };  

  IWidget_prototype.setErrorMessageWidth = function(vntWidth, bUpdateView) {
    this.riaErrorMessageWidth = vntWidth;
    this.getLabel().setWidth(vntWidth);
    if (bUpdateView) {
      this.getParent().repaint();
    }    
    return this;      
  };
  
  IWidget_prototype.getErrorMessageWidth = function() {
    return this.riaErrorMessageWidth;
  };  
  
  IWidget_prototype.setErrorMessageDisplay = function(DISPLAY, bUpdateView) {
    this.riaErrorMessageDisplay = DISPLAY;
    this.getErrorMessage().setDisplay(DISPLAY);
    if (bUpdateView) {
      this.getParent().repaint();   
    }
    return this;
  };  

  IWidget_prototype.getErrorMessageDisplay = function() {
    return this.riaErrorMessageDisplay;
  };    
});

