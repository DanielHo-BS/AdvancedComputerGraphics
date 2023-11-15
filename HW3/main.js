import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { DRACOLoader } from 'DRACOLoader';
import { OrbitControls } from 'OrbitControls';

var render
var scene
var camera, camera2
var controls


var centerOfRotation = new THREE.Vector3(110, 40, 10);
var rotationSpeed = Math.PI/180.0*1.0
var rotationAxis = new THREE.Vector3(0, 1, 0)

function animateFrame()
{
    var light  = scene.getObjectByName('Mylihght',true)
    if (light)
    {
        Rotation(light, rotationAxis, rotationSpeed, centerOfRotation);
        Rotation(camera2, rotationAxis, rotationSpeed, centerOfRotation);
        light.lookAt(110,40,10)
    }

    controls.update();    
    render.render(scene,camera2);

    controls.update();    
    
    requestAnimationFrame(animateFrame)
}


function Rotation(mesh, rotationAxis, rotationSpeed, centerOfRotation) { //Rotation
    // Set the center of object to the origin (0,0,0)
    mesh.position.sub(centerOfRotation);
    // Rotate the object
    var rotationMatrix  = new THREE.Matrix4().makeRotationAxis(rotationAxis, rotationSpeed);
    mesh.applyMatrix4(rotationMatrix);
    // Reset the center of object to the original position (100,50,0)
    mesh.position.add(centerOfRotation);
}

function main()
{
    //Scene (as globle var)
    scene = new THREE.Scene();

    //camera (as globle var)
    camera = new THREE.PerspectiveCamera(45, (window.innerWidth-16) / (window.innerHeight-16), 5, 3000)
    camera.position.set(-150,40,300)
    camera.lookAt(0,0,0)
    scene.add(camera);

    camera2 = new THREE.PerspectiveCamera(45, (window.innerWidth-16) / (window.innerHeight-16), 5, 3000)
    camera2.position.set(170,40,10);
    camera2.lookAt(110,40,-60)
    camera2.near = 0.1;
    camera2.far = 20;
    camera2.fov = 50;
    camera2.rotation.z = -Math.PI/2;
    scene.add(camera2);
    const camera2Helper = new THREE.CameraHelper(camera2)
    scene.add(camera2Helper)
    

    //Mesh (still local var, we will retrive it by getObjectByName)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '../lib/jsm/libs/draco/' );
    
    var loader = new GLTFLoader() 
    loader.setDRACOLoader( dracoLoader );
    
    loader.load('./Earth.glb', function(glb) {
 
        var mesh = glb.scene 
       
        var box = new THREE.Box3().setFromObject( mesh );
        var center = box.getCenter( new THREE.Vector3() );
        
        console.log(center) // 110,40,10
   
        scene.add(mesh)
    })
    
    //
    var axisHelper = new THREE.AxesHelper(100);
    scene.add(axisHelper);

    var light = new THREE.SpotLight( 0xffffff, 10, 0, 45*Math.PI/180, 0, 0.1)
    light.name = 'Mylihght'
    
    light.castShadow = true;

    light.shadow.mapSize.width = 64;
    light.shadow.mapSize.height = 64;

    light.shadow.camera.near = 1;
    light.shadow.camera.far = 1000;
    light.shadow.camera.fov = 45
    light.position.set(300,40,300)
    light.lookAt(110,40,10)
    Rotation(light, rotationAxis, rotationSpeed*45, centerOfRotation);
    
    scene.add(light)


    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.setClearColor(0x888888,1);
    render.setSize(window.innerWidth-16,window.innerHeight-16);
    
    document.body.appendChild(render.domElement);
    
    controls = new OrbitControls( camera, render.domElement);
    //controls.autoRotate = true;
    
    addEventListener("resize",() => {
        camera.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera.updateProjectionMatrix();

        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },false);

    animateFrame();
}


main();