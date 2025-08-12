# Documentation

This project is JWT (JSON Web Token) API. JWT is an authentication that is encoded as a JSON object that is digitally signed using JSON Web Signature (JWS). [Learn more](https://jwt.io/introduction).

## About API

This back-end is free to use, you just have to host it by yourself and create the databases.

## Setting Database

Firstly, you will need to open the `/src/server.ts` path and set a port. After that, open the `src/models/db.ts` path and change the URL or add an environment path. So go to the `/src/config/tokenConfig.ts` and `/src/config/encryptConfig.ts` and config the JWT as you want.

## Routes

### User

<details>
<summary><strong>Get User</strong> - <i>It'll return some user</i></summary>
<br>
<strong>Endpoint:</strong> https://<i>yourURL</i>/users/:user
<br>
<strong>Method:</strong> GET
<br><br>

```bash
    {
        "_id": "6669d701671635f97181c52c",
        "email": "charlotte@gmail.com",
        "username": "Charlotte",
        "createdAt": "2024-06-12T17:12:33.290Z"
    }
```

</details>

<details>
<summary><strong>Delete User</strong> - <i>It'll delete a user</i></summary>
<br>
<strong>Endpoint:</strong> https://<i>yourURL</i>/users/
<br>
<strong>Method:</strong> DELETE
<br><br>

```bash
{ message: "The user was deleted." }
```

</details>

<details>
<summary><strong>Update Password</strong> - <i>It'll update the password</i></summary>
<br>
<strong>Endpoint:</strong> https://<i>yourURL</i>/users/password/
<br>
<strong>Method:</strong> PATCH
<br><br>

```bash
{ message: "Updated successfully." }
```

</details>

<details>
<summary><strong>Update Username</strong> - <i>It'll update the username</i></summary>
<br>
<strong>Endpoint:</strong> https://<i>yourURL</i>/users/username
<br>
<strong>Method:</strong> PATCH
<br><br>

```bash
{ message: "Updated successfully." }
```

</details>


*Note: This route only works if the user has a token.*