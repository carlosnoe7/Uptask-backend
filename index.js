import express from 'express';
import conectarDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import ProyectoRoutes from './routes/ProyectoRoutes.js';
import UsuarioRoutes from './routes/UsuarioRoutes.js';
import TareaRoutes from './routes/TareaRoutes.js';



const app=express();

app.use(express.json())

dotenv.config()
conectarDB();

//Configurar CORS
const whiteList=[process.env.FRONTEND_URL]

const corsOptions={
    origin:function(origin,callback){
        if (whiteList.includes(origin)){
            //Puede consultar la api
            callback(null,true);
        }
        else{
            //No esta permitido
            callback(new Error('Error de CORS'));
        }
    }
};

app.use(cors(corsOptions));

//Routing
app.use('/api/usuarios',UsuarioRoutes)
app.use('/api/proyectos',ProyectoRoutes)
app.use('/api/tareas',TareaRoutes)

const PORT=process.env.PORT || 4000;

const servidor=app.listen(PORT,()=>{
})

//Socket.io
import { Server } from 'socket.io';

const io=new Server(servidor,{
    pingTimeout: 60000,
    cors:{
        origin: process.env.FRONTEND_URL
    }
});

io.on('connection',(socket)=>{

    // Definir eventos de socket io
    
    socket.on('abrir proyecto',(proyecto)=>{
        socket.join(proyecto);

    });

    socket.on('nueva tarea',(tarea)=>{
        const  proyecto =tarea.proyecto;
        socket.to(proyecto).emit('tarea agregada',tarea);

    });

    socket.on('eliminar tarea',tarea=>{
        const proyecto=tarea.proyecto;
        socket.to(proyecto).emit('tarea eliminada',tarea)
    });

    socket.on('actualizar tarea',tarea=>{
        const proyecto=tarea.proyecto._id;
        socket.to(proyecto).emit('tarea actualizada',tarea);
    });

    socket.on('cambiar estado',(tarea)=>{
        const proyecto=tarea.proyecto._id;
        socket.to(proyecto).emit('nuevo estado',tarea);
    });
})
