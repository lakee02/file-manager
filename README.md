# File Manager Application

The File Manager Application allows users to manage files and folders efficiently using Node.js, PostgreSQL, and AWS S3 bucket. The application provides various API endpoints to handle user registration, login, folder and file management, and file uploads to the AWS S3 bucket.

## Features

- User Registration and Login: Secure user registration and login functionality.
- Create Folder: Users can create new folders with unique names.
- Create Subfolder: Users can create subfolders inside existing folders with proper permissions.
- Upload Files: Users can upload files to the appropriate folders, securely stored in AWS S3, with metadata recorded in the PostgreSQL database.
- Manage Files: Rename, move, and delete files within the file manager system.

## Technologies Used

- Node.js: Server-side runtime environment.
- Express.js: Framework for building RESTful APIs.
- MongoDB: Database for storing user information and folder/file metadata.
- AWS S3 Bucket: Storage solution for uploaded files.
- AWS SDK for JavaScript (v3): Interacting with AWS services.
- JWT (JSON Web Tokens): User authentication and authorization.
- Other dependencies (see package.json for the complete list).

## Installation

1. Clone the repository:

2. Install dependencies:

3. Set up environment variables:
- Create a `.env` file in the root directory of the project.
- Add the necessary environment variables, such as database connection details, AWS credentials, JWT secret, etc.

4. Set up the database:
- Create a database and set its connection details in the `.env` file.

5. Start the application:

## API Endpoints

- **User**
- POST /api/register: Register a new user.
- POST /api/login: Authenticate user and generate a JWT token.

- **Folder**
- POST /api/folders: Create a new folder.
- POST /api/folders/:parentId/subfolders: Create a subfolder inside an existing folder.
- PUT /api/folders/:folderId: Rename a folder.
- DELETE /api/folders/:folderId: Delete a folder and its contents recursively.

- **File**
- POST /api/files/upload: Upload a file to the appropriate folder.
- PUT /api/files/:fileId: Rename a file.
- PUT /api/files/:fileId/move: Move a file to a different folder.
- DELETE /api/files/:fileId: Delete a file.

## Usage

1. Register a new user using the `/api/register` endpoint or login with existing credentials using the `/api/login` endpoint to get a JWT token.

2. Use the JWT token in the authorization header for protected routes to access folder and file management APIs.

3. Create folders using the `/api/folders` endpoint or create subfolders using the `/api/folders/:parentId/subfolders` endpoint.

4. Upload files to the appropriate folders using the `/api/files/upload` endpoint.

5. Manage files by renaming, moving, or deleting them using the respective file endpoints.


