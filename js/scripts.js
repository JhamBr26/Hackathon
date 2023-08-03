import * as THREE from "three";

// Variable para almacenar el objeto actualmente seleccionado
let SELECTED = null;
let initColor = null;

// Raycaster para detectar colisiones
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Función para manejar los clics del mouse
export function onMouseClick(event, camera, scene, showInfoCard, hideInfoCard, controls) {
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
        console.log(clickedObject.name)
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
