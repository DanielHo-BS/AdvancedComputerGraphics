import * as THREE from 'three';
import { PLYLoader } from 'PLYLoader';
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
    camera = new THREE.PerspectiveCamera(45, 640.0/480.0, 5, 3000)
    camera.position.set(0,0,250);
    
    //material 
    var material = new THREE.PointsMaterial({size:0.1, vertexColors: true})
    
    //Mesh (still local var, we will retrive it by getObjectByName)
    var loader = new PLYLoader()
    loader.load('./Knight2.ply', (geometry) => 
    { 
        geometry.computeBoundingBox();
        var tmatrix = new THREE.Matrix4;
        tmatrix.makeTranslation(- (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2,- (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2,- (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2)
        geometry.applyMatrix4(tmatrix)
        
        var mesh = new THREE.Mesh(geometry, material)
        mesh.name = 'MyPLY'
        mesh.rotation.x = -Math.PI /2 

        scene.add(mesh) })
    
    //
    //var axisHelper = new THREE.AxesHelper(100);

    var light = new THREE.PointLight( 0xffffff, 10, 10000, 0.1)
    light.position.set(camera.position.x,camera.position.y,camera.position.z)  
    light.name = 'MyLight'

    scene.add(camera);
    //scene.add(axisHelper);
    scene.add(light)


    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.setClearColor(0x888888,1);
    render.setSize(640,480);
    document.body.appendChild(render.domElement);

    controls = new OrbitControls( camera, render.domElement);
    controls.autoRotate = true;

    animateFrame();
}


main();