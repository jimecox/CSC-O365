"use strict"

var provisioning = namespace('Grant.JSOM.Provision');

provisioning.Manager = function (hostWebUrl, appWebUrl) {
    function getContext() {
        return new SP.ClientContext(appWebUrl);
    }
    function getAppContextSite(ctx) {
        var fct = new SP.ProxyWebRequestExecutorFactory(appWebUrl);
        ctx.set_webRequestExecutorFactory(fct);
        return new SP.AppContextSite(ctx, hostWebUrl);
    }
    function constructLCI(listTitle, listTemplateType) {
        var lci = new SP.ListCreationInformation();
        lci.set_title(listTitle);
        lci.set_templateType(listTemplateType);
        return lci;
    }
    function constructCustomLCI(listTitle) {
        var lci = constructLCI(listTitle, SP.ListTemplateType.genericList);
        return lci;
    }
    function constructCTCI(id, name, group, description) {
        var ctci = new SP.ContentTypeCreationInformation();
        ctci.set_description(description);
        ctci.set_group(group);
        ctci.set_id(id);
        ctci.set_name(name);
        return ctci;
    }
    function constructFLCI(targetField) {
        var flci = new SP.FieldLinkCreationInformation();
        flci.set_field(targetField);
        return flci;
    }
    function constructLCI(listName) {
        var lci = new SP.ListCreationInformation();
        lci.set_title(listName);
        lci.set_templateType(SP.ListTemplateType.genericList);
        return lci;
    }
    var publicMembers = {
        createSiteColumn: function (xmlFieldSchema) {
            var dfd = $.Deferred();

            var ctx = getContext();
            var appctx = getAppContextSite(ctx);

            var targetWeb = appctx.get_site().get_rootWeb();
            var fields = targetWeb.get_fields()
            fields.addFieldAsXml(xmlFieldSchema, false, SP.AddFieldOptions.addFieldCheckDisplayName);

            ctx.executeQueryAsync(function () {
                dfd.resolve();
            }, function (sender, args) {
                console.log("Site column creation failure: " + args.get_message());
                dfd.reject();
            });
            return dfd.promise();
        },
        createSiteColumnTextFieldXml: function (name, displayName, description, required, group) {
            var fieldSchema = '<Field Type="Text" Name="' + name + '" DisplayName="' +
                displayName + '" Description="' + description + '" Required="' + required + '" Group="' + group +
                '" SourceID="http://schemas.microsoft.com/sharepoint/v3" />';
            return fieldSchema
        },
        createSiteColumnNumberFieldXml: function (name, displayName, description, max, min, decimals, required, group) {
            var fieldSchema = "";
            if ((max != null) || (min != null) || (decimals != null)) {
                fieldSchema += '<Field Type="Number" Name="' + name + '" DisplayName="' +
                    displayName + '" Description="' + description + '" Max="' + max + '" Min="' + min + '" Decimals="' + decimals + '" Required="' +
                    required + '" Group="' + group + '" SourceID="http://schemas.microsoft.com/sharepoint/v3" />';
            }
            else {
                fieldSchema += '<Field Type="Number" Name="' + name + '" DisplayName="' +
                    displayName + '" Description="' + description + '" Required="' +
                    required + '" Group="' + group + '" SourceID="http://schemas.microsoft.com/sharepoint/v3" />';
            }
            return fieldSchema;
        },
        createSiteColumnUrlFieldXml: function (name, displayName, description, required, group) {
            var fieldSchema = '<Field Type="URL" Format="Hyperlink" Name="' + name + '" DisplayName="' +
                displayName + '" Description="' + description + '" Required="' + required + '" Group="' + group +
                '" SourceID="http://schemas.microsoft.com/sharepoint/v3" />';
            return fieldSchema;
        },
        createSiteColumnImageFieldXml: function (name, displayName, description, required, group) {
            var fieldSchema = '<Field Type="URL" Format="Image" Name="' + name + '" DisplayName="' +
                displayName + '" Description="' + description + '" Required="' + required + '" Group="' + group +
                '" SourceID="http://schemas.microsoft.com/sharepoint/v3" />';
            return fieldSchema;
        },
        createSiteColumnDropDownFieldXml: function (name, displayName, description, choices, required, group) {
            var fieldSchema = '<Field Type="Choice" Format="Dropdown" Name="' + name + '" DisplayName="' +
                displayName + '" Description="' + description + '" Required="' + required + '" Group="' + group +
                '" SourceID="http://schemas.microsoft.com/sharepoint/v3" ><CHOICES>';
            for (var i = 0; i < choices.length; i++) {
                fieldSchema += "<CHOICE>" + choices[i] + "</CHOICE>";
            }
            fieldSchema += "</CHOICES></Field>";
            return fieldSchema;
        },
        deleteSiteColumn: function (siteColumnDisplayName) {
            var dfd = $.Deferred();

            var ctx = getContext();
            var appctx = getAppContextSite(ctx);

            var targetWeb = appctx.get_site().get_rootWeb();
            var fields = targetWeb.get_fields()
            var field = fields.getByTitle(siteColumnDisplayName);
            field.deleteObject();

            ctx.executeQueryAsync(function () {
                console.log("Deleted site column: " + siteColumnDisplayName);
                dfd.resolve();
            }, function (sender, args) {
                console.log("Site column deletion failure: " + siteColumnDisplayName + " - " + args.get_message());
                dfd.reject();
            });
            return dfd.promise();
        },
        //Create content type
        createSiteContentType: function (contentTypeId, contentTypeName, contentTypeGroup, contentTypeDescription, siteColumnNames) {
            var dfd = $.Deferred();

            var ctx = getContext();
            var appctx = getAppContextSite(ctx);

            var targetWeb = appctx.get_site().get_rootWeb();
            if (siteColumnNames.length > 0) {
                var fields = targetWeb.get_fields()
                var field = new Array();
                var fieldLinks = new Array();
                ctx.load(fields);
                for (var i = 0; i < siteColumnNames.length; i++) {
                    field[i] = fields.getByInternalNameOrTitle(siteColumnNames[i]);
                    ctx.load(field[i]);
                    fieldLinks.push(field[i]);
                }
            }
            var ctci = constructCTCI(contentTypeId, contentTypeName)
            var newType = targetWeb.get_contentTypes().add(ctci);
            ctx.load(newType);

            ctx.executeQueryAsync(succeed, fail);
            function succeed(sender, args) {
                var fieldRefs = newType.get_fieldLinks();
                ctx.load(fieldRefs);
                ctx.executeQueryAsync(
                    function () {
                        console.log("Created site content type: ", contentTypeName);
                        if (siteColumnNames.length > 0) {
                            for (var i = 0; i < fieldLinks.length; i++) {
                                var flci = constructFLCI(fieldLinks[i]);
                                newType.get_fieldLinks().add(flci);
                            }
                            newType.update();

                            ctx.executeQueryAsync(function () {
                                if (siteColumnNames.length > 0) {
                                    for (var i = 0; i < siteColumnNames.length; i++) {
                                        console.log("Added site column to " + contentTypeName + " content type: " + siteColumnNames[i]);
                                    }
                                }
                                dfd.resolve();
                            },
                                function (sender, args) {
                                    console.log("Content type creation failure: " + args.get_message());
                                    dfd.reject();
                                });
                        }
                        console.log("Completed creating site content type:" + contentTypeName);
                    },
                    function (sender, args) {
                        console.log("Content type creation failure: " + args.get_message());
                        dfd.reject();
                    });
            }
            function fail(sender, args) {
                console.log("Content type creation failure: " + args.get_message());
                dfd.reject();
            }
            return dfd.promise();
        },
        //Delete content type
        deleteSiteContentType: function (contentTypeId) {
            var dfd = $.Deferred();

            var ctx = getContext();
            var appctx = getAppContextSite(ctx);

            var targetWeb = appctx.get_site().get_rootWeb();
            var webTypes = targetWeb.get_contentTypes();
            var targetType = webTypes.getById(contentTypeId)
            targetType.deleteObject();
            ctx.executeQueryAsync(succeed, fail);
            function succeed() {
                console.log("Deleted content type: " + contentTypeId);
                dfd.resolve();
            }
            function fail(sender, args) {
                console.log("Content type deletion failure: " + args.get_message());
                dfd.reject();
            }
            return dfd.promise();
        },
        createCustomList: function (listName, contentTypeId) {
            var dfd = $.Deferred();

            var ctx = getContext();
            var appctx = getAppContextSite(ctx);

            var targetType = appctx.get_site().get_rootWeb().get_contentTypes().getById(contentTypeId);
            var thisWeb = appctx.get_web();
            ctx.load(thisWeb);
            ctx.load(targetType);
            ctx.executeQueryAsync(
                function () {
                    var targetWeb = appctx.get_site().get_rootWeb();
                    var lci = constructLCI(listName);
                    var newList = targetWeb.get_lists().add(lci);
                    newList.set_contentTypesEnabled(true);
                    var listTypes = newList.get_contentTypes();
                    ctx.load(newList);
                    ctx.load(listTypes);

                    ctx.executeQueryAsync(
                        function () {
                            listTypes.addExistingContentType(targetType);
                            newList.update();
                            ctx.executeQueryAsync(function () { dfd.resolve() }, function (sender, args) {
                                console.log("Generic list creation failure: " + args.get_message());
                                dfd.reject()
                            });
                        },
                        function (sender, args) {
                            console.log("Generic list creation failure: " + args.get_message());
                            dfd.reject();
                        });
                },
                function (sender, args) {
                    console.log("Document library creation failure: " + args.get_message());
                    dfd.reject();
                });
            return dfd.promise();
        },
        deleteCustomList: function (listName) {
            var dfd = $.Deferred();

            var ctx = getContext();
            var appctx = getAppContextSite(ctx);

            var thisWeb = appctx.get_web();
            ctx.load(thisWeb);
            ctx.executeQueryAsync(
                function () {
                    var targetWeb = appctx.get_site().get_rootWeb();
                    var targetList = targetWeb.get_lists().getByTitle(listName);
                    targetList.deleteObject();

                    ctx.executeQueryAsync(function () { dfd.resolve(); }, function (sender, args) {
                        console.log("List deletion failure: " + args.get_message());
                        dfd.reject();
                    });
                },
                function (sender, args) {
                    console.log("List deletion failure: " + args.get_message());
                    dfd.reject();
                });
            return dfd.promise();
        }
        //Create list
        //Delete list
    };
    return publicMembers;
}




