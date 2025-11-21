// Substitua COM SEUS VALORES REAIS do Contentful
const SPACE_ID = 'arroyiegi1cz'; 
const ACCESS_TOKEN = '2alEnJ6NPJ_x-ftA1ZRH2O-C_CaAdsTc0llRJYFOTow'; 

const client = contentful.createClient({
    space: SPACE_ID,
    accessToken: ACCESS_TOKEN
});

// A função mágica do renderizador para converter o Rich Text JSON em HTML
const { documentToHtmlString } = contentful.richText.documentToHtmlString;


// 1. Função para extrair o 'slug' da URL (o identificador do post)
function getSlugFromUrl() {
    // Busca o valor do parâmetro '?slug=' na URL
    const params = new URLSearchParams(window.location.search);
    return params.get('slug'); 
}


// 2. Função que busca o post específico no Contentful
async function fetchPostDetail() {
    const slug = getSlugFromUrl();
    const container = document.getElementById('post-detail-container');
    
    if (!slug) {
        container.innerHTML = '<h1>Erro: Post não encontrado.</h1><p>O link está incompleto.</p>';
        return;
    }

    try {
        // Usa o filtro 'fields.slug' para buscar o item com o slug correspondente
        const response = await client.getEntries({
            content_type: 'post', // O Field ID que você criou
            'fields.slug': slug, 
            limit: 1 
        });

        const post = response.items[0];

        if (!post) {
            container.innerHTML = '<h1>Post não encontrado.</h1><p>Parece que este post foi removido ou nunca existiu.</p>';
            return;
        }

        displayPostDetail(post);

    } catch (error) {
        console.error("Erro ao buscar detalhes do post:", error);
        container.innerHTML = '<h1>Erro de Conexão.</h1><p>Não foi possível carregar o conteúdo.</p>';
    }
}


// 3. Função que injeta o conteúdo na página
function displayPostDetail(post) {
    const postData = post.fields;
    const container = document.getElementById('post-detail-container');
    
    // Atualiza o <title> da aba do navegador
    document.getElementById('post-title-tag').textContent = postData.title;

    // Converte o campo 'body' (Rich Text) para HTML
    const htmlBodyContent = documentToHtmlString(postData.body);

    // Constrói o URL da imagem. Contentful URLs são relativas, então adicionamos 'https:'
    const imageUrl = postData.featuredImage ? 
        `https:${postData.featuredImage.fields.file.url}` : 
        'placeholder.jpg'; 

    container.innerHTML = `
        <article class="full-post-article">
            <h1 class="post-header-title">${postData.title}</h1>
            <p class="post-meta">Publicado em: ${new Date(postData.publishDate).toLocaleDateString('pt-BR')}</p>
            
            <img src="${imageUrl}" alt="${postData.title}" class="post-featured-image">
            
            <div class="post-content-body">
                ${htmlBodyContent} 
            </div>
            
            <hr>
            <a href="blog.html">← Voltar para a lista de posts</a>
        </article>
    `;
}

// Inicia o processo quando a página está pronta
document.addEventListener('DOMContentLoaded', fetchPostDetail);