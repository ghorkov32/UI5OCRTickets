sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function(Controller, History) {
    "use strict";

    return Controller.extend("UI5OCRTickets.controller.InputProduct", {



        onNavBack: function () {
            var oHistory, sPreviousHash;

            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash) {
                window.history.go(-1);
            } else {
                var onRootPage = sap.ui.core.UIComponent.getRouterFor(this);
                onRootPage.navTo("Products");
            }
        }
        /*onOpenHeaderDialog : function () {
            var oView = this.getView();
            var oDialog = oView.byId("headerDialog");
            if (!oDialog) {
                oDialog = sap.ui.xmlfragment(oView.getId(), "UI5OCRTickets.view.HeaderProducts", this);
                oView.addDependent(oDialog);
            }
            oDialog.open();
        },
        onCloseHeaderDialog : function () {
            this.getView().byId("headerDialog").close();
        },*/


    });
});