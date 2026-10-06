# BoxDrop - Subscription Box Service

Case Study 97. This version deliberately uses no Firebase. It uses Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt, Multer and a simple React/Vite frontend. Product images can be uploaded to the local `backend/uploads` folder instead of Firebase Storage.

## Structure

BoxDrop-JWT-MongoDB-Project/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── seed.js
│   ├── config/db.js
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── uploads/
├── frontend/
│   └── src/
└── postman/BoxDrop.postman_collection.json

## Backend
cd backend
npm install
cp .env.example .env
# Put your MongoDB Atlas URI in .env
npm run seed
npm start

Backend runs on http://localhost:5001

## Frontend
Open a second terminal:
cd frontend
npm install
npm run dev

Frontend runs on http://localhost:5173

## Auth
Registration and login use bcrypt password hashing and JWT. Protected API requests use `Authorization: Bearer <JWT>`.

## Main flow
Search plan -> Register/Login -> Subscribe -> Subscription saved -> Shipment created -> Dashboard -> Track/Cancel.

## Important case-study note
The original specification mentions Firebase Auth and Firebase Storage. This copy intentionally removes Firebase completely to keep the project simple. If your faculty strictly requires Firebase, this version would need Firebase added back.

## Frontend design
The frontend uses a polished responsive design with a curated-box hero, plan cards, search, dashboard stats, subscription cards, and responsive login/register screens. No extra frontend libraries are required.
