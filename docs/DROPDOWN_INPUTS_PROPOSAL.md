# Dropdown Input Improvements - Proposal

**Date:** 2026-02-08  
**Requested by:** Coach  
**Purpose:** Make form inputs more streamlined with scroll-style dropdowns instead of manual number entry

---

## 🎯 Goal

Replace number inputs with dropdown selects for better UX, especially on mobile.

**Coach's Request:**
> "Add more drop-down options to make it more streamlined and easier, for example when you click age you can just scroll up and down for your age, same thing with height, etc."

---

## 📋 Fields to Convert to Dropdowns

### **Current Number Inputs → Proposed Dropdowns:**

1. **Age**
   - Current: Manual number input
   - Proposed: Dropdown with ages 13-100
   - Why: Limited range, easier to scroll than type

2. **Height (Inches)**
   - Current: Decimal input (72.5)
   - Proposed: Two dropdowns (Feet + Inches)
   - Example: `[6 feet ▼] [0 inches ▼]`
   - Range: 4'0" to 7'6" (48" to 90")

3. **Height (Centimeters)**
   - Current: Decimal input (183.5)
   - Proposed: Dropdown 100cm - 230cm (1cm increments)
   - Why: Easier to scroll than type precise numbers

4. **Weight (Pounds)**
   - Current: Decimal input (180.5)
   - Proposed: Dropdown 80 - 500 lbs (5 lb increments)
   - Why: Most people know their weight in 5lb increments

5. **Weight (Kilograms)**
   - Current: Decimal input (81.5)
   - Proposed: Dropdown 35 - 225 kg (1kg increments)
   - Why: Easier to select than type

6. **Average Sleep Hours**
   - Current: Decimal input (7.5)
   - Proposed: Dropdown with 0.5 hour increments
   - Range: 3.0 - 12.0 hours
   - Example: 4.0, 4.5, 5.0, 5.5, ..., 11.5, 12.0

7. **Exercise Days Per Week**
   - Current: Number input (3)
   - Proposed: Dropdown 0-7 days
   - Why: Only 8 options, perfect for dropdown

8. **Sessions Per Month**
   - Current: Number input (8)
   - Proposed: Dropdown with common values
   - Options: 2, 4, 6, 8, 10, 12, 16, 20, 24, 30
   - OR: Full range 1-30 if you prefer

---

## 🎨 Implementation Details

### **Height Dropdown Design**

**When "Inches" is selected:**
```
Height
┌──────────────┬───────────────┐
│ Feet         │ Inches        │
├──────────────┼───────────────┤
│ [4  ▼]      │ [0  ▼]       │
│ [5  ▼]      │ [1  ▼]       │
│ [6  ▼]      │ [2  ▼]       │
│ [7  ▼]      │ ...          │
└──────────────┴───────────────┘
```
- Feet: 4, 5, 6, 7
- Inches: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11

**When "Centimeters" is selected:**
```
Height
┌─────────────────────────────┐
│ [150 cm ▼]                 │
│  100 cm                     │
│  101 cm                     │
│  ...                        │
│  230 cm                     │
└─────────────────────────────┘
```

### **Weight Dropdown Design**

**Pounds (5 lb increments):**
```
Weight
┌─────────────────────────────┐
│ [180 lbs ▼]                │
│  80 lbs                     │
│  85 lbs                     │
│  90 lbs                     │
│  ...                        │
│  495 lbs                    │
│  500 lbs                    │
└─────────────────────────────┘
```

**Kilograms (1 kg increments):**
```
Weight
┌─────────────────────────────┐
│ [80 kg ▼]                  │
│  35 kg                      │
│  36 kg                      │
│  ...                        │
│  225 kg                     │
└─────────────────────────────┘
```

---

## 📱 Mobile Experience

**Benefits:**
- **No keyboard required** - Scroll to select
- **Faster input** - Especially on touch screens
- **Fewer errors** - Can't type invalid values
- **Native scroll** - Smooth wheel-style picker on iOS/Android

**Example on Mobile:**
```
┌──────────────────┐
│      Age         │
│  ──────────────  │
│      28          │  ← scroll up/down
│  [29]            │  ← selected
│      30          │
│  ──────────────  │
└──────────────────┘
```

---

## 🔧 Technical Implementation

### **Age Dropdown:**
```typescript
<select>
  <option value="">Select age...</option>
  {Array.from({ length: 88 }, (_, i) => i + 13).map(age => (
    <option key={age} value={age}>{age}</option>
  ))}
</select>
```

### **Height Dropdowns (Feet + Inches):**
```typescript
// Feet dropdown
<select>
  <option value="">Ft</option>
  {[4, 5, 6, 7].map(ft => (
    <option key={ft} value={ft}>{ft}'</option>
  ))}
</select>

// Inches dropdown
<select>
  <option value="">In</option>
  {Array.from({ length: 12 }, (_, i) => i).map(inch => (
    <option key={inch} value={inch}>{inch}"</option>
  ))}
</select>
```

