// this works
//https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/_api/ProjectServer/LookupTables('0000a4aa-160e-499a-905f-d498472dfb35')/Entries
alert("LUT r1")  // this will just run when page is loaded

var lutGuid = "0000a4aa-160e-499a-905f-d498472dfb35"

$(document).on('click', '#Button4', function (e) {
    var projContext;    //reference to the Project Context
    var lutValue = $("#anyValue").val();  // we will get this from user and add it to a lut
    //alert("FieldValue: " + lutValue)
  //  alert("Button clicked")
    displayLookupTablePickList()
    showLutEntriesList()
});

function showLutEntriesList() {

    lookupTables = projContext.get_lookupTables();
    projContext.load(lookupTables);
    // Run the request on the server.
    projContext.executeQueryAsync(loadLUTQuerySucceeded, loadLUTQueryFailed);

    function loadLUTQuerySucceeded() {
       // alert("succeded to load lookup tables")
        healthLookupTable = lookupTables.getByGuid(lutGuid);
        projContext.load(healthLookupTable);
        //Send the request to the server
        projContext.executeQueryAsync(function () {

            var healthEntries = healthLookupTable.get_entries();
            projContext.load(healthEntries);
            projContext.executeQueryAsync(function () {

                var lutEntryEnum = healthEntries.getEnumerator();
                while (lutEntryEnum.moveNext()) {
                    var lutEntry = lutEntryEnum.get_current();
                    var lutEntryId = lutEntry.get_id();
                    var lutEntryName = lutEntry.get_fullValue();
                    var lutEntryIntName = lutEntry.get_internalName();
                    var lutEntrySortIndex = lutEntry.get_sortIndex();
                    var lutEntryAppAlternateId = lutEntry.get_appAlternateId()
                    var lutEntryDescr = lutEntry.get_description();

                    lutEntry.set_description("jim");
                    
                    lookupTables.update();


                    projContext.executeQueryAsync(function () {

                        alert("updated descr")

                    }, healthEntriesQueryAsyncFailed2
                 );

                    function healthEntriesQueryAsyncFailed2() {
                        alert("dam healthEntriesQueryAsyncFailed2")

                    }



                } // ol

            }, healthEntriesQueryAsyncFailed
        );

            function healthEntriesQueryAsyncFailed() {
                alert("dam healthEntriesQueryAsyncFailed")

            }

        }, healthLookupTableQueryAsyncFailed
        );


        function healthLookupTableQueryAsyncFailed() {
            alert("dam healthLookupTableQueryAsyncFailed")

        }

        // insert end


    }

    function loadLUTQueryFailed() {
        alert("dam loadLUTQueryFailed failed")
    }


}; // end showLutEntriesList





function displayLookupTablePickList() {
  
    //LUT List information will be placed inside lookupTableList variable
    lookupTables = projContext.get_lookupTables();

    //Signal the information that is going to be loaded
    projContext.load(lookupTables, 'Include(Name, Id)');
    //Send the request to the server
    projContext.executeQueryAsync(executeQueryAsyncSuccess, executeQueryAsyncFailed);
     
    //Display the lookupTableList in the drop downs and include the term checked out
    function executeQueryAsyncSuccess() {

        var lookupTableList = $('#lookupTableList');
        lookupTableList.empty();
        lookupTableList.append($("<option></option>").attr("value", "").text("Select LUT..."));

        var lutEnum = lookupTables.getEnumerator();
        while (lutEnum.moveNext()) {
            var lut = lutEnum.get_current();
            var lutID = lut.get_id();
            var lutName = lut.get_name();

            lookupTableList.append($("<option></option>").attr("value", "").text(lutName));
        }
    }

    function executeQueryAsyncFailed() {
        alert("dam execute query failed")
    }
}; // end display lookupTableList


// populate the dropdown box pick list
displayLookupTablePickList();









//- <m:properties>
//  <d:AppAlternateId m:type="Edm.Guid">00000000-0000-0000-0000-000000000000</d:AppAlternateId> 
//  <d:FieldType m:type="Edm.Int32">21</d:FieldType> 
//  <d:Id m:type="Edm.Guid">0000a4aa-160e-499a-905f-d498472dfb35</d:Id> 
//- <d:Masks m:type="Collection(PS.LookupMask)">
//- <d:element>
//  <d:Length m:type="Edm.Int32">0</d:Length> 
//  <d:MaskType m:type="Edm.Int32">3</d:MaskType> 
//  <d:Separator>.</d:Separator> 
//  </d:element>
//  </d:Masks>
//  <d:Name>Health</d:Name> 
//  <d:SortOrder m:type="Edm.Int32">0</d:SortOrder> 
//  </m:properties>