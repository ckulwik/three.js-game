import * as THREE from "three";
import * as OIMO from "oimo";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
document.body.appendChild(renderer.domElement);

const shadowPlaneGeometry = new THREE.PlaneGeometry(10, 10);
const shadowPlaneMaterial = new THREE.ShadowMaterial({ opacity: 0.5, color: 0xff0000 }); // Use a shadow-receiving material
const shadowPlane = new THREE.Mesh(shadowPlaneGeometry, shadowPlaneMaterial);
shadowPlane.receiveShadow = true;
shadowPlane.position.z = .001;

scene.add(shadowPlane);

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;

scene.add(plane);


const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
cube.position.set(0, 0, .25);
scene.add(cube);

const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( .3, .5, 1 ); //default; light shining from top
light.castShadow = true; // default false
scene.add( light );

light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

camera.position.z = 3;
camera.position.x = 3;
camera.position.y = -7;
camera.rotation.x = Math.PI / 2;
camera.rotation.y = 0.5;
camera.zoom = 1.5;
// camera.rotation.z = Math.PI / 6;


const world = new OIMO.World({ 
  timestep: 1/60, 
  iterations: 8, 
  broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
  worldscale: 1, // scale full world 
  random: true,  // randomize sample
  info: false,   // calculate statistic or not
  gravity: [0,-9.8,0] 
});

const body = world.add({ 
  type:'box', // type of shape : sphere, box, cylinder 
  size:[1,1,1], // size of shape
  pos:[0,0,0], // start position in degree
  rot:[0,0,90], // start rotation in degree
  move:true, // dynamic or statique
  density: 1,
  friction: 0.2,
  restitution: 0.2,
  belongsTo: 1, // The bits of the collision groups to which the shape belongs.
  collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
});


// update world
// // and copy position and rotation to three mesh
cube.position.copy( body.getPosition() );
cube.quaternion.copy( body.getQuaternion() );


// animate is called 60 times a second
// anything you want to change or move while the app is running has to go thru the animation loop
const animate = () => {
  requestAnimationFrame(animate);
  world.step();

  camera.position.x = cube.position.x + 5;
  camera.position.y = cube.position.y - 10;
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

const speed = 0.1;

// Handle keyboard input
function handleKeydown(event) {
  switch (event.key) {
    case "ArrowDown":
      if (-5 < cube.position.y) {
        cube.position.y -= speed; 
      }
      break;
    case "ArrowUp":
      if (5 > cube.position.y) {
        cube.position.y += speed; 
      }
      break;
    case "ArrowLeft":
      if (-5 < cube.position.x) {
        cube.position.x -= speed; 
      }
      break;
    case "ArrowRight":
      if (5 > cube.position.x) {
        cube.position.x += speed; 
      }
      break;
    case " ":
        cube.position.z += speed; 
      break;
  }
}

// Listen for keydown events
window.addEventListener("keydown", handleKeydown);
