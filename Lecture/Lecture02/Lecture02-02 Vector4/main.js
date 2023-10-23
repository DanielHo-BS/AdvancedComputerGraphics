function main()
{
    var a = new THREE.Vector4( 2.5, 1, 0.1, 1 );
    var b = new THREE.Vector4( 4, 1, 0.5, 1 );

    a.add(b);
    var c = a;

    var d = a.add(new THREE.Vector4( -1, 4, -0.5, 0 ))
    
    console.log('a = ', a);
    console.log('b = ', b);
    console.log('c = ', c);
    console.log('d = ', d);

    console.log('a*d=' + a.dot(d) );
}


main();