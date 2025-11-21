// src/app/blog/index.jsx
'use client'; 

import React, { useState, useEffect } from 'react';
import { fetchPosts } from './client'; // Importa a função de busca
import Link from 'next/link'; // Usaremos o componente Link nativo do Next.js

const BlogIndex = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPosts()
            .then(items => {
                setPosts(items);
                setLoading(false);
            })
            .catch(err => {
                setError("Não foi possível carregar a lista de posts.");
                setLoading(false);
            });
    }, []); 

    if (loading) {
        return <main id="posts-container" style={{ textAlign: 'center', padding: '50px' }}>Carregando posts...</main>;
    }

    if (error) {
        return <main id="posts-container" style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</main>;
    }

    return (
        <main id="posts-container" className="blog-grid-layout">
            {posts.map(post => {
                const postData = post.fields;
                const title = postData.title;
                const slug = postData.slug;
                const publishedDate = new Date(postData.publishedDate).toLocaleDateString('pt-BR');
                const imageUrl = postData.featuredImage 
                    ? `https:${postData.featuredImage.fields.file.url}` 
                    : 'placeholder.jpg';
                
                return (
                    // Usando Link do Next.js para roteamento limpo!
                    <Link key={post.sys.id} href={`/blog/${slug}`} passHref legacyBehavior>
                        <article className="blog-card">
                            <img src={imageUrl} alt={title} className="card-image"/>
                            <div className="card-content">
                                <h3>{title}</h3>
                                <p className="date">Publicado em: {publishedDate}</p>
                                <a className="read-more-link">Ler Post Completo</a>
                            </div>
                        </article>
                    </Link>
                );
            })}
        </main>
    );
};

export default BlogIndex;