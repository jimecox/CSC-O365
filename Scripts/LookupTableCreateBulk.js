// https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/_api/ProjectServer/LookupTables('0000a4aa-160e-499a-905f-d498472dfb35')/Entries
// http://ps.rlan.ca/PWA/_api/ProjectServer/LookupTables
sendMsgToScreen("r1 LUTBulk")



$(document).on('click', '#Button9', function (e) {

    myLutName = "newLut1"
    myLutType = "Text"
    lutSortOrder = 0   // 1 ascending, 2 descending, 0 for as entered

    createLookUpTablesBulk(myLutName, myLutType, lutSortOrder)
});


// new common function to create the lut in bulk
function createLookUpTablesBulk(lutName, lutType, lutSortOrder) {

    if (lutType === "Text") {
        lutType = 21;
    } else if (lutType === "Date") {
        lutType = 4;
    } else if (lutType === "Duration") {
        lutType = 6;
    } else if (lutType === "Cost") {
        lutType = 9;
    } else if (lutType === "Number") {
        lutType = 15;
    } else {
        alert("no field type was passed, check paramater input")
    }

    var lookupTables = projContext.get_lookupTables();
    projContext.load(lookupTables, 'Include(Name, Id, FieldType,SortOrder)');  // use rest call above to confirm field names
    projContext.executeQueryAsync(
    function () {
        var newLut = new PS.LookupTableCreationInformation();
        var newLutId = SP.Guid.newGuid();
        newLut.set_id(newLutId);
        newLut.set_name(lutName)
        newLut.set_type(lutType);
        newLut.set_sortOrder(lutSortOrder);

        // new common function to create the lut in bulk
        function createLookUpTablesBulk(lutName, lutType, lutSortOrder) {

            if (lutType === "Text") {
                lutType = 21;
            } else if (lutType === "Date") {
                lutType = 4;
            } else if (lutType === "Duration") {
                lutType = 6;
            } else if (lutType === "Cost") {
                lutType = 9;
            } else if (lutType === "Number") {
                lutType = 15;
            } else {
                alert("no field type was passed, check paramater input")
            }

            var lookupTables = projContext.get_lookupTables();
            projContext.load(lookupTables, 'Include(Name, Id, FieldType, SortOrder)');  // use rest call above to confirm field names
            projContext.executeQueryAsync(
            function () {
                // init LUT
                var newLut = new PS.LookupTableCreationInformation();
                var newLutId = SP.Guid.newGuid();
                newLut.set_id(newLutId);
                newLut.set_name(lutName)
                newLut.set_sortOrder(lutSortOrder);

                // init the mask
                var lookupMask = new PS.LookupMask()
                lookupMask.set_length = 0;
                lookupMask.set_maskType = 3;
                lookupMask.set_separator = ".";
                lookupTables.add(lookupMask);
                lookupTables.update(lookupMask);  

                // add entries
                var lutEntries = [];
                var lutEntry = new PS.LookupEntryCreationInformation();
                var newId = SP.Guid.newGuid();
                lutEntry.set_id(newId);
                lutEntry.set_description("my descr");
                lutEntry.set_sortIndex(0);
                lutEntry.set_parentId(null);
                var lutValue = new PS.LookupEntryValue();
                lutValue.set_textValue("Blocked");
                lutEntry.set_value(lutValue);
                lutEntries.push(lutEntry);

                newLUT.set_entries(lutEntries);
                
                // add, update, execute lut
                lookupTables.add(newLut);
                lookupTables.update(newLut);
                projContext.executeQueryAsync(
                function () {
                    alert("success - added the LUT go check")
                }, newLutFailed
                );
            }, loadlookupTablesFailed
            );
            // failed functions
            function newLutFailed() {
                alert("dam newLutFailed")
            }
            function loadlookupTablesFailed() {
                alert("dam loadLookupTablesFailed")
            }

        }; // end createLookUpTablesBulk
        // the above wont work -  Lookup Entries are required as they also actually specify what the Field Type is


// sample part one c#
        List<LookupMask> masks = new List<LookupMask>();
        LookupMask mask1 = new LookupMask();
        mask1.Separator = ".";
        mask1.Length = 0;
        mask1.MaskType = LookupTableMaskSequence.CHARACTERS;

        masks.Add(mask1);
    
        LookupTableCreationInformation ltci = new LookupTableCreationInformation();                

        ltci.Id = Guid.NewGuid();
        ltci.Name = "MyLookupTable";
        ltci.Masks = masks;                

        ltci.SortOrder = LookupTableSortOrder.Ascending;
    
        LookupTable table = pContext.LookupTables.Add(ltci);
        pContext.LookupTables.Update();
    
        pContext.ExecuteQuery();





// part 2 in jsom sample
        // Create the Lookup Table Entries
        var lutEntries = [];
        var lutEntry = new PS.LookupEntryCreationInformation();
        var newId = SP.Guid.newGuid();
        lutEntry.set_id(newId);
        lutEntry.set_description("my descr");
        lutEntry.set_sortIndex(0);
        lutEntry.set_parentId(null);

        var lutValue = new PS.LookupEntryValue();
        lutValue.set_textValue("Blocked");
        lutEntry.set_value(lutValue);
        lutEntries.push(lutEntry);

        newLUT.set_entries(lutEntries);



// this is csom samples
private static void CreateLookupTable(Guid LookupTableGuid)
{
LookupTableCreationInformation NewLookupTable = new LookupTableCreationInformation();
NewLookupTable.Id = LookupTableGuid;
NewLookupTable.Name = "NewLookupTable";
NewLookupTable.SortOrder = LookupTableSortOrder.Ascending;
 
LookupMask mask = new LookupMask();
mask.Length = 2;
mask.MaskType = LookupTableMaskSequence.CHARACTERS;
mask.Separator = ".";
 
LookupMask mask2 = new LookupMask();
mask2.Length = 3;
mask2.MaskType = LookupTableMaskSequence.CHARACTERS;
mask2.Separator = ".";
 
LookupEntryCreationInformation FirstLookupEntry = new LookupEntryCreationInformation();
FirstLookupEntry.Description = "First Description";
var id = Guid.NewGuid();
FirstLookupEntry.Id = id;
FirstLookupEntry.Value = new LookupEntryValue();
FirstLookupEntry.Value.TextValue = "aa";
 
LookupEntryCreationInformation SecondLookupEntry = new LookupEntryCreationInformation();
SecondLookupEntry.Value = new LookupEntryValue();
SecondLookupEntry.Value.TextValue = "bbb";
//set the parent id = the id of the previous item
SecondLookupEntry.ParentId = id;
SecondLookupEntry.Description = "Second Description";
SecondLookupEntry.Id = Guid.NewGuid();
 
List<LookupEntryCreationInformation> ListOfEntries = new List<LookupEntryCreationInformation>();
List<LookupMask> ListOfMasks = new List<LookupMask>();
 
ListOfMasks.Add(mask);
ListOfMasks.Add(mask2);
 
ListOfEntries.Add(FirstLookupEntry);
ListOfEntries.Add(SecondLookupEntry);
 
NewLookupTable.Masks = ListOfMasks;
NewLookupTable.Entries = ListOfEntries;
 
projContext.LookupTables.Add(NewLookupTable);
projContext.LookupTables.Update();
 
projContext.ExecuteQuery();
}



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