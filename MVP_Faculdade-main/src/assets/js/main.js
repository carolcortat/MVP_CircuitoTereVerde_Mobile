document.addEventListener('DOMContentLoaded', () => {
    const carrosselImagem = document.getElementById('carrossel-imagem');
    const voltarBotao = document.getElementById('voltar-botao');
    const proximoBotao = document.getElementById('proximo-botao');
    const imageCaption = document.getElementById('image-caption'); 

    const images = [
        { src: 'assets/images/fotos-parques/parque-serra-dos-orgaos02.jpg', caption: 'Parque Nacional da Serra dos Órgãos' },
        { src: 'assets/images/fotos-parques/parque-tres-picos-02.jpg', caption: 'Parque Estadual dos Três Picos' },
        { src: 'assets/images/fotos-parques/parque-montanha02.jpg', caption: 'Parque Natural Municipal Montanhas de Teresópolis' }
    ];

    let currentImageIndex = 0;

    function updateCarousel() {
        carrosselImagem.src = images[currentImageIndex].src;
        imageCaption.textContent = images[currentImageIndex].caption;
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateCarousel();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateCarousel();
    }

    voltarBotao.addEventListener('click', showPrevImage);
    proximoBotao.addEventListener('click', showNextImage);
    updateCarousel();
});
