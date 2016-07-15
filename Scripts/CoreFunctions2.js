//SP.SOD.executeOrDelayUntilScriptLoaded(initializePage, "PS.js");
//SP.SOD.executeOrDelayUntilScriptLoaded(initializePage2, "SP.js");
//alert(window.location.href)

jQuery(document).ready(function () {
    ExecuteOrDelayUntilScriptLoaded(initializePage, "ps.js");
});

sendMsgToScreen("r1 core")


function initializePage() {
    //setup event handlers etc

    //Get the Project context for this web
    projContext = PS.ProjectContext.get_current();

    var user = projContext.get_web().get_currentUser();
    projContext.load(user);
    // var web = projContext.get_web()  //.get_url();
    // projContext.load(web);

    projContext.executeQueryAsync(function () {
        // alert("just before cscmessage: " + user.get_title())  //+ url.get_url()
        // jim did this Jun 3 
        //  $("#cscMessage").text("csc Welcome: ");  //  + user.get_title()
        // var message = "Current User: " + user.get_title()
        // sendMsgToScreen(message)
        // var message = "Web URL: " + web.get_url()
        // sendMsgToScreen(message)

    }, onRequestFailed);
}
function onRequestFailed(sender, args) {
    alert("Failed to execute jinit page: " + args.get_message());
};


function getCustomFieldEntity(entityName, callback) {

    var entityTypes = projContext.get_entityTypes();
    var projEntity = entityTypes.get_projectEntity();
    var resourceEntity = entityTypes.get_resourceEntity();
    var taskEntity = entityTypes.get_taskEntity();

    projContext.load(entityTypes);
    projContext.load(projEntity);
    projContext.load(resourceEntity);
    projContext.load(taskEntity);

    projContext.executeQueryAsync(loadEntitiesSucceeded, loadEntitiesFailed);

    function loadEntitiesFailed() {
        alert("dam loadEntitiesFailed")
    }
    function loadEntitiesSucceeded() {

        alert("loadEntitiesSucceeded")

        if (entityName === "Task") {
            callback(taskEntity)
        } else if (entityName === "Project") {
            callback(projEntity)
        } else if (entityName === "Resource") {
            callback(resourceEntity)
        } else {
            alert("error passing cfEntity, neither Task, Project or Resource was passed. check your input paramaters")
        }

    };// end loadEntitiesSucceeded
};  // end get














function getLUT(luTableName, callback) {

    if (luTableName === "") {
        Alert("no lookup table assigned to this new custom field per the paramaters passed in")
    }

    var lookupTables = projContext.get_lookupTables();
    projContext.load(lookupTables);
    projContext.executeQueryAsync(loadLUTQuerySucceeded, loadlookupTablesFailed);

    function loadlookupTablesFailed() {
        alert("dam loadlookupTablesFailed")
    }
    function loadLUTQuerySucceeded() {
        var lutGuid = GetIdByName(lookupTables, luTableName)
        alert("lutGuid3 " + lutGuid)
        var myLUT = lookupTables.getByGuid(lutGuid);
        projContext.load(myLUT);
        projContext.executeQueryAsync(loadMyLutSuccess, loadMyLutFailed)

        function loadMyLutFailed() {
            alert("dam loadMyLutFailed")
        }

        function loadMyLutSuccess() {
            alert("dam loadMyLutSuccess")
            callback(myLUT)
        }
    };
};  // end get


