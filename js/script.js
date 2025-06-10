const estadosComClinicas = {
  "AC": true, "AL": false, "AP": false, "AM": false, "BA": true,
  "CE": false, "DF": true, "ES": false, "GO": true, "MA": false,
  "MT": false, "MS": false, "MG": false, "PA": false, "PB": false,
  "PR": false, "PE": false, "PI": false, "RJ": true, "RN": false,
  "RS": false, "RO": false, "RR": false, "SC": false, "SP": true,
  "SE": false, "TO": false
};

// Função para inicializar o mapa quando o documento estiver carregado
function inicializarMapa() {
  // Vamos trabalhar diretamente com o SVG que já está no HTML
  // em vez de tentar carregar um SVG externo
  const svgElement = document.querySelector('#mapaBrasil svg');
  
  if (!svgElement) {
    console.error("Elemento SVG não encontrado!");
    return;
  }
  
  // console.log("SVG encontrado, adicionando interatividade...");
  adicionarInteratividade(svgElement);
}

function adicionarInteratividade(svgElement) {
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) {
    // Se o tooltip não existir, vamos criá-lo
    const newTooltip = document.createElement('div');
    newTooltip.id = 'tooltip';
    newTooltip.style.display = 'none';
    newTooltip.style.position = 'absolute';
    newTooltip.style.backgroundColor = 'rgba(0,0,0,0.8)';
    newTooltip.style.color = 'white';
    newTooltip.style.padding = '5px';
    newTooltip.style.borderRadius = '5px';
    newTooltip.style.fontSize = '14px';
    document.body.appendChild(newTooltip);
  }

  // Selecionar todos os estados (paths) do SVG
  const estados = svgElement.querySelectorAll('.state');
  
  estados.forEach(estado => {
    const uf = estado.id;
    if (!uf) {
      // console.warn("Estado sem ID encontrado, pulando...");
      return;
    }
    
    const temClinica = estadosComClinicas[uf];

    // Definir cores iniciais
    if (temClinica) {
      estado.style.fill = '#2ecc71'; // verde para estados com clínica
    } else {
      estado.style.fill = '#bdc3c7'; // cinza para estados sem clínica
    }

    // Adicionar borda e cursor
    estado.style.stroke = '#34495e';
    estado.style.cursor = 'pointer';

    // Evento de hover para tooltip e destaque
    estado.addEventListener('mouseenter', e => {
      const tooltip = document.getElementById('tooltip');
      const info = temClinica ? 'Clínica cadastrada' : 'Nenhuma clínica';
      tooltip.innerText = `${uf}: ${info}`;
      tooltip.style.display = 'block';
      
      // Posicionar o tooltip próximo ao cursor
      tooltip.style.top = (e.clientY + window.scrollY + 10) + 'px';
      tooltip.style.left = (e.clientX + window.scrollX + 10) + 'px';

      // Destacar APENAS estados com clínica ao passar o mouse
      if (temClinica) {
        estado.style.fill = '#27ae60'; // verde mais escuro para destaque
        estado.style.strokeWidth = '2'; // aumentar a largura da borda
      }
    });

    estado.addEventListener('mouseleave', () => {
      const tooltip = document.getElementById('tooltip');
      tooltip.style.display = 'none';
      
      // Retornar ao estilo original APENAS para estados com clínica
      if (temClinica) {
        estado.style.fill = '#2ecc71'; // retorna ao verde original
        estado.style.strokeWidth = '1'; // retorna à largura original da borda
      }
    });
  });
}

// Função para controlar o botão de voltar ao topo
function inicializarBotaoTopo() {
  const botaoTopo = document.getElementById('botao-topo');
  
  // Mostrar ou esconder o botão dependendo da posição da rolagem
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      botaoTopo.style.display = 'block';
    } else {
      botaoTopo.style.display = 'none';
    }
  });
  
  // Rolar suavemente para o topo quando o botão for clicado
  botaoTopo.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Adicionar a inicialização do botão de topo ao carregamento da página
document.addEventListener('DOMContentLoaded', function() {
  inicializarMapa();
  inicializarBotaoTopo();
});

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', inicializarMapa);

