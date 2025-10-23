# Contest Management Components

This directory contains reusable components for managing contests in the admin interface.

## Components

### ActiveContestCard
Displays information about currently active contests including:
- Contest title and description
- Time remaining
- Participant statistics
- Problem list
- Top performers
- Action buttons

### UpcomingContestCard
Shows upcoming contests with:
- Contest details
- Start time countdown
- Registration status
- Problem count and rewards

### PastContestList
Lists past contests with:
- Contest selection
- Search functionality
- Pagination support
- Contest statistics

### ContestDetailView
Comprehensive view of contest details including:
- Contest header and timeline
- Statistics and participants
- Problems list
- Top performers
- Contest rules
- Coin rewards

## Usage

```tsx
import { 
  ActiveContestCard, 
  UpcomingContestCard, 
  PastContestList, 
  ContestDetailView 
} from '../components/admin/contests';

// Use with the useContest hook
const { state, actions } = useContest();
```

## API Integration

The components work with the `useContest` hook which handles:
- Fetching active contests from `/api/contests/active`
- Fetching upcoming contests from `/api/contests/upcoming`
- Fetching past contests from `/api/contests/past`
- State management and error handling
- Pagination and filtering

## Features

- **Responsive Design**: Works on desktop and mobile
- **Dark Mode Support**: Full dark mode compatibility
- **Loading States**: Proper loading indicators
- **Error Handling**: Graceful error display
- **Search & Filter**: Search past contests
- **Pagination**: Handle large lists of past contests
- **Real-time Updates**: Shows current contest status
