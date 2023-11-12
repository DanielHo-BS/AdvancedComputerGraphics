import * as THREE from 'three';
import { DRACOLoader } from 'DRACOLoader';
import { GLTFLoader } from 'GLTFLoader';
import { OrbitControls } from 'OrbitControls';

var render
var scene
var camera
var controls

var frameCount = 0

function animateFrame()
{
    var light = scene.getObjectByName('MyPTlihght')
    if (light)
    {
        var pt = light.position.clone()
        var ra = new THREE.Matrix4()
        ra.makeRotationZ(Math.PI/180.0*1.0)
        pt.applyMatrix4(ra)
        light.position.x = pt.x;
        light.position.y = pt.y;
        light.position.z = pt.z;
    }

    camera.near = 0.1 + 400*(1 + Math.cos(frameCount++/200.0))
    camera.far = 500 + 1000*(1 + Math.cos(frameCount++/200.0))
    camera.updateProjectionMatrix();
    
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
    camera.position.set(0,-300,500)
    scene.add(camera);
    
    
    //Mesh (still local var, we will retrive it by getObjectByName)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '../lib/jsm/libs/draco/' );
    
    var loader = new GLTFLoader() 
    loader.setDRACOLoader( dracoLoader );
    
    loader.load('./VenusMetal.glb', function(glb) {
       var mesh = glb.scene 
       
       mesh.rotation.x = 3.1415/2.0
       mesh.name = 'MyGLTF'
       scene.add(mesh)
    })
    
    // Plane structure
    var planeGeometry = new THREE.PlaneGeometry(500, 500)
    var plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ color: 0xBBAABB }))
    plane.position.z = -10
    scene.add(plane)

    const geometry = new THREE.BoxGeometry(50, 50, 50);
    var cube = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0x888888, wireframe: false})) 
    cube.position.set(-100, 0, 25)
    scene.add(cube)

    //
    var axisHelper = new THREE.AxesHelper(100);
    scene.add(axisHelper);

    var light = new THREE.PointLight( 0xffffff, 5, 3000, 0) 
    light.position.set(250, 0, 250)
    light.name = 'MyPTlihght'
    scene.add(light)

    const lighthelper = new THREE.PointLightHelper(light) 
    scene.add(lighthelper)

    
    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.setClearColor(0x000000,1);
    render.setSize(window.innerWidth-16,window.innerHeight-16);

    document.body.appendChild(render.domElement);
    controls = new OrbitControls( camera, render.domElement);
   
    addEventListener("resize",() => {
        camera.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera.updateProjectionMatrix();
        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },false);

    var _gl = render.getContext()

    animateFrame();
}


main();