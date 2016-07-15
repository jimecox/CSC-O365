// Note Aug 5, this works but not my pattern, may change later
// this page will be used to store my common functions that may be called from multiple pages.

// db variables, need to figure out how to make it global
var DB_NAME = 'tbIndexedDB23';
var DB_VERSION = 1;
var STORE_ADMINPANEL = 'tbAdminPanel';
var STORE_TIMEBARS = 'tbTimebars';
var STORE_RESOURCES = 'tbResources';
var STORE_ALLOCATIONS = 'tbAllocations';
var STORE_TAGS = 'tbTags';
var STORE_METADATA = 'tbMetaData';

  // will allow to always get right key for the config of this release, will be used to allow user multiple env, later
var apKey = 9 // this is the indexdb key, should get by name
var note = document.getElementById('tbNotifications');
$(document).on('click', '#btnChangePixelFactor', function (e) {
    initTimeScaleSlider()
    
});

$(document).on('click', '#btnSaveTS', function (e) {
    var fieldName2 = "apTS_WeeklyPxFactor"
    var newValue2 = Number($('#timescaleSliderInput').val());
    //alert(fieldName2)
    updateOneFieldAP(fieldName2, newValue2)

  //  window.location.reload()
    

});



function initTimeScaleSlider() {
    $("tsSliderDiv").show(100);
   // alert("me")
    $("#tsSlider").slider({
            min: 0,
            max: 40,
            step: 1,
            slide: function (event, ui) {
                
                $(timescaleSliderInput).val(ui.value);
                // now update idb with hours and %
            }
        });

};




// Open Store, common function, please use whenever opening store
function openIDBGetStore(storeName, mode, callback) {

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if (!window.indexedDB) {
        alert("Sorry!Your browser doesn't support IndexedDB");
    }
    var db;
    var request = window.indexedDB.open(DB_NAME, DB_VERSION);
    //Handle error On db open
    request.onerror = function (event) {
        console.log(event.target.errorCode);
    };
    request.onsuccess = function (event) {
        // Handle success On db open, get the db object, then open store
        db = this.result;
        //note.innerHTML += '<li>Database initialised from appcore.js openIDBGetStore</li>';
        var tx = db.transaction(storeName, mode);
        store = tx.objectStore(storeName);
        callback(store)
    };
};

// this works but did not work well integrated into getadminpaneldata - get Admin Panel key, it hosts config setting,  get the apID of "Standard config settings" row with get by index name.
function getCustomerID(callbackCustomerID) {
    //first get db and open store  
    openIDBGetStore(STORE_ADMINPANEL, 'readwrite', function (store) {

        var index = store.index("ap_name");
        var request = index.get("Standard Config Settings");

        request.onerror = function (event) {
            //   Handle errors!
            alert("there was error getting std config settings from AppCore.js")
        };
        request.onsuccess = function (event) {
            var data = request.result;
            //note.innerHTML += '<li>Success config settings ' + data.ap_name + ' From app core for getValidAPID </li>';
            // need try catch here when db does not exist yet.
           
            var apCustomerID = data.apCustomerID

            callbackCustomerID(apCustomerID);
        };
    });
};


// this works but may be redundant, combine with get Admin Panel Data, using store.index instead store.get,  
// get the apID of "Standard config settings" row with get by index name.
function getValidAPID(callbackAPKey) {
    //first get db and open store  
    openIDBGetStore(STORE_ADMINPANEL, 'readwrite', function (store) {
        //note.innerHTML += '<li>Success loading:' + DB_NAME + ' From app core for getValidAPID</li>';
        
        var index = store.index("ap_name");
        var apConfig = "Standard Config Settings"
        var request = index.get(apConfig);

        request.onerror = function (event) {
            //   Handle errors!
            alert("there was error getting store id")
        };
        request.onsuccess = function (event) {
            var data = request.result;
            //note.innerHTML += '<li>Success config settings ' + data.ap_name + ' From app core for getValidAPID </li>';
            // need try catch here when db does not exist yet.
            var apKey = data.id

            callbackAPKey(apKey);
        };
    });
};


