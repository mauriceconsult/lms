Installation
This guide covers setting up InstaSkul locally for development or testing.
Prerequisites

Node.js 18.x or later
npm or yarn
Git
Vercel CLI (npm install -g vercel)
PostgreSQL (for Prisma)
MoMo sandbox credentials
Clerk account
Mux account

Steps

Clone the Repository
git clone https://github.com/your-org/instaskul.git
cd instaskul


Install Dependencies
npm install


Configure EnvironmentCreate a .env.local file in the root:
DATABASE_URL="postgresql://user:password@localhost:5432/instaskul"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MOMO_CALLBACK_HOST=http://localhost:3000
MOMO_COLLECTIONS_USER_SECRET=your_user_secret
MOMO_COLLECTIONS_USER_ID=your_user_id
MOMO_COLLECTIONS_PRIMARY_KEY=your_primary_key
MOMO_TARGET_ENVIRONMENT=sandbox
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret


Set Up Database
npx prisma generate
npx prisma db push


Run Locally
npm run dev

Visit http://localhost:3000.

Deploy to Vercel
vercel

Follow prompts to deploy to Vercel’s Pro plan.


Next Steps

Developer Setup
Educator Guide
Learner Guide
