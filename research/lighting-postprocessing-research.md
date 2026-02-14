# Advanced Lighting & Post-Processing Research for Three.js Character Rendering

## Executive Summary

This document covers advanced lighting and post-processing techniques for creating realistic character renders in Three.js with a premium fitness app aesthetic. The focus is on cinematic lighting, physically-based rendering, and high-end post-processing effects.

---

## 1. Lighting Setups for Human Characters

### 1.1 Three-Point Lighting (Classic Studio Setup)

The industry-standard three-point lighting setup consists of:

#### Key Light
- **Purpose**: Main illumination, defines primary lighting direction and shadows
- **Position**: 15-45° to the side of camera, 15-45° above camera angle
- **Intensity**: Brightest light, typically 2x the fill light (2:1 ratio)
- **Type**: SpotLight or DirectionalLight in Three.js

```javascript
// Key Light Setup
const keyLight = new THREE.SpotLight(0xffffff, 1.0);
keyLight.position.set(5, 8, 5);
keyLight.angle = Math.PI / 6;
keyLight.penumbra = 0.3; // Soft edges
keyLight.decay = 2;
keyLight.distance = 50;
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.bias = -0.0001;
scene.add(keyLight);
```

#### Fill Light
- **Purpose**: Softens harsh shadows from key light, reveals shadow detail
- **Position**: Opposite side of key light, at subject height or slightly below
- **Intensity**: 1/2 to 1/8 of key light (adjust for mood)
- **Shadows**: Optional - often disabled for cleaner look

```javascript
// Fill Light Setup
const fillLight = new THREE.DirectionalLight(0xffeedd, 0.4);
fillLight.position.set(-5, 3, 5);
fillLight.castShadow = false; // Optional for performance
scene.add(fillLight);
```

#### Rim/Back Light
- **Purpose**: Creates separation from background, highlights silhouette edges
- **Position**: Behind subject, opposite camera, elevated
- **Intensity**: As bright as needed for edge highlight effect
- **Color**: Often slightly warm or cool for stylistic effect

```javascript
// Rim Light Setup
const rimLight = new THREE.SpotLight(0xccddff, 1.5);
rimLight.position.set(0, 6, -5);
rimLight.lookAt(0, 0, 0);
rimLight.castShadow = true;
scene.add(rimLight);
```

### 1.2 Premium Fitness App Lighting Aesthetic

For fitness apps, consider these variations:

**High-Key Fitness Look** (Energetic, Clean):
- Bright, even lighting with minimal shadows
- Fill light at 0.8 intensity relative to key
- Cool white tones (5500K-6500K)
- Multiple fill lights from various angles

**Dramatic/Cinematic Look** (Intense, Motivational):
- Higher contrast ratios (4:1 or 8:1 key-to-fill)
- Strong rim lighting to define muscle contours
- Warm key light with cool fill
- Volumetric light rays (god rays) for energy

**Studio Ring Light Style** (Influencer/Wellness):
- Large area light in front of subject
- Soft, shadowless illumination
- Small catchlights in eyes
- Even skin tone rendering

```javascript
// Studio Ring Light Approximation
const ringLightGroup = new THREE.Group();
for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const light = new THREE.PointLight(0xffffff, 0.3, 20);
    light.position.set(
        Math.cos(angle) * 3,
        0,
        Math.sin(angle) * 3 + 5
    );
    ringLightGroup.add(light);
}
scene.add(ringLightGroup);
```

### 1.3 Physically Correct Lighting Setup

```javascript
// Enable physically correct lighting
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Scene scale matters: 1 unit = 1 meter
// Intensity in lumens for realistic bulbs
const keyLight = new THREE.SpotLight(0xffffff, 800); // 800 lumens
keyLight.position.set(2, 3, 2);
keyLight.angle = Math.PI / 4;
keyLight.penumbra = 0.5;
keyLight.decay = 2;
keyLight.distance = 10;
keyLight.castShadow = true;
```

