import { Component, Input, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-pallet',
  standalone: true,
  imports: [],
  template: '<div #container></div>',
  styleUrl: './pallet.component.scss'
})
export class PalletComponent implements AfterViewInit, OnDestroy {
  @Input() width = 2;
  @Input() height = 0.5;
  @Input() depth = 1;
  @Input() boxesPerDimension = { x: 4, y: 1, z: 2 };

  @ViewChild('container', { static: false }) containerRef!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private animationFrameId!: number;

  ngAfterViewInit() {
    if (this.containerRef) {
      this.initThreeJS();
      this.animate();
      window.addEventListener('resize', this.onWindowResize.bind(this));
    } else {
      console.error('Container reference is not available.');
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  private initThreeJS() {
    const container = this.containerRef.nativeElement as HTMLDivElement;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    const light = new THREE.PointLight(0xFFFFFF, 1, 100);
    light.position.set(10, 10, 10);
    this.scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    this.createPallet(this.width, this.height, this.depth, this.boxesPerDimension);
  }

  private createPallet(width: number, height: number, depth: number, boxesPerDimension: { x: number, y: number, z: number }) {
    const palletGeometry = new THREE.BoxGeometry(width, height, depth);
    const palletMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, side: THREE.DoubleSide });
    const palletMesh = new THREE.Mesh(palletGeometry, palletMaterial);
    this.scene.add(palletMesh);
    this.createPalletLines(width, height, depth);

    this.createBoxes(width, height, depth, boxesPerDimension);
  }

  private createPalletLines(width: number, height: number, depth: number) {
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    for (let i = -width / 2; i <= width / 2; i += width / this.boxesPerDimension.x) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, -height / 2, -depth / 2),
        new THREE.Vector3(i, -height / 2, depth / 2),
        new THREE.Vector3(i, height / 2, -depth / 2),
        new THREE.Vector3(i, height / 2, depth / 2),
      ]);
      const line = new THREE.LineSegments(geometry, lineMaterial);
      this.scene.add(line);
    }

    for (let j = -depth / 2; j <= depth / 2; j += depth / this.boxesPerDimension.z) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-width / 2, -height / 2, j),
        new THREE.Vector3(width / 2, -height / 2, j),
        new THREE.Vector3(-width / 2, height / 2, j),
        new THREE.Vector3(width / 2, height / 2, j),
      ]);
      const line = new THREE.LineSegments(geometry, lineMaterial);
      this.scene.add(line);
    }
  }

  private createBoxes(width: number, height: number, depth: number, boxesPerDimension: { x: number, y: number, z: number }) {
    const boxGeometry = new THREE.BoxGeometry(
      width / boxesPerDimension.x,
      height / boxesPerDimension.y,
      depth / boxesPerDimension.z
    );
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    for (let x = -width / 2 + width / (2 * boxesPerDimension.x); x < width / 2; x += width / boxesPerDimension.x) {
      for (let y = -height / 2 + height / (2 * boxesPerDimension.y); y < height / 2; y += height / boxesPerDimension.y) {
        for (let z = -depth / 2 + depth / (2 * boxesPerDimension.z); z < depth / 2; z += depth / boxesPerDimension.z) {
          const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
          boxMesh.position.set(x, y, z);
          this.scene.add(boxMesh);
        }
      }
    }
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
