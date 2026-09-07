# AI Family Tree

Mobile-first genealogy app starter.

## Stack
- Mobile: Expo + React Native + TypeScript
- Backend: Node.js + Express + TypeScript
- AI: provider interface with a safe mock researcher for the MVP
- Data model: family graph concepts designed for PostgreSQL later

## Project structure

- `apps/mobile` — iOS/Android Expo app
- `apps/api` — Node/Express API
- `packages/shared` — shared TypeScript types

## Run

### Mobile
```bash
cd apps/mobile
npm install
npx expo start
```

### API
```bash
cd apps/api
npm install
npm run dev
```

The first vertical slice is:
Create/seed a family tree → view people → open a person → request AI ancestor suggestions → review evidence/confidence.

## Important
The research endpoint currently returns clearly-labelled mock findings. Do not treat mock findings as real genealogy evidence. Connect verified genealogy sources before enabling real-world ancestor discovery.
