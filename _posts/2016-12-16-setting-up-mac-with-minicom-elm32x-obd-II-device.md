---
layout: post
title: "Setting Up a Mac with Minicom for an ELM32x OBD-II Device"
description: "This article explains how to setup a ELM32x OBD-II device with minicom on an Apple Macintosh."
---

Introduction
------------
{{ page.description }} An ELM32x OBD-II device plugs into the OBD-II connector on your car and allows you to communicate with it using OBD-II hex codes.
The ELM32x has an interface similar to a Hayes "AT" interface when connecting to it via a serial terminal program.
This serial terminal interface is a good way to test out OBD-II hex values out before you write a program that sends the hex values to the device and car.
To start the install, open the "terminal" application on your Mac.

Install Minicom
---------------

Install minicom using [Homebrew](http://brew.sh/){:target="_blank"}:

    brew install minicom

Setup Minicom
-------------

Plug in your OBD-II adapter. Mine was an OBDLink SX USB adapter. At the terminal, type:

    ls /dev

You are looking for a tty device named /dev/tty.usbserial-xxxx where xxxx is a number. The tty could also be a bluetooth tty also 
depending on the type of OBD-II ELM32x adapter you have. (Note: if its bluetooth, you will need to pair the device with your Mac)

Setup minicom by typing:

    minicom -s

You should see the following menu:

![Settings Menu - Setting Up a Mac and ELM32x OBD-II Device With Minicom]({{ site.DSN.imagePath }}{{ page.url }}MinicomSettingsMenu.png)

Using the arrow keys on the keyboard, select "Serial port setup" and press return. You should see the following menu:

![Serial Port Setup - Setting Up a Mac and ELM32x OBD-II Device With Minicom]({{ site.DSN.imagePath }}{{ page.url }}MinicomSerialPortSetup.png)

Use the keyboard keys to select and input the following:

    A: Input serial adapter device name, such as /dev/tty.usbserial-xxxx
    E: Set BPS to 115200
    F: Set hardware flow control to "No"

When finished, press return.

Using the arrow keys on the keyboard, select "Screen and keyboard" and press return. You should see the following menu:

![Screen and Keyboard Setup - Setting Up a Mac and ELM32x OBD-II Device With Minicom]({{ site.DSN.imagePath }}{{ page.url }}MinicomScreenKeyboardSettings.png)

Use the keyboard keys to select and input the following:

    P: Set Add linefeed to "Yes"
    Q: Set local echo to "No"

When finished choose “Save setup as dfl”, which savings the settings you entered as the defaults.

Choose "Exit from Minicom" and the menus will close.

From the terminal prompt, type:

    minicom

Minicom will start, so try a sample command. Type:

    ATI

and the ELM32x will respond with the device firmware version.

For more simple OBD-II commands, see this article on [reading real time data](http://www.obdsol.com/knowledgebase/obd-software-development/reading-real-time-data/){:target="_blank"}.