---

## 2. Environment Maps and HDRIs

### 2.1 Free HDRI Resources Compatible with Three.js

| Resource | URL | Resolution | License |
|----------|-----|------------|---------|
| **Poly Haven (formerly HDRI Haven)** | polyhaven.com | Up to 16K | CC0 |
| **HDRI-SKIES** | hdri-skies.com | Up to 16K | Free/Paid |
| **HDR Labs** | hdrlabs.com | Various | Free |
| **NoEmotion HDRs** | noemotionhdrs.net | Various | Free |
| **HDRMaps** | hdrmaps.com | Various | Free samples |

**Recommended HDRI Types for Fitness Apps:**
- **Studio HDRIs**: Clean, controlled reflections for product shots
- **Gym/Indoor HDRIs**: Contextual environment for workout scenes
- **Outdoor/Sport HDRIs**: Dynamic lighting for active scenes

### 2.2 Loading and Using HDRIs in Three.js

```javascript
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator.js';

// Load HDRI environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('path/to/studio.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    
    // Generate PMREM for high-quality reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    
    // Apply to scene
    scene.environment = envMap;
    scene.background = envMap; // Optional: show HDRI as background
    
    // Clean up
    texture.dispose();
    pmremGenerator.dispose();
});

// Apply to materials for realistic reflections
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.4,
    envMapIntensity: 1.0 // Adjust reflection strength
});
```

### 2.3 Environment Map Optimization

```javascript
// Configure PMREM for quality vs performance
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// Resolution of generated cube render target (default: 256)
// Higher = better quality, slower
pmremGenerator.setSize(512); 

// Blur environment map for diffuse lighting
// Higher = softer ambient lighting
scene.environmentIntensity = 1.0;
```

---

## 3. Shadow Techniques for Soft Natural Shadows

### 3.1 Shadow Map Configuration

```javascript
// Optimal shadow map settings for soft shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
// Alternative: THREE.PCFShadowMap (harder), THREE.VSMShadowMap (variance)

// Light shadow configuration
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048; // Higher = sharper shadows
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far = 50;
keyLight.shadow.camera.fov = 50;
keyLight.shadow.bias = -0.0005; // Reduce shadow acne
keyLight.shadow.radius = 4; // PCF soft shadow radius
```

### 3.2 Percentage-Closer Soft Shadows (PCSS)

For more realistic soft shadows that get softer with distance:

```javascript
// PCSS-like soft shadows using custom depth material
// This requires a more advanced setup with custom shaders

// Simplified approach: Distance-based shadow softness
function updateShadowSoftness(light, distance) {
    // Increase shadow radius as object gets further from shadow caster
    const baseRadius = 2;
    const softness = Math.min(distance * 0.1, 10);
    light.shadow.radius = baseRadius + softness;
}
```

### 3.3 Contact Shadows (for close-up character shots)

```javascript
// Contact shadows for feet/ground contact
import { ContactShadows } from '@react-three/drei'; // Or implement manually

// Manual contact shadow implementation
function createContactShadow() {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShadowMaterial({
        opacity: 0.3,
        color: 0x000000
    });
    const shadowPlane = new THREE.Mesh(geometry, material);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    shadowPlane.receiveShadow = true;
    return shadowPlane;
}
```

### 3.4 Shadow Optimization Techniques

```javascript
// 1. Use appropriate shadow map sizes
const shadowQuality = {
    low: { size: 1024, radius: 2 },
    medium: { size: 2048, radius: 4 },
    high: { size: 4096, radius: 8 }
};

// 2. Cascade Shadow Maps for large scenes (directional lights)
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 4096;
dirLight.shadow.mapSize.height = 4096;
// Split shadow frustum into cascades for better quality

// 3. Optimize shadow casters/receivers
characterMesh.castShadow = true;
characterMesh.receiveShadow = true;
floorMesh.receiveShadow = true; // Only receive
// Hide small details from shadow casting for performance
```

