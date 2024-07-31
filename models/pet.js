import { DataTypes } from "sequelize";
import { connection } from "../config/database.js";

export const Pet = connection.define ("pet", {
    nome:{
        type: DataTypes.STRING(90),
        allowNull:false
    },
    tipo:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    porte:{
        type: DataTypes.STRING,
        allowNull:false
    },
    dataNasc:{
        type: DataTypes.DATEONLY,
        
    }


});