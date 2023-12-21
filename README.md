# Installation

```bash
npm i
```

# Enviroment variables

* **PORT** - port for listening
* **DB_STRING** - Postgres connection string // in form of postgres://username:userpass@hostname:port/dbName
* **QR_URL** - base URL for QR-creation service
* **SECRET_HTTP** - secret key for outbound requests // not used yet
* **SECRET_PRIVATE** - secret key for encription // not used yet

.env file should be placed in root directory of the project

# Running developer mode

```bash
npm run dev
```

#seeding db with fixtures

```bash
npm run seed //seeds with fixture users, locks, QRAcess Entries and Notifications. Two notifications (to trigger 1 hr. and 15 min. before QR expiration) are generated for each Access entrie. QR generation service must be available on specified URL for seed to run!
```
---

# Registering guest access 

Method: POST

URL: /qr

Endpoint accepts JSON in the body of a POST request with specific fields and responds with a link to QR-code page. Also generates two notifications (to trigger 1 hr. and 15 min. before QR expiration).

Example request:

```json
{
    "phone": "+77771231235",
    "valid_from": 123456, 
    "valid_to": 123497,
    "locks":["3371ed33-2bd6-48ce-8d11-5823f04130f6", "51e15c7e-baa2-4cc3-9bab-f4094dbb3681"]
}
```

Requested Fields:

* **phone** (string): The phone number for which the QR code is generated.
* **locks** (array of strings): An array of strings representing UMANU controllers identificators.
* **valid_from** (integer): The starting time of QR code, valid in Unix timestamp format (milliseconds). Minimum starting datetime is not earlier than current moment - 60 seconds
* **valid_to** (integer): The expiration time of QR code, valid in Unix timestamp format (milliseconds). Minimum expiration time is not earlier than starting time + 1 hr.

Example Response on Success:

```json
{
    "success": true,
    "link": "http://192.168.76.71:3000/ae3fd5ac-c1c4-4efc-a990-31605c801c72"
}
```

Example Response on Failure:

```json
{
    "success": false,
    "error": "string"
}
```


* **success** (boolean): Indicates the success of the operation. 
* **link** (string): The link to the web page containing the generated QR code. Users can use this link to get the QR code.
* **error** (string): error string contains details on the request failure





# Registering new user


Method: POST

URL: /users

Endpoint accepts JSON in the body of a POST request with specific fields and responds with information on operation success.

Example request:

```json
{
    "username":"testUser",
    "pass":"testPass",
    "role": "admin",  // or 'user'
    "canCreateQR":true
}
```

Requested Fields:

* **username** (string): a login name of a user.
* **pass** (string): user's password.
* **role** ('user' | 'umanuAdmin' | 'buildingAdmin' | 'organizationAdmin' |'tenantAdmin'): sets level of user privileges
* **canCreateQR** (integer): denotes if user is allowed to create guest access entries (not used, as for now)
* **tenantId?** (string):  must be provided if user role is tenantAdmin
* **buildingId?** (string): must be provided if user role is buildingAdmin,
* **organizationId?** (string): must be provided if user role is organizationAdmin
* **locks** (string[]): must be provided if user role is user // list of locks uuids allowed for the user

**!IMPORTANT**: Do not provide data to the optional fields that are not required for the role, the server will reject such requests

Example Response on Success:

```json
{
    "success": true,
}
```

Example Response on Failure:

```json
{
    "success": false,
    "error": "string"
}
```


# Get locks

Method: get

URL: /locks

Endpoint allows you to retrieve the list of locks. JWT should be provided in Bearer token for the request.
Default request will return a full list of locks available to the user.
Additional query parameters are supported to narrow the list of locks in response

Example Response on Success:

```json
{
  "success": true,
  "payload": [
    "3371ed33-2bd6-48ce-8d11-5823f04130f6",
    "51e15c7e-baa2-4cc3-9bab-f4094dbb3681"
    //...
  ]
}
```

Response on Failure:

```json
{
  "success": false,
  "error": "Details on the request failure"
}
```

Query Parameters (you can combine multiple query-parameters):
* **?buildingId=**  Filters locks by a building 
* **?organizationId=** Filters locks by an organization
* **?locks=** list of locks identifiers 

**!IMPORTANT**: If user has no access to the entity specified in query parameters a request will be rejected with an error

# Registering new user


Method: POST

URL: /users

Endpoint accepts JSON in the body of a POST request with specific fields and responds with information on operation success.

Example request:

```json
{
    "username":"testUser",
    "pass":"testPass",
    "role": "admin",  // or 'user'
    "canCreateQR":true
}
```

# Websocket 

Server provides websocket connection (with socket.io) to transmit notifications and service messages. 

To establish a connection client should provide a valid user UUID in
handshake.auth.user field or in handshake.headers.user
If no UUID or invalid UUID is provided, server will respond with an event 'message', containing payload of string "Unauthrized socket connection".

On connection server responds with event 'notifications', containing payload which is an array of notifications. 

Example of payload

```json
[
    {
        "type": "expiring",
        "triggeredAt": "1700747878023",
        "message": "Access UUID aa3f0263-a2c6-4f27-9fa4-89a90ba8fff1 for guest with phone number +77077629949 expires in 60 minutes"
    },
    {
        "type": "expiring",
        "triggeredAt": "1700750578023",
        "message": "Access UUID aa3f0263-a2c6-4f27-9fa4-89a90ba8fff1 for guest with phone number +77077629949 expires in 15 minutes"
    },
]
```
