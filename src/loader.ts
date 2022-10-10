import { CubeTextureLoader, Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const cubeLoader = new CubeTextureLoader();
const glbLoader = new GLTFLoader();

export const loadBackground = async () => {
    // const TextureLoader = new THREE.TextureLoader();
    // const reflectionCube = TextureLoader.load("textures/screen-5.webp");
    // reflectionCube.mapping = THREE.EquirectangularReflectionMapping;

    cubeLoader.setPath("textures/bridge/");
    return cubeLoader.load(["posx.jpg", "negx.jpg", "posy.jpg", "negy.jpg", "posz.jpg", "negz.jpg"]);
};

export const loadTextGeometry = async () => {
    const glb = await glbLoader.loadAsync("/textures/text/test.glb");
    const textGeometry = (glb.scene.children[0] as Mesh).geometry;
    textGeometry.scale(10, 10, 10);
    textGeometry.rotateX(Math.PI / 2);
    return textGeometry;
};

export const loadFishGlb = async () => {
    const fishScene = await glbLoader.loadAsync("/textures/fish/michael.glb");
    return fishScene;
};
