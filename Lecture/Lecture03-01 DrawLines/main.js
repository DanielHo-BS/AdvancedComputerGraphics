import * as THREE from 'three';

function main()
{
    //camera 
    var camera = new THREE.OrthographicCamera( 640 / - 2, 640 / 2, 480 / 2, 480 / - 2, -1000, 1000 );
    camera.position.set(0,0,0);
    
    //Geometry 
    var vertices = [];
    vertices.push( new THREE.Vector3(100,100, 0 ) );
    vertices.push( new THREE.Vector3(-100,100, 0 ) );
    vertices.push( new THREE.Vector3(-100,-100, 0 ));
    vertices.push( new THREE.Vector3(100,-100, 0 ) );
    
    var geometry = new THREE.BufferGeometry().setFromPoints(vertices)

    //material 
    var material = new THREE.PointsMaterial( { color: 0xFF0000 } );
    
    //Line 
    var line = new THREE.LineLoop(geometry, material);
    
    //Scene 
    var scene = new THREE.Scene();
 
    scene.add(camera);
    scene.add(line);

    //Render 
    var render = new THREE.WebGLRenderer();
    render.setClearColor(0x000000,1);
    render.setSize(640,480);
    document.body.appendChild(render.domElement);

    render.render(scene,camera);
}


main();