// new common function to create the field
function createCustomFieldsBulk(cfName, myLUT, cfType, myEntity) {
  
    if (cfType === "Text") {
        cfType = PS.CustomFieldType.TEXT;
    } else if (cfType === "Date") {
        cfType = PS.CustomFieldType.Date;
    } else if (cfType === "Duration") {
        cfType = PS.CustomFieldType.Duration;
    } else if (cfType === "Cost") {
        cfType = PS.CustomFieldType.Cost;
    } else if (cfType === "Flag") {
        cfType = PS.CustomFieldType.Flag;
    } else if (cfType === "Number") {
        cfType = PS.CustomFieldType.Number;
    } else {
        alert("no field type was passed, check paramater input")
    }

    var customFields = projContext.get_customFields();
    projContext.load(customFields, 'Include(Name, LookupTable, InternalName, Id, Description, LookupDefaultValue, Formula, FieldType, IsRequired, IsMultilineText)');  // use rest call above to confirm field names
    projContext.executeQueryAsync(
    function () {
        var newCF = new PS.CustomFieldCreationInformation();
        var newId = SP.Guid.newGuid();
        newCF.set_id(newId);
        newCF.set_name(cfName)
        newCF.set_fieldType(cfType);
        newCF.set_lookupTable(myLUT)
        newCF.set_entityType(myEntity);
        customFields.add(newCF);
        customFields.update(newCF);
        projContext.executeQueryAsync(
        function () {
            alert("success - added the cf go check")
        }, newCFFailed
        );
    }, loadCustomFieldsFailed
    );
    // failed functions
    function newCFFailed() {
        alert("dam newCFFailed")
    }
    function loadCustomFieldsFailed() {
        alert("dam loadCustomFieldsFailed")
    }

};



/* Callback for success/failure */
function waitForQueueCallback(job_state) {
    //alert("did i get to queue callack")
    switch (job_state) {
        case PS.JobState.success:
            alert("Successfully updated the project with name '" + project.get_name() + "'.");
            break;
        case PS.JobState.readyForProcessing:
        case PS.JobState.processing:
        case PS.JobState.processingDeferred:
            alert("Updating the project with name '" + project.get_name() + "' is taking longer than usual.");
            break;
        case PS.JobState.failed:
        case PS.JobState.failedNotBlocking:
        case PS.JobState.correlationBlocked:
            alert("Failed to update the project. The update job is in state " + job_state);
            break;
        default:
            alert("Unknown error, job is in state " + job_state);
    }
};




function createCustomField(cfName) {
    var customFields = projContext.get_customFields();
    projContext.load(customFields, 'Include(Name, LookupTable, InternalName, Id, Description, LookupDefaultValue, Formula, FieldType, IsRequired, IsMultilineText)');  // use rest call above to confirm field names

    projContext.executeQueryAsync(
        function () {
            var newCF = new PS.CustomFieldCreationInformation();
            var newId = SP.Guid.newGuid();
            newCF.set_id(newId);
            newCF.set_name(cfName)
            newCF.set_fieldType(21);
            customFields.add(newCF);
            customFields.update(newCF);

            projContext.executeQueryAsync(
                function () {
                    alert("success - added the cf go check")

                }, newCFFailed
                );

            function newCFFailed() {
                alert("dam newCFFailed")
            }

        }, loadCFFailed
    );

    function loadCFFailed() {
        alert("dam loadCFFailed")
    }

}; // end createCustomField











// Retrieves an element id based on name from a collection
function GetIdByName(collection, objectName) {
    var collection_enumerator = collection.getEnumerator();
    while (collection_enumerator.moveNext()) {
        if (collection_enumerator.get_current().get_name() == objectName) {
            return collection_enumerator.get_current().get_id();
        }
    }
}

// Retrieves an Name based on Guid from a collection
function GetNameById(collection, Guid) {
    //alert("here")
    var collection_enumerator = collection.getEnumerator();
    while (collection_enumerator.moveNext()) {
        if (collection_enumerator.get_current().get_id() == Guid) {
            return collection_enumerator.get_current().get_name();
        }
    }
}



function getQueryStringValueByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


// Callback for request failure
function OnRequestFailed(sender, args) {
    alert("Failed to retrieve project. " + args.get_message());
};

function sendMsgToScreen(message) {
    var message = message
    // alert("message: " + message);

    $(document).ready(function () {
        var cscmsg = $('#cscMessage');
        // cscmsg.empty();
        cscmsg.append("<p>" + message + "</p>");
    }); // end doc ready

}; // end send meg to screen

function sendProjNameToScreen(message2) {
    var message2 = message2
    // alert("message: " + message);

    $(document).ready(function () {
        var cscProjName = $('#cscProjName');
        // cscmsg.empty();
        cscProjName.append("<h3>" + message2 + "</h3>");
    }); // end doc ready

}; // end send meg to screen