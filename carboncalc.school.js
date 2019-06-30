/*
	TODO:
		* write down the version and describe the modification
		* show the auxiliaries results 
		* use the same treatment to validade number inputs from "carboncal.devices"
		* unify scripts in carboncalc.js
			* Scripts concerning widget leave in carboncalc.js
			* Unique example with all calculations
			
*/

/*jslint nomen: true */
/*global jQuery, carbonCalc, console */

var carbonCalc = carbonCalc || {};

carbonCalc.school = (function (global, $) {
	
	"use strict";
	
	var defaultsCalculate =  {
			tpSchool: "secondarySchool",
			qtStudents: 1,
			qtBooks: 0,
			qtClothes: 0,
			qtNotebooks: 0,
			qtPens: 0,
			hoursPerDayLaptop: 0,
			hoursPerDayKindle: 0,
			hoursPerDayIPad: 0,
			kmPerDayCar: 0,
			kmPerDayBus: 0,
			kmPerDayTrain: 0
		},
		schoolType = {
			primarySchool: {
				text: "Primary School",
				studyingDaysPerYear: 170,
				kgCO2PerYearPerStudent: 333.2696
			},
			secondarySchool: {
				text: "Secondary School",
				studyingDaysPerYear: 200,
				kgCO2PerYearPerStudent: 446.44136
			},
			secondarySchoolWithPool: {
				text: "Secondary School With Pool",
				studyingDaysPerYear: 200,
				kgCO2PerYearPerStudent: 493.12552
			}
		},
		utilitiesType = {
			book: {
				text: "book",
				factor: 5
			},
			clothes: {
				text: "Clothe",
				factor: 6.693
			},
			notebook: {
				text: "Notebook",
				factor: 0.2739
			},
			
			pen: {
				text: "Pen",
				factor: 0.0065
			}
		},
		devicesType = {
			laptop: {
				text: "Laptop",
				factor: 0.0344952
			},
			kindle: {
				text: "Kindle",
				factor: 0.000402444
			},
			iPad: {
				text: "iPad",
				factor: 0.001816747
			}
		},
		transportType = {
			bus: {
				text: "Bus",
				factor: 0.10033
			},
			car: {
				text: "Car",
				factor: 0.18635
			},
			train: {
				text: "Train",
				factor: 0.045057182
			}
		};
	
	// The parameter of "options" is the same as "defaultsCalculate"
	function calculateSchoolFacility(options) {
		
		var facility = schoolType[options.tpSchool],
			qtStudents = options.qtStudents,
			kgCO2ePerYear = qtStudents * facility.kgCO2PerYearPerStudent;
		console.log("SchoolFacilities:" + kgCO2ePerYear);
		return {
			kgCO2ePerYear: kgCO2ePerYear
		};
	}
	
	// The parameter of "options" is the same as "defaultsCalculate"
	function calculateUtilities(options) {
		
		var qtStudents = options.qtStudents,
			kgCO2ePerYear = (options.qtBooks * utilitiesType.book.factor * qtStudents) +
				(options.qtClothes * utilitiesType.clothes.factor * qtStudents) +
				(options.qtNotebooks * utilitiesType.notebook.factor * qtStudents) +
				(options.qtPens * utilitiesType.pen.factor * qtStudents);
				
		console.log("Utilities:" + kgCO2ePerYear);
		return {
			kgCO2ePerYear: kgCO2ePerYear
		};
		
	}
	
	// The parameter of "options" is the same as "defaultsCalculate"
	function calculateDevices(options) {
		
		
		var facility = schoolType[options.tpSchool],
			qtStudents = options.qtStudents,
			days = facility.studyingDaysPerYear,
			kgCO2ePerYear = (options.hoursPerDayLaptop * devicesType.laptop.factor * qtStudents * days) +
				(options.hoursPerDayKindle * devicesType.kindle.factor * qtStudents * days) +
				(options.hoursPerDayIPad * devicesType.iPad.factor * qtStudents * days);
				
		console.log("Devices:" + kgCO2ePerYear);
		return {
			kgCO2ePerYear: kgCO2ePerYear
		};
		
	}
	
	// The parameter of "options" is the same as "defaultsCalculate"
	function calculateTrasportation(options) {
		
		var facility = schoolType[options.tpSchool],
			qtStudents = options.qtStudents,
			days = facility.studyingDaysPerYear,
			kgCO2ePerYear = (options.kmPerDayCar * transportType.car.factor * qtStudents * days) +
				(options.kmPerDayBus * transportType.bus.factor * qtStudents * days) +
				(options.kmPerDayTrain * transportType.train.factor * qtStudents * days);
		
		console.log("Transportation:" + kgCO2ePerYear);
		
		return {
			kgCO2ePerYear: kgCO2ePerYear
		};
		
	}
	
	return {
		
		schoolType: schoolType,
		
		utilitiesType: utilitiesType,
		
		devicesType: devicesType,
		
		transportType: transportType,

		defaultsCalculate: defaultsCalculate,
		
		calculate: function (options) {
			
			console.log("calculate");
			
			options = $.extend(true, {}, this.defaultsCalculate, options);
			
			var resultSchoolFacility = calculateSchoolFacility(options),
				resultUtilities = calculateUtilities(options),
				resultDevices = calculateDevices(options),
				resultTransportation = calculateTrasportation(options);
			
			return {
				resultSchoolFacility: resultSchoolFacility,
				resultUtilities: resultUtilities,
				resultDevices: resultDevices,
				resultTransportation: resultTransportation,
				kgCO2ePerYear: resultSchoolFacility.kgCO2ePerYear +
					resultUtilities.kgCO2ePerYear +
					resultDevices.kgCO2ePerYear +
					resultTransportation.kgCO2ePerYear
			};
		}
		
	};
	
}(window, jQuery));

