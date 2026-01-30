# Auth module API

This document describes the HTTP endpoints exposed by the auth module (routes in `src/modules/auth/presentation/routes.ts`) and shows example requests and responses for each route.

Base URL note: the routes in this file are mounted wherever the app mounts `authRoutes`. The examples below use the route paths as defined (e.g. `/users/create-partial`). Replace `http://localhost:4000/api` with your server base URL and prefix if needed.

> Quick note: some routes in the project are currently registered as GET but expect a JSON request body (for example `/users/find` and `/otp/request`). It's recommended to use POST for endpoints that accept request bodies; examples below follow the code as-is but using POST is suggested for real clients.

---

## GET /users/find
Find a user by contact (email or phone).

Request (JSON body)

{
  "contact": "+15551234567"
}

Success response (200)

{
  "ok": true,
  "message": "User Found.",
  "user": {
    "_id": "64a1f3e2abc123...",
    "fullName": "Jane Doe",
    "gender": "Female",
    "birthdate": "1990-05-12T00:00:00.000Z",
    "email": "jane.doe@example.com",
    "phone": "+15551234567",
    "userStatus": {
      "partialProfileCompleted": true,
      "registerOtpVerified": true,
      "fullProfileCompleted": false
    }
  }
}

Error response (400) when not found

{
  "ok": false,
  "message": "User Not Found."
}

Example curl (if your server supports GET with body — otherwise use POST):

curl -X GET 'http://localhost:3000/users/find' -H 'Content-Type: application/json' -d '{"contact":"+15551234567"}'

---

## POST /users/create-partial
Create a partial user record. This is used to create a minimal user profile (partial registration) and sets userStatus.partialProfileCompleted = true.

Request (JSON body)

{
  "fullName": "Jane Doe",
  "gender": "Female",
  "birthdate": "1990-05-12",
  "contact": "+15551234567"
}

Success response (200)

{
  "ok": true,
  "message": "Partial User Created.",
  "user": {
    "id": "64a1f3e2abc123...",
    "fullName": "Jane Doe",
    "gender": "Female",
    "birthdate": "1990-05-12T00:00:00.000Z",
    "email": null,
    "phone": "+15551234567",
    "userStatus": {
      "partialProfileCompleted": true,
      "registerOtpVerified": false,
      "fullProfileCompleted": false
    }
  }
}

Error (400) if user already exists

{
  "ok": false,
  "message": "User Already Exists."
}

Example curl:

curl -X POST 'http://localhost:3000/users/create-partial' -H 'Content-Type: application/json' -d '{"fullName":"Jane Doe","gender":"Female","birthdate":"1990-05-12","contact":"+15551234567"}'

---

## POST /users/create-full
Complete a user's full profile. The endpoint accepts either `userId` (database id) or `contact` to locate the user. It will persist provided profile fields and set `userStatus.fullProfileCompleted = true`. The use-case requires the user already has `partialProfileCompleted = true` and `registerOtpVerified = true`.

Request (JSON body) — choose one identifying field (`userId` or `contact`):

{
  "contact": "+15551234567",
  "fullName": "Jane Doe",
  "gender": "Female",
  "birthdate": "1990-05-12",
  "email": "jane.doe@example.com",
  "phone": "+15551234567",
  "identifier": "A1234567",
  "identifierType": "nid",
  "nationality": "USA",
  "address": "123 Main St",
  "city": "Newcity",
  "maritalStatus": "Single",
  "speakingLanguages": ["English","Arabic"],
  "guardianInformation": "64a2b3c4d5e6f7g8h9i0j1k2",
  "patientCategory": "Adult"
}

Success response (200)

{
  "ok": true,
  "message": "Full User Created/Completed.",
  "user": {
    "id": "64a1f3e2abc123...",
    "fullName": "Jane Doe",
    "gender": "Female",
    "birthdate": "1990-05-12T00:00:00.000Z",
    "email": "jane.doe@example.com",
    "phone": "+15551234567",
    "userStatus": {
      "partialProfileCompleted": true,
      "registerOtpVerified": true,
      "fullProfileCompleted": true
    }
  }
}

Error responses (400)

// When user not found
{
  "ok": false,
  "message": "User not found."
}

// When preconditions not met
{
  "ok": false,
  "message": "User is not eligible to complete full profile. Ensure partial profile is completed and registration OTP is verified."
}

Example curl:

curl -X POST 'http://localhost:3000/users/create-full' -H 'Content-Type: application/json' -d '{"contact":"+15551234567","fullName":"Jane Doe","gender":"Female","birthdate":"1990-05-12","email":"jane.doe@example.com"}'

---

## GET /otp/request
Request an OTP for a subject (register, login, report). The controller signs a temporary token and returns an `otpToken` to the client. The implementation will attempt to send the OTP via SMS or email and may return an `err` field if sending fails.

Request (JSON body)

{
  "subjectRef": "64a1f3e2abc123...", // subject id (e.g. user id or report id)
  "subjectType": "register", // one of "register", "login", "report"
  "contact": "+15551234567" // phone or email
}

Success response (200)

{
  "ok": true,
  "otpToken": "<signed-jwt-token-here>"
}

Failure when sending (200 but with err field)

{
  "err": "Error message from mail/sms provider"
}

Example curl:

curl -X GET 'http://localhost:3000/otp/request' -H 'Content-Type: application/json' -d '{"subjectRef":"64a1f3e2abc123","subjectType":"register","contact":"+15551234567"}'

---

## POST /otp/verify
Verify an OTP code using the `otpToken` returned by `/otp/request`.

Request (JSON body)

{
  "otpToken": "<signed-jwt-token-received-from-request>",
  "code": "123456"
}

Success response (200)

{
  "ok": true
}

Error responses (status and body depend on reason):

401 invalid or invalid_token
400 expired
429 locked
404 not_found

Example error body

{
  "ok": false,
  "reason": "invalid"
}

Example curl:

curl -X POST 'http://localhost:3000/otp/verify' -H 'Content-Type: application/json' -d '{"otpToken":"<token>","code":"123456"}'

---

## Notes & Recommendations

- Use POST for endpoints that expect request bodies (e.g. `/users/find` and `/otp/request` currently registered as GET). This avoids clients and intermediate proxies dropping request bodies.
- The `create-full` endpoint persists any allowed profile fields passed in the request and marks the profile completed. If you want to restrict which fields are updatable via this endpoint, add validation in `presentation/validators` and/or in the controller.
- For security, treat the `otpToken` as sensitive and transmit it only over HTTPS.

If you want, I can add a Zod schema (`CreateFullUserSchema`) and wire it into the controller for strict validation examples.
