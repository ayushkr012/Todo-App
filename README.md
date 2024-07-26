# Movie Watchlist Application

This is a movie watchlist application built with React.js for the frontend and Node.js/Express.js for the backend. It allows users to manage their movie collections by performing CRUD operations (Create, Read, Update, Delete), rating movies, providing feedback, and viewing detailed movie information.

## Features

- **User Authentication**: Secure user authentication using Google Authentication.
- **CRUD Operations**: Add, delete, update movies in the watchlist.
- **Rating and Feedback**: Users can rate movies and provide feedback.
- **Detailed Movie Information**: View comprehensive details of each movie.
- **Cloud Storage**: Integrated with Cloudinary for storing movie images securely.

## Tech Stack

- **Frontend**: React.js, Redux
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via MongoDB Atlas)
- **Cloud Storage**: Cloudinary
- **Authentication**: Google Authentication (OAuth 2.0)
- **Email Notifications**: Nodemailer (for sending email notifications)

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB Atlas account for the database (replace `MONGO_URI` in `server/.env` with your MongoDB URI).
- Cloudinary account for media storage (replace `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUDINARY_API_SECRET` in `server/.env` with your Cloudinary credentials).

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ayushkr012/Movie-Watchlist-Application.git
   ```
2. Navigate to the backend directory and install dependencies
   ```sh
   cd server
   npm install
   ```
3. Set up environment variables by creating a `.env` file in the backend directory and add the following:
   ```env
   MONGO_URI=mongodb+srv://your_username:your_password@cluster0.your_host.mongodb.net/your_database?retryWrites=true&w=majority
   PORT=3001
   JWT_SECRET=your_jwt_secret
   EMAIL=your_email@gmail.com
   PASSWORD=your_email_password
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. start the development server
   ```sh
   npm start
   ```
5. Navigate to the frontend directory and create a `.env.local` file for client-side environment variables:
   ```env
   REACT_APP_CLOUDINARY_API_KEY=your_cloudinary_api_key
   REACT_APP_Backend_URL=http://localhost:3001
   ```
6. Install frontend dependencies and start the app
   ```sh
   cd ../client
   npm install
   npm start
   ```

## Usage

- Open your web browser and navigate to `http://localhost:3000` to use the application.
- Sign in with your Google account or use email and password to access the movie watchlist functionalities.
- Explore the features to manage your movie collection efficiently.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
