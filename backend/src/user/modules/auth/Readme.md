Auth Endpoints

Register: POST /api/auth/register

Auth: none
Request body (application/json): { "name": string, "email": string, "password": string, "phone"?: string, "address"?: string }
Success (201): { "user": { "id": string, "email": string, "name": string, "phone"?: string, "address"?: string, "createdAt": string } }
Errors: 400 (validation / user exists), 500
Example cURL:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Kumar","email":"alice@example.com","password":"secret123","phone":"+9779812345678","address":"Thapathali, Kathmandu, Nepal"}'



Login: POST /api/auth/login

Auth: none
Request body (application/json): { "email": string, "password": string }
Success (200): { "user": { "id": string, "email": string, "name": string } }
Errors: 400 (validation), 401 (invalid credentials), 500
Example cURL:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'



Get profile: GET /api/auth/profile

Auth: Basic — header Authorization: Basic <base64(email:password)>
Request: none
Success (200): { "user": { "id": string, "email": string, "name": string, "phone"?: string, "address"?: string, "createdAt": string, "updatedAt": string } }
Errors: 401 (missing/invalid Basic auth), 404 (not found), 500
Example cURL:
AUTH=$(printf "alice@example.com:secret123" | base64)
curl http://localhost:5000/api/auth/profile -H "Authorization: Basic $AUTH"



Update profile: PUT /api/auth/profile

Auth: Basic — header Authorization: Basic <base64(email:password)>
Request body (application/json): any of { "name"?: string, "phone"?: string, "address"?: string, "password"?: string }
If password provided, it will be hashed before storing.
Success (200): { "user": { "id": string, "email": string, "name": string, "phone"?: string, "address"?: string, "createdAt": string, "updatedAt": string } }
Errors: 400 (validation), 401 (auth), 500
Example cURL (change name & phone):
AUTH=$(printf "alice@example.com:secret123" | base64)
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Basic $AUTH" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice K.","phone":"+9779800000000"}'



Delete account: DELETE /api/auth/profile

Auth: Basic — header Authorization: Basic <base64(email:password)>
Request: none
Success (200): { "success": true }
Errors: 401 (auth), 500
Example cURL:
AUTH=$(printf "alice@example.com:secret123" | base64)
curl -X DELETE http://localhost:5000/api/auth/profile -H "Authorization: Basic $AUTH"