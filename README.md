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

### 1. Instalare în folderul Principal (Root)
Acesta instalează instrumentul care pornește și Front-end-ul și Back-end-ul deodată.
```bash
npm install

### 2. Instalare pentru Client (Frontend - React)


cd client
npm install
cd ..

### 3. Instalare pentru Server (Backend - Node.js)

cd server
npm install
cd ..

Cum pornești aplicația?
Nu este nevoie să deschizi două terminale. Am configurat o comandă "magică" în folderul principal. Asigură-te că ești în folderul rădăcină (auto-manager-app) și scrie:

npm run dev 
