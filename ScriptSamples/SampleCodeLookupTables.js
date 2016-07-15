
// use the REST interface get internal field name for JSON below or in a csv file:
// https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/_api/ProjectServer/LookupTables

var healthLUT_GUID = "0000a4aa-160e-499a-905f-d498472dfb35" // got from rest
var object = new PS.LookupEntryValue()
var object = new PS.LookupEntryCreationInformation()
https://msdn.microsoft.com/en-us/library/office/jj670071.aspx
https://msdn.microsoft.com/en-us/library/office/jj668653.aspx


    function onQuerySucceeded(sender, args) {

        projContext = PS.ProjectContext.get_current();
        var lookupTable = lookupTables.getByGuid('16216553-dbea-4770-b7cd-5f565ebea160');
        var ltEntries = lookupTable.get_entries();

        projContext.load(ltEntries);
        //'Include(FullValue)'
        projContext.executeQueryAsync(function () {
        
            var lookupEnumerator = ltEntries.getEnumerator();
            while (lookupEnumerator.moveNext())
            {
                var entry = lookupEnumerator.get_current();
                projContext = PS.ProjectContext.get_current();

                projContext.load(entry, "FullValue")



// Retrieve custom fields and lookup table definitions
var custom_fields = context.get_customFields();
var project_custom_field = custom_fields.getByGuid(GetIdByName(custom_fields, project_custom_field_name));
//var resource_custom_field = custom_fields.getByGuid(GetIdByName(custom_fields, resource_custom_field_name));
//var task_custom_field = custom_fields.getByGuid(GetIdByName(custom_fields, task_custom_field_name));

var project_lookup_table_entries = project_custom_field.get_lookupEntries();
//var task_lookup_table_entries = task_custom_field.get_lookupEntries();
//var resource_lookup_table_entries = resource_custom_field.get_lookupEntries();

context.load(project_custom_field);
//context.load(resource_custom_field);
//context.load(task_custom_field);
context.load(project_lookup_table_entries);
//context.load(task_lookup_table_entries);
//context.load(resource_lookup_table_entries);


 
Guid LTuid = CustomFieldName.First().LookupTable.Id;
 
projContext.Load(LookupTableList.First().Entries);
projContext.ExecuteQuery();

foreach (LookupEntry lutEntry in LookupTableList.First().Entries)
{
     Guid Id = new Guid(Value.Remove(0, 6));
if (lutEntry.Id == Id)
    str = lutEntry.FullValue.ToString();





private static void CreateLookup(Guid LookupTableGuid)
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
 
 
 
private static void AddEntriesToExistingLookup(Guid LookupTableGuid)
{
            LookupTable ExistingLookupTable = projContext.LookupTables.GetByGuid(LookupTableGuid);
projContext.ExecuteQuery();
 
LookupEntryCreationInformation FirstNewLookupEntry = new LookupEntryCreationInformation();
FirstNewLookupEntry.Description = "First New Lookup Entry";
var id = Guid.NewGuid();
FirstNewLookupEntry.Id = id;
FirstNewLookupEntry.Value = new LookupEntryValue();
FirstNewLookupEntry.Value.TextValue = "cc";
 
LookupEntryCreationInformation SecondNewLookupEntry = new LookupEntryCreationInformation();
SecondNewLookupEntry.Value = new LookupEntryValue();
SecondNewLookupEntry.Value.TextValue = "ddd";
SecondNewLookupEntry.ParentId = id;
SecondNewLookupEntry.Description = "Second New Lookup Entry";
SecondNewLookupEntry.Id = Guid.NewGuid();
 
List<LookupEntryCreationInformation> ListOfEntries = new List<LookupEntryCreationInformation>();
 
ListOfEntries.Add(FirstNewLookupEntry);
ListOfEntries.Add(SecondNewLookupEntry);
 
ExistingLookupTable.Entries.Add(FirstNewLookupEntry);
ExistingLookupTable.Entries.Add(SecondNewLookupEntry);
 
projContext.LookupTables.Update();
projContext.ExecuteQuery();
}
 
 
private static void ModifyExistingLookupEntry(Guid LookupTableGuid)
{
            LookupTable ExistingLookupTable = projContext.LookupTables.GetByGuid(LookupTableGuid);
 
projContext.Load(ExistingLookupTable.Entries);
projContext.ExecuteQuery();
 
LookupEntry ExistingLookupEntry = ExistingLookupTable.Entries.Where(x => x.FullValue == "aa.bbb").SingleOrDefault();
LookupEntry ExistingParentLookupEntry = ExistingLookupTable.Entries.Where(x => x.FullValue == "aa").SingleOrDefault();
 
//use a LookupEntryCreationInformation object? That doesn't seem right. 
//but, if the id is the same as an existing id, it seems to work...
//and, if you don't specify the parentid, it will be cleared, and the item will no longer be a child item
LookupEntryCreationInformation FirstNewLookupEntry = new LookupEntryCreationInformation();
FirstNewLookupEntry.Description = ExistingLookupEntry.Description;
FirstNewLookupEntry.Id = ExistingLookupEntry.Id;
FirstNewLookupEntry.ParentId = ExistingParentLookupEntry.Id;
FirstNewLookupEntry.Value = new LookupEntryValue();
FirstNewLookupEntry.Value.TextValue = "mmm";
 
ExistingLookupTable.Entries.Add(FirstNewLookupEntry);
projContext.LookupTables.Update();
projContext.ExecuteQuery();
}






// Get entries in lookup table
LookupTable lookupTable = context.LookupTables.GetByGuid(tableGuid);
context.Load(lookupTable.Entries);
context.ExecuteQuery();

LookupEntryCreationInformation newEntry = new LookupEntryCreationInformation();
newEntry.Id = Guid.NewGuid();
newEntry.Value = new LookupEntryValue();
newEntry.Value.TextValue = "The one that cannot be removed...";
lookupTable.Entries.Add(newEntry);

while(lookupTable.Entries.Count > 1)
{
    // If there are items in the collection, then remove the first item
    LookupEntry e = lookupTable.Entries[0];
    lookupTable.Entries.Remove(e);
}

// Upload the change to cloud
context.LookupTables.Update();
context.ExecuteQuery();







How to add indentation to entries to lookup table

LookupTableCreationInformation linfo = new LookupTableCreationInformation();
linfo.Id = Guid.NewGuid();
linfo.Name = "Test 01";
linfo.SortOrder = LookupTableSortOrder.Ascending;

LookupMask mask = new LookupMask();
mask.Length = 2;
mask.MaskType = LookupTableMaskSequence.CHARACTERS;
mask.Separator = ".";

LookupMask mask2 = new LookupMask();
mask2.Length = 5;
mask2.MaskType = LookupTableMaskSequence.CHARACTERS;
mask2.Separator = ".";


LookupEntryCreationInformfation LCntCrInf = new LookupEntryCreationInformation();
LCntCrInf.Description = "Test";
var id = Guid.NewGuid();
LCntCrInf.Id = id;
LCntCrInf.Value = new LookupEntryValue();
LCntCrInf.Value.TextValue = "Aa";

LookupEntryCreationInformation EntryInfo2 = new LookupEntryCreationInformation();
EntryInfo2.Value = new LookupEntryValue();
EntryInfo2.Value.TextValue = "Bb";
EntryInfo2.ParentId = id;
EntryInfo2.Description ="level2";
EntryInfo2.Id = Guid.NewGuid();

List<LookupEntryCreationInformation> lcreInfo = new List<LookupEntryCreationInformation>();
List<LookupMask> lmaskCreIf = new List<LookupMask>();

lmaskCreIf.Add(mask);
lmaskCreIf.Add(mask2);






