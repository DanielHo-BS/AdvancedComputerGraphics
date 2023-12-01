import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';


var render
var scene
var camera
var controls

function animateFrame()
{
    requestAnimationFrame(animateFrame)
    controls.update();    
    render.render(scene,camera);
}

function main()
{
    //Scene (as globle var)
    scene = new THREE.Scene();


    //create a group to hold the camera and the camera target
    const cameraRig = new THREE.Group();
    scene.add(cameraRig);
    //camera (as globle var)
    camera = new THREE.PerspectiveCamera(500, (window.innerWidth-16) / (window.innerHeight-16), 1, 2000)
    camera.position.set(0,0,700);
    cameraRig.add(camera);  //add camera to cameraRigY
    cameraRig.rotation.set(-Math.PI/2,0,0);  //rotate the cameraRigY itself


    //material
    // load a texture, set wrap mode to repeat 
    var loader = new THREE.TextureLoader();
    loader.load("20230704_095421.jpg",function(texture){  //load texture
        const material = new THREE.MeshBasicMaterial({    //create material
            map: texture,
            overdraw: 0.5,
        });
        const geometry = new THREE.SphereGeometry(1000, 1000, 1000);
        var cube = new THREE.Mesh(geometry,  material ) 
        cube.position.set(0, 0,0)
        cube.castShadow = true
        cube.receiveShadow = true
        cube.material.side = THREE.DoubleSide;
        scene.add(cube)
    })


    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.shadowMap.enabled = true;
    render.shadowMap.type = THREE.PCFSoftShadowMap;
    render.setClearColor(0x000000,1);
    render.setSize(window.innerWidth-16,window.innerHeight-16);

    document.body.appendChild(render.domElement);
    controls = new OrbitControls( camera, render.domElement);

    addEventListener("resize",() => {
        camera.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera.updateProjectionMatrix();
        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },true);
    
    animateFrame();
}


main();