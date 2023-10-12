// Student: Ho Bo Sheng
// Student ID: M11107309
// Date: 2023/10/12

//Set the globle var
var render
var scene
var camera

function animateFrame() { //Animation
    //Get the object from scene
    var centerOfRotation = new THREE.Vector3(100, 50, 0);
    const rotationAxis = new THREE.Vector3(0, 0, 1);
    const rotationSpeed = -2.5 / 180 * Math.PI; // 2.5 degree per second
    
    var hour = scene.getObjectByName('hour')
    if (hour) {
        Rotation(hour, rotationAxis, rotationSpeed / 12, centerOfRotation);
    }
    var minute = scene.getObjectByName('minute')
    if (minute) {
        Rotation(minute, rotationAxis, rotationSpeed, centerOfRotation);
    }

    render.render(scene, camera);
    requestAnimationFrame(animateFrame)
}

function Rotation(mesh, rotationAxis, rotationSpeed, centerOfRotation) { //Rotation
    // Set the center of rotation
    mesh.position.sub(centerOfRotation);
    // Rotate the object
    var rotationMatrix  = new THREE.Matrix4().makeRotationAxis(rotationAxis, rotationSpeed);
    mesh.applyMatrix4(rotationMatrix);
    // Reset the center of rotation
    mesh.position.add(centerOfRotation);
}

function Dodecagon(centerX, centerY, centerZ, radius, numSides) { //Dodecagon
    //Dodecagon (as vertices)
    var angle = (2 * Math.PI) / numSides;
    var vertices = [];
    vertices.push(new THREE.Vector3(centerX, centerY, centerZ));  // center of the circle
    for (let i = 0; i < numSides; i++) {
        const x = centerX + radius * Math.cos(i * angle);
        const y = centerY + radius * Math.sin(i * angle);
        const z = centerZ; // Z-coordinate is set to 0

        vertices.push(new THREE.Vector3(x, y, z));
    }

    //Dodecagon (as indices)
    var indices = [
        0, 1, 2,
        2, 3, 0,
        0, 3, 4,
        4, 5, 0,
        0, 5, 6,
        6, 7, 0,
        0, 7, 8,
        8, 9, 0,
        0, 9, 10,
        10, 11, 0,
        0, 11, 12,
        12, 1, 0
    ];

    //geometry
    var geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    geometry.setIndex(indices);

    //material 
    var material = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: false });

    //Mesh 
    return new THREE.Mesh(geometry, material);
}

function Diamond(centerX, centerY, centerZ, radius, color) { //Diamond
    //Diamond (as vertices)
    var vertices = [];
    vertices.push(new THREE.Vector3(centerX, centerY, centerZ));  //0
    vertices.push(new THREE.Vector3(centerX, centerY - 25, centerZ)); //1
    vertices.push(new THREE.Vector3(centerX + 50 * radius, centerY - 50 * radius, centerZ)); //2
    vertices.push(new THREE.Vector3(centerX + 25, centerY, centerZ)); //3

    //Diamond (as indices)
    var indices = [
        0, 1, 2,
        2, 3, 0,
    ];

    //geometry
    var geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    geometry.setIndex(indices);

    //material 
    var material = new THREE.MeshBasicMaterial({ color: color, wireframe: false });

    //Mesh 
    return new THREE.Mesh(geometry, material);
}

function main() {
    //camera (as globle var)
    camera = new THREE.OrthographicCamera(640 / - 2, 640 / 2, 480 / 2, 480 / - 2, -1000, 1000);
    camera.position.set(0, 0, 5);

    //Create Meshs 
    var mesh = Dodecagon(0, 0, 0, 150, 12);
    mesh.name = 'circle'
    var mesh2 = Diamond(0, 0, 2, 1, 0x004B97);
    mesh2.name = 'hour'
    var mesh3 = Diamond(0, 0, 1, 2, 0x0080FF);
    mesh3.name = 'minute'


    //Set the position of the object
    mesh.position.set(100, 50, 0)
    mesh2.position.set(100, 50, 0)
    mesh3.position.set(100, 50, 0)

    //Initial rotation of the object 
    mesh2.rotateZ(45 / 180 * Math.PI);
    mesh3.rotateZ(135 / 180 * Math.PI);

    var gridHelper = new THREE.GridHelper(500, 10);
    gridHelper.geometry.rotateX(- Math.PI / 2);

    //Scene (as globle var)
    scene = new THREE.Scene();
    scene.add(camera);
    scene.add(mesh);
    scene.add(mesh2);
    scene.add(mesh3);
    scene.add(gridHelper);

    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.setClearColor(0x000000, 1);
    render.setSize(640, 480);
    document.body.appendChild(render.domElement);

    //Animation
    animateFrame();
}


main();
