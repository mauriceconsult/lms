InstaSkul
InstaSkul is a next-generation Learning Management System (LMS) designed to empower communities by transforming knowledge and skills into social and economic opportunities. Built with modern web technologies, InstaSkul fosters a collaborative ecosystem where educators and learners connect, share, and monetize expertise through IT consulting and training.
Features

Dynamic Course Management: Create and manage digital courses with videos, assignments, and interactive content.
Secure Authentication: Powered by Clerk for seamless and secure user login.
Multimedia Support: Engage learners with rich media, including videos and interactive assignments.
Monetization: Integrated payment gateways (MTN MoMo, Stripe planned) for course sales.
Responsive Design: Built with React, Next.js 15, TypeScript, and Tailwind CSS for cross-device compatibility.
Database: Prisma ORM with PostgreSQL/MySQL for robust data management.

Tech Stack

Frontend: React, Next.js 15, TypeScript, JavaScript
Authentication: Clerk
Styling: Tailwind CSS
Database: Prisma ORM with PostgreSQL/MySQL
Payment: MTN MoMo, Stripe (planned)
Deployment: Vercel

Getting Started

Clone the Repository:
git clone https://github.com/your-org/instaskul.git
cd instaskul


Install Dependencies:
npm install


Set Up Environment Variables: Create a .env.local file:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MOMO_PRIMARY_KEY=your_momo_primary_key
MOMO_API_KEY=your_momo_api_key
MOMO_API_USER=your_momo_api_user
MOMO_TARGET_ENVIRONMENT=sandbox
DATABASE_URL=your_database_url


Run the Development Server:
npm run dev

Open http://localhost:3000.

Build for Production:
npm run build
npm start



Closed Beta Testing
We’re in a closed beta phase, seeking developers, educators, and learners to test InstaSkul. Beta testers get early access and help shape the platform.

How to Join: Email beta@instaskul.com with your name, role (e.g., developer, educator), and why you’re interested.
Note: Beta access is invite-only, despite the public repository.

License and Copyright
InstaSkul is licensed under the MIT License. See the LICENSE file for details.
Copyright © 2025 InstaSkul. All rights reserved. The source code, documentation, and original content (including but not limited to course materials, images, and videos) are the intellectual property of InstaSkul and its contributors. Use is governed by the MIT License, except where specified in the Terms of Service for user-generated content.
Contributing
We welcome contributions! To get started:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.

See Contributing Guidelines and Code of Conduct.
Documentation
Detailed docs are in the /docs folder or at docs.instaskul.com.
Contact

Support: support@instaskul.com
Beta Testing: beta@instaskul.com
GitHub Issues: Report bugs or suggest features

## Why MIT License?
- **For Founders**: Retain copyright while enabling community contributions and commercialization.
- **For Contributors**: Freely use, modify, and build upon InstaSkul’s code for personal or commercial projects.