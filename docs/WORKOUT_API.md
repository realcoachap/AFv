# Workout Tracking API Documentation

Complete REST API for workout tracking with RPG gamification integration.

## Base URL
```
/api/workouts
```

## Authentication
All endpoints require authentication via NextAuth session cookie. Requests without valid authentication will receive a `401 Unauthorized` response.

---

## Endpoints

### 1. POST /api/workouts
Create a new workout with exercises and sets.

#### Request Body
```typescript
{
  name: string;              // Required, max 200 chars
  notes?: string;            // Optional, max 2000 chars
  date: string | Date;       // Required, ISO datetime
  duration?: number;         // Optional, minutes
  type?: "COACHED" | "SELF_LOGGED";  // Default: "SELF_LOGGED"
  status?: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";  // Default: "COMPLETED"
  focusType?: "STRENGTH" | "CARDIO" | "BALANCED";  // Optional
  exercises: [               // Required, at least 1
    {
      name: string;          // Required, max 200 chars
      category: "STRENGTH" | "CARDIO" | "FLEXIBILITY" | "BALANCE" | "SPORT" | "OTHER";
      duration?: number;     // Optional, minutes (for cardio)
      distance?: number;     // Optional
      distanceUnit?: "km" | "miles" | "meters";
      notes?: string;        // Optional, max 1000 chars
      order?: number;        // Default: 0
      sets: [                // Array of sets
        {
          setNumber: number; // Required, min 1
          reps?: number;     // Optional
          weight?: number;   // Optional
          weightUnit?: "lbs" | "kg" | "bodyweight";  // Default: "lbs"
          duration?: number; // Optional, seconds (e.g., planks)
          distance?: number; // Optional
          completed?: boolean;  // Default: true
          rpe?: number;      // Optional, 1-10 scale
          notes?: string;    // Optional, max 500 chars
        }
      ];
    }
  ];
}
```

#### Example Request
```json
{
  "name": "Upper Body Strength Day",
  "notes": "Felt strong today!",
  "date": "2024-02-11T10:00:00Z",
  "duration": 60,
  "type": "SELF_LOGGED",
  "focusType": "STRENGTH",
  "exercises": [
    {
      "name": "Bench Press",
      "category": "STRENGTH",
      "order": 0,
      "sets": [
        { "setNumber": 1, "reps": 10, "weight": 135, "rpe": 7 },
        { "setNumber": 2, "reps": 8, "weight": 155, "rpe": 8 },
        { "setNumber": 3, "reps": 6, "weight": 175, "rpe": 9 }
      ]
    },
    {
      "name": "Dumbbell Rows",
      "category": "STRENGTH",
      "order": 1,
      "sets": [
        { "setNumber": 1, "reps": 12, "weight": 50 },
        { "setNumber": 2, "reps": 12, "weight": 50 },
        { "setNumber": 3, "reps": 10, "weight": 55 }
      ]
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "workout": {
    "id": "clsk1234567890",
    "userId": "user123",
    "name": "Upper Body Strength Day",
    "notes": "Felt strong today!",
    "date": "2024-02-11T10:00:00.000Z",
    "duration": 60,
    "type": "SELF_LOGGED",
    "status": "COMPLETED",
    "focusType": "STRENGTH",
    "xpAwarded": 85,
    "createdAt": "2024-02-11T14:30:00.000Z",
    "updatedAt": "2024-02-11T14:30:00.000Z",
    "exercises": [
      {
        "id": "clskex123456",
        "workoutId": "clsk1234567890",
        "name": "Bench Press",
        "category": "STRENGTH",
        "order": 0,
        "sets": [
          { "id": "clsks1", "setNumber": 1, "reps": 10, "weight": 135, "rpe": 7, "completed": true, ... },
          ...
        ]
      },
      ...
    ]
  },
  "xpAwarded": 85,
  "message": "Workout created successfully"
}
```

#### RPG Integration
- Automatically awards XP (75 for SELF_LOGGED, 100 for COACHED)
- +10 XP bonus for focus type
- +5 XP per completed exercise
- Updates character stats based on `focusType`:
  - `STRENGTH`: +1 Strength
  - `CARDIO`: +1 Endurance  
  - `BALANCED`: +1 Strength, +1 Endurance
