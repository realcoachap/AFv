# MakeHuman Pipeline Guide
## Creating Custom 3D Characters for Ascending Fitness RPG

---

## 🎯 What is MakeHuman?

**MakeHuman** is free, open-source software specifically designed to create realistic 3D human characters. Think of it as "The Sims" character creator but for professional 3D models.

**Key Features:**
- ✅ Completely FREE (open source)
- ✅ No 3D modeling skills required
- ✅ Realistic human anatomy
- ✅ Customizable: age, weight, muscles, height, ethnicity
- ✅ Clothing and hair systems
- ✅ Exports to Blender, Unity, Three.js
- ✅ Works on Windows, Mac, Linux

---

## 📥 Step 1: Download & Install

### **Download MakeHuman**
- **Website:** https://www.makehumancommunity.org/
- **Direct Download:** https://static.makehumancommunity.org/makehuman/docs/installing_makehuman.html
- **Current Version:** 1.2.0 (stable)

### **Installation**
```
Windows:
1. Download .exe installer
2. Run installer
3. Launch MakeHuman

Mac:
1. Download .dmg file
2. Drag to Applications
3. Open MakeHuman.app

Linux:
1. Download source
2. Run: python makehuman.py
```

---

## 🎨 Step 2: Create Your First Character

### **Launch MakeHuman**
When you open it, you'll see a default character and sliders on the right.

### **The 4 Main Tabs:**

| Tab | What It Controls |
|-----|-----------------|
| **Geometry** | Body shape, age, gender, muscle, weight |
| **Pose/Animate** | Skeleton rigging, poses |
| **Materials** | Skin tone, eye color, details |
| **Utilities** | Export, plugins |

---

## 💪 Step 3: Create Athletic Body (Fitness Focus)

### **For Male Athletic Build:**

**Geometry Tab → Body**
- **Gender:** Male
- **Age:** 25-35 (depending on target)
- **Height:** 180cm (or your preference)
- **Weight:** 75-85kg
- **Muscle:** 0.8 - 1.0 (high muscle definition)
- **Proportions:** 
  - Shoulder width: Wide
  - Waist: Narrow
  - Arms: Muscular
  - Legs: Defined calves

**Geometry Tab → Face**
- Jaw: Strong, defined
- Cheekbones: High
- Brow: Prominent
- Neck: Thick (athletic)

### **For Female Athletic Build:**

**Geometry Tab → Body**
- **Gender:** Female
- **Age:** 25-35
- **Height:** 165-170cm
- **Weight:** 55-65kg
- **Muscle:** 0.6 - 0.8 (toned, not bulky)
- **Proportions:**
  - Shoulder-hip ratio: Athletic
  - Waist: Defined
  - Legs: Toned thighs/calves

---

## 👕 Step 4: Add Clothing

### **Tab: Materials → Clothing**

**For Fitness RPG, add:**
- Athletic wear (shorts, tank top)
- Sneakers
- Optional: Headband, wristbands

**Custom Clothing:**
If you want unique outfits:
1. Create basic clothing in MakeHuman
2. Export to Blender
3. Design custom clothing in Blender
4. Re-export

---

## 🎨 Step 5: Skin & Materials

### **Materials Tab:**
- **Skin tone:** Choose range
- **Skin texture:** Realistic, detailed, or game-optimized
- **Eye color:** Brown, blue, green, hazel
- **Hair:** Color, style, length

**For Web Performance:**
- Use "Game Engine" skin (lower poly, optimized)
- Keep textures 2K or lower (1K for mobile)

---

## 💾 Step 6: Export to Blender

### **Export Settings (for Three.js):**

**Step 1: In MakeHuman**
1. Go to **Utilities → Export**
2. Format: **.mhx2** (MakeHuman eXchange 2)
   - OR **.fbx** if going directly to Three.js
3. Check these options:
   - ✅ Skeleton (for animation)
   - ✅ Face rig (expressions)
   - ✅ Feet on ground
   - ✅ Scale in meters
4. Click **Export**

**Step 2: In Blender** (if you need modifications)
1. Install **MakeHuman plugin** for Blender
   - Download: https://github.com/makehumancommunity/makehuman-plugin-for-blender
2. Import .mhx2 file
3. Make adjustments if needed
4. Apply **Rigify** for better animation rig

---

## 🔧 Step 7: Blender Optimization

### **Install Required Blender Add-ons:**
1. **Rigify** (built-in)
   - Edit → Preferences → Add-ons → Search "Rigify" → Enable

2. **MakeHuman Plugin**
   - Download .zip from GitHub
   - Edit → Preferences → Add-ons → Install → Select .zip

### **Clean Up the Mesh:**
```
1. Import .mhx2 file
2. Check mesh in Edit Mode
3. Remove any duplicate vertices
   - Select all → M → Merge by Distance
4. Check UV maps (should be clean)
5. Apply smooth shading
   - Right-click → Shade Smooth
```

### **Add Animation Rig:**
```
1. Select armature
2. Go to Object Data Properties (green stick icon)
3. Click "Generate Rig" (Rigify)
4. Now you have a professional animation rig!
```

---

## 📦 Step 8: Export for Three.js

### **Final Export (.glb format):**

**File → Export → glTF 2.0 (.glb/.gltf)**

