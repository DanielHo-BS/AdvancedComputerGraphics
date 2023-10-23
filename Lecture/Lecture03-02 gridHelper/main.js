import * as THREE from 'three';

function main()
{
    //camera 
    var camera = new THREE.OrthographicCamera( 640 / - 2, 640 / 2, 480 / 2, 480 / - 2, -1000, 1000 );
    camera.position.set(0,0,0);
    
    var gridHelper = new THREE.GridHelper(500,10);
    gridHelper.geometry.rotateX( - Math.PI / 2 );
    
  
    //Scene 
    var scene = new THREE.Scene();
 
    scene.add(camera);
    scene.add(gridHelper);

    //Render 
    var render = new THREE.WebGLRenderer();
    render.setClearColor(0x000000,1);
    render.setSize(640,480);
    document.body.appendChild(render.domElement);

    render.render(scene,camera);
}


main();