// Modelo para gerar a tabela de clientes no mysql
//Mapeamento: cada propriedade que definimos vira uma coluna da tabela

import { DataTypes } from "sequelize"
import {connection} from "../config/database.js"
import { Endereco } from "./endereco.js";
import { Pet } from "./pet.js";


//O nome da connection não precisa ser igual ao nome da constante. Apenas para fins didaticos foi feito assim.

// obs: O sequelize define implicitamente a chave primária.

export const Cliente = connection.define("cliente", {
   // Configurando a coluna 'nome'
   
    nome: { //No sql ficaria = nome VARCHAR(130)
        type: DataTypes.STRING(130),  //Define a coluna 'nome' como VARCHAR
        allowNull: false, // Torna a coluna not null
    },
    email:{ // No mysql seria como: email varchar(255) unique not null
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
      telefone:{
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    }
}); 

// Associação 1:1 (Cliente-Endereço).
// Cliente tem um endereço.
// Endereço ganha uma chave estrangeira.

//Criação de chave estrangeira.

//cascade indica que se o clite for deletado, o endereço será deletado também de forma automática

Cliente.hasOne(Endereco, {onDelete: "CASCADE"}); //Cliente tem somente UM endereço 
Endereco.belongsTo(Cliente); // O endereço pertence SOMENTE ao cliente, gerando uma chave estrangeira na tabela de endereço.

//Associação de 1:N (Cliente-pet)

Cliente.hasMany(Pet, {onDelete: "CASCADE"});
Pet.belongsTo(Cliente); //Gerando uma chave estrangeira pelo responsável pelo pet.

//Onde o cliente tem muitos pets e o pet pertence somente um cliente.

//cliente = model = gerenciar a tabela de clientes

// cliente.findALl () -> Listar todos os clientes na tabela.
// cliente.update(novosDados) -> atualizar um cliente específico
// cliente. destroy() -> apagar o cliente da tabela
// cliente.findOne() -> AChar um cliente específico.