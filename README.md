# Habitus
<<<<<<< HEAD

This project aims to gamify the process of tracking daily habits. As opposed to a simple checklist with scheduled reminders, this app translates the user’s real world actions into the development of a digital character within a role-playing-game.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Expo Go](https://expo.dev/go) app installed on your phone (available on both App Store and Google Play)
- A [Supabase](https://supabase.com/) project (for the backend)

## Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd Habitus
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example env file and fill in your Supabase credentials:

   ```bash
   cp .env.example .env
   ```

   Then open `.env` and set:

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up the database**

   Run the SQL migration files in `supabase/migrations/` against your Supabase project (via the Supabase dashboard SQL editor or the Supabase CLI), then run `supabase/seed.sql` to seed initial data.

## Running on Your Phone

### Start the development server

```bash
npm start
```

This launches the Expo development server and displays a QR code in the terminal.

### Android

1. Install **Expo Go** from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
2. Make sure your phone and computer are on the **same Wi-Fi network**.
3. Open the **Expo Go** app and tap **Scan QR Code**, then scan the QR code shown in the terminal.
4. The app will bundle and load on your device.

### iOS

1. Install **Expo Go** from the [App Store](https://apps.apple.com/app/expo-go/id982107779).
2. Make sure your phone and computer are on the **same Wi-Fi network**.
3. Open your **Camera** app and point it at the QR code shown in the terminal. Tap the notification banner that appears to open the app in Expo Go.
4. The app will bundle and load on your device.

### Troubleshooting

- **QR code not working?** Press `s` in the terminal to switch to Expo Go mode, then try scanning again.
- **Connection issues?** If your phone can’t connect to the dev server, press `shift+s` to switch to **Tunnel** mode, which routes traffic through Expo’s servers instead of relying on local network connectivity.
- **Slow bundling?** The first load takes longer as Metro bundles the JavaScript. Subsequent reloads are faster.
=======
This project aims to gamify the process of tracking daily habits. As opposed to a simple checklist with scheduled reminders, this app translates the user’s real world actions into the development of a digital character within a role-playing-game.
>>>>>>> 6aeda35f12ec013fc9056406f2e05465db3bf94c
