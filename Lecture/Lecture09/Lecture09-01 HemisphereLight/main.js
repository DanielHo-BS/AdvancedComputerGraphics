import * as THREE from 'three';
import { DRACOLoader } from 'DRACOLoader';
import { GLTFLoader } from 'GLTFLoader';
import { OrbitControls } from 'OrbitControls';

var render
var scene
var camera
var controls

function animateFrame()
{
    var light = scene.getObjectByName('Mylihght')
   
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
    camera.position.set(0,-300,100);
    scene.add(camera);
    
    
    //Mesh (still local var, we will retrive it by getObjectByName)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '../lib/jsm/libs/draco/' );
    
    var loader = new GLTFLoader() 
    loader.setDRACOLoader( dracoLoader );
    
    loader.load('./VenusHalfMetal.glb', function(glb) {
       var mesh;
       
       glb.scene.traverse( function( node ) {
       if ( node.isMesh ) { node.castShadow = true; 
                            node.receiveShadow = false; }
            mesh = glb.scene 
       } );
       
       mesh.rotation.x = 3.1415/2.0
       mesh.rotation.y = 3.1415/2.0*0.6
       mesh.name = 'MyGLTF'

       scene.add(glb.scene)
    })
    
    // Plane structure
    var planeGeometry = new THREE.PlaneGeometry(1500, 1500)
    var plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ color: 0xBBAABB }))
    plane.position.z = -1
    plane.receiveShadow = true
    scene.add(plane)

    const geometry = new THREE.SphereGeometry( 30, 24, 16 );
    var sphere = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0x888888, wireframe: false})) 
    sphere.position.set(-100, 0, 30)
    sphere.castShadow = true
    sphere.receiveShadow = true
    scene.add(sphere)

    var light = new THREE.HemisphereLight( 0xffffff, 0x888800, 1)
    light.name = 'Mylihght'
    light.position.set(0, 0, 0)

    var lightHelper = new THREE.HemisphereLightHelper(light, 10)
    scene.add(lightHelper)

    scene.add(light)

    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.shadowMap.enabled = true;
    render.shadowMap.type = THREE.PCFSoftShadowMap;
    render.setClearColor(0x888888,1);
    render.setSize(window.innerWidth-16,window.innerHeight-16);

    document.body.appendChild(render.domElement);
    controls = new OrbitControls( camera, render.domElement);
    controls.target = new THREE.Vector3(0,0,90)
   
    addEventListener("resize",() => {
        camera.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera.updateProjectionMatrix();
        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },false);
    
    animateFrame();
}


main();