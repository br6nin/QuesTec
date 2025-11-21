// src/app/blog/client.js

import * as contentful from 'contentful';

// Use suas credenciais reais aqui
const SPACE_ID = 'arroyiegi1cz'; 
const ACCESS_TOKEN = '2alEnJ6NPJ_x-ftA1ZRH2O-C_CaAdsTc0llRJYFOTow'; 

export const client = contentful.createClient({
    space: SPACE_ID,
    accessToken: ACCESS_TOKEN
});

// Função para buscar a lista de posts (Usada por index.jsx)
export async function fetchPosts() {
    try {
        const response = await client.getEntries({
            content_type: 'post', 
            order: '-fields.publishDate' 
        });
        return response.items;
    } catch (error) {
        console.error("Erro ao buscar lista de posts:", error);
        return [];
    }
}

// Função para buscar um único post por slug (Usada por [slug]/index.jsx)
export async function fetchPostDetail(slug) {
    if (!slug) return null;
    try {
        const response = await client.getEntries({
            content_type: 'post',
            'fields.slug': slug, 
            limit: 1 
        });
        return response.items[0] || null;
    } catch (error) {
        console.error(`Erro ao buscar post com slug ${slug}:`, error);
        return null;
    }
}