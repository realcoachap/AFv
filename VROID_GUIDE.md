# VRoid Studio Pipeline Guide
## Creating Stylized 3D Characters for Ascending Fitness RPG

---

## 🎯 What is VRoid Studio?

**VRoid Studio** is a FREE character creation tool by Pixiv (Japanese art platform). It's designed for creating stylized/anime-inspired 3D characters that work perfectly for games, VR, and web applications.

**Key Features:**
- ✅ **Completely FREE** (no hidden costs)
- ✅ **Beginner-friendly** — Easier than MakeHuman
- ✅ **Drag-and-drop interface** — Like The Sims character creator
- ✅ **Built-in clothing/hair** — No external modeling needed
- ✅ **Exports VRM format** — Industry standard for avatars
- ✅ **Converts to .glb** — Works with Three.js
- ✅ **iPad + Desktop** — Work on any device

---

## 📥 Step 1: Download & Install

### **Download VRoid Studio**
- **Website:** https://vroid.com/en/studio
- **Platforms:** Windows, macOS, iPad
- **Price:** FREE forever

### **System Requirements**

**Windows:**
- Windows 8.1 / 10 / 11
- Intel Core i5 6th gen or later (or AMD Ryzen 5 3rd gen+)
- 8 GB RAM
- 10 GB storage

**Mac:**
- macOS 11 or later
- 2015 models or later
- 8 GB RAM

**iPad:**
- iPadOS 15 or later
- 2018 models or later
- Apple Pencil support!

### **Installation**
```
Windows/Mac:
1. Download installer from website
2. Run installer
3. Launch VRoid Studio

iPad:
1. Download from App Store
2. Open app
3. Start creating!
```

---

## 🎨 Step 2: Interface Overview

### **When you first open VRoid Studio:**
You'll see a default anime-style character and panels on the left/right.

### **Main Panels:**

| Panel | What It Does |
|-------|-------------|
| **Face** | Eyes, nose, mouth, face shape |
| **Hairstyle** | Hair style, color, physics |
| **Body** | Height, proportions, muscle |
| **Outfit** | Clothing, shoes, accessories |
| **Texture** | Paint/edit textures directly |
| **Camera** | View angles, export preview |

---

## 💪 Step 3: Create Athletic Fitness Character

### **Tab: Body**

**For Male Athletic Build:**

**Base Settings:**
- **Base Model:** Male (クリックして選択)
- **Body Type:** Adult
- **Height:** 175-185cm
- **Age:** 25-35

**Adjust Sliders:**
```
Torso:
- Width: 0.6 - 0.8 (broad shoulders)
- Thickness: 0.5 - 0.7 (muscular)
- Height: 0.5 (balanced)

Arms:
- Width: 0.6 - 0.8 (muscular arms)
- Length: 0.5 (proportional)

Legs:
- Width: 0.6 - 0.7 (athletic legs)
- Length: 0.5 (balanced)

Neck:
- Width: 0.6 (thick, athletic)
- Length: 0.4 - 0.5
```

**Advanced → Muscle:**
- Muscle definition: 0.7 - 0.9
- This adds subtle muscle contours

### **For Female Athletic Build:**

**Base Settings:**
- **Base Model:** Female
- **Body Type:** Adult
- **Height:** 160-170cm

**Adjust Sliders:**
```
Torso:
- Width: 0.4 - 0.5 (athletic, not bulky)
- Thickness: 0.4 - 0.5 (toned)
- Height: 0.5

Arms:
- Width: 0.4 - 0.5 (toned)
- Length: 0.5

Legs:
- Width: 0.5 - 0.6 (defined)
- Length: 0.5
```

---

## 👕 Step 4: Add Fitness Clothing

### **Tab: Outfit**

**For Gym/Workout Look:**

**Male Options:**
```
Top:
- Select "Tops" category
- Choose: Tank top, Muscle shirt, or Sleeveless hoodie
- Color: Dark colors (black, navy, dark gray)
- Or bright gym colors (red, blue, neon)

Bottoms:
- Select "Bottoms" category
- Choose: Shorts or Athletic pants
- Length: Above knee for shorts
- Color: Match or contrast top

Shoes:
- Select "Shoes" category
- Choose: Sneakers
- Color: White or matching accent

Accessories:
- Wristbands (optional)
- Headband (optional)
- Watch/fitness tracker (optional)
```

**Female Options:**
```
Top:
- Sports bra or Tank top
- Colors: Any (bright gym colors work great)

Bottoms:
- Leggings or Athletic shorts
- High-waisted options available

Shoes:
- Running shoes or Cross-trainers
```

**Pro Tip:**
- Use **Layering** — Combine multiple clothing items
- Click "Add" to overlay pieces
- Adjust colors to match your brand

---

## 🎨 Step 5: Face & Hair

### **Tab: Face**

