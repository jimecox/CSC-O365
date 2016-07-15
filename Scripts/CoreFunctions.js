SP.SOD.executeOrDelayUntilScriptLoaded(initializePage, "PS.js");
//SP.SOD.executeOrDelayUntilScriptLoaded(initializePage2, "SP.js");
//alert(window.location.href)

sendMsgToScreen("r2 core")



//$(document).ready(function () { ExecuteOrDelayUntilScriptLoaded(loadConstants, "sp.js"); });
//function loadConstants() {
//    var ctx = new SP.ClientContext.get_current();
//    var site = ctx.get_site();
//    IPC_siteUrl = site.get_url();
//    IPC_siteId = site.get_id();
//    var web = ctx.get_web();
//    alert(IPC_siteUrl)
//}

function initializePage() {
    //setup event handlers etc

    //Get the Project context for this web
    projContext = PS.ProjectContext.get_current();

    var user = projContext.get_web().get_currentUser();
    projContext.load(user);
    var web = projContext.get_web()  //.get_url();
    projContext.load(web);

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
    alert("Failed to execute init page: " + args.get_message());
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