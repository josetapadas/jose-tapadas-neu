import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const enable_debugging = false;

// loaders
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('/textures/HeightMap.jpg')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusKnotBufferGeometry(0.65, 0.22, 3, 7, 1, 3)
const sphereObject = new THREE.SphereBufferGeometry(0.15)
// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.6
material.roughness = 0.1
material.normalMap = normalTexture
material.color = new THREE.Color(0x191919)

// Mesh
const sphere = new THREE.Mesh(geometry, material)
const triangle = new THREE.Mesh(sphereObject, material)
scene.add(sphere)
scene.add(triangle)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffff00, 2)
pointLight2.position.set(-3.08, -2, -4.6)
pointLight2.intensity = 3
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0x4B0082, 2)
pointLight3.position.set(1.7, 1.7, -3.78)
pointLight3.intensity = 3
scene.add(pointLight3)

if (enable_debugging) {
    const gui = new dat.GUI()

    const light2 = gui.addFolder('light 2')
    light2.add(pointLight2.position, 'y').min(-7).max(7).step(0.01)
    light2.add(pointLight2.position, 'x').min(-7).max(7).step(0.01)
    light2.add(pointLight2.position, 'z').min(-7).max(7).step(0.01)
    light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

    //const pointLight2helper = new THREE.PointLightHelper(pointLight2, 1)
    //scene.add(pointLight2helper)

    const light3 = gui.addFolder('light 3')
    light3.add(pointLight3.position, 'y').min(-7).max(7).step(0.01)
    light3.add(pointLight3.position, 'x').min(-7).max(7).step(0.01)
    light3.add(pointLight3.position, 'z').min(-7).max(7).step(0.01)
    light3.add(pointLight3, 'intensity').min(0).max(10).step(0.01)

    //const pointLight3helper = new THREE.PointLightHelper(pointLight3, 1)
    //scene.add(pointLight3helper)
}
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
//const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true

})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

let mouseX = 0
let mouseY = 0
let targetX = 0
let targetY = 0
let resetRotation = 0;

const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2

const onDocumentMouseMove = event => {
    mouseX = (event.clientX - windowHalfX)
    mouseY = (event.clientY - windowHalfY)
}

document.addEventListener('mousemove', onDocumentMouseMove)

const updateSphere = event => {
    sphere.position.y = window.scrollY * .002
    triangle.position.y = - window.scrollY * .002
    sphere.position.z = - window.scrollY * .005
    triangle.position.z = + window.scrollY * .005
    sphere.position.x = - window.scrollY * .005
    triangle.position.x = + window.scrollY * .005
}

window.addEventListener('scroll', updateSphere)


const clock = new THREE.Clock()

const tick = () => {

    targetX = mouseX * .0001
    targetY = mouseY * .001
    resetRotation++;

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .3 * elapsedTime
    sphere.rotation.z = .3 * elapsedTime
    triangle.rotation.y = -1.7 * elapsedTime
    triangle.rotation.x = 0.7 * elapsedTime

    if (resetRotation < 7) {
        sphere.rotation.x += .07 * (targetX - sphere.rotation.y)
        sphere.rotation.x -= .07 * (targetY - sphere.rotation.y)
        triangle.rotation.x += .07 * (targetX - triangle.rotation.y)
        triangle.rotation.x -= .07 * (targetY - triangle.rotation.y)
    } else {
        resetRotation = 0;
    }



    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()