- Tracks workout streaks
- Logs XP transaction

---

### 2. GET /api/workouts
Get paginated workout history for the authenticated user.

#### Query Parameters
| Param | Type | Description |
|-------|------|-------------|
| `limit` | number | Max items per page (1-100, default: 20) |
| `offset` | number | Pagination offset (default: 0) |
| `status` | string | Filter by status: PLANNED, IN_PROGRESS, COMPLETED, CANCELLED |
| `focusType` | string | Filter by focus: STRENGTH, CARDIO, BALANCED |
| `startDate` | ISO date | Filter workouts on or after this date |
| `endDate` | ISO date | Filter workouts on or before this date |
| `orderBy` | string | Sort field: "date" or "createdAt" (default: date) |
| `order` | string | Sort direction: "asc" or "desc" (default: desc) |

#### Example Request
```
GET /api/workouts?limit=10&offset=0&focusType=STRENGTH&startDate=2024-02-01T00:00:00Z
```

#### Response (200 OK)
```json
{
  "workouts": [
    {
      "id": "clsk1234567890",
      "userId": "user123",
      "name": "Upper Body Strength Day",
      "notes": "Felt strong today!",
      "date": "2024-02-11T10:00:00.000Z",
      "duration": 60,
      "type": "SELF_LOGGED",
      "status": "COMPLETED",
      "focusType": "STRENGTH",
      "xpAwarded": 85,
      "createdAt": "2024-02-11T14:30:00.000Z",
      "updatedAt": "2024-02-11T14:30:00.000Z",
      "exercises": [...]
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### 3. GET /api/workouts/:id
Get a specific workout by ID.

#### Path Parameters
| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Workout ID (CUID) |

#### Response (200 OK)
```json
{
  "workout": {
    "id": "clsk1234567890",
    "userId": "user123",
    "name": "Upper Body Strength Day",
    "notes": "Felt strong today!",
    "date": "2024-02-11T10:00:00.000Z",
    "duration": 60,
    "type": "SELF_LOGGED",
    "status": "COMPLETED",
    "focusType": "STRENGTH",
    "xpAwarded": 85,
    "createdAt": "2024-02-11T14:30:00.000Z",
    "updatedAt": "2024-02-11T14:30:00.000Z",
    "exercises": [
      {
        "id": "clskex123456",
        "workoutId": "clsk1234567890",
        "name": "Bench Press",
        "category": "STRENGTH",
        "duration": null,
        "distance": null,
        "distanceUnit": null,
        "notes": null,
        "order": 0,
        "createdAt": "2024-02-11T14:30:00.000Z",
        "updatedAt": "2024-02-11T14:30:00.000Z",
        "sets": [
          {
            "id": "clsks1",
            "exerciseId": "clskex123456",
            "setNumber": 1,
            "reps": 10,
            "weight": 135,
            "weightUnit": "lbs",
            "duration": null,
            "distance": null,
            "completed": true,
            "rpe": 7,
            "notes": null,
            "createdAt": "2024-02-11T14:30:00.000Z",
            "updatedAt": "2024-02-11T14:30:00.000Z"
          }
        ]
      }
    ]
  }
}
```

#### Error Responses
| Status | Description |
|--------|-------------|
| 401 | Unauthorized - Not logged in |
| 403 | Forbidden - Workout belongs to another user |
| 404 | Not Found - Workout ID doesn't exist |

---

### 4. PUT /api/workouts/:id
Update an existing workout. All fields are optional - only provided fields will be updated.

#### Path Parameters
| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Workout ID (CUID) |

#### Request Body
Same as POST, but all fields optional. If `exercises` is provided, all existing exercises and sets will be replaced.

#### Example Request
```json
{
  "name": "Updated Workout Name",
  "notes": "Updated notes",
  "status": "COMPLETED",
  "exercises": [
    {
      "name": "Modified Exercise",
      "category": "STRENGTH",
      "order": 0,
      "sets": [
        { "setNumber": 1, "reps": 12, "weight": 135 }
      ]
    }
  ]
}
```

#### Response (200 OK)
```json
{
  "workout": { ...updated workout object... },
  "message": "Workout updated successfully"
}
```

---

### 5. DELETE /api/workouts/:id
Delete a workout and revert any awarded XP.

#### Path Parameters
| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Workout ID (CUID) |

#### Response (200 OK)
```json
{
  "message": "Workout deleted successfully",
  "xpReverted": 85
}
```

#### RPG Integration
- Reverts XP from character total
- Adjusts level if necessary
- Logs XP removal in XP log
- Exercises and sets are cascade deleted

---

## Error Responses

All errors follow this format:

```json
{
  "error": "ErrorType",
  "message": "Human-readable description",
  "details?": { ...validation errors... }
}
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Not authorized for this resource |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server error |

