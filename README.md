# Todo App (React Native + Expo)

A simple todo app built with React Native and Expo. It was built to set up a mobile development environment and learn React Native basics.

## Features

- Add tasks (with the button or the keyboard's return key)
- Tap a task to mark it done or not done
- Delete tasks
- Remaining task count
- Empty state when there are no tasks
- Safe-area and keyboard handling for phones

## Tech Stack

- React Native
- Expo (SDK 57, blank template)
- `react-native-safe-area-context`
- State managed with `useState`

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- The [Expo Go](https://expo.dev/go) app on your Android or iOS phone

### Run locally

```bash
git clone https://github.com/TaniyaNagar/todo-app.git
cd todo-app
npm install
npx expo start
```

Scan the QR code with Expo Go. Your phone and laptop must be on the same Wi-Fi network.

If the phone can't connect, use tunnel mode:

```bash
npx expo start --tunnel
```

## Project Structure

```
todo-app/
├── App.js          # App UI and logic (TodoInput, TodoItem, EmptyState, TodoScreen)
├── app.json        # Expo config
├── assets/         # Icons and splash images
└── package.json
```
