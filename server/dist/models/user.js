"use strict";
// 'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
// const { Model, Sequelize, DataTypes } = require('sequelize');
// interface UserAttribute {
//   email: string;
//   password: string;
//   grade: string;
//   nickname: string;
//   phone: string;
//   point: number;
// }
// module.exports = (sequelize: any, DataTypes: any) => {
//   class User extends Model<UserAttribute> implements UserAttribute {
//     public readonly id!: string;
//     public email!: string;
//     public password!: string;
//     public nickname!: string;
//     public phone!: string;
//     public grade!: string;
//     public point!: number;
//     public readonly createdAt!: Date; //굳이 안넣어줘도 될 것 같지만 공식문서에 있으니깐 일단 넣어줌.
//     public readonly updatedAt!: Date;
//     public readonly deletedAt!: Date;
//     public static associate(models: any) {
//       User.hasMany(models.Info, {
//         onDelete: 'CASCADE',
//       });
//       User.hasMany(models.Reply, {
//         onDelete: 'CASCADE',
//       });
//       User.belongsToMany(models.Info, {
//         through: 'Like',
//         onDelete: 'CASCADE',
//       });
//       User.belongsToMany(models.Info, {
//         through: 'Payment',
//         onDelete: 'CASCADE',
//       });
//     }
//   }
//   User.init(
//     {
//       email: {
//         type: DataTypes.STRING(50),
//         allowNull: false,
//       },
//       password: {
//         type: DataTypes.STRING(255),
//         allowNull: false,
//       },
//       grade: {
//         type: DataTypes.STRING(50),
//         allowNull: true,
//         defaultValue: 'Bronze',
//       },
//       nickname: {
//         type: DataTypes.STRING(50),
//         allowNull: false,
//       },
//       phone: {
//         type: DataTypes.STRING(50),
//         allowNull: false,
//       },
//       point: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         defaultValue: 0,
//       },
//     },
//     {
//       sequelize,
//       timestamps: true,
//       underscored: false,
//       modelName: 'User',
//       tableName: 'users',
//       paranoid: true,
//       // mb4 -> 이모티콘도 사용 가능
//       charset: 'utf8mb4',
//       collate: 'utf8mb4_general_ci',
//     },
//   );
//   return User;
// };
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    grade: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'Bronze',
    },
    nickname: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    point: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
}, {
    sequelize: sequelize_2.sequelize,
    timestamps: true,
    underscored: false,
    modelName: 'User',
    tableName: 'user',
    paranoid: true,
    // mb4 -> 이모티콘도 사용 가능
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
});
const associate = (db) => {
    db.User.hasMany(db.Info, {
        foreignKey: 'userId',
        sourceKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    db.User.hasMany(db.Reply, {
        foreignKey: 'userId',
        sourceKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    db.User.belongsToMany(db.Info, {
        foreignKey: 'userId',
        sourceKey: 'id',
        through: 'Like',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    db.User.belongsToMany(db.Info, {
        foreignKey: 'userId',
        sourceKey: 'id',
        through: 'Payment',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};
exports.associate = associate;
exports.default = User;
