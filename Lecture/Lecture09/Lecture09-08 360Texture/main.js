import * as THREE from 'three';
import { RGBELoader } from 'RGBELoader';
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
    camera.position.set(0,0,1);
    scene.add(camera);

    
    //Mesh (still local var, we will retrive it by getObjectByName)

    new RGBELoader().load( '../360HDR/NTUST_Front.hdr', function ( texture ) {

						texture.mapping = THREE.EquirectangularReflectionMapping;

						scene.background = texture;
						scene.environment = texture;

					} );

    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.setClearColor(0x000000,1);
    render.setSize(window.innerWidth-16,window.innerHeight-16);

    document.body.appendChild(render.domElement);
    controls = new OrbitControls( camera, render.domElement);
    controls.autoRotate = true;
                    
    addEventListener("resize",() => {
        camera.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera.updateProjectionMatrix();
        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },false);


    animateFrame();
}


main();