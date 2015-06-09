# Triply Cloud App

# Triply API

# Add Trip [/trips]

Add Trip

## add trip [POST]

 Add Trip

+ Request (application/json)
    + Body
            {
              "from": "city",
              "to": "city",
              "date": "yyyy-MM-dd",
              "userId": "user id",
              "userName": "user name"
            }

+ Response 200 (application/json)
    + Body
            {
              "result": "success"
            }

## list trips [GET]

+ Request (application/json)

+ Response 200 (application/json)


# Register User [/users/register]

Register user

## register [POST] 

 Register user

+ Request (application/json)
    + Body
            {
              "name": "user name",
              "mobile": "user mobile"
            }

+ Response 200 (application/json)
    + Body
            {
              "result": "success",
              "user": {
                "name": "user name",
                "mobile": "user mobile",
                "code": "verification code",
                "verified": false,
                "id": "user id"
              }
            }

# Verify User [/users/verify]

Verify user

## verify [POST] 

 Verify user 

+ Request (application/json)
    + Body
            {
              "id": "user id",
              "code": "verification code"
            }

+ Response 200 (application/json)
    + Body
            {
              "result": "success"
            }

