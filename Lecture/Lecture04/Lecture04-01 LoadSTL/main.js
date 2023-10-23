import * as THREE from 'three';
import { STLLoader } from 'STLLoader';

var render
var scene
var camera


function animateFrame()
{
    //Get the object from scene
    var mesh = scene.getObjectByName('MySTL',true)
    if (mesh) mesh.rotation.z +=0.01
    
    render.render(scene,camera);

    requestAnimationFrame(animateFrame)
}

function main()
{
    //Scene (as globle var)
    scene = new THREE.Scene();

    //camera (as globle var)
    camera = new THREE.OrthographicCamera( 640 / - 2, 640 / 2, 480 / 2, 480 / - 2, -1000, 1000 );
    camera.position.set(0,0,0);
    
    //material 
    var material = new THREE.MeshStandardMaterial({color: 0x888888, wireframe: false})
    
    //Mesh (still local var, we will retrive it by getObjectByName)
    var loader = new STLLoader()
    loader.load('./Monkey.stl', (geometry) => 
    { 
        var mesh = new THREE.Mesh(geometry, material)
        mesh.name = 'MySTL'
        scene.add(mesh) } )
    
    //
    var axisHelper = new THREE.AxesHelper(100);

    var light = new THREE.PointLight( 0xffffff, 10, 10000, 0.1)
    light.position.set(100, -100, 500)

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

    
    animateFrame();
}


main();