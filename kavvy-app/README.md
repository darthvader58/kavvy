# Kavvy - LinkedIn for Authors & Publishers

A professional networking platform connecting authors with publishers, featuring smart matching, manuscript management, and community features.

## 🚀 Features

- **Author Profiles**: Showcase your work, genres, and publishing history
- **Publisher Directory**: Browse and filter publishers by genre, requirements, and more
- **Smart Matching**: AI-powered recommendations to find the perfect publisher fit
- **Manuscript Writer**: Built-in tools for managing your manuscripts
- **Social Feed**: Connect with other authors and share your journey
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

## 📦 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for fast development
- CSS Variables for theming (light/dark mode)
- Google OAuth for authentication

### Backend
- Node.js + Express
- MongoDB with Mongoose ODM
- RESTful API architecture
- Vercel Serverless Functions

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Frontend Setup

```bash
cd kavvy-app
npm install
npm run dev
```

The app will run on `http://localhost:5173`

### Backend Setup

```bash
cd kavvy-app/server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI

# Seed publishers data
node scripts/seedPublishers.js

# Start server
npm run dev
```

The API will run on `http://localhost:5000`

### Environment Variables

Create `kavvy-app/server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/kavvy
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

For production (Vercel), set `MONGODB_URI` in your Vercel project settings.

## 📁 Project Structure

```
kavvy-app/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── context/           # React context (Auth, Theme)
│   ├── data/              # Mock data
│   ├── types/             # TypeScript types
│   └── App.tsx            # Main app component
├── server/                # Backend API
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   └── server.js          # Express server
├── api/                   # Vercel serverless functions
└── public/                # Static assets
```

## 🌐 API Endpoints

### Waitlist
- `POST /api/waitlist` - Join waitlist
- `GET /api/waitlist/count` - Get waitlist count

### Authors
- `GET /api/authors` - Get all authors
- `GET /api/authors/:id` - Get author by ID
- `POST /api/authors` - Create/update author
- `PATCH /api/authors/:id` - Update author
- `DELETE /api/authors/:id` - Delete author

### Publishers
- `GET /api/publishers` - Get all publishers (with filters)
- `GET /api/publishers/:id` - Get publisher by ID
- `POST /api/publishers` - Create publisher
- `PATCH /api/publishers/:id` - Update publisher
- `DELETE /api/publishers/:id` - Delete publisher

## 🎨 Responsive Design

The app is fully responsive with breakpoints:
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px
- Small Mobile: < 480px

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `MONGODB_URI`
4. Deploy!

The app will be available at:
- Main app: `kavvy.vercel.app`
- Waitlist: `kavvy.vercel.app/waitlist`

### Custom Domain

Configure in Vercel:
- `publishatkavvy.com` → main app
- `publishatkavvy.com/waitlist` → waitlist page

## 📊 Data

Publisher data is sourced from `phase1/all_data/publishers_full_data.csv` and includes:
- 500+ publishers
- Genre and subject classifications
- Submission requirements
- Agent requirements
- Open call status

## 🔐 Authentication

Currently using Google OAuth for demo purposes. In production, you'll want to:
1. Set up Google OAuth credentials
2. Configure callback URLs
3. Implement proper session management

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.
