function main()
{
    var a = new THREE.Vector3( 2.5, 1, -1);
    var b = new THREE.Vector3( 4, 1, 1.5);
    
    console.log('initial a = ', a);

    a.add(b);
    var c = a;

    var d = a.add(new THREE.Vector3( -1, 4, -0.5 ));
    
    console.log('a = ', a);
    console.log('b = ', b);
    console.log('c = ', c);
    console.log('d = ', d);

    console.log('a*d=', a.dot(d) );
    
    console.log('distance(a, b)=', a.distanceTo(b) );
    
}

main();