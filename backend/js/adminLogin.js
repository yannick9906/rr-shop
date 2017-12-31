var usernameField =  $("#username");
var passwordField =  $("#password");

$(document).ready(function() {
    // Switch: Login form / Dashboard
    $.getJSON("api/user/checkSession.php",null, (json) => {
        if(json.success) startDash();
        else startLogin();
    });

    document.querySelector("#password").addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if(key === 13) {
            doLogin();
        }
    });
});

function startLogin() {
    $("#loginPanel").show();
    $("#success").hide();
    $("#loginFields").show();
}

function doLogin() {
    let username = usernameField.val();
    let password = passwordField.val();
    let passhash = md5(password);

    $("#loginFields").fadeOut(500, function() {
        $("#loading").fadeIn(500);
        $.getJSON("api/user/checkUsername.php?username="+username, null, function(json) {
            if(json["exists"] == 1) {
                $.getJSON("api/user/tryLogin.php?username="+username+"&passhash="+passhash, null, function(json2) {
                    if(json2["success"] == 1) {
                        $("#loading").fadeOut(250, () => {
                            $("#success").fadeIn(250, () => {
                                $("#loginPanel").fadeOut(500, () =>  {
                                    startDash();
                                })
                            })
                        });
                    } else {
                        M.toast({html: "Kennwort falsch", duration: 2000, classes: "red"});
                        passwordField.removeClass("valid");
                        passwordField.addClass("invalid");
                        $("#loading").fadeOut(500, () => {
                            $("#loginFields").fadeIn(500);
                        });
                    }
                })
            } else {
                M.toast({html: "Benutzername falsch", duration: 2000, classes: "red"});
                usernameField.removeClass("valid");
                usernameField.addClass("invalid");
                $("#loading").fadeOut(500, function() {
                    $("#loginFields").fadeIn(500);
                });
            }
        });
    });
}

function doLogout() {
    $.getJSON("api/user/tryLogin.php", {logout: 1}, (json) => {
        if(json.success) {
            location.hash = "";
            M.toast({html: "Logout erfolgreich.", duration: 500});
            $("#mainPanel").hide();
            startLogin();
        } else {
            M.toast({html: "Es ist ein Fehler aufgetreten.", duration:2000, classes: "red"});
        }
    });
}