# Todo App API

A RESTful API for managing tasks with user authentication using Flask and JWT tokens.

## Project Structure

![Project Structure](projectstructure.png)

## Technical Implementation Details

### Database Schema Design
The application uses two main tables with the following structure:

#### User Table
CREATE TABLE user (
id INTEGER PRIMARY KEY AUTO_INCREMENT,
username VARCHAR(80) UNIQUE NOT NULL,
password VARCHAR(120) NOT NULL
);


#### Task Table
CREATE TABLE task (
id INTEGER PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(120) NOT NULL,
description TEXT,
completed BOOLEAN DEFAULT FALSE,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
user_id INTEGER NOT NULL,
FOREIGN KEY (user_id) REFERENCES user(id)
);


### HTTP Methods
The API follows RESTful conventions for its endpoints:
- `GET`: Retrieve tasks or user information
- `POST`: Create new tasks or register/login users
- `PUT`: Update existing task details
- `PATCH`: Toggle task completion status
- `DELETE`: Remove tasks


### Authentication Implementation
The application uses JWT (JSON Web Tokens) for authentication:

1. **Registration Process**:
   - User submits username and password
   - Password is hashed using Bcrypt
   - User details stored in database

2. **Login Flow**:
   - User provides credentials
   - Server validates credentials
   - If valid, generates JWT token
   - Token returned to client

3. **Request Authentication**:
   - Client includes JWT in Authorization header
   - Format: `Authorization: Bearer <token>`
   - Server validates token for protected routes

4. **Security Measures**:
   - Passwords hashed using Bcrypt
   - JWTs expire after 1 hour
   - Protected routes require valid JWT
   - SQL injection prevention via SQLAlchemy


## Design Decisions

### Backend (Flask)
- **SQLAlchemy ORM**: Chosen for its powerful database abstraction and ease of use
- **JWT Authentication**: Implemented for secure, stateless authentication
- **RESTful Architecture**: Clear endpoint structure following REST principles
- **MySQL Database**: Used for robust data persistence
- **Blueprint Structure**: Organized routes for better code maintainability

### Frontend
- **HTML**: Used for the structure of the page
- **CSS**: Used for styling the page
- **JavaScript**: Used for simplicity and direct DOM manipulation
- **Async/Await**: Modern JavaScript for handling asynchronous operations
- **Event-Driven Design**: Interactive UI with real-time updates
- **Responsive Desn**: Mobile-friendly interface

## API Endpoints Examples
#### Register User
```bash
curl -X POST http://127.0.0.1:5001/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "user1", "password": "password123"}'
```

**Output**
{
"message": "User registered successfully",
"user_id": 1
}

#### Login
```bash
curl -X POST http://127.0.0.1:5001/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "user1", "password": "password123"}'
```

**Output**
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

#### Create Task
```bash
curl -X POST http://127.0.0.1:5001/tasks \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <token>" \
-d '{"title": "New Task", "description": "This is a new task"}'
```

**Output**
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, Bread, Eggs",
  "completed": false,
  "created_at": "2023-10-01T12:00:00Z",
  "updated_at": "2023-10-01T12:00:00Z",
  "user_id": 1
}


## Setup and Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd todo_app
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate 
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Generate JWT token:
```bash
python generate_token.py
```

5. Create database:
```sql
CREATE DATABASE yourdbname;
```

6. Create .env file and add the following variables:
```bash
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=your_host
DB_PORT=your_port
DB_NAME=your_database_name

JWT_SECRET_KEY=your_jwt_secret_key
```

7. Export the JWT_SECRET_KEY on your terminal:
```bash
export JWT_SECRET_KEY='generated_token'
```

8. Change the database credentials in the app.py file to your own database credentials.
```bash
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost:port/dbname' ##If db has no password
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:your_password@localhost:port/dbname' ##If db has password
```
using the .env file variables
```bash
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
```

9. Configure environment variables:
- In the .env file, set the JWT_SECRET_KEY to the generated token.
- In the app.py file, set the JWT_SECRET_KEY to the generated token.
```bash
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
```

10. Set up MySQL database by running the run.py file:
```bash
cd api
python run.py
```

11. Run the application:
```bash
python app.py
```

The application should be running on http://127.0.0.1:5001


## License
This project is licensed under the MIT License - see the LICENSE file for details.




