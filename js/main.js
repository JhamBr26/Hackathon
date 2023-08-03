import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { onMouseClick, addMarker} from './scripts.js';
import { handleScreenSize } from "./scripts.js";
import labelRenderer from "./scripts.js";

// Array de los objetos 3D seleccionables
const objetos=[{nombre:'Atencion_docente',icono:'teacher.png'},{nombre:'Auditorio',icono:'auditorio.png'},{nombre:'Aula_NP1',icono:'clase.png'},{nombre:'Aula_NP2',icono:'clase.png'},{nombre:'Aulas_1001',icono:'clase.png'},{nombre:'Aulas_1002',icono:'clase.png'},{nombre:'Capilla',icono:'Capilla.png'},{nombre:'Cerseu',icono:'teacher.png'},{nombre:'DGA',icono:'secretary.png'},{nombre:'Direccion_escuela',icono:'secretary.png'},{nombre:'Economia',icono:'secretary.png'},{nombre:'Losa',icono:'teacher.png'},{nombre:'Quiosco',icono:'shop color.png'},{nombre:'SSHH1',icono:'men´s room.png'},{nombre:'SSHH2',icono:'men´s room.png'},{nombre:'USGOM',icono:'secretary.png'},{nombre:'Vestidores',icono:'womens-room.png'}]

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

function initLights() {
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
}

initLights();

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

/*
// Variables para el camino
let startPoint = new THREE.Vector3(1.278513789176941, 0.1900000125169754, -0.328339159488678);
let endPoint = new THREE.Vector3(-1.5243076086044312, 0.1900000125169754, 1.954158067703247);
let pathPoints = [];

// Función para generar el camino
function generatePath(glb) {
    pathPoints = [];
    let stepSize = 0.1; // Tamaño del paso para el raycasting
    let direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize();
    let distance = startPoint.distanceTo(endPoint);
    let raycaster = new THREE.Raycaster();

    let currentPoint = new THREE.Vector3().copy(startPoint);
    let raycastIntersections = [];

    while (currentPoint.distanceTo(startPoint) < distance) {
        raycaster.set(currentPoint, direction);
        raycastIntersections = raycaster.intersectObject(glb, true);
        if (raycastIntersections.length > 0) {
            var intersection = raycastIntersections[0];
            pathPoints.push(intersection.point.clone());
            currentPoint.copy(intersection.point).add(direction.multiplyScalar(stepSize));
        } else {
            // Si no hay colisión, avanzar al siguiente punto sin obstáculos
            currentPoint.add(direction.multiplyScalar(stepSize));
        }
    }

    // Agregar el punto final
    pathPoints.push(endPoint.clone());

    // Dibujar el camino (puedes usar el color o material que desees)
    var pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    var pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
    var pathLine = new THREE.Line(pathGeometry, pathMaterial);
    scene.add(pathLine);
}
*/

loader.load('../models/PrimerPiso.glb', function (gltf) {
    let i=0
    for (let objeto of objetos) {
        const buildMesh = gltf.scene.children.find((child) => child.name === objeto.nombre);

        if (buildMesh) {
            const grayScale = Math.random(); // Generar valor de escala de grises aleatorio (entre 0 y 1)
            const color = new THREE.Color(grayScale, grayScale, grayScale); // Crear color en escala de grises
            addMarker(scene, objetos[i], ...buildMesh.position);
            buildMesh.material = new THREE.MeshPhysicalMaterial({
                color: color, // Asignar color aleatorio al material
                clearcoat: 1
            });
            objetos[i].x=buildMesh.position.x;
            objetos[i].y=buildMesh.position.y;
            objetos[i].z=buildMesh.position.z;
            scene.add(buildMesh);
            i++;
        } else {
            console.warn(`Objeto "${objeto}" no encontrado en el modelo.`);
        }
    }
    //generatePath(gltf.scene)
}, undefined, function (error) {
    console.error(error);
});
// Variables para controlar el zoom
var zoomMin = 0.5; // Zoom mínimo permitido
var zoomMax = 2.0; // Zoom máximo permitido
var zoomSpeed = 0.000001; // Velocidad de zoom

// Función para limitar el zoom de la cámara
function limitZoom() {
    if (camera.zoom < zoomMin) camera.zoom = zoomMin;
    if (camera.zoom > zoomMax) camera.zoom = zoomMax;
}

// Función para manejar el evento de zoom
function handleZoom(event) {
    var delta = 0;
    if (event.wheelDelta) { // Evento de rueda del ratón
        delta = event.wheelDelta;
    } else if (event.deltaY) { // Evento de rueda del ratón 
        delta = event.deltaY * -1;
    } else if (event.touches && event.touches.length === 2) { // Evento de pinch en dispositivos táctiles
        var touch1 = event.touches[0];
        var touch2 = event.touches[1];
        delta = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    }
    // Actualizar el zoom de la cámara
    camera.zoom += delta * zoomSpeed;
    limitZoom();
    camera.updateProjectionMatrix();
}
// Escuchar los eventos de zoom
window.addEventListener('wheel', handleZoom, false);
window.addEventListener('touchmove', handleZoom, false);

function cambiarPrimerPiso() {
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
        let i=0
        for (let objeto of objetos) {
            const buildMesh = gltf.scene.children.find((child) => child.name === objeto.nombre);
    
            if (buildMesh) {
                const grayScale = Math.random(); // Generar valor de escala de grises aleatorio (entre 0 y 1)
                const color = new THREE.Color(grayScale, grayScale, grayScale); // Crear color en escala de grises
                addMarker(scene, objetos[i], ...buildMesh.position);
                buildMesh.material = new THREE.MeshPhysicalMaterial({
                    color: color, // Asignar color aleatorio al material
                    clearcoat: 1
                });
                objetos[i].x=buildMesh.position.x;
                objetos[i].y=buildMesh.position.y;
                objetos[i].z=buildMesh.position.z;
                scene.add(buildMesh);
                i++;
            } else {
                console.warn(`Objeto "${objeto}" no encontrado en el modelo.`);
            }
        }
        //generatePath(gltf.scene)
    }, undefined, function (error) {
        console.error(error);
    });
}

// Función para cambiar a segundo piso
function cambiarSegundoPiso() {
    // Remover todos los objetos hijos de la escena (limpiar el primer piso)
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    initLights();
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
}

// Asociar evento de clic al botón
const changeFloorButton1 = document.getElementById("changeFloorButton1");
changeFloorButton1.addEventListener("click", function(event) {
    event.stopPropagation(); // Detener la propagación del evento de clic
    cambiarPrimerPiso();
});

// Asociar evento de clic al botón
const changeFloorButton2 = document.getElementById("changeFloorButton2");
changeFloorButton2.addEventListener("click", function(event) {
    event.stopPropagation(); // Detener la propagación del evento de clic
    cambiarSegundoPiso();
});

/*let infoVisible = false;
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

}*/

// Añadimos el evento de clic del mouse al documento
document.addEventListener('click', (event) => {
    // Llamada a la función onMouseClick pasando las funciones showInfoCard y hideInfoCard
    onMouseClick(event, camera, scene, controls);
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
    handleScreenSize()
    renderer.render(scene, camera);
}

animate();
