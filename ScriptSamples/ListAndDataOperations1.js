

// Website tasks
function retrieveWebsite(resultpanel) {
    var clientContext;

    clientContext = SP.ClientContext.get_current();
    this.oWebsite = clientContext.get_web();
    clientContext.load(this.oWebsite);

    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        resultpanel.innerHTML = "Web site title: " + this.oWebsite.get_title();
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

function retrieveWebsiteProps(resultpanel) {
    var clientContext;

    clientContext = new SP.ClientContext.get_current();
    this.oWebsite = clientContext.get_web();

    clientContext.load(this.oWebsite, "Description", "Created");

    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        resultpanel.innerHTML = "Description: " + this.oWebsite.get_description() +
            "<br/>Date created: " + this.oWebsite.get_created();
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

function writeWebsiteProps(resultpanel) {
    var clientContext;

    clientContext = new SP.ClientContext.get_current();
    this.oWebsite = clientContext.get_web();

    this.oWebsite.set_description("This is an updated description.");
    this.oWebsite.update();

    clientContext.load(this.oWebsite, "Description");

    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );


    function successHandler() {
        resultpanel.innerHTML = "Web site description: " + this.oWebsite.get_description();
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

// Lists tasks
function readAllProps(resultpanel) {
    var clientContext;
    var oWebsite;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();

    this.collList = oWebsite.get_lists();
    clientContext.load(this.collList);

    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        var listInfo;
        var listEnumerator;

        listEnumerator = this.collList.getEnumerator();

        listInfo = "";
        while (listEnumerator.moveNext()) {
            var oList = listEnumerator.get_current();
            listInfo += "Title: " + oList.get_title() + " Created: " +
                oList.get_created().toString() + "<br/>";
        }

        resultpanel.innerHTML = listInfo;
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

function readSpecificProps(resultpanel) {
    var clientContext;
    var oWebsite;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();

    this.collList = oWebsite.get_lists();

    clientContext.load(this.collList, "Include(Title, Id)");

    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        var listInfo;
        var listEnumerator;

        listEnumerator = this.collList.getEnumerator();

        listInfo = "";
        while (listEnumerator.moveNext()) {
            var oList = listEnumerator.get_current();
            listInfo += "Title: " + oList.get_title() +
                " ID: " + oList.get_id().toString() + "<br/>";
        }

        resultpanel.innerHTML = listInfo;
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

function readColl(resultpanel) {
    var clientContext;
    var oWebsite;
    var collList;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();
    collList = oWebsite.get_lists();

    this.listInfoCollection = clientContext.loadQuery(collList, "Include(Title, Id)");

    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        var listInfo;

        listInfo = "";
        for (var i = 0; i < this.listInfoCollection.length; i++) {
            var oList = this.listInfoCollection[i];
            listInfo += "Title: " + oList.get_title() +
                " ID: " + oList.get_id().toString() + "<br/>";
        }

        resultpanel.innerHTML = listInfo;
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

function readFilter(resultpanel) {
    var clientContext;
    var oWebsite;
    var collList;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();
    collList = oWebsite.get_lists();

    this.listInfoArray = clientContext.loadQuery(collList,
        "Include(Title,Fields.Include(Title,InternalName))");

    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        var listInfo;

        for (var i = 0; i < this.listInfoArray.length; i++) {
            var oList = this.listInfoArray[i];
            var collField = oList.get_fields();
            var fieldEnumerator = collField.getEnumerator();

            listInfo = "";
            while (fieldEnumerator.moveNext()) {
                var oField = fieldEnumerator.get_current();
                var regEx = new RegExp("name", "ig");

                if (regEx.test(oField.get_internalName())) {
                    listInfo += "List: " + oList.get_title() +
                        "<br/>&nbsp;&nbsp;&nbsp;&nbsp;Field Title: " + oField.get_title() +
                        "<br/>&nbsp;&nbsp;&nbsp;&nbsp;Field Internal name: " + oField.get_internalName();
                }
            }
        }

        resultpanel.innerHTML = listInfo;
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

// Create, update and delete lists
function createList(resultpanel) {
    var clientContext;
    var oWebsite;
    var listCreationInfo;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();

    listCreationInfo = new SP.ListCreationInformation();
    listCreationInfo.set_title("My Announcements List");
    listCreationInfo.set_templateType(SP.ListTemplateType.announcements);

    this.oList = oWebsite.get_lists().add(listCreationInfo);
    clientContext.load(this.oList);

    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        resultpanel.innerHTML = "Go to the <a href='../Lists/My Announcements List'>list</a>.";
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

function updateList(resultpanel) {
    var clientContext;
    var oWebsite;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();

    this.oList = oWebsite.get_lists().getByTitle("My Announcements List");
    this.oList.set_description("New Announcements List");
    this.oList.update();

    clientContext.load(this.oList);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        resultpanel.innerHTML = "Check the description in the <a href='../Lists/My Announcements List'>list</a>.";
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

function addField(resultpanel) {
    var clientContext;
    var oWebsite;
    var oList;
    var fieldNumber;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();
    oList = oWebsite.get_lists().getByTitle("My Announcements List");

    this.oField = oList.get_fields().addFieldAsXml(
        "<Field DisplayName='MyField' Type='Number' />",
        true,
        SP.AddFieldOptions.defaultValue
    );

    fieldNumber = clientContext.castTo(this.oField, SP.FieldNumber);
    fieldNumber.set_maximumValue(100);
    fieldNumber.set_minimumValue(35);
    fieldNumber.update();

    clientContext.load(this.oField);

    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        resultpanel.innerHTML = "The <a href='../Lists/My Announcements List'>list</a> with a new field.";
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

function deleteList(resultpanel) {
    var clientContext;
    var oWebsite;
    var oList;

    this.listTitle = "My Announcements List";

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();
    oList = oWebsite.get_lists().getByTitle(this.listTitle);
    oList.deleteObject();

    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        resultpanel.innerHTML = this.listTitle + " deleted.";
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

// Create, update and delete folders
function createFolder(resultpanel) {
    var clientContext;
    var oWebsite;
    var oList;
    var itemCreateInfo;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();
    oList = oWebsite.get_lists().getByTitle("Shared Documents");

    itemCreateInfo = new SP.ListItemCreationInformation();
    itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
    itemCreateInfo.set_leafName("My new folder!");
    this.oListItem = oList.addItem(itemCreateInfo);
    this.oListItem.update();

    clientContext.load(this.oListItem);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        resultpanel.innerHTML = "Go to the <a href='../Lists/Shared Documents'>document library</a> to see your new folder.";
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

function updateFolder(resultpanel) {
    var clientContext;
    var oWebsite;
    var oList;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();
    oList = oWebsite.get_lists().getByTitle("Shared Documents");

    this.oListItem = oList.getItemById(1);
    this.oListItem.set_item("FileLeafRef", "My updated folder");
    this.oListItem.update();

    clientContext.load(this.oListItem);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        resultpanel.innerHTML = "Go to the <a href='../Lists/Shared Documents'>document library</a> to see your updated folder.";
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

function deleteFolder(resultpanel) {
    var clientContext;
    var oWebsite;
    var oList;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();
    oList = oWebsite.get_lists().getByTitle("Shared Documents");

    this.oListItem = oList.getItemById(1);
    this.oListItem.deleteObject();

    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        resultpanel.innerHTML = "Go to the <a href='../Lists/Shared Documents'>document library</a> to make sure the folder is no longer there.";
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

// List item tasks
function readItems(resultpanel) {
    var clientContext;
    var oWebsite;
    var oList;
    var camlQuery;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();
    oList = oWebsite.get_lists().getByTitle("Announcements");
    camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
        '<Value Type=\'Number\'>1</Value></Geq></Where></Query>' +
        '<RowLimit>10</RowLimit></View>'
    );
    this.collListItem = oList.getItems(camlQuery);

    clientContext.load(this.collListItem);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        var listItemInfo;
        var listItemEnumerator;

        listItemEnumerator = this.collListItem.getEnumerator();

        listItemInfo = "";
        while (listItemEnumerator.moveNext()) {
            var oListItem;
            oListItem = listItemEnumerator.get_current();
            listItemInfo += "ID: " + oListItem.get_id() + "<br/>" +
                "Title: " + oListItem.get_item("Title") + "<br/>" +
                "Body: " + oListItem.get_item("Body") + "<br/>";
        }

        resultpanel.innerHTML = listItemInfo;
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

function readInclude(resultpanel) {
    var clientContext;
    var oWebsite;
    var oList;
    var camlQuery;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();
    oList = oWebsite.get_lists().getByTitle("Announcements");
    camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View><RowLimit>100</RowLimit></View>');

    this.collListItem = oList.getItems(camlQuery);

    clientContext.load(this.collListItem, "Include(Id, DisplayName, HasUniqueRoleAssignments)");
    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        var listItemInfo;
        var listItemEnumerator;

        listItemEnumerator = this.collListItem.getEnumerator();

        listItemInfo = "";
        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            listItemInfo += "ID: " + oListItem.get_id() + "<br/>" +
            "Display name: " + oListItem.get_displayName() + "<br/>" +
            "Unique role assignments: " + oListItem.get_hasUniqueRoleAssignments() + "<br/>";
        }

        resultpanel.innerHTML = listItemInfo;
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

// Create, update and delete list items
function createListItem(resultpanel) {
    var clientContext;
    var oWebsite;
    var oList;
    var itemCreateInfo;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();
    oList = oWebsite.get_lists().getByTitle("Announcements");

    itemCreateInfo = new SP.ListItemCreationInformation();
    this.oListItem = oList.addItem(itemCreateInfo);
    this.oListItem.set_item("Title", "My New Item!");
    this.oListItem.set_item("Body", "Hello World!");
    this.oListItem.update();

    clientContext.load(this.oListItem);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        resultpanel.innerHTML = "Go to the <a href='../Lists/Announcements'>list</a> to see your new item.";
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

function updateListItem(resultpanel) {
    var clientContext;
    var oWebsite;
    var oList;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();
    oList = oWebsite.get_lists().getByTitle("Announcements");

    this.oListItem = oList.getItemById(1);
    this.oListItem.set_item("Title", "My updated title");
    this.oListItem.update();

    clientContext.load(this.oListItem);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        resultpanel.innerHTML = "Go to the <a href='../Lists/Announcements'>list</a> to see your updated item.";
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}

function deleteListItem(resultpanel) {
    var clientContext;
    var oWebsite;
    var oList;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();
    oList = oWebsite.get_lists().getByTitle("Announcements");

    this.oListItem = oList.getItemById(1);
    this.oListItem.deleteObject();

    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );

    function successHandler() {
        resultpanel.innerHTML = "Go to the <a href='../Lists/Announcements'>list</a> to make sure the item is no longer there.";
    }

    function errorHandler() {
        resultpanel.innerHTML = "Request failed: " + arguments[1].get_message();
    }
}




// net curry way

/// <reference path="_references.js" />




'use strict';

///The helper method to manage the Host and App Web Url
function manageQueryStringParameter(paramToRetrieve) {
    var params =
    document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve) {
            return singleParam[1];
        }
    }
}

var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();


var hostWebUrl;
var appWebUrl;

var listItemToUpdate; // The global declaration for Update and Delete the ListItem
var listItemId; //This global list item id used for Update and delete 

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    //getUserName();

    //SPHostUrl – the full URL of the host site 
    //SPAppWebUrl – the full URL of the app web

    hostWebUrl = decodeURIComponent(manageQueryStringParameter('SPHostUrl'));
    appWebUrl = decodeURIComponent(manageQueryStringParameter('SPAppWebUrl'));
    //debugger;
    //alert("Host Web Url " + hostWebUrl);
    //alert("App Web Url " + appWebUrl);

    listAllCategories();

    $("#btn-new").on('click', function () {
        $(".c1").val('');
    });



    $("#btn-add").on('click', function () {
        createCategory();
        listAllCategories();
    });

    $("#btn-update").on('click', function () {
        updateItem();
        listAllCategories();
    });

    $("#btn-find").on('click', function () {
        findListItem();
    });


    $("#btn-delete").on('click', function () {
        deleteListItem();
        listAllCategories();
    });






});

//My Code Here

//<------Function To Create a New Category In List ------->

function createCategory() {
    var ctx = new SP.ClientContext(appWebUrl);//Get the SharePoint Context object based upon the URL
    var appCtxSite = new SP.AppContextSite(ctx, hostWebUrl);

    var web = appCtxSite.get_web(); //Get the Site 

    var list = web.get_lists().getByTitle("CategoryList"); //Get the List based upon the Title
    var listCreationInformation = new SP.ListItemCreationInformation(); //Object for creating Item in the List
    var listItem = list.addItem(listCreationInformation);

    listItem.set_item("Title", $("#CategoryId").val());
    listItem.set_item("CategoryName", $("#CategoryName").val());
    listItem.update(); //Update the List Item

    ctx.load(listItem);
    //Execute the batch Asynchronously
    ctx.executeQueryAsync(
        Function.createDelegate(this, success),
        Function.createDelegate(this, fail)
       );
}
//<--------------------Ends Here-------------------------->


//<----------Function To List All Categories--------->
function listAllCategories() {

    var ctx = new SP.ClientContext(appWebUrl);
    var appCtxSite = new SP.AppContextSite(ctx, hostWebUrl);

    var web = appCtxSite.get_web(); //Get the Web 

    var list = web.get_lists().getByTitle("CategoryList"); //Get the List

    var query = new SP.CamlQuery(); //The Query object. This is used to query for data in the List

    query.set_viewXml('<View><RowLimit></RowLimit>10</View>');

    var items = list.getItems(query);

    ctx.load(list); //Retrieves the properties of a client object from the server.
    ctx.load(items);

    var table = $("#tblcategories");
    var innerHtml = "<tr><td>ID</td><td>Category Id</td><td>Category Name</td></tr>";

    //Execute the Query Asynchronously
    ctx.executeQueryAsync(
        Function.createDelegate(this, function () {
            var itemInfo = '';
            var enumerator = items.getEnumerator();
            while (enumerator.moveNext()) {
                var currentListItem = enumerator.get_current();
                innerHtml += "<tr><td>" + currentListItem.get_item('ID') + "</td><td>" + currentListItem.get_item('Title') + "</td><td>" + currentListItem.get_item('CategoryName') + "</td></tr>";
            }
            table.html(innerHtml);
        }),
        Function.createDelegate(this, fail)
        );

}
//<-----------Ends Here------------------------------>

//<------------Update List Item---------------------->
function findListItem() {

    listItemId = prompt("Enter the Id to be Searched ");
    var ctx = new SP.ClientContext(appWebUrl);
    var appCtxSite = new SP.AppContextSite(ctx, hostWebUrl);

    var web = appCtxSite.get_web();

    var list = web.get_lists().getByTitle("CategoryList");

    ctx.load(list);

    listItemToUpdate = list.getItemById(listItemId);

    ctx.load(listItemToUpdate);

    ctx.executeQueryAsync(
        Function.createDelegate(this, function () {
            //Display the Data into the TextBoxes
            $("#CategoryId").val(listItemToUpdate.get_item('Title'));
            $("#CategoryName").val(listItemToUpdate.get_item('CategoryName'));
        }),
        Function.createDelegate(this, fail)
        );


}
//<-----------Ends Here------------------------------>

//<-----------Function to Update List Item----------->

function updateItem() {
    var ctx = new SP.ClientContext(appWebUrl);
    var appCtxSite = new SP.AppContextSite(ctx, hostWebUrl);

    var web = appCtxSite.get_web();

    var list = web.get_lists().getByTitle("CategoryList");
    ctx.load(list);

    listItemToUpdate = list.getItemById(listItemId);

    ctx.load(listItemToUpdate);

    listItemToUpdate.set_item('CategoryName', $("#CategoryName").val());
    listItemToUpdate.update();

    ctx.executeQueryAsync(
        Function.createDelegate(this, success),
        Function.createDelegate(this, fail)
        );

}
//<-----------Ends Here------------------------------>

//<-----------Function to Update List Item----------->
function deleteListItem() {
    var ctx = new SP.ClientContext(appWebUrl);
    var appCtxSite = new SP.AppContextSite(ctx, hostWebUrl);

    var web = appCtxSite.get_web();

    var list = web.get_lists().getByTitle("CategoryList");
    ctx.load(list);

    listItemToUpdate = list.getItemById(listItemId);

    ctx.load(listItemToUpdate);

    listItemToUpdate.deleteObject();

    ctx.executeQueryAsync(
        Function.createDelegate(this, success),
        Function.createDelegate(this, fail)
        );
}
//<-----------Ends Here------------------------------>

function success() {
    $("#dvMessage").text("Operation Completed Successfully");
}

function fail() {
    $("#dvMessage").text("Operation failed  " + arguments[1].get_message());
}


//Ends Here










// This function prepares, loads, and then executes a SharePoint query to get the current users information
function getUserName() {
    context.load(user);
    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
}

// This function is executed if the above call is successful
// It replaces the contents of the 'message' element with the user name
function onGetUserNameSuccess() {
    $('#message').text('Hello ' + user.get_title());
}

// This function is executed if the above call fails
function onGetUserNameFail(sender, args) {
    alert('Failed to get user name. Error:' + args.get_message());
}

