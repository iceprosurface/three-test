// /// <reference path="" />

import * as THREE from 'three';
import * as Stats from 'stats.js';

import 'reset-css';
import './index.scss';

let camera: THREE.Camera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let plane: THREE.Mesh;

let stats: Stats;
let entities:Set<entity> = new Set();

// 不算了直接给个精确值
const rootOfThree = 1.7320508075689;

interface entity {
    render(scene: THREE.Scene): void;
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
        let x = 0;
        let y = 0;
        let R = 2 * r / rootOfThree;
        let rectShape = new THREE.Shape();
        rectShape.moveTo(x, y + R);
        rectShape.lineTo(x + r,  y + .5 * R);
        rectShape.lineTo(x + r,  y - .5 * R);
        rectShape.lineTo(x, y - R);
        rectShape.lineTo(x - r,  y - .5 * R);
        rectShape.lineTo(x - r,  y + .5 * R);
        rectShape.lineTo(x, y + R);
        let rectGeom = new THREE.ShapeGeometry(rectShape);
        let reactMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        this.entity = new THREE.Mesh(rectGeom, reactMaterial);
        this.entity.rotation.x = -0.5 * Math.PI;
        this.entity.position.x = ox;
        this.entity.position.x = oy;
    }
    update () {
        this.entity.position.x = this.x;
        this.entity.position.y = this.y;
    }
    render (scene:THREE.Scene) {
        scene.add(this.entity);
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

    camera.position.x = -0;
    camera.position.y = 40;
    camera.position.z = 40;
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
    var hex  = new hexagon(0,0,2);
    hex.render(scene);
    entities.add(hex);
    // use white bg
    renderer.setClearColor(0xEEEEEE);

    // set stats
    stats = new Stats();
    stats.showPanel(0);

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
        if(entity instanceof hexagon) {
            entity.x += .1;
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