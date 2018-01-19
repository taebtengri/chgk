module.exports = function(sequelize, Sequelize) {

    var Player = sequelize.define('player', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        name: {
            type: Sequelize.STRING,
            notEmpty: true
        },


        captain: {
            type: Sequelize.TEXT
        },

        team: {
            type: Sequelize.TEXT
        },

        photo: {
            type: Sequelize.TEXT
        },

        score: {
            type: Sequelize.INTEGER
        },



    });

    return Player;

}
