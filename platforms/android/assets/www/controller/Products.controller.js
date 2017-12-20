sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function(Controller, History) {
    "use strict";

    return Controller.extend("UI5OCRTickets.controller.Products", {

        onNavBack: function () {
            var oHistory, sPreviousHash;

            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash) {
                window.history.go(-1);
            } else {
                var onRootPage = sap.ui.core.UIComponent.getRouterFor(this);
                onRootPage.navTo("Main");
            }
        }




    });
});