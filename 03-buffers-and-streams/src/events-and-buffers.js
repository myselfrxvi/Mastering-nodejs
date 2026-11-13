import { Buffer } from "node:buffer";
import { EventEmitter } from "node:events";

console.log("---Part 1. Buffer---")
const buf = Buffer.from('Node.js', 'utf-8');

console.log("Raw buffer:", buf)
console.log("Byte length in RAM:", buf.length, "Bytes");

console.log('Decoded as UTF-8 text         :', buf.toString('utf-8'));
console.log('Decoded as Base64 (for APIs)  :', buf.toString('base64'));
console.log('Decoded as Hexadecimal        :', buf.toString('hex'))


console.log("---Part 2. EventEmitter---");

const orderHub = new EventEmitter()

orderHub.on('order:completed', (order) => {
    console.log(`[Email service] Receipt send to ${order.customerEmail}`)
})

orderHub.on('order:completed', (order) => {
    console.log(`📦 [Warehouse Service]: Shipping item #${order.itemId} ($${order.price})`);
});

console.log('🛒 Customer clicks "Pay Now"...\n');
orderHub.emit('order:completed', {
    orderId: 101,
    customerEmail: 'bruce@wayne.corp',
    itemId: 'Batarang-V2',
    price: 250,
});
