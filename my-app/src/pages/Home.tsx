import React, { useEffect, useState } from 'react'
import "../App.css"
import { useSocket} from "../providers/Socket"
import { useNavigate } from 'react-router-dom'

const Home:React.FC = () => {
  const navigate = useNavigate()
  const {socket} = useSocket()
  const [email,setEmail] = useState<string>("")
  const [roomId,setRoomId] = useState<string>("")
  const handleRoomJoined = ({roomId}: { roomId: string })=>{
 navigate(`/room/${roomId}`)
  }
  useEffect(()=>{
    socket.on('joined-room',handleRoomJoined)

  },[socket])
  const handleJoinRoom = ()=>{
    socket.emit('join-room',{emailId:email, roomId})
  }
  return (
    <div className='homepage-container'>
      <div className='input-container'>
        <input value={email} type="email" onChange={e => setEmail(e.target.value)} placeholder='Enter your email'/>
        <input type="text"  value={roomId} onChange={e=> setRoomId(e.target.value)} placeholder='Enter Room COde'/>
        <button onClick={handleJoinRoom}>Enter Room</button>
      </div>
    </div>
  )
}


export default Home