// Função para inicializar o carrossel de imagens
function inicializarCarrossel() {
  const carrosselContainer = document.querySelector('.imagens-clinicas');
  
  if (!carrosselContainer) {
    console.error("Container de imagens não encontrado!");
    return;
  }
  
  // Obter todas as imagens existentes
  const imagens = Array.from(carrosselContainer.querySelectorAll('img'));
  
  if (imagens.length === 0) {
    console.warn("Nenhuma imagem encontrada para o carrossel!");
    return;
  }
  
  // Criar a estrutura do carrossel moderno
  const carrosselWrapper = document.createElement('div');
  carrosselWrapper.className = 'carrossel-container';
  
  const carrosselInner = document.createElement('div');
  carrosselInner.className = 'carrossel-wrapper';
  
  const carrosselSlide = document.createElement('div');
  carrosselSlide.className = 'carrossel-slide';
  
  // Adicionar cada imagem ao slide do carrossel
  imagens.forEach(img => {
    const item = document.createElement('div');
    item.className = 'carrossel-item';
    
    const novaImg = document.createElement('img');
    novaImg.src = img.src;
    novaImg.alt = img.alt || 'Imagem da clínica';
    
    item.appendChild(novaImg);
    carrosselSlide.appendChild(item);
  });
  
  carrosselInner.appendChild(carrosselSlide);
  
  // Criar navegação por setas
  const botaoAnterior = document.createElement('button');
  botaoAnterior.className = 'carrossel-nav prev';
  botaoAnterior.innerHTML = '←';
  botaoAnterior.setAttribute('aria-label', 'Imagem anterior');
  
  const botaoProximo = document.createElement('button');
  botaoProximo.className = 'carrossel-nav next';
  botaoProximo.innerHTML = '→';
  botaoProximo.setAttribute('aria-label', 'Próxima imagem');
  
  carrosselInner.appendChild(botaoAnterior);
  carrosselInner.appendChild(botaoProximo);
  
  // Criar indicadores (pontos)
  const indicadores = document.createElement('div');
  indicadores.className = 'carrossel-indicators';
  
  imagens.forEach((_, index) => {
    const indicador = document.createElement('button');
    indicador.className = 'carrossel-indicator';
    if (index === 0) indicador.classList.add('active');
    indicador.setAttribute('aria-label', `Ir para imagem ${index + 1}`);
    indicador.addEventListener('click', () => irParaSlide(index));
    indicadores.appendChild(indicador);
  });
  
  carrosselInner.appendChild(indicadores);
  
  // Criar contador
  const contador = document.createElement('div');
  contador.className = 'carrossel-counter';
  contador.textContent = `1 / ${imagens.length}`;
  
  carrosselInner.appendChild(contador);
  
  carrosselWrapper.appendChild(carrosselInner);
  
  // Substituir o conteúdo original pelo carrossel
  carrosselContainer.innerHTML = '';
  carrosselContainer.appendChild(carrosselWrapper);
  
  // Variáveis de controle
  let slideAtual = 0;
  let autoPlayInterval;
  
  // Função para atualizar indicadores
  function atualizarIndicadores() {
    const todosIndicadores = indicadores.querySelectorAll('.carrossel-indicator');
    todosIndicadores.forEach((indicador, index) => {
      indicador.classList.toggle('active', index === slideAtual);
    });
  }
  
  // Função para atualizar contador
  function atualizarContador() {
    contador.textContent = `${slideAtual + 1} / ${imagens.length}`;
  }
  
  // Função para ir para um slide específico
  function irParaSlide(index) {
    slideAtual = index;
    const deslocamento = -slideAtual * 100;
    carrosselSlide.style.transform = `translateX(${deslocamento}%)`;
    atualizarIndicadores();
    atualizarContador();
    reiniciarAutoPlay();
  }
  
  // Função para próximo slide
  function proximoSlide() {
    const proximo = (slideAtual + 1) % imagens.length;
    irParaSlide(proximo);
  }
  
  // Função para slide anterior
  function slideAnterior() {
    const anterior = (slideAtual - 1 + imagens.length) % imagens.length;
    irParaSlide(anterior);
  }
  
  // Função para iniciar autoplay
  function iniciarAutoPlay() {
    autoPlayInterval = setInterval(proximoSlide, 6000); // Troca a cada 6 segundos
  }
  
  // Função para parar autoplay
  function pararAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
  }
  
  // Função para reiniciar autoplay
  function reiniciarAutoPlay() {
    pararAutoPlay();
    iniciarAutoPlay();
  }
  
  // Eventos dos botões de navegação
  botaoAnterior.addEventListener('click', slideAnterior);
  botaoProximo.addEventListener('click', proximoSlide);
  
  // Pausar autoplay ao passar o mouse
  carrosselWrapper.addEventListener('mouseenter', pararAutoPlay);
  carrosselWrapper.addEventListener('mouseleave', iniciarAutoPlay);
  
  // Navegação por teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') slideAnterior();
    if (e.key === 'ArrowRight') proximoSlide();
  });
  
  // Suporte a gestos touch para mobile
  let startX = 0;
  let endX = 0;
  
  carrosselWrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    pararAutoPlay();
  });
  
  carrosselWrapper.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
  });
  
  carrosselWrapper.addEventListener('touchend', () => {
    const deltaX = startX - endX;
    const threshold = 50; // Mínimo de 50px para detectar swipe
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        proximoSlide(); // Swipe left - próximo
      } else {
        slideAnterior(); // Swipe right - anterior
      }
    }
    
    iniciarAutoPlay();
  });
  
  // Iniciar autoplay
  iniciarAutoPlay();
}

// Função para inicializar o menu responsivo
function inicializarMenuResponsivo() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  
  if (!menuToggle || !nav) return;
  
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
  
  // Fechar o menu ao clicar em um link
  const links = nav.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
      if (window.innerWidth <= 768) {
        nav.classList.remove('active');
      }
    });
  });
}

function injetarInformacoesVersao() {
  // Verificar se as variáveis do arquivo versao.js estão disponíveis
  if (typeof versao !== 'undefined') {
    // Injetar informações no rodapé
    document.getElementById('versao').textContent = versao;
    document.getElementById('copyright').textContent = copyright;
    
    // Atualizar o link de contato da clínica se necessário
    const contatoLink = document.querySelector('#contato a');
    if (contatoLink && typeof contatoClinica !== 'undefined') {
      contatoLink.href = contatoClinica;
    }
  } else {
    console.error("Arquivo de versão não carregado corretamente!");
  }
}

// Inicialização única quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  inicializarMapa();
  inicializarBotaoTopo();
  inicializarCarrossel();
  inicializarMenuResponsivo();
  injetarInformacoesVersao();
});
