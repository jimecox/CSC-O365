var web;

function GetWebTitle() {
    var ctx = new SP.ClientContext.get_current();
    web = ctx.get_web();

    ctx.load(web, 'Title');
    ctx.executeQueryAsync(onSuccess, onFailure);
}

function onSuccess() {
    alert(web.get_title());
}

function onFailure() {
    alert('Failure!');
}




