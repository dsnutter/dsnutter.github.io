// utility.lec website module
angular.module("lec.utility", ['lec.segmented', 'lec.units'])

// converts decimal inches to fractinal inches
.controller('lec.utility.controller.fractionalInches', ['$scope', 'lec.units.service.calculate', 'lec.units.service.verify', function($scope, calc, verify) {
    $scope.unitslabel = 'inches';
    $scope.showresult = false;
    $scope.result = null;
    $scope.calculate = function() {
        // default values
        $scope.showresult = false;
        $scope.result = null;
        // if not a valid decimal, then return
        if (isNaN($scope.decimal)) {
            return;
        }
        // approximate in english units to 1/16" resolution
        var type = 'e', resolution = 16;
        // verify json query arguments are valid
        if (verify.units(type, resolution))
        {
            var temp = calc.approximateUnits($scope.decimal, resolution);
            if (temp != false) {
                $scope.showresult = true;
                $scope.result = temp.display;
            }
        }
    }
}])

// determines the cut angles for different segmented rings, and displays them
.controller('lec.utility.controller.segmentedBowlRingCalculator', ['$http', '$scope', 'lec.units.service.verify',
    'lec.units.constants', 'lec.units.service.accessors', 'lec.segmented.constants',
    'lec.segmented.service.calculate', 'lec.units.service.calculate', 'lec.segmented.service.draw',
    function($http, $scope, verify, unitsConst, unitsGet,
             segmentedConst, segmented, unitsCalc, draw) {
	$scope.form = {
		units: '',
		unitsdisplay: '',
		width: '',
		diameter: '',
		numberSegments: '',
	};
    // set the default units for the form
    $scope.form.units = unitsConst.english.abbrev;
	// defaults for accordian
	$scope.status = {
		closeOthers: true,
		isConfigOpen: true,
		isResultsOpen: false,
		isResultsDisabled: true,
	};

    // sets the default variables for controller
    function resetDefaults() {
        //
        // define the default values for ng-model data
        //
        // set selected values for option selects selected in HTML
        $scope.form.diameter = -1;
        $scope.form.numberSegments = -1;
        $scope.form.width = -1;
      
        //
        // define result defaults
        //
        $scope.showresult = false;
        $scope.strCutAngle = '';
        $scope.strDiameter = '';
        $scope.strDiameterMax = '';
        $scope.strLength = '';
        $scope.strWidth = '';
        $scope.strDiameter = '';
        $scope.strResults = '';
    }

    //
    // fill measurement drop downs with data
    //
    $scope.measurementTypeChange = function() {
        // set defaults
        $scope.form.unitsdisplay = false;
        $scope.rangeWidths = false;
        $scope.rangeDiameters = false;

        var jsonUrl = '/assets/js/ng/data.json';
        if ($http.get(jsonUrl).success(function(response) {
            // english units
            if ($scope.form.units == 'e') {
                $scope.rangeWidths = response.e.width;
                $scope.rangeDiameters = response.e.diameter;
            // metric units
            } else {
                $scope.rangeWidths = response.m.width;
                $scope.rangeDiameters = response.m.diameter;
            }
        })) {};
        //
        // set the measurement labels for the select drop downs
        //
        switch ($scope.form.units) {
            case unitsConst.english.abbrev:
                $scope.form.unitsdisplay = unitsConst.english.label;
                break;
            case unitsConst.metric.abbrev:
                $scope.form.unitsdisplay = unitsConst.metric.label;
                break;
        }
        resetDefaults();
    }
    //
    // calculate all values when submit button is pressed
    //
    $scope.calculate = function() {
        var result = false;
        var numberSegments = parseFloat($scope.form.numberSegments);
        // if the arguments are not chosen, then return
        if ($scope.form.diameter <= 0 || $scope.form.numberSegments <= 0 || $scope.form.width <= 0 ||
            isNaN(parseFloat($scope.form.diameter)) ||
            isNaN(numberSegments) ||
            isNaN(parseFloat($scope.form.width))) {
            resetDefaults();
			$scope.status.isConfigOpen = true;
			$scope.status.isResultsOpen = false;
			$scope.status.isResultsDisabled = true;
            return result;
        }
        // find the segment cut angle
        var cutAngle = segmented.cutAngle(numberSegments);
        $scope.strCutAngle = cutAngle + ' degrees';

        var diameter = { approx: { str: 0, decimal: 0 }, exact: 0 };
        var circumference = { approx: { str: 0, decimal: 0 }, exact: 0 };
        var length = { approx: { str: 0, decimal: 0 }, exact: 0 };
        
        // find default unit resolution
        var resolution = unitsGet.resolution($scope.form.units);
        
        // calculate circumferences and segment lengths
        // note that the final turned circumference is $scope.diameter, which is positioned
        //      approx halfway between the width of a segment. So diameter to calculate segment length with
        //      is ($scope.diameter + 2 * 1/2 * segment width)
        var diameterMax = parseFloat($scope.form.diameter) + parseFloat($scope.form.width);
        circumference.exact = segmented.circumference.diameterBased(diameterMax);
        length.exact = circumference.exact / numberSegments;
        //console.log('#max diameter: ' + diameterMax + ' circum: ' + circumference.exact + ' length: ' + length.exact);
        var temp = unitsCalc.approximateUnits(length.exact, resolution);
        if (temp == false) return result;

        length.approx.str = temp.display;
        length.approx.decimal = temp.value;

        // set approximate diameter and circumference based off approximate segmeent length
        var approxCircum = segmented.circumference.segmentLengthBased(length.approx.decimal, numberSegments);
        var approxDiameter = approxCircum / Math.PI;
        
        // calculate approximate circumference based off of approximate segment length
        temp = unitsCalc.approximateUnits(approxCircum, resolution);
        if (temp == false) return result;
        circumference.approx.str = temp.display;
        circumference.approx.decimal = temp.value;

	// calculate approximate ring diameter
        temp = unitsCalc.approximateUnits(approxDiameter, resolution);
        if (temp == false) return result;
        diameter.approx.str = temp.display;
        diameter.approx.decimal = temp.value;
        
        // set measurement units label
        var label = ' ' + unitsGet.unitlabel($scope.form.units);
        // set the length display
        $scope.strLength = length.exact + label + ', which is approximately ' + length.approx.str + label;

	// set the final turned diameter of the segmented ring
        $scope.strDiameter =  unitsCalc.approximateUnits($scope.form.diameter, resolution).display + label;

        // set the approximate outer border of ring unturned diameter
        $scope.strDiameterMax = 'approximately ' + diameter.approx.str + label;

        // set the segmented width of the segmented ring
        $scope.strWidth = unitsCalc.approximateUnits($scope.form.width, resolution).display + label;
        // show the results
        $scope.showresult = true;
        // draw the segmented ring
        draw.ringWithLabels($scope.form.numberSegments);
        $scope.strResults = 'Results are listed below.';
		
		$scope.status.isConfigOpen = false;
		$scope.status.isResultsOpen = true;
		$scope.status.isResultsDisabled = false;

        return result;
    };

    //
    // define values for select html drop downs
    //
    resetDefaults();
    $scope.rangeSegments = segmentedConst.segments;
    $scope.measurementTypeChange();
}])

;
