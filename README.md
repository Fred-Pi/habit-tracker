# Habit Tracker

A clean, product-focused habit tracking app built with React, TypeScript, and TailwindCSS.

## Features

- **Daily Check-ins**: Quick and easy habit tracking
- **Smart Statistics**: Track streaks, completion rates, and progress
- **Visual Charts**: Weekly progress bars and 30-day heat maps
- **Dark Mode by Default**: Beautiful dark theme with toggle to light mode
- **Keyboard Shortcuts**: Navigate and toggle habits quickly with keyboard shortcuts (press `?` to see all)
- **Undo Actions**: Instant undo for habit toggles with toast notifications
- **Data Export/Import**: Backup and restore your data with JSON export/import
- **Clean UX**: Mobile-first design with intuitive navigation
- **Offline-first**: All data stored locally using localStorage

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **TailwindCSS** for utility-first styling
- **Recharts** for data visualization
- **localStorage** for data persistence

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── habits/        # Habit management
│   ├── entries/       # Daily check-ins
│   └── stats/         # Statistics and charts
├── shared/            # Shared utilities and components
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   └── utils/         # Utility functions
├── views/             # Top-level views
└── types/             # TypeScript type definitions
```

## Architecture Decisions

### Data Structure

- **Date-keyed entries**: Fast lookups for daily check-ins
- **Habit archiving**: Soft deletes preserve history
- **Computed statistics**: Never store what you can derive
- **localStorage**: Simple, no backend needed for v1

### Performance

- **Memoization**: Statistics cached with 1-minute TTL
- **Lazy computation**: Stats calculated only when needed
- **Efficient queries**: Date-based indexing for fast access

### Code Quality

- **Feature-based folders**: Related code stays together
- **Thin components**: Logic in hooks, presentation in components
- **Type safety**: Full TypeScript coverage
- **Separation of concerns**: Services for complex logic

### Theme System

- **Dark mode by default**: Loads in dark mode for better eye comfort
- **Persistent preference**: Theme choice saved to localStorage
- **Class-based strategy**: Tailwind's dark mode with React Context
- **Design tokens**: HABIT_COLORS include both light and dark variants
- **No flash**: Inline script applies theme before page renders
- **Optimized readability**: High-contrast text ensures readability in both light and dark modes

### User Experience

- **Keyboard shortcuts**: Press `n` to create new habit, `1-9` to toggle habits, `?` for help
- **Undo functionality**: 5-second undo window for habit toggles with visual feedback
- **Data portability**: Export all data as timestamped JSON, import with validation and confirmation
- **Toast notifications**: Non-intrusive feedback for actions and exports

## Future Enhancements

- Custom habit scheduling (specific weekdays)
- Habit notes and reflections
- Achievement badges
- PWA capabilities
- Cloud sync (optional)
- Search and filter habits
- Analytics dashboard with insights

## License

MIT
