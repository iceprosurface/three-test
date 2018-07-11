// /// <reference path="" />

import * as THREE from 'three';
import './vendor/OrbitControls.js'
import * as Stats from 'stats.js';

import 'reset-css';
import './index.scss';
import construct = Reflect.construct;
import { OrbitControls } from "three/three-orbitcontrols";

let camera: THREE.Camera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let plane: THREE.Mesh;

let stats: Stats;
let entities: Set<entity> = new Set();

// 不算了直接给个精确值
const rootOfThree = 1.7320508075689;

interface entity {
    addTo(scene: THREE.Scene): void;

    render(): void;

    update(): void;
}

class hexagon implements entity {
    x: number;
    y: number;
    r: number;
    entity: THREE.Mesh;

    constructor(ox: number, oy: number, r: number) {
        this.x = ox;
        this.y = oy;
        this.r = r;

    }

    update() {
        this.entity.position.x = this.x;
        this.entity.position.z = this.y;
    }

    render() {
        let x = 0;
        let y = 0;
        let r = this.r;
        let R = 2 * r / rootOfThree;
        let shapeGeometry= new THREE.CylinderGeometry( r, r, 2, 6 )
        let reactMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        this.entity = new THREE.Mesh(shapeGeometry, reactMaterial);
        // this.entity.rotation.x = -0.5 * Math.PI;
        this.entity.position.x = this.x;
        this.entity.position.z = this.y;
        this.entity.position.y = 0;
    }

    addTo(scene: THREE.Scene) {
        scene.add(this.entity);
    }
}

class hexmap implements entity {
    hexs: Array<hexagon>;
    width = 20;
    height = 20;

    constructor(width: number, height: number) {
        this.hexs = new Array<hexagon>(width * height);
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++) {
                this.set(x, y, {})
            }
        }
    }

    set(x: number, y: number, setting: any) {
        let r = 10;
        let R = 2 * r / rootOfThree;
        let space = 2;
        let ox = x * space + x * r * 2;
        let oy = space * y + 3 / 2 * R * y;
        if(y % 2) {
            // 不能被整除
            ox = ox + r + space;
        }

        let hexagonInstance = new hexagon(ox, oy, R);
        this.hexs[x + y * this.width] = hexagonInstance;
    }
    forEach (callback: (value: hexagon, index: number, array: hexagon[])=>void) {
        this.hexs.forEach(callback);
    }
    addTo(scene: THREE.Scene) {
        this.hexs.forEach((value: hexagon, index: number) => {
            scene.add(value.entity);
        });
    }
    render() {
        this.hexs.forEach((value: hexagon, index: number) => {
            value.render();
        });
    }

    update() {
        this.hexs.forEach((value: hexagon, index: number) => {
            value.update();
        });
    }

}

/**
 * init
 */
function init() {

    scene = new THREE.Scene();
    // set camera
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        .1,
        1000
    );

    // camera.position.x = -100;
    camera.position.y = 100;
    camera.position.z = 100;
    camera.lookAt(scene.position);

    // set axe
    let axe = new THREE.AxesHelper(20);
    scene.add(axe);
    // set render
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // create plane
    let planeGeometry = new THREE.PlaneGeometry(
        40,
        40,
        1,
        1);
    let planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xccccccc,
    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    //hex
    let hexmapInstance = new hexmap(10, 10);
    hexmapInstance.render();
    hexmapInstance.addTo(scene);

    entities.add(hexmapInstance);
    // use white bg
    renderer.setClearColor(0xEEEEEE);

    // set stats
    stats = new Stats();
    stats.showPanel(0);
    // control
    let controls:OrbitControls = new THREE.OrbitControls( camera, renderer.domElement );
    // an animation loop is required when either damping or auto-rotation are enabled
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.minDistance = 100;
    controls.maxDistance = 500
    controls.maxPolarAngle = Math.PI / 2;
    // set dom
    document.getElementById('main').appendChild(renderer.domElement);
    document.getElementById('main').appendChild(stats.dom);
}

/**
 * animate
 */
function animate() {
    stats.begin();
    // monitored code goes here
    renderer.render(scene, camera);
    entities.forEach(entity => {
        if (entity instanceof hexagon) {
            // entity.x += .1;
        }
        entity.update();
    });
    stats.end();
    requestAnimationFrame(animate);
}

// =============== start ===============
init();
animate();


export {};