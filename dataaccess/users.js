const BaseDataAccess = require("./base");

class MembersDataAccess extends BaseDataAccess{
    constructor(){
        super("users");
    }
}

module.exports = MembersDataAccess;