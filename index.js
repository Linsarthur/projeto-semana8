import { where } from "sequelize";
import { connection, authenticate } from "./config/database.js";
import { Cliente } from "./models/cliente.js";
import { Endereco } from "./models/endereco.js";
import { Pet } from "./models/pet.js";
import express from "express";

authenticate(connection).then(() => {
  //após conectar no banco de dados, ele irá sincronizar os models no banco, ou seja, irá gerar as tebelas caso necessário.
  //force: true -> dropa tudo e cria do zero novamente.
  //force: true é recomendado somente durante o desenvolvimento, quando subir para produção remover.
  // connection.sync({force: true});
  connection.sync();
});
//Definir a aplicação backend em express
//Recursos pré-configurados
const app = express();
app.use(express.json());
//Definir os endpoints do backend
//Métodos: GET (leitura), POST (inserção), PUT (alteração), DELETE (remoção)
app.get("/", (req, res) => {
  //manipulador de rota
  res.send("Hello world!"); //Enviando a resposta de quem solicitou
});
//Listagem de todos os clientes
app.get("/clientes", async (req, res) => {
  // findAll = select * from clientes
  const listaClientes = await Cliente.findAll();
  res.json(listaClientes); //res.send está sendo a resposta da requisição para mostrar na tela.
});
//Listagem de um cliente específico (id = ?)
// :id => parâmetro de rota
app.get("/clientes/:id", async (req, res) => {
  const cliente = await Cliente.findOne({
    where: { id: req.params.id },
    include: [Endereco], // juntar os dados do cliente com seu respectivo endereço.
  });
  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ message: "Cliente não encontrado!" });
  }
});
//Utilizando o POST(Adição)
app.post("/clientes", async (req, res) => {
  //Extraimos os dados do body que serão usados na inserção
  const { nome, email, telefone, endereco } = req.body;
  try {
    //tentativa de inserir o cliente
    await Cliente.create(
      { nome, email, telefone, endereco },
      { include: [Endereco] } //indicamos que o endereço será salve e associado ao cliente
    );
    res.json({ message: "Cliente criado com sucesso" });
  } catch (err) {
    //tratamento caso ocorra algum erro
    //500 é um erro interno.
    res.status(500).json({ message: "Um erro ocorreu ao inserir cliente." });
  }
});
//Utilizando o PUT (alteração)
app.put("/clientes/:id", async (req, res) => {
  // Checar se o cliente existe
  const idCliente = req.params.id;
  const { nome, email, telefone, endereco } = req.body;
  try {
    const cliente = await Cliente.findOne({ where: { id: idCliente } });

    if (cliente) {
      //seguir com a atualização
      //Atualiza a linha do endereço que for o id do cliente
      //for igual ao id do cliente sendo atualizado
      await Endereco.update(endereco, { where: { clienteID: idCliente } });
      await cliente.update({ nome, email, telefone });
      res.json({ message: "Cliente atualizado." });
    } else {
      //404
      res.status(404).json({ message: "O cliente não foi encontrado!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Ocorreu um erro ao atualizar o cliente" });
  }
});
app.delete("/clientes/:id", async (req, res) => {
  const idCliente = req.params.id;
  try{
      const cliente = await Cliente.findOne({ where: { id: idCliente }})
      if(cliente){
        //apagar o cliente
        await cliente.destroy();
        res.json({ message: "cliente removido com sucesso!" })
      } else{
        res.status(404).json({ message: "cliente não encontrado!" })
      }
    } catch{
      res.status(500).json({ message: "Ocorreu um erro ao excluir cliente!" })
      
    }
  
})


//Rodar a aplicação backend
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost3000/");
});
