sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("UI5OCRTickets.controller.Main", {

        onClickTakePhoto: function (oEvent) {
            var that = this;
            //Base64 JPG Prefix
            var JPG_BASE64_PREFIX = "data:image/jpeg;base64,";

            // Take picture using device camera and retrieve image as base64-encoded string
            navigator.camera.getPicture(
                function(imageURI) {
                    //On Success
                    that.sImgBase64 = JPG_BASE64_PREFIX + imageURI;
                    var sImgBlob = that.b64toBlob(imageURI, JPG_BASE64_PREFIX);

                    var other = that;

                    window.Tesseract.recognize(sImgBlob, {lang:'spa'})
                        .progress(message => {
                        console.log(message);
                    sap.ui.core.BusyIndicator.show();
                })
                .catch(err => console.error(err))
                .then(result => {
                        other.byId("__input5").setValue(result.text);
                    sap.ui.core.BusyIndicator.hide();
                })
                .finally(resultOrError => {

                    var oDate = /(\d{2}(?:\/|-|\s)){2}\d{2}/;
                    var oPlace = /\b.+S(?:\.)?(?:\s)?A(?:\.)?/i;
                    var sDate = resultOrError.text.match(oDate);
                    var sPlace = resultOrError.text.match(oPlace);

                    try {
                        other.byId("__input0").setValue(sDate[0]);


                    } catch(err) {

                        other.byId("__input0").setValue("");

                    }
                    try {
                        other.byId("__input5").setValue(sPlace[0]);


                    } catch(err) {

                        other.byId("__input5").setValue("");

                    }

                    var oCuil = /\d{2}[-]\d{8}[-]\d{1}/g;
                    var sCuil = resultOrError.text.match(oCuil);
                    var oTotal =/(?:Total\:\s)(?:\w+\s)(\d+)(?:.|,|s)(\d+)/;
                    var sTotal =resultOrError.text.match(oTotal);
                    try {
                        other.byId("__input1").setValue(sCuil[0]);
                    } catch(err) {
                        other.byId("__input1").setValue("");
                    }
                    try{
                        other.byId("__input2").setValue(sTotal[1] + "." + sTotal[2]);
                    } catch(err) {
                        other.byId("__input2").setValue("");
                    }
                    var linesArray = [];
                    for(var i = 0; i < resultOrError.lines.length; i++ ){
                        var valToPush = {
                            text: resultOrError.lines[i].text
                        };
                        linesArray.push(valToPush);
                    }
                    sap.ui.core.BusyIndicator.hide();
                    //dropdown w/text lines
                    var oDropdownModel = new sap.ui.model.json.JSONModel({
                        values: linesArray
                    });

                    other.getView().setModel(oDropdownModel, "dropdownSL");
                    var notMatch = {
                        text: " "
                    }
                    var linesPlace = [];
                    var linesDate = [];
                    var lineTotal = [];
                    var linesCuil = [];
                    try {
                        for(var i = 0; i < sPlace.length; i++ ){
                            var valToPush = {
                                text: sPlace[i]
                            };
                            linesPlace.push(valToPush);
                        }
                    }catch(sPlace){
                        linesPlace.push(notMatch);
                    }
                    try{
                        for(var i = 0; i < sDate.length; i++){
                            var valToPush = {
                                text: sDate[i]
                            };
                            linesDate.push(valToPush);
                        }
                    }catch(sDate){
                        linesDate.push(notMatch);
                    }
                    try{
                        for(var i = 0; i < sCuil.length; i++){
                            var valToPush = {
                                text: sCuil[i]
                            };
                            linesCuil.push(valToPush);
                        }
                    }catch(sCuil){
                        linesCuil.push(notMatch);
                    }
                    try{

                        for(var i = 0; i < sTotal.length; i++){
                            var valToPush = {
                                text: sTotal[i]
                            };
                            lineTotal.push(valToPush);
                        }
                    }catch(sTotal){
                        lineTotal.push(notMatch);
                    }
                    var oMatchsModel = new sap.ui.model.json.JSONModel({
                        place : linesPlace,
                        date : linesDate,
                        cuil : linesCuil,
                        total : lineTotal
                    });

                    other.getView().setModel(oMatchsModel, "matchModel");


                })

                },
                function(err) {
                    //On Fail
                    console.log(err.toString());
                }, {
                    //Camera parameters
                    quality: 30,
                    targetWidth: 1936,
                    targetHeight: 2592,
                    destinationType: 0,
                    saveToPhotoAlbum: true
                });

        },
        applyValues: function(control, model) {
            control.setValue(model.oData.values);
            model.setData("values", "");
        },



        onClickCopyText: function(oEvent){
            var lineSelected = this.getView().byId("selectRecognizedText").getSelectedItem().getText();
            var oSelectedItemModel = new sap.ui.model.json.JSONModel({
                values: lineSelected
            });
            this.getView().setModel(oSelectedItemModel, "selectedMD");
            var input0 = this.getView().byId("__input0");
            var input1 = this.getView().byId("__input1");
            var input2 = this.getView().byId("__input2");
            var input5 = this.getView().byId("__input5");
            var andother = this;
            input0.addEventDelegate({
                onfocusin : function() {
                    if (input0.getValue().length == 0){
                        var model = andother.getView().getModel("selectedMD");
                        andother.applyValues(input0, model);
                        andother.getView().byId("selectRecognizedText").setSelectedItem(null);
                    }
                }
            });
            input1.addEventDelegate({
                onfocusin : function() {
                    if (input1.getValue().length == 0){
                        var model = andother.getView().getModel("selectedMD");
                        andother.applyValues(input1, model);
                        andother.getView().byId("selectRecognizedText").setSelectedItem(null);
                    }
                }
            });
            input2.addEventDelegate({
                onfocusin : function() {
                    if (input2.getValue().length == 0){
                        var model = andother.getView().getModel("selectedMD");
                        andother.applyValues(input2, model);
                        andother.getView().byId("selectRecognizedText").setSelectedItem(null);
                    }
                }
            });
            input5.addEventDelegate({
                onfocusin : function() {
                    if (input5.getValue().length == 0){
                        var model = andother.getView().getModel("selectedMD");
                        andother.applyValues(input5, model);
                        andother.getView().byId("selectRecognizedText").setSelectedItem(null);
                    }
                }
            });
        },

        /**
         * Function to convert a base64 string in a Blob according to the data and contentType.
         *
         * @param sB64Data {String} Pure base64 string without contentType
         * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
         * @param sliceSize {Int} SliceSize to process the byteCharacters
         * @return Blob
         * @Author: ivan.n.puszkiel
         */
        b64toBlob: function(sB64Data, contentType, sliceSize) {
            var sContentType = contentType || '';
            var iSliceSize = sliceSize || 512;

            var oByteCharacters = atob(sB64Data);
            var aByteArrays = [];

            for (var offset = 0; offset < oByteCharacters.length; offset += iSliceSize) {
                var slice = oByteCharacters.slice(offset, offset + iSliceSize);

                var aByteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    aByteNumbers[i] = slice.charCodeAt(i);
                }

                var aByteArray = new Uint8Array(aByteNumbers);

                aByteArrays.push(aByteArray);
            }

            return new Blob(aByteArrays, {type: sContentType});
        },



        onOpenDialog : function (oPressId) {
            var oView = this.getView();
            var oDialog = oView.byId("helloDialog");
            var oInput = oPressId.getParameter("id");

            var oIdModel = new sap.ui.model.json.JSONModel({
                input : oInput
            });
            this.getView().setModel(oIdModel, "buttonIdModel");



            if (!oDialog) {
                oDialog = sap.ui.xmlfragment(oView.getId(), "UI5OCRTickets.view.MatchesDialog", this);
                oView.addDependent(oDialog);
            }
            var list;
            if (oInput.includes("buttonPlace")){
                list =  this.getView().getModel("matchModel").getProperty("/place/");
            }else if(oInput.includes("buttonCuil")){
                list =  this.getView().getModel("matchModel").getProperty("/cuil/");
            }else if(oInput.includes("buttonDate")){
                list =  this.getView().getModel("matchModel").getProperty("/date/");
            }else{
                list =  this.getView().getModel("matchModel").getProperty("/total/");
            }


            if (list) {
                var oListModel = new sap.ui.model.json.JSONModel({
                    listValues: list
                });
                this.getView().setModel(oListModel, "matchesList");
            }


            oDialog.open();
        },
        onCloseDialog : function () {
            this.getView().byId("helloDialog").close();
        },

        onCopyLine : function(oEvent) {

            var itemSelected = oEvent.oSource._$ItemPressed.context.innerText;
            var idButtonPress = this.getView().getModel("buttonIdModel").oData.input;

            this.getView().byId("helloDialog").close();

            if (idButtonPress.includes("buttonPlace")){
                this.getView().byId("__input5").setValue(itemSelected);
            }else if (idButtonPress.includes("buttonCuil")){
                this.getView().byId("__input1").setValue(itemSelected);
            }else if (idButtonPress.includes("buttonDate")){
                this.getView().byId("__input0").setValue(itemSelected);
            }else{
                this.getView().byId("__input2").setValue(itemSelected);
            }

        }

    });
});