# 🎧 TubeTunes API

A **YouTube-powered music streaming app** — search any track, browse featured music, and play it in a slick full-featured player with lyrics.

## ✨ Features

- 🔎 Search millions of tracks via YouTube
- ▶️ Full music player: play/pause, seek, queue
- ⭐ Featured tracks section
- 🎤 Lyrics lookup for the current track
- 💾 Persistent storage with Drizzle ORM + Neon Postgres
- 🎨 shadcn/ui + Tailwind frontend

## 🛠️ Tech Stack

- **Frontend:** React · TypeScript · Vite · shadcn/ui · Tailwind CSS
- **Backend:** Node.js · Express · TypeScript (tsx)
- **Database:** Neon serverless Postgres · Drizzle ORM
- **Media:** YouTube search/stream services

## 🚀 Getting Started

```bash
git clone https://github.com/Sugamdeol/TubeTunesAPI.git
cd TubeTunesAPI
npm install

# set up your database
cp .env.example .env   # add DATABASE_URL etc.
npm run db:push

# development
npm run dev

# production build
npm run build && npm start
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Built with ❤️ by [Sugam Deol](https://github.com/Sugamdeol)
