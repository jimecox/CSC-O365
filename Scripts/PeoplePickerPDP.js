
//Set the following to be an array of fields you would like to change into a people-picker
var targetFields = ['Project Sponsor'];
//var targetFields = ['Field 1', 'Field 2'];

//safely load JQuery
if (typeof jQuery == 'undefined') {
    var s = document.createElement("script");
    s.src = '//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js';
    if (s.addEventListener) {
        s.addEventListener("load", function () { myJQueryCode() }, false);
    } else if (s.readyState) {
        s.onreadystatechange = function () { myJQueryCode() };
    }
    document.getElementsByTagName('head')[0].appendChild(s);
} else {
    myJQueryCode();
}

function myJQueryCode() {
    $(document).ready(function () {
        var scriptRoot = _spPageContextInfo.siteAbsoluteUrl + '/_layouts/15/';

        $.when(
                $.getScript(scriptRoot + "clienttemplates.js"),
                $.getScript(scriptRoot + "clientforms.js"),
                $.getScript(scriptRoot + "clientpeoplepicker.js"),
                $.getScript(scriptRoot + "autofill.js")
            )
            .done(function () {
                window.console && console.log('Scripts loaded');
                renderPeoplePickers();
            })
            .fail(function (message) {
                window.console && console.error('Loading scripts failed: ' + message);
            });
    });
}

function renderPeoplePickers() {
    for (fieldIndex = 0; fieldIndex < targetFields.length; fieldIndex++) {
        $("input[type='text'][title='" + targetFields[fieldIndex] + "']").each(function () {
            this.style.color = "green";
            renderPeoplePicker(this);
            window.console && console.log('PeoplePicker rendered: ' + targetFields[fieldIndex]);
        });
    }
}

function renderPeoplePicker(targetInput) {
    var divPeoplePicker = document.createElement('div');
    var idPeoplePicker = targetInput.id + '_PeoplePicker';
    var targetValue = $(targetInput).attr('value');

    divPeoplePicker.id = idPeoplePicker;
    $(targetInput).parent().append(divPeoplePicker);

    initializePeoplePicker(idPeoplePicker);
    var newPeoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict[idPeoplePicker + '_TopSpan'];
    $(targetInput).hide();

    if (typeof targetValue !== "undefined") {
        newPeoplePicker.AddUnresolvedUser({
            Key: targetValue,
            DisplayText: targetValue
        }, true);
    }

    newPeoplePicker.OnControlResolvedUserChanged = function () {
        if (this.TotalUserCount > 0) {
            //we have a resolved user
            var resolvedUser = this.GetAllUserInfo()[0];

            //Set the underlying field value
            $('input#' + (this.TopLevelElementId.split("_PeoplePicker_TopSpan")[0])).attr('value', resolvedUser.DisplayText);

            //If value has changed then mark the PDP dirty to enable save
            //Thankyou to Martin Laukkanen (nearbaseline.com) for this fix!
            if ($('input#' + (this.TopLevelElementId.split("_PeoplePicker_TopSpan")[0])).attr('origvalue') !== $('input#' + (this.TopLevelElementId.split("_PeoplePicker_TopSpan")[0])).attr('value')) {
                WPDPParts[0].IsDirty = true;
            }
        } else {
            //we have nothing - so clear out the target field
            $('input#' + (this.TopLevelElementId.split("_PeoplePicker_TopSpan")[0])).attr('value', '');
        }
    }

}

// Render and initialize the client-side People Picker.
function initializePeoplePicker(peoplePickerElementId, defaultValue) {

    var users;
    if ((defaultValue != undefined) && (defaultValue != "")) {
        users = new Array(1);
        var defaultUser = new Object();
        defaultUser.AutoFillDisplayText = defaultValue;
        defaultUser.AutoFillKey = defaultValue;
        //defaultUser.Description = user.get_email();
        defaultUser.DisplayText = defaultValue;
        defaultUser.EntityType = "User";
        defaultUser.IsResolved = false;
        defaultUser.Key = defaultValue;
        defaultUser.Resolved = false;
        users[0] = defaultUser;
    } else {
        users = null;
    }

    // Create a schema to store picker properties, and set the properties.
    var schema = {};
    schema['PrincipalAccountType'] = 'User';
    //schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
    schema['SearchPrincipalSource'] = 15;
    schema['ResolvePrincipalSource'] = 15;
    schema['AllowMultipleValues'] = false;
    schema['MaximumEntitySuggestions'] = 50;
    schema['Width'] = '360px';

    // Render and initialize the picker. 
    // Pass the ID of the DOM element that contains the picker, an array of initial
    // PickerEntity objects to set the picker value, and a schema that defines
    // picker properties.
    this.SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, users, schema);
}

