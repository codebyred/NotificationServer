import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const username = document.querySelector("#username");
const password = document.querySelector("#password");
const notif_msg = document.querySelector("#notif-msg");
const notif_btn = document.querySelector("#notif-btn");
const login_btn = document.querySelector("#login-btn");
const disconn_btn = document.querySelector("#disconn-btn");
const msg_box = document.querySelector("#notify-msg");

const socket = io("http://localhost:3000/soc",{ autoConnect: false});

//button events
login_btn.addEventListener("click",()=>{

    socket.auth = {
        username:username.value,
        password:password.value
    }

    socket.connect();

});

disconn_btn.addEventListener("click",()=>{
    socket.disconnect();
})

notif_btn.addEventListener("click",()=>{

    socket.emit("notify",{sender:"alif", receiver:"juicy", message:notif_msg.value});
    
})


//socket events
socket.on("connect",()=>{

    console.log("connected to server");

});

socket.on("disconnect",()=>{
    console.log("disconnected")
})

socket.on("new_notif",(data)=>{

    console.log("new notfication for you");
    console.log(data.message);

})


socket.on("connect_error",(err)=>{

    console.log(err.message);

})





