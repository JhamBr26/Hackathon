import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Variable para almacenar el objeto actualmente seleccionado
let SELECTED = null;
let initColor = null;
let infoContainer; // Declarar la variable a nivel del módulo
let infoContainer2; // Declarar la variable a nivel del módulo

// Raycaster para detectar colisiones
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);
export default labelRenderer;

// Función para manejar los clics del mouse
export function onMouseClick(event, camera, scene) {
    // Calculamos la posición normalizada del mouse (-1 a 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Lanzamos un rayo desde la posición del mouse
    raycaster.setFromCamera(mouse, camera);

    // Buscamos las intersecciones con objetos de la escena
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        // Si el rayo intersecta con algún objeto de la escena
        const clickedObject = intersects[0].object;
        console.log(clickedObject.position)
        if (clickedObject.name !== 'Pared' && clickedObject.name !== 'Plano') {

            if (SELECTED !== clickedObject) {
                if (SELECTED) {
                    SELECTED.material.color.set(initColor);
                }

                initColor = clickedObject.material.color.clone();
                SELECTED = clickedObject;

                const nombre = SELECTED.name;
                // Mostramos el card con información
                showInfoCard(nombre);

                // Cambiamos el color del objeto seleccionado
                SELECTED.material.color.set(0xFFDD47);
            } else {
                // Hacer clic nuevamente en el objeto seleccionado para deseleccionarlo
                SELECTED.material.color.set(initColor);
                SELECTED = null;
                hideInfoCard();
            }
        }
    } else {
        // Si el rayo no intersecta con ningún objeto de la escena
        // Ocultamos el card con información y borramos el objeto seleccionado
        hideInfoCard();
        if (SELECTED) {
            SELECTED.material.color.set(initColor);
            SELECTED = null;
        }
    }
}

export function addMarker(scene, name, x, y, z) {
    const div = document.createElement("div");
    div.classList.add('point')
    div.innerHTML = `
        <img class="label icn" src="../images/${name}.svg" alt="${name}">
    `
    const cPointLabel = new CSS2DObject(div);
    scene.add(cPointLabel);
    cPointLabel.position.set(x, y + 0.3, z);

    // Agregar un evento de clic al marcador
    cPointLabel.element.addEventListener('click', () => {
        showInfoCard(name); // Mostrar el card correspondiente
    });
}

// Elemento HTML para mostrar el card con información
export function createHelperContainer() {
    infoContainer2 = document.createElement("div");
    infoContainer2.style.position = "absolute";
    infoContainer2.style.top = "10px";
    infoContainer2.style.left = window.innerWidth; // Ajusta el valor aquí para determinar el espaciado
    infoContainer2.style.width = "20%"
    infoContainer2.style.pointerEvents = "none";
    document.body.appendChild(infoContainer2);
    // showHelper();
}

function showHelper() {
    infoContainer2.innerHTML = `
    <div class="card info-card">
      <div class="card-body">
        <h5 class="card-title">Bienvenido!</h5>
        <p class="card-text">Aquí encontrará todas las dependencias de la FISI</p>
        <p class="card-footer">Seleccione cualquier marcador u objeto para ver más información</p>
      </div>
    </div>`
}

// Elemento HTML para mostrar el card con información
export function createCardContainer() {
    infoContainer = document.createElement("div");
    infoContainer.style.position = "absolute";
    infoContainer.style.top = "10px";
    infoContainer.style.left = window.innerWidth - 300 + "px"; // Ajusta el valor aquí para determinar el espaciado
    infoContainer.style.pointerEvents = "none";
    document.body.appendChild(infoContainer);
}

// Función para mostrar el card con información
function showInfoCard(nombre) {
    infoContainer2.innerHTML = ''
    infoContainer.innerHTML = `
  <div class="card info-card">
    <img src="https://estudiaperu.pe/wp-content/uploads/2019/10/Estudiar-carrera-de-Econom%C3%ADa-en-Per%C3%BA_opt.jpg" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">Área de ${nombre}</h5>
      <p class="card-text">Área privada de la facultad</p>
      <p class="card-footer">Abre a las 8:00 am</p>
    </div>
  </div>
`;
}

// Función para ocultar el card con información
function hideInfoCard() {
    infoContainer.innerHTML = "";
    showHelper();
}