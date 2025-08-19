# Documentation

This project is JWT (JSON Web Token) API. JWT is an authentication that is encoded as a JSON object that is digitally signed using JSON Web Signature (JWS). [Learn more](https://jwt.io/introduction).

## About API

This back-end is free to use, you just have to host it by yourself and create the databases.

## Setting Database

Firstly, you will need to open the `/src/index.ts` path and set a port. After that, open the `/src/infra/db.mongoose.ts` path and change the URL or add an environment path. So go to the `/src/token/token.config.ts` and `/src/common/lib/encrypt.config.ts` and config the JWT as you want.

## Routes

### Session

<details>
<summary><strong>Sign-in</strong> - <i>It'll sign-in you in the application</i></summary>
<br>
<strong>Route:</strong> <i>POST /sign-in</i> 
    
#### Request Body

```bash
    {
        "email": "user@example.com",
        "password": "YourPassword123!"
    }
```

#### Behavior:

- Verifies email and password against stored credentials.
- If invalid, throws UnauthorizedError.
- Generates Access Token and Refresh Token.
- Saves refresh token in DB.
- Returns user data without sensitive fields.

```json
{
  "success": true,
  "message": "Sign-in successfully.",
  "data": {
    "user": {
      "id": "6669d701671635f97181c52c",
      "email": "user@example.com",
      "username": "user",
      "createdAt": "2024-06-12T17:12:33.290Z"
    }
  }
}
```

</details>

<details> 
<summary><strong>Sign-up</strong> - <i>It'll register a new user</i></summary>
<br>
<strong>Route:</strong> <i>POST /sign-up</i>

#### Request Body

```json
{
  "email": "user@example.com",
  "username": "exampleUser",
  "password": "Password@123",
  "confirmPassword": "Password@123"
}
```

#### Behavior:

- Validates Email, must be in valid format (e.g., usuario@dominio.com).
- Validates Username, must be 3–20 characters long, containing only letters and numbers.
- Validates Password, must be at least 8 characters, with at least one uppercase, one lowercase, one number, and one symbol.
- Checks Conflicts, fails if email or username already exists.
- Creates new user in the database.
- Returns success message.

#### Response Example

```json
{
  "success": true,
  "message": "User registered successfully."
}
```

</details>

<details>
<summary><strong>Sign-out</strong> - <i>It'll log you out of the application</i></summary>
<br>
<strong>Route:</strong> <i>GET /sign-out</i>

#### Behavior

- Gets `refreshToken` from cookies.
- If no token, throws **400 BadRequestError** ("No token provided").
- Decodes the `refreshToken` to get the user ID.
- Deletes refresh token from DB.
- Clears `accessToken` and `refreshToken` cookies.
- Returns success message.

#### Response Example

```json
{
  "success": true,
  "message": "You were disconnected."
}
```

</details>

<details>
<summary><strong>Forget Password</strong> - <i>It'll send a password reset email</i></summary>
<br>
<strong>Route:</strong> <i>POST /forget-password</i>  

#### Request Body

```json
{
  "email": "user@example.com"
}
```

#### Behavior

- Checks if the user exists by email.
- If not found, throws 404 NotFoundError ("User not found.").
- Generates a secure reset token (32 random bytes, hex).
- Hashes token using SHA-256 and stores it in DB with a 15-min expiration.
- Builds a reset URL containing the raw token.
- Sends recovery email with the reset link.
- Returns confirmation message.

#### Response Example

```json
{
  "success": true,
  "message": "Email sent successfully."
}
```

</details>

<details>
<summary><strong>Reset Password</strong> - <i>It'll update the user's password</i></summary>
<br>
<strong>Route:</strong> <i>POST /reset-password/:token</i>

#### Request Body

```json
{
  "password": "NewPassword@123",
  "confirmPassword": "NewPassword@123"
}
```

#### Behavior

- Checks if password matches confirmPassword.
- If mismatch, throws 400 BadRequestError ("Passwords doesn't match").
- Hashes the token using SHA-256.
- Finds user by hashed token where passwordResetExpires is still valid.
- If no user found, throws 400 BadRequestError ("Could not reset password").
- Encrypts and updates user password.
- Clears passwordResetToken and passwordResetExpires.
- Saves user and returns success message.

#### Response Example

```json
{
  "success": true,
  "message": "Password updated successfully."
}
```

</details>

## Token

<details>
<summary><strong>Verify Session</strong> - <i>It checks if the user is authenticated</i></summary>
<br>
<strong>Route:</strong> <i>GET /verify-token</i>

#### Behavior

- Verifies the access token from the request (headers or cookies).
- If valid, returns success message.
- If invalid or expired, throws authentication error.

#### Response Example

```json
{
  "success": true,
  "message": "User is authenticated."
}
```

</details>

<details>
<summary><strong>Refresh Session</strong> - <i>It renews the user's access and refresh tokens</i></summary>
<br>
<strong>Route:</strong> <i>GET /refresh-token</i>

#### Behavior

- Verifies the refresh token from cookies.
- If token payload is invalid, throws **401 UnauthorizedError** ("Invalid refresh token payload").
- Checks if the user exists by ID.
- If user not found, throws **401 UnauthorizedError** ("User not found").
- Ensures the previous refresh token exists in cookies.
- Generates a new **access token** and **refresh token**.
- Updates cookies with new tokens.
- Updates refresh token in the database, replacing the old one.
- Returns success message if everything succeeds.

#### Response Example

```json
{
  "success": true,
  "message": "Session successfully renewed."
}
```

</details>

## User

<details>
<summary><strong>Get User</strong> - <i>It retrieves the authenticated user's account information</i></summary>
<br>
<strong>Route:</strong> <i>GET /user</i>  

#### Behavior

- Requires the user to be authenticated (`req.user` must exist).
- If not authenticated, throws **401 UnauthorizedError** ("You must be logged in to get your account").
- Fetches user by ID, selecting only `_id`, `email`, `username`, and `createdAt`.
- If user not found, throws **404 NotFoundError** ("User not found").
- Returns user data.

#### Response Example

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "6669d701671635f97181c52c",
      "email": "user@example.com",
      "username": "exampleUser",
      "createdAt": "2024-06-12T17:12:33.290Z"
    }
  }
}
```

</details>

<details>
<summary><strong>Delete User</strong> - <i>It deletes the authenticated user's account</i></summary>
<br>
<strong>Route:</strong> <i>DELETE /user</i>  

#### Behavior

- Requires the user to be authenticated (`req.user` must exist).
- If not authenticated, throws **401 UnauthorizedError** ("You must be logged in to delete your account").
- Deletes the user by ID from the database.
- If deletion fails, throws **500 InternalError** ("User can't be deleted from database").
- Returns success message upon deletion.

#### Response Example

```json
{
  "success": true,
  "message": "User deleted successfully."
}
```

</details>

<details>
<summary><strong>Update Password</strong> - <i>It updates the authenticated user's password</i></summary>
<br>
<strong>Route:</strong> <i>PATCH /user/password</i>  

#### Request Body

```json
{
  "lastPassword": "OldPassword@123",
  "password": "NewPassword@123",
  "confirmPassword": "NewPassword@123"
}
```

#### Behavior

- Requires the user to be authenticated (req.user must exist).
- If not authenticated, throws 401 UnauthorizedError ("You must be logged in to update your password").
- Retrieves the current hashed password from the database.
- Compares lastPassword with stored hash.
- If mismatch, throws 400 BadRequestError ("Your last password is not valid").
- Validates new password against security rules (min 8 chars, uppercase, lowercase, number, symbol).
- If invalid, throws 400 BadRequestError.
- Encrypts new password and updates it in the database.
- If update fails, throws 400 BadRequestError ("It was not possible to update password").
- Returns success message if password is updated.

#### Response Example

```json
{
  "success": true,
  "message": "User password updated successfully."
}
```

</details>

<details>
<summary><strong>Update Username</strong> - <i>It updates the authenticated user's username</i></summary>
<br>
<strong>Route:</strong> <i>PATCH /user/username</i>  

#### Request Body

```json
{
  "username": "newUsername123"
}
```

#### Behavior

- Requires the user to be authenticated (req.user must exist).
- If not authenticated, function returns early (no action).
- Validates new username (3–20 characters, letters and numbers only).
- If invalid, throws 400 BadRequestError.
- Checks if username already exists.
- If exists, throws 409 ConflictError ("This username already exists").
- Updates username in the database.
- If update fails, throws 400 BadRequestError ("It was not possible to update username").
- Returns success message if update succeeds.

#### Response Example

```json
{
  "success": true,
  "message": "Username updated successfully."
}
```

</details>

<details>
<summary><strong>Get User by Username</strong> - <i>It retrieves a user's information by username</i></summary>
<br>
<strong>Route:</strong> <i>GET /users/:username</i>

#### Behavior

- Fetches the user by username from the database.
- If user not found, throws 404 NotFoundError ("User not found").
- Returns user data.

#### Response Example

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "6669d701671635f97181c52c",
      "email": "user@example.com",
      "username": "exampleUser",
      "createdAt": "2024-06-12T17:12:33.290Z"
    }
  }
}
```

</details>

<details>
<summary><strong>Search Users</strong> - <i>It searches for users by username with optional pagination</i></summary>
<br>
<strong>Route:</strong> <i>GET /users/search/:username</i>
<br><br>
<strong>Queries:</strong><br>
<p>limit: string (optional, max number of users to return)</p>
<p>cursor: string (optional, ID of the last user from previous page for pagination)</p>

#### Behavior

- Searches users by partial or full username match.
- Supports pagination with limit and cursor.
- If no users found, throws 404 NotFoundError ("An users with this username was not found").
- Returns array of users and nextCursor for pagination.

#### Response Example

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "6669d701671635f97181c52c",
        "email": "user1@example.com",
        "username": "exampleUser1",
        "createdAt": "2024-06-12T17:12:33.290Z"
      },
      {
        "_id": "6669d701671635f98151ae4c",
        "email": "user2@example.com",
        "username": "exampleUser2",
        "createdAt": "2024-06-12T12:47:33.290Z"
      }
    ],
    "nextCursor": "6669d701671635f97181c52c"
  }
}
```

</details>
