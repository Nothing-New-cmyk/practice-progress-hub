
# DSA Progress Tracker

A comprehensive web application for tracking your Data Structures and Algorithms (DSA) practice progress, built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### 📊 **Progress Tracking**
- **Daily Logs**: Record practice sessions with topics, platforms, difficulty levels, time spent, and notes
- **Contest Logs**: Track contest participation, rankings, and performance
- **Weekly Goals**: Set and monitor weekly objectives with progress tracking

### 🎯 **Dashboard Analytics**
- Weekly summary cards (problems solved, hours practiced, current streak, badges earned)
- Visual progress tracking (heatmap calendar and charts - coming soon)
- Goal progress overview

### 🎮 **Gamification**
- Badge system with 10+ achievement types
- Streak tracking for consistent practice
- Progress milestones and rewards

### ⚙️ **User Management**
- Secure authentication with email/password
- User profiles with timezone support
- Notification preferences (email/WhatsApp)
- Password reset functionality

### 🎨 **User Experience**
- Responsive design for desktop and mobile
- Zen mode for distraction-free logging
- Markdown support for notes
- Form validation and error handling

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router
- **Icons**: Lucide React

## Database Schema

### Core Tables
- `profiles` - Extended user information
- `daily_logs` - Daily practice session records
- `contest_logs` - Contest participation tracking
- `weekly_goals` - Goal setting and progress
- `badges` & `user_badges` - Gamification system
- `notifications` - Notification scheduling
- `notification_preferences` - User notification settings

### Security
- Row-Level Security (RLS) policies ensure users only access their own data
- Role-based access control with admin/user roles
- Automatic profile creation on user signup

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dsatracker-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   The Supabase configuration is already integrated in this Lovable project. The following environment variables are automatically configured:
   
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

   If deploying elsewhere, create a `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Configure Supabase Authentication**
   
   In your Supabase dashboard:
   - Go to Authentication > Settings
   - Set Site URL to your application URL
   - Add your domain to Redirect URLs
   - Configure email templates if needed

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

### Database Setup

The database schema has been automatically applied to your connected Supabase project, including:

- All required tables and relationships
- Row-Level Security policies
- Triggers for automatic profile creation
- Default badges and constraints
- Performance indexes

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables
4. Set up redirects for SPA routing

### Other Platforms
The app can be deployed to any static hosting service that supports SPAs.

## Usage Guide

### Getting Started
1. **Sign Up**: Create an account with email/password
2. **Complete Profile**: Add your name and timezone in Settings
3. **Log First Session**: Record your first practice session in Daily Log
4. **Set Goals**: Create weekly goals to stay motivated
5. **Track Progress**: Monitor your progress on the Dashboard

### Daily Workflow
1. **Morning**: Check Dashboard for weekly progress
2. **Practice**: Work on DSA problems
3. **Log Session**: Record your practice in Daily Log
4. **Review**: Use Zen mode for distraction-free logging

### Weekly Workflow
1. **Monday**: Set weekly goals
2. **Daily**: Log practice sessions
3. **Friday**: Review goal progress
4. **Sunday**: Analyze weekly summary and plan ahead

## Next Steps & Roadmap

### Phase 1: Enhanced Analytics
- [ ] Implement Recharts for data visualization
- [ ] Add calendar heatmap with `react-calendar-heatmap`
- [ ] Difficulty distribution charts
- [ ] Time-based analytics

### Phase 2: Smart Features
- [ ] Auto-tagging Edge Function for problem URL parsing
- [ ] LeetCode/Codeforces API integration
- [ ] Problem recommendation system
- [ ] Streak calculation improvements

### Phase 3: Notifications & Automation
- [ ] Email notification system (Resend integration)
- [ ] WhatsApp notifications
- [ ] CRON jobs for reminders
- [ ] Weekly/monthly progress reports

### Phase 4: Social Features
- [ ] Public profiles and sharing
- [ ] Leaderboards and competitions
- [ ] Study groups and collaboration
- [ ] Problem discussions

### Phase 5: Advanced Analytics
- [ ] Machine learning insights
- [ ] Weakness identification
- [ ] Personalized study plans
- [ ] Performance predictions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## Support

For questions, issues, or feature requests:
1. Check the GitHub Issues page
2. Create a new issue with detailed description
3. Contact the development team

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Coding! 🚀**

Start your DSA journey today and track your progress towards your programming goals.
