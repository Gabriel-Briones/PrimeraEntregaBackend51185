import fs from 'fs';

export default class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getProduct() {
        try {
            const objs = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(objs)
        } catch (error) {
            console.log("Error al leer el archivo.", error);
            return []
        }
    }

    async addProduct(obj) {
        const objs = await this.getProduct();
        let newId;

        if (objs.length == 0) {
            newId = 1;
        } else {
            newId = objs[objs.length - 1].id + 1;
        }

        const newObj = { ...obj, id: newId }
        objs.push(newObj);
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(objs, null, 2));
            return newObj
        } catch (error) {
            console.log(`Error al añadir producto ${error}`)
        }
    }

    async updateProd(id, newProd) {

        const productos = await this.getProduct()

        const idProd = parseInt(id)
        const productoAModificar = productos.find(producto => producto.id === idProd);

        if (!productoAModificar) {
            return `Producto no disponible`
        }

        //Indice objeto a modificar
        const index = productos.findIndex(producto => producto === productoAModificar)

        const { title, description, code, price, status, stock, category, thumbnails } = newProd;

        productoAModificar.title = title;
        productoAModificar.description = description;
        productoAModificar.code = code;
        productoAModificar.price = price;
        productoAModificar.status = status;
        productoAModificar.stock = stock;
        productoAModificar.category = category;
        productoAModificar.thumbnails = thumbnails;

        productos.splice(index, 1, productoAModificar);
        await fs.promises.writeFile(this.path, JSON.stringify(productos, 'utf-8'))

        return productoAModificar
    }

    async getById(id) {
        let objId = parseInt(id)
        const objs = await this.getProduct()
        const obj = objs.find(o => o.id === objId);
        return obj
    }

    async deleteProduct(id) {
        try {
            const elements = await this.getProduct();
            const elementIndex = elements.findIndex((elem) => elem.id === id)

            if (elementIndex === -1) return { error: "Producto no encontrado" }

            const newElements = elements.filter((elem) => elem.id != id)
            await fs.promises.writeFile(this.path, JSON.stringify(newElements, null, 3))
            return elements
        } catch (error) {
            return (error)
        }
    }

    async deleteAll() {
        await fs.promises.writeFile(`./${this.path}`, '');
        console.log('Borrar todos los productos')
    }
}