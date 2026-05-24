# FinUp Architecture

## Product Modules

- Dashboard: balance, revenue, expenses, savings, evolution chart, spending categories, upcoming bills and goal progress.
- Transactions: income and expense feed with filters by date, category and type.
- Budget: monthly limits by category, progress bars, card limits and recurring subscriptions.
- Goals: objective value, saved value, deadline and progress.
- Reports: monthly charts, month-over-month comparison and automatic insights.
- Profile: personal data, preferences, theme, privacy and security.

## Current Offline Persistence

The current mobile app stores data locally with `@react-native-async-storage/async-storage` under a versioned FinUp key. It persists transactions, budgets, goals, cards, subscriptions and preferences on the device, so information remains available after closing and reopening the app.

The local store lives in `src/store/FinanceStore.tsx`. It hydrates on startup, writes changes automatically and exposes actions such as `addTransaction`, `deleteTransaction`, `addGoal`, `addGoalDeposit`, `updateBudgetLimit`, `addCard`, `deleteCard`, `addSubscription`, `deleteSubscription`, `toggleDarkMode`, `completeOnboarding` and `resetLocalData`.

## API Blueprint

Recommended base path: `/api/v1`.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/auth/login` | Login with JWT |
| `POST` | `/auth/refresh` | Refresh access token |
| `GET` | `/dashboard/summary` | Dashboard totals and insights |
| `GET` | `/transactions` | Filtered transactions |
| `POST` | `/transactions` | Create income or expense |
| `GET` | `/budgets` | Category budgets |
| `PATCH` | `/budgets/:id` | Update budget limit |
| `GET` | `/goals` | Financial goals |
| `POST` | `/goals` | Create goal |
| `GET` | `/cards` | Credit cards and invoices |
| `GET` | `/reports/monthly` | Monthly reports |

## PostgreSQL Entities

- users: profile, email, password hash, preferences.
- accounts: current balance and institution metadata.
- categories: name, color, icon, type.
- transactions: amount, type, category, date, recurring flag.
- budgets: category limit, month, spent amount.
- goals: name, target amount, current amount, deadline.
- cards: brand, last digits, total limit, used limit, due date.
- subscriptions: merchant, amount, next due date, category.

## Security

- Store passwords with Argon2 or bcrypt.
- Use short-lived JWT access tokens and refresh token rotation.
- Encrypt sensitive account/card metadata at rest.
- Apply per-user row ownership checks on every query.
- Add audit logs for account, card and transaction changes.