**Check these options:**
```
✅ Include: Selected Objects (or all)
✅ Geometry: Apply Modifiers
✅ Geometry: UVs
✅ Geometry: Normals
✅ Geometry: Vertex Colors
✅ Materials: Export (KHR_materials_specular)
✅ Animation: Use Current Frame (or animations)
✅ Animation: Skinning
```

**Format:** Choose **.glb** (binary, single file)

### **Optimization Settings:**
- **Draco compression:** Yes (smaller file size)
- **Image format:** WebP (if using textures)

---

## 🌐 Step 9: Load in Three.js (Your App)

### **Place .glb file:**
```
/public/models/
  ├── base-male-athletic.glb
  ├── base-female-athletic.glb
  └── outfit-variants/
```

### **Load in React Component:**
```tsx
import { useGLTF } from '@react-three/drei'

function Character({ url }) {
  const { scene } = useGLTF(url)
  
  return (
    <primitive 
      object={scene} 
      scale={1} 
      position={[0, -1, 0]}
    />
  )
}

// Preload
useGLTF.preload('/models/base-male-athletic.glb')
```

---

## 🎭 Step 10: Animation System

### **Idle Animations:**
```
In Blender:
1. Create simple idle animation
2. Loop it
3. Export with animation

In Three.js:
import { useAnimations } from '@react-three/drei'

function AnimatedCharacter({ url }) {
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, scene)
  
  useEffect(() => {
    actions.Idle?.play()
  }, [actions])
  
  return <primitive object={scene} />
}
```

---

## 📊 Character Variants to Create

### **For Ascending Fitness RPG, create:**

| Variant | Purpose |
|---------|---------|
| **Male Athletic** | Default male character |
| **Female Athletic** | Default female character |
| **Male Bulk** | High strength level |
| **Female Toned** | Endurance focused |
| **Beginner** | Lower muscle, higher body fat |
| **Advanced** | Very defined, competition ready |

### **Clothing Variants:**
- Gym wear (tank/shorts)
- Outdoor running (compression)
- Competition (posing trunks/sports bra)
- Recovery (sweats/hoodie)

---

## 🚀 Advanced: Customization Pipeline

### **Make Customizable Characters:**

**1. Base Meshes (MakeHuman → Blender):**
- Create 2 base meshes (male/female)
- Keep topology clean
- UV unwrap properly

**2. Shape Keys (Blender):**
- Create blend shapes for:
  - Muscle gain/loss
  - Weight gain/loss
  - Age progression

**3. Texture Swapping (Three.js):**
```tsx
// Change outfit texture
const material = scene.getObjectByName('Torso').material
material.map = new THREE.TextureLoader().load('/textures/outfit-sleeveless.jpg')
```

**4. Dynamic Muscle:**
```tsx
// Adjust blend shape based on stats
const morphTargets = mesh.morphTargetDictionary
mesh.morphTargetInfluences[morphTargets['Muscle']] = strength / 100
```

---

## ⚡ Performance Optimization

### **For Web (Mobile-friendly):**
- **Polygon count:** Keep under 20K triangles
- **Texture size:** 1K-2K max
- **Bone count:** Under 64 bones for mobile
- **Materials:** Use simple PBR, not complex shaders

### **Draco Compression:**
```bash
# Install gltf-pipeline
npm install -g gltf-pipeline

# Compress .glb
gltf-pipeline -i input.glb -o output.glb --draco.compressionLevel=7
```

**Result:** 70-90% smaller file size!

---

## 📝 Quick Reference: Full Pipeline

```
MAKEHUMAN
   │
   ▼
Create Character (body shape, face, clothing)
   │
   ▼
EXPORT → .mhx2 (with skeleton)
   │
   ▼
BLENDER
   │
   ▼
Import → Clean mesh → Rigify → Animate
   │
   ▼
EXPORT → .glb (with animations)
   │
   ▼
COMPRESS → gltf-pipeline --draco
   │
   ▼
/public/models/
   │
   ▼
THREE.JS → Load with useGLTF()
   │
   ▼
🎉 Professional 3D avatar in your app!
```

---

## 💡 Pro Tips

1. **Save presets** in MakeHuman for consistency
2. **Use reference photos** for proportions
3. **Test on mobile early** (performance matters)
4. **Create LOD versions** (Level of Detail)
   - High: 20K polys (desktop)
   - Medium: 10K polys (tablet)
   - Low: 5K polys (mobile)
5. **Batch export** multiple characters at once

---

## 🎓 Learning Resources

### **MakeHuman:**
- Official docs: https://static.makehumancommunity.org/
- YouTube: "MakeHuman tutorial" 

### **Blender:**
- Blender Guru (YouTube)
- Official Blender manual

### **Three.js + glTF:**
- Three.js docs: https://threejs.org/docs/
- glTF spec: https://www.khronos.org/gltf/

---

## 🏆 Expected Timeline

| Task | Time |
|------|------|
| Install MakeHuman + Blender | 30 min |
| Create first character | 1 hour |
| Learn export workflow | 2 hours |
| Create 6 character variants | 4 hours |
| Optimize for web | 2 hours |
| Integrate into app | 2 hours |
| **Total** | **~12 hours** |

---

**Next step:** Install MakeHuman and create your first character! 🚀
