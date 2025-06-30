// import React, { useCallback, useEffect, useState } from 'react'
// import {useSocket}from '../providers/Socket'
// import {usePeer} from '../providers/Peer'
// import ReactPlayer from 'react-player'

// const Room:React.FC = () => {
//   const [myStream,setMyStream] = useState(null)
//   const {socket} = useSocket()
//   const {peer,createOffer,createAnswer,setRemoteAnswer} = usePeer()

//   const handleNewUserJoined =   useCallback(  async (data)=>{
//     const {emailId} = data
//     console.log("new user joined",emailId)
//    const offer = await createOffer()
//    socket.emit('call-user',{emailId,offer})

//   },[createOffer,socket])
//   const handleIncommingCall = useCallback(async(data)=>{
//     const {from,offer} = data
//     console.log('Imcomming call from',from,offer)
//     const ans = await createAnswer(offer)
//   socket.emit('call-accepted',{emailId:from,ans})
//   },[createAnswer,socket])

//   const handleCallAccepted = useCallback(async(data)=>{
//     const {ans} = data
//     console.log('Call got accepted',ans)
//     await setRemoteAnswer(ans)

//   },[setRemoteAnswer])

//   const getuserMediaStream = useCallback(async()=>{
//     const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true})
//     setMyStream(stream)

//   },[])

//   useEffect(()=>{
//     socket.on('user-joined',handleNewUserJoined)
//     socket.on('incomming-call',handleIncommingCall)
//     socket.on('call-accepted',handleCallAccepted)
//     return ()=>{
//       socket.off('user-joined',handleNewUserJoined)
//       socket.off('incomming_call',handleIncommingCall)
//       socket.off('call-accepted',handleCallAccepted)
//     }
//   },[handleNewUserJoined,socket,handleIncommingCall,handleCallAccepted])

//   useEffect(()=>{
//     getuserMediaStream()
//   },[getuserMediaStream])
//   return (
//     <div>
//       <h1>hello room page</h1>
//       <ReactPlayer url={myStream} playing/>
//     </div>
//   )
// }

// export default Room
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSocket } from '../providers/Socket'
import { usePeer } from '../providers/Peer'

const Room: React.FC = () => {
  const [myStream, setMyStream] = useState<MediaStream | null>(null)
  const[remoteEmailId,setRemoteEmailId] = useState(null)
  const myVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const { socket } = useSocket()
  const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer()

  const handleNewUserJoined = useCallback(async (data) => {
    const { emailId } = data
    console.log("New user joined:", emailId)
    const offer = await createOffer()
    socket.emit('call-user', { emailId, offer })
    setRemoteEmailId(emailId)
    
  }, [createOffer, socket])

  const handleIncommingCall = useCallback(async (data) => {
    const { from, offer } = data
    console.log('Incoming call from:', from, offer)
    const ans = await createAnswer(offer)
    socket.emit('call-accepted', { emailId: from, ans })
    setRemoteEmailId(from)
  }, [createAnswer, socket])

  const handleCallAccepted = useCallback(async (data) => {
    const { ans } = data
    console.log('Call accepted:', ans)
    await setRemoteAnswer(ans)
  }, [setRemoteAnswer])

  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      setMyStream(stream)
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing media devices:", err)
    }
  }, [])
   const handleNego  = useCallback(()=>
  { 
    const localOffer = peer.localDescription
      socket.emit('call-user',{emailId:remoteEmailId,offer:localOffer})},[peer.localDescription,remoteEmailId,socket])

  useEffect(() => {
    socket.on('user-joined', handleNewUserJoined)
    socket.on('incomming-call', handleIncommingCall)
    socket.on('call-accepted', handleCallAccepted)

    return () => {
      socket.off('user-joined', handleNewUserJoined)
      socket.off('incomming-call', handleIncommingCall)
      socket.off('call-accepted', handleCallAccepted)
    }
  }, [socket, handleNewUserJoined, handleIncommingCall, handleCallAccepted])

  useEffect(() => {
    getUserMediaStream()
  }, [getUserMediaStream])

  useEffect(()=>{
     peer.addEventListener('negotiationneeded',handleNego )
     return ()=>{
       peer.removeEventListener('negotiationneeded',handleNego)
     }
  },[])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  return (
    <div>
      <h1>Hello Room Page</h1>
      <h4>u re cinnexted to {remoteEmailId}</h4>
      <button onClick={() => sendStream(myStream)}>Send my video</button>

      <h3>My Video</h3>
      <video ref={myVideoRef} autoPlay playsInline muted />

      <h3>Remote Video</h3>
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  )
}

export default Room
