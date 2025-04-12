
import React, { useEffect ,useMemo,useState} from 'react';

import {io} from 'socket.io-client'; 
import {Button, Container, TextField, Typography,Box,Stack} from '@mui/material'
export const App = () => {

  const socket = useMemo(() => io("http://localhost:4002"), []);
 const [message,setMessage]=useState("")
 const[room,setRoom]=useState("")
 const[socketID,setSocketId]=useState("")
 const[messages,setMessages]=useState([])
 const[roomName,setRoomName]=useState("")
 console.log(messages)
 
  const handleSubmit = (e) => {  
    e.preventDefault();
    socket.emit("message",{room,message} );
    setMessage("");
   }  
   const joinRoomHandler=()=>{
    socket.emit("join-room",roomName);
    setRoomName("")
   }
  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected to server:", socket.id);
    });

    socket.on("recieve-message",(data)=>{
      console.log(data);
      setMessages((messages)=>[...messages,data])
    })

socket.on("welcome", (s) => {
      console.log(s);
    });
    return ()=>{
      socket.disconnect();
    }
  
  }, []);
  return (
<Container maxWidth="sm">
  <Box sx={{height:500}} />

<Typography variant='h6'  component="div" gutterBottom>
  {socketID}
</Typography>

<form onSubmit={joinRoomHandler}>
  <h5>Join Room</h5>
  <TextField 
  value={roomName}
  onChange={e=>setRoomName(e.target.value)} 
  id='outlined-basic'
   label='Room Name'
    variant='outlined'
     />
       <Button type='submit' variant='contained' color='primary'> Join </Button>

</form>

<form onSubmit={handleSubmit}>
  <TextField 
  value={message}
  onChange={e=>setMessage(e.target.value)} 
  id='outlined-basic'
   label='Message'
    variant='outlined'
     />
       <TextField 
  value={room}
  onChange={e=>setRoom(e.target.value)} 
  id='outlined-basic'
   label='Room'
    variant='outlined'
     />
  <Button type='submit' variant='contained' color='primary'> Send </Button>
</form>

<Stack>
  {
    messages.map((m,i)=>
      <Typography key={i} variant='h6'  component="div" gutterBottom>
        {m}
      </Typography>
    )
  }
</Stack>
    </Container>
  )
}

export default App;
