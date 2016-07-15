// this works
//https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/_api/ProjectServer/LookupTables('0000a4aa-160e-499a-905f-d498472dfb35')/Entries
http://ps.rlan.ca/PWA/_api/ProjectServer/LookupTables('0000a4aa-160e-499a-905f-d498472dfb35')/Entries('000079d2-4a43-41fc-b264-98d23fadd84b')/
http://ps.rlan.ca/PWA/_api/ProjectServer/LookupTables('0000a4aa-160e-499a-905f-d498472dfb35')/Entries('000079d2-4a43-41fc-b264-98d23fadd84b')/value
//alert("LUT r4")  // this will just run when page is loaded

var healthLutGuid = "0000a4aa-160e-499a-905f-d498472dfb35"

$(document).on('click', '#Button10', function (e) {
    var projContext;    //reference to the Project Context
    var lutValueFromScreen = $("#anyValue").val();  // we will get this from user and add it to a lut
    //alert("FieldValue: " + lutValue)
    
    addLutEntry(lutValueFromScreen)
});

function addLutEntry(NewValue) {

    lookupTables = projContext.get_lookupTables();
    projContext.load(lookupTables);
    projContext.executeQueryAsync(loadLUTQuerySucceeded, loadLUTQueryFailed);

    function loadLUTQuerySucceeded() {
        // alert("succeded to load lookup tables")
        myLut = lookupTables.getByGuid(healthLutGuid);
        projContext.load(myLut);
        //Send the request to the server
        projContext.executeQueryAsync(function () {

            var myEntries = myLut.get_entries();
            projContext.load(myEntries);
            projContext.executeQueryAsync(function () {

                // configure a new entry and add to the myLut
               // var lutNewEntries = [];
                var lutEntry = new PS.LookupEntryCreationInformation();
                var newId = SP.Guid.newGuid();
                lutEntry.set_id(newId);
                lutEntry.set_description("my descr");
                lutEntry.set_sortIndex(0);
                lutEntry.set_parentId(null);
                var lutValue = new PS.LookupEntryValue();
                lutValue.set_textValue("Blocked");
                lutEntry.set_value(lutValue);
              //  lutNewEntries.push(lutEntry);

                myEntries.add(lutEntry)
                lookupTables.update();


                        projContext.executeQueryAsync(function () {

                            alert("added entry to health table")

                        }, newDescrQueryAsyncFailed
                        );


                    function newDescrQueryAsyncFailed() {
                        alert("dam newDescrQueryAsyncFailed")
                    };

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

    }  // end loadLUTQuerySucceeded                      

    function loadLUTQueryFailed() {
        alert("dam loadLUTQueryFailed")
    }


}; // end add entries












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