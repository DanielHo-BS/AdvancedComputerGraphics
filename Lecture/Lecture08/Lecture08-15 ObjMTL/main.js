import * as THREE from 'three';
import { MTLLoader } from 'MTLLoader';
import { OBJLoader } from 'OBJLoader';
import { OrbitControls } from 'OrbitControls';

var render
var scene
var camera
var controls

function animateFrame()
{
   
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
    camera.position.set(0,-300,300);
    scene.add(camera);
    
    //Mesh (still local var, we will retrive it by getObjectByName)
    new MTLLoader()
                    .load( './Dog.mtl', function ( materials ) {
						materials.preload();

                        new OBJLoader()
							.setMaterials( materials )
							.load( './Dog.obj', function ( object ) {
                                object.name = 'MyOBJColor'
                                object.position.x = object.position.x + 50 
								
                                object.traverse(function(child){
                                    child.castShadow = true;
                                    
                                });
                                scene.add( object );
							} );

					} );
    
    // Plane structure
    var planeGeometry = new THREE.PlaneGeometry(1500, 1500)
    var plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ color: 0xBBAABB }))
    plane.position.z = -1
    plane.receiveShadow = true
    scene.add(plane)

    var light = new THREE.PointLight( 0xffffff, 5, 10000, 0.05)
    light.name = 'MyPTlihght'
    light.position.set(150, -300, 300)
    light.castShadow = true
    light.shadow.mapSize.width = 512 
    light.shadow.mapSize.height = 512 
    light.shadow.camera.near = 10
    light.shadow.camera.far = 10000
    
    var lightAb = new THREE.AmbientLight( 0xffffff, 2)

    scene.add(light)
    scene.add(lightAb)
    

    const lighthelper = new THREE.PointLightHelper(light) 
    scene.add(lighthelper)
    
    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.shadowMap.enabled = true;
    render.shadowMap.type = THREE.PCFSoftShadowMap;
    render.setClearColor(0x000000,1);
    render.setSize(window.innerWidth-16,window.innerHeight-16);

    document.body.appendChild(render.domElement);
    controls = new OrbitControls( camera, render.domElement);
    controls.target.set(0,0,100)
   
    addEventListener("resize",() => {
        camera.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera.updateProjectionMatrix();
        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },false);
    
    animateFrame();
}


main();