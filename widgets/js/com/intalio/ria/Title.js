/*
 *  Copyright (C) 2009, Intalio Inc.
 *
 *  The program(s) herein may be used and/or copied only with the
 *  written permission of Intalio Inc. or in accordance with the terms
 *  and conditions stipulated in the agreement/contract under which the
 *  program(s) have been supplied.
 */
jsx3.require("jsx3.gui.Painted");
 
jsx3.lang.Class.defineClass("com.intalio.ria.Title", jsx3.gui.Painted, [], function(Title,Title_prototype) {

  Title.ONE = 1;
  Title.TWO = 2;
  Title.THREE = 3;
  Title.FOUR = 4;
  Title.FIVE = 5;
  Title.SIX = 6;
        
  /**
   * main method
   */
  Title_prototype.init = function(strName) {
    this.jsxsuper(strName);
  };

  /**
   * paint
   */  
  Title_prototype.paint = function() {
    var html = '<div id="' + this.getId() + '">' +   
                   '<h' + this.getTitleSize() + this.paintCssClass() + '>' +
                       this.getTitleText() +
                   '</h' + this.getTitleSize() + '>' + 
               '</div>';
    return html;
  };
  
  /**
   * handle the adding of children
   */
  Title_prototype.onSetChild = function(objChild) {
    return false;
  };
  
  /**
   * title size
   */
  Title_prototype.setTitleSize = function(intSize, bRepaint) {
    this.riaTitleSize = intSize;
    if (bRepaint) {
      this.repaint();
    }
    return this;
  };
  
  Title_prototype.getTitleSize = function() {
    var size = parseInt(this.riaTitleSize);
    if (isNaN(size) || size < Title.ONE || size > Title.SIX) {
      size = Title.TWO;
    }
    return size;  
  };
  
  /**
   * title text
   */
  Title_prototype.setTitleText = function(strText, bRepaint) {
    this.riaTitleText = strText;
    if (bRepaint) {
      this.repaint();
    }    
    return this;
  };  
  
  Title_prototype.getTitleText = function() {
    return (this.riaTitleText == null ? "" : this.riaTitleText);
  };
  
  /**
   * css class
   */
  Title_prototype.paintCssClass = function() {
    return (this.getCssClass() == null ? '' : ' class="' + this.getCssClass() + '"');
  };  
  
  Title_prototype.setCssClass = function(strCssClass, bUpdateView) {
    this.riaCssClass = strCssClass;
    if (bUpdateView) {
      this.repaint();   
    }        
    return this;
  };
  
  Title_prototype.getCssClass = function() {
    return this.riaCssClass;
  };
});

