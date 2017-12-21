sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function(Controller, History) {
    "use strict";

    return Controller.extend("UI5OCRTickets.controller.Products", {

        onInit: function() {
            var bus = sap.ui.getCore().getEventBus();
            bus.subscribe("Products", "makeModel", this.makeModel, this);
        },
        makeModel: function(channelId, eventId, data) {
            var list = data.oData.values;
            var lineOfList = [];

            for(var i = 0; i < list.length; i++ ){
                var valToPush = {
                    text: list[i].text
                };
                lineOfList.push(valToPush);
            }
            var oMakeModel = new sap.ui.model.json.JSONModel({
                listValues: lineOfList
            });
            this.getView().setModel(oMakeModel, "listLines")
        },

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
        },
        onOpenHeaderDialog : function () {
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
        },




    });
});