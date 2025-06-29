import React from 'react'

const Home:React.FC = () => {
  return (
    <div className='homepage-container'>
      <div>
        <input type="email"  placeholder='Enter your email'/>
        <input type="text"  placeholder='Enter Room COde'/>
        <button>Enter Room</button>
      </div>
    </div>
  )
}

export default Home
