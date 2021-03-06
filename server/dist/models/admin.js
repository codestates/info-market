"use strict";
// import { Model } from 'sequelize';
Object.defineProperty(exports, "__esModule", { value: true });
// interface AdminAttributes {
//   email: string;
//   password: string;
//   grade: string;
// }
// module.exports = (sequelize: any, DataTypes: any) => {
//   class Admin extends Model<AdminAttributes> implements AdminAttributes {
//     public readonly id!: string;
//     public email!: string;
//     public password!: string;
//     public grade!: string;
//     public readonly createdAt!: Date; //굳이 안넣어줘도 될 것 같지만 공식문서에 있으니깐 일단 넣어줌.
//     public readonly updatedAt!: Date;
//   }
//   Admin.init(
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
//         allowNull: false,
//         defaultValue: 'admin',
//       },
//     },
//     {
//       sequelize,
//       timestamps: true,
//       underscored: false,
//       modelName: 'Admin',
//       tableName: 'admin',
//       paranoid: true,
//       // mb4 -> 이모티콘도 사용 가능
//       charset: 'utf8mb4',
//       collate: 'utf8mb4_general_ci',
//     },
//   );
//   return Admin;
// };
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Admin extends sequelize_1.Model {
}
Admin.init({
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
        allowNull: false,
        defaultValue: 'admin',
    },
}, {
    sequelize: sequelize_2.sequelize,
    timestamps: true,
    underscored: false,
    modelName: 'Admin',
    tableName: 'admin',
    paranoid: true,
    // mb4 -> 이모티콘도 사용 가능
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
});
exports.default = Admin;
