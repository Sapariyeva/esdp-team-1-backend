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
* **valid_from** (integer): The starting time of QR code validity in Unix timestamp format (milliseconds). Minimum valid starting datetime is 1672506000000 (e.g.2023-01-01T00:00:00)
* **valid_to** (integer): The expiration time of QR code validity in Unix timestamp format (milliseconds).

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
    "error": string
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
* **role** ("admin" | "user"): sets level of user privileges (not used, as for now)
* **canCreateQR** (integer): denotes if user is allowed to create guest access entries (not used, as for now)

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
    "error": string
}
```


# Registering new lock

Method: POST

URL: /qr

Endpoint accepts JSON in the body of a POST request  and responds with  success of the operation and info on registered lock.

Example request:

```json
{
    "name": "lock # 1",
    "type": "door"
}

```

Requested Fields:

* **name?** (string): a name for the lock (optional).
* **type** ("door" | "barrier"): specifies a type of the lock.

Example Response on Success:

```json
{
    "success": true,
	"lock":
	{
	    "name": "lock # 1",
        "type": "door",
		"id": "86ddf175-987c-4bbf-8b3e-fd0ebd998397"
	}
}
```

Example Response on Failure:

```json
{
    "success": false,
    "error": string
}
```



