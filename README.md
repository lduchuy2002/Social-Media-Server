Social media Resful API

###

POST http://localhost:8080/user/login
--request
Body {
account,
password
}
--response {
account, email, name, avatar, posts [], likes [],
access-token
}

#####

POST http://localhost:8080/user/logout
--request
Headers{
    Authorization: access-token
}

#####

POST http://localhost:8080/user/register
--request
Body{
account, email, name, password, avatar:file
}
--response {
message: "Register successfully"
}

######

POST http://localhost:8080/post/create
--request
Headers{
    Authorization: access-token
}
Body {
    access-token, content, images
}


--response {
    postedBy, content, images, likes, comment, createAt
}

#####

POST http://localhost:8080/post/delete/"postId"
--request 

Headers {
Authorization: access-token
}
--response {
    message
}
