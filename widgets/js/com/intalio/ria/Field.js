/*
 *  Copyright (C) 2009, Intalio Inc.
 *
 *  The program(s) herein may be used and/or copied only with the
 *  written permission of Intalio Inc. or in accordance with the terms
 *  and conditions stipulated in the agreement/contract under which the
 *  program(s) have been supplied.
 */

/**
 * Replaced use of 
 * 1) jsx3.app.Model's getAncestorOfType() with getAncestorOfTypeNew()
 * 2) jsx3.app.Model's getDescendantsOfType() with getDescendantsOfTypeNew()
 * 3) jsx3.lang.Object's instanceOf() with isType()
 * to prevent fetching of unnecessary classes using jsx3.require()  
 */
jsx3.require("jsx3.gui.Block",       "jsx3.gui.Painted",     "jsx3.gui.Interactive",
             "jsx3.gui.Form",        "jsx3.gui.Event");

jsx3.lang.Class.defineClass("com.intalio.ria.Field", jsx3.gui.Block, [], function(Field,Field_prototype) {

  var Event = jsx3.gui.Event;
  var Interactive = jsx3.gui.Interactive;        
        
  Field.SHOW_VALIDATION_YES = "yes";
  Field.SHOW_VALIDATION_NO = "no";
  
  Field.LAYOUT_VERTICAL = "vertical";
  Field.LAYOUT_HORIZONTAL = "horizontal";

  Field.HELP_IMG_POS_BF = "Before Field";
  Field.HELP_IMG_POS_AF = "After Field";

  /**
   * main method
   */
  Field_prototype.init = function(strName,vntLeft,vntTop,vntWidth,vntHeight) {
    this.jsxsuper(strName,vntLeft,vntTop,vntWidth,vntHeight);
  };

  /**
   * paint
   */
  Field_prototype.paint = function() {
    this.applyDynamicProperties();
    // this is needed for legacy reasons
    if (this.riaCssClass != null) {
        this.setClassName(this.riaCssClass);
        this.riaCssClass = null;
        this.setWidth("100%");
    }
    
    var html = '<table cellpadding="0" cellspacing="0" class="field">' +
               '<tr>' + this.paintLabelColumn() + this.paintRequired();
    if(this.getHelpImagePos() == Field.HELP_IMG_POS_AF)
        html += this.paintInput() +
                '<td>' + this.paintHelpImage() +
                '</td></tr></table>';
    else if(this.getHelpImagePos() == Field.HELP_IMG_POS_BF)
        html += '<td>' + this.paintHelpImage() +
                '</td>' + this.paintInput() +
                '</tr></table>';
    return this.paintBlock(html);
  };
  
  /**
   * Returns the DHTML, used for this object's on-screen view
   * @param strData {String} Text/HTML markup that will replace value of getText() during paint&#8212;typically passed by subclass, JSXBlockX after it performs an XML/XSL merge to acquire its data; for memory management purposes, the data is not set via setText() and, instead, is passed as a temporary input parameter, as the object's model would contain the text for no reason
   * @return {String} DHTML
   */
  Field_prototype.paintBlock = function(strData) {
    //apply any dynamic properties that this instance has registered
    //apply twice?  what to do with dp types that affect layout that should be applied during box profiling and those that apply to the "skinning/surfacing" of an object
    //this.applyDynamicProperties();

    //if paint method called by subclass instance--an instance of JSXBlockX, use strData, not this.getText();
    strData = (strData == null) ? this.paintText() : strData;

    //determine CSS style attributes unique to this JSXBlock instance
    var strId = this.getId();

    //bind programmatic listeners for drag, drop, spy, key, and move operations; either or; not both due to incompatibilities (some of these share the mousedown and therefore can collide--hence the if statement)
    //rules:  (Spyglass && (Move || Menu || Drag/Drop) && keydown)
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
      strSuppl += ' JSXDragId="' + strId + '" JSXDragType="JSX_GENERIC"';
    }

    //get custom 'view' properties(custom props to add to the rended HTML tag)
    var strEvents = this.renderHandlers(eventMap, 0) + strSuppl;
    var strAttributes = this.renderAttributes(null, true);

    //render the outer-most box
    var b1 = this.getBoxProfile(true);
    b1.setAttributes(this.paintIndex() + this.paintTip() + strEvents + ' id="' + strId + '"' + this.paintLabel() + ' class="' + this.paintClassName() + '" ' + strAttributes);
    b1.setStyles(this.paintFontSize() + this.paintBackgroundColor() + this.paintBackground() + this.paintColor() + this.paintOverflow() + this.paintFontName() + this.paintZIndex() + this.paintFontWeight() + this.paintTextAlign() + this.paintCursor() + this.paintVisibility() + this.paintBlockDisplay() + this.paintCSSOverride());

    return b1.paint().join(strData);
  };  
  
  /**
   * validate after every paint
   */
  Field_prototype.onAfterPaint = function() {
    this.validate();   
  };
  
  /**
   * handle the adding of children, field and section are rejected
   */
  Field_prototype.onSetChild = function(objChild) {
    if (objChild.isType("com.intalio.ria.Section") || objChild.isType("com.intalio.ria.Field")) {
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
      if (child.isType("jsx3.gui.Slider")) {
        value = com.intalio.ria.sliderValue(child);
      }
      
      if (child.isType("jsx3.gui.ColorPicker")) {
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
  // Fix for EDGE-3737, we should do validation even if show property is set to no
    /*if (this.getShowValidation() == Field.SHOW_VALIDATION_NO) {
      return;
    }*/
    
    var radioGroupName = null;
    
    // objGui is usually only null when validate() is called in onAfterPaint
    
    if (objGui != null) {
      // This is needed because a radio/checkbox click does not set its value 
      // until after the event has completed.  This routine might be called 
      // during the event, so it may seem like the radio/checkbox is invalid 
      // when in fact it will be valid once the event completes.
      if (objGui.isType("jsx3.gui.RadioButton")) {
        if (objEVENT != null && objEVENT.getType() == jsx3.gui.Event.CLICK) {
          radioGroupName = objGui.getGroupName();
        }
      }
    }
    
    var valid = true;
    var children = this.getDescendantsOfType(jsx3.gui.Form); // array
    
    CHILDREN_LOOP:
    for (var x = 0; x < children.length; x++) {
      var child = children[x];
      
      if (child.getAncestorOfTypeNew("jsx3.gui.Matrix")) {
        // matrix columns are validated separately
        continue;
      } else if (child.isType("jsx3.gui.RadioButton")) {
        // no need to validate this radiogroup b/c it will always be valid
        if (child.getGroupName() == radioGroupName) {
          continue;
        }
      } else if (child.isType("jsx3.gui.CheckBox")) {
        // if child == objGui and its checked then no need to validate
        if (objGui != null && objGui.getId() == child.getId()) {
          if (intCHECKED == jsx3.gui.CheckBox.CHECKED) {
            continue;
          }
        }
      } else if (child.isType("jsx3.gui.Matrix")) {
        if (!this.validateMatrix(child)) {
          valid = false;
          break CHILDREN_LOOP;
        }
        
        continue;
      }
      
      // try/catch block is needed b/c some Form objects dont impliment the 
      // doValidate method, this is actually a GI bug I believe
      try {
        if (child.doValidate() == jsx3.gui.Form.STATEINVALID) {
          jsx3.log("incomplete input: " + child);
          valid = false;
          break;
        }
      } catch(e) {;}
    }
    
    this.displayValidation(valid);
    
    // this method should not return a value b/c its called from JS events,
    // if it returns false for instance then the event may not fire properly
  };
  
  Field_prototype.validateMatrix = function(child) {
    var columns = child.getDescendantsOfTypeNew("jsx3.gui.Matrix.Column"); // array
    var nodes = child.getXML().getChildNodes(); // list    
    var radios = new Object(); // radio button state array

    // Fix for EDGE-4161 multiselect validation
    var col = columns[0];
    var colChild = col.getFirstChild();
    // if colChild is null assume its multiselect
    if (colChild == null) {
        if (child.getRequired()) {
            var selectedIds = child.getSelectedIds();
            if (selectedIds == 0) {
                return false;
            }
        }
    }

    for (var y = 0; y < nodes.size(); y++) {
      var node = nodes.get(y);
          
      for (var z = 0; z < columns.length; z++) {
        var column = columns[z];        
        var colChild = column.getFirstChild();
        var attr = column.getPath();
        
        if (colChild == null) {
          continue;    
        }
            
        if (!colChild.isType("jsx3.gui.Form")) {
          continue;
        }
            
        if (!colChild.getRequired()) {
          continue;   
        }
        
        if (colChild.isType("jsx3.gui.TextBox") || colChild.isType("jsx3.gui.CheckBox")) {
          continue;
        }
        
        // only 1 radio button per column needs to be selected
        if (colChild.isType("jsx3.gui.RadioButton")) {
          var id = colChild.getId();
          
          if (attr != null && attr.trim() != "") {
            var val = node.getAttribute(attr);
            
            if (id in radios) {
              if (val == "1") {
                  radios[id] = val;
              }
            } else {
                radios[id] = val;    
            }
          }
            
          continue;
        }
           
        // if no attr name is set then its not in the schema, so skip
        if (attr != null && attr.trim() != "") {
          var val = node.getAttribute(attr);
          // if no value is set for this attribute then form is incomplete
          if (val == null || val.trim() == "") {
            jsx3.log("incomplete matrix cell");
            return false;
          }
        }
      }
    }
    
    // see if a radio button was selected per column
    for (var id in radios) {
      var val = radios[id];
      if (val != "1") {
        jsx3.log("incomplete matrix cell: radio button");
        return false;
      }
    }
    
    if (child.getRequired() == jsx3.gui.Form.REQUIRED && nodes.size() == 0) {
      jsx3.log("matrix has no rows");
      return false;   
    }
    
    return true;
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
   * label
   */
  Field_prototype.paintLabelColumn = function(isRequired) {
    var forStr = '';
    var child = this.getFirstChild();
    if (child != null && child.isType("jsx3.gui.TextBox")) {
      forStr = ' for="' + child.getId() + '"';
    }
    
    return '<td class="label-column">' + 
               '<span class="label-images">' + 
                   this.paintErrorImage(isRequired) + 
                   this.paintHelpImage() +
               '</span>' +
               '<label' + forStr + '>' + 
                   this.getLabelText() + 
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
      if (this.riaLabelText == undefined || this.riaLabelText == null) { 
        return ''; 
      }
      
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

  Field_prototype.setHelpImagePos = function(strPos, bRepaint) {
    this.riaHelpImagePos = strPos;
    if (bRepaint) {
      this.repaint();   
    }    
    return this;
  };
  
  Field_prototype.getHelpImagePos = function() {
    if (this.riaHelpImagePos == Field.HELP_IMG_POS_BF) {
      return Field.HELP_IMG_POS_BF;
    }
    
    return Field.HELP_IMG_POS_AF;
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
  
  /**
   * auto set value labels
   */
  Field_prototype.setValue = function(objGui, value) {
    com.intalio.ria.setValue(objGui, value);
  };
  
  /**
   * roles
   */
  Field_prototype.getRoles = function() {
    if (this.riaRolesList == undefined || this.riaRolesList == null) {
      return "";
    }
    
    return this.riaRolesList;
  };
  
  Field_prototype.setRoles = function(strRoles) {
    this.riaRolesList = strRoles;  
  }; 
  
  Field_prototype.isValidRole = function(strRole) {
    var roles = this.getRoles();
    if (roles == "") {
      return true;
    }
    
    var parts = roles.split(",");
    for (var x = 0; x < parts.length; x++) {
        if (parts[x] == strRole) return true;
    }
    
    return false;
  };
});

