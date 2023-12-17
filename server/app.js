import {Server} from "socket.io"
import {notifs} from "./notifications.js"

const connectedUser = {};
const io =  new Server(
{
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"],
    }
});

io.of('/').use((socket, next)=>{

    //check if user is registered

    // const found = users.find((user)=> user.username === socket.handshake.auth["username"]);

    // if(!found){

    //     return next(new Error("Invalid user"));

    // }

    //update user connection status
    //found.connected = true;

    socket.id = socket.handshake.auth?.email;
    socket.user = socket.handshake.auth;

    next();      


});

io.of('/').on("connection",(socket)=>{

    connectedUser[socket.id] = socket;

    //if user got any notifications while offline
    if(notifs[socket.id]){

        //send all notifications to user   
        notifs[socket.id].forEach(notif => {
            socket.emit("new_notif", notif);
        });

        notifs[socket.id] = [];

    } 
       
    socket.on("notify",(data)=>{ 

        // Directly send notification to user when connected
        // if(io.of('/').sockets.get(data.receiver)){
        //     console.log(data);
        //     return io.of('/').sockets.get(data.receiver).emit("new_notif",data);

        // }
        if(connectedUser[data.receiver]){
            return connectedUser[data.receiver].emit("new_notif",data);

        }
        // Store notification to send later when user connects
        if(!notifs[data.receiver]){
            notifs[data.receiver] = [];
        } 

        return notifs[data.receiver].push(data);
    
    })


    socket.on("disconnect",()=>{
        connectedUser[socket.id] = null;
        console.log("user disconnected");
    })

});

io.listen(4000);





