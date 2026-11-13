import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json())


app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`)
    next();
});

let products = [
    { id: 1, name: 'Mechanical Keyboard', price: 120 },
    { id: 2, name: 'Wireless Gaming Mouse', price: 80 },
];

app.get('/api/products', (req, res) => {
    res.status(200).json(products);
});

app.get('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const product = products.find((p) => p.id === id);

    if (!product) { return res.status(404).json({ error: `Product #${id} not found.` }) };

    res.status(200).json(product);
});

app.post('/api/products', (req, res) => {
    const { name, price } = req.body;

    if (!name || typeof price !== 'number') {
        return res.status(400).json({ error: 'Invalid product data.' })
    }
    const newProduct = {
        id: products.length + 1,
        name,
        price,
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
})

app.delete('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const initialLength = products.length;
    products = products.filter((p) => p.id !== id);
    if (products.length === initialLength) {
        return res.status(404).json({ error: `Product #${id} not found` });
    }
    res.status(200).json({ message: `Product #${id} deleted successfully` });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint does not exist' });
});
app.listen(PORT, () => {
    console.log(`\nExpress REST API running at: http://localhost:${PORT}`);
    console.log(`Products Route: http://localhost:${PORT}/api/products\n`);
});
