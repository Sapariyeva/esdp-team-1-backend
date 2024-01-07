# Installation

```bash
npm i
```

# Enviroment variables

* **PORT** - port for listening
* **DB_STRING** - Postgres connection string // in form of postgres://username:userpass@hostname:port/dbName
* **QR_URL** - base URL for QR-creation service
* **SECRET_HTTP** - secret key for outbound requests // not used yet
* **SECRET_PRIVATE** - secret key for JWT encryption
* **ACCESS_TOKEN_TTL** - access token time-to-live in seconds
* **REFRESH_TOKEN_TTL** - refresh token time-to-live in seconds

.env file should be placed in root directory of the project

# Running developer mode

```bash
npm run dev
```

#seeding db with fixtures

```bash
npm run seed
```
seeds database with fixture users, locks, QRAcess Entries, Notifications, Organizations, Buildings and Tenants. Two notifications (to trigger 30 min hr. and 10 min. before QR expiration) are generated for each Access entrie. \
<code style="color : lightskyblue">**!NOTE**</code>  QR generation service must be available on specified URL for seed to run!

---

# Endpoints

<details>
  <summary><strong>Method: POST, URL: /qr</strong> <i> &nbsp&nbsp Registering guest access</i></summary> 
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
</details>


<details>
  <summary><strong>Method: GET, URL: /qr  </strong> <i> &nbsp&nbsp !NOT IMPLEMENTED YET</i></summary> 
    Endpoint returns list of guest Qr access entries
</details>

<details>
  <summary><strong>Method: POST, URL: /auth/register </strong> <i> &nbsp&nbsp Registering new user</i></summary> 
    Endpoint accepts JSON in the body of a POST request with specific fields and responds with information on operation success.

Example request:

