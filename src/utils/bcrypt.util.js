const bcrypt = require('bcrypt');
const saltRounds = +process.env.SALT;


const hash = async (plainPassword) => {
    return await bcrypt.hash(plainPassword,saltRounds);
}
const compare = async(plainPassword,hash) => {
    return await bcrypt.compare(plainPassword,hash);
}

module.exports = {
    hash,compare
}