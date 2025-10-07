// Scene & Camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0d8f0);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,5,10);

// Renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Lights
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,10,5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff,0.5));

// Road
const road = new THREE.Mesh(
  new THREE.PlaneGeometry(100,6),
  new THREE.MeshStandardMaterial({color:0x333333})
);
road.rotation.x = -Math.PI/2;
scene.add(road);

// Load Car
let car;
const loader = new THREE.GLTFLoader();
loader.load('models/2025-10-03-3.glb', function(gltf){
    car = gltf.scene;
    car.scale.set(0.5,0.5,0.5);
    car.position.y = 0.5;
    scene.add(car);
});

// Controls
let moveForward=false, moveBackward=false, moveLeft=false, moveRight=false;
const speed = 0.2;

document.addEventListener('keydown',(e)=>{
  if(e.key==='ArrowUp') moveForward=true;
  if(e.key==='ArrowDown') moveBackward=true;
  if(e.key==='ArrowLeft') moveLeft=true;
  if(e.key==='ArrowRight') moveRight=true;
});
document.addEventListener('keyup',(e)=>{
  if(e.key==='ArrowUp') moveForward=false;
  if(e.key==='ArrowDown') moveBackward=false;
  if(e.key==='ArrowLeft') moveLeft=false;
  if(e.key==='ArrowRight') moveRight=false;
});

// Mobile buttons
document.getElementById('left-btn').addEventListener('touchstart',()=>moveLeft=true);
document.getElementById('left-btn').addEventListener('touchend',()=>moveLeft=false);
document.getElementById('right-btn').addEventListener('touchstart',()=>moveRight=true);
document.getElementById('right-btn').addEventListener('touchend',()=>moveRight=false);
document.getElementById('acc-btn').addEventListener('touchstart',()=>moveForward=true);
document.getElementById('acc-btn').addEventListener('touchend',()=>moveForward=false);
document.getElementById('brake-btn').addEventListener('touchstart',()=>moveBackward=true);
document.getElementById('brake-btn').addEventListener('touchend',()=>moveBackward=false);

// Animate
function animate(){
  requestAnimationFrame(animate);
  if(car){
    if(moveForward) car.position.z -= speed;
    if(moveBackward) car.position.z += speed;
    if(moveLeft) car.rotation.y += 0.03;
    if(moveRight) car.rotation.y -= 0.03;

    // Camera follows car
    camera.position.x = car.position.x - Math.sin(car.rotation.y)*10;
    camera.position.z = car.position.z + Math.cos(car.rotation.y)*10;
    camera.position.y = car.position.y + 5;
    camera.lookAt(car.position);
  }
  renderer.render(scene, camera);
}

// Resize handling
window.addEventListener('resize',()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
