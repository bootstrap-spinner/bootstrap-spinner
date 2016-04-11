
!function ($) {
    "use strict";

    function spinner(select, options) {
        this.$select = $(select);
        this.options = this.mergeOptions($.extend({}, options, this.$select.data()));
        this.buildContainer();
        this.buildLabel();
        this.bindChangeEvent();
    }

    spinner.prototype = {

        defaults: {
            labelText: function (options, select) {
                if (options.length === 0) {
                    return this.emptyText;
                }
            },
            labelClass: 'label label-warning lable-spinner',
            labelWidth: 'auto',
            labelContainer: '<label><label>',
            emptyText: 'Nothing',
            templates: {
                input_group: '<div class="input-group"></div>',
                input: '<input type="text" class="spinner form-control" placeholder="Enter Something" />',
                input_group_Container: '<div class="input-group-btn"><span class="input-group-btn "><button id="btn-spin-up" class="btn btn-default spin-btn-Up glyphicon glyphicon-menu-up" type="button"></button><button id="btn-spin-down" class="btn btn-default spin-btn-Down glyphicon glyphicon-menu-down" type="button"></button></span></div>',
                label: '<label class="label label-warning" ></label>'
            }
        },
        constructor: spinner,
        buildContainer: function () {
            this.$container = $(this.options.labelContainer);
        },
        buildLabel: function () {
            this.$label = $(this.options.templates.label).addClass(this.options.labelClass);
            if (this.options.labelWidth && this.options.labelWidth !== 'auto') {
                this.$label.css({
                    'width': this.options.labelWidth,
                    'overflow': 'hidden',
                    'text-overflow': 'ellipsis'
                });
                this.$container.css({
                    'width': this.options.labelWidth
                });
            }
            this.$container.prepend(this.$label);
        },
        onChange: function (option, checked) {

        },
        mergeOptions: function (options) {
            return $.extend(true, {}, this.defaults, this.options, options);
        },
        bindChangeEvent: function () {

        },
        updateLabelText: function () {

        }
    };

    $.fn.spinner = function (option, parameter, extraOptions) {
        var settings = $.extend({
            labelClass: "label label-warning",
            emptyText: "Nothing",
            InitValue: 0,
            minValue: 0,
            step: 1,
            maxValue: 50,
            allowDecimal: false,
            decimalPrecision: 2
        }, option);

        return this.each(function () {
            var selector = $(this);
            var oldval, newVal;
            var allowDecimal = settings.allowDecimal;
            if (selector != null) {
                if (parseInt(settings.InitValue) < parseInt(settings.minValue)) {
                    settings.InitValue = settings.minValue;
                } else if (parseInt(settings.InitValue) > parseInt(settings.maxValue)) {
                    settings.InitValue = settings.maxValue;
                }
                var inputgrp_div = $.parseHTML(spinner.prototype.defaults.templates.input_group);
                var input_group_Container = $.parseHTML(spinner.prototype.defaults.templates.input_group_Container);
                var spinupId = $(input_group_Container).find('button:first-child').attr('id');
                var spindownId = $(input_group_Container).find('button:last-child').attr('id');
                var label = $.parseHTML(spinner.prototype.defaults.labelContainer);
                var labelClass = spinner.prototype.defaults.labelClass;
                $(label).attr('Class', labelClass);
                $(label).text(settings.emptyText);

                if ($(selector).next().length == 0) {
                    $(selector).before(inputgrp_div);
                    $(selector).addClass('spinner');

                    if (allowDecimal == true) {
                        $(selector).val(parseFloat(settings.InitValue).toFixed(settings.decimalPrecision));
                    } else {
                        $(selector).val(parseInt(settings.InitValue));
                    }

                    $(inputgrp_div).append(selector);
                    $(selector).after(input_group_Container);

                }
                else {
                    $(selector).next().text(settings.emptyText);
                }

                $(selector).keydown(function (e) {

                    if (e.which == 8) {
                        oldval = $(selector).val();
                    } else {
                        newVal = $(selector).val();
                    }

                });

                $(selector).keyup(function (e) {

                    if ((e.which >= 48 && e.which <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                        newVal = $(selector).val();
                    }
                    if ($(selector).val().length > 0) {
                        $('#' + spinupId).removeAttr('disabled');
                        $('#' + spindownId).removeAttr('disabled');
                    }
                    else {
                        $('#' + spinupId).attr('disabled', 'disabled');
                        $('#' + spindownId).attr('disabled', 'disabled');
                    }
                });

                $(selector).keypress(function (e) {

                    if ($(this).val().indexOf('.') >= 0 && e.which == 46) {
                        e.preventDefault();
                    }
                    else if (e.which >= 48 && e.which <= 57 || e.which == 46) {
                        var Max, Min;
                        if (settings.allowDecimal == true) {
                            if ($(this)[0].selectionStart > $(this).val().indexOf('.') && $(this).val().indexOf('.') != -1) {
                                if ($(this).val().substring($(this).val().indexOf('.') + 1, $(this).val().length).length >= parseInt(settings.decimalPrecision)) {
                                    return false;
                                }
                            }
                            if ($(this).val().indexOf('.') == -1 || $(this).val().indexOf('.') >= 0) {
                                var TextValue = $(selector).val().insert($(this)[0].selectionStart, String.fromCharCode(e.keyCode));
                                Max = parseFloat(settings.maxValue);
                                Min = parseFloat(settings.minValue);
                                if (TextValue == "" || isNaN(TextValue)) {
                                    TextValue = parseFloat(0).toFixed(settings.decimalPrecision);
                                }
                                if (TextValue <= Max && TextValue >= Min) {
                                    return true;
                                }
                                else {
                                    if (parseFloat(TextValue) <= Min) {
                                        $(selector).val(parseFloat(Min).toFixed(settings.decimalPrecision));
                                        return false;
                                    }
                                    else if (parseFloat(TextValue) >= Max) {
                                        $(selector).val(parseFloat(Max).toFixed(settings.decimalPrecision));
                                        return false;
                                    }
                                }
                                if ($(this).val().substring($(this).val().indexOf('.') + 1, $(this).val().length).length >= parseInt(settings.decimalPrecision)) {
                                    return false;
                                }
                            }
                            else {
                                return false;
                            }
                        }
                        else if (settings.allowDecimal == false) {
                            var TextValue = $(selector).val() + String.fromCharCode(e.keyCode);
                            if (TextValue == "") TextValue = 0;
                            if (parseInt(TextValue) < settings.maxValue && parseInt(TextValue) >= settings.minValue) {
                                return true;
                            }
                            else {
                                $(selector).val($(selector).val());
                                return false;
                            }
                        }
                    }
                    else {
                        return false;
                    }
                });

                $('#' + spinupId).on('click', function (event) {
                    if (allowDecimal == true) {
                        Increment(selector, settings);
                    } else {
                        if (parseInt($(selector).val()) < settings.maxValue) {
                            $(selector).val(parseInt($(selector).val()) + 1);
                        }
                    }

                })

                $('#' + spindownId).on('click', function (event) {
                    if (allowDecimal == true) {
                        Decrement(selector, settings);

                    } else {
                        if (parseInt($(selector).val()) > settings.minValue) {
                            $(selector).val(parseInt($(selector).val()) - 1);
                        }
                    }
                })

                $(selector).bind('mousewheel', function (e) {
                    if (e.originalEvent.wheelDelta / 120 > 0) {
                        Increment(selector, settings);
                    }
                    else {
                        Decrement(selector, settings);
                    }
                });

                $(selector).on("change paste", function (e) {
                    var TextValue = $(selector).val()
                    if (settings.allowDecimal == true) {
                        if ($(this).val().indexOf('.') == -1 || $(this).val().indexOf('.') >= 0) {
                            var Max = parseFloat(settings.maxValue);//.toFixed(settings.decimalPrecision);
                            var Min = parseFloat(settings.minValue);//.toFixed(settings.decimalPrecision);
                            if (TextValue == "" || isNaN(TextValue)) {
                                TextValue = parseFloat(0).toFixed(settings.decimalPrecision);
                            }
                            if (TextValue <= Max && TextValue >= Min) {
                                return true;
                            }
                            else {
                                if (parseFloat(TextValue) <= Min) {
                                    $(selector).val(parseFloat(Min).toFixed(settings.decimalPrecision));
                                    return false;
                                }
                                else if (parseFloat(TextValue) >= Max) {
                                    $(selector).val(parseFloat(Max).toFixed(settings.decimalPrecision));
                                    return false;
                                }
                            }
                        }
                    }

                });
            }
            var data = $(this).data('spinner');
            var options = typeof option === 'object' && option;

            // Initialize the spinner.
            if (!data) {
                data = new spinner(this, options);
                $(this).data('spinner', data);
            }

            // Call multiselect method.
            if (typeof option === 'string') {
                data[option](parameter, extraOptions);

                if (option === 'destroy') {
                    $(this).data('spinner', false);
                }
            }
        });
    };

    function Increment(selector, settings) {
        if (settings.allowDecimal == true) {
            var newval = parseFloat($(selector).val());
            var steps = (settings.step).toString();
            steps = (settings.step);
            
            //var newStepsVal = padZero(settings.decimalPrecision);
            //steps = parseFloat(steps.insert(steps.indexOf('.') + 1, newStepsVal));

            if (parseFloat(newval + steps).toFixed(settings.decimalPrecision) <= parseFloat(settings.maxValue).toFixed(settings.decimalPrecision)) {
                $(selector).val(parseFloat(newval + steps).toFixed(settings.decimalPrecision));
            }
        } else {
            if (parseInt($(selector).val()) < settings.maxValue) {
                $(selector).val(parseInt($(selector).val()) + 1);
            }
        }
    }

    function Decrement(selector, settings) {
        if (settings.allowDecimal == true) {
            var newval = parseFloat($(selector).val());
            var steps = (settings.step).toString();
            steps = (settings.step);
            //var newStepsVal = padZero(settings.decimalPrecision);
            //steps = parseFloat(steps.insert(steps.indexOf('.') + 1, newStepsVal));

            if (parseFloat(newval - steps).toFixed(settings.decimalPrecision) >= parseFloat(settings.minValue).toFixed(settings.decimalPrecision)) {
                $(selector).val(parseFloat(newval - steps).toFixed(settings.decimalPrecision));
            }
        } else {
            if (parseInt($('#' + selector).val()) > settings.minValue) {
                $(selector).val(parseInt($(selector).val()) - 1);
            }
        }
    }

    String.prototype.insert = function (index, string) {
        if (index > 0)
            return this.substring(0, index) + string + this.substring(index, this.length);
        else
            return string + this;
    };

    $.fn.spinner.Constructor = spinner;

    function padZero(num) {
        var p = "";
        while (p.length < num - 1) p = "0" + p;
        return p
    }

    //Use this when no need to call plug in from load function
    //$(function () {
    //    $("input[type=text]").spinner();
    //});
}(window.jQuery);