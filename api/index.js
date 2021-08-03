const express = require("express");
const apiRouter = express.Router();
const authRouter = require("./routes/auth");
const songRouter = require("./routes/song");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
apiRouter.use("/auth", authRouter);
apiRouter.use("/song", songRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/post", postRouter);
module.exports = apiRouter;

// This function takes the user to the main page when they are verified, else an alert
function login() {
    $.ajax({
        url: "/api/auth/login",
        method: 'POST',
        success: function(results, error) {
            if (error){ alert("Something went wrong")
            } else {
                if (results == "Password was correct!") {
                    $(window).attr('location', "../public_html/pages/main.html");
                } else { alert(results)}
            }
        }
    })
}

//This function logs off the user and takes them back to the login page
function logout() {
    $.ajax({
        url: "/api/auth/logoff",
        method: 'POST',
        success: function(results, error) {
            if (error){ alert("Something went wrong")
            } else {
                if (results == "logged off successful") {
                    $(window).attr('location', "../public_html/index.html");
                } else { alert("Something went wrong logging off")}
            }
        }
    });
}

//This function returns the username to display in the nav panel
function getUsername() {
    let cookie = Cookies.get("username").split("=")
    let uname = cookie[1]
    $("#username").val() = uname
}

function listPost(feature) {
    let request = pickFeature(feature);

    $.ajax({
        url: request,
        method: 'GET',
        success: function(results, error) {
            if (error) {}
            else{
                let posts = JSON.parse(results);
                let list = '';
                for (var i in posts) {
                    
                    //Have list of items in their own div to display in inner html
                    list += '<div class="posts" id="' + posts[i] + '"><h3>' + posts[i].username + 
                            '</h3><br><br>' + posts[i].text + '<button onclick="listPost(' + post[i].username +
                            ');">View Profile</button><button onclick="expand(' + posts[i] + ');">Expand</button>
                            '</div>';
                }
                $("#feed").html(list);
            }
        }
    });
}

function expand(id) {
    $("#id").css("height", "auto")
}

function pickFeature(feature) {
    if (feature == "search") {
        let descrip = $("#descript").val();
        let search = $("#search-bar").val();
        return "/find/" + descrip + "/" + search
    } else if (feature = "self") {
        return "/api/post/get/posts"
    } else {
        return "/api/post/get/posts/username"
    }
}