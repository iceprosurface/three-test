// /// <reference path="" />

import * as THREE from 'three';
import * as Stats from 'stats.js';

import 'reset-css';
import './index.scss';

var camera: any, scene: any, renderer: any;
var geometry, material, mesh: any;

var stats = new Stats();


init();
animate();
 
function init() {
 
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 1;
 
    scene = new THREE.Scene();
 
    geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();
 
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
 
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    stats.showPanel(0);

    document.getElementById('main').appendChild( renderer.domElement );
    document.getElementById('main').appendChild( stats.dom );
 
}
 
function animate() {
 
    stats.begin();
	// monitored code goes here
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    renderer.render( scene, camera );
	stats.end();
    requestAnimationFrame( animate );
}

export {};