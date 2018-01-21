module.exports = function(sequelize, Sequelize) {

    var userteam = sequelize.define('userteam', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        userid: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },


        player: {
            type: Sequelize.INTEGER
        },

        isCaptain: {
            type: Sequelize.BOOLEAN
        },

        isLeader: {
            type: Sequelize.BOOLEAN
        },

        score: {
            type: Sequelize.INTEGER
        },

        price: {
            type: Sequelize.INTEGER
        }

        



    });

    return userteam;

}
