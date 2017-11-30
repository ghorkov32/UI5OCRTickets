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

                        var oCuil= /\d{2}[-]\d{8}[-]\d{1}/g;
                        var sCuil= resultOrError.text.match(oCuil);

                                other.byId("__input1").setValue(sCuil[0]);
                                other.byId("__input5").setValue(result.text);
                            sap.ui.core.BusyIndicator.hide();
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


	});
});