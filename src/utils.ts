import * as THREE from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export const createText = (geometry: THREE.BufferGeometry, background: THREE.CubeTexture) => {
    const text = new THREE.Object3D();

    const refractionTexture = background.clone();
    refractionTexture.mapping = THREE.CubeRefractionMapping;
    const reflectionTexture = background.clone();
    reflectionTexture.mapping = THREE.CubeReflectionMapping;

    const outerRefractionMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xc3e4f9,
        side: THREE.FrontSide,
        envMap: refractionTexture,
        ior: 1.333,
        roughness: 0,
        transmission: 0.9,
        transparent: true,
    });
    outerRefractionMaterial.thickness = 3;

    const innerRefractionMaterial = new THREE.MeshPhongMaterial({
        color: 0xc3e4f9,
        side: THREE.BackSide,
        envMap: refractionTexture,
        refractionRatio: 0.8,
        reflectivity: 0.85,
        transparent: true,
    });

    const reflectionMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xc3e4f9,
        side: THREE.DoubleSide,
        envMap: reflectionTexture,
        envMapIntensity: 1,
        roughness: 0,
        transparent: true,
        opacity: 0.3,
        metalness: 1,
        // wireframe: true,
    });

    text.add(new THREE.Mesh(geometry, outerRefractionMaterial));
    text.add(new THREE.Mesh(geometry, innerRefractionMaterial));
    text.add(new THREE.Mesh(geometry, reflectionMaterial));

    return text;
};

export const moveText = (geometry: THREE.BufferGeometry, base: ArrayLike<number>, time: number) => {
    const positionsArray = geometry.attributes.position.array as Array<number>;

    for (let i = 0; i < positionsArray.length; i += 3) {
        positionsArray[i] = base[i] + Math.sin(base[i + 1] * 3 + time * 0.005) * 0.1;
        positionsArray[i + 1] = base[i + 1] + Math.cos(base[i] * 3 + time * 0.005) * 0.1;
        positionsArray[i + 2] = base[i + 2] + Math.sin(base[i + 1] * 3 + time * 0.01) * 0.05;
    }

    geometry.computeVertexNormals();
    geometry.normalizeNormals();
    geometry.attributes.position.needsUpdate = true;
};

export const fishPathZero = (fish: THREE.Object3D, time: number, offset = 0) => {
    const newPosition = new THREE.Vector3(
        Math.sin(time) * 1.3,
        Math.cos(time) * 2,
        Math.cos(time * 4 + offset * 100) / 4
    );
    fish.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(newPosition, fish.position, newPosition));
    fish.position.set(newPosition.x, newPosition.y, newPosition.z);
};

export const fishPathRightFour = (fish: THREE.Object3D, time: number, offset = 0) => {
    const newPosition = new THREE.Vector3(
        Math.sin(time) + 4,
        Math.cos(time) - 0.4,
        Math.cos(time * 4 + offset * 100) / 4
    );
    fish.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(newPosition, fish.position, newPosition));
    fish.position.set(newPosition.x, newPosition.y, newPosition.z);
};

export const fishPathLeftFour = (fish: THREE.Object3D, time: number, offset = 0) => {
    const newPosition = new THREE.Vector3(
        Math.sin(time) - 4.1,
        Math.cos(time) - 0.4,
        Math.cos(time * 4 + offset * 100) / 4
    );
    fish.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(newPosition, fish.position, newPosition));
    fish.position.set(newPosition.x, newPosition.y, newPosition.z);
};

export const animateFish = (fish: THREE.Object3D, animation: THREE.AnimationClip) => {
    const mixer = new THREE.AnimationMixer(fish);
    mixer.clipAction(animation).play();
    return mixer;
};

export const generateFish = (fishGlb: GLTF) => {
    const fishMesh = fishGlb.scene.children[0].clone();
    fishMesh.scale.set(0.1, 0.1, 0.1);
    return { fish: fishMesh, mixer: animateFish(fishMesh, fishGlb.animations[0].clone()) };
};
