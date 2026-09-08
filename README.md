# AI Family Tree MVP

Mobile-first genealogy app built with Expo + React Native + TypeScript.

## Included
- Data-driven family graph
- Add people
- Person profiles
- Ancestor discovery review flow
- Confidence and evidence model
- API placeholder for future research providers

## Run the mobile app

cd apps/mobile
npm install
npx expo start

Then scan the QR code with Expo Go or run on an emulator.

## Run the API

cd apps/api
npm install
npm run dev

The API listens on port 4000 by default.

## Product rule

AI findings are candidates until a person explicitly reviews and accepts them. The app must never silently convert an AI guess into a confirmed family relationship.
