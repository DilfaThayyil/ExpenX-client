# 💸 Expense Tracker Web App

A full-stack modern web application designed to help users track their expenses, manage appointments with financial advisors, and engage in real-time communication — all in a beautifully responsive and user-friendly interface.

---

## 🚀 Features

- ✨ **Modern UI/UX** with React, TailwindCSS, Chakra UI & MUI
- 🧠 **Zustand** for lightweight global state management
- 🌍 **Multi-language support** using i18next
- 📊 **Dynamic charts & visualizations** via Chart.js & Recharts
- 🔐 **Authentication** with JWT and Google OAuth
- 🧾 **Expense Management** with categorization and filtering
- 📅 **Advisor Slot Booking** with real-time availability
- 💬 **Real-time chat** between users and advisors using Socket.IO
- 📹 **Video/Audio Calls** powered by ZegoCloud UIKit
- 💳 **Stripe Integration** for secure payments
- ☁️ **Cloud uploads** with AWS S3 + Multer for profile pictures & docs
- 🛠️ **Built with Vite** for lightning-fast performance
- 📦 **Modular, scalable architecture** following best practices

---

## 🧱 Tech Stack

### 🖥️ Frontend
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Chakra UI](https://chakra-ui.com/)
- [Material UI](https://mui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Router DOM v7](https://reactrouter.com/)

### 📊 Data Visualization
- [Chart.js](https://www.chartjs.org/)
- [Recharts](https://recharts.org/)

### 📦 State & Utilities
- [Zustand](https://zustand-demo.pmnd.rs/)
- [clsx](https://github.com/lukeed/clsx)
- [class-variance-authority](https://cva.style/)

### 🌍 Internationalization
- [i18next](https://www.i18next.com/)
- [react-i18next](https://react.i18next.com/)

### 🛡️ Auth & API
- [JWT](https://jwt.io/)
- [Google OAuth](https://developers.google.com/identity)
- [Axios](https://axios-http.com/)

### 📦 File Upload & Cloud
- [AWS S3](https://aws.amazon.com/s3/)
- [Multer + multer-s3](https://github.com/badunk/multer-s3)

### 🔌 Real-time Features
- [Socket.IO](https://socket.io/)
- [ZegoCloud UIKit](https://www.zegocloud.com/)

### 💰 Payments
- [Stripe](https://stripe.com/)

---

## 🧪 Development

### Prerequisites
- Node.js ≥ 18
- MongoDB
- Stripe & Google OAuth keys

### Install & Run

```bash
# Install dependencies
npm install

# Start the frontend dev server
npm run dev

# Build for production
npm run build
