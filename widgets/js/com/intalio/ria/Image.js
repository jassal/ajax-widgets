/*
 *  Copyright (C) 2009, Intalio Inc.
 *
 *  The program(s) herein may be used and/or copied only with the
 *  written permission of Intalio Inc. or in accordance with the terms
 *  and conditions stipulated in the agreement/contract under which the
 *  program(s) have been supplied.
 */
jsx3.require("jsx3.gui.Image");

jsx3.Class.defineClass("com.intalio.ria.Image", jsx3.gui.Image, [], function(Image, Image_prototype) {

  Image_prototype.setUriResolver = function(objResolver) {
    this.resolver = objResolver;
  };
  
  Image_prototype.getUriResolver = function() {
    return this.resolver;
  };
});
