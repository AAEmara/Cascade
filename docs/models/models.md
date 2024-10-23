# Models Documentation:

## User Model

### Document: User
| Field          | Type               | Description                             | Required | Note
| -------------- | ------------------ | --------------------------------------- | -------- | ------------------------- |
| `_id`          | `ObjectId`         | Unique identifier                       | Yes      | Auto-generated            |
| `firstName`    | `String`           | User's first name                       | Yes      |                           |
| `lastName`     | `String`           | User's last name                        | Yes      |                           |
| `email`        | `String`           | User's email address                    | Yes      |                           |
| `image`        | `String`           | User's image                            | No       | Defaults to default image |
| `password`     | `String`           | User's hashed password                  | Yes      |                           |
| `webAppRole`   | `String`           | Role of the user in the web app         | Yes      | Defaults to 'USER'        |
| `companyRoles` | `Array of Objects` | Roles of the use in different companies | Yes      |                           |
| `createdAt`    | `Timestamp`        | Creation time of the document           | Yes      | Auto-generated            |
| `updatedAt`    | `Timestamp`        | Last update time of the document        | Yes      | Auto-generated            |

### Sub-Document: Company Role
| Field          | Type       | Description                    | Required | Note           |
| -------------- | ---------- | ------------------------------ | -------- | -------------- |
| `_id`          | `ObjectId` | Unique identifier              | Yes      | Auto-generated |
| `companyId`    | `ObjectId` | Company's unique identifier    | Yes      |                |
| `departmentId` | `ObjectId` | Department's unique identifier | Yes      |                |
| `role`         | `String`   | User's role inside the company | Yes      |                |