**For Athletic/Determined Look:**

**Eyes:**
- Shape: Almond or slightly angled (determined)
- Size: Medium to large (anime style)
- Color: Any (brown, hazel, blue, green)

**Eyebrows:**
- Thickness: Medium to thick
- Shape: Slightly angled (confident)

**Nose:**
- Size: Medium
- Shape: Straight or slightly defined

**Mouth:**
- Shape: Neutral or slight smile
- Size: Proportional

**Face Shape:**
- Jaw: Defined (not too round)
- Cheeks: Slight definition

### **Tab: Hairstyle**

**Athletic Hairstyles:**

**Male:**
- Short: Crew cut, Buzz cut, Short textured
- Medium: Swept back, Side part
- Athletic: Undercut, Fade

**Female:**
- Ponytail (classic gym look)
- Bun (practical, clean)
- Short: Pixie cut, Bob
- Long: Tied back styles

**Hair Physics:**
- Click "Physics" tab
- Adjust bounce/gravity
- For ponytails: Increase bounce slightly

---

## 🖌️ Step 6: Custom Textures (Optional)

### **Tab: Texture → Edit**

**Painting Tools:**
- Pen tool (supports pressure sensitivity)
- Layers system
- Real-time 3D preview

**Common Edits:**
- Add muscle definition lines
- Create custom clothing patterns
- Add tattoos or brand logos
- Edit skin details (freckles, moles)

**Export Textures:**
- Click "Export" in texture tab
- Save .png files
- Use in Blender for advanced edits

---

## 💾 Step 7: Export Your Character

### **Export as VRM:**

1. **Click "Camera/Export" tab** (bottom left)
2. **Click "Export" button**
3. **Choose settings:**
   ```
   Format: VRM
   Version: VRM 1.0 (or 0.0 for compatibility)
   
   Options:
   ✅ Export thumbnail
   ✅ Reduce blendshapes (for performance)
   ✅ Force T-pose (for animation)
   
   Size:
   - 1.0 (full quality)
   - Or 0.5 (smaller file, mobile-friendly)
   ```
4. **Click "Export"**
5. **Save .vrm file**

---

## 🔄 Step 8: Convert VRM → GLB (for Three.js)

VRoid exports VRM format, but Three.js works best with .glb. Here's how to convert:

### **Option A: Online Converter (Easiest)**

**Website:** https://vrm-viewer.com/convert

```
1. Go to website
2. Upload your .vrm file
3. Click "Convert to GLB"
4. Download .glb file
5. Done!
```

### **Option B: Command Line (Batch Convert)**

**Install VRM Converter:**
```bash
npm install -g @pixiv/three-vrm

# Or use VRM converter tool
npm install -g vrm-converter
```

**Convert:**
```bash
vrm-to-glb input.vrm output.glb
```

### **Option C: Import to Blender then Export**

**Blender Method (Most Control):**

1. **Install VRM addon for Blender:**
   - Download: https://github.com/saturday06/VRM_Addon_for_Blender
   - Edit → Preferences → Add-ons → Install → Select .zip

2. **Import VRM:**
   - File → Import → VRM (.vrm)
   - Select your file

3. **Clean up (optional):**
   - Check materials
   - Optimize mesh if needed
   - Add animation rig

4. **Export GLB:**
   - File → Export → glTF 2.0 (.glb/.gltf)
   - Check: ✅ Materials, ✅ UVs, ✅ Normals
   - Export!

---

## 🌐 Step 9: Load in Your React App

### **Place .glb file:**
```
/public/models/
  ├── vroid-athletic-male.glb
  ├── vroid-athletic-female.glb
  └── vroid-advanced-male.glb
```

### **React Component:**

```tsx
import { useGLTF, useAnimations } from '@react-three/drei'
import { useEffect } from 'react'

function VRoidCharacter({ url, animation = 'Idle' }) {
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, scene)
  
  useEffect(() => {
    // Play animation
    actions[animation]?.play()
    return () => actions[animation]?.stop()
  }, [actions, animation])
  
  return (
    <primitive 
      object={scene} 
      scale={1}
      position={[0, -1, 0]} 
    />
  )
}

// Preload for performance
useGLTF.preload('/models/vroid-athletic-male.glb')

export default VRoidCharacter
```

### **Use in Canvas:**

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import VRoidCharacter from './VRoidCharacter'

