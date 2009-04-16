/*
 *  Copyright (C) 2009, Intalio Inc.
 *
 *  The program(s) herein may be used and/or copied only with the
 *  written permission of Intalio Inc. or in accordance with the terms
 *  and conditions stipulated in the agreement/contract under which the
 *  program(s) have been supplied.
 */
jsx3.require("jsx3.gui.Painted");
 
jsx3.lang.Class.defineClass("com.intalio.ria.HorizontalRule", jsx3.gui.Painted, [], function(HorizontalRule,HorizontalRule_prototype) {
        
  /**
   * main method
   */
  HorizontalRule_prototype.init = function(strName) {
    this.jsxsuper(strName);
  };

  /**
   * paint
   */  
  HorizontalRule_prototype.paint = function(strHtml) {
    var html = '<div id="' + this.getId() + '">' +  
                   '<hr' + this.paintCssClass() + '/>' + 
               '</div>';
    return html;
  };
  
  /**
   * handle the adding of children
   */
  HorizontalRule_prototype.onSetChild = function(objChild) {
    return false;
  };
  
  /**
   * css class
   */
  HorizontalRule_prototype.paintCssClass = function() {
    return (this.riaCssClass == null ? '' : ' class="' + this.riaCssClass + '"');
  };  
  
  HorizontalRule_prototype.setCssClass = function(strCssClass, bUpdateView) {
    this.riaCssClass = strCssClass;
    if (bUpdateView) {
      this.repaint();   
    }
    return this;
  };
  
  HorizontalRule_prototype.getCssClass = function() {
    return this.riaCssClass;
  };
});