---

## 4. Post-Processing Effects

### 4.1 Essential Post-Processing Pipeline

```javascript
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// Setup composer
const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);

// 1. Base render pass
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// 2. SSAO for contact shadows and depth
const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
ssaoPass.kernelRadius = 16;
ssaoPass.minDistance = 0.005;
ssaoPass.maxDistance = 0.1;
composer.addPass(ssaoPass);

// 3. Bloom for highlights
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.3, // strength
    0.4, // radius
    0.85 // threshold
);
composer.addPass(bloomPass);

// 4. Output pass (tone mapping + color space)
const outputPass = new OutputPass();
composer.addPass(outputPass);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    composer.render();
}
```

### 4.2 Advanced Post-Processing Effects

#### Depth of Field (Bokeh)

```javascript
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

const bokehPass = new BokehPass(scene, camera, {
    focus: 1.0,
    aperture: 0.025,
    maxblur: 0.01,
    width: window.innerWidth,
    height: window.innerHeight
});
composer.addPass(bokehPass);

// Dynamic focus on character
function updateFocus(characterPosition) {
    const distance = camera.position.distanceTo(characterPosition);
    bokehPass.uniforms['focus'].value = distance;
}
```

#### Vignette Effect

```javascript
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const VignetteShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'offset': { value: 1.0 },
        'darkness': { value: 1.5 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float offset;
        uniform float darkness;
        varying vec2 vUv;
        void main() {
            vec4 texel = texture2D(tDiffuse, vUv);
            vec2 uv = (vUv - vec2(0.5)) * vec2(offset);
            gl_FragColor = vec4(mix(texel.rgb, vec3(1.0 - darkness), dot(uv, uv)), texel.a);
        }
    `
};

const vignettePass = new ShaderPass(VignetteShader);
composer.addPass(vignettePass);
```

#### Chromatic Aberration

```javascript
const ChromaticAberrationShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'amount': { value: 0.005 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float amount;
        varying vec2 vUv;
        void main() {
            vec2 center = vec2(0.5);
            vec2 direction = vUv - center;
            float dist = length(direction);
            direction = normalize(direction);
            
            float r = texture2D(tDiffuse, vUv + direction * amount * dist).r;
            float g = texture2D(tDiffuse, vUv).g;
            float b = texture2D(tDiffuse, vUv - direction * amount * dist).b;
            
            gl_FragColor = vec4(r, g, b, 1.0);
        }
    `
};
```

---

## 5. Color Grading for Cinematic Look

### 5.1 LUT-Based Color Grading

```javascript
import { LUTPass } from 'three/examples/jsm/postprocessing/LUTPass.js';
import { LUTCubeLoader } from 'three/examples/jsm/loaders/LUTCubeLoader.js';

// Load .CUBE LUT file
const lutLoader = new LUTCubeLoader();
lutLoader.load('path/to/cinematic.cube', (lut) => {
    const lutPass = new LUTPass();
    lutPass.lut = lut.texture3D;
    lutPass.intensity = 0.75;
    composer.addPass(lutPass);
});

// Or use 2D LUT texture
const lutTexture = new THREE.TextureLoader().load('path/to/lut.png');
lutTexture.minFilter = THREE.LinearFilter;
lutTexture.magFilter = THREE.LinearFilter;
lutPass.lut = lutTexture;
```

### 5.2 Custom Color Grading Shader

```javascript
const ColorGradingShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'contrast': { value: 1.1 },
        'brightness': { value: 0.0 },
        'saturation': { value: 1.1 },
        'warmth': { value: 0.1 },
        'tint': { value: 0.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float contrast;
        uniform float brightness;
        uniform float saturation;
        uniform float warmth;
        uniform float tint;
        varying vec2 vUv;
        
        vec3 adjustContrast(vec3 color, float value) {
            return 0.5 + (value + 1.0) * (color - 0.5);
        }
        
        vec3 adjustSaturation(vec3 color, float value) {
            const vec3 luminance = vec3(0.2126, 0.7152, 0.0722);
            vec3 gray = vec3(dot(color, luminance));
            return mix(gray, color, value);
        }
        
        vec3 adjustWarmth(vec3 color, float value) {
            color.r += value;
            color.b -= value;
            return color;
        }
        
        void main() {
            vec4 texel = texture2D(tDiffuse, vUv);
            vec3 color = texel.rgb;
            
            // Apply adjustments
            color = adjustContrast(color, contrast - 1.0);
            color += brightness;
            color = adjustSaturation(color, saturation);
            color = adjustWarmth(color, warmth);
            color.g += tint;
            
            gl_FragColor = vec4(color, texel.a);
        }
    `
};

