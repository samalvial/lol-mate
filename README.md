# 🛡️ RiftCoach AI — League of Legends Live Companion & Coach

A security-first, high-performance web application designed with an **Apple-inspired ultra-sleek aesthetic** for iPhone 16 Pro Max and Desktop (Windows & macOS). Features linked Riot Games account analytics, real-time **Gemini AI match coaching**, dynamic jungle/item route optimization, **Zero-Trust AES-256-GCM data encryption**, and ad monetization placement architecture.

---

## ✨ Features Overview

### 1. 🔐 Zero-Trust Security Vault (AES-256-GCM)
- Client-side WebCrypto encryption using `AES-GCM 256-bit` with `PBKDF2` key derivation (100,000 iterations).
- Encrypts your Riot API keys, Gemini API keys, and personal user data directly in-browser using a passcode PIN.
- Zero plain-text key storage. Data is purged from memory upon locking.

### 2. ⚡ Real-Time Live Match Coach (Gemini AI Engine)
- **10-Player Matchup Matrix**: Compares ally vs enemy team comps, rank tiers, summoner spells, and keystones.
- **Situational Build Engine**: Dynamic itemization tree recommendations (Starter, Core, Situational vs enemy AP/AD/CC/Heal) powered by Gemini AI.
- **Interactive Jungle Clear Route**: Step-by-step timings, camp names, Smite priorities, and Crab timers.
- **Power Spikes & Trade Windows**: Level 2, Level 6, and item spike warnings.
- **Ask Gemini Coach Chat**: Real-time chat assistant answering custom tactical questions.

### 3. 👤 Riot Games Profile & Match Analytics
- Link any Riot ID (`gameName#tagLine` e.g. `Faker#KR1` or `Sebam#LoL`).
- View SoloQ & Flex rank badges, winrates, top champion masteries, and detailed match history.

### 4. 🍏 Apple Cupertino UI/UX & Cross-Platform Responsiveness
- Glassmorphism design (`backdrop-filter: blur(20px)`), glowing Hextech Gold and Electric Cyan accents.
- Dynamic Island status widget for iPhone 16 Pro Max and iOS/Android viewports.

### 5. 💰 Monetization & Public Hosting Readiness
- Ad placement banners (Carbon Ads / AdSense integration ready).
- Pro mode switch (Simulating Pro subscription: Ad-free experience + Unlimited Gemini AI queries).
- Deployment ready for Vercel, Netlify, and Cloudflare Pages.
- Native mobile build ready (Capacitor / PWA wrapper compatible for iOS App Store and Google Play Store).

---

## 🚀 Getting Started Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` on your PC, or open using your iPhone 16 Pro Max on your local network.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🐙 Syncing with GitHub

Initialize your git repository and push your changes to GitHub:

```bash
git init
git add .
git commit -m "Initial commit - RiftCoach AI Web Companion"
git remote add origin https://github.com/tu-usuario/riftcoach-ai.git
git branch -M main
git push -u origin main
```

Or run the included batch script:
```cmd
scripts\github-sync.cmd
```
