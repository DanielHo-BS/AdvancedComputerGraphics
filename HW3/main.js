import * as THREE from 'three';
import { DRACOLoader } from 'DRACOLoader';
import { GLTFLoader } from 'GLTFLoader';
import { MTLLoader } from 'MTLLoader';
import { OBJLoader } from 'OBJLoader';
import { SVD } from 'svd-js'

var render
var scene
var camera
var TrackCenterPoints
var TrackCenterNormals
var Idx = 0
// Define the maximum pitch angle
const maxPitch = Math.PI / 2;
const maxYaw = Math.PI;
// Create variables for the cumulative pitch and yaw angles and the current orientation
let cumulativePitch = 0;
let cumulativeYaw = 0;
const currentQuaternion = new THREE.Quaternion();
const targetQuaternion = new THREE.Quaternion();

function animateFrame() {
    //Get the object from scene
    var mesh = scene.getObjectByName('TaxiCar', true)
    if (mesh) {
        // Get the target point
        var currentPosition = mesh.position;
        var targetPosition = TrackCenterPoints[Idx];

        // Calculate the angle
        const targetRotation = calculateRotation(currentPosition, targetPosition)
        // Interpolate between the current quaternion and the target quaternion
        const interpolationFactor = 0.1; // Adjust as needed
        currentQuaternion.slerp(targetRotation, interpolationFactor);

        // Rotate the car
        //mesh.rotation.z += smoothedAngles.yaw;
        //mesh.rotation.y += smoothedAngles.pitch;
        mesh.setRotationFromQuaternion(currentQuaternion);

        // Move the car
        mesh.position.set(targetPosition.x, targetPosition.y, targetPosition.z);

        //-----Method2 (using rigid_transform_3D)-----
        // // get the transform matrix from the current position to the target position
        // var Rt = rigid_transform_3D(currentPosition, targetPosition);

        // // Rotate and move the car by the transform matrix (Matrix4)
        // mesh.applyMatrix4(Rt);
        // mesh.position.set(targetPosition.x, targetPosition.y, targetPosition.z);

        // Move to the next point
        Idx++;
        if (Idx === TrackCenterPoints.length) Idx = 0;
    }

    render.render(scene, camera);

    requestAnimationFrame(animateFrame)
}

const calculateRotation = (currentPosition, targetPosition) => {
    // Calculate the direction vector from the current to the target position
    const direction = new THREE.Vector3();
    direction.subVectors(targetPosition, currentPosition);

    // Calculate the pitch, roll and yaw angles (Euler angles)
    const pitch = Math.atan2(direction.z, Math.sqrt(direction.x ** 2 + direction.y ** 2));
    const yaw = Math.atan2(direction.y, direction.x);


    // Smooth the pitch, roll and yaw angles to avoid sudden changes
    const maxPitchChange = 0.01; // Adjust as needed
    const maxYawChange = 0.01; // Adjust as needed
    const smoothedPitch = Math.max(-maxPitch, Math.min(maxPitch, pitch + cumulativePitch));
    const smoothedYaw = Math.max(-maxYaw, Math.min(maxYaw, yaw + cumulativeYaw));
    cumulativePitch += Math.min(maxPitchChange, Math.max(-maxPitchChange, smoothedPitch - pitch));
    cumulativeYaw += Math.min(maxYawChange, Math.max(-maxYawChange, smoothedYaw - yaw));

    // Calculate the target quaternion based on the smoothed pitch and yaw
    targetQuaternion.setFromEuler(new THREE.Euler(smoothedPitch, 0, smoothedYaw + Math.PI / 2));

    return targetQuaternion;
};

