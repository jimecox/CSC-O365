'use strict';



// 2.	Crear una función generadora de guid

function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

var Contoso = window.Contoso || {};
Contoso.CorporateStructureApp = function () {

    var context = SP.ClientContext.get_current();
    var user = context.get_web().get_currentUser();

    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    $(document).ready(function () {
        getUserName();
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



    // 4.	Definir las siguientes variables publicas
    var context = SP.ClientContext.get_current();
    var hostweb;
    var user = context.get_web().get_currentUser();
    var taxonomySession;
    var termStore;
    var groups;
    var corporateGroup;
    var corporateTermSet;
    var corporateGroupGUID = createGuid();
    var corporateTermSetGUID = createGuid();
    var hrTermGUID = createGuid();
    var salesTermGUID = createGuid();
    var technicalTermGUID = createGuid();
    var engineeringTermGUID = createGuid();
    var softwareTermGUID = createGuid();
    var supportTermGUID = createGuid();

    // 5.	Definir las siguientes variables para la creación de columnas

    var metaDataField;
    var xmlNoteField = '<Field ' +
        'ID="{B758A862-9114-4B89-B73D-DFA806CB5101}" ' +
        'Name="CorporateUnitTaxHTField0" ' +
        'StaticName="CorporateUnitTaxHTField0" ' +
        'DisplayName="Corporate Unit_0" ' +
        'Type="Note" ' +
        'ShowInViewForms="FALSE" ' +
        'Required="FALSE" ' +
        'Hidden="TRUE" ' +
        'CanToggleHidden="TRUE" ' +
        'RowOrdinal="0"></Field>';
    var xmlMetaDataField = '<Field ' +
        'ID="{ce641499-5955-4858-a4b5-9d994fdcea03}" ' +
        'Name="CorporateUnit" ' +
        'StaticName="CorporateUnit" ' +
        'DisplayName="Corporate Unit" ' +
        'Type="TaxonomyFieldType" ' +
        'ShowField="Term1033" ' +
        'EnforceUniqueValues="FALSE" ' +
        'Group="Custom Columns"> ' +
        '    <Customization> ' +
        '        <ArrayOfProperty> ' +
        '            <Property> ' +
        '                <Name>TextField</Name> ' +
        '                <Value xmlns:q6="http://www.w3.org/2001/XMLSchema" ' +
        '                       p4:type="q6:string" ' +
        '                       xmlns:p4="http://www.w3.org/2001/XMLSchema-instance"> ' +
        '                    {B758A862-9114-4B89-B73D-DFA806CB5101} ' +
        '                </Value> ' +
        '            </Property> ' +
        '        </ArrayOfProperty> ' +
        '    </Customization> ' +
        '</Field>';

    // 6.	Definir una función para cargar los términos de búsqueda

    var loadTermStore = function () {
        taxonomySession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);

        // Aqui va el identificador de metadatos
        termStore = taxonomySession.get_termStores().getByName("Taxonomy_4WfNShD8mffdTjcfTyMrTg==");

        context.load(taxonomySession);
        context.load(termStore);
        context.executeQueryAsync(function () {
            $("#status-message").text("Term store loaded.");

            checkGroups();
        }, function (sender, args) {
            $("#status-message").text("Error: Term store could not be loaded.");
        });
    };

    var checkGroups = function () {
        var groups = termStore.get_groups();
        context.load(groups);
        context.executeQueryAsync(function () {
            $("#groups-list").children().remove();
            var groupEnum = groups.getEnumerator();
            while (groupEnum.moveNext()) {
                var currentGroup = groupEnum.get_current();
                var currentGroupID = currentGroup.get_id();
                var groupDiv = document.createElement("div");
                groupDiv.appendChild(document.createTextNode(currentGroup.get_name()));
                $("#groups-list").append(groupDiv);
            }
        }, function (sender, args) {
            $("#status-message").text("Error: Groups could not be loaded");
        });
    };

    // 7.	Definir una función para la creación de los términos de búsqueda y sus grupos

    var createTermSet = function () {
        $("#status-message").text("Creating the group and term set...");
        corporateGroup = termStore.createGroup("Corporate Structure", corporateGroupGUID);
        context.load(corporateGroup);
        corporateTermSet = corporateGroup.createTermSet("Contoso", corporateTermSetGUID, 1033);
        context.load(corporateTermSet);
        context.executeQueryAsync(function () {
            $("#status-message").text("Group and term set created.");
            createTerms();
        }, function (sender, args) {
            $("#status-message").text("Error: Group and term set creation failed.");
        });
    };

    var createTerms = function () {
        $("#status-message").text("Creating terms...");
        var hrTerm = corporateTermSet.createTerm("Human Resources", 1033, hrTermGUID);
        context.load(hrTerm);
        var salesTerm = corporateTermSet.createTerm("Sales", 1033, salesTermGUID);
        context.load(salesTerm);
        var technicalTerm = corporateTermSet.createTerm("Technical", 1033, technicalTermGUID);

        context.load(technicalTerm);
        var engineeringTerm = technicalTerm.createTerm("Engineering", 1033, engineeringTermGUID);
        context.load(engineeringTerm);
        var softwareTerm = technicalTerm.createTerm("Software", 1033, softwareTermGUID);
        context.load(softwareTerm);
        var supportTerm = technicalTerm.createTerm("Support", 1033, supportTermGUID);
        context.load(supportTerm);
        context.executeQueryAsync(function () {
            $("#status-message").text("Terms created.");
            checkGroups();
        }, function (sender, args) {
            $("#status-message").text("Error: Could not create the terms");
        });
    };

    // 8.	Crear una función para crear las columnas

    var createColumns = function () {
        $("#status-message").text("Obtaining the parent web...");
        var hostwebinfo = context.get_web().get_parentWeb();
        context.load(hostwebinfo);

        context.executeQueryAsync(function () {
            hostweb = context.get_site().openWebById(hostwebinfo.get_id());
            context.load(hostweb);
            context.executeQueryAsync(function () {
                $("#status-message").text("Parent web loaded.");
                addColumns();
            }, function (sender, args) {
                $("#status-message").text("Could not load parent web");
            });
        }, function (sender, args) {
        });
    };

    var addColumns = function () {
        $("#status-message").text("Creating site columns...");
        var webFieldCollection = hostweb.get_fields();
        var noteField = webFieldCollection.addFieldAsXml(xmlNoteField, true, SP.AddFieldOptions.defaultValue);
        context.load(noteField);
        metaDataField = webFieldCollection.addFieldAsXml(xmlMetaDataField, true, SP.AddFieldOptions.defaultValue);
        context.load(metaDataField);
        context.executeQueryAsync(function () {
            $("#status-message").text("Columns added.");
            connectFieldToTermset();
        }, function (sender, args) {
            $("#status-message").text("Error: Could not create the columns.");
        });

    };


    var connectFieldToTermset = function () {
        $("#status-message").text("Connecting the columns to the term set");
        var sspID = termStore.get_id();
        var metaDataTaxonomyField = context.castTo(metaDataField, SP.Taxonomy.TaxonomyField);
        context.load(metaDataTaxonomyField);

        context.executeQueryAsync(function () {
            metaDataTaxonomyField.set_sspId(sspID);
            metaDataTaxonomyField.set_termSetId(corporateTermSetGUID);
            metaDataTaxonomyField.update();
            context.executeQueryAsync(function () {
                $("#status-message").text("Connection made. Operations complete.");
            }, function (sender, args) {
                $("#status-message").text("Error: Could not connect the taxonomy field.");
            });

        }, function (sender, args) {
        });

    };

    // 9.	Preparar la función de retorno

    return {
        create_columns: createColumns,
        create_termset: createTermSet,
        get_username: getUserName,
        load_termstore: loadTermStore
    }

}();


// 10.	Cargar los términos al iniciar

$(document).ready(function () {

    Contoso.CorporateStructureApp.load_termstore();
});



