import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './index.css'
import { PlusCircle, Zap, Shield, BatteryCharging, Send, Menu, Play, ArrowRight, Sparkles, Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react'

const API_URL = 'https://medpg.onrender.com/api'

function App() {
  const [theme, setTheme] = useState('dark')
  const [currency, setCurrency] = useState('INR')
  const [cars, setCars] = useState([])
  const [activeFilter, setActiveFilter] = useState(null)
  const [highlightedCar, setHighlightedCar] = useState(null)
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070')
  const [compareModel1, setCompareModel1] = useState('')
  const [compareModel2, setCompareModel2] = useState('')

  const [bookModel, setBookModel] = useState('')
  const [bookCity, setBookCity] = useState('')
  const [bookDate, setBookDate] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    axios.get(`${API_URL}/cars/`).then(res => {
      setCars(res.data)
      if (res.data.length >= 2) {
        setCompareModel1(res.data[0].name)
        setCompareModel2(res.data[1].name)
      }
    }).catch(err => console.error(err))
  }, [])

  const formatPrice = (priceInr) => {
    if (currency === 'USD') {
      const priceUsd = Math.round(priceInr / 83)
      return `$${priceUsd.toLocaleString()}`
    }
    return `₹${(priceInr / 100000).toLocaleString()} Lakhs`
  }

  const filteredCars = activeFilter
    ? cars.filter(c => {
      const typeMatch = !activeFilter.type || c.type === activeFilter.type;
      const priceMatch = !activeFilter.max_price || c.price_inr <= activeFilter.max_price;
      return typeMatch && priceMatch;
    })
    : cars;

  const selectedCar1 = cars.find(c => c.name === compareModel1) || cars[0]
  const selectedCar2 = cars.find(c => c.name === compareModel2) || (cars[1] || cars[0])

  const handleAiCommand = (data) => {
    const { action, payload, section } = data

    const findCar = (name) => {
      const s = (name || '').trim().toLowerCase()
      if (!s) return null
      // 1. Exact match
      let match = cars.find(c => c.name.toLowerCase() === s)
      if (match) return match
      // 2. Contains match
      match = cars.find(c => c.name.toLowerCase().includes(s) || s.includes(c.name.toLowerCase()))
      if (match) return match
      // 3. Word-by-word match (best for "the nexus")
      const words = s.split(' ')
      for (const word of words) {
        if (word.length < 3) continue
        match = cars.find(c => c.name.toLowerCase().includes(word))
        if (match) return match
      }
      return null
    }

    if (action !== 'FILTER') setActiveFilter(null)
    if (action !== 'HIGHLIGHT_CAR' && action !== 'SPOTLIGHT') setHighlightedCar(null)

    if (action === 'FILTER') {
      let filterPayload = { ...payload }
      if (filterPayload.max_price) {
        // Ensure it's a clean number, but keep it in full INR (e.g. 5000000)
        let price = String(filterPayload.max_price).replace(/[^0-9]/g, '')
        let numPrice = parseInt(price)
        // If they sent just "50", convert it to the full 50,000,000
        if (numPrice < 1000) numPrice = numPrice * 100000
        filterPayload.max_price = numPrice
      }
      setActiveFilter(filterPayload)
    } else if (action === 'COMPARE') {
      if (payload.models && payload.models.length >= 2) {
        const m1 = findCar(payload.models[0])
        const m2 = findCar(payload.models[1])
        if (m1) setCompareModel1(m1.name)
        if (m2) setCompareModel2(m2.name)
      }
    } else if (action === 'PREFILL_FORM' || action === 'PREFILL') {
      const modelName = payload.model || payload.car || payload.car_model
      const m = findCar(modelName)
      if (m) setBookModel(m.name)
      if (payload.city || payload.location) setBookCity(payload.city || payload.location)
      if (payload.date && payload.date !== 'latest') setBookDate(payload.date)
    } else if (action === 'HIGHLIGHT_CAR' || action === 'SPOTLIGHT') {
      const m = findCar(payload.car_name)
      if (m) {
        setHighlightedCar(m.name)
        setHeroImage(m.image_url)
      }
    } else if (action === 'CHANGE_CURRENCY' || action === 'CURRENCY') {
      setCurrency(payload.currency)
    } else if (action === 'CHANGE_THEME') {
      setTheme(payload.theme)
    }

    const targetSection = section || (payload && payload.section)
    if (targetSection) {
      setTimeout(() => {
        const el = document.getElementById(targetSection)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }

  return (
    <div className="app-root" data-theme={theme}>
      <Navbar theme={theme} />

      <section id="hero" className="hero-zenith" style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 60%), url(${heroImage})` }}>
        <div className="container hero-content">
          <div className="hero-tag">{highlightedCar ? `SPOTLIGHT: ${highlightedCar.toUpperCase()}` : 'INTRODUCING THE ZENITH'}</div>
          <h1 className="display-txt">{highlightedCar ? highlightedCar : 'Aether Motors:'}<br />{highlightedCar ? 'The New Standard' : 'The Future of Motion'}</h1>
          <p>{highlightedCar ? `Experience the peak of ${highlightedCar} engineering and design.` : 'Redefining the relationship between driver and machine through weightless performance and atmospheric precision.'}</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => document.getElementById('models').scrollIntoView({ behavior: 'smooth' })}>Explore Fleet</button>
            <button className="btn-outline"><Play size={16} fill="currentColor" style={{ marginRight: '8px' }} /> Watch Launch Film</button>
          </div>
        </div>
      </section>

      <section id="models" className="bg-surface-low">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="display-txt">Our Fleet</h2>
              <p className="text-dim desc-max">Discover the perfect match for your lifestyle.</p>
            </div>
            {activeFilter && <div className="hero-tag">FILTER: {activeFilter.type} &lt; {activeFilter.max_price / 100000} Lakhs</div>}
          </div>
          <div className="models-grid">
            {filteredCars.map(car => (
              <div key={car.id} className={`car-card ${highlightedCar === car.name ? 'highlight' : ''}`}>
                <img src={car.image_url} alt={car.name} className="car-img" />
                <div className="car-details">
                  <h3>{car.name}</h3>
                  <p className="text-dim">{car.description}</p>
                  <div className="car-price" id="pricing">{formatPrice(car.price_inr)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="compare" className="bg-surface">
        <div className="container">
          <h2 className="display-txt">Head-to-Head</h2>
          <p className="text-dim">Select any two models to see how they define the future.</p>

          {selectedCar1 && selectedCar2 && (
            <div className="compare-container">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>
                      <select
                        className="manual-compare-select"
                        value={compareModel1}
                        onChange={(e) => setCompareModel1(e.target.value)}
                      >
                        {cars.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </th>
                    <th>
                      <select
                        className="manual-compare-select"
                        value={compareModel2}
                        onChange={(e) => setCompareModel2(e.target.value)}
                      >
                        {cars.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Price</td>
                    <td>{formatPrice(selectedCar1.price_inr)}</td>
                    <td className={selectedCar2.price_inr < selectedCar1.price_inr ? 'highlight-diff' : ''}>{formatPrice(selectedCar2.price_inr)}</td>
                  </tr>
                  <tr>
                    <td>Range (km)</td>
                    <td className={selectedCar1.range_km > selectedCar2.range_km ? 'highlight-diff' : ''}>{selectedCar1.range_km}</td>
                    <td>{selectedCar2.range_km}</td>
                  </tr>
                  <tr>
                    <td>Top Speed</td>
                    <td className={selectedCar1.top_speed > selectedCar2.top_speed ? 'highlight-diff' : ''}>{selectedCar1.top_speed} km/h</td>
                    <td>{selectedCar2.top_speed} km/h</td>
                  </tr>
                  <tr>
                    <td>0-100 km/h</td>
                    <td className={selectedCar1.acceleration_0_100 < selectedCar2.acceleration_0_100 ? 'highlight-diff' : ''}>{selectedCar1.acceleration_0_100}s</td>
                    <td>{selectedCar2.acceleration_0_100}s</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section id="engineering" className="bg-surface-low">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="display-txt">Engineering Weightless<br />Silence</h2>
              <p className="text-dim desc-max">Beyond electric—a propulsion system that feels like atmospheric flow.</p>
            </div>
            <div className="drag-coeff">
              <span className="huge-number">0.19 CD</span>
              <span className="small-label">DRAG COEFFICIENT</span>
            </div>
          </div>
          <div className="grid-3">
            <div className="card">
              <div className="icon-wrapper"><BatteryCharging size={20} color="var(--primary-container)" /></div>
              <h3>Sustainable Luxury</h3>
              <p className="text-dim">Nordic-inspired interiors crafted from ocean-bound polymers and bio-engineered vegan silk.</p>
            </div>
            <div className="card">
              <div className="icon-wrapper"><Shield size={20} color="var(--primary-container)" /></div>
              <h3>Autonomous Intelligence</h3>
              <p className="text-dim">Neural-pathway mapping that learns your driving style to anticipate every turn with 360° LIDAR awareness.</p>
            </div>
            <div className="card">
              <div className="icon-wrapper"><Zap size={20} color="var(--primary-container)" /></div>
              <h3>Silent Performance</h3>
              <p className="text-dim">Dual-phase motors delivering 1,100 HP with zero acoustic resonance, purely silent velocity.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="book" className="bg-surface">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="display-txt">Reserve Your Drive</h2>
          <p className="text-dim">Experience the Aether difference firsthand. Book a zero-gravity test drive.</p>

          <div className="reserve-form">
            {isSubmitted ? (
              <div className="success-message">
                <div className="icon-wrapper" style={{ margin: '0 auto 1.5rem auto' }}><PlusCircle size={32} color="var(--primary-container)" /></div>
                <h3 className="display-txt">Reservation Confirmed</h3>
                <p className="text-dim">Your high-performance drive is now secured. An Aether representative will contact you shortly to finalize the logistics.</p>
                <button className="btn-outline" style={{ marginTop: '2rem' }} onClick={() => setIsSubmitted(false)}>Book Another Drive</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true) }}>
                <div className="form-group">
                  <label>Car Model</label>
                  <select value={bookModel} onChange={(e) => setBookModel(e.target.value)} required>
                    <option value="" disabled>Select a Model</option>
                    {cars.map(car => (
                      <option key={car.id} value={car.name}>{car.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" value={bookCity} onChange={(e) => setBookCity(e.target.value)} placeholder="e.g. Kochi" required />
                </div>
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input
                    type="date"
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Confirm Reservation</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-surface-low">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="display-txt">Get in Touch</h2>
          <p className="text-dim">Our specialist teams are available 24/7 for global support.</p>

          <div className="contact-grid">
            <div className="contact-item">
              <span className="small-label">HEADQUARTERS</span>
              <p>Aether Plaza, Neo-Kochi, IN</p>
            </div>
            <div className="contact-item">
              <span className="small-label">EMAIL</span>
              <p>enquiries@aether-motors.com</p>
            </div>
            <div className="contact-item">
              <span className="small-label">SUPPORT</span>
              <p>+91 (0) 484 290 0000</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="aether-footer">
        <div className="container footer-content">
          <div className="footer-logo">AETHER MOTORS</div>
          <div className="footer-links">
            <a href="#">PRIVACY</a>
            <a href="#">TERMS</a>
            <a href="#">INVESTOR RELATIONS</a>
            <a href="#">GLOBAL PRESS</a>
          </div>
          <div className="footer-copyright">
            © 2026 AETHER MOTORS. THE FUTURE OF PROPULSION.
          </div>
        </div>
      </footer>

      <NovaAssistant onCommand={handleAiCommand} />
    </div>
  )
}

function Navbar({ theme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <nav className="full-width-nav">
      <div className="nav-logo">AETHER</div>
      <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
        <a href="#models" onClick={() => setMobileMenuOpen(false)}>Models</a>
        <a href="#engineering" onClick={() => setMobileMenuOpen(false)}>Engineering</a>
        <a href="#compare" onClick={() => setMobileMenuOpen(false)}>Compare</a>
        <a href="#book" onClick={() => setMobileMenuOpen(false)}>Reserve</a>
        <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
      </div>
      <div className="nav-actions">
        <button
          className="btn-primary desktop-only"
          style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
          onClick={() => document.getElementById('book').scrollIntoView({ behavior: 'smooth' })}
        >
          Book Test Drive
        </button>
        <Menu
          className="mobile-menu-toggle"
          size={24}
          color="var(--text-main)"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </div>
    </nav>
  )
}

function NovaAssistant({ onCommand }) {
  const [isOpen, setIsOpen] = useState(true)
  const [input, setInput] = useState('')
  const [reply, setReply] = useState('How can I help you navigate?')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const speak = (text) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (messageOverride) => {
    const messageToSend = messageOverride || input
    if (!messageToSend.trim() || loading) return

    setInput('')
    setLoading(true)
    setReply('Thinking...')

    try {
      const res = await axios.post(`${API_URL}/chat/`, { message: messageToSend })
      const data = res.data
      setReply(data.reply)
      speak(data.reply)
      onCommand(data)
    } catch (err) {
      console.error(err)
      setReply('Sorry, I lost connection to the mainframe.')
    } finally {
      setLoading(false)
    }
  }

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setReply("Voice recognition not supported.")
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
      setReply('Listening...')
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      handleSend(transcript)
    }

    recognition.onerror = () => {
      setIsListening(false)
      setReply('Interference detected.')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <div className="nova-widget">
      {isOpen && (
        <div className="nova-card">
          <div className="nova-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="dot-indicator"></div>
              AETHER AI ASSISTANT
            </div>
            <button
              className="nova-mute-toggle"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
          <div className="nova-body">
            <p className="nova-prompt" style={{ marginBottom: '1rem', fontStyle: 'italic', color: 'var(--primary-container)' }}>{reply}</p>
            <div className="nova-input-wrapper">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your inquiry..."
                disabled={loading}
              />
              <button
                className={`nova-mic ${isListening ? 'listening' : ''}`}
                onClick={toggleVoice}
                disabled={loading}
                title="Voice Command"
              >
                {isListening ? <MicOff size={16} color="#ff4d4d" /> : <Mic size={16} color="var(--primary-container)" />}
              </button>
              <button className="nova-send" onClick={() => handleSend()} disabled={loading}>
                <Send size={16} color="var(--primary-container)" />
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="nova-fab" onClick={() => setIsOpen(!isOpen)}>
        <Sparkles size={24} color="#000" />
      </div>
    </div>
  )
}

export default App
