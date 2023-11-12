import * as THREE from 'three';
import { MTLLoader } from 'MTLLoader';
import { OBJLoader } from 'OBJLoader';
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
        ra.makeRotationZ(Math.PI/180.0*0.5)
        pt.applyMatrix4(ra)
        //light.position.x = pt.x;
        //light.position.y = pt.y;
        //light.position.z = pt.z;
    }

    controls.update();    
    render.render(scene,camera);

    if (frameCount++%300 ==0 )
    {
        var matrixWorld = camera.matrixWorldInverse.clone()
        matrixWorld.invert()
        console.log("matrixWorld" , matrixWorld.elements)
        console.log("camera.matrix", camera.matrix.elements)
    }
   
    requestAnimationFrame(animateFrame)
}

function main()
{
    //Scene (as globle var)
    scene = new THREE.Scene();

    //camera (as globle var)
    camera = new THREE.PerspectiveCamera(45, 640 / 480, 1, 1000)
    camera.position.set(0,-500,300);
    scene.add(camera);
    
    console.log(camera.projectionMatrix.elements)
    

    //material 
    var materialWire = new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true })
    
    //Mesh (still local var, we will retrive it by getObjectByName)
    new MTLLoader()
                    .load( './Dog.mtl', function ( materials ) {
						materials.preload();

                        new OBJLoader()
							.setMaterials( materials )
							.load( './Dog.obj', function ( object ) {
                                object.name = 'MyOBJColor'
								
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

    const geometry = new THREE.BoxGeometry(50, 50, 50);
    var cube = new THREE.Mesh(geometry,  materialWire ) 
    cube.position.set(100, 0, 25)
    cube.castShadow = true
    cube.receiveShadow = true
    scene.add(cube)

    //
    var axisHelper = new THREE.AxesHelper(100);
    scene.add(axisHelper);

    var light = new THREE.PointLight( 0xffffff, 10, 10000, 0.05)
    light.name = 'MyPTlihght'
    light.position.set(200, 0, 300)
    light.castShadow = true
    light.shadow.mapSize.width = 512 
    light.shadow.mapSize.height = 512 
    light.shadow.camera.near = 10
    light.shadow.camera.far = 10000
    
    scene.add(light)

    const lighthelper = new THREE.PointLightHelper(light) 
    scene.add(lighthelper)

    
    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.shadowMap.enabled = true;
    render.shadowMap.type = THREE.PCFSoftShadowMap;
    render.setClearColor(0x000000,1);
    render.setSize(640, 480);

    document.body.appendChild(render.domElement);
    controls = new OrbitControls( camera, render.domElement);
   
    animateFrame();
}


main();