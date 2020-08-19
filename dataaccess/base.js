const knex = require("../utils/Connector").getKnex();

class BaseDataAccess{
    constructor(tableName){
        this.tableName = tableName;
        this.knex = knex;
    }

    getAll(){
        return new Promise((resolve, reject) => {
            knex.from(this.tableName).select("*").then(rows => {
                resolve(rows);
            }).catch(err => {
                reject(err);
            });
        });
    }

    getOne(data){
        return new Promise((resolve, reject) => {
            knex.from(this.tableName).select("*").where(data).first().then(rows => {
                resolve(rows);
            }).catch(err => {
                reject(err);
            });
        });
    }

    insert(data){
        return new Promise((resolve, reject) => {
            knex(this.tableName).insert(data).then(() => {
                resolve("data inserted");
            }).catch(err => {
                reject(err);
            });
        });
    }

    update(where, data){
        return new Promise((resolve, reject) => {
            knex(this.tableName).where(where).update(data).then(() => {
                resolve("data updated");
            }).catch(err => {
                reject(err);
            });
        });
    }

    remove(where){
        return new Promise((resolve, reject) => {
            knex(this.tableName).where(where).delete().then(() => {
                resolve("data deleted");
            }).catch(err => {
                reject(err)
            });
        });
    }
}

module.exports = BaseDataAccess;