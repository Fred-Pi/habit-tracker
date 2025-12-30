# Habit Tracker

A clean, product-focused habit tracking app built with React, TypeScript, and TailwindCSS.

## Features

- **Daily Check-ins**: Quick and easy habit tracking
- **Smart Statistics**: Track streaks, completion rates, and progress
- **Visual Charts**: Weekly progress bars and 30-day heat maps
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

## Future Enhancements

- Export/import data (JSON)
- Custom habit scheduling (specific weekdays)
- Habit notes and reflections
- Achievement badges
- Dark mode
- PWA capabilities
- Cloud sync (optional)

## License

MIT
