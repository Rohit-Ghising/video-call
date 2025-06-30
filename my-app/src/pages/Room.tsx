import React, { useCallback, useEffect } from 'react'
import {useSocket}from '../providers/Socket'
import {usePeer} from '../providers/Peer'

const Room:React.FC = () => {
  const {socket} = useSocket()
  const {peer,createOffer} = usePeer()

  const handleNewUserJoined =   useCallback(  async (data)=>{
    const {emailId} = data
    console.log("new user joined",emailId)
   const offer = await createOffer()
   socket.emit('call-user',{emailId,offer})

  },[createOffer,socket])
  const handleIncommingCall = useCallback((data)=>{
    const {from,offer} = data
    console.log('Imcomming call from',from,offer)
  },[])

  useEffect(()=>{
    socket.on('user-joined',handleNewUserJoined)
    socket.on('incomming-call',handleIncommingCall)
  },[handleNewUserJoined,socket,handleIncommingCall])
  return (
    <div>
      <h1>hello room page</h1>
    </div>
  )
}

export default Room
