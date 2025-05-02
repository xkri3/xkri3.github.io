import * as THREE from 'three/webgpu';
import { lerp } from 'three/src/math/MathUtils';

let cursor = { x: 0, y: 0 };
let cameraRotation = { x: 0, y: 0 };
let stars = [];

document.addEventListener('mousemove', (event) => {
  cursor = {
    x: (event.clientX / (window.innerWidth / 25)) - 12.5,
    y: (event.clientY / (window.innerHeight / 25)) - 12.5,
  };
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 100;

const renderer = new THREE.WebGPURenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry(0.2, 32, 32)
const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );

for (let i = 0; i < 1000; i++)
{
  const star = new THREE.Mesh(geometry, material)
  star.position.set(
    Math.random() * 1920 - 960,  // X: from -960 to +960
    Math.random() * 1080 - 540,  // Y: from -540 to +540
    -200
  );  
  console.log(star.position);
  scene.add(star);
  stars.push(star);
}

const render = (time) => {
  cameraRotation.x = lerp(cameraRotation.x, cursor.x, time * 0.00001);
  cameraRotation.y = lerp(cameraRotation.y, cursor.y, time * 0.00001);

  camera.lookAt(-cameraRotation.x, cameraRotation.y, 0);

  renderer.renderAsync(scene, camera);
  requestAnimationFrame(render);
};
requestAnimationFrame(render);

function updateSceneBackground() {
  const isDark = document.body.classList.contains("dark");
  scene.background = new THREE.Color(isDark ? "#140a33" : "#ccbff2");
  material.color.setHex(isDark ? 0xffffff : 0x000000);
}

const themeToggleButton = document.getElementById("theme-toggle");
if (localStorage.getItem("theme") === "dark") {document.body.classList.add("dark");}

updateSceneBackground();
themeToggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  updateSceneBackground();
});