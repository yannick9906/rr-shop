var usernameField =  $("#username");
var passwordField =  $("#password");

$(document).ready(function() {
    if(0 == 1) {
        Materialize.toast("Kennwort falsch", 2000, "red");
        usernameField.removeClass("valid");
        usernameField.addClass("invalid");
    } else if(0 == 2) {
        Materialize.toast("Benutzername falsch", 2000, "red");
        passwordField.removeClass("valid");
        passwordField.addClass("invalid");
    } else if(0 == 3) {
        Materialize.toast("Logout erfolgreich", 2000, "green");
    } else if(0 == 4) {
        Materialize.toast("Bitte erneut anmelden", 2000, "orange");
    } else {
        passwordField.removeClass("valid");
        passwordField.removeClass("invalid");
        usernameField.removeClass("valid");
        usernameField.removeClass("invalid");
    }

    document.querySelector("#password").addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if(key === 13) {
            doLogin();
        }
    })
});

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
                        $("#loading").fadeOut(250, function() {
                            $("#success").fadeIn(250, function() {
                                $("#bg").fadeOut(250, function() {
                                    alert("Okay");
                                });
                            })
                        });
                    } else {
                        Materialize.toast("Kennwort falsch", 2000, "red");
                        passwordField.removeClass("valid");
                        passwordField.addClass("invalid");
                        $("#loading").fadeOut(500, function() {
                            $("#loginFields").fadeIn(500);
                        });
                    }
                })
            } else {
                Materialize.toast("Benutzername falsch", 2000, "red");
                usernameField.removeClass("valid");
                usernameField.addClass("invalid");
                $("#loading").fadeOut(500, function() {
                    $("#loginFields").fadeIn(500);
                });
            }
        });
    });
}