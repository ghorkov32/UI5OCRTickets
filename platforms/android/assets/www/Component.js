sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"UI5OCRTickets/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("UI5OCRTickets.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
            this.getRouter().initialize();

			/*
            window.Tesseract = Tesseract.create({
                workerPath: './util/tesseract/worker.js',
                langPath: 'https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/',
                corePath: './util/tesseract/index.js'
            })
            */

            window.Tesseract = Tesseract.create({
                workerPath: 'https://cdn.rawgit.com/naptha/tesseract.js/1.0.10/dist/worker.js',
                langPath: 'https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/',
                corePath: 'https://cdn.rawgit.com/naptha/tesseract.js-core/0.1.0/index.js'
            });
		}
	});
});