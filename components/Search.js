import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Search({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const router = useRouter()

  // Body scroll lock & focus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Debounced fetch
  useEffect(() => {
    if (query.length > 2) {
      const timer = setTimeout(async () => {
        setLoading(true)
        try {
          const { data } = await axios.get(
            'https://admin.xpertbid.com/api/search-auctions',
            { params: { query } }
          )
          setResults(data.auctions || [])
        } catch (e) {
          console.error(e)
        }
        setLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setResults([])
    }
  }, [query])

  const handleSubmit = e => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="search-overlay">
      <div className="search-box">
        <button className="close-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search any auction listing..."
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault() // Prevent default Enter submit
              }
            }}
          />
        </form>
        {loading && <p className="status">Searching...</p>}
        {!loading && query.length > 2 && results.length === 0 && (
          <p className="status">No results found</p>
        )}
        {results.length > 0 && (
          <ul className="results">
            {results.map(item => (
              <li
                key={item.id}
                onClick={() => {
                  router.push(`/product/${item.slug}`)
                  onClose()
                }}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      <style jsx>{`
        .search-overlay {
          position: fixed; top: 0; left: 0;
          width: 100%; height: 70%;
          background: #F9F9F9;
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          box-shadow: 0px 45px 89.4px 0px rgba(0, 0, 0, 0.20);
          padding-top:50px;
          border:none;
        }
        .search-box {
          position: relative;
          width: 100%;
        }
        .search-box input {
          width: 100%;
          padding: 1rem 2.5rem 1rem 1rem;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
        }
        .close-btn {
          position: absolute; top: -2.5rem; right: 0;
          background: none; border: none; font-size: 1.5rem;
          cursor: pointer;
          padding-right:10px;
        }
        .status {
          margin-top: 0.5rem;
          font-style: italic;
        }
        .results {
          margin-top: 0.5rem;
          list-style: none; padding: 0;
          max-height: 300px; overflow-y: auto;
        }
        .results li {
          padding: 0.5rem;
          cursor: pointer;
        }
        .results li:hover {
          background: #f0f0f0;
        }
      `}</style>
    </div>
  )
}
