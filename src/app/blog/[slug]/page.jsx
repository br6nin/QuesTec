// src/app/blog/[slug]/index.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Roteador nativo do Next.js
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'; // Renderizador de Rich Text
import { fetchPostDetail } from '../client'; 
import '../styles.css';

const PostDetail = () => {
    const params = useParams();
    // Obtém o 'slug' da URL limpa (/blog/meu-slug)
    const slug = params.slug; 
    
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return; 

        fetchPostDetail(slug)
            .then(fetchedPost => {
                if (fetchedPost) {
                    setPost(fetchedPost);
                } else {
                    setError("Post não encontrado. O link pode estar incorreto.");
                }
                setLoading(false);
            })
            .catch(err => {
                setError("Erro de Conexão. Não foi possível carregar o conteúdo.");
                setLoading(false);
            });
    }, [slug]); 

    if (loading) {
        return <main className="post-detail-container">Carregando post...</main>;
    }

    if (error) {
        return <main className="post-detail-container"><h1>{error}</h1><p><a href="/blog">Voltar</a></p></main>;
    }

    const postData = post.fields;
    const publishedDate = new Date(postData.publishedDate).toLocaleDateString('pt-BR');
    const imageUrl = postData.featuredImage ? 
        `https:${postData.featuredImage.fields.file.url}` : 
        'placeholder.jpg'; 

    return (
        <main className="post-detail-container">
            {/* O código JSX que substitui o HTML */}
            <article className="full-post-article">
                <title>{postData.title}</title> 
                <h1 className="post-header-title">{postData.title}</h1>
                <p className="post-meta">Publicado em: {publishedDate}</p>
                
                <img src={imageUrl} alt={postData.title} className="post-featured-image" />
                
                <div className="post-content-content">
                    <div classname="prose max-w-none">
                    {/* Renderiza o Rich Text do Contentful */}
                    {documentToReactComponents(postData.content)}
                    </div> 
                </div>
                
                <hr />
                <a href="/blog">← Voltar para a lista de posts</a>
            </article>
        </main>
    );
};

export default PostDetail;