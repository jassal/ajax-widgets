/*
 *  Copyright (C) 2009, Intalio Inc.
 *
 *  The program(s) herein may be used and/or copied only with the
 *  written permission of Intalio Inc. or in accordance with the terms
 *  and conditions stipulated in the agreement/contract under which the
 *  program(s) have been supplied.
 */  
jsx3.Package.definePackage("com.intalio.ria", function(ria) {
        
  jsx3.require("com.intalio.ria.Field",  "jsx3.gui.Interactive", 
               "jsx3.gui.Block",         "jsx3.gui.Matrix",      
               "jsx3.gui.Matrix.Column", "jsx3.gui.CheckBox",     
               "jsx3.gui.ColorPicker",   "jsx3.gui.DatePicker",    
               "jsx3.gui.RadioButton",   "jsx3.gui.Select",        
               "jsx3.gui.Slider",        "jsx3.gui.TextBox");        
  
  /**
   * Tries to set a CSS style value on the given object.
   */
  ria.setCssValue = function(objGui, strCSSName, strCSSValue) {
    if (objGui == null) return;
    
    var rendered = objGui.getRendered();
    if (rendered == null) {
      return;
    }
  
    try {
      rendered.style[strCSSName] = strCSSValue;
    } catch(e) {;}
  };
  
  /**
   * Highlight/unhighlight a text input by setting the CSS value.
   */
  ria.highlightTextInput = function(objGui, unhighlight) {
    if (objGui == null) return;
    
    var parent = objGui.getParent();
    if (parent != null && parent.instanceOf(jsx3.gui.Matrix.Column)) {
      return;   
    }
    
    if (unhighlight == true) {
      ria.setCssValue(objGui, "backgroundColor", "");
    } else {
      ria.setCssValue(objGui, "backgroundColor", "#FFC");
    }
  };  
  
  /**
   * If the given object's parent is an Intalio Field object, then validate it.
   */
  ria.validate = function(objGui, objEVENT, intCHECKED) {
    if (objGui == null) {
      return;
    }
    
    var parent = objGui.getParent();
    if (parent != null && parent.instanceOf(com.intalio.ria.Field)) {
      parent.validate(objGui, objEVENT, intCHECKED);
    }
  };  
  
  /**
   * Certain controls have no displayed value, so we add a simple text field.  
   * This updates the value of the added text field to the value of the input. 
   */
  ria.setValue = function(objGui, value) {
    if (objGui == null) return;
    
    var parent = objGui.getParent();
    if (parent == null || !parent.instanceOf(com.intalio.ria.Field)) {
      return;
    }
    
    if (value == null) return;
    
    var newValue = null;
    
    if (objGui.instanceOf(jsx3.gui.Slider)) {
      newValue = com.intalio.ria.sliderValue(objGui, value);
    } else if (objGui.instanceOf(jsx3.gui.ColorPicker)) {
      newValue = com.intalio.ria.colorPickerValue(objGui, value);
    }
    
    if (newValue == null) return;
    
    var rendered = parent.getRendered();
    if (rendered == null) return;
    
    var obj = rendered.ownerDocument.getElementById(objGui.getId() + "_value");
    if (obj == null) return;

    obj.innerHTML = newValue;      
  };
  
  /**
   * Returns the value of a slider to 2 decimal places.
   */
  ria.sliderValue = function(slider, fpVALUE) {
    if (slider == null) return null;
    
    if (fpVALUE == null) {
      fpVALUE = slider.getValue();   
    }
    
    return fpVALUE.toFixed(2);
  };
  
  /**
   * Returns the value of a color picker in HEX.
   */
  ria.colorPickerValue = function(colorPicker, intRGB) {
    if (colorPicker == null) return null;
    
    if (intRGB == null) {
      intRGB = colorPicker.getValue();
    }
    
    var str = intRGB.toString(16).toUpperCase();
    while (str.length < 6) {
      str = "0" + str;
    }
        
    return str.substring(0, 2) + " " + 
           str.substring(2, 4) + " " + 
           str.substring(4, 6);
  };  
  
  /**
   * Customizations only used in the IDE.
   */
  if (jsx3.IDE) {
    jsx3.ide.loadTemplateCatalog("prop", "properties/catalog.xml", com.intalio.ria.ADDIN);
    
    /**
     * Custom drag and drop handler.
     * This is called from jsx3.ide.ComponentEditor when an object is dropped
     * onto the canvas (or component hierarchy).
     */    
    jsx3.ide.customPrototypePath = function(myPath, objJSXParent, bInsertBefore) {
      if (myPath == null || objJSXParent == null) return myPath;
      
      // check to see if it should use the core input object instead of Field
      var intalioProtoPath = "jsxaddin://intalioajax-addins/prototypes/";
      var giProtoPath = "GI_Builder/prototypes/";
      var giFormElementsPath = giProtoPath + "Form%20Elements/";
      var giMatrixColumnsPath = giProtoPath + "Matrix/Columns/"
      
      if (myPath.indexOf(intalioProtoPath) == 0 && myPath.length > intalioProtoPath.length) {
        var baseName = myPath.substr(intalioProtoPath.length);
        // is the user dropping an intalio Field object?
        if (baseName == "CheckBox.xml" || baseName == "ColorPicker.xml" ||
            baseName == "Combo.xml"    || baseName == "DatePicker.xml"  ||
            baseName == "Password.xml" || baseName == "Radio.xml"       ||
            baseName == "Select.xml"   || baseName == "Slider.xml"      ||
            baseName == "TextArea.xml" || baseName == "TextBox.xml"     ||
            baseName == "TimePicker.xml") {
        
          var objGui = (bInsertBefore ? objJSXParent.getParent() : objJSXParent);
          
          // check to see if its within another Field object
          if (objGui.instanceOf(com.intalio.ria.Field) || objGui.getAncestorOfType(com.intalio.ria.Field)) {
            myPath = giFormElementsPath + baseName;
          }
          
          // are they dropping it onto a matrix?
          if (objJSXParent.instanceOf(jsx3.gui.Matrix)) {
            // slider and color picker dont work for matrix columns
            // password is not fully functional either (password text is displayed normally)
            if (baseName != "Slider.xml" && baseName != "ColorPicker.xml" && baseName != "Password.xml") { 
              if (baseName == "Radio.xml") {
                baseName = "RadioButton.xml";
              }
              myPath = giMatrixColumnsPath + baseName;
            }
          }
        }
      }
        
      return myPath;
    };
    
    /**
     * Set or change some custom properties on a given object.
     * This is called from jsx3.app.Model when an object is deserialized and 
     * placed on the canvas.
     */    
    jsx3.ide.customProperties = function(objChild) {
      if (objChild == null) return;
      
      var inField = false;
      var parent = objChild.getParent();
      if (parent == null) {
        return;
      }
      
      if (parent.instanceOf(com.intalio.ria.Field)) {
          inField = true;
      }
      
      // checkbox  
      if (objChild.instanceOf(jsx3.gui.CheckBox)) {
        objChild.removeEvent(jsx3.gui.Interactive.EXECUTE);
        if (inField) {
          objChild.setEvent('com.intalio.ria.validate(this, objEVENT, intCHECKED);', jsx3.gui.Interactive.TOGGLE);          
        }
      }   
      // color picker 
      else if (objChild.instanceOf(jsx3.gui.ColorPicker)) {
        objChild.setHeight(100);
        objChild.setWidth(125);        
        if (inField) {
          objChild.setEvent('com.intalio.ria.setValue(this, intRGB);', jsx3.gui.Interactive.JSXCHANGE);          
        }
      }       
      // date picker 
      else if (objChild.instanceOf(jsx3.gui.DatePicker)) {
        if (inField) {
          objChild.setEvent('com.intalio.ria.validate(this);', jsx3.gui.Interactive.HIDE);          
        }
      }       
      // radio button
      else if (objChild.instanceOf(jsx3.gui.RadioButton)) {
        var radioChildren = parent.getDescendantsOfType(jsx3.gui.RadioButton);
        var max = 0;
        var baseStr = "radio-";
        
        for (var x = 0; x < radioChildren.length; x++) {
          var tmp = radioChildren[x].getValue();
          
          if (tmp != null && tmp.indexOf(baseStr) == 0 && tmp.length > baseStr.length) {
            var inc = parseInt(tmp.substring(baseStr.length));
            if (inc > max) max = inc;
          }
        }
        
        objChild.setValue(baseStr + (++max));
        if (inField) {
          objChild.setEvent('com.intalio.ria.validate(this, objEVENT);', jsx3.gui.Interactive.SELECT);          
        }
      }       
      // select and combo
      else if (objChild.instanceOf(jsx3.gui.Select)) {
        objChild.setXMLURL(null);
        objChild.setXMLString('<data><record jsxid="Automobile" jsxtext="Automobile"/><record jsxid="Boat" jsxtext="Boat"/><record jsxid="Bus" jsxtext="Bus"/><record jsxid="Helicopter" jsxtext="Helicopter"/><record jsxid="Motorcycle" jsxtext="Motorcycle"/><record jsxid="Plane" jsxtext="Plane"/><record jsxid="Spaceship" jsxtext="Spaceship"/><record jsxid="Train" jsxtext="Train"/></data>');
        if (objChild.getType() == jsx3.gui.Select.TYPECOMBO) {
          objChild.removeEvent(jsx3.gui.Interactive.JSXMOUSEDOWN);
          objChild.removeEvent(jsx3.gui.Interactive.JSXKEYUP);
          objChild.setValue(null);            
        }
        
        if (inField) {
          objChild.setEvent('com.intalio.ria.validate(this, objEVENT);', jsx3.gui.Interactive.SELECT);          
        }
      }
      // slider
      else if (objChild.instanceOf(jsx3.gui.Slider)) {
        if (inField) {
          objChild.setEvent('com.intalio.ria.setValue(this, fpVALUE);', jsx3.gui.Interactive.JSXCHANGE);
          objChild.setEvent('com.intalio.ria.setValue(this, fpVALUE);', jsx3.gui.Interactive.INCR_CHANGE);           
        }
      }
      // textbox, text area, password      
      else if (objChild.instanceOf(jsx3.gui.TextBox)) {
        objChild.setHeight(null);
        objChild.setWidth(null);
        objChild.setEvent('com.intalio.ria.highlightTextInput(this, false);', jsx3.gui.Interactive.JSXFOCUS);
        objChild.setEvent('com.intalio.ria.highlightTextInput(this, true);', jsx3.gui.Interactive.JSXBLUR);
        
        if (inField) {
          objChild.setEvent('com.intalio.ria.validate(this, objEVENT);', jsx3.gui.Interactive.JSXCHANGE);
          objChild.setEvent('com.intalio.ria.validate(this, objEVENT);', jsx3.gui.Interactive.INCR_CHANGE);          
        }
      }
      // matrix column
      else if (objChild.instanceOf(jsx3.gui.Matrix.Column)) {
        var matrix = objChild.getParent();
        var path = objChild.getPath();
        
        // need to make the path is unique, so we append an incremented int,
        // but first need to find the highest current value
        if (matrix != null && path != null) {
          var columns = matrix.getChildren();
          var max = 0;
          var baseStr = path + "-";
          
          for (var x = 0; x < columns.length; x++) {
            var tmp = columns[x].getPath();
            
            if (tmp != null && tmp.indexOf(baseStr) == 0 && tmp.length > baseStr.length) {
              var inc = parseInt(tmp.substring(baseStr.length));
              if (inc > max) max = inc;
            }
          }
          
          objChild.setPath(baseStr + (++max));
        }
      }
    };
    
    /**
     * Custom hook to repaint a parent Field when a form input's required 
     * property is changed.  This is needed because we display validation
     * information on the field object.
     */
    jsx3.ide.customSetRequired = function(objForm) {
      var field = objForm.getAncestorOfType(com.intalio.ria.Field);
      if (field != null) {
        field.repaint();
      }        
    };
  }
});

