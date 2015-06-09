# Triply MBaaS Server

# Group Users API

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

