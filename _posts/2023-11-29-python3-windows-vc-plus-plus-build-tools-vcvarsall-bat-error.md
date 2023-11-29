---
layout: post
title: "Python Windows pip install Error vcvarsall.bat"
description: "How to correct vcvarsall.bat error with python on windows when installing via pip and having wheel compile libraries"
---

Introduction
------------

Sometimes when doing a pip install on Windows 11, there will be an 
error saying "error: Unable to find vcvarsall.bat"

Solution
-------

There will be a link to the Micrsoft build tools with the python
error message, but its not enough. When you do go to the link it
will result in the download of the latest Microsoft build tools 
along with the Visual Studio Installer. What we want is build 
tools 14.0, which is version 2015.

1. Run the visual studio installer and install the 2022 [or later] 
build tools

2. At this screen, click "Modify"

![VS Installer Build Tools 2022 - Python Windows pip install Error vcvarsall.bat]({{ site.DSN.imagePath }}{{ page.url }}vs-installer-build-tools-2022.png)

3. Choose the individual components tab, and then search for "build tools 2015"

4. Check all the components as per this screenshot

![VS Installer Build Tools 2015 - Python Windows pip install Error vcvarsall.bat]({{ site.DSN.imagePath }}{{ page.url }}vs-installer-build-tools-2015.png)

5. Click modify at the bottom right, and install the 2015 build tools

6. Reopen your powershell or command prompt

7. Rerun pip install using whatever method you normally use. pip should now be able to build from source

End Notes
---------

1. If you install the 2015 build tools correctly, vcvarsall.bat will 
be located at:

C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC

2. Another tip. Windows has a built in python that I do not recommend 
using for development. Download python3 from python website for whatever 
version you want. It can be accessed with "py" as the "python" command 
refers to the built in windows python

