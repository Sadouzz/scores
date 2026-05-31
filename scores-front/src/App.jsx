import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [scores, setScores] = useState([])
  const [limit, setLimit] = useState(10)
  const [pseudo, setPseudo] = useState('')
  const [points, setPoints] = useState('')

  const fetchScores = async () => {
    try {
      const response = await fetch('http://localhost:8080/scores')
      if (response.ok) {
        const data = await response.json()
        setScores(data)
      }
    } catch (error) {
      console.error("Error fetching scores:", error)
    }
  }

  useEffect(() => {
    fetchScores()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pseudo || !points) return

    try {
      const response = await fetch('http://localhost:8080/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pseudo, points: parseInt(points, 10) })
      })

      if (response.ok) {
        setPseudo('')
        setPoints('')
        fetchScores()
      }
    } catch (error) {
      console.error("Error submitting score:", error)
    }
  }

  const displayedScores = scores.slice(0, limit)

  return (
    <div className="container">
      <h1>Arcade Legends</h1>
      
      <div className="filters">
        <button 
          className={`filter-btn ${limit === 10 ? 'active' : ''}`}
          onClick={() => setLimit(10)}
        >
          Top 10
        </button>
        <button 
          className={`filter-btn ${limit === 50 ? 'active' : ''}`}
          onClick={() => setLimit(50)}
        >
          Top 50
        </button>
      </div>

      <div className="leaderboard-glass">
        <table className="leaderboard">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {displayedScores.map((score, index) => (
              <tr key={index} className={index < 3 ? `top-${index + 1}` : ''}>
                <td>#{index + 1}</td>
                <td>{score.pseudo}</td>
                <td className="score-val">{score.points.toLocaleString()}</td>
              </tr>
            ))}
            {displayedScores.length === 0 && (
              <tr>
                <td colSpan="3" className="empty-state">No scores yet. Be the first!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form className="score-form" onSubmit={handleSubmit}>
        <h3>Submit Your Score</h3>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Pseudo" 
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required 
          />
          <input 
            type="number" 
            placeholder="Points" 
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            required 
          />
          <button type="submit" className="submit-btn">SEND</button>
        </div>
      </form>
    </div>
  )
}

export default App
