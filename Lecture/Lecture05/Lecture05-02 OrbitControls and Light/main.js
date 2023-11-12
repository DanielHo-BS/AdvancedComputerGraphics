import * as THREE from 'three';
import { STLLoader } from 'STLLoader';
import { OrbitControls } from 'OrbitControls';

var render
var scene
var camera
var controls

var frameCount = 0

function animateFrame()
{
    var light  = scene.getObjectByName('MyLight',true)
    if (light)
        light.position.set(camera.position.x,camera.position.y,camera.position.z)  
        
    controls.update();    
    render.render(scene,camera);
    
    if (frameCount++%60 == 0)
        console.log(camera.position)
 
    requestAnimationFrame(animateFrame)
}

function main()
{
    //Scene (as globle var)
    scene = new THREE.Scene();

    //camera (as globle var)
    camera = new THREE.OrthographicCamera( 640 / - 2, 640 / 2, 480 / 2, 480 / - 2, -1000, 1000 );
    camera.position.set(0,0,500);
    
    //material 
    var material = new THREE.MeshStandardMaterial({color: 0x888888, wireframe: false})
    
    //Mesh (still local var, we will retrive it by getObjectByName)
    var loader = new STLLoader()
    
    loader.load('./Monkey.stl', (geometry) => 
    { 
        var mesh = new THREE.Mesh(geometry, material)
        mesh.name = 'MySTL';
        mesh.rotation.x = -Math.PI/2;

        var box = new THREE.Box3().setFromObject( mesh );
        var center = box.getCenter( new THREE.Vector3() );

        mesh.position.x -= center.x
        mesh.position.y -= center.y
        mesh.position.z -= center.z
        
        scene.add(mesh) })
    
    //
    var axisHelper = new THREE.AxesHelper(100);

    var light = new THREE.PointLight( 0xffffff, 10, 10000, 0.1)
    light.position.set(camera.position)
    light.name = 'MyLight'

    const lighthelper = new THREE.PointLightHelper(light) 

    scene.add(camera);
    scene.add(axisHelper);
    scene.add(light)
    scene.add(lighthelper)

    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.setClearColor(0x888888,1);
    render.setSize(640,480);
    document.body.appendChild(render.domElement);

    controls = new OrbitControls( camera, render.domElement);
    controls.autoRotate = false;
    controls.autoRotateSpeed = 10;

    animateFrame();
}


main();