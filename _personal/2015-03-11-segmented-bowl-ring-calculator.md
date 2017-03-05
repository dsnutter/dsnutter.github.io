---
layout: page
title: "Segmented Bowl Ring Calculator"
description: "This utility calculates a segmented ring's cut angle, segment length, and the approximate maximum diameter of the segmented ring needed to woodturn a specific finished ring diameter."
featuredImage: segment.200x100.png
permalink: /segmented-bowl-ring-calculator/
angular: true
---
![Dimensions of segments - {{ page.title }}]({{ site.DSN.imagePathPersonal }}/{{ page.featuredImage }}){:.pull-right .caption}

<p>
{{ page.description }}
</p>

<div ng-app="lec.utility" ng-controller="lec.utility.controller.segmentedBowlRingCalculator">

<div ng-cloak class="form" role="form" >

Units:
&nbsp;
<input type="radio" name="units" ng-change="measurementTypeChange()" value="e" ng-model="form.units"/> inches
<input type="radio" name="units" ng-change="measurementTypeChange()" value="m"  ng-model="form.units" /> cm
<br />

Segmented ring diameter after turning:
<br />
<select name="calcdiameter" class="form-control" ng-model="form.diameter" style="width: auto;" >
{% raw %}
    <option value="-1">Choose...</option>
    <option ng-repeat="d in rangeDiameters" value="{{ d.value }}">{{ d.display }}</option>
</select>
<label>&nbsp;{{ form.unitsdisplay }}</label>
{% endraw %}
<br />

Number of segments in ring:
<br />
<select name="calcnumsegments" class="form-control" ng-model="form.numberSegments">
{% raw %}
    <option value="-1">Choose...</option>
    <option ng-repeat="s in rangeSegments" value="{{ s }}">{{ s }}</option>
{% endraw %}
</select>
<br />

Ring segment width (ref. image above):
<br />
{% raw %}
<select name="widthRingSegment" class="form-control" ng-model="form.width" style="width: auto;">
    <option value="-1">Choose...</option>
    <option ng-repeat="w in rangeWidths" value="{{ w.value }}">{{ w.display }}</option>
</select><label>&nbsp;{{ form.unitsdisplay }}</label>
{% endraw %}
<br />

<button ng-click="calculate()" role="button">Calculate</button>
<br />

</div>

<div ng-cloak ng-show="showresult">
    <strong>*** RESULTS ***</strong>
    <br />
{% raw %}
    <span style="color: black; font-weight: bold">Segment Cut Angle:</span> {{ strCutAngle }}
    <br />
    <span style="color: red; font-weight: bold">A: Max diameter of segmented ring:</span> {{ strDiameterMax }}
    <br />
    <span style="color: blue; font-weight: bold">B: Diameter of ring after turning:</span> {{ strDiameter }}
    <br />
    <span style="color: purple; font-weight: bold">C: Segment length:</span> {{ strLength }}
    <br />
    <span style="color: orange; font-weight: bold">D: Segment width:</span> {{ strWidth }}
    <br />
{% endraw %}
    <div style="margin-top: 5px;" segmented-ring></div>
</div>

<div ng-show="false" class="">
        Please enable javascript to use this utility.
</div>

</div>
