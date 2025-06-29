import React from 'react'
import "../App.css"
import { useSocket} from "../providers/Socket"

const Home:React.FC = () => {
  const {socket} = useSocket()
  socket.emit("join room",{roomId:'1',emailId:"twst@test.com"})
  return (
    <div className='homepage-container'>
      <div className='input-container'>
        <input type="email"  placeholder='Enter your email'/>
        <input type="text"  placeholder='Enter Room COde'/>
        <button>Enter Room</button>
      </div>
    </div>
  )
}


export default Home
