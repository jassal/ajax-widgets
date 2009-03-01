/*
 *  Copyright (C) 2009, Intalio Inc.
 *
 *  The program(s) herein may be used and/or copied only with the
 *  written permission of Intalio Inc. or in accordance with the terms
 *  and conditions stipulated in the agreement/contract under which the
 *  program(s) have been supplied.
 */
jsx3.require("jsx3.gui.Painted");
 
jsx3.lang.Class.defineClass("com.intalio.ria.Section", jsx3.gui.Painted, [], function(Section,Section_prototype) {

  /**
   * main method
   */
  Section_prototype.init = function(strName) {
      this.jsxsuper(strName);
  };
  
  /**
   * paint
   */
  Section_prototype.paint = function() {
    var html = '<fieldset id="' + this.getId() + '"' + this.paintCssClass() + '>' + 
                   this.paintTitle() +
                   '<div class="fieldset-padding">' + 
                       this.paintChildren() +
                   '</div>' +
               '</fieldset>';
    return html;
  };
  
  /**
   * children are ok
   */
  Section_prototype.onSetChild = function(objChild) {
    return true;
  };
  
  /**
   * forces a repaint after a child is added, adding a child doesnt get painted 
   * correctly, it has something to do with the CSS
   */
  Section_prototype.viewUpdateHook = function(objChild, bGroup) {
    this.jsxsuper(objChild, bGroup);
    this.repaint();
  };
  
  /**
   * forces a repaint when a child is removed, same issue as adding a child,
   * it doesnt get painted correctly, so must force a repaint
   */
  Section_prototype.onRemoveChild = function(objChild, intIndex) {
    this.jsxsuper(objChild, intIndex);
    this.repaint();
  };  
  
  /**
   * css class
   */
  Section_prototype.paintCssClass = function() {
    return (this.getCssClass() == null ? '' : ' class="' + this.getCssClass() + '"');      
  };
  
  Section_prototype.setCssClass = function(strCssClass, bRepaint) {
    this.riaCssClass = strCssClass;
    if (bRepaint) {
      this.repaint();
    }
    return this;
  };
  
  Section_prototype.getCssClass = function() {
    return this.riaCssClass;
  };      
  
  /**
   * title
   */
  Section_prototype.paintTitle = function() {
    return "<legend>" + this.getTitleText() + "</legend>";     
  };
  
  Section_prototype.setTitleText = function(strText, bRepaint) {
    this.riaTitleText = strText;
    if (bRepaint) {
      this.repaint();
    }        
    return this;
  };
  
  Section_prototype.getTitleText = function() {
    return (this.riaTitleText == null ? "" : this.riaTitleText);
  };
});

