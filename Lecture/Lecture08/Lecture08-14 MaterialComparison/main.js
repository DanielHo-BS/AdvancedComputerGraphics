import * as THREE from 'three';
import { PLYLoader } from 'PLYLoader';
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
    camera = new THREE.PerspectiveCamera(45, (window.innerWidth-16) / (window.innerHeight-16), 200, 500)
    camera.position.set(0,-250,250);
    scene.add(camera);

    //material 
    //var material = new THREE.MeshBasicMaterial({vertexColors: true, wireframe: false})
    //var material = new THREE.MeshDepthMaterial()
    //var material = new THREE.MeshLambertMaterial({vertexColors: true, wireframe: false})
    //var material = new THREE.MeshMatcapMaterial({vertexColors: true, wireframe: false})
    //var material = new THREE.MeshNormalMaterial()
    //var material = new THREE.MeshPhongMaterial({ vertexColors: true})
    //var material = new THREE.MeshPhysicalMaterial({ vertexColors: true })
    //var material = new THREE.MeshStandardMaterial({ vertexColors: true })
    //var material = new THREE.MeshToonMaterial({ vertexColors: true })
    var material = new THREE.PointsMaterial({ vertexColors: true })
   
    //Mesh (still local var, we will retrive it by getObjectByName)
    var loader = new PLYLoader()
    loader.load('./Knight2.ply', (geometry) => 
    { 
        geometry.computeVertexNormals()
        var mesh = new THREE.Mesh(geometry, material)
        geometry.Norma
        mesh.name = 'MyPLY'
        mesh.castShadow = true
        mesh.receiveShadow = true
        scene.add(mesh) } )
    
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

    var light = new THREE.PointLight( 0xffffff, 10, 10000, 0.05)
    light.name = 'MyPTlihght'
    light.position.set(100, -100, 250)
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
    controls.target = new THREE.Vector3(0,0,50)
   
    addEventListener("resize",() => {
        camera.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera.updateProjectionMatrix();
        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },false);
    
    animateFrame();
}


main();