import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
  FileLoader,
  Group,
  HemisphereLight,
  Line,
  LineBasicMaterial,
  LoaderUtils,
  Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  sRGBEncoding,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader';

@Component({
  selector: 'app-model-preview',
  templateUrl: './model-preview.component.html',
  styleUrls: ['./model-preview.component.scss'],
})
export class ModelPreviewComponent implements OnInit {
  private readonly MEGAVOX_SIZE_LIMIT = 126;

  @ViewChild('modelPreview') modelPreview: ElementRef;

  @Input() modelUrl: string;

  ngOnInit(): void {
    const loader = new FileLoader();
    loader.setResponseType('arraybuffer');
    loader.load(
      this.modelUrl,
      buffer => {
        const magic = LoaderUtils.decodeText(new Uint8Array(buffer, 0, 4));
        if (magic === 'glTF') {
          this.displayGltfModel(this.modelPreview.nativeElement, buffer);
        } else if (magic === 'VOX ') {
          this.displayVoxModel(this.modelPreview.nativeElement, buffer);
        }
      },
      () => {
        // progress not supported at this moment
      },
      () => this.handleLoadError(this.modelPreview.nativeElement, new Error('Cannot load model'))
    );
  }

  scaleUniformlyTo2x2x2(box): number {
    return 1 / Math.max(Math.abs(box.min.x), Math.abs(box.min.y), Math.abs(box.min.z), box.max.x, box.max.y, box.max.z);
  }

  initCamera(): Camera {
    const camera = new PerspectiveCamera(50, 1, 0.01, 1000);
    camera.position.set(1.75, 0.75, 1.75);
    return camera;
  }

  initRenderer(element): WebGLRenderer {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(element.offsetWidth, element.offsetHeight);
    return renderer;
  }

  initScene(): Scene {
    const scene = new Scene();
    scene.background = new Color(0xbbbbbb);
    return scene;
  }

  initControls(camera: Camera, renderer: WebGLRenderer): OrbitControls {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1.5;
    controls.maxDistance = 4.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 10;
    return controls;
  }

  axes(length: number): Object3D {
    const points = [];
    points.push(new Vector3(length, 0, 0));
    points.push(new Vector3(0, 0, 0));
    points.push(new Vector3(0, length, 0));
    points.push(new Vector3(0, 0, 0));
    points.push(new Vector3(0, 0, length));
    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({ color: 0x0000ff });
    return new Line(geometry, material);
  }

  frame(length: number): Object3D {
    const geometry = new BoxGeometry(length, length, length);
    const material = new LineBasicMaterial({ color: 0x00ffff });
    return new Line(geometry, material);
  }

  handleLoadError(element, error: Error): void {
    console.error(error);
    const message = error.message ? `Error during model load: ${error.message}` : 'Model load failed';
    const spanElement = document.createElement('span');
    spanElement.innerHTML = message;
    element.appendChild(spanElement);
  }

  displayGltfModel(element, buffer): void {
    let mixer;

    const clock = new Clock();
    const renderer = this.initRenderer(element);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = sRGBEncoding;

    const camera = this.initCamera();
    const scene = this.initScene();
    scene.add(this.axes(1.0));
    scene.add(this.frame(2.0));
    const environment = new RoomEnvironment();
    const pmremGenerator = new PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(environment).texture;
    const controls = this.initControls(camera, renderer);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    try {
      loader.parse(
        buffer,
        '',
        gltf => {
          const model = gltf.scene;
          const boundingBox = new Box3().setFromObject(model);
          model.scale.setScalar(this.scaleUniformlyTo2x2x2(boundingBox));
          scene.add(model);

          if (gltf.animations.length > 0) {
            mixer = new AnimationMixer(model);
            mixer.clipAction(gltf.animations[0]).play();
          }
          element.appendChild(renderer.domElement);
          animate();
        },
        error => this.handleLoadError(element, error)
      );
    } catch (error) {
      this.handleLoadError(element, error);
    }

    function animate(): void {
      requestAnimationFrame(animate);
      if (mixer !== undefined) {
        const delta = clock.getDelta();
        mixer.update(delta);
      }
      controls.update();
      renderer.render(scene, camera);
    }
  }

  displayVoxModel(element, buffer): void {
    const renderer = this.initRenderer(element);
    const camera = this.initCamera();
    const scene = this.initScene();
    scene.add(this.axes(this.MEGAVOX_SIZE_LIMIT / 2));
    scene.add(this.frame(this.MEGAVOX_SIZE_LIMIT));
    const controls = this.initControls(camera, renderer);

    const hemisphereLight = new HemisphereLight(0x888888, 0x444444, 1);
    scene.add(hemisphereLight);
    const directionalLight1 = new DirectionalLight(0xffffff, 0.75);
    directionalLight1.position.set(1.5, 3, 2.5);
    scene.add(directionalLight1);
    const directionalLight2 = new DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-1.5, -3, -2.5);
    scene.add(directionalLight2);

    const loader = new VOXLoader();
    try {
      const chunks = loader.parse(buffer);
      if (chunks === undefined) {
        this.handleLoadError(element, new Error('Not a valid VOX file'));
        return;
      }
      const group = new Group();
      const boundingBox = new Box3();
      const palette = chunks[chunks.length - 1].palette;
      chunks.forEach(chunk => {
        chunk.palette = palette;
        const mesh = new VOXMesh(chunk);
        boundingBox.expandByObject(mesh);
        mesh.visible = false;
        group.add(mesh);
      });

      if (
        boundingBox.max.x - boundingBox.min.x > this.MEGAVOX_SIZE_LIMIT ||
        boundingBox.max.y - boundingBox.min.y > this.MEGAVOX_SIZE_LIMIT ||
        boundingBox.max.z - boundingBox.min.z > this.MEGAVOX_SIZE_LIMIT
      ) {
        this.handleLoadError(
          element,
          new Error(
            `Model size exceeds the Megavox limit ${this.MEGAVOX_SIZE_LIMIT}x${this.MEGAVOX_SIZE_LIMIT}x${this.MEGAVOX_SIZE_LIMIT}`
          )
        );
        return;
      }

      group.name = 'model';
      scene.add(group);
      const scale = this.scaleUniformlyTo2x2x2(boundingBox);
      scene.scale.setScalar(scale);
      controls.maxDistance = 4.5 * (this.MEGAVOX_SIZE_LIMIT / 2) * scale;

      element.appendChild(renderer.domElement);
      requestAnimationFrame(animate);
    } catch (error) {
      this.handleLoadError(element, error);
    }

    function animate(time): void {
      requestAnimationFrame(animate);
      const model = scene.getObjectByName('model');
      if (model !== undefined) {
        const framesCount = model.children.length;
        const periodPerFrame = 150;
        const period = framesCount * periodPerFrame;
        const currentTime = time % period;
        const currentFrameIndex = Math.floor(currentTime / periodPerFrame);
        model.children.forEach((frame, index) => (frame.visible = index === currentFrameIndex));
      }

      controls.update();
      renderer.render(scene, camera);
    }
  }
}
