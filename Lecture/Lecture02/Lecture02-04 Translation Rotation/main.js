function main()
{
    //Translation
    var t = new THREE.Matrix4().makeTranslation( 100, -30, 40)

    console.log('t',t)
    
    //Rotation
    var rx = new THREE.Matrix4().makeRotationX( 30 / 180 * Math.PI)
    var ry = new THREE.Matrix4().makeRotationX( 45 / 180 * Math.PI)
    var rz = new THREE.Matrix4().makeRotationX( 60 / 180 * Math.PI)
    
    console.log('rx',rx)
    console.log('ry',ry)
    console.log('rz',rz)

    var a = new THREE.Vector3( 1, 3, 2 )
    a.normalize()
    var ra = new THREE.Matrix4().makeRotationAxis( a , 45 / 180 *Math.PI )

    console.log('ra',ra)

}


main();