//listen for auth status changes
auth.onAuthStateChanged(function (user) {
    if (user) {
        console.log("User logged in: ", user)
        console.log("UID: ", user.uid)

    } else {
        console.log("User logged out");
    };
});


var signupForm = $("#signup-form");
signupForm.on("submit", function (event) {
    event.preventDefault();
    //1. get user input
    var password = $("#signup-password")
        .val()
        .trim();
    var email = $("#signup-email")
        .val()
        .trim();

    //2. sign up user
    auth.createUserWithEmailAndPassword(email, password).then(function (cred) {
        console.log("This is the cred: ", cred.user.uid);
        var modal = $("#modal-signup");
        M.Modal.getInstance(modal).close();
        signupForm[0].reset();
        $.ajax({
            url: "/api/account",
            method: "POST",
            data: {
                password: password,
                email: email,
                uid: cred.user.uid
            }
        }).then(function (data) {
            console.log(data)
            window.location = "/account" + "/" + data.id;
        });
    });
});

//logout
var logout = $("#logout");
logout.on("click", function (event) {
    event.preventDefault();
    auth.signOut().then(function () {
    });
});

//login
var loginForm = $("#login-form");
loginForm.on("submit", function (event) {
    event.preventDefault();
    //get user info
    var password = $("#login-password")
        .val()
        .trim();
    var email = $("#login-email")
        .val()
        .trim();
    auth.signInWithEmailAndPassword(email, password).then(function (cred) {
        //close the login modal and reset the form
        const modal = $("#modal-login");
        M.Modal.getInstance(modal).close();
        loginForm[0].reset();
        //make a get request to the account api to compare the uid and id to send the user back to the account page on their id
        $.ajax({
            url: "/api/account",
            method: "GET"
        }).then(function (data) {
            console.log(data);
            for (i = 0; i < data.length; i++) {
                for (key in data[i]) {
                    if (data[i][key] === cred.user.uid) {
                        window.location = "/account" + "/" + data[i].id;
                    } else {
                        console.log("Looks like you're new! Sign up!")
                    }
                };
            };
        });
    });
});