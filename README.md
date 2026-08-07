# 🎬 CineMatch - Smart Movie & Series Recommendation Engine

<p align="center">
  <img src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1280&auto=format&fit=crop&q=80" alt="CineMatch Banner" width="100%" style="border-radius: 12px;" />
</p>

<p align="center">
  <strong>A full-stack movie discovery, recommendation, and streaming lookup web application inspired by IMDb, Plex, Rotten Tomatoes, and JustWatch.</strong>
</p>

<p align="center">
  <a href="https://cinematch-7d1t.onrender.com/" target="_blank"><img src="https://img.shields.io/badge/Live_Demo-Render-46E399?style=for-the-badge&logo=render" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TMDB-API-01b4e4?style=for-the-badge&logo=themoviedb" alt="TMDB API" />
  <img src="https://img.shields.io/badge/Author-Sugata_Mondal-e50914?style=for-the-badge" alt="Sugata Mondal" />
</p>

<p align="center">
  🌐 <strong><a href="https://cinematch-7d1t.onrender.com/" target="_blank">https://cinematch-7d1t.onrender.com</a></strong>
</p>

---

## 🎓 About The Project

**CineMatch** was originally developed by me **Sugata Mondal** as part of my **MSc. Computer Science Final Semester Project (2019)**. 
I have tried to make it better in 2026 with New features added, and AI Integration.

The project addresses the common challenge of *"movie fatigue"* helping cinephiles and casual viewers quickly discover trending movies, explore web series, look up streaming availability, and generate instant personalized recommendations based on their rating preferences and watch lists.

---

## ✨ Key Features

- 🔒 **Server-Side API Proxy**: All TMDB API calls run strictly server-side inside Next.js API Routes (`/api/movies/*`). The API key is stored securely in environment variables and **never exposed to the client browser**.
- 🇮🇳 **Indian Movies & Web Series Multi-Search**: Real-time search support for both **Movies** (*RRR*, *Kalki 2898 AD*, *Jawan*, *Dangal*, *3 Idiots*) and **Web Series** (*Panchayat*, *Mirzapur*, *Sacred Games*, *The Family Man*, *Scam 1992*).
- 🧠 **Smart Recommendation Engine ("For You")**: Computes personalized **Match Percentage** scores (e.g. `96% Match`) by blending TMDB recommendation endpoints with a custom genre distribution & keyword overlap weighting matrix.
- 📺 **Where to Watch (JustWatch)**: Shows live streaming platforms for **Stream**, **Rent**, and **Buy** (Netflix, Prime Video, Disney+ Hotstar, JioCinema, ZEE5, Apple TV) with **India (IN)** set as default region.
- ⭐ **"My List" & Star Ratings**: Save favorites and give 1-10 star ratings without friction. Persisted locally in the browser (`localStorage`) - no registration or database needed.
- 🎬 **Cinematic Dark Theme**: Inspired by Plex and IMDb (`#0b0e14` surface, `#f5c518` IMDb gold, `#e50914` streaming accent) with trailer video overlays and smooth hover previews.
- 📱 **Mobile Optimized**: Fully responsive layout featuring a fixed bottom navigation bar (`MobileNav.js`) and overflow-free card modals.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Frontend UI** | [React 19](https://react.dev/), Vanilla CSS Modules, CSS Tokens |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Data Provider** | [TMDB API (The Movie Database)](https://www.themoviedb.org/) |
| **Streaming Data** | [JustWatch API](https://www.justwatch.com/) |
| **Client Storage** | HTML5 Web Storage API (`localStorage`) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- `npm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/CoderSugata/CineMatch.git
   cd CineMatch
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory (do not commit this file to GitHub):
   ```env
   TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Security & API Key Protection

- **`.gitignore`** is configured to ignore `.env*` files, `.next`, and `node_modules`.
- API keys are never bundled into client-side JavaScript. All third-party calls execute on the server inside `/app/api/movies/*`.

---

## 🌐 Deployment

### Option 1: Render (Web Service)
1. Push your repository to **GitHub**.
2. Go to [Render](https://render.com/) and click **New +** -> **Web Service**.
3. Connect your **GitHub** repository.
4. Set the following build and start settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Under **Environment Variables**, add:
   - `TMDB_API_KEY` = `your_tmdb_api_key_here`
6. Click **Create Web Service**. Render will build and host your site!

### Option 2: Vercel
1. Push your repository to **GitHub**.
2. Go to [Vercel](https://vercel.com/) (sign in free with GitHub).
3. Click **Add New Project** and import your `CineMatch` repository.
4. Under **Environment Variables**, add `TMDB_API_KEY`.
5. Click **Deploy**.

---

## 📜 License & Copyright

© 2026 **Sugata Mondal**. All rights reserved.

*Developed as an MSc. Computer Science Final Semester Project.*
