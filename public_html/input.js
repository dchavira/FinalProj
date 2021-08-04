
//Couldn't get the req.cookies to work so here we are
var displayName = '';

//
function createUser() {
    let uname = $('#username').val();
    displayName = $('#username').val();
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
    let uname = $('#username').val();
    displayName = $('#username').val();
	let pword = $('#password').val();
    let user = {username: uname, password: pword};
    let userString=JSON.stringify(user)

    $.ajax({
        url: "/api/auth/login",
        data: {user: userString},
        method: 'POST',
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
        success: function(results) {
            if (results == "logged off successful") {
                    $(window).attr('location', "../public_html/index.html");
            } else { alert("Something went wrong logging off") }
        }
    });
}

//This function returns the username to display in the nav panel
function getUsername() {
    $("#user").html(displayName)
}

//This function allows the user to change their username or password
function editProf() {
	let edits = "<img src='/images/exit.jpg' onclick='exitPost();'>" +
		"<h2>Edit profile:</h2>" +
  		"<label for='uname'>Username:</label>" +
		"<input type='text' id='uname' name='uname'>" +
		"<button onclick='changeData(\"user\")'<br><br>" +
		"<label for='pword'>Password:</label>" +
		"<input type='password' id='pword' name='pword'>" +
		"<button onclick='changeData(\"pass\")'"
	
	$("new-post")..css("padding", "20px")html(edits);
}


/*This function displays the data as a post on the feed view. Such as every user post, the user's
own posts, another user's posts, etc. */
function listPost(feature) {
    let request = pickFeature(feature);

    $.ajax({
        url: request,
        method: 'GET',
        success: function(results) {
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
        success: function(results) {
            alert(results);
        }
    });
}

//This function creates a div with textboxes above the feed for the user to create a post
function newPost() {
    let form = "<img src='/images/exit.jpg' onclick='exitPost();'><h2>New Post</h2> \
                <textarea>Review/opinion</textarea><br><br> \
                <h3>Song:</h3><label for=songTitle>Title:</label> \
                <input type='text' id='songTitle' name='songTitle'><br><br>\
                <label for=songArtist>Artist:</label> \
                <input type='text' id='songArtist' name='songArtist'><br><br>\
                <label for=songAlbum>Album:</label> \
                <input type='text' id='songAlbum' name='songAlbum'><br><br>\
                <button onclick='" + createPost(); + "'>Post</button>"
    
    $("#new-post").css("padding", "20px").html(form)
}

function exitPost() {
    $("#new-post").css("padding", "0px").html('')
}

//
function createPost() {
    
    let body = $('textarea').val();
    let songTitle = $('#songTitle').val();
    let songArtist = $('#songArtist').val();
    let songAlbum = $('#songAlbum').val();

    let post = {text: body, song: {title: songTitle,
        artist: songArtist, album: songAlbum} };
    let postStr = JSON.stringify(post);
    
    $.ajax({
        url: "api/post/add/post",
        data: {post: postStr},
        method: 'POST',
        success: function(results) {
            listPost('feed');
        }
    });
}
