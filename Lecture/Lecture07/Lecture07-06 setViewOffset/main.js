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

    const w = 640;
    const h = 480;
    const fullWidth = w * 3;
    const fullHeight = h * 2;
    
    frameCount = (frameCount+1)%630;
    var floorVaule = frameCount%90
    var CamID = (frameCount-floorVaule)/90


    camera.aspect = 640 / 480;
    camera.updateProjectionMatrix();
    render.setSize(640, 480);

    if (CamID==0) camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
    if (CamID==1) camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
    if (CamID==2) camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
    if (CamID==3) camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
    if (CamID==4) camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
    if (CamID==5) camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
    if (CamID==6) 
    {
        camera.aspect = 640*1.5 / 480;
        camera.updateProjectionMatrix();
        render.setSize(640*1.5, 480);
        camera.setViewOffset( w*1.5,h,0,0,w*1.5,h)
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
    camera = new THREE.PerspectiveCamera(45, 640 / 480, 1, 1000)
    camera.position.set(0,-500,300);
    
    scene.add(camera);
    
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