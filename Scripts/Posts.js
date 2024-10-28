$(document).ready(function () {

    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/posts",
        method: "GET",
        beforeSend: function() {
            showLoading();
            $('#posts-container').html('<p>Carregando posts...</p>');
        },
        success: function (response) {
            hideLoading();
            response.forEach(retorno => {
                const posts = `
                    <div>
                        <div userId="${retorno.userId}" postId="${retorno.id}">
                            <h1 >${retorno.title}</h1>
                            <p>${retorno.body}</p>
                            <div class="container">
                                <button class="expand-button" onclick="carregarComentarios(${retorno.id})">Expandir</button>
                                <div class="content" id="content${retorno.id}">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $('.listagem').append(posts);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Erro na requisição:", textStatus, errorThrown);
        },
    });
});

function showLoading() {
    $('#loading').show();
}

function hideLoading() {
    $('#loading').hide();
}


function carregarComentarios(IdPost) {
    const content = document.getElementById('content'+IdPost);
    if (content.style.display  === 'block') {
        content.style.display = 'none';
    } else {
        showLoading();
        content.style.display = 'block';
        
        content.innerHTML='';

        const apiUrl = `https://jsonplaceholder.typicode.com/comments?postId=${IdPost}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                hideLoading();
                data.forEach(photo => {
                    const comments = `
                        <p><b>Name:</b> ${photo.name}</p>
                        <p>Email: ${photo.email}</p>
                        <p>Body: ${photo.body}</p>
                    `;
                    if(!content.innerHTML.match(comments)){
                        content.innerHTML+=comments;
                    }
                });
            })
            .catch(error => console.error('Erro ao buscar os dados:', error))
            .finally(() => {
                $('#loading').hide();
            });;
        
    }
}
var allExpanded= false;
function carregarTodosComentarios() {
    
        const apiUrl = `https://jsonplaceholder.typicode.com/comments`;
        const contents = document.getElementsByClassName('content');
        
        const contentArray = Array.prototype
            .slice.call(contents);
            contentArray.forEach(content=>{
            if (content.style.display  === 'block') {
                content.style.display = 'none';
                content.innerHTML="";
                allExpanded=false
            }
            else {
                content.style.display = 'block';
                allExpanded=true;
            }
        });
        if(allExpanded){
            showLoading();
            fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                hideLoading();
                data.forEach(photo => {
                    const content = document.getElementById('content'+photo.postId);
                        content.style.display = 'block';

                        const comments = `
                        <p><b>Name:</b> ${photo.name}</p>
                        <p>Email: ${photo.email}</p>
                        <p>Body: ${photo.body}</p>
                        `;
                    
                        content.innerHTML +=comments;
                }
                );
            })
            .catch(error => console.error('Erro ao buscar os dados:', error))
            .finally(() => {
                $('#loading').hide();
            });;
        }
}