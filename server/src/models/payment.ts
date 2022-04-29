import { Model } from 'sequelize';

interface PaymentAttribute {
  id: number;
  state: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Payment extends Model<PaymentAttribute> implements PaymentAttribute {
    public id!: number;
    public state!: string;

    public readonly createdAt!: Date; //굳이 안넣어줘도 될 것 같지만 공식문서에 있으니깐 일단 넣어줌.
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;

    public static associate(models: any) {
      Payment.belongsTo(models.User);
      Payment.belongsTo(models.Info);
    }
  }
  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      state: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Payment',
      tableName: 'payment',
      paranoid: true,
      // mb4 -> 이모티콘도 사용 가능
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  );
  return Payment;
};