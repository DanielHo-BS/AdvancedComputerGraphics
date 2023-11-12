import * as THREE from 'three';

function main()
{
    var persMatrix = new THREE.Matrix4()
    var orthMatrix = new THREE.Matrix4()

    console.log('persMatrix(before)',  persMatrix.elements)
    console.log('orthMatrix(before)',  orthMatrix.elements)

    persMatrix.makePerspective(-4, +4, +3, -3, 1, 1000)
    orthMatrix.makeOrthographic(-320,320,240,-240,0,1000)

    console.log('persMatrix(after)',  persMatrix.elements)
    console.log('orthMatrix(after)',  orthMatrix.elements)

}


main();