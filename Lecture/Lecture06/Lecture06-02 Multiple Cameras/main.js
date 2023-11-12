import * as THREE from 'three';
import { STLLoader } from 'STLLoader';
import { OrbitControls } from 'OrbitControls';

var render
var scene
var camera1, camera2, camera3
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

    frameCount = (frameCount+1)%540;
    var floorVaule = frameCount%180
    var CamID = (frameCount-floorVaule)/180
    
    controls.update();    
    
    if (CamID == 0)  render.render(scene,camera1);
    if (CamID == 1)  render.render(scene,camera2);
    if (CamID == 2)  render.render(scene,camera3);
    //render.render(scene,camera2);

    requestAnimationFrame(animateFrame)
}

function main()
{
    //Scene (as globle var)
    scene = new THREE.Scene();

    //camera (as globle var)
    camera1 = new THREE.PerspectiveCamera(45, (window.innerWidth-16) / (window.innerHeight-16), 5, 3000)
    camera1.position.set(0,-500,500);
    
    camera2 = new THREE.PerspectiveCamera(60, (window.innerWidth-16) / (window.innerHeight-16), 5, 3000)
    camera2.position.set(300,-300,300);
    camera2.lookAt(0,0,0)
    camera2.up.set(0,1,0)
    
    camera3 = new THREE.PerspectiveCamera(60, (window.innerWidth-16) / (window.innerHeight-16), 5, 3000)
    camera3.up.set(0,1,0)
    camera3.lookAt(0,0,0)
    camera3.position.set(300,-300,300);
    
    scene.add(camera1);
    scene.add(camera2);
    scene.add(camera3);
    
    //material 
    var material = new THREE.MeshStandardMaterial({color: 0x888888, wireframe: false})
    
    //Mesh (still local var, we will retrive it by getObjectByName)
    var loader = new STLLoader()
    loader.load('./Monkey.stl', (geometry) => 
    { 
        var mesh = new THREE.Mesh(geometry, material)
        mesh.name = 'MySTL'
        scene.add(mesh) } )
    
    // Plane structure
    var planeGeometry = new THREE.PlaneGeometry(500, 500)
    var plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ color: 0xBBAABB }))
    plane.position.z = -10
    scene.add(plane)

    const geometry = new THREE.BoxGeometry(50, 50, 50);
    var cube = new THREE.Mesh(geometry, material) 
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

    const camera1Helper = new THREE.CameraHelper(camera1) 
    const camera2Helper = new THREE.CameraHelper(camera2)
    const camera3Helper = new THREE.CameraHelper(camera3) 
    scene.add(camera1Helper)
    scene.add(camera2Helper)
    scene.add(camera3Helper)
    
    
    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.setClearColor(0x888888,1);
    render.setSize(window.innerWidth-16,window.innerHeight-16);

    document.body.appendChild(render.domElement);
    controls = new OrbitControls( camera1, render.domElement);
   
    addEventListener("resize",() => {
        camera1.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera1.updateProjectionMatrix();
        
        camera2.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera2.updateProjectionMatrix();
        
        camera3.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera3.updateProjectionMatrix();

        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },false);


    animateFrame();
}


main();