const colorGradingPass = new ShaderPass(ColorGradingShader);
composer.addPass(colorGradingPass);
```

### 5.3 ACES Filmic Tone Mapping

```javascript
// Enable ACES tone mapping for cinematic look
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// Custom ACES implementation for post-processing
const ACESFilmicToneMappingShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'exposure': { value: 1.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float exposure;
        varying vec2 vUv;
        
        vec3 ACESFilmic(vec3 x) {
            float a = 2.51;
            float b = 0.03;
            float c = 2.43;
            float d = 0.59;
            float e = 0.14;
            return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
        }
        
        void main() {
            vec4 texel = texture2D(tDiffuse, vUv);
            vec3 color = texel.rgb * exposure;
            color = ACESFilmic(color);
            gl_FragColor = vec4(color, texel.a);
        }
    `
};
```

### 5.4 Split Toning (Cinematic Effect)

```javascript
const SplitToneShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'shadowColor': { value: new THREE.Color(0x001133) }, // Cool shadows
        'highlightColor': { value: new THREE.Color(0xffaa44) }, // Warm highlights
        'balance': { value: 0.5 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 shadowColor;
        uniform vec3 highlightColor;
        uniform float balance;
        varying vec2 vUv;
        
        void main() {
            vec4 texel = texture2D(tDiffuse, vUv);
            float luminance = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
            
            vec3 color = mix(
                texel.rgb * shadowColor * 2.0,
                texel.rgb * highlightColor * 2.0,
                smoothstep(balance - 0.2, balance + 0.2, luminance)
            );
            
            gl_FragColor = vec4(color, texel.a);
        }
    `
};
```

---

## 6. Complete Premium Fitness App Setup

```javascript
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

class FitnessAppRenderer {
    constructor(container) {
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            antialias: false, // Use post-processing AA
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.physicallyCorrectLights = true;
        container.appendChild(this.renderer.domElement);
        
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            45, window.innerWidth / window.innerHeight, 0.1, 100
        );
        this.camera.position.set(0, 1.5, 4);
        
        // Setup lighting
        this.setupLighting();
        
        // Load environment
        this.loadEnvironment();
        
        // Setup post-processing
        this.setupPostProcessing();
        
