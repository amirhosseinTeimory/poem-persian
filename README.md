# سامانه تولید شعر پارسی با هوش مصنوعی (AI Persian Poetry Generator)

<div dir="rtl">

این پروژه یک وب اپلیکیشن فول-استک است که برای تولید شعر کلاسیک فارسی با استفاده از مدل‌های زبانی بزرگ طراحی شده است. این سامانه به عنوان یک پروژه دانشگاهی برای رشته مهندسی کامپیوتر توسعه داده شده است.

</div>

---

This project is a full-stack web application designed to generate classical Persian poetry using Large Language Models (LLMs). It was developed as a university project for the Computer Engineering department.

---

## 📸 پیش‌نمایش / Screenshot

<div dir="rtl">

در اینجا می‌توانید نمایی از رابط کاربری اصلی برنامه را مشاهده کنید:

</div>

*In this section, you can see a preview of the main user interface:*

![Screenshot of the Persian Poetry Generator App](https://via.placeholder.com/800x450.png?text=Your+App+Screenshot+Here)
*(نکته: این یک تصویر نمونه است. لطفاً یک اسکرین‌شات از برنامه خودتان گرفته، آن را در گیت‌هاب آپلود کنید و لینک آن را در اینجا جایگزین نمایید).*

---

## ✨ قابلیت‌ها / Features

<div dir="rtl">

* **تولید شعر موضوعی:** کاربر می‌تواند با وارد کردن یک کلمه کلیدی یا عبارت، شعری مرتبط با آن موضوع دریافت کند.
* **انتخاب قالب شعری:** پشتیبانی از قالب‌های مختلف شعر کلاسیک مانند غزل، رباعی، دوبیتی، مثنوی و ...
* **انتخاب تعداد ابیات:** کاربر می‌تواند طول تقریبی شعر مورد نظر خود را مشخص کند.
* **انتخاب سبک شاعر:** امکان تولید شعر با الهام از سبک شاعران بزرگی چون حافظ، سعدی، مولانا و ...
* **رابط کاربری مدرن و پویا:** طراحی شده با React، با انیمیشن‌های روان (Framer Motion) و پس‌زمینه متحرک و تعاملی (`react-tsparticles`).
* **قابلیت کپی کردن:** دکمه‌ای برای کپی آسان شعر تولید شده در کلیپ‌بورد.
* **برنامه وب پیش‌رونده (PWA):** قابلیت "افزودن به صفحه اصلی" در دستگاه‌های موبایل برای تجربه‌ای شبیه به یک اپلیکیشن بومی.
* **لانچر دسکتاپ (اختیاری):** یک برنامه دسکتاپ کوچک با `CustomTkinter` برای اجرای آسان سرورهای فرانت‌اند و بک‌اند.

</div>

* **Thematic Poetry Generation:** Users can generate a poem based on a keyword or a starting phrase.
* **Poetic Form Selection:** Supports various classical Persian forms like Ghazal, Ruba'i, Masnavi, etc.
* **Couplet Count Selection:** Users can specify the approximate length of the desired poem.
* **Poet Style Selection:** Ability to generate poetry inspired by the style of great poets like Hafez, Saadi, Rumi, etc.
* **Modern & Dynamic UI:** Built with React, featuring smooth animations (Framer Motion) and an interactive particle background (`react-tsparticles`).
* **Copy to Clipboard:** A convenient button to copy the generated poem.
* **Progressive Web App (PWA):** "Add to Home Screen" capability on mobile devices for an app-like experience.
* **Desktop Launcher (Optional):** A small desktop utility built with `CustomTkinter` to easily run the frontend and backend servers.

---

## 🛠️ تکنولوژی‌های استفاده شده / Tech Stack

### **Frontend**
* **React** (with **Vite**)
* **Framer Motion** (for UI animations)
* **react-tsparticles** (for the animated background)
* **vite-plugin-pwa** (for PWA capabilities)
* **CSS3**

### **Backend**
* **Python**
* **Flask** (as the web server and API framework)
* **Flask-CORS** (for Cross-Origin Resource Sharing)
* **python-dotenv** (for environment variable management)

### **AI & API**
* **OpenRouter.ai API** (as a gateway to LLMs)
* **DeepSeek-Chat** (as the core Large Language Model)
* **OpenAI Python Library** (for interacting with the API)

### **Desktop Launcher (Utility)**
* **Python**
* **CustomTkinter** (for the modern GUI)

---

## 🚀 راه‌اندازی و اجرا / Setup and Running

<div dir="rtl">

برای اجرای این پروژه به صورت محلی، مراحل زیر را دنبال کنید.

### **پیش‌نیازها**
* **Node.js** (نسخه LTS)
* **Python** (نسخه 3.9 یا بالاتر)
* یک کلید API معتبر از **OpenRouter.ai**

### **راه‌اندازی بک‌اند**
1. وارد پوشه `poetry_backend` شوید: `cd poetry_backend`
2. یک محیط مجازی بسازید و فعال کنید:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1  # For Windows PowerShell