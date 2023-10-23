function main()
{
    //camera 
    var camera = new THREE.OrthographicCamera( 640 / - 2, 640 / 2, 480 / 2, 480 / - 2, -1000, 1000 );
    camera.position.set(0,0,0);
    
    //Geometry 
    //geometry = new THREE.IcosahedronGeometry(100,1);
    var geometry = new THREE.BoxGeometry( 100, 100, 100 ); 

    //material 
    var material = new THREE.MeshBasicMaterial({ color:0xFF0000,wireframe:true });
    
    //Mesh 
    var mesh = new THREE.Mesh(geometry,material);
 
    //Scene 
    var scene = new THREE.Scene();
 
    scene.add(camera);
    scene.add(mesh);

    //Render 
    var render = new THREE.WebGLRenderer();
    render.setClearColor('black',1);
    render.setSize(640,480);
    document.body.appendChild(render.domElement);

    render.render(scene,camera);
}

main();