//
function createUser() {
    let uname = $('#username').val();
	let pword = $('#password').val();
	let user = {username: uname, password: pword};
    let userString=JSON.stringify(user)
    
	$.ajax({
		url: '/api/auth/signup',
		data: {user: userString},
		method: 'POST',
		success: function(results) {
            $(window).attr('location', "/pages/main.html");
		},
        error: function(err) {
            alert("Username already exists");
        }
	});
}

// This function takes the user to the main page when they are verified, else an alert
function login() {
    $.ajax({
        url: "/api/auth/login",
        method: 'GET',
        success: function(results) {
            $(window).attr('location', "/pages/main.html");
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

/*This function displays the data as a post on the feed view. Such as every user post, the user's
own posts, another user's posts, etc. */
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
                    let removeButton = "";
                    if (feature == "self") {
                        removeButton = '<li><button onclick="' + removePost(posts[i]._id); + '">Expand</button></li>'
                    }
                    //Have list of items in their own div to display in inner html
                    list += '<div class="posts" id="' + posts[i]._id + '"><ul><li><button onclick="listPost(' + 
                            post[i].username + ');">View Profile</button></li><li><button onclick="expand(' + 
                            posts[i]._id + ');">Expand</button></li>' + removeButton + '</ul><h3>' + 
                            posts[i].username + '</h3><br><br>' + posts[i].text + '</div>'
                }
                $("#feed").html(list);
            }
        }
    });
}

//This function expands the height of the specified post the user clicked on
function expand(id) {
    $("#"+id).css("height", "auto")
}

//This function chooses which url to go to and data to display on the feed view.
function pickFeature(feature) {
    if (feature == "search") {
        let descrip = $("#descript").val();
        let search = $("#search-bar").val();
        return "/find/" + descrip + "/" + search
    } else if (feature == "self") {
        return "/api/post/get/posts"
    } else if (feature == "feed") {
        return "/api/post/get/posts"
    } else {
        return "/api/post/get/posts/" + feature
    }
}

//This function removes the user's posts if they choose to remove it
function removePost(id) {
    $.ajax({
        url: "/api/post/delete",
        data: id,
        method: 'DELETE',
        success: function(results, error) {
            if (error){ alert("Something went wrong deleting the post")
            } else {
                alert(results);
            }
        }
    });
}