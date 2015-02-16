# Copyright Intalio, Inc. 2009

gem "buildr", ">=1.2.4"

# Keep this structure to allow the build system to update version numbers.
VERSION_NUMBER = "7.5.0"

require "find"
require "buildr"
require "install.rb"
# Disable tests
ENV['TEST'] = "no"

define "intalioajax-addins" do
  project.version = VERSION_NUMBER
  project.group = "com.intalio.bpms.ajax"

  resources.from('widgets')

  #Zip things up
  package(:zip).include resources.target, :as=>'intalioajax-addins'
end

