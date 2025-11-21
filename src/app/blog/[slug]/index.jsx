// src/app/blog/[slug]/index.jsx
'use client'; // Indica que este é um Componente Cliente (se estiver no Next.js App Router)

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Hook para acessar os parâmetros da URL
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'; // Melhor forma de renderizar Rich Text no React

// Importa o cliente Contentful e a função de busca
import { client } from '../client'; 
// Importa a função de busca que você colocou em client.js (se for o caso)

// Função para buscar um único post por slug
async function fetchPostDetail(slug) {
    if (!slug) return null;
    
    const response = await client.getEntries({
        content_type: 'post',
        'fields.slug': slug, 
        limit: 1 
    });
    
    return response.items[0] || null;
}

const PostDetail = () => {
    // 1. Obter o 'slug' da rota (URL Limpa)
    const router = useRouter();
    const { slug } = router.query;
    
    // 2. States para dados e status
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Efeito para buscar os dados
    useEffect(() => {
        if (!slug) return; // Espera o slug estar disponível na URL

        fetchPostDetail(slug)
            .then(fetchedPost => {
                if (fetchedPost) {
                    setPost(fetchedPost);
                } else {
                    setError("Post não encontrado.");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar detalhes do post:", err);
                setError("Erro de Conexão. Não foi possível carregar o conteúdo.");
                setLoading(false);
            });
    }, [slug]); // Roda sempre que o 'slug' mudar

    // 4. Renderização Condicional
    if (loading) {
        return <div className="post-detail-container">Carregando post...</div>;
    }

    if (error) {
        return <div className="post-detail-container"><h1>{error}</h1></div>;
    }

    // Se tudo deu certo, renderiza o post
    const postData = post.fields;
    const publishDate = new Date(postData.publishDate).toLocaleDateString('pt-BR');
    
    const imageUrl = postData.featuredImage ? 
        `https:${postData.featuredImage.fields.file.url}` : 
        'placeholder.jpg';

    // 5. O retorno do Componente (o JSX que substitui o innerHTML)
    return (
        <main className="post-detail-container">
            <article className="full-post-article">
                
                {/* Atualiza o título da aba do navegador (React Helmet é melhor, mas faremos o básico) */}
                <title>{postData.title}</title>

                <h1 className="post-header-title">{postData.title}</h1>
                <p className="post-meta">Publicado em: {publishDate}</p>
                
                <img src={imageUrl} alt={postData.title} className="post-featured-image" />
                
                <div className="post-content-body">
                    {/* Renderiza o Rich Text do Contentful corretamente no React */}
                    {documentToReactComponents(postData.body)} 
                </div>
                
                <hr />
                <a href="/blog">← Voltar para a lista de posts</a>
            </article>
        </main>
    );
};

export default PostDetail;