        // Handle resize
        window.addEventListener('resize', () => this.onResize());
    }
    
    setupLighting() {
        // Key light - Main illumination
        this.keyLight = new THREE.SpotLight(0xffffff, 800);
        this.keyLight.position.set(2, 3, 3);
        this.keyLight.angle = Math.PI / 4;
        this.keyLight.penumbra = 0.5;
        this.keyLight.castShadow = true;
        this.keyLight.shadow.mapSize.set(2048, 2048);
        this.keyLight.shadow.bias = -0.0001;
        this.keyLight.shadow.radius = 4;
        this.scene.add(this.keyLight);
        
        // Fill light - Soft fill from opposite side
        this.fillLight = new THREE.DirectionalLight(0xffeedd, 300);
        this.fillLight.position.set(-3, 2, 3);
        this.scene.add(this.fillLight);
        
        // Rim light - Backlight for separation
        this.rimLight = new THREE.SpotLight(0xccddff, 600);
        this.rimLight.position.set(0, 3, -3);
        this.rimLight.lookAt(0, 1, 0);
        this.scene.add(this.rimLight);
        
        // Ambient for base illumination
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(this.ambientLight);
    }
    
    loadEnvironment() {
        const rgbeLoader = new RGBELoader();
        rgbeLoader.load('studio_hdri.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            
            const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
            pmremGenerator.compileEquirectangularShader();
            
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            this.scene.environment = envMap;
            
            texture.dispose();
            pmremGenerator.dispose();
        });
    }
    
    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        
        // Render pass
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        
        // SSAO for depth
        const ssaoPass = new SSAOPass(this.scene, this.camera);
        ssaoPass.kernelRadius = 16;
        ssaoPass.minDistance = 0.005;
        ssaoPass.maxDistance = 0.1;
        this.composer.addPass(ssaoPass);
        
        // Bloom for highlights
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.3, 0.4, 0.85
        );
        this.composer.addPass(bloomPass);
        
        // Output pass with tone mapping
        this.composer.addPass(new OutputPass());
    }
    
    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
    }
    
    render() {
        this.composer.render();
    }
}
```

---

## 7. Performance Optimization Tips

### 7.1 Render Target Optimization

```javascript
// Use HalfFloatType for HDR workflows
const composer = new EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType
});

// Reduce resolution for post-processing on mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(dpr);
```

### 7.2 Shadow Optimization

```javascript
// Use appropriate shadow map sizes based on device
const shadowMapSize = isMobile ? 1024 : 2048;
light.shadow.mapSize.set(shadowMapSize, shadowMapSize);

// Limit shadow distance
light.shadow.camera.far = 20; // Only what's visible

// Use PCFSoftShadowMap for good balance of quality/performance
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

### 7.3 Post-Process Optimization

```javascript
// Combine multiple color adjustments into single shader
// Instead of: brightness pass → contrast pass → saturation pass
// Use: combined color grading pass

// Disable expensive effects on mobile
if (!isMobile) {
    composer.addPass(ssaoPass);
    composer.addPass(bloomPass);
}
```

---

## 8. Recommended Tools and Resources

### Three.js Post-Processing Libraries
- **Official Three.js Examples**: `three/examples/jsm/postprocessing/`
- **postprocessing by pmndrs**: Enhanced post-processing library with merged effects
  - GitHub: https://github.com/pmndrs/postprocessing
  - Better performance through automatic effect merging

### HDRI Resources
1. **Poly Haven** (polyhaven.com) - CC0 HDRIs
2. **HDRI-SKIES** (hdri-skies.com) - Free and premium
3. **HDR Labs** (hdrlabs.com) - Free sIBL sets

### LUT Creation Tools
- **Adobe Photoshop** - Export .CUBE files
- **DaVinci Resolve** - Free LUT generation
- **Affinity Photo** - LUT export capability
- **Online LUT Generators** - For quick adjustments

### Color Grading References
- **Filmic Blender** - Reference color management
- **Unreal Engine Color Grading** - Industry standard approaches
- **ACES Color System** - Academy Color Encoding System

---

## Summary for Premium Fitness App Aesthetic

**Key Lighting Principles:**
1. Use 3-point lighting with soft shadows
2. Add rim lighting to define muscle contours
3. Cool fill with warm key for energy
4. Use area lights or multiple point lights for soft, flattering skin

**Post-Processing Stack:**
1. SSAO for depth
2. Subtle bloom (0.2-0.3 strength) for energy highlights
3. Color grading with slight warmth
4. Vignette to focus attention
5. ACES tone mapping for cinematic look

**Environment:**
- Studio HDRI for clean reflections
- PMREM generation for realistic PBR
- Adjust environment intensity for mood

**Performance:**
- HalfFloatType for HDR
- Optimized shadow maps
- Conditional effects based on device