(function ($) {
	"use strict";
	
	$.widget("carbonCalc.school", {
		
		// Options will fill with more properties in _create
		options: {
			result: {
				kgCO2ePerYear: 0
			},
			delayResult: 1000,
			title: "Carbon Calculator School"
			
		},

		calculate: function () {

			var result = carbonCalc.school.calculate(this.options);
			
			result.kgCO2e = 0;

			return result;

		},
		
		_qtFromInput: function (element) {
			var total = parseInt($(element).val(), 10);
			if (!total && total !== 0) {
				total = 1;
				$(element).val(total);
			}
			return total;
		},
			 
		_create : function () {
			
			var that = this,
				$divResult,
				$accordionDiv;
			
			this.options = $.extend(true, {}, carbonCalc.school.defaultsCalculate, this.options);
			
			this._idResulkgCO2e = "resulkgCO2e";

			this._$mainDiv = $("<div class='carbon-div-main'></div>")
				.appendTo(this.element)
				.hide();

			this._$mainDiv.append("<h1>" + this.options.title + "</h1>");
            
			$accordionDiv = $("<div></div>")
				.appendTo(this._$mainDiv);
			
			this._createSchoolGroup($accordionDiv);

			this._createUtitiliesGroup($accordionDiv);

			this._createDevicesGroup($accordionDiv);
			
			this._createTransportationGroup($accordionDiv);
			
			$accordionDiv.accordion({
				//collapisable: true
				heightStyle: "content"
			});
			
			this._$mainDiv.append("<br>");
			$("<button class='carboncalc-button-calculate'>Calculate</button>")
				.appendTo(this._$mainDiv)
				.on("click", function () {
					that._showResult();
				});

			$divResult = $("<div class='carboncalc-div-result'></div>")
				.appendTo(this._$mainDiv)
				.hide();
			
			
			$("<div class='carboncalc-div-result-kgCO2e'></div>")
				.appendTo($divResult)
				.append("<span id='" + this._idResulkgCO2e + "' class='carboncalc-result-kgCO2e-value'></span>")
				.append("<span class='carboncalc-result-kgCO2e-unit'> kgCO2e/y</span>");

			
			$("<div class='carboncalc-div-result-loading'></div>")
				.appendTo(this._$mainDiv)
				.hide();

			
			this._$mainDiv.fadeIn(500);

		},
		
		_createAccordionItem: function ($parentDiv, name) {
			
			var $accordionItem = $("<div></div>");
			
			$parentDiv
				.append("<h3>" + name + "</h3>")
				.append($accordionItem);
			
			return $accordionItem;
			
		},
		
		_createSchoolGroup: function ($parentDiv) {
			
			var $schoolGroup = this._createAccordionItem($parentDiv, "School"),
				schoolType = carbonCalc.school.schoolType,
				$schoolType,
				_this = this;
			
			$("<label for='school'>School</label>").appendTo($schoolGroup);
			$schoolType = $("<select id='school'></select>")
                .appendTo($schoolGroup)
                .on("change", function () {
                    _this.options.tpSchool = $(this).val();
				});
            Object.keys(schoolType).forEach(function (schoolTypeName, index, arr) {
				$("<option value='" + schoolTypeName + "'>" + schoolType[schoolTypeName].text + "</option>").appendTo($schoolType);
			});
			$schoolType.val(this.options.tpSchool);
			
			this._createInputNumber($schoolGroup, "students", "Students", null, "qtStudents", true, 1);
//			this._createInputNumber($schoolGroup, "studyingDaysPerYear", "Studying Days Per Year", null, "studyingDaysPerYear", true);
			
		},
		
		_createUtitiliesGroup: function ($parentDiv) {
			var $utitilitiesGroup = this._createAccordionItem($parentDiv, "Utilities");
			this._createInputNumber($utitilitiesGroup, "books", "Books (units/year)", null, "qtBooks", false, 0);
			this._createInputNumber($utitilitiesGroup, "clothes", "Clothes (units/year)", null, "qtClothes", true, 0);
			this._createInputNumber($utitilitiesGroup, "notebooks", "Notebooks (units/year)", null, "qtNotebooks", true, 0);
			this._createInputNumber($utitilitiesGroup, "pens", "Pens (units/year)", null, "qtPens", true, 0);
		},
		
		_createDevicesGroup: function ($parentDiv) {
			var $devicesGroup = this._createAccordionItem($parentDiv, "Devices");
			this._createInputNumber($devicesGroup, "laptop", "Laptop (hours/day)", null, "hoursPerDayLaptop", false, 0);
			this._createInputNumber($devicesGroup, "kindle", "Kindle (hours/day)", null, "hoursPerDayKindle", true, 0);
			this._createInputNumber($devicesGroup, "iPad", "iPad (hours/day)", null, "hoursPerDayIPad", true, 0);
		},
		
		_createTransportationGroup: function ($parentDiv) {
			var $transportationGroup = this._createAccordionItem($parentDiv, "Transportation");
			this._createInputNumber($transportationGroup, "car", "Car (km/day)", null, "kmPerDayCar", false, 0);
			this._createInputNumber($transportationGroup, "bus", "Bus (km/day)", null, "kmPerDayBus", true, 0);
			this._createInputNumber($transportationGroup, "train", "Train (km/day)", null, "kmPerDayTrain", true, 0);
		},
			
		_createInputNumber: function ($parentDiv, id, prelabel, posLabel, optionName, isNewLine, min) {

			var _this = this;
			
			if (isNewLine) {
				$parentDiv.append("<br>");
			}
			
			if (prelabel) {
				$("<label for='" + id + "'>" + prelabel + "</label>").appendTo($parentDiv);
			}
			$("<input id='" + id + "' class='carboncalc-input-maxlength-3' type='number' maxlength='3' min='" + min + "' max='999' value='" + this.options[optionName] + "'>")
				.appendTo($parentDiv)
				.on("change", function () {
					_this.options[optionName] = _this._qtFromInput(this);
				});
			if (posLabel) {
				$("<label for='" + id + "'>" + posLabel + "</label>").appendTo($parentDiv);
			}
			
		},
		
		_createInputCheck: function (div, id, name, value, label, checked, click) {
			$("<input type='check' id='" + id + "' name='" + name + "'" + " value='" + value + "' " + checked + " >")
				.appendTo(div)
				.on("click", click);
			$("<label for='" + id + "' >" + label + "</label>").appendTo(div);
		},

		_destroy: function () {
			this._$mainDiv.remove();

		},

		_canCalculate: function () {
			return true;
		},
		
		_showResult: function () {

			if (this._canCalculate()) {
				
				this._$mainDiv.find("input, select, button").prop("disabled", true);
				
				this._$mainDiv.find('.carboncalc-div-result').hide();
				this._$mainDiv.find('.carboncalc-div-result-loading').fadeIn(100);

				var result = this.calculate(),
					formatNumber = function (number) {
						return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
					},
					that = this;
				
				this._$mainDiv.find("#" + this._idResulkgCO2e).text(formatNumber(result.kgCO2ePerYear));

				setTimeout(function () {
					that._$mainDiv.find('.carboncalc-div-result-loading').hide();
					that._$mainDiv.find('.carboncalc-div-result').show();
					that._$mainDiv.find('.carboncalc-div-result-auxiliary').effect("bounce", {times: 10}, 1600);
					that._$mainDiv.find('.carboncalc-div-result-kgCO2e').effect("bounce", {times: 10}, 1600);

					that._$mainDiv.find("input, select, button").removeAttr('disabled');
					
				}, that.options.delayResult);

			}

		}
		

	});

	return carbonCalc;
	
}(jQuery));