# 🔄 Rollback Guide for v0.2.1-alpha

**Current Version:** v0.2.1-alpha  
**Previous Stable Version:** v0.2.0  
**Deployment Date:** February 9, 2026

---

## 🚨 If Something Goes Wrong

### Option 1: Quick Rollback via Git (2 minutes)

```bash
cd ~/.openclaw/workspace/client-management-system

# Revert to previous stable version
git checkout v0.2.0

# Force push to main (will trigger Railway redeploy)
git push origin HEAD:main --force
```

**Result:** Railway auto-deploys v0.2.0 in ~2-3 minutes. Your app reverts to the previous working state.

---

### Option 2: Railway Dashboard Rollback (30 seconds)

1. Go to Railway dashboard: https://railway.app
2. Navigate to your project
3. Click "Deployments" tab
4. Find the previous successful deployment (before today)
5. Click "⋯" menu → "Redeploy"

**Result:** Instant rollback to previous deployment.

---

### Option 3: Revert Specific Commit (if only partial issues)

```bash
cd ~/.openclaw/workspace/client-management-system

# Revert just the merge commit (keeps history clean)
git revert ec841d8 -m 1

# Push to trigger redeploy
git push origin main
```

**Result:** Creates a new commit that undoes v0.2.1-alpha changes, preserving git history.

---

## 📍 Version Reference

| Version | Git Tag | Commit Hash | Date | Notes |
|---------|---------|-------------|------|-------|
| **v0.2.1-alpha** | v0.2.1-alpha | ec841d8 | 2026-02-09 | Branding + Interactive Calendar |
| **v0.2.0** | v0.2.0 | 59268bc | 2026-02-08 | Profile + Scheduling System |
| v0.1.0 | v0.1.0 | (earlier) | 2026-02-07 | Foundation + Auth |

---

## 🧪 Testing Checklist (After Deployment)

### Critical Features (Test First)
- [ ] **Can you log in?** (Most important!)
- [ ] **Does admin dashboard load?**
- [ ] **Can you view schedule calendar?**
- [ ] **Can you click empty slot to book?** (new feature)
- [ ] **Does logo show in nav bar?** (not broken image)

### If Any Fail → Rollback Immediately

### Secondary Testing (If critical features work)
- [ ] Edit client phone number
- [ ] Create session for that client
- [ ] Verify phone shows correctly
- [ ] Landing page looks good
- [ ] Mobile responsive (open on phone)

---

## 📞 Emergency Contacts

**Railway Status:** https://status.railway.app (check for service issues)  
**GitHub Repo:** https://github.com/realcoachap/AF  
**Your Database:** centerbeam.proxy.rlwy.net:14874/railway (backed up by Railway)

---

## 💾 Database Safety

**Good news:** This release has **ZERO database migrations**. All changes are frontend-only (branding, UI, components).

- Your data is safe
- No schema changes
- Rollback won't affect client profiles or sessions
- Database stays intact regardless of version

---

## 🔍 Common Issues & Fixes

### Issue: "Logo not loading" (broken image)

**Cause:** `public/logo.jpg` missing or path wrong  
**Quick Fix:**
```bash
# Verify logo exists
ls -lh public/logo.jpg
```

**If missing:** Re-deploy previous version, then investigate.

### Issue: "Calendar click not working"

**Cause:** JavaScript error or component issue  
**Quick Fix:**
- Check browser console (F12) for errors
- Try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- If persists → rollback

### Issue: "Phone numbers still wrong"

**Not a breaking issue!** App still works, just phone display bug.  
**Don't rollback for this.** Let me investigate and push a hotfix.

---

## 📱 Deployment Status Check

After pushing, Railway should deploy automatically. Check status:

```bash
# Watch Railway logs (if you have CLI installed)
railway logs

# Or visit Railway dashboard
# Look for "Deployment successful" message
# Should take ~2-3 minutes
```

**Live URL:** https://kind-charisma-production.up.railway.app

---

## ✅ Rollback Decision Matrix

| Symptom | Severity | Action |
|---------|----------|--------|
| Can't log in | 🔴 Critical | **Rollback immediately** |
| Admin dashboard blank | 🔴 Critical | **Rollback immediately** |
| Logo broken | 🟡 Medium | Test other features first |
| Calendar click not working | 🟡 Medium | Can still use "+ New Session" button |
| Phone number wrong | 🟢 Minor | Don't rollback, I'll fix |
| Styling looks off | 🟢 Minor | Cosmetic, can hotfix |

---

## 📝 Notes

- **Backup made:** Feature branch `feature/v0.2.1-branding-booking` preserved in git
- **Can restore:** Any commit is recoverable via git
- **Data safe:** No database changes in this release
- **Tested locally:** All features worked in dev environment

---

**Ready to test!** 🚀

If anything breaks, just use Option 1 or Option 2 above. I'll be here to help if needed.

— Vlad 🏗️
