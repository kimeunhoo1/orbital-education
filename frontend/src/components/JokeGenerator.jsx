import React, { useState } from 'react'

function JokeGenerator() {
  const [joke, setJoke] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [jokeType, setJokeType] = useState('general')

  const fetchJoke = async () => {
    setLoading(true)
    setError('')
    setJoke('')

    try {
      let url = 'https://api.api-ninjas.com/v1/jokes'
      
      if (jokeType !== 'general') {
        url += `?category=${jokeType}`
      }

      const response = await fetch(url, {
        headers: {
          'X-Api-Key': 'YOUR_API_KEY_HERE' // Get free API key from api-ninjas.com
        }
      })

      if (!response.ok) {
        // Fallback to free joke API (no key required)
        const fallbackResponse = await fetch('https://official-joke-api.appspot.com/random_joke')
        const data = await fallbackResponse.json()
        setJoke(`${data.setup}\n\n${data.punchline}`)
      } else {
        const data = await response.json()
        setJoke(data[0].joke)
      }
    } catch (err) {
      // Use completely free API as last resort
      try {
        const response = await fetch('https://official-joke-api.appspot.com/random_joke')
        const data = await response.json()
        setJoke(`${data.setup}\n\n${data.punchline}`)
      } catch (e) {
        setError('Failed to fetch joke. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          😂 Joke Generator
        </h1>
        <p className="text-center text-gray-600 mb-8">Get a random laugh!</p>

        {/* Joke Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Joke Category:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['general', 'programming', 'knock-knock', 'dad'].map((type) => (
              <button
                key={type}
                onClick={() => setJokeType(type)}
                className={`py-2 px-3 rounded-lg font-medium transition ${
                  jokeType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Joke Display */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-8 mb-8 min-h-32 flex items-center justify-center">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700 font-semibold">Loading joke...</p>
            </div>
          ) : error ? (
            <p className="text-red-600 text-center font-semibold">{error}</p>
          ) : joke ? (
            <p className="text-gray-800 text-lg text-center whitespace-pre-line">
              {joke}
            </p>
          ) : (
            <p className="text-gray-500 text-center italic">Click the button to get a joke!</p>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={fetchJoke}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 disabled:scale-100"
        >
          {loading ? 'Getting a joke...' : 'Get a Random Joke 🎭'}
        </button>

        {/* Stats */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>✨ Powered by Official Joke API</p>
        </div>
      </div>
    </div>
  )
}

export default JokeGenerator
