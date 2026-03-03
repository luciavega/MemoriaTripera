// carga datos y maneja la construcción de la grilla y el filtrado
let personas = [];           // array original de objetos
let filtros = { texto:'', epocas:[], provincias:[] };

// elementos DOM que usaremos varias veces
const grid = document.getElementById('grid');
const buscador = document.getElementById('buscador');
const botonReset = document.querySelector('.btn-reset');

// limpiar contenido estático antes de que lleguen los datos
if (grid) {
  grid.innerHTML = '';
}

// inicialización
fetch('biografias.json')
  .then(r => r.json())
  .then(data => {
    personas = data;
    render(personas);
  })
  .catch(err => {
    console.error('no se pudo cargar biografias.json', err);
  });

function render(lista) {
  grid.innerHTML = '';                       // vacía grilla
  const tpl = document.getElementById('card-template');
  lista.forEach(p => {
    const card = tpl.content.cloneNode(true);
    const img = card.querySelector('img');
    const h3 = card.querySelector('h3');

    img.src = p.foto;
    img.alt = p.nombre;
    h3.textContent = p.nombre;

    card.querySelector('.card-click').onclick = () => {
      location.href = `detalle.html?id=${p.id}`;
    };
    grid.appendChild(card);
  });
}

function aplicarFiltros() {
  let resultado = personas.slice();

  if (filtros.texto) {
    const txt = filtros.texto.toLowerCase();
    resultado = resultado.filter(p =>
      p.nombre.toLowerCase().includes(txt)
    );
  }

  if (filtros.epocas.length) {
    resultado = resultado.filter(p =>
      filtros.epocas.includes(p.epoca || '')
    );
  }

  if (filtros.provincias.length) {
    resultado = resultado.filter(p =>
      filtros.provincias.includes(p.provincia || '')
    );
  }

  render(resultado);
}

// listeners de interfaz
buscador.addEventListener('input', e => {
  filtros.texto = e.target.value;
  aplicarFiltros();
});

document.querySelectorAll('input[name="epoca"]').forEach(cb => {
  cb.addEventListener('change', () => {
    filtros.epocas = Array.from(
      document.querySelectorAll('input[name="epoca"]:checked')
    ).map(i => i.value);
    aplicarFiltros();
  });
});

document.querySelectorAll('input[name="provincia"]').forEach(cb => {
  cb.addEventListener('change', () => {
    filtros.provincias = Array.from(
      document.querySelectorAll('input[name="provincia"]:checked')
    ).map(i => i.value);
    aplicarFiltros();
  });
});

botonReset.addEventListener('click', () => {
  filtros = { texto:'', epocas:[], provincias:[] };
  buscador.value = '';
  document.querySelectorAll('input[type=checkbox]').forEach(i => i.checked = false);
  render(personas);
});