```json
{
    "phone": +770712312389,  
    "username": "testUser",
    "pass": "testPass",
    "role": "tenantAdmin",
    "canCreateQR": true,
    "buildingId": undefined,   
    "organizationId":undefined,
    "tenantId":"0999e7fe-8c08-4f24-b324-689a04d46915",
    "locks":undefined
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

<code style="color : red">**!IMPORTANT**</code>: Do not provide data to the optional fields that are not required for the role, the server will reject such requests

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
</details>

<details>
  <summary><strong>Method: POST, URL: /auth/signin  </strong> <i> &nbsp&nbsp Sign in with credentials</i></summary> 
Endpoint allows user to sign in. Returns user data, access token and refresh token in case of  successful authorization.
Example request:

```json
{
    "phone": +77078164958,  
    "pass": "testPass",
}
```
Example response in case of successful authorization:
```json
{
    "success": true,
    "id": "34d97fe7-f4ce-4d44-9680-af465e814e50",
     "phone": "+77078164958",
     "username": "Shawna_Berge",
     "role": "user",
     "canCreateQR": false,
     "buildingId": null,
     "organizationId": null,
     "tenantId": null,
      "locks": [
          "5e2e0a05-bfa1-46e9-98fa-6b5d1051978a",
          ...
      ],
     "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```
Example Response on Failure:

```json
{
    "success": false,
    "error": "string"
}
```
</details>

<details>
  <summary><strong>Method: GET, URL: /auth/refresh  </strong> <i> &nbsp&nbsp Get new access token using refresh token </i></summary> 
Endpoint is used to automatically acquire access token using refresh token. Endpoint should be adressed mainly in case of **jwt expired** message in response to unsuccessful request. A valid refresh token should be provided in 'refreshToken' header of the request.

Example response on success:

```json
{
    "success": true,
    "accessToken": "eyJhbGciOi..."
}
```
</details>

<details>
  <summary><strong>Method: GET, URL: /organizations  </strong> <i> &nbsp&nbsp Get organizations</i></summary> 

Default request will return a full list of organizations available to the user.\
Additional query parameter is supported to narrow the list of organizations in response.Request will be rejected with error if invalid query parameter, or query parameter, that assume rights violation is provided.\
Query Parameter:
* **?organizations=** list of organizations identifiers 

Example response on success:

```json
{
    "success": true,
    "payload": [
        {
            "id": "0527228e-ba6f-4a9a-b2f7-b017921e437b",
            "name": "Jast, Turcotte and Schaefer",
            "legalAddress": "18359 Maynard Pines Apt. 787",
            "phone": "+77074453253",
            "email": "Celestino.Bergnaum22@hotmail.com",
            "isActive": true
        },
        ...
    ]
}
```
Example Response on Failure:
```json

{
    "success": false,
    "message": "User has no rights to access organizations data"
}
```
</details>

<details>
  <summary><strong>Method: POST, URL: /organizations  </strong> <i> &nbsp&nbsp Register new organization entry</i></summary> 

Create new organization entry in the database. Only available to users with "umanuAdmin" role.\
Example request:

```json
{
  "name": "MyOrganization",
  "legalAddress": "908 Ruecker Ridge Apt. 379",
  "phone": "+77079761717",
  "email": "King58@hotmail.com"
}
```
Requested Fields:
* **name** (string): a name of organization.
* **phone** (string, optional): The phone number.
* **legalAddress** (string, optional): legal address of the organization
* **email** (string, optional): contact email of the organization
* **isActive** (boolean, optional): denotes if organization is active. Automatically generated as true if not provided otherwise

Example response on success:

```json
{
    "success": true,
}
```
</details>

<details>
  <summary><strong>Method: GET, URL: /organizations/:id  </strong> <i> &nbsp&nbsp Get organization by id</i></summary> 
Get organization by id

Example response on success:

```json
{
    "success": true,
    "organization": {
        "id": "0527228e-ba6f-4a9a-b2f7-b017921e437b",
        "name": "SomeOrganizationName",
        "legalAddress": "18359 Maynard Pines Apt. 787",
        "phone": "+77074453253",
        "email": "Celestino.Bergnaum22@hotmail.com",
        "isActive": true
    }
}
```
</details>

<details>
  <summary><strong>Method: PUT, URL: /organizations/:id  </strong> <i> &nbsp&nbsp Update data on organization with given id</i></summary> 

Update data on organization with given id. Only available to users with "umanuAdmin" role.\
Example request:

```json
{
  "name": "MyOrganization",
  "legalAddress": "908 Ruecker Ridge Apt. 379",
  "phone": "+77079761717",
  "email": "King58@hotmail.com",
  "isActive": false
}
```

Example response on success:

```json
{
    "success": true,
}
```
</details>

<details>
  <summary><strong>Method: GET, URL: /buildings  </strong> <i> &nbsp&nbsp Get buildings</i></summary> 
Default request will return a full list of buildings available to the user.

Additional query parameters are supported to narrow the list of organizations in response. Request will be rejected with error if invalid query parameters, or query parameters, that assume rights violation are provided.

Query Parameter (multiple can be combined in one request):
* **?organizationId=** Filters buildings by an organization
* **?buildings=** list of buildings identifiers 

Example response on success:

```json
{
    "success": true,
    "payload": [
        {
            "id": "bdf63a7c-f92b-4583-8c17-fa60bd9ad933",
            "name": "Building #lWasr",
            "address": "2094 Gislason Motorway Apt. 711",
            "isActive": true,
            "organizationId": "ddbfb80a-3292-4a1e-ad88-bad54cbe0a08"
        },
        ...
    ]
}
```
Example Response on Failure:
```json

{
    "success": false,
    "message": "User has no rights to access building data"
}
```
</details>

<details>
  <summary><strong>Method: POST, URL: /buildings  </strong> <i> &nbsp&nbsp Register new building entry</i></summary> 

Create new organization entry in the database. Only available to users with "umanuAdmin" role.\
Example request:

```json
{
    "name": "Office center #1",
    "address": "Some address",
    "organizationId": "ddbfb80a-3292-4a1e-ad88-bad54cbe0a08"
}
```

Requested Fields:
* **name** (string): a name of the building.
* **address** (string): address of the building
* **organizationId** (string): Id of the organization with which the building is associated

Example response on success:

```json
{
    "success": true,
}
```
</details>

<details>
  <summary><strong>Method: GET, URL: /buildings/:id  </strong> <i> &nbsp&nbsp Get building by id</i></summary> 
Get building by id

Example response on success:

```json
{
    "success": true,
    "building": {
        "id": "f59bc65e-932c-4333-b411-3e5d67f96841",
        "name": "Building #aJ05K",
        "address": "5965 Kirlin Stream Suite 129",
        "isActive": true,
        "organizationId": "ddbfb80a-3292-4a1e-ad88-bad54cbe0a08"
    }
}
```
</details>

<details>
  <summary><strong>Method: PUT, URL: /buildings/:id  </strong> <i> &nbsp&nbsp Update data on building with given id</i></summary> 

Update data on building with given id.\
Example request:

```json
{
    "name": "Office center #1",
    "address": "Some address",
    "organizationId": "ddbfb80a-3292-4a1e-ad88-bad54cbe0a08",
    "isActive": false,
}
```

Example response on success:

```json
{
    "success": true,
}
```
</details>

<details>
  <summary><strong>Method: GET, URL: /tenants  </strong> <i> &nbsp&nbsp Get tenants</i></summary> 
Default request will return a full list of tenants available to the user.\
Additional query parameters are supported to narrow the list of organizations in response. Request will be rejected with error if invalid query parameters, or query parameters, that assume rights violation are provided.\
Query Parameter (multiple can be combined in one request):
* **?organizationId=** Filters tenants by an organization
* **?buildingId=** Filters tenants by a building
* **?tenants=** list of tenants identifiers

Example response on success:

```json
{
    "success": true,
    "payload": [
        {
            "id": "0999e7fe-8c08-4f24-b324-689a04d46915",
            "buildingId": "b43d1557-8787-4a33-a7c3-2d924056f7c8",
            "name": "ubiquitous parallelism",
            "legalAddress": "99283 Crist Plains Suite 851",
            "phone": "+77079629917",
            "email": "Janiya76@yahoo.com",
            "isActive": true,
            "locks": [
                "77113183-858d-4f0d-a273-278abfbfd3b4"
            ]
        },
        ...
    ]
}
```
Example Response on Failure:
```json

{
    "success": false,
    "message": "'Building Id specified in query does not match building associated with this administrator'"
}
```
</details>

<details>
  <summary><strong>Method: POST, URL: /tenants  </strong> <i> &nbsp&nbsp Register new tenant entry</i></summary> 

Create new tenant entry in the database. Available to users with "umanuAdmin" role or "organizationAdmin" role. Organization Administrator can create tenants only associated with his/her own organization.\
Example request:

```json
{
    "buildingId": "b43d1557-8787-4a33-a7c3-2d924056f7c8",
    "name": "Another Tenant",
    "legalAddress": "Another Address",
    "phone": "+77079629917",
    "email": "Tenant85@gmail.com",
    "locks": ["77113183-858d-4f0d-a273-278abfbfd3b4"]
}
```

* **buildingId?** (string): an Id of the building with which the tenant is associated,
* **name** (string): name of the tenant
* **phone** (string, optional): The phone number of the tenant.
* **legalAddress** (string, optional): legal address of the tenant
* **email** (string, optional): contact email of the tenant
* **locks** (string[]): a list of locks uuids tenant has access to

Example response on success:

```json
{
    "success": true,
}
```
</details>

<details>
  <summary><strong>Method: GET, URL: /tenants/:id  </strong> <i> &nbsp&nbsp Get tenant by id</i></summary> 
Get building by id

Example response on success:

```json
{
    "success": true,
    "tenant": {
        "id": "0999e7fe-8c08-4f24-b324-689a04d46915",
        "buildingId": "b43d1557-8787-4a33-a7c3-2d924056f7c8",
        "name": "ubiquitous parallelism",
        "legalAddress": "99283 Crist Plains Suite 851",
        "phone": "+77079629917",
        "email": "Janiya76@yahoo.com",
        "isActive": true,
        "locks": [
            "77113183-858d-4f0d-a273-278abfbfd3b4"
        ]
    }
}
```
</details>

<details>
  <summary><strong>Method: PUT, URL: /tenants/:id  </strong> <i> &nbsp&nbsp Update data on tenant with given id</i></summary> 

Update data on tenant with given id. 
Example request:

```json
{
    "buildingId": "b43d1557-8787-4a33-a7c3-2d924056f7c8",
    "name": "Updated Tenant",
    "legalAddress": "99283 Elm Street 851",
    "phone": "+77079629917",
    "email": "Lantz84@yahoo.com",
    "isActive": true,
    "locks": [
        "77113183-858d-4f0d-a273-278abfbfd3b4"
    ]
}
```

Example response on success:

```json
{
    "success": true,
}
```
</details>

<details>
  <summary><strong>Method: GET, URL: /locks  </strong> <i> &nbsp&nbsp Get locks</i></summary> 
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
    ...
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

Query Parameters (multiple can be combined in query-parameters of one request):
* **?buildingId=**  Filters locks by a building 
* **?organizationId=** Filters locks by an organization
* **?locks=** list of locks identifiers 

<code style="color : red">**!IMPORTANT**</code>: If user has no access to the entity specified in query parameters a request will be rejected with an error
</details>

<details>
  <summary><strong>Method: POST, URL: /locks  </strong> <i> &nbsp&nbsp Register new lock entry</i></summary> 

Create new lock entry in the database. Only available to users with "umanuAdmin" role.\
Example request:

```json
{
    "name": "Front door lock #qw5o",
    "buildingId": "bdf63a7c-f92b-4583-8c17-fa60bd9ad933",
    "isActive": true,
    "type": "door"
}
```

Requested Fields:
* **name** (string): a name of the lock.
* **buildingId** (string): Id of the building in which the lock is installed
* **type** ("door" | "barrier"): a type of the lock.
* **isActive** (boolean, optional): denotes if lock is active. Automatically generated as true if not provided otherwise

Example response on success:

```json
{
    "success": true,
}
```
</details>

<details>
  <summary><strong>Method: PUT, URL: /locks/:id  </strong> <i> &nbsp&nbsp Update data on the lock with given id</i></summary> 

Update data on the lock with given id.\
Example request:

```json
{
    "name": "Renamed lock #2",
    "buildingId": "bdf63a7c-f92b-4583-8c17-fa60bd9ad933",
    "isActive": false,
    "type": "barrier"
}
```

Example response on success:

```json
{
    "success": true,
}
```
</details>


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
