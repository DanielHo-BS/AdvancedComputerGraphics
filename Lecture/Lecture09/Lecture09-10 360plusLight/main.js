import * as THREE from 'three';
import { RGBELoader } from 'RGBELoader';
import { DRACOLoader } from 'DRACOLoader';
import { GLTFLoader } from 'GLTFLoader';
import { OrbitControls } from 'OrbitControls';

var render
var scene
var camera
var controls

function animateFrame()
{
    var light = scene.getObjectByName('MyPTlihght')
    
    if (light)
    {
        var pt = light.position.clone()
        var ra = new THREE.Matrix4()
        ra.makeRotationZ(Math.PI/180.0*1.0)
        pt.applyMatrix4(ra)
        //light.position.x = pt.x;
        //light.position.y = pt.y;
        //light.position.z = pt.z;
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
    camera.position.set(0,150,300);
    scene.add(camera);
    
    //Mesh (still local var, we will retrive it by getObjectByName)
    new RGBELoader().load( '../360HDR/NTUST_IB.hdr', function ( texture ) {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.environment = texture;
    } );

    
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
       
       mesh.rotation.y = 3.1415/2.0*0.6
       mesh.name = 'MyglTF'

       scene.add(glb.scene)
    })
    
    const geometry = new THREE.SphereGeometry( 30, 24, 16 );
    var sphere = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x888888,wireframe: false})) 
    sphere.position.set(-100, 30, 0)
    sphere.castShadow = true
    sphere.receiveShadow = true
    scene.add(sphere)

    var light = new THREE.PointLight( 0xffffff, 3, 1000, 0.05)
    light.name = 'MyPTlihght'
    light.position.set(100, 500, 300)
    light.castShadow = true
    light.shadow.mapSize.width = 512 
    light.shadow.mapSize.height = 512 
    light.shadow.camera.near = 1
    light.shadow.camera.far = 1000
    
    scene.add(light)
    
    var lightAB = new THREE.AmbientLight( 0xffffff, 2)
    lightAB.name = 'MyABlihght'
    lightAB.position.set(500, 0, 500)
    scene.add(lightAB)

    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.shadowMap.enabled = true;
    render.shadowMap.type = THREE.PCFSoftShadowMap;
    render.setClearColor(0x888888,1);
    render.setSize(window.innerWidth-16,window.innerHeight-16);

    document.body.appendChild(render.domElement);
    controls = new OrbitControls( camera, render.domElement);
    controls.target = new THREE.Vector3(0,90,0)
   
    addEventListener("resize",() => {
        camera.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera.updateProjectionMatrix();
        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },false);
    
    animateFrame();
}


main();