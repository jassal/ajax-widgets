/*
 *  Copyright (C) 2009, Intalio Inc.
 *
 *  The program(s) herein may be used and/or copied only with the
 *  written permission of Intalio Inc. or in accordance with the terms
 *  and conditions stipulated in the agreement/contract under which the
 *  program(s) have been supplied.
 */
jsx3.require("jsx3.gui.Painted", "jsx3.gui.Form", "jsx3.gui.Event",
             "jsx3.gui.TextBox", "jsx3.gui.Slider", "jsx3.gui.ColorPicker", 
             "jsx3.gui.RadioButton", "jsx3.gui.CheckBox", "jsx3.gui.Matrix", 
             "com.intalio.ria.Section");

jsx3.lang.Class.defineClass("com.intalio.ria.Field", jsx3.gui.Painted, [], function(Field,Field_prototype) {

  Field.DISPLAYBLOCK = "";
  Field.DISPLAYNONE = "none";        
        
  Field.SHOW_VALIDATION_YES = "yes";
  Field.SHOW_VALIDATION_NO = "no";
  
  Field.LAYOUT_VERTICAL = "vertical";
  Field.LAYOUT_HORIZONTAL = "horizontal";
      
  /**
   * main method
   */
  Field_prototype.init = function(strName) {
    this.jsxsuper(strName);
  };

  /**
   * paint
   */
  Field_prototype.paint = function() {
    var html = '<div id="' + this.getId() + '"' + this.paintCssClass() + '>' + 
                   '<table cellpadding="0" cellspacing="0" class="field">' +
                   '<tr>' + 
                       this.paintLabel() +
                       this.paintRequired() +
                       this.paintInput() +
                   '</tr>' + 
                   '</table>' + 
               '</div>';
    return html;
  };
  
  Field_prototype.onAfterPaint = function() {
    this.validate();   
  };
  
  /**
   * handle the adding of children, field and section are rejected
   */
  Field_prototype.onSetChild = function(objChild) {
    if (objChild.instanceOf(com.intalio.ria.Section) || objChild.instanceOf(com.intalio.ria.Field)) {
      return false;
    }
    return true;
  };

  /**
   * forces a repaint after a child is added, adding a child doesnt get painted 
   * correctly, it has something to do with the CSS
   */
  Field_prototype.viewUpdateHook = function(objChild, bGroup) {
    this.jsxsuper(objChild, bGroup);
    this.repaint();
  };
  
  /**
   * forces a repaint when a child is removed, same issue as adding a child,
   * it doesnt get painted correctly, so must force a repaint
   */
  Field_prototype.onRemoveChild = function(objChild, intIndex) {
    this.jsxsuper(objChild, intIndex);
    this.repaint();
  };
  
  /**
   * paints an asterisk if any input is required on this field object
   */
  Field_prototype.paintRequired = function() {
    var isRequired = false;
    var children = this.getDescendantsOfType(jsx3.gui.Form);
    for (var x = 0; x < children.length; x++) {
      if (children[x].getRequired() == jsx3.gui.Form.REQUIRED) {
        isRequired = true;
        break;
      }
    }
    
    return '<td class="required-column">' + 
               '<span class="required">' + (isRequired ? '*' : '') + '</span>' + 
           '</td>';  
  };
  
  /**
   * paint the input fields for this object
   */
  Field_prototype.paintInput = function(isRequired) {
    var str = "";
    var layout = (this.getLayoutDirection() == Field.LAYOUT_HORIZONTAL ? 
                  "horizontal-layout" : "vertical-layout");
    
    var children = this.getChildren();
    for (var x = 0; x < children.length; x++) {
      var child = children[x];
      var paint = child.paint();
      var value = null;
      
      // slider and color picker get a display value
      if (child.instanceOf(jsx3.gui.Slider)) {
        value = com.intalio.ria.sliderValue(child);
      }
      
      if (child.instanceOf(jsx3.gui.ColorPicker)) {
        value = com.intalio.ria.colorPickerValue(child);
      }
      
      if (value != null) {
          paint = '<span class="nowrap">' + 
                      paint + 
                      '<span id="' + child.getId() + '_value" class="value">' +
                          value +
                      '</span>' + 
                  '</span>';
      }
      
      str = str + '<span class="' + layout + '">' + paint + '</span>';   
    }
    
    return '<td class="input-column">' + 
               str + 
               this.paintErrorMessage(isRequired) + 
           '</td>';  
  };
  
  /**
   * validation
   */
  Field_prototype.setShowValidation = function(VALIDATION, bRepaint) {
    this.riaShowValidation = VALIDATION;
    if (bRepaint) {
      this.repaint();
    } 
    return this;
  };
  
  Field_prototype.getShowValidation = function() {
    if (this.riaShowValidation == Field.SHOW_VALIDATION_NO) {
      return Field.SHOW_VALIDATION_NO;
    }
    
    return Field.SHOW_VALIDATION_YES;
  };  
  
  Field_prototype.validate = function(objGui, objEVENT, intCHECKED) {
    if (this.getShowValidation() == Field.SHOW_VALIDATION_NO) {
      return;
    }
    
    var radioGroupName = null;
    
    // objGui is usually only null when validate() is called in onAfterPaint
    
    if (objGui != null) {
      // This is needed because a radio/checkbox click does not set its value 
      // until after the event has completed.  This routine is called during
      // the event, so it may seem like the radio/checkbox is invalid when in 
      // fact it will be valid once the event completes.
      if (objGui.instanceOf(jsx3.gui.RadioButton)) {
        if (objEVENT != null && objEVENT.getType() == jsx3.gui.Event.CLICK) {
          radioGroupName = objGui.getGroupName();
        }
      }
    }
    
    var valid = true;
    var children = this.getDescendantsOfType(jsx3.gui.Form);
    for (var x = 0; x < children.length; x++) {
      var child = children[x];
      if (child.instanceOf(jsx3.gui.RadioButton)) {
        // no need to validate this radiogroup b/c it will always be valid
        if (child.getGroupName() == radioGroupName) {
          continue;
        }
      } else if (child.instanceOf(jsx3.gui.CheckBox)) {
        // if child == objGui and its checked then no need to validate
        if (objGui != null && objGui.getId() == child.getId()) {
          if (intCHECKED == jsx3.gui.CheckBox.CHECKED) {
            continue;
          }
        }
      } else if (child.instanceOf(jsx3.gui.Matrix)) {
          if (child.getXML().getChildNodes().getLength() > 0) {
            continue;
          }
      }
      
      // try/catch block is needed b/c some Form objects dont impliment the 
      // doValidate method, this is actually a GI bug I believe
      try {
        if (child.doValidate() == jsx3.gui.Form.STATEINVALID) {
          valid = false;
          break;
        }
      } catch(e) {;}
    }
    
    this.displayValidation(valid);
    
    // this method should not return a value b/c its called from JS events,
    // if it returns false for instance then the event may not fire properly
  };
  
  Field_prototype.displayValidation = function(valid) {
    var rendered = this.getRendered();
    if (rendered == null) return;
    
    var obj = rendered.ownerDocument.getElementById(this.getId() + "_error_img");
    if (obj != null) {
      var display = (valid ? "none" : "inline-block");
      obj.style["display"] = display;
    }
    
    var obj = rendered.ownerDocument.getElementById(this.getId() + "_error_text");
    if (obj != null) {
      var display = (valid ? "none" : "block");
      obj.style["display"] = display;
    }    
  };     
  
  /**
   * field layout
   */
  Field_prototype.setLayoutDirection = function(LAYOUT, bRepaint) {
    this.riaLayoutDirection = LAYOUT;
    if (bRepaint) {
      this.repaint();   
    }        
    return this;
  };

  Field_prototype.getLayoutDirection = function() {
    if (this.riaLayoutDirection == Field.LAYOUT_VERTICAL) {
      return Field.LAYOUT_VERTICAL;
    }
      
    return Field.LAYOUT_HORIZONTAL; 
  };
  
  /**
   * css class
   */
  Field_prototype.paintCssClass = function() {
    return (this.riaCssClass == null ? '' : ' class="' + this.riaCssClass + '"');
  };  
  
  Field_prototype.setCssClass = function(strCssClass, bUpdateView) {
    this.riaCssClass = strCssClass;
    if (bUpdateView) {
      this.repaint();   
    }        
    return this;
  };
  
  Field_prototype.getCssClass = function() {
      return this.riaCssClass;
  };
  
  /**
   * label
   */
  Field_prototype.paintLabel = function(isRequired) {
    var forStr = '';
    var child = this.getFirstChild();
    if (child != null && child.instanceOf(jsx3.gui.TextBox)) {
      forStr = ' for="' + child.getId() + '"';
    }
    
    return '<td class="label-column">' + 
               '<span class="label-images">' + 
                   this.paintErrorImage(isRequired) + 
                   this.paintHelpImage() +
               '</span>' +
               '<label' + forStr + '>' + 
                   this.riaLabelText + 
               '</label>' + 
           '</td>';
  };
  
  Field_prototype.setLabelText = function(strText, bRepaint) {
    this.riaLabelText = strText;
    if (bRepaint) {
      this.repaint();   
    }
    return this;
  };  
  
  Field_prototype.getLabelText = function() {
    return this.riaLabelText;
  };
  
  /**
   * help image
   */
  Field_prototype.paintHelpImage = function() {
    if (this.riaHelpImageTip == null || this.riaHelpImageTip == "" || this.riaHelpImageSrc == null || this.riaHelpImageSrc == "") {
      return '';
    }
    
    var image = this.getUriResolver().resolveURI(this.riaHelpImageSrc);
    return '<span title="' + this.riaHelpImageTip + '"><img class="help" src="' + image + '"/></span>';
  };
   
  Field_prototype.setHelpImageSrc = function(srcSrc, bRepaint) {
    this.riaHelpImageSrc = srcSrc;
    if (bRepaint) {
      this.repaint();   
    }    
    return this;
  };

  Field_prototype.getHelpImageSrc = function() {
    return this.riaHelpImageSrc;
  };
  
  Field_prototype.setHelpImageTip = function(strTip, bRepaint) {
    this.riaHelpImageTip = strTip;
    if (bRepaint) {
      this.repaint();   
    }    
    return this;
  };
  
  Field_prototype.getHelpImageTip = function() {
    return this.riaHelpImageTip;
  };    

  /**
   * error image
   */
  Field_prototype.paintErrorImage = function() {
    if (this.getShowValidation() == Field.SHOW_VALIDATION_NO || this.riaErrorImageSrc == null || this.riaErrorImageSrc == "") {
      return '';   
    }
    
    var image = this.getUriResolver().resolveURI(this.riaErrorImageSrc);
    return '<img id="' + this.getId() + '_error_img" class="error" src="' + image + '"/>';
  };
  
  Field_prototype.setErrorImageSrc = function(srcSrc, bRepaint) {
    this.riaErrorImageSrc = srcSrc;      
    if (bRepaint) {
      this.repaint();   
    }        
    return this;
  };

  Field_prototype.getErrorImageSrc = function() {
    return this.riaErrorImageSrc;
  };

  /**
   * error message
   */
  Field_prototype.paintErrorMessage = function() {
    if (this.getShowValidation() == Field.SHOW_VALIDATION_NO || this.riaErrorMessageText == null || this.riaErrorMessageText == "") {
      return '';   
    }      
    
    return '<span id="' + this.getId() + '_error_text" class="error">' + this.riaErrorMessageText + '</span>';
  };
  
  Field_prototype.setErrorMessageText = function(strText, bRepaint) {
    this.riaErrorMessageText = strText;
    if (bRepaint) {
      this.repaint();
    }        
    return this;
  };
  
  Field_prototype.getErrorMessageText = function() {
    return this.riaErrorMessageText;
  };  
  
  Field_prototype.getDisplay = function() {
    return this.riaDisplay;
  };

  Field_prototype.setDisplay = function(DISPLAY, bUpdateView) {
    if (this.riaDisplay != DISPLAY) {
      //update the model
      this.riaDisplay = DISPLAY;

      //immediately update the view if user passed true for bUpdateView
      if (bUpdateView) {
        if (DISPLAY == Field.DISPLAYNONE) {
          jsx3.html.persistScrollPosition(this.getRendered());
        }
        
        com.intalio.ria.setCssValue(this, "display", DISPLAY);
        
        if (DISPLAY != Field.DISPLAYNONE) {
          // call method to tell any descendants that the view was restored
          jsx3.gui.Painted._onAfterRestoreViewCascade(this,this.getRendered());
          jsx3.html.restoreScrollPosition(this.getRendered());
        }
      }
    }
    
    return this;
  };
  
  /**
   * auto set value labels
   */
  Field_prototype.setValue = function(objGui, value) {
    com.intalio.ria.setValue(objGui, value);
  };
});

