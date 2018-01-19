module.exports = function(sequelize, Sequelize) {

    var Team = sequelize.define('team', {

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
        }



    });

    return Team;

}
