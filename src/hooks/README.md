# Custom Hooks

This directory contains all custom React hooks organized by functionality.

## Structure

```
src/hooks/
├── data/           # Data management hooks
│   ├── useProblems.ts
│   ├── useProblemsData.ts
│   └── index.ts
├── ui/             # UI-related hooks
│   ├── useGlobalLoading.ts
│   └── index.ts
├── utils/          # Utility hooks
│   ├── usePagination.ts
│   ├── useFilters.ts
│   ├── useSorting.ts
│   └── index.ts
├── useAuth.ts      # Authentication hook
├── index.ts        # Main export file
└── README.md       # This file
```

## Usage

### Data Hooks

#### `useProblemsData()`
A comprehensive hook that combines data fetching, pagination, filtering, and sorting for problems.

```tsx
import { useProblemsData } from '../hooks';

function ProblemsPage() {
  const {
    state: { items, totalCount, error, loading },
    filters,
    pagination,
    sorting,
  } = useProblemsData();

  return (
    // Your component JSX
  );
}
```

#### `useProblems()`
A simpler hook for basic problems data management.

### Utility Hooks

#### `usePagination()`
Handles pagination logic with state and actions.

```tsx
const pagination = usePagination({
  initialPage: 1,
  initialLimit: 20,
  totalCount: 100,
});

// Access state
const { page, limit, totalPages, hasNextPage } = pagination.state;

// Use actions
pagination.actions.goToNextPage();
pagination.actions.setLimit(50);
```

#### `useFilters()`
Manages filtering state for search, difficulty, status, etc.

```tsx
const filters = useFilters({
  onFilterChange: () => console.log('Filters changed'),
});

// Access state
const { search, difficulty, status } = filters.state;

// Use actions
filters.actions.setSearch('react');
filters.actions.clearFilters();
```

#### `useSorting()`
Handles sorting logic for table columns.

```tsx
const sorting = useSorting({
  initialSortBy: 'problemNumber',
  initialSortOrder: 'asc',
});

// Access state
const { sortBy, sortOrder } = sorting.state;

// Use actions
sorting.actions.handleSort('title');
```

### UI Hooks

#### `useGlobalLoading()`
Manages global loading state across the application.

```tsx
const { showLoading, hideLoading } = useGlobalLoading();

// Show loading
showLoading('Loading problems...');

// Hide loading
hideLoading();
```

## Best Practices

1. **Separation of Concerns**: Each hook has a single responsibility
2. **Reusability**: Hooks are designed to be reusable across components
3. **Type Safety**: All hooks are fully typed with TypeScript
4. **Performance**: Hooks use `useCallback` and `useMemo` where appropriate
5. **Clean API**: Hooks expose a clear state/actions interface

## Adding New Hooks

1. Place the hook in the appropriate subdirectory (`data/`, `ui/`, or `utils/`)
2. Export it from the subdirectory's `index.ts`
3. The main `index.ts` will automatically re-export it
4. Update this README with documentation
