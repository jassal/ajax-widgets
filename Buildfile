# Copyright Intalio, Inc. 2009

gem "buildr", ">=1.2.4"

# Keep this structure to allow the build system to update version numbers.
VERSION_NUMBER = "6.0.0.17"
NEXT_VERSION = "6.0.0.013"

require "find"
require "buildr"

repositories.remote = [ "http://release.intalio.com/m2repo", "http://www.intalio.org/public/maven2", "http://mirrors.ibiblio.org/pub/mirrors/maven2" ]

repositories.release_to[:username] ||= "release"
repositories.release_to[:url] ||= "sftp://release.intalio.com/home/release/m2repo"

# Disable tests
ENV['TEST'] = "no"

define "intalioajax-addins" do
  project.version = VERSION_NUMBER
  project.group = "com.intalio.bpms.ajax"

  resources.from('widgets')

  #Zip things up
  package(:zip).include resources.target, :as=>'intalioajax-addins'
end

