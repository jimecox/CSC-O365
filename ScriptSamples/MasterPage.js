//<!-- Added using WebDAV mode by Marc Charmois --->

    function branding() {
        try {
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            //replace the current paths with yours....
            web.set_masterUrl('/sites/intranet2/_catalogs/masterpage/oslo.master');
            web.set_siteLogoUrl('/sites/intranet2/Style%20Library/images/Contoso-Blue.png');
            web.set_alternateCssUrl('/sites/intranet2/Style%20Library/CSS/Contoso.Intranet3.css');
            web.update();
            context.executeQueryAsync(onQuerySucceeded, onQueryFailed);
        } catch (error) {
            alert(error);
        }
    }

function unBranding() {
    try {
        var context = new SP.ClientContext.get_current();
        var web = context.get_web();
        //replace the following path with yours....
        web.set_masterUrl('/sites/intranet2/_catalogs/masterpage/seattle.master');
        web.set_siteLogoUrl('/_layouts/15/images/siteIcon.png?rev=40');
        web.set_alternateCssUrl('');
        web.update();
        context.executeQueryAsync(onQuerySucceeded, onQueryFailed);
    } catch (error) {
        alert(error);
    }
}

function onQuerySucceeded(sender, args) {
    alert("The branding of your site was succesfully changed");
    window.location = window.location.href;
}

function onQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
}

//<!-- end of the WeDAV customization -->
