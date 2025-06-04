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
  console.log("Inicializando mapa...");
  
  // Vamos trabalhar diretamente com o SVG que já está no HTML
  // em vez de tentar carregar um SVG externo
  const svgElement = document.querySelector('#mapaBrasil svg');
  
  if (!svgElement) {
    console.error("Elemento SVG não encontrado!");
    return;
  }
  
  console.log("SVG encontrado, adicionando interatividade...");
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
  console.log(`Encontrados ${estados.length} estados no SVG`);
  
  estados.forEach(estado => {
    const uf = estado.id;
    if (!uf) {
      console.warn("Estado sem ID encontrado, pulando...");
      return;
    }
    
    console.log(`Processando estado: ${uf}`);
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
  
  // Criar a estrutura do carrossel
  const carrosselWrapper = document.createElement('div');
  carrosselWrapper.className = 'carrossel-container';
  
  const carrosselSlide = document.createElement('div');
  carrosselSlide.className = 'carrossel-slide';
  
  // Adicionar cada imagem ao slide do carrossel
  imagens.forEach(img => {
    const item = document.createElement('div');
    item.className = 'carrossel-item';
    
    // Clonar a imagem para não perder a original
    const novaImg = document.createElement('img');
    novaImg.src = img.src;
    novaImg.alt = img.alt || 'Imagem da clínica';
    
    item.appendChild(novaImg);
    carrosselSlide.appendChild(item);
  });
  
  carrosselWrapper.appendChild(carrosselSlide);
  
  // Adicionar controles do carrossel
  const controles = document.createElement('div');
  controles.className = 'carrossel-controles';
  
  const botaoAnterior = document.createElement('button');
  botaoAnterior.className = 'carrossel-botao';
  botaoAnterior.textContent = 'Anterior';
  
  const botaoProximo = document.createElement('button');
  botaoProximo.className = 'carrossel-botao';
  botaoProximo.textContent = 'Próximo';
  
  controles.appendChild(botaoAnterior);
  controles.appendChild(botaoProximo);
  
  carrosselWrapper.appendChild(controles);
  
  // Substituir o conteúdo original pelo carrossel
  carrosselContainer.innerHTML = '';
  carrosselContainer.appendChild(carrosselWrapper);
  
  // Variáveis para controlar o carrossel
  let posicaoAtual = 0;
  let itensPorPagina = 1; // Valor padrão
  
  // Função para atualizar o número de itens por página com base na largura da tela
  function atualizarItensPorPagina() {
    if (window.innerWidth <= 768) {
      return 1; // Telas pequenas (celular)
    } else if (window.innerWidth <= 1024) {
      return 2; // Telas médias (tablet)
    } else {
      return 3; // Telas grandes (desktop)
    }
  }
  
  // Inicializar o número de itens por página
  itensPorPagina = atualizarItensPorPagina();
  
  // Ajustar a largura do slide para acomodar todas as imagens
  carrosselSlide.style.width = `${(100 / itensPorPagina) * imagens.length}%`;
  
  // Calcular o número total de páginas
  const totalPaginas = Math.ceil(imagens.length / itensPorPagina);
  
  // Função para mover o carrossel
  function moverCarrossel(direcao) {
    if (direcao === 'proximo') {
      posicaoAtual = (posicaoAtual + 1) % totalPaginas;
    } else {
      posicaoAtual = (posicaoAtual - 1 + totalPaginas) % totalPaginas;
    }
    
    const deslocamento = -(posicaoAtual * (100 / totalPaginas));
    carrosselSlide.style.transform = `translateX(${deslocamento}%)`;
  }
  
  // Adicionar eventos aos botões
  botaoAnterior.addEventListener('click', () => moverCarrossel('anterior'));
  botaoProximo.addEventListener('click', () => moverCarrossel('proximo'));
  
  // Ajustar o carrossel quando a janela for redimensionada
  window.addEventListener('resize', () => {
    const novoItensPorPagina = atualizarItensPorPagina();
    if (novoItensPorPagina !== itensPorPagina) {
      itensPorPagina = novoItensPorPagina;
      
      // Reajustar a largura do slide
      carrosselSlide.style.width = `${(100 / itensPorPagina) * imagens.length}%`;
      
      // Voltar para a primeira página
      posicaoAtual = 0;
      carrosselSlide.style.transform = 'translateX(0%)';
    }
  });
}

// Adicionar a inicialização do carrossel ao carregamento da página
document.addEventListener('DOMContentLoaded', function() {
  inicializarMapa();
  inicializarBotaoTopo();
  inicializarCarrossel();
});

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
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove('active');
      }
    });
  });
}

// Adicionar a inicialização do menu responsivo ao carregamento da página
document.addEventListener('DOMContentLoaded', function() {
  inicializarMapa();
  inicializarBotaoTopo();
  inicializarCarrossel();
  inicializarMenuResponsivo();
});
