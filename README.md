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

POST http://localhost:8080/user/register
--request
Body{
account, email, name, password, avatar:file
}
--response {
message: "Register successfully"
}

######

GET http://localhost:8080/user/login
Headers {
Authorization: access-token
}
params: account
--response {
account, email, name, avatar, posts [], likes [],
}

#####

POST http://localhost:8080/post/create
Headers {
Authorization: access-token
}
--request {

}
