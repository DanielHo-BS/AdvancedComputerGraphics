import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { DRACOLoader } from 'DRACOLoader';
import { OrbitControls } from 'OrbitControls';

var render
var scene
var camera
var controls

function animateFrame()
{
    var light  = scene.getObjectByName('MyLight',true)
    var mesh  = scene.getObjectByName('MyglTF',true)
    if (light)
        light.position.set(camera.position.x,camera.position.y,camera.position.z)  

    if (mesh)
    {
        var box = new THREE.Box3().setFromObject( mesh );
        var center = box.getCenter( new THREE.Vector3() );
        controls.target = center
    }   

    controls.update();    
    render.render(scene,camera);
    
    requestAnimationFrame(animateFrame)
}

function main()
{
    //Scene (as globle var)
    scene = new THREE.Scene();

    //camera (as globle var)
    camera = new THREE.PerspectiveCamera(45, (window.innerWidth-16) / (window.innerHeight-16), 5, 3000)
    camera.position.set(0,0,250);
    
    //Mesh (still local var, we will retrive it by getObjectByName)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '../lib/jsm/libs/draco/' );
    
    var loader = new GLTFLoader() 
    loader.setDRACOLoader( dracoLoader );
    
    loader.load('./VenusMetal.glb', function(glb) {
        var mesh = glb.scene
        mesh.name = 'MyglTF'
        
        scene.add(mesh)
    })
    
    //
    //var axisHelper = new THREE.AxesHelper(100);

    var light = new THREE.PointLight( 0xffffff, 2, 10000, 0.01)
    light.position.set(camera.position.x,camera.position.y,camera.position.z)  
    light.name = 'MyLight'

    scene.add(camera);
    //scene.add(axisHelper);
    scene.add(light)


    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.setClearColor(0x888888,1);
    render.setSize(window.innerWidth-16,window.innerHeight-16);
    
    document.body.appendChild(render.domElement);
    
    controls = new OrbitControls( camera, render.domElement);
    controls.autoRotate = true;
    
    addEventListener("resize",() => {
        camera.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera.updateProjectionMatrix();
        render.setSize(window.innerWidth-16, window.innerHeight-16);
        console.log(window.innerWidth,window.innerHeight)
    },false);

    animateFrame();
}


main();