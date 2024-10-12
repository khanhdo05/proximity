# Proximity

## Overview

Proximity is a networking application that enables users to log in and discover people around them within a 1-mile radius. The uniqueness of the app lies in its anonymity aspect—users won’t see others' names or personal details but instead receive information in the form of labels like "1 person from MIT," "2 people interested in cinema," or "3 people from Amazon." Users can customize the labels they wish to display on their profile and choose labels that interest them from others. Interaction begins when a user sends a connection request to another based on these labels, and the recipient has the option to accept or decline. Once accepted, they can chat and arrange to meet in real life for networking purposes.

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/khanhdo05/proximity.git
   cd proximity
   ```

2. **Install dependencies for both frontend and backend:**

   ```bash
   npm run install:all
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend` directory and add the following:
   ```plaintext
   MONGO_URI=your_mongodb_connection_string
   ```

### Running the Application

1. **Start both backend and frontend servers:**

   ```bash
   npm start
   ```

2. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

**Formatting code**
   ```bash
   npm run format
   ```