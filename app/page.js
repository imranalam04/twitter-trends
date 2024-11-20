'use client'

import { useState } from 'react'
import { Search, TrendingUp, Mail } from 'lucide-react'

export default function Component() {
  const [country, setCountry] = useState('')
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchUserInfo = async (country) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tweeter?country=${encodeURIComponent(country)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setUserInfo(result)
      setError(null)
    } catch (error) {
      setError(error.message)
      console.error('There was an error fetching the data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (country) {
      fetchUserInfo(country)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Twitter Trending Hashtags for B2B
        </h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center border-b border-b-2 border-blue-500 py-2">
            <input 
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text" 
              value={country} 
              onChange={(e) => setCountry(e.target.value)} 
              placeholder="Enter country name" 
              required 
            />
            <button 
              className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="submit"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {userInfo && userInfo.trends && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {userInfo.trends.map((trend, index) => (
                <li key={index} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-6 w-6 text-blue-500 mr-3" />
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">{trend.name}</h2>
                        <p className="text-sm text-gray-500">{trend.description || 'No description available'}</p>
                      </div>
                    </div>
                    <button 
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {/* Implement cold email logic here */}}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Cold Email
                    </button>
                  </div>
                  {trend.context && (
                    <p className="mt-2 text-sm text-gray-600">Context: {trend.context}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {userInfo && (!userInfo.trends || userInfo.trends.length === 0) && (
          <p className="text-center text-gray-600">No trends available for this country.</p>
        )}
      </div>
    </div>
  )
}