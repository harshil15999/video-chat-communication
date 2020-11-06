
const videoGrid=document.getElementById("video-grid");
const socket=io('/')

var peer=new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3030'
});
let myVideoStream

const myVideo=document.createElement("video");

myVideo.muted="muted";
const peers = {}


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream=>{
    myVideoStream=stream;

    addVideoStream(myVideo,stream)

    console.log(stream);

    peer.on('call',call=>{
        call.answer(stream)
        const video=document.createElement("video");
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    })
 
})

peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})

socket.on('user-connected',(userId)=>{
    setTimeout(function(){
        connecToNewUser(userId,myVideoStream);
    },5000)
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })


const connecToNewUser =(userId,stream)=>{
    console.log("user connected"+userId)

    var call = peer.call(userId, stream);

    const video=document.createElement('video')

    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })

    call.on('close', () => {
        video.remove()
      })

    peers[userId] = call

}

const addVideoStream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener("loadedmetadata",()=>{
        video.play();
    })
    console.log(video)
    videoGrid.append(video)
}


//mute and unmute button
const muteUnmute=()=>{
    const enabled=myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    
    }else if(enabled==false){
        
        myVideoStream.getAudioTracks()[0].enabled=true;
        setMuteButton();
    }
    
}

const setMuteButton=()=>{
    const html='<i class="fas fa-microphone"></i><span>Mute</>'
    document.querySelector('.main__mute_button').innerHTML=html;
}

const setUnmuteButton=()=>{
    const html='<i class="unmute fas fa-microphone"></i><span>Unmute</>'
    document.querySelector('.main__mute_button').innerHTML=html;
}


const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  


const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }


  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }