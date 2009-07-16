/*
 *  Copyright (C) 2009, Intalio Inc.
 *
 *  The program(s) herein may be used and/or copied only with the
 *  written permission of Intalio Inc. or in accordance with the terms
 *  and conditions stipulated in the agreement/contract under which the
 *  program(s) have been supplied.
 */
jsx3.require("jsx3.gui.Block");
 
jsx3.lang.Class.defineClass("com.intalio.ria.Title", jsx3.gui.Block, [], function(Title,Title_prototype) {

  var Event = jsx3.gui.Event;
  var Interactive = jsx3.gui.Interactive;         
        
  Title.ONE = 1;
  Title.TWO = 2;
  Title.THREE = 3;
  Title.FOUR = 4;
  Title.FIVE = 5;
  Title.SIX = 6;
        
  /**
   * main method
   */
  Title_prototype.init = function(strName,vntLeft,vntTop,vntWidth,vntHeight) {
    this.jsxsuper(strName,vntLeft,vntTop,vntWidth,vntHeight);
  };

  /**
   * paint
   */  
  Title_prototype.paint = function() {
    this.applyDynamicProperties();
    var html = '<h' + this.getTitleSize() + '>' +
                   this.getTitleText() +
               '</h' + this.getTitleSize() + '>';
    return this.paintBlock(html);
  };
  
  /**
   * Returns the DHTML, used for this object's on-screen view
   * @param strData {String} Text/HTML markup that will replace value of getText() during paint&#8212;typically passed by subclass, JSXBlockX after it performs an XML/XSL merge to acquire its data; for memory management purposes, the data is not set via setText() and, instead, is passed as a temporary input parameter, as the object's model would contain the text for no reason
   * @return {String} DHTML
   */
  Title_prototype.paintBlock = function(strData) {
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
});

