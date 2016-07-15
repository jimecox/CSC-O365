

'use strict';

var context, donationList, appCtx;// = SP.ClientContext.get_current();
var notRecappedItems = "";
var listGUID = '';
var fieldName = 'WGY_Recapped';
var listBCTSettings = 'BCTSettings';
var listTitle = 'wgy_donations'
var bctSettingsGUIDField = 'BCTSettingValue';
var hostWebURL, appWebURL;
// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    // Get App web URL and Host Web URL from Query string parameter   
    hostWebURL = decodeURIComponent(manageQueryStringParameter('SPHostUrl'));
    setMsg('hostURL : ' + hostWebURL);
    appWebURL = decodeURIComponent(manageQueryStringParameter('SPAppWebUrl'));
    setMsg('appWebURL : ' + appWebURL);
    // var dfd = $.Deferred();
    context = new SP.ClientContext.get_current();//new SP.ClientContext(appWebURL);
    if (context)
        setMsg('context is valid');

    //factory = new SP.ProxyWebRequestExecutorFactory(appWebURL);
    //setMsg('factory : ' + factory);

    //context.set_webRequestExecutorFactory(factory);

    appCtx = new SP.AppContextSite(context, hostWebURL);
    if (appCtx)
        setMsg('App Context is valid');



    // parentContext = new SP.AppContextSite(new SP.ClientContext.get_current(), hostWebURL);
    // setMsg('parentContext : ' + parentContext);

    getDonationListGUID();

});


function getDonationListGUID() {
    setMsg("Query the List " + listBCTSettings + " for Item " + listTitle);
    var list = appCtx.get_web().get_lists().getByTitle(listBCTSettings);

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef Name='Title' /><Value Type='Text'>" + listTitle + "</Value></Eq></Where></Query></View>");

    var listItems = list.getItems(camlQuery);
    context.load(listItems);

    context.executeQueryAsync(Function.createDelegate(this, function () {
        var listEnumerator = listItems.getEnumerator();

        setMsg("Total  Items " + listItems.get_count());

        while (listEnumerator.moveNext()) {
            var listItem = listEnumerator.get_current();
            setMsg("Found  Item " + listItem.get_item(bctSettingsGUIDField));

            listGUID = listItem.get_item(bctSettingsGUIDField);
            break;
        }


    }), Function.createDelegate(this, queryFailed));

}



//method for read query string value  
function manageQueryStringParameter(paramToRetrieve) {


    var params = document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve) {
            return singleParam[1];
        }
    }
}
//This functions shows the step being executed
function setMsg(t) {
    $('#message').append("<br />" + t);

}
// This function prepares, loads, and then executes a SharePoint query to get the donations where RECAPPED = false
function updateRecapped() {

    setMsg("Loading List By GUID  " + listGUID);
    //var tList = web.get_lists().getByTitle(listName);
    donationList = appCtx.get_web().get_lists().getById(listGUID);
    var query = "<View><Query><Where><Eq><FieldRef Name='" + fieldName + "' /><Value Type='Integer'>0</Value></Eq></Where></Query></View>";
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(query);
    notRecappedItems = donationList.getItems(camlQuery);


    context.load(notRecappedItems);
    context.executeQueryAsync(Function.createDelegate(this, loadDonationsWithNoRecapped), Function.createDelegate(this, queryFailed));
}


// This function is executed if the above call is successful
// It will load the donations and bulk update them to set the RECAPPED = TRUE
function loadDonationsWithNoRecapped(sender, args) {
    setMsg("Donations has been loaded");

    var itemArray = [];
    //var oList = appCtx.get_web().get_lists().getByTitle(listName);
    var it = notRecappedItems.getEnumerator();

    var counter = 0;
    while (it.moveNext()) {
        counter = counter + 1;
        var oItem = it.get_current();
        var oListItem = donationList.getItemById(oItem.get_id());
        oListItem.refreshLoad();
        oListItem.set_item(fieldName, '1');
        oListItem.update();
        itemArray.push(oListItem);
        context.load(itemArray[itemArray.length - 1]);
    }
    if (counter == 0) {

        setMsg('No Item to update');
    } else {
        setMsg('Updating ... ' + counter);

        context.executeQueryAsync(Function.createDelegate(this, updateMultipleListItemsSuccess), Function.createDelegate(this, queryFailed));
    }
}

function updateMultipleListItemsSuccess() {
    setMsg('Items Updated');

}
// This function is executed if the above call fails
function queryFailed(sender, args) {
    setMsg("Webservices call Failed :" + args.get_message());
}




// second pagew

'use strict';

var context = SP.ClientContext.get_current();
var web = context.get_web();
var user = web.get_currentUser();
var notRecappedItems = "";
var listName = 'Donations';
var fieldName = 'WGY_Recapped';

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    getUserName();
});

// This function prepares, loads, and then executes a SharePoint query to get the current users information
function getUserName() {
    context.load(user);
    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
}


function setMsg(t) {
    $('#message').append("<br />" + t);

}

// This function is executed if the above call is successful
// It replaces the contents of the 'message' element with the user name

function onGetUserNameSuccess() {
    setMsg('Hello ' + user.get_title());
}

function updateRecapped() {

    setMsg("Loading List " + listName);
    var tList = web.get_lists().getByTitle(listName);

    var query = "<View><Query><Where><Eq><FieldRef Name='" + fieldName + "' /><Value Type='Integer'>0</Value></Eq></Where></Query></View>";
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(query);
    notRecappedItems = tList.getItems(camlQuery);


    context.load(notRecappedItems);
    context.executeQueryAsync(Function.createDelegate(this, loadDonationsWithNoRecapped), Function.createDelegate(this, queryFailed));
}

function queryFailed(sender, args) {
    setMsg("Webservices call Failed :" + args.get_message());
}
function loadDonationsWithNoRecapped(sender, args) {
    setMsg("Donations has been loaded");

    var itemArray = [];
    var oList = context.get_web().get_lists().getByTitle(listName);
    var it = notRecappedItems.getEnumerator();

    var counter = 0;
    while (it.moveNext()) {
        counter = counter + 1;
        var oItem = it.get_current();
        var oListItem = oList.getItemById(oItem.get_id());
        oListItem.refreshLoad();
        oListItem.set_item(fieldName, '1');
        oListItem.update();
        itemArray.push(oListItem);
        context.load(itemArray[itemArray.length - 1]);
    }
    if (counter == 0) {

        setMsg('No Item to update');
    } else {
        setMsg('Updating ... ' + counter);

        context.executeQueryAsync(updateMultipleListItemsSuccess, queryFailed);
    }
}
function updateMultipleListItemsSuccess() {
    setMsg('Items Updated');

}


// This function is executed if the above call fails
function onGetUserNameFail(sender, args) {
    alert('Failed to get user name. Error:' + args.get_message());
}


var collList;
function retrieveAllListProperties() {

    var clientContext = SP.ClientContext.get_current();
    var oWebsite = clientContext.get_web();
    collList = oWebsite.get_lists();

    clientContext.load(collList);

    clientContext.executeQueryAsync(Function.createDelegate(this, onQuerySucceeded), Function.createDelegate(this, onQueryFailed));
}

function onQuerySucceeded() {

    var listInfo = '';

    var listEnumerator = collList.getEnumerator();

    while (listEnumerator.moveNext()) {
        var oList = listEnumerator.get_current();
        listInfo += 'Title: ' + oList.get_title() + '<br />';
    }
    setMsg(listInfo);
}

function onQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
