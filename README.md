# Currency Converter ⚡💱
### Ultra-Lightweight & Highly Responsive React Native Currency Converter
**Developer**: Areeb Ahmed

Currency Converter is an ultra-fast, modern currency converter built with **React Native & Expo**, engineered specifically for **minimum app size**, instant responsiveness, and a clean, distraction-free interface.

---

## ✨ Features & Updates

- **🔄 One-Tap Auto-Reset to USD → INR**:
  - Whenever the reload button (or pull-to-refresh) is clicked, the app automatically switches the conversion pair to **USD to INR** and refreshes the live rates.
- **🚀 Minimal Bundle Footprint**:
  - **Zero heavy asset overhead**: Native system Unicode flag emojis (`🇺🇸`, `🇮🇳`, `🇪🇺`, `🇯🇵`, `🇬🇧`, `🇨🇦` etc.) requiring 0 image bytes.
  - **Zero font bloat**: Pure inline SVG vector paths via `react-native-svg` instead of multi-megabyte icon font files.
  - **Zero heavy UI kits**: Built exclusively with optimized React Native `StyleSheet` without CSS-in-JS runtime overhead.
  - **Hermes Bytecode Engine**: Ahead-of-time bytecode compilation for instant app boot and minimal RAM usage.
  - **Bundle size**: Only **~649 KB** uncompressed JS.
- **⚡ High Responsiveness & Smart Keypad**:
  - Instant $O(1)$ in-memory currency exchange calculations on every keystroke.
  - Built-in custom tactile numeric keypad.
  - **Auto-Hide Keypad on Scroll**: As soon as you scroll down after entering a number, the keypad hides smoothly so you have full view of the screen.
  - Tap the input card or the "Show Keypad" toggle anytime to bring the keypad back up.
- **🎨 Simple, Clean & Attractive UI**:
  - **Adaptive Theme**: One-tap toggle between sleek Dark Mode (Midnight Slate) and Clean Light Mode.
  - **Developer Attribution**: Built by **Areeb Ahmed**.
  - **Dual Hero Conversion Cards**: Send / Receive cards with bold typography, auto-adjusting font size, and live rate pill.
  - **Traveler Cheat Sheet**: Real-time quick denomination matrix ($1, $5, $10, $20, $50, $100) — tap any row to test immediately.
  - **Searchable Currency Picker**: Instant search across 160+ world currencies and cryptocurrencies (BTC, ETH) by code, name, or country.
- **🌐 Offline-First Resilience**:
  - Multi-tier rate resolution: Primary live financial API (`open.er-api.com`), secondary backup (`frankfurter.dev`), local persistent cache (`AsyncStorage`), and bundled offline fallback table.

---

## 📁 Project Structure

```
├── App.js                         # Main application container & state orchestrator
├── app.json                       # App configuration (Currency Converter)
├── package.json                   # Lean dependency manifest
└── src/
    ├── components/
    │   ├── CurrencyCard.js        # Send / Receive conversion card
    │   ├── CurrencyPickerModal.js # Searchable currency modal
    │   ├── Header.js              # Top bar with title, developer info & reload
    │   ├── Icons.js               # Ultra-lightweight SVG vector icons
    │   ├── Keypad.js              # Custom tactile numeric keypad
    │   ├── QuickDenominations.js  # Traveler cheat sheet denomination matrix
    │   └── SwapButton.js          # Animated 180° currency reversal button
    ├── constants/
    │   ├── currencies.js          # Catalog of 160+ world currencies & symbols
    │   ├── fallbackRates.js       # Embedded offline exchange rates
    │   └── theme.js               # Dark & Light design tokens
    ├── services/
    │   ├── api.js                 # Resilient rate fetching with timeout & fallback
    │   └── storage.js             # AsyncStorage persistence for preferences & cache
    └── utils/
        ├── calculations.js        # O(1) exchange formulas & keypad input processing
        └── formatters.js          # Number formatting & decimal precision
```

---

## 🚀 Running the App

```bash
# Start development server & scan QR code with Expo Go (iOS/Android)
npm start

# Run in web browser preview
npm run web

# Run on Android emulator / connected device
npm run android
```
