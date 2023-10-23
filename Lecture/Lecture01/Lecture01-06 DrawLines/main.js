function main()
{
    //camera 
    var camera = new THREE.OrthographicCamera( 640 / - 2, 640 / 2, 480 / 2, 480 / - 2, -1000, 1000 );
    camera.position.set(0,0,0);
    
    //Geometry 
    var vertices = [];
    vertices.push( 100, 100, 0 );
    vertices.push( -100, 100, 0 );
    vertices.push( -100, -100, 0 );
    vertices.push( 100, -100, 0 );
    
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    
    //material 
    var material = new THREE.PointsMaterial( { color: 0xFF0000 } );
    //point tree major types 
    var line = new THREE.Line(geometry, material);
    //var line = new THREE.LineLoop(geometry, material);
    //var line = new THREE.LineSegments(geometry, material);
    
    //Scene 
    var scene = new THREE.Scene();
 
    scene.add(camera);
    scene.add(line);

    //Render 
    var render = new THREE.WebGLRenderer();
    render.setClearColor('black',1);
    render.setSize(640,480);
    document.body.appendChild(render.domElement);

    render.render(scene,camera);
}

main();