### Validation Errors
When validation fails (400), the response includes detailed field errors:

```json
{
  "error": "Bad Request",
  "message": "Invalid workout data",
  "details": {
    "fieldErrors": {
      "name": ["Required"],
      "exercises": ["At least one exercise is required"]
    },
    "formErrors": []
  }
}
```

---

## Data Models

### Workout
| Field | Type | Description |
|-------|------|-------------|
| id | string | CUID primary key |
| userId | string | Owner's user ID |
| name | string | Workout name |
| notes | string? | Optional notes |
| date | DateTime | When performed |
| duration | int? | Duration in minutes |
| type | WorkoutType | COACHED or SELF_LOGGED |
| status | WorkoutStatus | PLANNED, IN_PROGRESS, COMPLETED, CANCELLED |
| focusType | FocusType? | STRENGTH, CARDIO, or BALANCED |
| xpAwarded | int | XP earned for this workout |
| exercises | Exercise[] | Nested exercises |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Exercise
| Field | Type | Description |
|-------|------|-------------|
| id | string | CUID primary key |
| workoutId | string | Parent workout ID |
| name | string | Exercise name |
| category | ExerciseCategory | Type of exercise |
| duration | int? | Minutes (for cardio) |
| distance | float? | Distance value |
| distanceUnit | string? | km, miles, or meters |
| notes | string? | Exercise notes |
| order | int | Display order |
| sets | Set[] | Nested sets |

### Set
| Field | Type | Description |
|-------|------|-------------|
| id | string | CUID primary key |
| exerciseId | string | Parent exercise ID |
| setNumber | int | Which set (1-indexed) |
| reps | int? | Repetitions |
| weight | float? | Weight used |
| weightUnit | string | lbs, kg, or bodyweight |
| duration | int? | Seconds (for timed exercises) |
| distance | float? | Distance |
| completed | boolean | Whether set was completed |
| rpe | int? | Rate of Perceived Exertion (1-10) |
| notes | string? | Set notes |

---

## TypeScript Types

```typescript
// lib/validations/workout.ts
export type SetInput = {
  setNumber: number
  reps?: number
  weight?: number
  weightUnit?: 'lbs' | 'kg' | 'bodyweight'
  duration?: number
  distance?: number
  completed?: boolean
  rpe?: number
  notes?: string
}

export type ExerciseInput = {
  name: string
  category: 'STRENGTH' | 'CARDIO' | 'FLEXIBILITY' | 'BALANCE' | 'SPORT' | 'OTHER'
  duration?: number
  distance?: number
  distanceUnit?: 'km' | 'miles' | 'meters'
  notes?: string
  order?: number
  sets: SetInput[]
}

export type CreateWorkoutInput = {
  name: string
  notes?: string
  date: string | Date
  duration?: number
  type?: 'COACHED' | 'SELF_LOGGED'
  status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  focusType?: 'STRENGTH' | 'CARDIO' | 'BALANCED'
  exercises: ExerciseInput[]
}

export type UpdateWorkoutInput = Partial<CreateWorkoutInput>
```

---

## Usage Examples

### Create a Cardio Workout
```bash
curl -X POST /api/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Run",
    "date": "2024-02-11T07:00:00Z",
    "duration": 30,
    "focusType": "CARDIO",
    "exercises": [{
      "name": "Outdoor Running",
      "category": "CARDIO",
      "duration": 30,
      "distance": 5,
      "distanceUnit": "km",
      "sets": []
    }]
  }'
```

### List Recent Workouts
```bash
curl "/api/workouts?limit=5&orderBy=date&order=desc"
```

### Update Workout Status
```bash
curl -X PUT /api/workouts/abc123 \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}'
```

### Delete Workout
```bash
curl -X DELETE /api/workouts/abc123
```
