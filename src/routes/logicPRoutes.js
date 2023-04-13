import ProductManager from "../manager/productManager.js";
import { joiValidator } from "../utils/validator.js";
import CartManager from "../manager/cartManager.js";
import * as url from 'url';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));

const db = new ProductManager(dirname + '../db/products.json')
const dbCart = new CartManager(dirname + '../db/carts.json')
const prods = db.getProduct()


const productGet = async (req, res) => {
    try {
        let limit = parseInt(req.query.limit)
        let productosTodos = await prods

        if (!limit) {
            return res.send(productosTodos)
        }
        if (limit >= productosTodos.length) {
            return res.status(200).send({ msg: 'El limite supera la cantidad de objetos: ', productosTodos })
        }
        const productosLimit = productosTodos.slice(0, limit)
        return res.status(200).send({ msg: 'Productos solicitados: ', productosLimit })

    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`)
    }
}

const getProductById = async (req, res) => {
    try {
        let id = parseInt(req.params.id)
        let drinkById = await db.getById(id)
        return res.status(200).send({ msg: 'Producto solicitado es: ', drinkById })
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`)
    }
}

const productPost = async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body
        const obj = await joiValidator.product.validateAsync({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        })
        const productAdd = await db.addProduct(obj)
        return res.status(200).send({ msg: 'Producto cargado con éxito', productAdd })
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`)
    }
}

const productPut = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, code, price, status, stock, category, thumbnails } = req.body
        const product = await joiValidator.product.validateAsync({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        })
        const productUpdate = await db.updateProd(id, product)

        res.status(200).send({ msg: 'Producto actualizado', productUpdate })
    } catch (error) {
        console.log(error)
    }
}

const productDelete = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const productDelete = await db.getById(id)
        if (!productDelete) {
            throw { error: 'Producto no existente' }
        }
        const products = await db.deleteProduct(id)

        res.status(200).send({
            mensaje: 'Producto  eliminado',
            productoEliminado: productDelete,
            productsInList: products
        })
    } catch (error) {
        console.log(error)
    }
}

const getCartById = async (req, res) => {
    try {
        let id = parseInt(req.params.id)
        let cartById = await dbCart.getCartById(id)
        return res.status(200).send({ msg: 'El carrito solicitado es: ', cartById })
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`)
    }
}

const cartPost = async (req, res) => {
    try {
        let newCart = await dbCart.addCart()
        res.status(200).send(newCart)
    } catch (error) {
        console.log(error)
    }
}
const prodPostInC = async (req, res) => {
    try {
        let idC = parseInt(req.params.id)
        let idP = parseInt(req.params.pid)
        const prodPinC = await dbCart.addProdInCart(idC, idP)
        res.status(200).send(prodPinC)
    } catch (error) {
        console.log(error)
    }
}

export { productGet, getProductById, productPost, productPut, productDelete, getCartById, cartPost, prodPostInC }