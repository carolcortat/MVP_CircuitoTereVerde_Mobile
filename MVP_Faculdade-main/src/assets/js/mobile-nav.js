// Controla o menu hamburguer e o submenu "Parques" em telas mobile.
// Não interfere no comportamento desktop (hover), que continua feito via CSS.
document.addEventListener('DOMContentLoaded', function () {
  var cabecalho = document.querySelector('.cabecalho');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.cabecalho nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var aberto = nav.classList.toggle('nav-aberta');
      toggle.classList.toggle('ativo', aberto);
      toggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
  }

  // No mobile, o submenu "Parques" abre com toque em vez de hover.
  document.querySelectorAll('.submenu > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width: 768px)').matches) {
        e.preventDefault();
        this.parentElement.classList.toggle('submenu-aberto');
      }
    });
  });

  // Fecha o menu mobile ao clicar em um link de destino real.
  document.querySelectorAll('.cabecalho nav a:not(.submenu > a)').forEach(function (link) {
    link.addEventListener('click', function () {
      if (nav && nav.classList.contains('nav-aberta')) {
        nav.classList.remove('nav-aberta');
        if (toggle) {
          toggle.classList.remove('ativo');
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
});
