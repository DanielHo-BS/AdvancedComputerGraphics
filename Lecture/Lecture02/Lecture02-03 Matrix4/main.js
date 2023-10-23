function main()
{
    var a = new THREE.Vector4( 2, 1, 4 ,1)
    var m1 = new THREE.Matrix4()

    var m2 = new THREE.Matrix4(1,2,3,4,5,6,7,8,9,10,11,12,0,0,0,1)

    console.log('a = ', a)
    console.log('m1 = ', m1)
    console.log('m2 = ', m2)

    console.log('a after m2*a',a.applyMatrix4(m2))

    m1.makeBasis(new THREE.Vector3(1,3,2),new THREE.Vector3(1,3,2),new THREE.Vector3(1,3,2))
    console.log('m1 = ', m1)
    a = new THREE.Vector4( 2, 1, 4 ,1)
    console.log('m1*a',a.applyMatrix4(m1))
    console.log('m1.transpose = ',  m1.transpose())

}


main();