// src/app/blog/client.js

// USE SEUS VALORES REAIS AQUI
const SPACE_ID = 'arroyiegi1cz';
const ACCESS_TOKEN = '2alEnJ6NPJ_x-ftA1ZRH2O-C_CaAdsTc0llRJYFOTow'; 

// O SDK do Contentful precisa ser importado (você o está carregando via CDN no HTML, mas aqui é um framework)
// Adicione esta dependência ao seu package.json: npm install contentful
import * as contentful from 'contentful'; 

export const client = contentful.createClient({
    space: SPACE_ID,
    accessToken: ACCESS_TOKEN
});

// A função que busca os posts
export async function fetchPosts() {
    const response = await client.getEntries({
        content_type: 'post', 
        order: '-fields.publishDate' 
    });
    return response.items;
}