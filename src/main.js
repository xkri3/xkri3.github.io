import * as THREE from 'three/webgpu';

// #region VARIABLES
let cursor = { x: 0, y: 0 };
let cameraRotation = { x: 0, y: 0 };
let stars = [];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGPURenderer();

const themeToggleButton = document.getElementById("theme-toggle");
const favicon = document.getElementById("favicon");
//#endregion

// #region FUNCTIONS
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

function isDark() {
  return document.body.classList.contains("dark");
}

function updateSceneTheme() {
  const dark = isDark();
  scene.background = new THREE.Color(dark ? "#140a33" : "#ccbff2");
  favicon.href = dark ? "./static/icons/favicon-light.ico" : "./static/icons/favicon-dark.ico";

  // Update all stars' colors
  stars.forEach(star => {
    star.material.color.set(dark ? 0xffffff : 0x000000);
  });
}

function getTheme() {
  return localStorage.getItem("theme");
}

function changeTheme() {
  const darkMode = !isDark();
  document.body.classList.toggle("dark", darkMode);
  localStorage.setItem("theme", darkMode ? "dark" : "light");
  updateSceneTheme();
}
//#endregion

// #region INIT
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

if (getTheme() === "dark") {
  document.body.classList.add("dark");
}
updateSceneTheme();

camera.position.z = 100;
// #endregion

// #region EVENTS
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('mousemove', (event) => {
  cursor = {
    x: (event.clientX / (window.innerWidth / 25)) - 12.5,
    y: (event.clientY / (window.innerHeight / 25)) - 12.5,
  };
});

themeToggleButton.addEventListener("click", changeTheme);
// #endregion

// #region ANIMATION
for (let i = 0; i < 1000; i++) {
  const material = new THREE.MeshBasicMaterial({ color: isDark() ? 0xffffff : 0x000000 });
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const star = new THREE.Mesh(geometry, material);
  star.position.set(
    Math.random() * 1920 - 960, // X: -960 to +960
    Math.random() * 1080 - 540, // Y: -540 to +540
    -200
  );
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
// #endregion