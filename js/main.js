import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { onMouseClick } from './scripts';

// Array de los objetos 3D seleccionables
const objetos = ['Atencion_docente', 'Auditorio', 'Aula_NP1', 'Aula_NP2', 'Aulas_1001', 'Aulas_1002', 'Capilla', 'Cerseu', 'DGA', 'Direccion_escuela', 'Economia', 'Losa', 'Quiosco', 'SSHH1', 'SSHH2', 'USGOM', 'Vestidores'];

const loader = new GLTFLoader();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x252421); // Cambia el color de fondo de la escena a azul

const aspect = window.innerWidth / window.innerHeight;
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
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.75;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Iniciar controles de la cámara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;
controls.maxPolarAngle = Math.PI / 2;
controls.update();

// Agregar una luz direccional a la escena
const light = new THREE.DirectionalLight( 0xffffff, 3 );
light.position.set( 0.1, 0.5, 0.1 ).normalize();
scene.add(light);
// const dl = new THREE.DirectionalLightHelper(light, 2);
// scene.add(dl)

// Agregar el plano base
const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0xE6F4C9 });
const plano = new THREE.Mesh(geometry, material);
plano.name = 'Plano'
plano.position.set(0, -0.1, 0);
plano.scale.set(0.55, 0.02, 0.55)
scene.add(plano);

loader.load('../models/PrimerPiso.glb', function (gltf) {
    const pared = gltf.scene.children.find((child) => child.name === "Pared");
    if (pared) {
        pared.material = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff, emissive: 0xff000, emissiveIntensity: 0.2 } )
        scene.add(pared);
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
            buildMesh.material = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff, emissive: 0xff000, emissiveIntensity: 0.1 } )
            scene.add(buildMesh);
        } else {
            console.warn(`Objeto "${objeto}" no encontrado en el modelo.`);
        }
    }
}, undefined, function (error) {

    console.error(error);

});

// Elemento HTML para mostrar el card con información
const infoContainer2 = document.createElement("div");
infoContainer2.style.position = "absolute";
infoContainer2.style.top = "10px";
infoContainer2.style.left = window.innerWidth; // Ajusta el valor aquí para determinar el espaciado
infoContainer2.style.width = "20%"
infoContainer2.style.pointerEvents = "none";
document.body.appendChild(infoContainer2);
showHelper();

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
const infoContainer = document.createElement("div");
infoContainer.style.position = "absolute";
infoContainer.style.top = "10px";
infoContainer.style.left = window.innerWidth - 300 + "px"; // Ajusta el valor aquí para determinar el espaciado
infoContainer.style.pointerEvents = "none";
document.body.appendChild(infoContainer);

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

// Añadimos el evento de clic del mouse al documento
document.addEventListener('click', (event) => {
    // Llamada a la función onMouseClick pasando las funciones showInfoCard y hideInfoCard
    onMouseClick(event, camera, scene, showInfoCard, hideInfoCard, controls);
}, false);

function animate() {
    requestAnimationFrame(animate);
    // Renderizamos la escena
    controls.update();
    
    renderer.render(scene, camera);
}

animate();
