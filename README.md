# 🚗 AutoCare Manager - Ghid de Pornire pentru Echipă

Salutare! Acesta este proiectul nostru pentru laboratorul de Inginerie Software. Mai jos găsești toți pașii necesari pentru a pune aplicația pe picioare pe calculatorul tău.

## 🛠️ Pre-condiții
Asigură-te că ai instalat pe PC:
* **Node.js** (recomandat versiunea LTS)
* **Git**
* **VS Code**

---

## 🚀 Pașii pentru Instalare (Rulează-i DOAR prima dată)

După ce ai clonat repository-ul, trebuie să instalezi "piesele" (dependințele) pentru fiecare parte a aplicației, deoarece folderul `node_modules` nu se urcă pe GitHub.

Deschide un terminal în VS Code și rulează:

1. Instalare în Rădăcină (Root)
Instalează instrumentele de gestionare a proiectului:

Bash
npm install
2. Instalare Frontend (React)
Bash
cd client
npm install
cd ..
3. Instalare Backend (Node.js)
Bash
cd server
npm install
cd ..
🏎️ Cum pornești aplicația?
Am configurat un script care pornește ambele servere (Frontend și Backend) simultan. Din folderul principal al proiectului, rulează:

Bash
npm run dev
