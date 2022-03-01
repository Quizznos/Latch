const express = require("express");
const socketIO = require('socket.io');
const http = require('http')


const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const fileUpload = require('express-fileupload');

io.on('connect', (socket) => {
    socket.on('CONNECT', (data) => {
        socket.join(data);  // Creating with id of the ChatID
    });
    socket.on('SEND_MESSAGE', (data) => {
        const { newDispatch, chatID } = data;
        socket.to(chatID).emit('RECIEVE_MESSAGE', newDispatch);
    });

    socket.on('CONNECT_COMMUNITY_BOARD', (_) => {
        console.log(socket.id + ' from connect');
        socket.join('room');
    })
    socket.on('UPDATE_COMMUNITY_BOARD', (data) => {
        console.log(socket.id + ' from update');
        socket.to('room').emit('RECIEVE_COMMUNITY_BOARD', data);
    });


    // socket.on('SEND_FRIEND_REQUEST', (data) => {
    //     const { newDispatch, rooom } = data;
    //     socket.join(data);
    //     socket.to(rooom).emit('')
    // })

    socket.on('disconnect', () => {
        console.log(`Disconnect: ` + socket.id);
        // delete users[socket.id];
        // console.log(users)
    });
}); 

// Connect to MongoDB
connectDB(); 

// Initialize middleware and allow us to get the data from request body 
app.use(express.json({ extended:false }));

//add more stuff to it
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }));
app.use("/api/documents", require("./routes/api/documents"));

//the routes we will be using
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/job", require("./routes/api/jobs"));

app.use("/api/chat", require("./routes/api/chat"));
app.use("/api/setting", require("./routes/api/setting"));
app.use('/api/social', require('./routes/api/social'));
//app.use("/api/communityForum", require("./routes/api/communityForum"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));