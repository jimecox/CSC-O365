//using the REST interface get internal field name:
// https://microsoft.sharepoint.com/teams/JcoxTeamSite/PWA/_api/ProjectServer/CustomFields
//SP.SOD.executeOrDelayUntilScriptLoaded(initializePage, "PS.js");
 alert("gcf 2")
var healthCF = "Custom_0000e8d965f147699bd2819d38036fcc"
var customFieldName = 'Health';


function displayCF_LUT() {
    // Retrieve custom fields and lookup table definitions
    
    var customFields = projContext.get_customFields();
    projContext.load(customFields, 'Include(Name, InternalName, Id, Description, LookupDefaultValue, Formula, FieldType, IsRequired, IsMultilineText)');  // use rest call above to confirm field names
    //Send the request to the server
    projContext.executeQueryAsync(executeQueryAsyncSuccess, executeQueryAsyncFailed);

   // alert("got here past exec queyr to load cf")

    //Display the customFields in the drop down
    function executeQueryAsyncSuccess() {
        //alert("executeQueryAsyncSuccess")

   // var myCustomFieldGUID = customFields.getByGuid(GetIdByName(customFields, customFieldName));
   // var myCustomFieldGUID = customFields.getByGuid("0000e8d965f147699bd2819d38036fcc");

  //  alert(myCustomFieldGUID.get_id())

        var cfList = $('#cfList');
        cfList.empty();

        //provide UI cues to select data
        cfList.append($("<option></option>").attr("value", "").text("Select cf..."));

        var cfEnum = customFields.getEnumerator();
        while (cfEnum.moveNext()) {
            var cf = cfEnum.get_current();
            var cfID = cf.get_id();
            var cfName = cf.get_name();
            var cfInternalName = cf.get_internalName();
            var cfLookupDefaultValue = cf.get_lookupDefaultValue();
            var cfDescription = cf.get_description();
            var cfFormula = cf.get_formula();
            var cfFieldType = cf.get_fieldType();
            var cfIsRequired = cf.get_isRequired();
            var cfIsMultilineText = cf.get_isMultilineText();

                      
            alert(cfLookupDefaultValue)

           // cfList.append($("<option></option>").attr("value", "").text(cfName + " - " + cfDescription));
            cfList.append($("<option></option>").attr("value", "").text(cfName + "-" + cfDescription));
           // $("#showID").text("more manual stuff");
        }

    }

        function executeQueryAsyncFailed() {

            alert("dam execute query failed")

        }

}; // end display customFields


$(document).on('click', '#Button3', function (e) {

    //alert("Button clicked")
    displayCF_LUT()
});

displayCF_LUT()
displayProjects();



//<d:AppAlternateId m:type="Edm.Guid">0000783f-de84-434b-9564-284e5b7b3f49</d:AppAlternateId> 
//  <d:Description  m:null="true" /> 
//  <d:FieldType m:type="Edm.Int32">21</d:FieldType>    did not work
//  <d:Formula  m:null="true" /> 
//  <d:Id m:type="Edm.Guid">0000783f-de84-434b-9564-284e5b7b3f49</d:Id> 
//  <d:InternalName>Custom_0000783fde84434b9564284e5b7b3f49</d:InternalName> 
//  <d:IsEditableInVisibility m:type="Edm.Boolean">false</d:IsEditableInVisibility> 
//  <d:IsMultilineText m:type="Edm.Boolean">false</d:IsMultilineText> 
//  <d:IsRequired m:type="Edm.Boolean">false</d:IsRequired> 
//  <d:IsWorkflowControlled m:type="Edm.Boolean">false</d:IsWorkflowControlled> 
//  <d:LookupAllowMultiSelect m:type="Edm.Boolean">false</d:LookupAllowMultiSelect> 
//  <d:LookupDefaultValue m:type="Edm.Guid">00000000-0000-0000-0000-000000000000</d:LookupDefaultValue> 
//  <d:Name>Cost Type</d:Name> 
//  <d:RollsDownToAssignments m:type="Edm.Boolean">true</d:RollsDownToAssignments> 
//  <d:RollupType m:type="Edm.Int32">11</d:RollupType> 