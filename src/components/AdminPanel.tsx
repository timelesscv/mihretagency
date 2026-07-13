import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Layout, Globe, FileText, ClipboardCheck, Compass, Heart, 
  MapPin, MessageSquare, Users, Settings, Eye, LogOut, 
  Plus, Trash2, Edit3, Save, RefreshCw, Lock, Key, CheckCircle, AlertCircle, Download, Upload, Image, Share2
} from "lucide-react";
import { Language } from "../types";
import Home from "./Home";
import { 
  isEnabled as isFirebaseEnabled, 
  saveCandidateToCloud, 
  deleteCandidateFromCloud, 
  fetchCandidatesFromCloud, 
  saveTranslationsToCloud, 
  fetchTranslationsFromCloud, 
  saveImagesToCloud, 
  fetchImagesFromCloud,
  getFirebaseConfig
} from "../lib/firebase";
interface AdminPanelProps {
  language: Language;
  onNavigate: (page: "home" | "partner" | "apply" | "admin") => void;
  translationsState: Record<Language, any>;
  onUpdateTranslations: (newTrans: Record<Language, any>) => void;
  images: any;
  onUpdateImages: (newImages: any) => void;
}

export default function AdminPanel({
  language,
  onNavigate,
  translationsState,
  onUpdateTranslations,
  images,
  onUpdateImages,
}: AdminPanelProps) {
  // Authentication State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("mihret_admin_logged_in") === "true";
  });
  const [loginError, setLoginError] = useState("");

  // Admin Credentials (stored in localStorage, default to user requirements)
  const [adminCreds, setAdminCreds] = useState(() => {
    const saved = localStorage.getItem("mihret_admin_credentials");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      username: "admin@mihretagency",
      password: "03a@!1_F4Qx",
    };
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "hero" | "placements" | "about" | "services" | "values" | "testimonials" | "contact" | "tracker" | "settings" | "images" | "firebase"
  >("hero");

  // Local editable copy of translations & images
  const [editedTrans, setEditedTrans] = useState(translationsState);
  const [editedImages, setEditedImages] = useState(images);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit language tab for CMS inputs
  const [editLang, setEditLang] = useState<Language>("en");

  // Live Preview Settings
  const [previewPage, setPreviewPage] = useState<"home">("home");
  const [previewLang, setPreviewLang] = useState<Language>("en");
  const [showPreviewPane, setShowPreviewPane] = useState(true);

  // Tracker candidates database state
  const [candidates, setCandidates] = useState<any[]>(() => {
    const saved = localStorage.getItem("mihret_tracker_db");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { passport: "EP1234567", name: "Abebech Kebede", status: "matched" },
      { passport: "EP7654321", name: "Fatima Al-Hassan", status: "visa" },
      { passport: "EP9876543", name: "Chaltu Tolosa", status: "ready" },
      { passport: "EP1122334", name: "Mohammed Ahmed", status: "submitted" }
    ];
  });

  // New Candidate Form State
  const [newPassport, setNewPassport] = useState("");
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState("submitted");

  // Password Change Form State
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  // Username Change Form State
  const [newAdminUser, setNewAdminUser] = useState("");
  const [userError, setUserError] = useState("");
  const [userSuccess, setUserSuccess] = useState("");

  // Firebase Setup Form State
  const [firebaseConfigInput, setFirebaseConfigInput] = useState(() => {
    const currentConfig = getFirebaseConfig();
    if (currentConfig) {
      return JSON.stringify(currentConfig, null, 2);
    }
    return JSON.stringify({
      apiKey: "YOUR_API_KEY",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project.appspot.com",
      messagingSenderId: "your-sender-id",
      appId: "your-app-id"
    }, null, 2);
  });
  const [firebaseConnectStatus, setFirebaseConnectStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [firebaseConnectError, setFirebaseConnectError] = useState("");

  // Sync edited translations with props
  useEffect(() => {
    setEditedTrans(translationsState);
  }, [translationsState]);

  // Sync edited images with props
  useEffect(() => {
    setEditedImages(images);
  }, [images]);

  // Live Cloud sync if Firebase is enabled
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  useEffect(() => {
    if (!isFirebaseEnabled) return;
    
    const syncWithFirebase = async () => {
      setIsCloudSyncing(true);
      try {
        const cloudCandidates = await fetchCandidatesFromCloud();
        if (cloudCandidates && cloudCandidates.length > 0) {
          setCandidates(cloudCandidates);
          localStorage.setItem("mihret_tracker_db", JSON.stringify(cloudCandidates));
        }

        const cloudTrans = await fetchTranslationsFromCloud();
        if (cloudTrans) {
          setEditedTrans(cloudTrans);
          onUpdateTranslations(cloudTrans);
        }

        const cloudImg = await fetchImagesFromCloud();
        if (cloudImg) {
          setEditedImages(cloudImg);
          onUpdateImages(cloudImg);
        }
      } catch (err) {
        console.error("Firebase initial synchronization failed:", err);
      } finally {
        setIsCloudSyncing(false);
      }
    };

    syncWithFirebase();
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const expectedUser = adminCreds.username.trim().toLowerCase();
    
    // Support either clean username or complete email match
    if (
      (cleanUser === expectedUser || cleanUser === expectedUser.split("@")[0] || cleanUser + "@mihretagency" === expectedUser) && 
      password === adminCreds.password
    ) {
      setIsLoggedIn(true);
      setLoginError("");
      sessionStorage.setItem("mihret_admin_logged_in", "true");
    } else {
      setLoginError("Invalid username or password. Please try again.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("mihret_admin_logged_in");
  };

  // Update specific key in translations copy
  const updateKey = (lang: Language, key: string, value: string) => {
    setEditedTrans((prev: any) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value,
      }
    }));
  };

  // Update image path copy
  const updateImgKey = (key: string, value: string) => {
    setEditedImages((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save all CMS changes
  const saveAllChanges = async () => {
    onUpdateTranslations(editedTrans);
    onUpdateImages(editedImages);
    setSaveSuccess(true);
    
    if (isFirebaseEnabled) {
      try {
        await saveTranslationsToCloud(editedTrans);
        await saveImagesToCloud(editedImages);
      } catch (err) {
        console.error("Failed to sync CMS changes to Firestore:", err);
      }
    }
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Reset to original default state
  const resetToFactoryDefaults = () => {
    if (window.confirm("Are you sure you want to reset ALL website text and images back to original defaults? This will erase any customized copy.")) {
      localStorage.removeItem("mihret_agency_v5_translations");
      localStorage.removeItem("mihret_agency_v5_images");
      window.location.reload();
    }
  };

  // Save Candidate changes
  const saveCandidatesToStorage = (updated: any[]) => {
    setCandidates(updated);
    localStorage.setItem("mihret_tracker_db", JSON.stringify(updated));
  };

  // Add Candidate
  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassport.trim() || !newName.trim()) {
      alert("Please fill out both passport and name fields.");
      return;
    }
    const passportUpper = newPassport.trim().toUpperCase();
    if (candidates.some(c => c.passport === passportUpper)) {
      alert("A candidate with this passport number already exists!");
      return;
    }
    const newCand = { passport: passportUpper, name: newName.trim(), status: newStatus, updatedAt: new Date().toISOString() };
    const updated = [...candidates, newCand];
    saveCandidatesToStorage(updated);
    if (isFirebaseEnabled) {
      saveCandidateToCloud(newCand).catch(err => console.error("Cloud candidate save failed:", err));
    }
    setNewPassport("");
    setNewName("");
    setNewStatus("submitted");
  };

  // Delete Candidate
  const handleDeleteCandidate = (passport: string) => {
    if (window.confirm(`Are you sure you want to delete applicant file with passport ${passport}?`)) {
      const updated = candidates.filter(c => c.passport !== passport);
      saveCandidatesToStorage(updated);
      if (isFirebaseEnabled) {
        deleteCandidateFromCloud(passport).catch(err => console.error("Cloud candidate deletion failed:", err));
      }
    }
  };

  // Update Candidate Status
  const handleUpdateCandidateStatus = (passport: string, status: string) => {
    const updated = candidates.map(c => {
      if (c.passport === passport) {
        const up = { ...c, status, updatedAt: new Date().toISOString() };
        if (isFirebaseEnabled) {
          saveCandidateToCloud(up).catch(err => console.error("Cloud status update failed:", err));
        }
        return up;
      }
      return c;
    });
    saveCandidatesToStorage(updated);
  };

  // Save Firebase Config & Connect
  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setFirebaseConnectStatus("testing");
    setFirebaseConnectError("");
    
    try {
      const parsed = JSON.parse(firebaseConfigInput);
      if (!parsed.apiKey || !parsed.projectId) {
        throw new Error("API Key and Project ID are required fields.");
      }
      
      // Save to localStorage
      localStorage.setItem("mihret_firebase_config", JSON.stringify(parsed));
      
      const success = window.confirm(
        "Firebase configuration saved! The application needs to reload to connect to your new Cloud Firestore database. Ready?"
      );
      if (success) {
        window.location.reload();
      } else {
        setFirebaseConnectStatus("idle");
      }
    } catch (err: any) {
      setFirebaseConnectStatus("error");
      setFirebaseConnectError(err.message || "Invalid JSON format. Please paste a valid JSON configuration object.");
    }
  };

  const handleDisconnectFirebase = () => {
    if (window.confirm("Are you sure you want to disconnect Firebase and switch back to Local Browser Storage?")) {
      localStorage.setItem("mihret_firebase_config", "disconnected");
      window.location.reload();
    }
  };

  // Handle password change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (currentPass !== adminCreds.password) {
      setPassError("Current password is incorrect.");
      return;
    }
    if (newPass.length < 6) {
      setPassError("New password must be at least 6 characters long.");
      return;
    }
    if (newPass !== confirmPass) {
      setPassError("New passwords do not match.");
      return;
    }

    const updatedCreds = { ...adminCreds, password: newPass };
    setAdminCreds(updatedCreds);
    localStorage.setItem("mihret_admin_credentials", JSON.stringify(updatedCreds));
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    setPassSuccess("Password changed successfully!");
  };

  // Handle username change
  const handleChangeUsername = (e: React.FormEvent) => {
    e.preventDefault();
    setUserError("");
    setUserSuccess("");

    if (!newAdminUser.trim() || !newAdminUser.includes("@")) {
      setUserError("Please enter a valid administrative username/email (e.g., name@mihretagency).");
      return;
    }

    const updatedCreds = { ...adminCreds, username: newAdminUser.trim() };
    setAdminCreds(updatedCreds);
    localStorage.setItem("mihret_admin_credentials", JSON.stringify(updatedCreds));
    setNewAdminUser("");
    setUserSuccess(`Username updated successfully to ${updatedCreds.username}`);
  };

  // Export configuration as JSON file
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        translations: editedTrans,
        images: editedImages,
        candidates: candidates
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "mihret_website_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import configuration JSON file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.translations && parsed.images) {
            setEditedTrans(parsed.translations);
            setEditedImages(parsed.images);
            onUpdateTranslations(parsed.translations);
            onUpdateImages(parsed.images);
            if (parsed.candidates) {
              saveCandidatesToStorage(parsed.candidates);
            }
            alert("Backup imported and applied successfully!");
          } else {
            alert("Invalid backup file format. Must contain translations and images.");
          }
        } catch (err) {
          alert("Failed to parse JSON file.");
        }
      };
    }
  };

  // Render Login view if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0E1A2C] flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#122B63] max-w-md w-full border border-brand-border/40 p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Accent decoration */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#1ea0d1]/15 rounded-full blur-2xl" />

          <div className="text-center mb-8">
            <img src="/logo.png" alt="Logo" className="h-14 mx-auto object-contain mb-4" />
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">Mihret Agency</h1>
            <p className="text-brand-gold uppercase text-[9px] font-bold tracking-[0.2em] mt-1.5">Management Portal Login</p>
          </div>

          {loginError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded p-3 flex items-center gap-2.5 text-xs text-red-200">
              <AlertCircle className="size-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-white/90">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-gold">Administrative Email/Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@mihretagency"
                  required
                  className="w-full bg-[#0E1A2C] border border-brand-border/40 px-4 py-3 rounded text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold/75 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-gold">Secure Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0E1A2C] border border-brand-border/40 px-4 py-3 rounded text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold/75 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-gold text-brand-navy font-bold text-xs uppercase tracking-widest py-3.5 transition-all hover:bg-white active:scale-[0.98] cursor-pointer mt-2"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-[10px] text-white/40 tracking-wider">
            <button 
              type="button"
              onClick={() => onNavigate("home")}
              className="hover:text-brand-gold transition-colors"
            >
              ← Back to Mihret Public Site
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col font-sans text-brand-navy">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-50 bg-[#0E1A2C] border-b border-brand-border/50 text-white h-16 flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold tracking-tight text-base">Mihret Agency</span>
            <span className="text-[9px] bg-brand-gold/15 text-brand-gold px-2 py-0.5 font-bold uppercase border border-brand-gold/30">ADMIN PORTAL</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="hidden md:inline font-mono text-white/60">Logged in as: <span className="text-brand-gold">{adminCreds.username}</span></span>
          
          <button
            onClick={() => onNavigate("home")}
            className="bg-white/10 hover:bg-white/15 px-3 py-1.5 transition-all flex items-center gap-1.5 cursor-pointer rounded"
          >
            <Eye className="size-3.5" />
            <span>View Site</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="bg-red-600/90 hover:bg-red-600 px-3 py-1.5 transition-all flex items-center gap-1.5 cursor-pointer rounded"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Panel Content (Two Columns: Editor on Left, Live Preview on Right) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-h-[calc(100vh-4rem)]">
        
        {/* LEFT COLUMN: EDITOR PANEL */}
        <div className="flex-1 flex flex-col overflow-y-auto border-r border-brand-border/40 bg-white">
          
          {/* CMS Controls Header */}
          <div className="sticky top-0 bg-white z-20 border-b border-brand-border/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-brand-navy flex items-center gap-2">
                <Layout className="size-5 text-brand-navy/60" />
                <span>Content Management Systems</span>
              </h2>
              <p className="text-xs text-brand-navy/50">Edit text and images live across all three languages</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector for Edit Input Fields */}
              <div className="flex rounded border border-brand-border p-1 bg-[#F5F7FB]">
                {(["en", "am", "ar"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setEditLang(lang)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded tracking-wider transition-all cursor-pointer ${
                      editLang === lang 
                        ? "bg-[#0E1A2C] text-white" 
                        : "text-brand-navy/60 hover:text-brand-navy"
                    }`}
                  >
                    {lang === "en" ? "English" : lang === "am" ? "Amharic" : "Arabic"}
                  </button>
                ))}
              </div>

              {/* SAVE CHANGES BUTTON */}
              <button
                onClick={saveAllChanges}
                className="bg-[#1ea0d1] hover:bg-[#158cb8] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Save className="size-4 animate-bounce" />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation Sidebar inside Editor */}
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            <div className="sm:w-52 shrink-0 border-r border-brand-border/30 bg-[#F5F7FB] flex flex-row sm:flex-col overflow-x-auto sm:overflow-x-visible p-2 sm:p-3 space-x-1 sm:space-x-0 sm:space-y-1">
              {[
                { id: "hero", label: "Hero & Top Line", icon: Layout },
                { id: "placements", label: "Destinations List", icon: Compass },
                { id: "about", label: "About Us Info", icon: FileText },
                { id: "services", label: "Our Services", icon: ClipboardCheck },
                { id: "values", label: "Core Values", icon: Heart },
                { id: "testimonials", label: "Testimonials", icon: MessageSquare },
                { id: "contact", label: "Contact & Location", icon: MapPin },
                { id: "tracker", label: "Pipeline Tracker", icon: Users },
                { id: "images", label: "Website Images", icon: Image },
                { id: "firebase", label: "Firebase Database", icon: Share2 },
                { id: "settings", label: "System Settings", icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center gap-2.5 px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded transition-all whitespace-nowrap cursor-pointer text-left w-full ${
                      isSelected 
                        ? "bg-[#0E1A2C] text-white shadow-sm" 
                        : "text-brand-navy/70 hover:bg-brand-border/20 hover:text-brand-navy"
                    }`}
                  >
                    <Icon className={`size-4 shrink-0 ${isSelected ? "text-brand-gold" : "text-brand-navy/40"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB INPUT FIELDS AREA */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {saveSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 rounded p-4 flex items-center gap-2.5 text-xs text-green-800 font-semibold animate-fade-in mb-4">
                  <CheckCircle className="size-4 text-green-600 animate-pulse" />
                  <span>Website content updated successfully! The live preview has refreshed automatically.</span>
                </div>
              )}

              {/* TAB 1: HERO SECTION */}
              {activeTab === "hero" && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold pb-2 border-b border-brand-border/40">Hero & Main Header Section</h3>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Hero Title ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.heroTitle || ""}
                        onChange={(e) => updateKey(editLang, "heroTitle", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Hero Subtitle ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.heroSub || ""}
                        onChange={(e) => updateKey(editLang, "heroSub", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold font-medium text-brand-gold"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Hero Description Text ({editLang.toUpperCase()})</label>
                      <textarea 
                        rows={4}
                        value={editedTrans[editLang]?.heroText || ""}
                        onChange={(e) => updateKey(editLang, "heroText", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Partner Button Label ({editLang.toUpperCase()})</label>
                        <input 
                          type="text"
                          value={editedTrans[editLang]?.partnerBtn || ""}
                          onChange={(e) => updateKey(editLang, "partnerBtn", e.target.value)}
                          className="w-full bg-white border border-brand-border rounded px-4 py-2 text-sm focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Worker Apply Button Label ({editLang.toUpperCase()})</label>
                        <input 
                          type="text"
                          value={editedTrans[editLang]?.applyBtn || ""}
                          onChange={(e) => updateKey(editLang, "applyBtn", e.target.value)}
                          className="w-full bg-white border border-brand-border rounded px-4 py-2 text-sm focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2 pt-4 border-t border-brand-border/30">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Hero Office Team Image URL (Desktop Aspect Ratio 4:5)</label>
                      <input 
                        type="text"
                        value={editedImages.heroTeam}
                        onChange={(e) => updateImgKey("heroTeam", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#1ea0d1] font-mono"
                      />
                      <p className="text-[10px] text-brand-navy/40">Provide a direct web link or reference to local asset (e.g. <code>/hero.jpg</code>)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PLACEMENTS / DESTINATIONS */}
              {activeTab === "placements" && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold pb-2 border-b border-brand-border/40">Destinations & Placement Locations</h3>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Destinations Header Strip Title ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.stripLabel || ""}
                        onChange={(e) => updateKey(editLang, "stripLabel", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold font-mono"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Official Section Title ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.destTitle || ""}
                        onChange={(e) => updateKey(editLang, "destTitle", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Official Section Blurb Description ({editLang.toUpperCase()})</label>
                      <textarea 
                        rows={3}
                        value={editedTrans[editLang]?.destText || ""}
                        onChange={(e) => updateKey(editLang, "destText", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    {/* SAUDI ARABIA PROFILE */}
                    <div className="border border-brand-border p-4 bg-brand-cream/20 space-y-4 rounded">
                      <h4 className="text-xs font-bold uppercase text-brand-gold border-b border-brand-border pb-1">Saudi Arabia Destination Details</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Key Placement City ({editLang.toUpperCase()})</label>
                          <input 
                            type="text"
                            value={editedTrans[editLang]?.destSaudiCity || (editLang === "en" ? "Dammam" : editLang === "am" ? "ዳማም" : "الدمام")}
                            onChange={(e) => updateKey(editLang, "destSaudiCity", e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Average Processing Turnaround ({editLang.toUpperCase()})</label>
                          <input 
                            type="text"
                            value={editedTrans[editLang]?.destSaudiTurnaround || (editLang === "en" ? "15 - 25 Days" : editLang === "am" ? "15 - 25 ቀናት" : "١٥ - ٢٥ يوماً")}
                            onChange={(e) => updateKey(editLang, "destSaudiTurnaround", e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Flight Duration from Addis ({editLang.toUpperCase()})</label>
                          <input 
                            type="text"
                            value={editedTrans[editLang]?.destSaudiFlightTime || (editLang === "en" ? "Approx. 3 hours, 15 minutes" : editLang === "am" ? "ወደ 3 ሰዓት ከ 15 ደቂቃ ያህል" : "حوالي ٣ ساعات و ١٥ دقيقة")}
                            onChange={(e) => updateKey(editLang, "destSaudiFlightTime", e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Saudi Skyline Image URL (Aspect ratio 8:3)</label>
                          <input 
                            type="text"
                            value={editedImages.destSaudi}
                            onChange={(e) => updateImgKey("destSaudi", e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Saudi Intro Blurb ({editLang.toUpperCase()})</label>
                        <input 
                          type="text"
                          value={editedTrans[editLang]?.destSaudiBlurb || (editLang === "en" ? "Long-standing partnerships with vetted households across the Kingdom." : editLang === "am" ? "በመላው የሳውዲ አረቢያ ግዛት ከተረጋገጡ ቤተሰቦች ጋር የቆየ ጠንካرا አጋርነት አለን።" : "شراكات طويلة الأمد وعلاقات ممتازة مع عائلات موثوقة في جميع أنحاء المملكة العربية السعودية.")}
                          onChange={(e) => updateKey(editLang, "destSaudiBlurb", e.target.value)}
                          className="w-full bg-white border border-brand-border rounded px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="grid gap-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Saudi Relationship Info ({editLang.toUpperCase()})</label>
                        <textarea 
                          rows={2}
                          value={editedTrans[editLang]?.destSaudiRelationship || (editLang === "en" ? "Established over a decade of direct, secure cooperation with top accredited offices." : editLang === "am" ? "ከፍተኛ እውቅና ካላቸው የስራ ቅጥር ቢሮዎች ጋር ከአስር አመት በላይ የታመነ ቀጥታ ስምምነት።" : "علاقة استراتيجية مباشرة مع كبرى مكاتب الاستقدام المعتمدة لأكثر من 10 سنوات.")}
                          onChange={(e) => updateKey(editLang, "destSaudiRelationship", e.target.value)}
                          className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* KUWAIT PROFILE */}
                    <div className="border border-brand-border p-4 bg-brand-cream/20 space-y-4 rounded">
                      <h4 className="text-xs font-bold uppercase text-brand-gold border-b border-brand-border pb-1">Kuwait Destination Details</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Key Placement City ({editLang.toUpperCase()})</label>
                          <input 
                            type="text"
                            value={editedTrans[editLang]?.destKuwaitCity || (editLang === "en" ? "Kuwait City" : editLang === "am" ? "ኩዌት ሲቲ" : "مدينة الكويت")}
                            onChange={(e) => updateKey(editLang, "destKuwaitCity", e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Average Processing Turnaround ({editLang.toUpperCase()})</label>
                          <input 
                            type="text"
                            value={editedTrans[editLang]?.destKuwaitTurnaround || (editLang === "en" ? "20 - 30 Days" : editLang === "am" ? "20 - 30 ቀናት" : "٢٠ - ٣٠ يوماً")}
                            onChange={(e) => updateKey(editLang, "destKuwaitTurnaround", e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Flight Duration from Addis ({editLang.toUpperCase()})</label>
                          <input 
                            type="text"
                            value={editedTrans[editLang]?.destKuwaitFlightTime || (editLang === "en" ? "Approx. 4 hours, 10 minutes" : editLang === "am" ? "ወደ 4 ሰዓት ከ 10 ደቂቃ ያህል" : "حوالي ٤ ساعات و ١٠ دقائق")}
                            onChange={(e) => updateKey(editLang, "destKuwaitFlightTime", e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Kuwait Skyline Image URL (Aspect ratio 8:3)</label>
                          <input 
                            type="text"
                            value={editedImages.destKuwait}
                            onChange={(e) => updateImgKey("destKuwait", e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Kuwait Intro Blurb ({editLang.toUpperCase()})</label>
                        <input 
                          type="text"
                          value={editedTrans[editLang]?.destKuwaitBlurb || (editLang === "en" ? "Established placement pipeline with families seeking experienced domestic staff." : editLang === "am" ? "ልምድ ያላቸውን የቤት ውስጥ ሰራተኞች ከሚፈልጉ ታማኝ ቤተሰቦች ጋር የተመሰረተ የስራ ትስስር።" : "مسار توظيف متكامل ومنظم لدى عائلات كويتية تبحث عن كوادر متميزة وخبيرة.")}
                          onChange={(e) => updateKey(editLang, "destKuwaitBlurb", e.target.value)}
                          className="w-full bg-white border border-brand-border rounded px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="grid gap-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Kuwait Relationship Info ({editLang.toUpperCase()})</label>
                        <textarea 
                          rows={2}
                          value={editedTrans[editLang]?.destKuwaitRelationship || (editLang === "en" ? "Direct recruitment partnership ensuring verified safety standards and supportive welfare." : editLang === "am" ? "የሰራተኞቻችንን መብትና ደህንነት የሚያረጋግጥ ቀጥተኛ የስራ ውል ስምምነት።" : "شراكة استقدام مباشرة تضمن معايير أمان عالية ورعاية مستمرة وشاملة.")}
                          onChange={(e) => updateKey(editLang, "destKuwaitRelationship", e.target.value)}
                          className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ABOUT US SECTION */}
              {activeTab === "about" && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold pb-2 border-b border-brand-border/40">About Us & Agency Mission</h3>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">About Title ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.aboutTitle || ""}
                        onChange={(e) => updateKey(editLang, "aboutTitle", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">About Subtitle ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.aboutSub || ""}
                        onChange={(e) => updateKey(editLang, "aboutSub", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">About Paragraph 1 ({editLang.toUpperCase()})</label>
                      <textarea 
                        rows={4}
                        value={editedTrans[editLang]?.aboutP1 || ""}
                        onChange={(e) => updateKey(editLang, "aboutP1", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold leading-relaxed"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Mission & Vision Text ({editLang.toUpperCase()})</label>
                      <textarea 
                        rows={6}
                        value={editedTrans[editLang]?.aboutP2 || ""}
                        onChange={(e) => updateKey(editLang, "aboutP2", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold leading-relaxed font-mono text-xs"
                      />
                    </div>

                    <div className="grid gap-2 pt-4 border-t border-brand-border/30">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Commitment Section Title ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.commitmentTitle || ""}
                        onChange={(e) => updateKey(editLang, "commitmentTitle", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2 text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Commitment Statement ({editLang.toUpperCase()})</label>
                      <textarea 
                        rows={3}
                        value={editedTrans[editLang]?.commitmentText || ""}
                        onChange={(e) => updateKey(editLang, "commitmentText", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="grid gap-2 pt-4 border-t border-brand-border/30">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">About Image URL (Aspect ratio 16:10)</label>
                      <input 
                        type="text"
                        value={editedImages.about}
                        onChange={(e) => updateImgKey("about", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: OUR SERVICES */}
              {activeTab === "services" && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold pb-2 border-b border-brand-border/40">Our Services List</h3>
                  
                  <div className="space-y-4">
                    <p className="text-xs text-brand-navy/50">Provide titles and descriptions for our 5 official service modules:</p>

                    {[
                      { key: "serviceHousemaids", descKey: "serviceHousemaidsDesc", label: "Service 1 (Placement)" },
                      { key: "serviceCleaners", descKey: "serviceCleanersDesc", label: "Service 2 (Vetting)" },
                      { key: "serviceCooks", descKey: "serviceCooksDesc", label: "Service 3 (Documentation)" },
                      { key: "serviceNannies", descKey: "serviceNanniesDesc", label: "Service 4 (Visa)" },
                      { key: "serviceCaregivers", descKey: "serviceCaregiversDesc", label: "Service 5 (Support)" },
                    ].map((srv, idx) => (
                      <div key={srv.key} className="p-4 border border-brand-border bg-[#F5F7FB] space-y-3 rounded">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold">{srv.label}</span>
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/50">Title ({editLang.toUpperCase()})</label>
                          <input 
                            type="text"
                            value={editedTrans[editLang]?.[srv.key] || ""}
                            onChange={(e) => updateKey(editLang, srv.key, e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/50">Short Summary ({editLang.toUpperCase()})</label>
                          <input 
                            type="text"
                            value={editedTrans[editLang]?.[srv.descKey] || ""}
                            onChange={(e) => updateKey(editLang, srv.descKey, e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="grid gap-2 pt-4 border-t border-brand-border/30">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Services Featured Image URL (Aspect ratio 4:3)</label>
                      <input 
                        type="text"
                        value={editedImages.ourServices}
                        onChange={(e) => updateImgKey("ourServices", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CORE VALUES, MISSION, VISION */}
              {activeTab === "values" && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold pb-2 border-b border-brand-border/40">Core Values, Mission & Vision Statement</h3>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Values Section Heading Text ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.valuesTitle || ""}
                        onChange={(e) => updateKey(editLang, "valuesTitle", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Values Heading Highlight Text ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.valuesTitleSpan || ""}
                        onChange={(e) => updateKey(editLang, "valuesTitleSpan", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold text-brand-gold"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-brand-border/30">
                      <div className="p-4 border border-brand-border bg-[#F5F7FB] space-y-3 rounded">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold">Our Vision Pillar</span>
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/50">Header Label ({editLang.toUpperCase()})</label>
                          <input 
                            type="text"
                            value={editedTrans[editLang]?.visionTitle || ""}
                            onChange={(e) => updateKey(editLang, "visionTitle", e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/50">Body Statement ({editLang.toUpperCase()})</label>
                          <textarea 
                            rows={3}
                            value={editedTrans[editLang]?.visionText || ""}
                            onChange={(e) => updateKey(editLang, "visionText", e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="p-4 border border-brand-border bg-[#F5F7FB] space-y-3 rounded">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold">Our Mission Pillar</span>
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/50">Header Label ({editLang.toUpperCase()})</label>
                          <input 
                            type="text"
                            value={editedTrans[editLang]?.missionTitle || ""}
                            onChange={(e) => updateKey(editLang, "missionTitle", e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/50">Body Statement ({editLang.toUpperCase()})</label>
                          <textarea 
                            rows={3}
                            value={editedTrans[editLang]?.missionText || ""}
                            onChange={(e) => updateKey(editLang, "missionText", e.target.value)}
                            className="w-full bg-white border border-brand-border rounded px-3 py-1 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-brand-border/30">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">5 Core Values Blocks</span>
                      
                      {[1, 2, 3, 4, 5].map((v) => (
                        <div key={v} className="p-4 border border-brand-border rounded bg-[#F5F7FB] space-y-3">
                          <span className="text-[9px] font-bold text-brand-gold">Value 0{v} Details</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-1">
                              <label className="text-[9px] font-medium text-brand-navy/55">Title ({editLang.toUpperCase()})</label>
                              <input 
                                type="text"
                                value={editedTrans[editLang]?.[`valueTitle${v}`] || ""}
                                onChange={(e) => updateKey(editLang, `valueTitle${v}`, e.target.value)}
                                className="w-full bg-white border border-brand-border rounded px-3 py-1 text-xs"
                              />
                            </div>
                            <div className="grid gap-1">
                              <label className="text-[9px] font-medium text-brand-navy/55">Body Description ({editLang.toUpperCase()})</label>
                              <input 
                                type="text"
                                value={editedTrans[editLang]?.[`valueBody${v}`] || ""}
                                onChange={(e) => updateKey(editLang, `valueBody${v}`, e.target.value)}
                                className="w-full bg-white border border-brand-border rounded px-3 py-1 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-2 pt-4 border-t border-brand-border/30">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Values Featured Image URL (Aspect square 1:1)</label>
                      <input 
                        type="text"
                        value={editedImages.ourValues}
                        onChange={(e) => updateImgKey("ourValues", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: TESTIMONIALS */}
              {activeTab === "testimonials" && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold pb-2 border-b border-brand-border/40">Worker & Client Testimonials</h3>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Testimonials Header Tag Title ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.testimonialsTitle || ""}
                        onChange={(e) => updateKey(editLang, "testimonialsTitle", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Testimonials Section Description ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.testimonialsSub || ""}
                        onChange={(e) => updateKey(editLang, "testimonialsSub", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Verified Badge Label ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.verified || ""}
                        onChange={(e) => updateKey(editLang, "verified", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-brand-border/30">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Edit 4 Individual Testimonials</span>

                      {[1, 2, 3, 4].map((tidx) => (
                        <div key={tidx} className="p-4 border border-brand-border rounded bg-[#F5F7FB] space-y-3">
                          <span className="text-[9px] font-bold text-brand-gold">Testimonial 0{tidx} Details</span>
                          <div className="grid gap-2">
                            <label className="text-[9px] font-medium text-brand-navy/50">Statement Text ({editLang.toUpperCase()})</label>
                            <textarea 
                              rows={2}
                              value={editedTrans[editLang]?.[`testimonial${tidx}`] || ""}
                              onChange={(e) => updateKey(editLang, `testimonial${tidx}`, e.target.value)}
                              className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-[9px] font-medium text-brand-navy/50">Author Role / Country Info ({editLang.toUpperCase()})</label>
                            <input 
                              type="text"
                              value={editedTrans[editLang]?.[`role${tidx}`] || ""}
                              onChange={(e) => updateKey(editLang, `role${tidx}`, e.target.value)}
                              className="w-full bg-white border border-brand-border rounded px-3 py-1 text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: CONTACT DETAILS & LOCATION */}
              {activeTab === "contact" && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold pb-2 border-b border-brand-border/40">Office Address & Contacts Panel</h3>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Visit Office Label ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.locationLabel || ""}
                        onChange={(e) => updateKey(editLang, "locationLabel", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Location Title ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.locationTitle || ""}
                        onChange={(e) => updateKey(editLang, "locationTitle", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Location Address Details ({editLang.toUpperCase()})</label>
                      <textarea 
                        rows={3}
                        value={editedTrans[editLang]?.locationAddress || ""}
                        onChange={(e) => updateKey(editLang, "locationAddress", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-border/30">
                      <div className="grid gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Get Directions Button ({editLang.toUpperCase()})</label>
                        <input 
                          type="text"
                          value={editedTrans[editLang]?.directionsBtn || ""}
                          onChange={(e) => updateKey(editLang, "directionsBtn", e.target.value)}
                          className="w-full bg-white border border-brand-border rounded px-4 py-2 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Contact Section Label ({editLang.toUpperCase()})</label>
                        <input 
                          type="text"
                          value={editedTrans[editLang]?.contactLabel || ""}
                          onChange={(e) => updateKey(editLang, "contactLabel", e.target.value)}
                          className="w-full bg-white border border-brand-border rounded px-4 py-2 text-sm focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Contact Main Slogan ({editLang.toUpperCase()})</label>
                      <input 
                        type="text"
                        value={editedTrans[editLang]?.contactTitle || ""}
                        onChange={(e) => updateKey(editLang, "contactTitle", e.target.value)}
                        className="w-full bg-white border border-brand-border rounded px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-border/30">
                      <div className="grid gap-2">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/50">Primary Contact Label ({editLang.toUpperCase()})</label>
                        <input 
                          type="text"
                          value={editedTrans[editLang]?.contactPrimary || ""}
                          onChange={(e) => updateKey(editLang, "contactPrimary", e.target.value)}
                          className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/50">Secondary Contact Label ({editLang.toUpperCase()})</label>
                        <input 
                          type="text"
                          value={editedTrans[editLang]?.contactSecondary || ""}
                          onChange={(e) => updateKey(editLang, "contactSecondary", e.target.value)}
                          className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/50">Email Support Label ({editLang.toUpperCase()})</label>
                        <input 
                          type="text"
                          value={editedTrans[editLang]?.contactEmail || ""}
                          onChange={(e) => updateKey(editLang, "contactEmail", e.target.value)}
                          className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: APPLICATIONS TRACKER DATABASE */}
              {activeTab === "tracker" && (
                <div className="space-y-6">
                  <div className="border-b border-brand-border/40 pb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold">Applicant Pipeline Database Manager</h3>
                    <p className="text-xs text-brand-navy/50 mt-1">Manage, add, and update real-time legal travel pipeline files for applicants</p>
                  </div>

                  {/* Add Candidate Form */}
                  <form onSubmit={handleAddCandidate} className="bg-brand-cream/30 border border-brand-border p-5 rounded space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block border-b border-brand-border pb-1">Create New Applicant File</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="grid gap-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/50">Passport Number (Uppercase)</label>
                        <input 
                          type="text"
                          value={newPassport}
                          onChange={(e) => setNewPassport(e.target.value)}
                          placeholder="EP1234567"
                          required
                          className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none font-mono uppercase"
                        />
                      </div>

                      <div className="grid gap-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/50">Candidate Full Name</label>
                        <input 
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Abebech Kebede"
                          required
                          className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="grid gap-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/50">Initial Pipeline Stage</label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full bg-white border border-brand-border rounded px-3 py-1.5 text-xs focus:outline-none font-medium text-brand-navy"
                        >
                          <option value="submitted">1. Applicant File Received</option>
                          <option value="doc_approved">2. Documents Verified</option>
                          <option value="interview">3. Assessment & Interview Scheduled</option>
                          <option value="matched">4. Matched with Gulf Household</option>
                          <option value="visa">5. Visa Issued & Approved</option>
                          <option value="ready">6. Ready for Departure (Transit)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#0E1A2C] hover:bg-brand-gold hover:text-brand-navy text-brand-cream px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="size-4" />
                      <span>Add Applicant to System</span>
                    </button>
                  </form>

                  {/* Candidates List table */}
                  <div className="space-y-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy/50">Registered Candidate Files ({candidates.length})</span>
                    
                    {candidates.length === 0 ? (
                      <p className="text-xs italic text-brand-navy/40 py-6 text-center border border-dashed border-brand-border rounded bg-white">No candidates are registered in the tracking pipeline. Add one above.</p>
                    ) : (
                      <div className="border border-brand-border rounded overflow-hidden shadow-sm bg-white">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#F5F7FB] border-b border-brand-border font-bold uppercase tracking-wider text-brand-navy/60 text-[9px]">
                              <th className="px-4 py-3">Passport No.</th>
                              <th className="px-4 py-3">Full Name</th>
                              <th className="px-4 py-3">Current Status</th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border/60">
                            {candidates.map((cand) => (
                              <tr key={cand.passport} className="hover:bg-brand-cream/10">
                                <td className="px-4 py-3 font-mono font-bold text-brand-navy/95">{cand.passport}</td>
                                <td className="px-4 py-3 font-medium text-brand-navy/85">{cand.name}</td>
                                <td className="px-4 py-3">
                                  <select
                                    value={cand.status}
                                    onChange={(e) => handleUpdateCandidateStatus(cand.passport, e.target.value)}
                                    className="bg-brand-cream/40 border border-brand-border/60 rounded px-2.5 py-1 text-xs focus:outline-none"
                                  >
                                    <option value="submitted">1. File Received</option>
                                    <option value="doc_approved">2. Docs Verified</option>
                                    <option value="interview">3. Interview Scheduled</option>
                                    <option value="matched">4. Matched Household</option>
                                    <option value="visa">5. Visa Approved</option>
                                    <option value="ready">6. Transit/Ready</option>
                                  </select>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    onClick={() => handleDeleteCandidate(cand.passport)}
                                    className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                                    title="Delete file"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 8.1: WEBSITE IMAGES MANAGER */}
              {activeTab === "images" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-brand-border/40 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold">Website Media & Visual Assets</h3>
                      <p className="text-xs text-brand-navy/50 mt-1">Manage, update, and preview all main photographic images displayed across the agency portal</p>
                    </div>
                    <button
                      onClick={saveAllChanges}
                      className="bg-brand-gold text-brand-navy text-xs font-bold uppercase tracking-wider px-4 py-2 rounded shadow hover:bg-brand-gold/90 transition cursor-pointer flex items-center gap-2 self-start sm:self-auto"
                    >
                      <Save className="size-3.5" />
                      Save Images
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hero Office Image */}
                    <div className="bg-white p-4 border border-brand-border rounded space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">1. Hero Section Banner</span>
                        <h4 className="text-xs font-semibold text-brand-navy">Office Team Presentation</h4>
                        <p className="text-[11px] text-brand-navy/55">Appears on the homepage next to the introductory agency copy (Recommended ratio 4:5).</p>
                        
                        <div className="relative group overflow-hidden bg-brand-cream/20 rounded border border-brand-border h-40 flex items-center justify-center">
                          <img 
                            src={editedImages.heroTeam || "/hero.jpg"} 
                            alt="Hero Team" 
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80" }}
                          />
                        </div>

                        <div className="grid gap-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Direct Image URL</label>
                          <input 
                            type="text"
                            value={editedImages.heroTeam}
                            onChange={(e) => updateImgKey("heroTeam", e.target.value)}
                            className="w-full bg-brand-cream/10 border border-brand-border rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-brand-border/30 space-y-1">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-brand-navy/30">Premium Suggestions:</span>
                        <div className="flex flex-wrap gap-1">
                          <button 
                            onClick={() => updateImgKey("heroTeam", "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80")}
                            className="text-[9px] bg-brand-cream/60 border border-brand-border px-2 py-0.5 rounded hover:bg-brand-gold hover:text-brand-navy transition"
                          >
                            Professional Staff
                          </button>
                          <button 
                            onClick={() => updateImgKey("heroTeam", "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80")}
                            className="text-[9px] bg-brand-cream/60 border border-brand-border px-2 py-0.5 rounded hover:bg-brand-gold hover:text-brand-navy transition"
                          >
                            Interactive Briefing
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* About Section Image */}
                    <div className="bg-white p-4 border border-brand-border rounded space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">2. About Us Section</span>
                        <h4 className="text-xs font-semibold text-brand-navy">Candidate Recruitment Story</h4>
                        <p className="text-[11px] text-brand-navy/55">Visual highlight representing integrity, trust, and our established agency history.</p>
                        
                        <div className="relative group overflow-hidden bg-brand-cream/20 rounded border border-brand-border h-40 flex items-center justify-center">
                          <img 
                            src={editedImages.about || "/about-us.jpg"} 
                            alt="About Us Story" 
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80" }}
                          />
                        </div>

                        <div className="grid gap-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Direct Image URL</label>
                          <input 
                            type="text"
                            value={editedImages.about}
                            onChange={(e) => updateImgKey("about", e.target.value)}
                            className="w-full bg-brand-cream/10 border border-brand-border rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-brand-border/30 space-y-1">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-brand-navy/30">Premium Suggestions:</span>
                        <div className="flex flex-wrap gap-1">
                          <button 
                            onClick={() => updateImgKey("about", "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80")}
                            className="text-[9px] bg-brand-cream/60 border border-brand-border px-2 py-0.5 rounded hover:bg-brand-gold hover:text-brand-navy transition"
                          >
                            Recruitment Interview
                          </button>
                          <button 
                            onClick={() => updateImgKey("about", "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80")}
                            className="text-[9px] bg-brand-cream/60 border border-brand-border px-2 py-0.5 rounded hover:bg-brand-gold hover:text-brand-navy transition"
                          >
                            Corporate Seminar
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Services Featured Image */}
                    <div className="bg-white p-4 border border-brand-border rounded space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">3. Our Services Section</span>
                        <h4 className="text-xs font-semibold text-brand-navy">Service Provision Landmark</h4>
                        <p className="text-[11px] text-brand-navy/55">Appears inside the custom services and training support visual columns (Ratio 4:3).</p>
                        
                        <div className="relative group overflow-hidden bg-brand-cream/20 rounded border border-brand-border h-40 flex items-center justify-center">
                          <img 
                            src={editedImages.ourServices || "/our-services.jpg"} 
                            alt="Our Services Illustration" 
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80" }}
                          />
                        </div>

                        <div className="grid gap-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Direct Image URL</label>
                          <input 
                            type="text"
                            value={editedImages.ourServices}
                            onChange={(e) => updateImgKey("ourServices", e.target.value)}
                            className="w-full bg-brand-cream/10 border border-brand-border rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-brand-border/30 space-y-1">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-brand-navy/30">Premium Suggestions:</span>
                        <div className="flex flex-wrap gap-1">
                          <button 
                            onClick={() => updateImgKey("ourServices", "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80")}
                            className="text-[9px] bg-brand-cream/60 border border-brand-border px-2 py-0.5 rounded hover:bg-brand-gold hover:text-brand-navy transition"
                          >
                            Caring Housekeeper
                          </button>
                          <button 
                            onClick={() => updateImgKey("ourServices", "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80")}
                            className="text-[9px] bg-brand-cream/60 border border-brand-border px-2 py-0.5 rounded hover:bg-brand-gold hover:text-brand-navy transition"
                          >
                            Nanny and Childcare
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Core Values Image */}
                    <div className="bg-white p-4 border border-brand-border rounded space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">4. Agency Core Values</span>
                        <h4 className="text-xs font-semibold text-brand-navy">Values & Code of Conduct</h4>
                        <p className="text-[11px] text-brand-navy/55">High contrast image highlighting premium domestic training, ethics, and values.</p>
                        
                        <div className="relative group overflow-hidden bg-brand-cream/20 rounded border border-brand-border h-40 flex items-center justify-center">
                          <img 
                            src={editedImages.ourValues || "/our-values.jpg"} 
                            alt="Our Values" 
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1521791136368-1a46827d0505?auto=format&fit=crop&w=800&q=80" }}
                          />
                        </div>

                        <div className="grid gap-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Direct Image URL</label>
                          <input 
                            type="text"
                            value={editedImages.ourValues}
                            onChange={(e) => updateImgKey("ourValues", e.target.value)}
                            className="w-full bg-brand-cream/10 border border-brand-border rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-brand-border/30 space-y-1">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-brand-navy/30">Premium Suggestions:</span>
                        <div className="flex flex-wrap gap-1">
                          <button 
                            onClick={() => updateImgKey("ourValues", "https://images.unsplash.com/photo-1521791136368-1a46827d0505?auto=format&fit=crop&w=800&q=80")}
                            className="text-[9px] bg-brand-cream/60 border border-brand-border px-2 py-0.5 rounded hover:bg-brand-gold hover:text-brand-navy transition"
                          >
                            Ethical Handshake
                          </button>
                          <button 
                            onClick={() => updateImgKey("ourValues", "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80")}
                            className="text-[9px] bg-brand-cream/60 border border-brand-border px-2 py-0.5 rounded hover:bg-brand-gold hover:text-brand-navy transition"
                          >
                            Digital Integrity
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Saudi Arabia landmark Image */}
                    <div className="bg-white p-4 border border-brand-border rounded space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">5. Saudi Arabia Placements</span>
                        <h4 className="text-xs font-semibold text-brand-navy">Riyadh Skyline Highlight</h4>
                        <p className="text-[11px] text-brand-navy/55">Scenic landmark backdrop representing our luxury household deployments in KSA.</p>
                        
                        <div className="relative group overflow-hidden bg-brand-cream/20 rounded border border-brand-border h-40 flex items-center justify-center">
                          <img 
                            src={editedImages.destSaudi || "/dest-saudi.jpg"} 
                            alt="Saudi Arabia Landmark" 
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1586724230021-a59e9539fad5?auto=format&fit=crop&w=800&q=80" }}
                          />
                        </div>

                        <div className="grid gap-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Direct Image URL</label>
                          <input 
                            type="text"
                            value={editedImages.destSaudi}
                            onChange={(e) => updateImgKey("destSaudi", e.target.value)}
                            className="w-full bg-brand-cream/10 border border-brand-border rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-brand-border/30 space-y-1">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-brand-navy/30">Premium Suggestions:</span>
                        <div className="flex flex-wrap gap-1">
                          <button 
                            onClick={() => updateImgKey("destSaudi", "https://images.unsplash.com/photo-1586724230021-a59e9539fad5?auto=format&fit=crop&w=800&q=80")}
                            className="text-[9px] bg-brand-cream/60 border border-brand-border px-2 py-0.5 rounded hover:bg-brand-gold hover:text-brand-navy transition"
                          >
                            KSA Sunset View
                          </button>
                          <button 
                            onClick={() => updateImgKey("destSaudi", "https://images.unsplash.com/photo-1582233479051-2d7c5f87b8db?auto=format&fit=crop&w=800&q=80")}
                            className="text-[9px] bg-brand-cream/60 border border-brand-border px-2 py-0.5 rounded hover:bg-brand-gold hover:text-brand-navy transition"
                          >
                            Kingdom Centre Tower
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Kuwait landmark Image */}
                    <div className="bg-white p-4 border border-brand-border rounded space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">6. Kuwait Placements</span>
                        <h4 className="text-xs font-semibold text-brand-navy">Kuwait City Towers Skyline</h4>
                        <p className="text-[11px] text-brand-navy/55">Iconic landmark backdrop representing elite household deployments in Kuwait.</p>
                        
                        <div className="relative group overflow-hidden bg-brand-cream/20 rounded border border-brand-border h-40 flex items-center justify-center">
                          <img 
                            src={editedImages.destKuwait || "/dest-kuwait.jpg"} 
                            alt="Kuwait Landmark" 
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80" }}
                          />
                        </div>

                        <div className="grid gap-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/40">Direct Image URL</label>
                          <input 
                            type="text"
                            value={editedImages.destKuwait}
                            onChange={(e) => updateImgKey("destKuwait", e.target.value)}
                            className="w-full bg-brand-cream/10 border border-brand-border rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-brand-border/30 space-y-1">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-brand-navy/30">Premium Suggestions:</span>
                        <div className="flex flex-wrap gap-1">
                          <button 
                            onClick={() => updateImgKey("destKuwait", "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80")}
                            className="text-[9px] bg-brand-cream/60 border border-brand-border px-2 py-0.5 rounded hover:bg-brand-gold hover:text-brand-navy transition"
                          >
                            Kuwait Towers Blue
                          </button>
                          <button 
                            onClick={() => updateImgKey("destKuwait", "https://images.unsplash.com/photo-1618245472895-6f81e847be15?auto=format&fit=crop&w=800&q=80")}
                            className="text-[9px] bg-brand-cream/60 border border-brand-border px-2 py-0.5 rounded hover:bg-brand-gold hover:text-brand-navy transition"
                          >
                            Kuwait Bay Landmark
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-cream/30 border border-brand-border p-4 rounded text-xs text-brand-navy/60">
                    <span className="font-bold text-brand-gold block mb-1">Image Hosting Pro Tip:</span>
                    To host and display your own custom agency imagery, upload your files to free public image platforms such as <strong className="text-brand-navy">Unsplash, Imgur, Postimages, or Google Drive (Share {"->"} Anyone with link {"->"} Direct Link export)</strong>, and copy paste the <strong className="text-brand-navy">Direct Link</strong> (.jpg or .png format) directly into these fields.
                  </div>
                </div>
              )}

              {/* TAB 8.2: FIREBASE DATABASE CONNECTOR */}
              {activeTab === "firebase" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-brand-border/40 pb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold">Cloud Database & Persistence Engine</h3>
                    <p className="text-xs text-brand-navy/50 mt-1">Upgrade your portal database from temporary local browser cookies to Google Cloud Firebase Firestore</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Status card */}
                    <div className="lg:col-span-1 space-y-4">
                      <div className="bg-[#0E1A2C] text-white p-5 rounded border border-[#1E2E44] space-y-4 relative overflow-hidden">
                        <div className="absolute right-[-10px] top-[-10px] opacity-10">
                          <Share2 className="size-36" />
                        </div>

                        <span className="text-[9px] font-bold uppercase tracking-widest text-brand-gold block">Engine Connection Status</span>
                        
                        {isFirebaseEnabled ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                              <span className="size-2 rounded-full bg-green-400 animate-pulse" />
                              <span>Live Cloud Mode Active</span>
                            </div>
                            <p className="text-xs text-slate-300/80 leading-relaxed">
                              Your candidate pipeline, customized layouts, and website text translations are syncing directly with your secure Google Firestore cluster.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-brand-gold font-bold text-sm">
                              <span className="size-2 rounded-full bg-brand-gold" />
                              <span>Offline Local Mode</span>
                            </div>
                            <p className="text-xs text-slate-300/85 leading-relaxed">
                              You are currently in developer preview sandbox. All changes are stored locally in this browser. Configure Firebase to store data in the cloud!
                            </p>
                          </div>
                        )}

                        <div className="pt-4 border-t border-[#1E2E44] text-[11px] space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Database Engine:</span>
                            <span className="font-semibold text-brand-gold">{isFirebaseEnabled ? "Firestore" : "Browser Storage"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Active Pipeline:</span>
                            <span className="font-semibold">{candidates.length} Files</span>
                          </div>
                          {isFirebaseEnabled && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Cloud Sync:</span>
                              <span className="text-green-400 font-semibold">Synced ✓</span>
                            </div>
                          )}
                        </div>

                        {isFirebaseEnabled && (
                          <button
                            onClick={handleDisconnectFirebase}
                            className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-300 text-[10px] font-bold uppercase tracking-wider py-2 rounded transition cursor-pointer"
                          >
                            Disconnect Cloud Database
                          </button>
                        )}
                      </div>

                      <div className="bg-brand-cream/20 border border-brand-border p-4 rounded text-xs space-y-2">
                        <span className="font-bold text-brand-gold uppercase tracking-wider text-[10px] block">Benefits of Cloud Firestore</span>
                        <ul className="list-disc pl-4 space-y-1 text-brand-navy/70">
                          <li>Access records from anywhere, on any device</li>
                          <li>Allows multiple admins to operate the panel in sync</li>
                          <li>Secure password authentication protection</li>
                          <li>No data loss if you clear browser cookies or history</li>
                        </ul>
                      </div>
                    </div>

                    {/* Setup / Config Paste form */}
                    <div className="lg:col-span-2 bg-white border border-brand-border p-5 rounded space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block border-b border-brand-border pb-1">Connect Your Own Firebase Instance</span>
                      
                      <p className="text-xs text-brand-navy/60">
                        To link this portal to your production Firebase database and transition to live cloud operations, paste your <strong className="text-brand-navy">Firebase Web App Configuration Object</strong> (JSON) below:
                      </p>

                      <form onSubmit={handleSaveFirebaseConfig} className="space-y-4">
                        <div className="grid gap-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/55">Firebase Config JSON block</label>
                            <span className="text-[9px] font-mono text-brand-navy/35">Format: JSON object</span>
                          </div>
                          <textarea
                            value={firebaseConfigInput}
                            onChange={(e) => setFirebaseConfigInput(e.target.value)}
                            rows={8}
                            className="w-full bg-[#0E1A2C] text-[#86C2FF] border border-[#1E2E44] rounded p-3 text-xs font-mono focus:outline-none focus:border-brand-gold"
                            placeholder={`{
  "apiKey": "AIzaSy...",
  "authDomain": "...",
  "projectId": "...",
  ...
}`}
                          />
                        </div>

                        {firebaseConnectStatus === "error" && (
                          <div className="bg-red-500/10 border border-red-500/30 text-red-700 p-3 rounded text-xs font-semibold flex items-center gap-2">
                            <AlertCircle className="size-4 shrink-0" />
                            <span>{firebaseConnectError}</span>
                          </div>
                        )}

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={firebaseConnectStatus === "testing"}
                            className="bg-[#0E1A2C] text-white hover:bg-brand-navy text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow cursor-pointer transition flex items-center gap-2"
                          >
                            {firebaseConnectStatus === "testing" ? (
                              <>
                                <RefreshCw className="size-3.5 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Share2 className="size-3.5" />
                                Save & Connect Firebase
                              </>
                            )}
                          </button>
                        </div>
                      </form>

                      <div className="border-t border-brand-border/40 pt-4 space-y-2">
                        <span className="font-bold text-[10px] text-brand-navy uppercase tracking-wider block">Step-By-Step Setup Instructions:</span>
                        <ol className="list-decimal pl-4 space-y-1.5 text-xs text-brand-navy/70">
                          <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline font-semibold">Firebase Console</a> and click <strong>Create a project</strong>.</li>
                          <li>Click on the <strong>Web icon (&lt;/&gt;)</strong> to register a new Web App. Give it a name (e.g. <em>mihret-agency</em>).</li>
                          <li>Copy the <code>firebaseConfig</code> dictionary object shown on the screen and paste it into the JSON editor above.</li>
                          <li>In the Firebase sidebar, click <strong>Firestore Database</strong> and click <strong>Create Database</strong>. Choose your location and start in Test/Production mode.</li>
                          <li>Deploy the <code>firestore.rules</code> file provided in this project root to secure the database.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: SYSTEM SETTINGS (PASSWORD & BACKUPS) */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold pb-2 border-b border-brand-border/40">Portal Settings & System Access Control</h3>
                  
                  {/* Change Username */}
                  <form onSubmit={handleChangeUsername} className="p-5 border border-brand-border bg-[#F5F7FB] space-y-4 rounded">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/60 block border-b border-brand-border/40 pb-1">Change Administrative Username</span>
                    
                    {userError && <div className="text-xs text-red-600 font-semibold">{userError}</div>}
                    {userSuccess && <div className="text-xs text-green-700 font-semibold">{userSuccess}</div>}

                    <div className="grid gap-2">
                      <label className="text-[9px] font-bold uppercase text-brand-navy/40">New Username / Email Address</label>
                      <input 
                        type="text"
                        value={newAdminUser}
                        onChange={(e) => setNewAdminUser(e.target.value)}
                        placeholder="admin@mihretagency"
                        required
                        className="w-full bg-white border border-brand-border rounded px-4 py-2 text-sm font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#0E1A2C] text-white hover:bg-brand-gold hover:text-brand-navy px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer"
                    >
                      Update Access Username
                    </button>
                  </form>

                  {/* Change Password */}
                  <form onSubmit={handleChangePassword} className="p-5 border border-brand-border bg-[#F5F7FB] space-y-4 rounded">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/60 block border-b border-brand-border/40 pb-1">Change Portal Password</span>
                    
                    {passError && <div className="text-xs text-red-600 font-semibold">{passError}</div>}
                    {passSuccess && <div className="text-xs text-green-700 font-semibold">{passSuccess}</div>}

                    <div className="grid gap-2">
                      <label className="text-[9px] font-bold uppercase text-brand-navy/40">Current Password</label>
                      <input 
                        type="password"
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        required
                        className="w-full bg-white border border-brand-border rounded px-4 py-2 text-sm font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-[9px] font-bold uppercase text-brand-navy/40">New Secure Password</label>
                        <input 
                          type="password"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          required
                          className="w-full bg-white border border-brand-border rounded px-4 py-2 text-sm font-mono"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-[9px] font-bold uppercase text-brand-navy/40">Confirm New Password</label>
                        <input 
                          type="password"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          required
                          className="w-full bg-white border border-brand-border rounded px-4 py-2 text-sm font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#0E1A2C] text-white hover:bg-brand-gold hover:text-brand-navy px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer"
                    >
                      Update Password Securely
                    </button>
                  </form>

                  {/* Export & Import backup */}
                  <div className="p-5 border border-brand-border bg-white space-y-4 rounded shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/60 block border-b border-brand-border/40 pb-1">Data Backups (Export & Import)</span>
                    <p className="text-xs text-brand-navy/50">Save or load your customized text content, images, and candidates database as a local JSON file.</p>
                    
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={handleExportJSON}
                        className="bg-brand-cream border border-brand-border hover:bg-brand-border/20 text-brand-navy px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="size-4" />
                        <span>Export Backup JSON</span>
                      </button>

                      <label className="bg-brand-cream border border-brand-border hover:bg-brand-border/20 text-brand-navy px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer">
                        <Upload className="size-4" />
                        <span>Import Backup JSON</span>
                        <input 
                          type="file" 
                          accept=".json" 
                          onChange={handleImportJSON} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>

                  {/* Reset Defaults */}
                  <div className="p-5 border border-red-500/20 bg-red-500/5 space-y-3 rounded">
                    <span className="text-[10px] font-bold uppercase text-red-800 tracking-wider block border-b border-red-500/10 pb-1">Destructive Actions Zone</span>
                    <p className="text-xs text-brand-navy/60">Restore website text copy, translations, and image urls back to original factory defaults.</p>
                    <button
                      onClick={resetToFactoryDefaults}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer"
                    >
                      Reset Entire Website Content
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC LIVE PREVIEW PANEL */}
        {showPreviewPane && (
          <div className="hidden lg:flex w-[45%] shrink-0 flex-col bg-[#122B63]/10 border-l border-brand-border/50">
            <div className="bg-[#0E1A2C] text-white px-5 py-3 h-14 flex items-center justify-between border-b border-brand-border/30">
              <div className="flex items-center gap-2">
                <Eye className="size-4 text-brand-gold" />
                <span className="text-xs font-bold uppercase tracking-wider">Dynamic Live Preview</span>
              </div>

              {/* Preview Language Toggles */}
              <div className="flex items-center gap-2.5">
                <div className="flex bg-[#122B63] p-0.5 rounded border border-brand-border/30">
                  {(["en", "am", "ar"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setPreviewLang(lang)}
                      className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded transition-all cursor-pointer ${
                        previewLang === lang 
                          ? "bg-brand-gold text-brand-navy" 
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated Frame Container */}
            <div className="flex-1 p-4 overflow-y-auto bg-brand-cream/40 flex items-start justify-center">
              <div className="w-full bg-white shadow-xl border border-brand-border rounded-lg overflow-hidden min-h-[750px] relative">
                
                {/* Browser address bar mockup */}
                <div className="bg-[#F5F7FB] border-b border-brand-border px-4 py-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 bg-white border border-brand-border/60 rounded px-3 py-0.5 text-[10px] text-brand-navy/40 font-mono select-none truncate">
                    https://mihretagency.com/
                  </div>
                </div>

                {/* Live component renders here with edited translations & edited images! */}
                <div className="preview-scale-container" dir={previewLang === "ar" ? "rtl" : "ltr"}>
                  <Home 
                    language={previewLang} 
                    onNavigate={() => {}} 
                    translationsState={editedTrans}
                    images={editedImages}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
