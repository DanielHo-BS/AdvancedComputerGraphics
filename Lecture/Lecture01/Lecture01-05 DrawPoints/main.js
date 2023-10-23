function main()
{
    //camera 
    var camera = new THREE.OrthographicCamera( 640 / - 2, 640 / 2, 480 / 2, 480 / - 2, -1000, 1000 );
    camera.position.set(0,0,0);
    
    //Geometry 
    var vertices = [];
    for (var i=0;i<500;i++)
    {
        var x = THREE.MathUtils.randFloatSpread( 640 ) ;
	    var y = THREE.MathUtils.randFloatSpread( 480 ) ;
	    var z = THREE.MathUtils.randFloatSpread( 1000 ) ;

        vertices.push( x, y, z );
    }
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    
    //material 
    var material = new THREE.PointsMaterial( { color: 0xFFFF00 } );
    //point 
    var point = new THREE.Points(geometry, material);
 
    //Scene 
    var scene = new THREE.Scene();
 
    scene.add(camera);
    scene.add(point);

    //Render 
    var render = new THREE.WebGLRenderer();
    render.setClearColor('black',1);
    render.setSize(640,480);
    document.body.appendChild(render.domElement);

    render.render(scene,camera);
}

main();
