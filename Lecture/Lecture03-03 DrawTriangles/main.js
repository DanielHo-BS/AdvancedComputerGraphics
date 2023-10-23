import * as THREE from 'three';

function main()
{
    //camera 
    var camera = new THREE.OrthographicCamera( 640 / - 2, 640 / 2, 480 / 2, 480 / - 2, -1000, 1000 );
    camera.position.set(0,0,0);
    
    //Geometry 
    var vertices = [];
    vertices.push( new THREE.Vector3(100,100, 1 ) );  //0
    vertices.push( new THREE.Vector3(-100,100, 1 ) ); //1
    vertices.push( new THREE.Vector3(-100,-100, 1 )); //2
    vertices.push( new THREE.Vector3(100,-100, 1 ) ); //3
    
    //Two triangles (as indices)
    var indices = [
        0, 1, 2,
        2, 3, 0,
    ];

    var geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    geometry.setIndex( indices );
    
    var a = new THREE.Vector3( 0, 0, 1 );
    a.normalize();
    var ra = new THREE.Matrix4().makeRotationAxis( a , 30 / 180 *Math.PI );
    geometry.applyMatrix4(ra);

    //material 
    var material = new THREE.MeshBasicMaterial( { color: 0x00FF00 , wireframe: true} );
    
    //Mesh 
    var mesh = new THREE.Mesh(geometry, material);
    
    var gridHelper = new THREE.GridHelper(500,10);
    gridHelper.geometry.rotateX( - Math.PI / 2 );

    //Scene 
    var scene = new THREE.Scene();
 
    scene.add(camera);
    scene.add(mesh);
    scene.add(gridHelper);

    //Render 
    var render = new THREE.WebGLRenderer();
    render.setClearColor(0x000000,1);
    render.setSize(640,480);
    document.body.appendChild(render.domElement);

    render.render(scene,camera);

}


main();