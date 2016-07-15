
//alert( "r4")  // this will just run when page is loaded


var ewa = null;

// Add event handler for onload event.
if (window.attachEvent) {
    window.attachEvent("onload", ewaOnPageLoad);
}
else {
    window.addEventListener("DOMContentLoaded", ewaOnPageLoad, false);
}

// Add event handler for applicationReady event.
function ewaOnPageLoad() {
    Ewa.EwaControl.add_applicationReady(onApplicationReady);
}

function onApplicationReady() {
    // Get a reference to the Excel Services Web Part.
    ewa = Ewa.EwaControl.getInstances().getItem(0);
}

function getRangeFromSheetButton() {
    // Get range "B2:C5" from sheet, "mySheet". Ewa.Sheet.getRange(firstRow, firstColumn, rowCount, columnCount);

    var range = ewa.getActiveWorkbook().getActiveSheet().getRange(6, 3, 1, 6);

    // Get values from range.
    range.getValuesAsync(0, getRangeValues, range);
}

function getRangeValues(asyncResult) {
    // Get the value from asyncResult if the asynchronous operation was successful.
    if (asyncResult.getCode() == 0) {
        // Get range from user context.
        var range = asyncResult.getUserContext();

        // Get the array of range values from asyncResult.
        var values = asyncResult.getReturnValue();

        // Display range coordinates in A1 notation and associated values.
        var output = "Values from range" + range.getAddressA1() + "\n";
        output = output + "********\n";

        // Loop through the array of range values.
        for (var i = 0; i < values.length; i++) {
            for (var j = 0; j < values[i].length; j++) {
                output = output + values[i][j] + '\n';
            }
        }

        output = output + "********";

        // Display each value in the array returned by getValuesAsync.
        alert(output);
    }
    else {
        alert('Operation failed with error message ' + asyncResult.getDescription() + '.');
    }
}



$(document).on('click', '#Button1', function (e) {
    
    alert("Button clicked")
    getRangeFromSheetButton()
});


