# AthleteOS - Smart Fitness & Training Management Platform

AthleteOS is a full-stack fitness and sports training management platform built with Next.js, MongoDB and Tailwind CSS.

The application has two main areas:

- Admin Dashboard
- Client Dashboard

---

## Features

### Admin Features

- Admin authentication
- Protected admin dashboard
- Clients overview
- Search and filter clients
- View client details
- View client metrics history
- View client progress charts
- View client progress photos
- Download client report
- Manage athletes
- Manage teams
- Manage sessions
- Planning calendar with drag and drop
- Statistics dashboard

### Client Features

- Client authentication
- Protected client dashboard
- Personal profile management
- Save profile data to MongoDB
- Weight and height tracking
- BMI calculation
- Calories recommendation
- Goal management
- Activity level management
- Global progress tracking
- Weight progress chart
- Calories chart
- History table
- Progress photos upload
- Progress photos saved in MongoDB
- Goal-based photo rating
- Smart diet recommendations
- Smart workout recommendations
- Download personal report
- Responsive mobile design
- Toast notifications
- Clean logout system

---

## Smart Fitness Logic

AthleteOS calculates:

- BMI from weight and height
- Physical condition based on BMI
- Daily calories based on activity level and goal
- Goal-based recommendations
- Progress percentage from start weight to goal weight
- Photo progress score based on user goal and saved metrics

---

## Tech Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Recharts
- React Hot Toast

### Backend

- Next.js API Routes
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt password hashing

---

## Main Project Structure

```txt
app/
  api/
    admin/
      clients/
    auth/
      login/
      register/
    client/
      metrics/
      photos/
      profile/
    athletes/
    sessions/
    teams/

  client/
    page.tsx

  dashboard/
    clients/
    athletes/
    sessions/
    stats/
    teams/
    planning/

  components/
    dashboard/
      ClientNav.tsx
      ClientSummary.tsx
      ProfileCard.tsx
      StatsGrid.tsx
      ProgressCard.tsx
      ChartsSection.tsx
      RecommendationCards.tsx
      QuickActions.tsx
      HistoryTable.tsx
      ProgressPhotos.tsx
      SkeletonCard.tsx

models/
  index.ts

lib/
  mongoose.ts
  auth.ts
```

---

## Authentication and Roles

AthleteOS uses role-based access control.

### Admin

Admins can access:

```txt
/dashboard
/dashboard/clients
/dashboard/athletes
/dashboard/sessions
/dashboard/stats
/dashboard/teams
/dashboard/planning
```

### Client

Clients can access:

```txt
/client
```

---

## Demo Accounts

These accounts are for local testing only.

### Admin Account

```txt
Email: admin@gmail.com
Password: 123456
```

### Client Account

```txt
Email: client@gmail.com
Password: 123456
```

---

## Environment Variables

Create a `.env.local` file in the project root.

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key_optional
```

Important: never push `.env.local` to GitHub.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/rifeyy/sports-training-tracker.git
```

Go to the project folder:

```bash
cd sports-training-tracker
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```txt
http://localhost:3000
```

---

## Testing Flow

### Admin Flow

1. Go to `/login`
2. Login with admin account
3. Redirect to `/dashboard`
4. Open Clients page
5. View client details
6. Download client report

### Client Flow

1. Go to `/login`
2. Login with client account
3. Redirect to `/client`
4. Update profile
5. Save metrics
6. Upload progress photos
7. View charts and history
8. Download personal report

---

## Screenshots

Add screenshots here:

```txt
/client dashboard screenshot
/dashboard screenshot
/dashboard/clients screenshot
/dashboard/clients/[id] screenshot
```

---

## Future Improvements

- Save progress photos in cloud storage
- Add PDF report generation
- Add real AI coach chat
- Add admin notifications
- Add client appointments
- Add payment/pricing system
- Add Vercel deployment
- Add advanced analytics
- Add monthly progress reports

---

## Author

Built by Mohamed Arham.

---

## License

This project is for educational and portfolio purposes.
