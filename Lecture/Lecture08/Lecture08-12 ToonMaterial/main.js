import * as THREE from 'three';
import { STLLoader } from 'STLLoader';
import { OrbitControls } from 'OrbitControls';

var render
var scene
var camera
var controls

var frameCount=0

function animateFrame()
{
    var light = scene.getObjectByName('MyPTlihght')
    if (light)
    {
        var pt = light.position.clone()
        var ra = new THREE.Matrix4()
        ra.makeRotationZ(Math.PI/180.0*0.5)
        pt.applyMatrix4(ra)
        light.position.x = pt.x;
        light.position.y = pt.y;
        light.position.z = pt.z;
        light.intensity = 15 + 15*Math.sin(frameCount++/180*Math.PI)
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
    camera = new THREE.PerspectiveCamera(45, (window.innerWidth-16) / (window.innerHeight-16), 1, 2000)
    camera.position.set(0,-500,300);
    scene.add(camera);

    //material 
    var material = new THREE.MeshToonMaterial({ color: 0x888888 })
   
    //Mesh (still local var, we will retrive it by getObjectByName)
    var loader = new STLLoader()
    loader.load('./Monkey.stl', (geometry) => 
    { 
        var mesh = new THREE.Mesh( geometry, material )
        mesh.name = 'MySTL'
        mesh.castShadow = true
        scene.add(mesh)          } )
    
    // Plane structure
    var planeGeometry = new THREE.PlaneGeometry(1500, 1500)
    var plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ color: 0xBBAABB }))
    plane.position.z = -1
    plane.receiveShadow = true
    scene.add(plane)

    const geometry = new THREE.BoxGeometry(50, 50, 50);
    var cube = new THREE.Mesh(geometry,  material ) 
    cube.position.set(-100, 0, 25)
    cube.castShadow = true
    cube.receiveShadow = true
    scene.add(cube)

    //
    var axisHelper = new THREE.AxesHelper(100);
    scene.add(axisHelper);

    var light = new THREE.PointLight( 0xffffff, 1, 10000, 0.05)
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
    render.setSize(window.innerWidth-16,window.innerHeight-16);

    document.body.appendChild(render.domElement);
    controls = new OrbitControls( camera, render.domElement);
   
    addEventListener("resize",() => {
        camera.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera.updateProjectionMatrix();
        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },false);
    
    animateFrame();
}


main();