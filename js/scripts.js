import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Variable para almacenar el objeto actualmente seleccionado
let SELECTED = null;
let initColor = null;
let infoVisible = false;
// let infoContainer; // Declarar la variable a nivel del módulo
// let infoContainer2; // Declarar la variable a nivel del módulo

// Raycaster para detectar colisiones
const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
const container = document.getElementById('canvas-container');
const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
container.appendChild(labelRenderer.domElement);
export default labelRenderer;

// Función para manejar los clics del mouse
export function onMouseClick(event, camera, scene) {
    // Nueva posición segun el div canvas-container
    const container = document.getElementById('canvas-container');
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Lanzamos un rayo desde la posición del mouse
    raycaster.setFromCamera(mouse, camera);

    // Buscamos las intersecciones con objetos de la escena
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        // Si el rayo intersecta con algún objeto de la escena
        const clickedObject = intersects[0].object;
        console.log(clickedObject.position)
        if (clickedObject.name !== 'Pared' && clickedObject.name !== 'Base') {

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
                SELECTED.material.color.set(0xF13A12);
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
        <img class="label icn" src="../images/${name.icono}" alt="${name}">
        <p class="text">${name.nombre}</p>
    `
    const cPointLabel = new CSS2DObject(div);
    scene.add(cPointLabel);
    cPointLabel.position.set(x, y + 0.3, z);
}

export function hideMarkers() {
    const divs = document.getElementsByClassName("label");
    // Cambia la opacidad de todos los elementos
    for (const div of divs) {
        div.style.opacity = "0"; // Cambia este valor según lo necesites
    }
}
export function showMarkers() {
    const divs = document.getElementsByClassName("label");
    // Cambia la opacidad de todos los elementos
    for (const div of divs) {
        div.style.opacity = "1"; // Cambia este valor según lo necesites
    }
}
// Función para deshabilitar la interacción con objetos de la escena
function disableInteraction() {
    mouse = null;
}

// Función para habilitar la interacción con objetos de la escena
function enableInteraction() {
    mouse = new THREE.Vector2();
}

// Verificar el tamaño de la pantalla y controlar la interacción en consecuencia
export function handleScreenSize() {
    const info = document.querySelector(".informacion");
    if (window.innerWidth <= 900) { // Cambia 768 al ancho deseado para dispositivos móviles
        info.style.backgroundColor = "#232527d7";
    } else {
        info.style.backgroundColor = "#232527";
    }
}

// Función para mostrar el card con información
function showInfoCard(nombre) {
    if (infoVisible == false) {
        infoVisible = true
        $('#informacion').toggle('slide', { direction: 'right' }, 1000);
        if (window.innerWidth > 900) {
            $('#canvas-container').css('transform', 'translateX(-20%)');
        } else {
            hideMarkers();
            disableInteraction();
        }
        
    }
    $("#titulo").text(nombre)
}

// Función para ocultar el card con información
function hideInfoCard() {
    if (infoVisible == true) {
        infoVisible = false
        $('#informacion').toggle('slide', { direction: 'right' }, 1000);
        if (window.innerWidth > 900) {
            $('#canvas-container').css('transform', 'translateX(0%)');
        } else {
            showMarkers();
            enableInteraction();
        }
    }

}

// Llama a la función cuando se carga la página y cuando cambia el tamaño de la ventana
window.addEventListener('resize', handleScreenSize);

// Elemento HTML para mostrar el card con información
// export function createHelperContainer() {
//     infoContainer2 = document.createElement("div");
//     infoContainer2.style.position = "absolute";
//     infoContainer2.style.top = "10px";
//     infoContainer2.style.left = window.innerWidth; // Ajusta el valor aquí para determinar el espaciado
//     infoContainer2.style.width = "20%"
//     infoContainer2.style.pointerEvents = "none";
//     document.body.appendChild(infoContainer2);
//     showHelper();
// }

// function showHelper() {
//     infoContainer2.innerHTML = `
//     <div class="card info-card">
//       <div class="card-body">
//         <h5 class="card-title">Bienvenido!</h5>
//         <p class="card-text">Aquí encontrará todas las dependencias de la FISI</p>
//         <p class="card-footer">Seleccione cualquier marcador u objeto para ver más información</p>
//       </div>
//     </div>`
// }

// Elemento HTML para mostrar el card con información
// export function createCardContainer() {
//     infoContainer = document.createElement("div");
//     infoContainer.style.position = "absolute";
//     infoContainer.style.top = "10px";
//     infoContainer.style.left = window.innerWidth - 300 + "px"; // Ajusta el valor aquí para determinar el espaciado
//     infoContainer.style.pointerEvents = "none";
//     document.body.appendChild(infoContainer);
// }

