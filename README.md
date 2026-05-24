# FinUp

FinUp is a premium personal finance mobile prototype built with Expo and React Native. It focuses on fast financial clarity: available balance, monthly spending, goals, budgets, cards, recurring subscriptions, reports and friendly insights.

The app now stores financial information locally on the device with AsyncStorage. Transactions, goals, budget limits, theme preference and onboarding state remain saved after closing or reopening the app.

## Brand

- Name: FinUp
- Slogan: Sua vida financeira no controle.
- Personality: modern, reliable, secure, accessible and intelligent
- Primary palette: `#00C853`, `#0B1F33`, `#123A4A`, `#F5F7FA`, `#D9E2EC`, `#5F6C7B`, `#FFC857`, `#FF4D4D`

## Screens

- Splash screen
- Onboarding
- Dashboard
- Transactions
- Budget and cards
- Goals
- Reports
- Profile

## Functional Local Data

- Add and delete transactions
- Recalculate dashboard, reports and category summaries from saved transactions
- Create financial goals
- Add saved money to goals
- Edit category budget limits
- Add and remove credit cards
- Add and remove recurring subscriptions
- Persist onboarding and theme preference
- Restore initial demo data from the profile screen

## Run

```bash
npm install
npm run web
```

For native preview:

```bash
npm run android
npm run ios
```

## Suggested Production Stack

- Mobile: React Native with Expo
- Persistence: `@react-native-async-storage/async-storage` for device-local data
- Styling: StyleSheet with design tokens, easily portable to NativeWind
- API: Node.js with Express or NestJS
- Database: PostgreSQL
- Auth: JWT with refresh tokens
- Charts: `react-native-svg` in this prototype; Victory Native is a good production upgrade
