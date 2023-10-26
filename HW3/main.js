import * as THREE from 'three';
import { DRACOLoader } from 'DRACOLoader';
import { GLTFLoader } from 'GLTFLoader';
import { MTLLoader } from 'MTLLoader';
import { OBJLoader } from 'OBJLoader';

var render
var scene
var camera
var TrackCenterPoints
var TrackCenterNormals
var Idx = 0

function animateFrame() {
    //Get the object from scene
    var mesh = scene.getObjectByName('TaxiCar', true)
    if (mesh) {
        // Get the target point
        var currentPosition = mesh.position;
        var targetPosition = TrackCenterPoints[Idx];

        //Calculate the angle
        const targetQuaternion = calculateRotation(currentPosition, targetPosition)

        // Rotate the car
        mesh.setRotationFromQuaternion(targetQuaternion);

        // Move the car
        mesh.position.set(targetPosition.x, targetPosition.y, targetPosition.z);

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
    const yaw = Math.atan2(-direction.x, direction.y);
    const pitch = Math.atan2(direction.z, Math.sqrt(direction.x * direction.x + direction.y * direction.y));
    const roll = 0;

    // Calculate the target quaternion based on the smoothed pitch and yaw
    const targetQuaternion = new THREE.Quaternion();
    targetQuaternion.setFromEuler(new THREE.Euler(roll, pitch, yaw));

    // Slerp the current quaternion towards the target quaternion for smooth rotation
    const interpolationFactor = 0.15; // Adjust as needed
    targetQuaternion.slerp(targetQuaternion, interpolationFactor);

    return targetQuaternion;
};

function loadTrackCenterPoints() {
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
};

function main() {
    // Scene (as globle var)
    scene = new THREE.Scene();

    // Camera (as globle var)
    camera = new THREE.OrthographicCamera(640 / - 2, 640 / 2, 480 / 2, 480 / - 2, -1000, 1000);
    camera.position.set(0, 0, 300);
    camera.lookAt(0, 0, 0);

    // Load the TrackCenter.xyz text file and parse the data.
    loadTrackCenterPoints()

    // Mesh (still local var, we will retrive it by getObjectByName)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('../node_modules/three/examples/jsm/libs/draco/');

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
    render.setSize(640 * 1.5, 480 * 1.5);
    document.body.appendChild(render.domElement);

    // Animate
    animateFrame()
}

main();