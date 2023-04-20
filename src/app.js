import express from 'express'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import __dirname from './utils/utils.js'
import ProductManager from './manager/productManager.js'
import viewsRouter from './routes/viewsRoutes.js'
import productRouter from './routes/prodRoutes.js'
import * as url from 'url';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express()
const PORT = 8080
const server = app.listen(PORT,()=>{
    console.log(`Servidor funcionando en puerto: ${PORT}`)
})

app.engine('handlebars', handlebars.engine());
app.set('views', dirname+ './views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(dirname+'/public'));

app.use('/', viewsRouter)
app.use('/realTimeProducts', viewsRouter)
app.use('/api/products',productRouter)

const io = new Server(server)
const product= new ProductManager(`${dirname}/db/products.json`)

io.on('connection', async Socket=>{
    console.log('user conected')
    const products = await product.getProduct()
    io.emit('productList',products)
    Socket.on('message', data=>{
        io.emit('log',data)
    })
    Socket.on('product', async newProd=>{
        let newProduct = await product.addProduct(newProd)
        const products= await product.getProduct()
        io.emit('productList',products)
    })
    Socket.on('productdelete',async delProd=>{

        let pid = await product.deleteProduct(delProd)
        const products = await product.getProduct()
        io.emit('productList',products)
    })
})