/*
 *  Copyright (C) 2009, Intalio Inc.
 *
 *  The program(s) herein may be used and/or copied only with the
 *  written permission of Intalio Inc. or in accordance with the terms
 *  and conditions stipulated in the agreement/contract under which the
 *  program(s) have been supplied.
 */
jsx3.require("jsx3.gui.Block", "jsx3.gui.Painted", "jsx3.gui.Interactive");
 
jsx3.lang.Class.defineClass("com.intalio.ria.Section", jsx3.gui.Block, [], function(Section,Section_prototype) {

  var Event = jsx3.gui.Event;
  var Interactive = jsx3.gui.Interactive;
  
  /**
   * main method
   */
  Section_prototype.init = function(strName,vntLeft,vntTop,vntWidth,vntHeight) {
    this.jsxsuper(strName,vntLeft,vntTop,vntWidth,vntHeight);
  };
  
  /**
   * paint
   */
  Section_prototype.paint = function() {
    var html = '<fieldset>' + 
                   this.paintTitle() +
                   '<div class="fieldset-padding">' + 
                       this.paintChildren() +
                   '</div>' +
               '</fieldset>';
    return this.paintBlock(html);
  };
  
  /**
   * Returns the DHTML, used for this object's on-screen view
   * @param strData {String} Text/HTML markup that will replace value of getText() during paint&#8212;typically passed by subclass, JSXBlockX after it performs an XML/XSL merge to acquire its data; for memory management purposes, the data is not set via setText() and, instead, is passed as a temporary input parameter, as the object's model would contain the text for no reason
   * @return {String} DHTML
   */
  Section_prototype.paintBlock = function(strData) {
    //apply any dynamic properties that this instance has registered
    //apply twice?  what to do with dp types that affect layout that should be applied during box profiling and those that apply to the "skinning/surfacing" of an object
    this.applyDynamicProperties();

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