### **Weight Dropdown (5lb increments):**
```typescript
<select>
  <option value="">Select weight...</option>
  {Array.from({ length: 85 }, (_, i) => 80 + i * 5).map(lbs => (
    <option key={lbs} value={lbs}>{lbs} lbs</option>
  ))}
</select>
```

---

## ⚡ Pros & Cons

### **Pros:**
✅ **Faster input** - Scroll vs type  
✅ **Mobile-friendly** - Native wheel pickers  
✅ **Fewer errors** - Can't enter invalid values  
✅ **Cleaner UX** - No keyboard popping up  
✅ **Professional feel** - Common pattern in fitness apps  

### **Cons:**
❌ **Longer dropdown lists** - Some have 100+ options (e.g., weight, height in cm)  
❌ **Less precise** - 5lb increments vs exact (e.g., 182.7 lbs)  
❌ **Initial scroll** - Takes time to scroll from default to actual value  

### **Mitigation:**
- Keep number input as **fallback option** for those who prefer typing
- OR: Add "Custom" option that shows number input
- OR: Use increment ranges (5 lbs for weight is reasonable)

---

## 🎯 Recommendation

### **Tier 1: Definitely convert these**
✅ **Age** - Limited range (13-100), perfect for dropdown  
✅ **Exercise Days Per Week** - Only 8 options (0-7)  
✅ **Height (Feet + Inches)** - Two small dropdowns better than decimal input  

### **Tier 2: Good candidates**
✅ **Average Sleep Hours** - Reasonable range (3-12 in 0.5 increments)  
✅ **Sessions Per Month** - Pre-set common values (2, 4, 6, 8, 12, 16, 20, 24)  

### **Tier 3: Consider keeping as number input**
⚠️ **Weight** - 85+ options (5lb increments), might be too long  
⚠️ **Height (cm)** - 130 options (100-230cm), very long list  

**Alternative for Weight & Height (cm):**
- Keep as number input BUT add **+/- stepper buttons**
- Example: `[▼] 180 [▲]` (click to increment/decrement)

---

## 📐 Smart Height Implementation

**Proposed UX:**

When user selects **"Inches"** unit:
- Show: `[Feet ▼] [Inches ▼]`
- Example: 6 feet, 2 inches

When user selects **"Centimeters"** unit:
- Show: Number input with stepper: `[▼] 183 [▲] cm`
- OR: Dropdown if you prefer (but it's a long list)

**Why different?**
- Feet + inches is natural (everyone thinks "I'm 6'2"")
- Centimeters is already a single unit, no need for two dropdowns

---

## 🚀 Implementation Plan

### **Phase A: Quick Wins (Tier 1)**
- Age → dropdown (13-100)
- Exercise days per week → dropdown (0-7)
- Height inches → feet + inches dropdowns

### **Phase B: Nice to Have (Tier 2)**
- Sleep hours → dropdown (3-12 in 0.5 increments)
- Sessions per month → dropdown (common values)

### **Phase C: Optional (Tier 3)**
- Weight → Keep number input, add stepper buttons?
- Height cm → Keep number input, add stepper buttons?

---

## ⏱️ Time Estimate

**Phase A (Tier 1):** ~1-2 hours  
**Phase B (Tier 2):** ~1 hour  
**Phase C (Tier 3):** ~1-2 hours if adding steppers  

**Total:** 2-4 hours depending on scope

---

## ❓ Questions for Coach

1. **All Tier 1 fields?** (Age, exercise days, height in feet/inches) → Convert to dropdowns?
2. **Weight:** Dropdown with 5lb increments OR keep number input?
3. **Height (cm):** Dropdown (long list) OR number input with stepper buttons?
4. **Sleep hours:** Dropdown (0.5 increments) OR keep number input?
5. **Sessions per month:** Dropdown (preset values) OR full 1-30 range?

---

## 🎨 Preview

**Before (Number Input):**
```
Age: [___] (type 29)
```

**After (Dropdown):**
```
Age: [29 ▼] (scroll to select)
```

**Mobile Before:** Keyboard pops up, type number  
**Mobile After:** Native wheel picker, scroll to select  

---

## ✅ Approval Checklist

- [ ] Convert Age to dropdown (13-100)
- [ ] Convert Exercise Days to dropdown (0-7)
- [ ] Convert Height (inches) to Feet + Inches dropdowns
- [ ] Sleep hours: Dropdown OR keep input?
- [ ] Sessions per month: Dropdown OR keep input?
- [ ] Weight: Dropdown OR keep input OR add stepper?
- [ ] Height (cm): Dropdown OR keep input OR add stepper?

---

**Ready to implement once you approve! Let me know which tier(s) you want.** 💪

---

**Proposal by Vlad | Awaiting Coach Approval | 2026-02-08**
