const socket = io()

socket.on('log', data => {
    console.log(data)
})

socket.emit('message', "Nuevo ingreso")