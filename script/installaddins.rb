#!/usr/bin/env ruby
# Copyright Intalio, Inc. 2009

if ($*.size != 1 or $*.include? "-h" or $*.include? "--help") 
  puts <<-HELP
Copyright Intalio, Inc. 2009. All rights reserved.
Usage: ruby installaddins eclipseWorkspaceDir

    Replaces an installation of the addins IntalioWidgets.gi addins by the files found here. See EDGE-2583.
    eclipseWorkspaceDir is the workspace folder where eclipse is executed

Optional parameters
    -h, --help: prints this help message

Example:
     ruby installaddins ~/workspace
HELP
  exit 0
end

require 'fileutils.rb'

workspace = $*[0]

if !File.exist? workspace+'/.metadata/.plugins/com.intalio.bpms.designer.gi.core'
  print workspace+'/.metadata/.plugins/com.intalio.bpms.designer.gi.core must exist.\n'
  exit 0
end

#look for all the plugin work directories. we don't know the name in advance.
settingsInsidePluginWorkDirs = Dir.glob(workspace+'/.metadata/.plugins/com.intalio.bpms.designer.gi.core/*/settings')
if settingsInsidePluginWorkDirs[0] == nil
  print workspace+'/.metadata/.plugins/com.intalio.bpms.designer.gi.core does not contain a GI workspace.\n'
  exit 0
end

settingsInsidePluginWorkDirs.each do |settingsDir|
  #go up one dir:
  coreDir = settingsDir.slice(0, settingsDir.size - "/settings".size)
  FileUtils.rm_r Dir.glob(coreDir+'/addins/IntalioWidgets.gi') unless !File.exist?(coreDir+'/addins/IntalioWidgets.gi')
  FileUtils.mkdir coreDir+'/addins' unless File.exist?(coreDir+'/addins')
  FileUtils.mkdir coreDir+'/addins/IntalioWidgets.gi' unless File.exist?(coreDir+'/addins/IntalioWidgets.gi')
  print 'Copy ' + Dir.pwd+'/* to ' + coreDir+"/addins/IntalioWidgets.gi \n"
  FileUtils.cp_r Dir.glob(Dir.pwd+'/*'), coreDir+'/addins/IntalioWidgets.gi'
end

