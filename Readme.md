
# Todo Application 

## Description
This project involves designing a Todo Application with core functionalities, role-based access control, and additional features. The application is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) along with various modern technologies.

## Core Functionalities
1. **Authentication:**
   - User / Admin Login.
   - User / Admin Sign Up.

2. **Todo Management:**
   - CRUD Operations: Create, Read, Update, Delete tasks.
   - Search Functionality: Allow users to search for tasks.

3. **Role-Based Access Control:**
   - **Admin:** Full access to all tasks and user management for all users in the database.
   - **User:** Access to personal tasks only.

## Additional Features
- **Three Authentication Methods:** Password-based authentication, Google-based authentication, and OTP-based authentication.
- **User Notification:**
  - Users are notified via email when their account is deleted by an admin.
  - Super admin can assign or remove admin roles for users, and notifications are sent via email.

### Tech Stack:
- MERN Stack (MongoDB, Express.js, React.js, Node.js)
- Redux
- Material UI / Tailwind CSS
- Cloudinary
- OAuth2
- Nodemailer

### Security:
- Secure password storage with hashing.
- JWT-based authentication.
- User password encryption.
- Cookies/Sessions management.

### Role Management:
- Middleware for role-based access control.

### CRUD Operations:
- Efficient handling of task creation, retrieval, updates, and deletions.
- Implement search functionality for tasks based on keywords.

### Frontend Functionality:
- Display tasks in a user-friendly manner.
- Forms for creating and updating tasks.
- Dynamic and responsive UI.


### Deployment URL
[Todo Application](https://todo-app-lilac-omega-76.vercel.app/)

## Environment Variables
### Backend (.env file)
```
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=3001
JWT_SECRET=yourjwtsecret
EMAIL=youremail@gmail.com
PASSWORD=yourpassword
CLOUD_NAME=yourcloudname
CLOUD_API_KEY=yourcloudinaryapikey
CLOUDINARY_API_SECRET=yourcloudinaryapisecret
Google_Client_Id=yourgoogleclientid.apps.googleusercontent.com
```

### Frontend (.env file)
```
REACT_APP_CLOUDINARY_API_KEY=yourcloudinaryapikey
REACT_APP_Backend_URL=http://localhost:3001
# Google_Client_Id=yourgoogleclientid.apps.googleusercontent.com
```

## Instructions for Running the Application
### Backend:
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add the backend environment variables.
4. Start the server:
   ```bash
   npm start
   ```

### Frontend:
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory and add the frontend environment variables.
4. Start the frontend application:
   ```bash
   npm start
   ```