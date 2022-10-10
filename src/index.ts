import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { loadBackground, loadFishGlb, loadTextGeometry } from "./loader";
import { createText, fishPathLeftFour, fishPathRightFour, fishPathZero, generateFish, moveText } from "./utils";

const stats = Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 110);
camera.position.z = 10;

const render = () => {
    renderer.render(scene, camera);
};

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
};
window.addEventListener("resize", onWindowResize, false);

const controls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

let textGeometry: THREE.BufferGeometry, textBasePositionsArray: ArrayLike<number>;

type fishArr = Array<{ fish: THREE.Object3D; mixer: THREE.AnimationMixer }>;

const zeroFish: fishArr = [];
const rightFourFish: fishArr = [];
const leftFourFish: fishArr = [];

const init = async () => {
    const background = await loadBackground();
    scene.background = background;

    textGeometry = await loadTextGeometry();
    textBasePositionsArray = Array.from(textGeometry.attributes.position.array);

    const text = createText(textGeometry, background);
    text.lookAt(camera.position);
    camera.lookAt(text.position);
    scene.add(text);

    const fishGlb = await loadFishGlb();
    for (let i = 0; i < 8; i++) {
        zeroFish.push(generateFish(fishGlb));
        scene.add(zeroFish[i].fish);
    }
    for (let i = 0; i < 5; i++) {
        rightFourFish.push(generateFish(fishGlb));
        leftFourFish.push(generateFish(fishGlb));
        scene.add(rightFourFish[i].fish);
        scene.add(leftFourFish[i].fish);
    }
};

const animate: FrameRequestCallback = (time) => {
    controls.update();

    stats.update();

    zeroFish.forEach(({ fish, mixer }, i) => {
        mixer.setTime(time * 0.001);
        fishPathZero(fish, 0.0005 * time + 2 * Math.PI * (i / zeroFish.length), i / zeroFish.length);
    });

    rightFourFish.forEach(({ fish, mixer }, i) => {
        mixer.setTime(time * 0.001);
        fishPathRightFour(fish, 0.0005 * time + 2 * Math.PI * (i / rightFourFish.length), i / rightFourFish.length);
    });

    leftFourFish.forEach(({ fish, mixer }, i) => {
        mixer.setTime(time * 0.001);
        fishPathLeftFour(fish, 0.0005 * time + 2 * Math.PI * (i / leftFourFish.length), i / leftFourFish.length);
    });

    moveText(textGeometry, textBasePositionsArray, time);

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
};

init()
    .then(() => requestAnimationFrame(animate))
    .catch(console.error);
