// routes.js
import { randomUUID } from 'crypto';

// Banco de dados em memória
const produtos = []; 

export const manipuladorDeRotas = (request, response) => {
  const { method, url, body } = request;

  // 1. READ (Listar todos os produtos)
  if (url === '/produtos' && method === 'GET') {
    response.writeHead(200);
    return response.end(JSON.stringify(produtos));
  }

  // 2. CREATE (Cadastrar um novo produto)
  if (url === '/produtos' && method === 'POST') {
    const { nome, preco, categoria } = body;
    
    const novoProduto = {
      id: randomUUID(),
      nome,
      preco,
      categoria
    };
    
    produtos.push(novoProduto);
    
    response.writeHead(201);
    return response.end(JSON.stringify({ 
      mensagem: "Produto cadastrado com sucesso!", 
      produto: novoProduto 
    }));
  }

  // =================================================================
  // LÓGICA PARA ROTAS COM PARÂMETRO (Ex: /produtos/123-456-789)
  // =================================================================
  
  // Verifica se a URL começa com /produtos/ e tem 3 partes (ex: ['', 'produtos', 'id'])
  const isRotaProdutoComId = url.startsWith('/produtos/') && url.split('/').length === 3;

  if (isRotaProdutoComId) {
    // Dividimos a string e pegamos o ID (posição 2)
    const id = url.split('/')[2]; 
    
    // Busca o índice do produto no banco de dados
    const indexProduto = produtos.findIndex(produto => produto.id === id);

    // Se retornar -1, o produto não existe
    if (indexProduto === -1) {
      response.writeHead(404);
      return response.end(JSON.stringify({ erro: "Produto não encontrado." }));
    }

    // 3. UPDATE (Atualizar um produto existente)
    if (method === 'PUT') {
      const { nome, preco, categoria } = body;
      
      // Atualiza os dados mantendo o que não foi alterado
      produtos[indexProduto] = {
        ...produtos[indexProduto],
        nome: nome ?? produtos[indexProduto].nome,
        preco: preco ?? produtos[indexProduto].preco,
        categoria: categoria ?? produtos[indexProduto].categoria,
      };

      response.writeHead(200);
      return response.end(JSON.stringify({ 
        mensagem: "Produto atualizado com sucesso!", 
        produto: produtos[indexProduto] 
      }));
    }

    // 4. DELETE (Deletar um produto)
    if (method === 'DELETE') {
      // Remove o item do array
      produtos.splice(indexProduto, 1);
      
      // 204 No Content (Sucesso, sem corpo na resposta)
      response.writeHead(204);
      return response.end();
    }
  }

  // Rota 404 (Fallback)
  response.writeHead(404);
  return response.end(JSON.stringify({ erro: "Rota ou método não encontrado." }));
};