/// store

"use strict"

var store = namespace('Grant.JSOM.Store');

store.SiteColumns = function () {
    this.groupName = "Grant JSOM Site Columns";
    this.SimpleTextColumn = {
        Name: "JSOMTextField",
        DisplayName: "JSOM Text Field",
        Description: "This field was created using JSOM",
        Required: "TRUE"
    };
    this.NumberColumn = {
        Name: "JSOMNumberField",
        DisplayName: "JSOM Number Field",
        Description: "This field was created using JSOM",
        Required: "TRUE",
        Max: "100",
        Min: "1",
        Decimals: "0"
    };
    this.UrlColumn = {
        Name: "JSOMHyperlinkField",
        DisplayName: "JSOM Hyperlink Field",
        Description: "This field was created using JSOM",
        Required: "TRUE"
    };
    this.ImageColumn = {
        Name: "JSOMImageField",
        DisplayName: "JSOM Image Field",
        Description: "This field was created using JSOM",
        Required: "TRUE"
    };
    this.DropDownColumn = {
        Name: "JSOMDropDownField",
        DisplayName: "JSOM DropDown Field",
        Description: "This field was created using JSOM",
        Required: "TRUE",
        Choices: ["Choice 1", "Choice 2", "Choice 3"]
    };
}

store.SiteContentTypes = function () {
    var siteColumns = new Grant.JSOM.Store.SiteColumns;
    this.groupName = "",
    this.contentType = {
        Id: "0x010099E2E507846A44859E0945E4E30DCE4E",
        Name: "Grant Content Type",
        Description: "Grant's first content type from JSOM",
        Columns: [siteColumns.DropDownColumn.Name, siteColumns.ImageColumn.Name]
    }
}




