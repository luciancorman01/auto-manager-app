import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [carInfo, setCarInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  // Aici facem legătura cu Backend-ul (Node.js)
  useEffect(() => {
    fetch('http://localhost:5000/api/car-info')
      .then(response => response.json())
      .then(data => {
        setCarInfo(data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Eroare la conectare:", error)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        
        <div>
          <h1>AutoCare Manager</h1>
          {loading ? (
            <p>Se încarcă datele de la server...</p>
          ) : carInfo ? (
            <div className="status-card" style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '20px', 
              borderRadius: '12px',
              border: '1px solid #646cff',
              marginTop: '20px'
            }}>
              <h3>🚗 Vehicul: {carInfo.brand}</h3>
              <p>📅 ITP: <strong>{carInfo.itp}</strong></p>
              <p>📄 RCA: <strong>{carInfo.rca}</strong></p>
              <p>🔧 Schimb Ulei: <strong>{carInfo.oilChange}</strong></p>
            </div>
          ) : (
            <p style={{ color: '#ff4646' }}>❌ Eroare: Backend-ul nu răspunde!</p>
          )}
        </div>

        <div className="card">
          <p>
            Proiect de Inginerie Software - Echipa AutoCare
          </p>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <h2>Funcționalități Viitoare</h2>
          <p>Ce urmează să implementăm:</p>
          <ul>
            <li>• Comparator prețuri RCA</li>
            <li>• Programări Service Online</li>
            <li>• Istoric Reparații Digital</li>
          </ul>
        </div>
        
        <div id="social">
          <h2>Link-uri Utile</h2>
          <ul>
            <li>
              <a href="https://github.com/luciancorman01/auto-manager-app" target="_blank">
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App