// get admin panel row, indicating scales, pixel factor etc for this app
// Call function like this: (to get config data in other functions)
//getAdminPanelData(function (APName, apID, apTS_WeeklyOrMonthly, apTS_Start, apTS_Finish, apTS_WeeklyPxFactor, apTS_MonthlyPxFactor){
//});
function getAdminPanelData(fn) {
// start by getting valid config settings key so we get right timescale and app start date etc
    getValidAPID(function (callbackAPKey) {
        // note the store object comes back with the getvalidapID
        var apKey1 = callbackAPKey
        var request = store.get(apKey1);  // pass in the key path value, the auto invcremented value in field called id in my case, i think??
           request.onerror = function (event) {
               // Handle store open errors!
               alert("there was error getting store data")
           };
           request.onsuccess = function (event) {
               // Handle store open success
               var data = request.result;
               if (!data) {
                   //(alert("not a valid key, click load load all data button to find one")) // commented this out, could not find why errors sometims Jan 7 2015
                   return;
               }
// assign each field in data rusult to local var           
            var APName = data.ap_name;
            var apID = data.apID;
            var apTS_WeeklyOrMonthly = data.apTS_WeeklyOrMonthly;
            var apTS_Start = data.apTS_Start;
            var apTS_Finish = data.apTS_Finish;
            var apTS_WeeklyPxFactor = data.apTS_WeeklyPxFactor;
            var apTS_MonthlyPxFactor = data.apTS_MonthlyPxFactor;
            var apHelpCoordTop = data.apHelpCoordTop;
            var apHelpCoordLeft = data.apHelpCoordLeft;
            var apStatusDate = data.apStatusDate;
            var apCustomerID = data.apCustomerID;
// this line will return the values to the calling function
            fn(APName, apID, apTS_WeeklyOrMonthly, apTS_Start, apTS_Finish, apTS_WeeklyPxFactor, apTS_MonthlyPxFactor, apStatusDate, apCustomerID);
           };

    });  // end getValidAPID
           
    };
// example how to call it   getAdminPanelData(function (APName, apID, apTS_WeeklyOrMonthly, apTS_Start, apTS_Finish, apTS_WeeklyPxFactor, apTS_MonthlyPxFactor) {
// }); //end get admin panel data

// common function to update timescale config info
function updateConfigSettings(tsDaysWeeksOrMonths, tsStartDate) {
// start by getting valid config settings key so we get right timescale and app start date etc
    getValidAPID(function (callbackAPKey) {
        // note the store object comes back with the getvalidapID
        var apKey2 = callbackAPKey

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if (!window.indexedDB) {
        alert("Sorry!Your browser doesn't support IndexedDB");
    }
    var db;
    var request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = function (event) {
        console.log(event.target.errorCode);
    };
    request.onsuccess = function (event) {
    db = this.result; // or could use db = request.result;
// open the store, get item use key we got earlier
    var objectStore = db.transaction([STORE_ADMINPANEL], "readwrite").objectStore(STORE_ADMINPANEL);
    var request = objectStore.get(apKey2);
    request.onerror = function (event) {
        // Handle errors!
        alert("there was error getting store id")
    };
    request.onsuccess = function (event) {
        // Get the old value that we want to update
        var data = request.result;

        // get my left and top values update the value(s) in the object that you want to change
        //alert(data.id)

        data.apTS_WeeklyOrMonthly = tsDaysWeeksOrMonths;
        data.apTS_Start = tsStartDate;
        //data.apTS_Finish = $('#apTS_Finish').val();
        //data.apTS_WeeklyPxFactor = $('#apTS_WeeklyPxFactor').val();
       // data.apTS_MonthlyPxFactor = $('#apTS_MonthlyPxFactor').val();
       // data.apHelpCoordTop = $('#apHelpCoordTop').val();
      //  data.apHelpCoordLeft = $('#apHelpCoordLeft').val();

        // Put this updated object back into the database.
        var requestUpdate = objectStore.put(data);
        requestUpdate.onerror = function (event) {
            // Do something with the error
            alert("there was error updating data")
        };
        requestUpdate.onsuccess = function (event) {
            // Success - the data is updated!
           // alert("it worked and is updated")
        };
    };
};
    });
};


// standard messages to report on the yellow logging area
// how to call error: displayFailureMessage("Some Problem While adding");
// how to call success: displaySucessMessage("Deletion successful");
function displaySucessMessage2(msg) {
    msg = typeof msg != 'undefined' ? "Success: " + msg : "Success";
    $('#msg').html('<span class="action-success">' + msg + '</span>');
}

function displayFailureMessage2(msg) {
    msg = typeof msg != 'undefined' ? "Failure: " + msg : "Failure";
    $('#msg').html('<span class="action-failure">' + msg + '</span>');
}




