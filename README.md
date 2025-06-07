<h1 align="center">🕵️‍♂️ NETSCOPE</h1>
<p align="center">Real-Time Network Packet Visualizer · Built by <a href="https://github.com/JimmyVS">JimmyVS</a></p>

<p align="center">
  <img src="https://img.shields.io/github/stars/JimmyVS/netscope?style=flat-square" />
  <img src="https://img.shields.io/github/forks/JimmyVS/netscope?style=flat-square" />
  <img src="https://img.shields.io/github/issues/JimmyVS/netscope?style=flat-square" />
  <img src="https://img.shields.io/github/license/JimmyVS/netscope?style=flat-square" />
  <img src="https://img.shields.io/badge/made%20with-💙%20Python%20+%20D3.js-blueviolet?style=flat-square" />
</p>

<p align="center">
![image](https://github.com/user-attachments/assets/e30802d6-d3a1-4050-a8b5-c7d2c4a90d0c)

</p>

---

## 🌐 What is NETSCOPE?

**NETSCOPE** is a **real-time network packet visualizer** that maps live traffic flows between devices on your network as a dynamic, glowing graph. Designed to be beautiful, informative, and fun to watch — it's like Wireshark got a neon upgrade ✨

> Perfect for cybersecurity education, hobbyist pentesting, or just admiring your traffic.

---

## 🚀 Features

- 🌟 **Animated graph** showing real-time connections.
- 🎨 Protocol-based color trails (TCP, UDP, DNS, HTTP, etc.)
- 🔥 Pulsing live IP nodes with glowing trails.
- 📊 Stats panel: protocols, top talkers, packet rates.
- 🧠 Theme switcher (Tron, Hacker, Matrix soon).
- 🧰 Built with Python (backend) + D3.js (frontend).
- 🛡️ Cross-platform with packet capture.

---

## 🧰 Tech Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Frontend     | HTML/CSS, JavaScript, D3.js, React   |
| Backend      | Python, Flask (or FastAPI)    |
| Network Layer| Scapy                         |
| Visualization| SVG & Canvas                  |
| Styling      | Pure CSS (Tron/hacker style)  |

---

## 🖥️ Demo

> Live demo coming soon — for now, clone and run locally.

![demo gif](https://raw.githubusercontent.com/JimmyVS/netscope/main/assets/demo.gif)

---

## 🔧 Getting Started

### 🐍 Prerequisites
```bash
Python 3.10+
npm (for static file builds)
```

### 📦 Install
```bash
git clone https://github.com/JimmyVS/netscope.git
cd netscope
pip install -r requirements.txt
npm install && npm run build
```

### 🚴‍♂️ Run
```bash
python app.py
Visit http://localhost:8000 in your browser.
```
Make sure to run as admin/root to allow packet sniffing.

## 🤝 Contributing
Pull requests are welcome! Here's how:

```bash
git checkout -b feature/myFeature
git commit -m "Add amazing feature"
git push origin feature/myFeature
```
Then submit a PR 🙌

## 📄 License
This project is under the MIT License. See LICENSE for more.

## ✨ Acknowledgements
Inspired by Wireshark, EtherApe, and anime hacking UIs.

#### Made with ❤️ by JimmyVS

## 📣 Stay Connected
Star ⭐ the repo, watch for updates 🔔 and share your graphs!
For any issues or feature ideas: Open an issue

