// create the new custom field assigning the lookup table object 	        


var lookupMask = projContext.get_lookupMask();
projContext.load(lookupMask, 'Include(Name, Id)');  // use rest call above to confirm field names
projContext.executeQueryAsync(
function () {
    lookupMask.set_length = 0;
    lookupMask.set_type = 3;
    lookupMask.set_separator = ".";

}, loadLookupMaskFailed
);

var myMask = new PS.LookupMask()


PS.LookupMask.set_maskType(Number value)



var lookupTables = projContext.get_lookupTables();
projContext.load(lookupTables, 'Include(Name, Id, FieldType,SortOrder)');  // use rest call above to confirm field names
projContext.executeQueryAsync(
function () {
    var newLut = new PS.LookTableCreationInformation();
    var newLutId = SP.Guid.newGuid();
    newLut.set_id(newLutId);
    newLut.set_name(lutName)
    newLut.set_fieldType(lutType);
    newLut.set_sortOrder(lutSortOrder);
    lookupTables.add(newLut);
    lookupTables.update(newLut);
    projContext.executeQueryAsync(
    function () {
        alert("success - added the LUT go check")
    }, newLutFailed
    );
}, loadlookupTablesFailed