function rigid_transform_3D(A, B) {
    // A and B are vector of 3D point in THREE.Vector3 
    // A.x = 18.7904, A.y = 6.9591, A.z = 101.5975
    // A.x = 18.7923, A.y = 12.5236, A.z = 101.5912

    // H = A.T * B
    // A.T = [A.x, A.y, A.z]
    // B = [B.x, B.y, B.z]
    // H = [H.xx, H.xy, H.xz]
    //     [H.yx, H.yy, H.yz]
    //     [H.zx, H.zy, H.zz]
    var H = [
        [A.x * B.x, A.x * B.y, A.x * B.z],
        [A.y * B.x, A.y * B.y, A.y * B.z],
        [A.z * B.x, A.z * B.y, A.z * B.z]
    ];
    // SVD from svd-js
    var {u, v, q} = SVD(H);
    // R = V * U.T
    // V = [v.xx, v.xy, v.xz]
    //     [v.yx, v.yy, v.yz]
    //     [v.zx, v.zy, v.zz]
    // U = [u.xx, u.xy, u.xz]
    //     [u.yx, u.yy, u.yz]
    //     [u.zx, u.zy, u.zz]
    // U.T = [u.xx, u.yx, u.zx]
    //       [u.xy, u.yy, u.zy]
    //       [u.xz, u.yz, u.zz]
    // R = [R.xx, R.xy, R.xz]
    //     [R.yx, R.yy, R.yz]
    //     [R.zx, R.zy, R.zz]
    var R = new THREE.Matrix3();
    R.set(v[0][0] * u[0][0] + v[1][0] * u[1][0] + v[2][0] * u[2][0],
        v[0][0] * u[0][1] + v[1][0] * u[1][1] + v[2][0] * u[2][1],
        v[0][0] * u[0][2] + v[1][0] * u[1][2] + v[2][0] * u[2][2],
        v[0][1] * u[0][0] + v[1][1] * u[1][0] + v[2][1] * u[2][0],
        v[0][1] * u[0][1] + v[1][1] * u[1][1] + v[2][1] * u[2][1],
        v[0][1] * u[0][2] + v[1][1] * u[1][2] + v[2][1] * u[2][2],
        v[0][2] * u[0][0] + v[1][2] * u[1][0] + v[2][2] * u[2][0],
        v[0][2] * u[0][1] + v[1][2] * u[1][1] + v[2][2] * u[2][1],
        v[0][2] * u[0][2] + v[1][2] * u[1][2] + v[2][2] * u[2][2]);
    
    // special reflection case
    if (R.determinant() < 0) {
        //console.log("Reflection detected");
        R.set(-R.elements[0], -R.elements[1], -R.elements[2], -R.elements[3], -R.elements[4], -R.elements[5], -R.elements[6], -R.elements[7], -R.elements[8]);
    }

    // t = -R * A + B
    // t = [t.x, t.y, t.z]
    var t = new THREE.Vector3();
    t.x = -R.elements[0] * A.x - R.elements[1] * A.y - R.elements[2] * A.z + B.x;
    t.y = -R.elements[3] * A.x - R.elements[4] * A.y - R.elements[5] * A.z + B.y;
    t.z = -R.elements[6] * A.x - R.elements[7] * A.y - R.elements[8] * A.z + B.z;
    
    // Convert R and t to THREE.Matrix4
    var Rt = new THREE.Matrix4();
    Rt.set(R.elements[0], R.elements[3], R.elements[6], t.x,
        R.elements[1], R.elements[4], R.elements[7], t.y,
        R.elements[2], R.elements[5], R.elements[8], t.z,
        0, 0, 0, 1);
    console.log(Rt);
    return Rt;
}


function main() {
    // Scene (as globle var)
    scene = new THREE.Scene();

    // Camera (as globle var)
    camera = new THREE.OrthographicCamera(640 / - 2, 640 / 2, 480 / 2, 480 / - 2, -1000, 1000);
    camera.position.set(0, 0, 300);
    camera.lookAt(0, 0, 0);

    // Mesh (still local var, we will retrive it by getObjectByName)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('../node_modules/three/examples/jsm/libs/draco/');

    // Load the TrackCenter.xyz text file and parse the data.
    var TrackCenter = new XMLHttpRequest();
    TrackCenter.open("GET", "./TrackCenter.xyz", false);
    TrackCenter.send(null);
    var TrackCenterData = TrackCenter.responseText;
    var TrackCenterLines = TrackCenterData.split('\n');
    TrackCenterPoints = [];
    TrackCenterNormals = [];
    for (var i = 0; i < TrackCenterLines.length; i++) {
        // each line has 6 values: x, y, z, nx, ny, and nz
        var TrackCenterLine = TrackCenterLines[i].split(' ');
        TrackCenterPoints.push(new THREE.Vector3(TrackCenterLine[0], TrackCenterLine[1], TrackCenterLine[2]));
        TrackCenterNormals.push(new THREE.Vector3(TrackCenterLine[3], TrackCenterLine[4], TrackCenterLine[5]));
    }

    // Load a glTF resource
    var gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load('./MarioKartStadium.glb', function (glb) {
        var map = glb.scene
        //map.scale.setScalar( 0.5 );
        map.name = 'MarioKartStadium'
        //map.position.set(0, 0, -100)
        scene.add(map)
    });

    // Load a OBJ resource
    var mtlLoader = new MTLLoader();
    mtlLoader.load('./TaxiCar.mtl', function (materials) {
        materials.preload();
        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('./TaxiCar.obj', function (object) {
            object.name = 'TaxiCar'
            object.position.set(TrackCenterPoints[0].x, TrackCenterPoints[0].y, TrackCenterPoints[0].z)
            scene.add(object);
        });
    });

    // light
    var light = new THREE.PointLight(0xffffff, 10, 10000, 0.1)
    light.position.set(100, -100, 500)

    const lighthelper = new THREE.PointLightHelper(light)


    // Add to scene
    scene.add(camera);
    scene.add(light)
    scene.add(lighthelper)

    // Render
    render = new THREE.WebGLRenderer();
    render.setClearColor(0x888888, 1.0);
    render.setSize(640, 480);
    document.body.appendChild(render.domElement);

    // Animate
    animateFrame()
}

main();