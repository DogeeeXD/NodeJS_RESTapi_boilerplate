export default (sequelize, DataTypes) => {
  // User is used in passport.js
  const User = sequelize.define(
    // Table name
    // Change according to the User table in your database
    'USER',
    {
      UID: DataTypes.STRING,
      ROLE: DataTypes.STRING,
      EMAIL: DataTypes.STRING,
      USERNAME: DataTypes.STRING,
      PWD: DataTypes.STRING,
    },
    {
      // Options
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
  );

  // Add this if you want to disable the id query automatically performed by Sequelize
  User.removeAttribute('id');

  User.associate = function(models) {
    // associations go here
  };

  return User;
};
