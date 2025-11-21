// Substitua COM SEUS VALORES REAIS do Passo 1
const SPACE_ID = 'arroyiegi1cz';
const ACCESS_TOKEN = '2alEnJ6NPJ_x-ftA1ZRH2O-C_CaAdsTc0llRJYFOTow'; 

// O SDK do Contentful é a maneira mais fácil de interagir com a API
const client = contentful.createClient({
    space: SPACE_ID,
    accessToken: ACCESS_TOKEN
});

// A função que busca os posts (apenas os do tipo 'post')
async function fetchPosts() {
    try {
        const response = await client.getEntries({
            content_type: 'post', // O Field ID que definimos no Passo 2
            order: '-fields.publishDate' // Ordena do mais novo para o mais antigo
        });

        // Chama a função para exibir os posts na página
        displayPosts(response.items);

    } catch (error) {
        console.error("Erro ao buscar conteúdo do Contentful:", error);
        document.getElementById('posts-container').innerHTML = '<p>Erro ao carregar o blog. Tente novamente mais tarde.</p>';
    }
}

// Inicializa a busca quando a página carregar
document.addEventListener('DOMContentLoaded', fetchPosts);

function displayPosts(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = ''; // Limpa o container antes de adicionar o conteúdo

    posts.forEach(post => {
        const postData = post.fields;
        
        // --- 1. Extrair os dados
        const title = postData.title;
        const slug = postData.slug;
        const publishDate = new Date(postData.publishDate).toLocaleDateString('pt-BR');
        
        // Contentful armazena imagens como objetos linkados
        // Precisamos do URL da imagem
        const imageUrl = postData.featuredImage ? 
            postData.featuredImage.fields.file.url : 
            'placeholder.jpg'; // URL de fallback se não houver imagem

        // --- 2. Criar o elemento HTML (o "Card" do Post)
        const postCard = document.createElement('article');
        postCard.className = 'blog-card'; // Use essa classe para estilizar com CSS

        postCard.innerHTML = `
            <img src="${imageUrl}" alt="${title}" class="card-image">
            <div class="card-content">
                <h3>${title}</h3>
                <p class="date">Publicado em: ${publishDate}</p>
                <a href="${slug}" class="read-more-link">Ler Post Completo</a>
            </div>
        `;
        `;
        
        // --- 3. Adicionar o card ao container na página
        container.appendChild(postCard);
    });
}