function App() {
  return (
    <Canvas camera={{ position: [0, 1, 3] }}>
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      <VRoidCharacter 
        url="/models/vroid-athletic-male.glb"
        animation="Idle"
      />
      
      <OrbitControls />
    </Canvas>
  )
}
```

---

## 🎭 Step 10: Add Animations

### **VRoid Characters Support:**

**Built-in Blendshapes (Facial expressions):**
- Happy
- Angry
- Surprised
- Sad
- Blink
- And more...

**Body Animations:**
- Need to add in Blender or use Mixamo

### **Adding Mixamo Animations:**

1. **Upload .glb to Mixamo:**
   - Go to https://www.mixamo.com
   - Upload your character
   - Auto-rig (if needed)

2. **Add animations:**
   - Browse animation library
   - Download with skin

3. **Import to Blender:**
   - Combine with your character
   - Export final .glb

---

## 📊 Character Variants to Create

### **For Ascending Fitness RPG:**

| Character | VRoid Settings | Clothing |
|-----------|---------------|----------|
| **Male Beginner** | Muscle: 0.3, Width: 0.5 | T-shirt, joggers |
| **Male Intermediate** | Muscle: 0.6, Width: 0.7 | Tank top, shorts |
| **Male Advanced** | Muscle: 0.9, Width: 0.8 | Sleeveless, compression |
| **Female Beginner** | Muscle: 0.2, Width: 0.4 | T-shirt, leggings |
| **Female Intermediate** | Muscle: 0.5, Width: 0.5 | Sports bra, shorts |
| **Female Advanced** | Muscle: 0.7, Width: 0.5 | Competition outfit |

---

## 🎨 Art Style Tips

### **GTA/WoW Style from VRoid:**

VRoid is anime-style by default, but you can make it more "Western game" style:

1. **Reduce anime features:**
   - Smaller eyes (more realistic proportions)
   - Less pointy chin
   - Subtle facial features

2. **Color palette:**
   - Muted/realistic skin tones
   - Realistic hair colors
   - Gym-appropriate clothing colors

3. **Post-processing in Blender:**
   - Add more realistic materials
   - Adjust lighting
   - Export as "realistic" version

---

## ⚡ Performance Optimization

### **For Web (Mobile-friendly):**

**In VRoid Studio:**
- Export at 0.5 or 0.75 size
- Reduce blendshapes (check "Reduce" option)
- Use simple hairstyles (not ultra-complex)

**Expected File Sizes:**
- Unoptimized: 15-30 MB
- Optimized: 3-8 MB
- With Draco: 1-3 MB

### **Draco Compression:**
```bash
# Install gltf-pipeline
npm install -g gltf-pipeline

# Compress
gltf-pipeline -i character.glb -o character-compressed.glb --draco.compressionLevel=7
```

---

## 🚀 Quick Reference: Full Pipeline

```
VROID STUDIO (free desktop app)
   ↓ Create character (20 min)
   ↓ Export .vrm
   
CONVERTER (online or command line)
   ↓ Convert to .glb (1 min)
   
BLENDER (optional, for cleanup)
   ↓ Import → Clean → Export (10 min)
   
COMPRESS (optional)
   ↓ gltf-pipeline --draco
   
/public/models/
   ↓ Place .glb file
   
THREE.JS (your app)
   ↓ useGLTF('/models/character.glb')
   🎉 Stylized 3D avatar!
```

---

## 💡 Pro Tips

1. **Save presets** — Save body shapes for consistency
2. **Use references** — Look at Fortnite/Overwatch characters
3. **Test early** — Export and test in browser frequently
4. **Backup .vrm files** — Source files are editable
5. **Create variants** — Save multiple versions (beginner → advanced)
6. **Community assets** — Download free hair/clothing from VRoid Hub

---

## 🎓 Learning Resources

### **VRoid Official:**
- YouTube: "VRoid Studio tutorial"
- Manual: In-app help (？ icon)
- Community: https://hub.vroid.com/

### **Conversion Tools:**
- VRM to GLB: https://vrm-viewer.com/convert
- Blender VRM addon: https://github.com/saturday06/VRM_Addon_for_Blender

### **Three.js Integration:**
- Three.js VRM loader: https://github.com/pixiv/three-vrm
- Documentation: https://threejs.org/docs/

---

## 📱 VRoid Hub (Bonus)

**Share & Download Models:**
- https://hub.vroid.com/
- Upload your characters
- Download community creations
- Find inspiration

**Free Models Available:**
- Search "athletic" or "sport"
- Filter by license (CC0 for commercial use)
- Download and customize

---

## 🏆 Expected Timeline

| Task | Time |
|------|------|
| Install VRoid Studio | 10 min |
| Create first character | 30 min |
| Export & convert | 10 min |
| Load in Three.js | 15 min |
| Create 6 variants | 3 hours |
| Add animations | 2 hours |
| **Total** | **~6 hours** |

---

## 🎮 Style Result

**VRoid characters look like:**
- Fortnite characters
- Overwatch heroes
- Genshin Impact
- Anime-styled games

**With tweaking:**
- Can approach GTA style (stylized realism)
- More "game character" than "photorealistic"
- Perfect for RPG aesthetic!

---

**Next step:** Download VRoid Studio and create your first character! 🚀

**Download:** https://vroid.com/en/studio