// app

'use strict';

var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();

var hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
var appWebUrl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    getUserName();

    var provisionManager = new Grant.JSOM.Provision.Manager(hostWebUrl, appWebUrl);
    var siteColumns = new Grant.JSOM.Store.SiteColumns();
    var siteContentTypes = new Grant.JSOM.Store.SiteContentTypes();

    $('#btnProvision').click(function () {
        provisionManager.createSiteColumn(provisionManager.createSiteColumnTextFieldXml(siteColumns.SimpleTextColumn.Name,
            siteColumns.SimpleTextColumn.DisplayName, siteColumns.SimpleTextColumn.Description,
            siteColumns.SimpleTextColumn.Required, siteColumns.groupName)).then(function () {
                console.log("Created site column: " + siteColumns.SimpleTextColumn.DisplayName);
                provisionManager.createSiteColumn(provisionManager.createSiteColumnNumberFieldXml(siteColumns.NumberColumn.Name,
                    siteColumns.NumberColumn.DisplayName, siteColumns.NumberColumn.Description, siteColumns.NumberColumn.Max,
                    siteColumns.NumberColumn.Min, siteColumns.NumberColumn.Decimals,
                    siteColumns.NumberColumn.Required, siteColumns.groupName)).then(function () {
                        console.log("Created site column: " + siteColumns.NumberColumn.DisplayName);
                        provisionManager.createSiteColumn(provisionManager.createSiteColumnUrlFieldXml(siteColumns.UrlColumn.Name,
                            siteColumns.UrlColumn.DisplayName, siteColumns.UrlColumn.Description,
                            siteColumns.UrlColumn.Required, siteColumns.groupName)).then(function () {
                                console.log("Created site column: " + siteColumns.UrlColumn.DisplayName);
                                provisionManager.createSiteColumn(provisionManager.createSiteColumnImageFieldXml(siteColumns.ImageColumn.Name,
                                    siteColumns.ImageColumn.DisplayName, siteColumns.ImageColumn.Description,
                                    siteColumns.ImageColumn.Required, siteColumns.groupName)).then(function () {
                                        console.log("Created site column: " + siteColumns.ImageColumn.DisplayName);
                                        provisionManager.createSiteColumn(provisionManager.createSiteColumnDropDownFieldXml(siteColumns.DropDownColumn.Name,
                                            siteColumns.DropDownColumn.DisplayName, siteColumns.DropDownColumn.Description, siteColumns.DropDownColumn.Choices,
                                            siteColumns.DropDownColumn.Required, siteColumns.groupName)).then(function () {
                                                console.log("Created site column: " + siteColumns.DropDownColumn.DisplayName);
                                                provisionManager.createSiteContentType(siteContentTypes.contentType.Id,
                                                    siteContentTypes.contentType.Name, siteContentTypes.groupName,
                                                    siteContentTypes.contentType.Description, siteContentTypes.contentType.Columns).then(function () {
                                                        console.log("Created content type: " + siteContentTypes.contentType.Name);
                                                        provisionManager.createCustomList("JSOM Custom List", siteContentTypes.contentType.Id).then(function () {
                                                            console.log("Created custom list");
                                                        });
                                                    });
                                            });
                                    });
                            });
                    });
            });
    });

    $('#btnUnprovision').click(function () {
        provisionManager.deleteCustomList("JSOM Custom List").then(function () {
            console.log("Deleted custom list");
            provisionManager.deleteSiteContentType(siteContentTypes.contentType.Id).then(function () {
                provisionManager.deleteSiteColumn(siteColumns.SimpleTextColumn.DisplayName).then(function () {
                    console.info("site column deleted: " + siteColumns.SimpleTextColumn.DisplayName);
                    provisionManager.deleteSiteColumn(siteColumns.NumberColumn.DisplayName).then(function () {
                        console.info("site column deleted: " + siteColumns.NumberColumn.DisplayName);
                        provisionManager.deleteSiteColumn(siteColumns.UrlColumn.DisplayName).then(function () {
                            console.info("site column deleted: " + siteColumns.UrlColumn.DisplayName);
                            provisionManager.deleteSiteColumn(siteColumns.ImageColumn.DisplayName).then(function () {
                                console.info("site column deleted: " + siteColumns.ImageColumn.DisplayName);
                                provisionManager.deleteSiteColumn(siteColumns.DropDownColumn.DisplayName).then(function () {
                                    console.info("site column deleted: " + siteColumns.DropDownColumn.DisplayName);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

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

// Function to retrieve a query string value.  
function getQueryStringParameter(paramToRetrieve) {
    var params = document.URL.split("?")[1].split("&");
    var strParams = "";

    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
}

