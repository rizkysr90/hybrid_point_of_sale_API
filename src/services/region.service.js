const { success } = require('../utils/response.util');
const {region, sequelize} = require('./../../models');

const getProvince = async (req) => {
    const find = await sequelize.query(`SELECT * FROM regions WHERE length(kode) = 2 ORDER BY nama ASC`);
    return success(200,find[0], 'sukses');
}

const getStateByProvince = async (req) => {
    // req params id would be = 11
    const find = await sequelize.query(`SELECT * FROM regions WHERE kode LIKE '${req.params?.id}___' AND length(kode) = 5 ORDER BY nama ASC`);
    return success(200, find[0], 'sukses');
} 
const getDistrict = async (req) => {
    // req params id would be = 11.02
   const find = await sequelize.query(`SELECT * FROM regions WHERE kode LIKE '${req.params?.id}___' AND length(kode) = 8 ORDER BY nama ASC`); 
   return success(200, find[0], 'sukses');
}

const getVillage = async (req) => {
    // req params id would be = 11.02.02
    const find = await sequelize.query(`SELECT * FROM regions WHERE kode LIKE '${req.params?.id}%' AND length(kode) = 13 ORDER BY nama ASC`); 
    return success(200, find[0], 'sukses');

}


module.exports = {
    getProvince,
    getStateByProvince,
    getDistrict,
    getVillage
}