import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { onMouseClick, addMarker} from './scripts';
import labelRenderer from "./scripts";

// Array de los objetos 3D seleccionables
const objetos = ['Atencion_docente', 'Auditorio', 'Aula_NP1', 'Aula_NP2', 'Aulas_1001', 'Aulas_1002', 'Capilla', 'Cerseu', 'DGA', 'Direccion_escuela', 'Economia', 'Losa', 'Quiosco', 'SSHH1', 'SSHH2', 'USGOM', 'Vestidores'];

const loader = new GLTFLoader();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x171819); // Cambia el color de fondo de la escena a azul

// Se define el div que contiene el canva
const container = document.getElementById('canvas-container');

const aspect = container.clientWidth / container.clientHeight;
const frustumSize = 4; // Ajusta este valor según tus necesidades

const camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    -20,
    20
);
camera.position.set(2, 2, 3.5); // Ajusta la posición de la cámara

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// Aplicar las configuraciones adicionales al renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Iniciar controles de la cámara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;
controls.maxPolarAngle = Math.PI / 2;
controls.update();

// Agregar una luz direccional a la escena
const light = new THREE.PointLight(0xffffff, 9, 8, 1);
light.position.set(3, 3, -3);
scene.add(light);
// const dl = new THREE.PointLightHelper(light, 0.5);
// scene.add(dl)

const light2 = new THREE.PointLight(0xffffff, 9, 8, 1);
light2.position.set(-3, 3, 3);
scene.add(light2);
const dl2 = new THREE.PointLightHelper(light2, 0.5);
// scene.add(dl2)

const light3 = new THREE.PointLight(0xffffff, 9, 8, 1);
light3.position.set(-3, 3, -3);
scene.add(light3);
// const dl3 = new THREE.PointLightHelper(light3, 0.5);
// scene.add(dl3)

const light4 = new THREE.PointLight(0xffffff, 9, 16, 1);
light4.position.set(3, 3, 3);
scene.add(light4);
// const dl4 = new THREE.PointLightHelper(light4, 0.5);
// scene.add(dl4)

loader.load('../models/PrimerPiso.glb', function (gltf) {
    const pared = gltf.scene.children.find((child) => child.name === "Pared");
    if (pared) {
        pared.material = new THREE.MeshPhysicalMaterial({ color: 0x001657, clearcoat: 1 })
        scene.add(pared);
    } else {
        console.warn('Pared no encontrada en el modelo.');
    }
    const base = gltf.scene.children.find((child) => child.name === "Base");
    if (base) {
        base.material = new THREE.MeshPhysicalMaterial({ color: 0xD8E9FF })
        scene.add(base);
    } else {
        console.warn('Pared no encontrada en el modelo.');
    }
}, undefined, function (error) {

    console.error(error);

});

loader.load('../models/PrimerPiso.glb', function (gltf) {
    for (let objeto of objetos) {
        const buildMesh = gltf.scene.children.find((child) => child.name === objeto);

        if (buildMesh) {
            const grayScale = Math.random(); // Generar valor de escala de grises aleatorio (entre 0 y 1)
            const color = new THREE.Color(grayScale, grayScale, grayScale); // Crear color en escala de grises
            addMarker(scene, 'name', ...buildMesh.position);
            buildMesh.material = new THREE.MeshPhysicalMaterial({
                color: color, // Asignar color aleatorio al material
                clearcoat: 1
            });

            scene.add(buildMesh);
        } else {
            console.warn(`Objeto "${objeto}" no encontrado en el modelo.`);
        }
    }
}, undefined, function (error) {
    console.error(error);
});

let infoVisible = false;
// Función para mostrar el card con información
function showInfoCard(nombre) {
    if (infoVisible == false) {
        infoVisible = true
        $('#informacion').toggle('slide', { direction: 'right' }, 1000);
        $('#canvas-container').css('transform', 'translateX(-20%)');
    }
    $("#titulo").text(nombre)

}

// Función para ocultar el card con información
function hideInfoCard() {
    if (infoVisible == true) {
        infoVisible = false
        $('#informacion').toggle('slide', { direction: 'right' }, 1000);
        $('#canvas-container').css('transform', 'translateX(0%)');
    }

}

// Añadimos el evento de clic del mouse al documento
document.addEventListener('click', (event) => {
    // Llamada a la función onMouseClick pasando las funciones showInfoCard y hideInfoCard
    onMouseClick(event, camera, scene, showInfoCard, hideInfoCard, controls);
}, false);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.set(this.window.innerWidth, this.window.innerHeight);
})

function animate() {
    requestAnimationFrame(animate);
    // Renderizamos la escena
    controls.update();
    labelRenderer.render(scene, camera);
    renderer.render(scene, camera);
}

animate();
