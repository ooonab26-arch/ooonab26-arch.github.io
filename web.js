// Accurate Clock

function clock(){
    const time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    minutes = checkTime(minutes)
    seconds = checkTime(seconds)

    document.getElementById('web-clock').textContent = hours+":"+ minutes+":"+seconds;
    setTimeout(clock,1000)
}
function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    };  
    return i;
  }
document.addEventListener('DOMContentLoaded', clock);


import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const container = document.getElementById("container3D");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 1.2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;                 
renderer.toneMapping = THREE.ACESFilmicToneMapping;           
renderer.toneMappingExposure = 1.0;                          
renderer.setClearColor(0x000000, 0);                       
container.appendChild(renderer.domElement);

const key = new THREE.DirectionalLight(0xffffff, 2.0);
key.position.set(5, 8, 5);
scene.add(key);

const fill = new THREE.DirectionalLight(0xffffff, 1.9);
fill.position.set(-5, 4, -5);
scene.add(fill);

const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.7);
hemi.position.set(0, 1, 0);
scene.add(hemi);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const camLight = new THREE.PointLight(0xffffff, 1.2, 0, 2);
camera.add(camLight);
scene.add(camera);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 0.6, 0);

const loader = new GLTFLoader();
loader.load(
  "./nissan_gtrs_3d/scene.gltf",
  (gltf) => {
    const obj = gltf.scene;
    scene.add(obj);

    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());


    const box2 = new THREE.Box3().setFromObject(obj);
    const size2 = box2.getSize(new THREE.Vector3()).length();
    const center2 = box2.getCenter(new THREE.Vector3());

    controls.target.copy(center2);
    camera.position.set(
      center2.x + size2 * 0.5,
      center2.y + size2 * 0.25,
      center2.z + size2 * 0.75
    );
    controls.update();
  },
  (xhr) => console.log(((xhr.loaded / xhr.total) * 100).toFixed(1) + "% loaded"),
  (err) => console.error("GLTF load error:", err)
);


window.addEventListener("resize", () => {
  const w = container.clientWidth, h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});


(function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
})();

