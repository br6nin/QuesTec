// src/app/blog/index.jsx

import React, { useState, useEffect } from 'react';
import { fetchPosts } from './client'; // Importa a função de busca
// O Contentful Rich Text não é necessário aqui, só no post/[slug].jsx

// 1. O Componente Funcional (O que o framework espera)
const BlogIndex = () => {
    // 2. State para armazenar os posts e o status de carregamento
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Efeito para buscar os dados quando o componente é montado
    useEffect(() => {
        fetchPosts()
            .then(items => {
                setPosts(items);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar posts:", err);
                setError("Erro ao carregar o blog. Tente novamente mais tarde.");
                setLoading(false);
            });
    }, []); // O array vazio [] garante que rode apenas na montagem

    // 4. Renderização Condicional
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando posts...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</div>;
    }

    // 5. Retorno do JSX (Onde estava o HTML)
    return (
        <main id="posts-container" className="blog-grid-layout">
            {posts.map(post => {
                const postData = post.fields;
                const title = postData.title;
                const slug = postData.slug;
                const publishDate = new Date(postData.publishDate).toLocaleDateString('pt-BR');
                const imageUrl = postData.featuredImage 
                    ? `https:${postData.featuredImage.fields.file.url}` 
                    : 'placeholder.jpg';
                
                return (
                    // O HTML é substituído por JSX aqui
                    <article key={post.sys.id} className="blog-card">
                        <img src={imageUrl} alt={title} className="card-image"/>
                        <div className="card-content">
                            <h3>{title}</h3>
                            <p className="date">Publicado em: {publishDate}</p>
                            
                            {/* ROTEAMENTO LIMPO COM O FRAMEWORK */}
                            <a href={`/blog/${slug}`} className="read-more-link">
                                Ler Post Completo
                            </a>
                        </div>
                    </article>
                );
            })}
        </main>
    );
};

export default BlogIndex;