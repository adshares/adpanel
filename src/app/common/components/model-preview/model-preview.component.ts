import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import {
  ACESFilmicToneMapping,
  AnimationMixer,
  Box3,
  BoxGeometry,
  BufferGeometry,
  Camera,
  Clock,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Line,
  LineBasicMaterial,
  Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  sRGBEncoding,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader'

@Component({
  selector: 'app-model-preview',
  templateUrl: './model-preview.component.html',
  styleUrls: ['./model-preview.component.scss'],
})
export class ModelPreviewComponent implements OnInit {
  @ViewChild('modelPreview')
  modelPreview: ElementRef

  modelUrl = 'assets/T-Rex.vox'
  mimeType = 'model/voxel'
  // modelUrl = 'assets/LittlestTokyo.glb'
  // mimeType = 'model/gltf-binary'

  ngOnInit (): void {
    if (this.mimeType === 'model/voxel') {
      this.displayVoxModel(this.modelPreview.nativeElement)
    } else if (this.mimeType === 'model/gltf-binary') {
      this.displayGltfModel(this.modelPreview.nativeElement)
    }
  }

  //////// new
  // extractModelUrl(element) {
  //   return element.removeAttributeNode(element.getAttributeNode('data-src')).value
  // }

  scaleUniformlyTo2x2x2 (box): number {
    return 1 / Math.max(
      Math.abs(box.min.x),
      Math.abs(box.min.y),
      Math.abs(box.min.z),
      box.max.x,
      box.max.y,
      box.max.z,
    )
  }

  initCamera (): Camera {
    const camera = new PerspectiveCamera(50, 1, 0.01, 10)
    camera.position.set(1.75, 0.75, 1.75)
    return camera
  }

  initRenderer (element): WebGLRenderer {
    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(element.offsetWidth, element.offsetHeight)
    return renderer
  }

  initScene (): Scene {
    const scene = new Scene()
    scene.background = new Color(0xbbbbbb)
    scene.add(this.axes(1.0))
    scene.add(this.frame(2.0))
    return scene
  }

  initControls (camera, renderer): OrbitControls {
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.minDistance = 1.5
    controls.maxDistance = 4.5
    controls.autoRotate = true
    controls.autoRotateSpeed = 10
    return controls
  }

  axes (length): Object3D {
    const points = []
    points.push(new Vector3(length, 0, 0))
    points.push(new Vector3(0, 0, 0))
    points.push(new Vector3(0, length, 0))
    points.push(new Vector3(0, 0, 0))
    points.push(new Vector3(0, 0, length))
    const geometry = new BufferGeometry().setFromPoints(points)
    const material = new LineBasicMaterial({ color: 0x0000ff })
    return new Line(geometry, material)
  }

  frame (length): Object3D {
    const geometry = new BoxGeometry(length, length, length)
    const material = new LineBasicMaterial({ color: 0x00ffff })
    return new Line(geometry, material)
  }

  handleLoadError (element, error): void {
    console.error(error)
    const message = error.message ? `Error during model load: ${error.message}` : 'Model load failed'
    const spanElement = document.createElement('span')
    spanElement.innerHTML = message
    element.appendChild(spanElement)
  }

  displayGltfModel (element): void {
    let mixer
    const modelUrl = this.modelUrl

    const clock = new Clock()
    const renderer = this.initRenderer(element)
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    renderer.outputEncoding = sRGBEncoding

    const camera = this.initCamera()
    const scene = this.initScene()
    const environment = new RoomEnvironment()
    const pmremGenerator = new PMREMGenerator(renderer)
    scene.environment = pmremGenerator.fromScene(environment).texture
    const controls = this.initControls(camera, renderer)

    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    loader.load(modelUrl, gltf => {
      const model = gltf.scene
      const boundingBox = new Box3().setFromObject(model)
      model.scale.setScalar(this.scaleUniformlyTo2x2x2(boundingBox))
      scene.add(model)

      if (gltf.animations.length > 0) {
        mixer = new AnimationMixer(model)
        mixer.clipAction(gltf.animations[0]).play()
      }
      element.appendChild(renderer.domElement)
      animate()
    }, () => {
    }, error => {
      this.handleLoadError(element, error)
    })

    function animate (): void {
      requestAnimationFrame(animate)
      if (mixer !== undefined) {
        const delta = clock.getDelta()
        mixer.update(delta)
      }
      controls.update()
      renderer.render(scene, camera)
    }
  }

  displayVoxModel (element): void {
    const modelUrl = this.modelUrl
    const renderer = this.initRenderer(element)
    const camera = this.initCamera()
    const scene = this.initScene()
    const controls = this.initControls(camera, renderer)

    const hemisphereLight = new HemisphereLight(0x888888, 0x444444, 1)
    scene.add(hemisphereLight)
    const directionalLight1 = new DirectionalLight(0xffffff, 0.75)
    directionalLight1.position.set(1.5, 3, 2.5)
    scene.add(directionalLight1)
    const directionalLight2 = new DirectionalLight(0xffffff, 0.5)
    directionalLight2.position.set(-1.5, -3, -2.5)
    scene.add(directionalLight2)

    const loader = new VOXLoader()
    loader.load(modelUrl, chunks => {
      const group = new Group()
      const boundingBox = new Box3()
      const palette = chunks[chunks.length - 1].palette
      chunks.forEach(chunk => {
        chunk.palette = palette
        const mesh = new VOXMesh(chunk)
        boundingBox.expandByObject(mesh)
        mesh.visible = false
        group.add(mesh)
      })
      group.name = 'model'
      group.scale.setScalar(this.scaleUniformlyTo2x2x2(boundingBox))
      scene.add(group)

      element.appendChild(renderer.domElement)
      requestAnimationFrame(animate)
    }, () => {
    }, error => {
      this.handleLoadError(element, error)
    })

    function animate (time): void {
      requestAnimationFrame(animate)
      const model = scene.getObjectByName('model')
      if (model !== undefined) {
        const framesCount = model.children.length
        const periodPerFrame = 150
        const period = framesCount * periodPerFrame
        const currentTime = time % period
        const currentFrameIndex = Math.floor(currentTime / periodPerFrame)
        model.children.forEach((frame, index) => frame.visible = index === currentFrameIndex)
      }

      controls.update()
      renderer.render(scene, camera)
    }
  }
}
