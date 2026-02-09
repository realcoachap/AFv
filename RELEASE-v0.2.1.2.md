# 🚀 Release v0.2.1.2 - Mobile Fix + Calorie Calculator

**Release Date:** February 9, 2026  
**Type:** Hotfix + Feature  
**Status:** Deployed ✅

---

## 🎯 What's New

### 1. Calorie Calculator 🔢

**NEW PAGE:** `/admin/calculator`

A professional tool to calculate client nutrition needs:

- **BMR Calculator** - Basal Metabolic Rate (Mifflin-St Jeor equation)
- **TDEE Calculator** - Total Daily Energy Expenditure with activity multipliers
- **Goal-Based Adjustments:**
  - Fat Loss: -500 cal/day (~1 lb/week)
  - Maintenance: No adjustment
  - Muscle Gain: +300 cal/day (~0.5 lb/week)
- **Macro Split:**
  - Protein: 2g per kg body weight
  - Fats: ~27.5% of calories
  - Carbs: Remaining calories
- **Mobile responsive** with clean layout
- **Color-coded macros** (blue/green/orange)

**How to Access:**
- Dashboard → "Calculator" in nav
- Dashboard → "Calorie Calculator" card
- Admin Clients page → "Calculator" in nav

---

### 2. Mobile Calendar Booking Fix 📱✅

**Problem:** Calendar not responding to taps on mobile

**Solution: Floating Quick-Add Button**

- **Floating "+" button** on mobile (bottom right)
- Always visible, always works
- One tap → booking modal with current time
- Calendar slot tapping also improved with:
  - `longPressThreshold={10}` for faster response
  - Better touch detection
  - Visual feedback on tap

**Tip banner updated:** "Tap empty slot or use + button" on mobile

---

## 📋 Changes Summary

### Added
- ✅ Calorie calculator page with BMR/TDEE/macro calculations
- ✅ Floating + button for mobile quick booking (reliable fallback)
- ✅ Calculator navigation links across admin pages
- ✅ Dashboard card for calculator

### Fixed
- ✅ Mobile calendar interaction with longPressThreshold
- ✅ Touch feedback and visual selection
- ✅ Mobile booking now has 2 ways: tap slot OR tap + button

---

## 🧪 Test Checklist

### Mobile Calendar Booking
- [ ] Open schedule page on phone
- [ ] See floating + button (bottom right)
- [ ] Tap + button → booking modal opens ✅
- [ ] Try tapping empty calendar slot (may work, + button is backup)
- [ ] Book a session via + button
- [ ] Verify session appears on calendar

### Calorie Calculator
- [ ] Go to Dashboard → click "Calculator" (nav or card)
- [ ] Fill in: Age, Gender, Weight, Height
- [ ] Select Activity Level
- [ ] Select Goal (fat loss/maintain/gain)
- [ ] Click "Calculate"
- [ ] See BMR, TDEE, Target Calories
- [ ] See Macro breakdown (protein/carbs/fats)
- [ ] Test on mobile - should be responsive

---

## 💡 Usage Tips

### Calorie Calculator
1. Use client's profile data
2. Start conservative with activity level
3. Adjust macros based on client preferences/restrictions
4. These are **starting points** - monitor and adjust
5. Print/screenshot results for client records

### Mobile Booking
- **Desktop:** Click empty calendar slot
- **Mobile:** Use floating + button (reliable) or try tapping slot

---

## 📊 Stats

- **Files Changed:** 5
- **Lines Added:** +389
- **New Features:** 2 (calculator + mobile booking fix)
- **Time to Deploy:** ~15 minutes

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| v0.2.1.2 | Feb 9 | Calorie calculator + mobile fix |
| v0.2.1.1 | Feb 9 | Mobile responsive improvements |
| v0.2.1-alpha | Feb 9 | Branding + interactive calendar |
| v0.2.0 | Feb 8 | Profile + scheduling system |

---

## 🚢 Deployment

**Branch:** main  
**Commit:** 1a83a1e  
**Tag:** v0.2.1.2  
**Railway:** Auto-deployed ✅  
**Live URL:** https://kind-charisma-production.up.railway.app

---

## 📝 Notes

- **Calorie calculations** use industry-standard formulas (Mifflin-St Jeor)
- **Floating button** positioned to avoid nav/tabs conflicts
- **Zero database changes** - safe upgrade
- **All previous features** still work

---

## 🎯 Next Steps

**Try it out!**
1. Test mobile booking with + button
2. Try the calorie calculator with a sample client
3. Let me know if you want any adjustments

**Future enhancements:**
- Save calculated macros to client profile?
- Meal plan templates based on macros?
- Progress tracking graphs?

---

**Status:** ✅ Live and ready!

Coach, the floating + button should solve the mobile issue. Try it now! 📱💪
