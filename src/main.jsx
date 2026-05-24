import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { seedTriviaOnce } from './lib/storage.js'
import { triviaBatches } from './data/indiaTrivia.js'

for (const { flagKey, items } of triviaBatches) {
  seedTriviaOnce(items, `hindi-app:trivia-seeded-${flagKey}`)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
