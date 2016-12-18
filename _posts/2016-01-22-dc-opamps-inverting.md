---
layout: post
title: "DC Inverting Amplifiers Using Opamps"
description: "Opamps can be used in DC circuits. The circuit diagram defines an inverting amplifier."
featuredImage: dc-opamps-schematic.png
---
![DC Inverting Opamp Circuit Diagram - DC Inverting Amplifiers Using
Opamps]({{ site.DSN.imagePath }}{{ page.url }}{{ page.featuredImage }})

Introduction
------------

For opamps, the voltage at the + and - inputs are equal, so with the +
input attached to ground, the voltage at the - input is 0 volts. Also,
the current into the + and - inputs of the opamp is 0 amps (or close
enough to be considered an ideal opamp).

Current
-------

The KCL equation for the opamp at node A is below. Note the current into
the - opamp input is 0 amps.

![KCL at node A - DC Inverting Amplifiers Using
Opamps]({{ site.DSN.imagePath }}{{ page.url }}/dc-opamps-current.png)

Inverting Amplifier Equation Derivation by Node Method
------------------------------------------------------

The derivation of how to calcuate the amplifier output given a DC input
and input and feedback resistor values is listed below. The voltage at
node A is 0 volts since the voltage at the + input is 0 volts. Note that
Vout is negative, therefore the label "inverting amplifier". The gain of
the DC opamp circuit is (Rf / R1).

![Inverting Amplifier Equation Derivation - DC Inverting Amplifiers
Using Opamps]({{ site.DSN.imagePath }}{{ page.url }}dc-opamps-nodeMethod.png)

