import * as THREE from 'three';
import { RGBELoader } from 'RGBELoader';
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
    var mesh  = scene.getObjectByName('MyglTF',true)

    if (mesh)
    {
        var box = new THREE.Box3().setFromObject( mesh );
        var center = box.getCenter( new THREE.Vector3() );
        controls.target = center
        mesh.rotation.y = (frameCount++%720)*Math.PI/180/2
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
    camera.position.set(0,0,300);
    scene.add(camera);

    
    //Mesh (still local var, we will retrive it by getObjectByName)
    new RGBELoader().load( '../360HDR/NTUST_IB.hdr', function ( texture ) {

						texture.mapping = THREE.EquirectangularReflectionMapping;

						scene.background = texture;
						scene.environment = texture;

					} );

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
       
       mesh.name = 'MyglTF'

       scene.add(glb.scene)
    })

    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.setClearColor(0x000000,1);
    render.setSize(window.innerWidth-16,window.innerHeight-16);

    document.body.appendChild(render.domElement);
    controls = new OrbitControls( camera, render.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5 
                    
    addEventListener("resize",() => {
        camera.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera.updateProjectionMatrix();
        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },false);


    animateFrame();
}


main();