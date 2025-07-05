const bcrypt = require('bcryptjs');

// Generate password hash
const password = 'SnakkazMCP2025!';
const hash = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('Verification:', bcrypt.compareSync(password, hash));
