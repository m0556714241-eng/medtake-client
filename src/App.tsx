import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import './App.css'

function App() {
  return (
    <main>
      <h1 className="text-3xl font-bold text-primary">MedTake</h1>
      <p>ברוכים הבאים</p>
      <TextField label="שם מלא" />
      <Button variant="contained">כפתור לדוגמה</Button>
    </main>
  )
}

export default App
