import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Type, 
  Hash, 
  FileText, 
  Clock, 
  Mic, 
  Trash2, 
  Copy, 
  Sun, 
  Moon, 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink,
  Check,
  ChevronDown,
  Code,
  Terminal,
  Cpu,
  Menu,
  X,
  Home,
  Layers,
  User,
  Send,
  Info
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Types ---
interface Stats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
}

// --- Components ---

const StatCard = ({ icon: Icon, label, value, description }: { icon: any, label: string, value: number | string, description?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5">
        <Icon size={18} className="text-black/60 dark:text-white/60" />
      </div>
      <span className="text-xs font-medium uppercase tracking-wider opacity-50">{label}</span>
    </div>
    <div className="text-2xl font-bold tracking-tight">{value}</div>
    {description && <div className="text-[10px] mt-1 opacity-40 uppercase tracking-widest">{description}</div>}
  </motion.div>
);

const NavLink = ({ href, icon: Icon, children, onClick }: { href: string, icon: any, children: React.ReactNode, onClick?: () => void }) => (
  <motion.a
    href={href}
    onClick={onClick}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium"
  >
    <Icon size={16} className="opacity-50" />
    <span>{children}</span>
  </motion.a>
);

export default function App() {
  const [text, setText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeveloperProfile, setShowDeveloperProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // --- Dark Mode Logic ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Word Counter Logic ---
  const stats = useMemo((): Stats => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n+/).filter(Boolean).length;
    
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);

    return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTime, speakingTime };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCase = (type: 'upper' | 'lower' | 'title' | 'sentence') => {
    if (!text) return;
    let newText = text;
    switch (type) {
      case 'upper': newText = text.toUpperCase(); break;
      case 'lower': newText = text.toLowerCase(); break;
      case 'title': 
        newText = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        break;
      case 'sentence':
        newText = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
    }
    setText(newText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const menuVariants = {
    closed: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
    open: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative w-10 h-10 bg-slate-800 dark:bg-slate-200 rounded-full flex items-center justify-center overflow-hidden transition-all duration-700 hover:scale-110">
              <Terminal size={22} className="text-white dark:text-black grayscale" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-white/20 dark:border-black/20 rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-xl leading-none text-black dark:text-white">MOHSIN</span>
              <span className="text-[10px] font-bold tracking-[0.2em] opacity-40 uppercase">Words & Systems</span>
            </div>
          </motion.div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            <NavLink href="#home" icon={Home}>Home</NavLink>
            <NavLink href="#count" icon={Layers}>Count</NavLink>
            <NavLink href="#" onClick={() => setShowDeveloperProfile(true)} icon={User}>Developer</NavLink>
            <NavLink href="#about" icon={Info}>About</NavLink>
            <NavLink href="#contact" icon={Send}>Contact</NavLink>
          </div>

          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ rotate: 180 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-black dark:text-white"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <a 
              href="https://github.com/gforg5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-sm font-bold hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="lg:hidden absolute top-full left-0 right-0 border-b border-black/5 dark:border-white/5 bg-white dark:bg-black p-6 space-y-2 shadow-2xl"
            >
              {[
                { href: "#home", icon: Home, label: "Home" },
                { href: "#count", icon: Layers, label: "Count" },
                { href: "#", icon: User, label: "Developer", onClick: () => setShowDeveloperProfile(true) },
                { href: "#about", icon: Info, label: "About" },
                { href: "#contact", icon: Send, label: "Contact" }
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  variants={itemVariants}
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (item.onClick) item.onClick();
                  }}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black dark:text-white font-bold"
                >
                  <item.icon size={20} className="opacity-40" />
                  {item.label}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- Developer Profile Overlay --- */}
      <AnimatePresence>
        {showDeveloperProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-white/40 dark:bg-black/40 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 sm:p-12 rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-black shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(255,255,255,0.05)]"
            >
              <button 
                onClick={() => setShowDeveloperProfile(false)}
                className="absolute top-8 right-8 p-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
              >
                <X size={24} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="order-2 lg:order-1">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-1 px-1 bg-black/20 dark:bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ x: [-40, 40] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full bg-black dark:bg-white"
                      />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest opacity-40 text-black dark:text-white">Developer Profile</span>
                  </div>
                  
                  <h2 className="text-5xl sm:text-6xl font-black tracking-tighter leading-none mb-8 text-black dark:text-white">
                    Sayed Mohsin Ali
                  </h2>
                  
                  <div className="space-y-6 mb-10">
                    <p className="text-lg opacity-60 leading-relaxed text-black dark:text-white">
                      Systems Developer specializing in high-performance computing, 
                      embedded architecture, and elegant full-stack solutions. 
                      I transform complex problems into streamlined digital experiences.
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      {['Rust', 'C++', 'Embedded', 'React', 'Node.js', 'System Arch'].map(skill => (
                        <span key={skill} className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs font-bold font-mono text-black dark:text-white">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <motion.a 
                      href="mailto:goodforg555@gmail.com"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold shadow-xl"
                    >
                      <Mail size={20} />
                      <span>Hire Me</span>
                    </motion.a>
                    <div className="flex gap-2">
                      <motion.a 
                        href="#" 
                        whileHover={{ y: -5 }}
                        className="p-4 rounded-2xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black dark:text-white"
                      >
                        <Linkedin size={20} />
                      </motion.a>
                      <motion.a 
                        href="https://github.com/gforg5" 
                        whileHover={{ y: -5 }}
                        className="p-4 rounded-2xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black dark:text-white"
                      >
                        <Github size={20} />
                      </motion.a>
                    </div>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <motion.div
                    initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
                    whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="relative group/img"
                  >
                    <div className="relative aspect-square rounded-full overflow-hidden border-8 border-black/5 dark:border-white/5 shadow-2xl transform-gpu transition-all duration-700 group-hover/img:scale-[1.02]">
                      <motion.img 
                        animate={{ 
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ 
                          duration: 15, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        src="https://raw.githubusercontent.com/gforg5/Nano-Lens/refs/heads/main/1769069098374.png" 
                        alt="Sayed Mohsin Ali"
                        className="w-full h-full object-cover grayscale"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <div className="text-white">
                          <p className="text-xs font-black uppercase tracking-widest mb-1">Systems Developer</p>
                          <p className="text-xl font-bold">Sayed Mohsin Ali</p>
                        </div>
                      </div>
                    </div>
                    <motion.div 
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-6 -right-6 p-4 rounded-2xl bg-white dark:bg-black shadow-2xl border border-black/5 dark:border-white/5"
                    >
                      <Cpu size={24} className="text-blue-500" />
                    </motion.div>
                    <motion.div 
                      animate={{ y: [0, 15, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-white dark:bg-black shadow-2xl border border-black/5 dark:border-white/5"
                    >
                      <Code size={24} className="text-purple-500" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-black dark:text-white">
        
        {/* --- Hero Section --- */}
        <section id="home" className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Systems Developer Portfolio
            </div>
            <h1 className="text-7xl sm:text-9xl font-black tracking-tighter leading-[0.85] mb-8">
              MOHSIN <br />
              <span className="opacity-20">WORDS</span>
            </h1>
            <p className="text-xl opacity-50 max-w-2xl mx-auto leading-relaxed">
              Precision-engineered text analysis and high-performance system architecture. 
              Built for developers who demand excellence.
            </p>
          </motion.div>
        </section>

        {/* --- Word Counter Tool --- */}
        <section id="count" className="space-y-12 scroll-mt-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-black tracking-tighter mb-3">Text Analysis</h2>
              <p className="opacity-40 text-sm font-medium">Precision metrics for professional content.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5"
            >
              {[
                { label: 'Upper', type: 'upper' },
                { label: 'Lower', type: 'lower' },
                { label: 'Title', type: 'title' },
                { label: 'Sentence', type: 'sentence' }
              ].map((btn) => (
                <button 
                  key={btn.type}
                  onClick={() => handleCase(btn.type as any)}
                  className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-black hover:shadow-md transition-all active:scale-95"
                >
                  {btn.label}
                </button>
              ))}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
            {/* Input Area */}
            <div className="xl:col-span-3 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Drop your content here..."
                  className="w-full h-[500px] p-10 rounded-[3rem] border border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] focus:bg-transparent focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 outline-none transition-all resize-none font-mono text-xl leading-relaxed text-black dark:text-white shadow-inner"
                />
                <div className="absolute top-8 right-8 flex gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopy}
                    className="p-4 rounded-2xl bg-white dark:bg-black border border-black/10 dark:border-white/10 shadow-xl text-black dark:text-white"
                  >
                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setText('')}
                    className="p-4 rounded-2xl bg-white dark:bg-black border border-black/10 dark:border-white/10 shadow-xl text-red-500"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Stats Sidebar */}
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
              <StatCard icon={Type} label="Words" value={stats.words} />
              <StatCard icon={Hash} label="Characters" value={stats.characters} description="Total" />
              <StatCard icon={Hash} label="Clean" value={stats.charactersNoSpaces} description="No Spaces" />
              <StatCard icon={FileText} label="Sentences" value={stats.sentences} />
              <StatCard icon={FileText} label="Paragraphs" value={stats.paragraphs} />
              <StatCard icon={Clock} label="Reading" value={`${stats.readingTime}m`} />
              <StatCard icon={Mic} label="Speaking" value={`${stats.speakingTime}m`} />
            </div>
          </div>
        </section>

        {/* --- About Section --- */}
        <section id="about" className="mb-32 scroll-mt-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl font-black tracking-tighter mb-10 leading-none">
                Engineering <br />
                <span className="opacity-20">The Future.</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <Terminal size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Systems Architecture</h4>
                    <p className="opacity-50 text-sm leading-relaxed">
                      Designing robust, scalable backends that power modern digital infrastructures with zero compromise on speed.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Hardware Integration</h4>
                    <p className="opacity-50 text-sm leading-relaxed">
                      Bridging the gap between software and hardware through optimized embedded systems and low-level programming.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-8 flex flex-col justify-end">
                  <span className="text-4xl font-black mb-2">99%</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Efficiency Rate</span>
                </div>
                <div className="aspect-square rounded-3xl bg-black dark:bg-white p-8 flex flex-col justify-end">
                  <span className="text-4xl font-black text-white dark:text-black mb-2">50+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-white/50 dark:text-black/50">Projects Done</span>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-square rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-8 flex flex-col justify-end">
                  <span className="text-4xl font-black mb-2">0ms</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Latency Target</span>
                </div>
                <div className="aspect-[4/5] rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-8 flex flex-col justify-end">
                  <span className="text-4xl font-black mb-2">24/7</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Support Ready</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- Contact Section --- */}
        <section id="contact" className="scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 sm:p-20 rounded-[3rem] bg-black text-white dark:bg-white dark:text-black text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
            <h2 className="text-5xl sm:text-7xl font-black tracking-tighter mb-8 relative z-10">
              Let's Build <br />
              Something Iconic.
            </h2>
            <p className="text-lg opacity-50 max-w-xl mx-auto mb-12 relative z-10">
              Ready to elevate your next project? Reach out for collaborations, 
              consultations, or just to talk tech.
            </p>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div 
                  whileFocus={{ scale: 1.02 }}
                  className="relative"
                >
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 outline-none transition-all text-white dark:text-black placeholder:opacity-30"
                  />
                </motion.div>
                <motion.div 
                  whileFocus={{ scale: 1.02 }}
                  className="relative"
                >
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 outline-none transition-all text-white dark:text-black placeholder:opacity-30"
                  />
                </motion.div>
              </div>
              <motion.div 
                whileFocus={{ scale: 1.01 }}
                className="relative"
              >
                <textarea
                  required
                  rows={4}
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 outline-none transition-all text-white dark:text-black placeholder:opacity-30 resize-none"
                />
              </motion.div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting || isSuccess}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl font-black text-lg shadow-2xl transition-all duration-500",
                  isSuccess 
                    ? "bg-green-500 text-white" 
                    : "bg-white text-black dark:bg-black dark:text-white"
                )}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, rotate: 0 }}
                      animate={{ opacity: 1, rotate: 360 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Terminal size={24} />
                    </motion.div>
                  ) : isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={24} />
                      <span>Sent Successfully</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3"
                    >
                      <Send size={24} />
                      <span>Send Message</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </motion.div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="py-20 border-t border-black/5 dark:border-white/5 text-black dark:text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-800 dark:bg-slate-200 rounded-full flex items-center justify-center">
                  <Terminal size={22} className="text-white dark:text-black grayscale" />
                </div>
                <span className="font-black tracking-tighter text-xl">MOHSIN</span>
              </div>
              <p className="text-sm opacity-40 leading-relaxed">
                Precision tools and high-performance systems for the modern developer. 
                Built with passion by Sayed Mohsin Ali.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest opacity-20">Navigation</h5>
                <ul className="space-y-2 text-sm font-bold">
                  <li><a href="#home" className="hover:opacity-50 transition-opacity">Home</a></li>
                  <li><a href="#count" className="hover:opacity-50 transition-opacity">Count</a></li>
                  <li><a href="#developer" className="hover:opacity-50 transition-opacity">Developer</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest opacity-20">Social</h5>
                <ul className="space-y-2 text-sm font-bold">
                  <li><a href="https://github.com/gforg5" className="hover:opacity-50 transition-opacity">GitHub</a></li>
                  <li><a href="#" className="hover:opacity-50 transition-opacity">LinkedIn</a></li>
                  <li><a href="#" className="hover:opacity-50 transition-opacity">Twitter</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest opacity-20">Contact</h5>
                <ul className="space-y-2 text-sm font-bold">
                  <li><a href="mailto:goodforg555@gmail.com" className="hover:opacity-50 transition-opacity">Email</a></li>
                  <li><span className="opacity-50">Remote / Global</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-black/5 dark:border-white/5">
            <div className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Sayed Mohsin Ali. All rights reserved.
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">Privacy</a>
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">Terms</a>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-30">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Live
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* --- Background Elements --- */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-black/5 dark:bg-white/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-black/5 dark:bg-white/5 rounded-full blur-[120px] animate-pulse" />
      </div>

    </div>
  );
}
