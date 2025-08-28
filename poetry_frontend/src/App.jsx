import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import './App.css';

// ===== 🌟 Animation Variants (کامل و دقیق برای Framer Motion) 🌟 =====
const pageTransition = {
  duration: 0.5,
  ease: "easeInOut"
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...pageTransition,
      when: "beforeChildren",
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 14, duration: 0.4 } 
  }
};

const mainButtonVariants = {
  initial: { opacity: 0, y: 20 }, 
  animate: { opacity: 1, y: 0, transition: { delay: 0.5, type: 'spring', stiffness: 120 }}, 
  hover: {
    scale: 1.03,
    boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.4)",
    transition: { duration: 0.2, yoyo: Infinity }
  },
  tap: { scale: 0.97, transition: { duration: 0.1 } }
};

const interactionButtonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 0px 12px rgba(52, 152, 219, 0.7)", 
    transition: { duration: 0.15 }
  },
  tap: { scale: 0.95, transition: { duration: 0.1 } }
};

const poemAreaVariants = {
  hidden: { opacity: 0, height: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    height: 'auto',
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: "easeOut", 
      when: "beforeChildren", 
      staggerChildren: 0.06 
    }
  },
  exit: { 
    opacity: 0, 
    height: 0, 
    y: -30, 
    scale: 0.95,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

const poemLineVariants = {
  hidden: { opacity: 0, x: -25 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const errorVariants = {
  hidden: { opacity: 0, y: -15, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 15, stiffness:200 } },
  exit: { opacity: 0, y: 15, scale: 0.9, transition: { duration: 0.2 } }
};
// =====================================================

// ===== 🌠 تنظیمات پس‌زمینه "نجواهای آسمانی و گوی‌های اثیری" برای react-tsparticles 🌠 =====
const particleOptions = {
  background: {
    color: {
      value: '#0D1B2A', 
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'repulse', 
      },
    },
    modes: {
      repulse: {
        distance: 80,
        duration: 0.4,
        factor: 100,
        speed: 0.5,
        maxSpeed: 5,
        easing: 'ease-out-quad',
      },
    },
  },
  particles: {
    color: {
      value: ['#FFD700', '#F0E68C', '#FFFACD'], 
    },
    shape: {
      type: 'circle',
    },
    opacity: {
      value: { min: 0.1, max: 0.6 }, 
      random: true,
      animation: { 
        enable: true,
        speed: 0.6,
        minimumValue: 0.05,
        sync: false,
      },
    },
    size: {
      value: { min: 1, max: 4 }, 
      random: true,
      animation: { 
        enable: true,
        speed: 2,
        minimumValue: 0.5,
        sync: false,
      },
    },
    links: {
      enable: false, 
    },
    move: {
      enable: true,
      speed: { min: 0.1, max: 0.5 }, 
      direction: 'none', 
      random: true,
      straight: false,
      outModes: {
        default: 'out', 
      },
      attract: { 
        enable: false,
      },
    },
    number: {
      density: {
        enable: true,
        area: 1000, 
      },
      value: 120, 
    },
    shadow: { 
        enable: true,
        color: "#FFD700", 
        blur: 5,
    }
  },
  detectRetina: true,
};
// ================================================================================

function App() {
  const [prompt, setPrompt] = useState('');
  const [poem, setPoem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [poetryForm, setPoetryForm] = useState('غزل'); 
  const [numCouplets, setNumCouplets] = useState('4'); 
  const [copyButtonText, setCopyButtonText] = useState('کپی کردن شعر');
  const [poetStyle, setPoetStyle] = useState('default'); 
  const [particlesReady, setParticlesReady] = useState(false);

  const customParticlesInit = useCallback(async (engine) => {
    try {
      await loadSlim(engine);
      setParticlesReady(true);
    } catch (err) {
      console.error("Error loading particles bundle:", err);
      setError("خطا در بارگذاری جلوه‌های پس‌زمینه متحرک.");
      setParticlesReady(true); 
    }
  }, [setError]);

  const particlesLoaded = useCallback(async (container) => {
    // console.log("Particles container loaded:", container);
  }, []);

  const handleGeneratePoem = async () => {
    if (!prompt.trim()) {
      setError('لطفاً یک کلمه کلیدی یا عبارت برای شروع شعر وارد کنید.');
      setPoem('');
      return;
    }
    setIsLoading(true);
    setError('');
    setPoem('');
    setCopyButtonText('کپی کردن شعر'); 
    try {
      const payload = { prompt: prompt, poetry_form: poetryForm, num_couplets: numCouplets, poet_style: poetStyle };
      
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

      if (!apiBaseUrl) {
        console.error("CRITICAL: VITE_API_BASE_URL is not defined in your .env.local or .env file!");
        setError("خطای پیکربندی: آدرس سرور بک‌اند در برنامه مشخص نشده است. لطفاً فایل .env.local را بررسی کرده و برنامه را دوباره build کنید.");
        setIsLoading(false);
        return;
      }
      
      const apiUrl = `${apiBaseUrl}/generate`;
      console.log("Frontend attempting to call API at:", apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `خطای سرور: ${response.status} ${response.statusText}` }));
        throw new Error(errorData.error || `خطا در ارتباط با سرور`);
      }
      const data = await response.json();
      if (data.poem) { setPoem(data.poem); }
      else if (data.error) { setError(data.error); setPoem(''); }
      else { setError("پاسخ دریافتی از سرور، شعر معتبری ندارد."); setPoem('');}
    } catch (err) {
      setError(err.message || 'یک خطای ناشناخته در هنگام تولید شعر رخ داد.');
      setPoem('');
      console.error("Error generating poem:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPoem = () => {
    if (poem && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(poem)
        .then(() => {
          setCopyButtonText('کپی شد!');
          setTimeout(() => setCopyButtonText('کپی کردن شعر'), 2000);
        })
        .catch(err => {
          console.error('خطا در کپی کردن شعر: ', err);
          setCopyButtonText('خطا در کپی');
          alert('خطا در کپی کردن شعر. لطفاً به صورت دستی کپی کنید یا از مرورگر دیگری استفاده نمایید.');
          setTimeout(() => setCopyButtonText('کپی کردن شعر'), 2000);
        });
    } else if (poem) {
      const textArea = document.createElement("textarea");
      textArea.value = poem;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyButtonText('کپی شد! (روش قدیمی)');
        setTimeout(() => setCopyButtonText('کپی کردن شعر'), 2000);
      } catch (err) {
        console.error('خطا در کپی کردن (روش قدیمی): ', err);
        setCopyButtonText('خطا در کپی');
        alert('خطا در کپی کردن شعر. لطفاً به صورت دستی کپی کنید.');
        setTimeout(() => setCopyButtonText('کپی کردن شعر'), 2000);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <>
      <Particles 
        id="tsparticles"
        init={customParticlesInit}
        loaded={particlesLoaded}
        options={particleOptions}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />
      
      {particlesReady ? (
        <motion.div
          className="App"
          variants={containerVariants} 
          initial="hidden"
          animate="visible"
        >
          <motion.header className="app-header" variants={itemVariants}>
            <h1>مولّد شعر پارسی</h1>
            <p className="subtitle">هنر کهن، نوآوری مدرن</p>
          </motion.header>

          <motion.main className="app-main" variants={itemVariants}>
            <motion.div className="input-area" variants={itemVariants}> 
              <motion.textarea 
                id="poem_prompt_input"
                name="poem_prompt"    
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="کلمه کلیدی یا عبارت اصلی شعر..."
                rows="3" 
                disabled={isLoading}
                variants={itemVariants} 
              />

              <motion.div className="options-grid" variants={itemVariants}> 
                <motion.div className="option-item" variants={itemVariants}>
                  <label htmlFor="poetryFormSelect" className="option-label">قالب شعری:</label>
                  <select 
                    id="poetryFormSelect" 
                    value={poetryForm} 
                    onChange={(e) => setPoetryForm(e.target.value)}
                    disabled={isLoading}
                    className="custom-select"
                  >
                    <option value="غزل">غزل</option>
                    <option value="رباعی">رباعی</option>
                    <option value="دوبیتی">دوبیتی</option>
                    <option value="مثنوی">مثنوی</option>
                    <option value="قصیده">قصیده</option>
                    <option value="قطعه">قطعه</option>
                    <option value="تک‌بیت">تک‌بیت</option>
                  </select>
                </motion.div>

                <motion.div className="option-item" variants={itemVariants}>
                  <label htmlFor="numCoupletsSelect" className="option-label">تعداد ابیات (تقریبی):</label>
                  <select 
                    id="numCoupletsSelect" 
                    value={numCouplets} 
                    onChange={(e) => setNumCouplets(e.target.value)}
                    disabled={isLoading || poetryForm === "رباعی" || poetryForm === "دوبیتی" || poetryForm === "تک‌بیت"}
                    className="custom-select"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num.toString()}>{num} بیت</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div className="option-item" variants={itemVariants}>
                  <label htmlFor="poetStyleSelect" className="option-label">سبک شاعر (اختیاری):</label>
                  <select 
                    id="poetStyleSelect" 
                    value={poetStyle} 
                    onChange={(e) => setPoetStyle(e.target.value)}
                    disabled={isLoading}
                    className="custom-select"
                  >
                    <option value="default">پیش‌فرض / کلی</option>
                    <option value="حافظ">حافظ</option>
                    <option value="سعدی">سعدی</option>
                    <option value="مولانا">مولانا</option>
                    <option value="خیام">خیام</option>
                    <option value="فردوسی">فردوسی</option>
                    <option value="عطار">عطار</option>
                    <option value="نظامی">نظامی</option>
                  </select>
                </motion.div>
              </motion.div>

              <motion.button
                className="generate-button"
                onClick={handleGeneratePoem}
                disabled={isLoading}
                variants={mainButtonVariants} 
                whileHover="hover"
                whileTap="tap"
                initial="initial" 
                animate="animate" 
              >
                {isLoading ? ( <><div className="loading-spinner"></div><span>در حال آفرینش...</span></> ) : ( <span> بسرای ای هوش! </span> )}
              </motion.button>
            </motion.div> 

            <AnimatePresence>
              {error && (
                <motion.p 
                  className="error-message"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                > 
                  {error} 
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {poem && !isLoading && (
                <motion.div 
                  className="poem-display-area" 
                  variants={poemAreaVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit" 
                >
                  <div className="poem-header">
                    <h2>سرودهٔ هوش:</h2>
                    <motion.button 
                      onClick={handleCopyPoem} 
                      className="copy-button" 
                      disabled={!poem}
                      variants={interactionButtonVariants} 
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {copyButtonText}
                    </motion.button>
                  </div>
                  <motion.div className="poem-content">
                    {poem.split('\n').map((line, index) => (
                      <motion.span 
                        key={index} 
                        variants={poemLineVariants}
                      >
                        {line || "\u00A0"}
                        <br />
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.main>

          <motion.footer className="app-footer" variants={itemVariants}>
            <p>ساخته شده با الهام از گنجینه ادب پارسی و قدرت هوش مصنوعی</p>
          </motion.footer>
        </motion.div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#0D1B2A', 
          color: '#FFD700',
          fontFamily: 'Vazirmatn, Tahoma, sans-serif',
          fontSize: '1.5em',
          textAlign: 'center',
          direction: 'rtl',
          padding: '20px',
          zIndex: 2 
        }}>
          در حال آماده‌سازی جلوه‌های بصری...
          <br />
          <span style={{fontSize: '0.8em', color: '#A7C4D4', marginTop: '10px'}}>(اگر این پیام برای مدت طولانی باقی ماند، لطفاً کنسول مرورگر (F12) را بررسی کنید)</span>
          {error && <p style={{color: '#F48FB1', fontSize: '0.9em', marginTop: '20px'}}>پیام خطا: {error}</p>}
        </div>
      )}
    </>
  );
}

export default App;