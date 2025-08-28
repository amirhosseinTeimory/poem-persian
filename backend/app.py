import os
import flask
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import traceback

# --- تنظیمات اولیه ---
app = Flask(__name__)
CORS(app, resources={r"/generate": {"origins": "*"}})
load_dotenv()

# --- تنظیمات مشتری OpenRouter ---
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
YOUR_SITE_URL = "http://localhost:3000"
YOUR_PROJECT_TITLE = "Persian Poetry Generator by AI"
MODEL_ID_ON_OPENROUTER = "deepseek/deepseek-chat"

client = None
apiKeyIsValidAndClientInitialized = False

if OPENROUTER_API_KEY and OPENROUTER_API_KEY.startswith("sk-or-v1-") and len(OPENROUTER_API_KEY) > 50:
    apiKeyIsValidAndClientInitialized = True
    try:
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=OPENROUTER_API_KEY,
        )
        print("INFO: OpenAI client initialized for OpenRouter using API key from environment.")
    except Exception as e:
        print(f"ERROR: Failed to initialize OpenAI client: {e}")
        traceback.print_exc()
        apiKeyIsValidAndClientInitialized = False
else:
    print("CRITICAL ERROR: OPENROUTER_API_KEY not found or seems invalid in environment variables / .env file.")
    print("Please create a .env file in the same directory as app.py and add your key like this:")
    print("OPENROUTER_API_KEY=\"sk-or-v1-your-actual-api-key\"")

@app.route('/generate', methods=['POST'])
def generate_poem_route():
    global client

    if not apiKeyIsValidAndClientInitialized or not client:
        return jsonify({'error': 'OpenAI client (for OpenRouter) is not initialized. Check API key and backend startup logs.'}), 500

    try:
        data = request.get_json()
        if not data or 'prompt' not in data:
            return jsonify({'error': 'Keyword (prompt) not provided.'}), 400

        user_keyword = data['prompt'].strip()
        poetry_form = data.get('poetry_form', 'غزل').strip()
        poet_style = data.get('poet_style', 'default').strip()
        try:
            num_couplets_str = data.get('num_couplets', '4').strip()
            num_couplets = int(num_couplets_str)
            if num_couplets < 1: num_couplets = 2
        except ValueError:
            num_couplets = 4

        print(f"INFO: Received keyword: '{user_keyword}', form: '{poetry_form}', couplets: {num_couplets}, poet style: '{poet_style}'")

        if not user_keyword:
            user_keyword = "بهار دلنشین"
            print(f"INFO: User keyword was empty. Using default keyword: '{user_keyword}'")

        system_message_content = "شما یک شاعر بسیار ماهر و خلاق ایرانی هستید که در سرودن انواع قالب‌های شعر کلاسیک فارسی با مضامین عمیق، تصاویر بدیع، و زبان فاخر تبحر دارید. شعر شما باید کاملاً به زبان فارسی باشد."
        
        couplets_instruction = f"این شعر باید حدوداً {num_couplets} بیت داشته باشد."
        if poetry_form.lower() in ["رباعی", "دوبیتی"]:
            couplets_instruction = "این شعر باید دقیقاً ۲ بیت (چهار مصرع) در قالب رباعی/دوبیتی باشد."
            num_couplets = 2
        elif poetry_form.lower() == "تک‌بیت":
            couplets_instruction = "این شعر باید دقیقاً ۱ بیت (دو مصرع) باشد."
            num_couplets = 1
        
        style_instruction = ""
        if poet_style and poet_style.lower() != 'default' and poet_style.lower() != 'پیش‌فرض':
            style_instruction = f" لطفاً این شعر را تا حد امکان به سبک شعری «{poet_style}» بسرایید."
        
        user_message_content = (
            f"لطفاً یک قطعه شعر فارسی در قالب «{poetry_form}» بسرایید. {couplets_instruction}{style_instruction}\n"
            f"موضوع اصلی این شعر باید کلمه کلیدی «{user_keyword}» و مفاهیم، احساسات و تصاویر مرتبط با آن باشد.\n"
            f"لطفاً اصول مربوط به قالب «{poetry_form}» (مانند وحدت قافیه و ردیف در غزل یا قصیده، یا ساختار رباعی و دوبیتی) و وزن مناسب را تا حد امکان رعایت کنید.\n"
            f"از آرایه‌های ادبی برای افزایش زیبایی و عمق شعر بهره بگیرید.\n"
            f"شعر الزاماً نباید با خود کلمه کلیدی «{user_keyword}» شروع شود، بلکه این کلمه یا مفهوم آن باید به طور طبیعی در شعر تنیده شده باشد."
        )
        print(f"INFO: Constructed user message for LLM: '{user_message_content[:300]}...'")
        
        estimated_tokens_per_couplet = 30
        max_gen_tokens = (num_couplets * estimated_tokens_per_couplet) + 80

        print(f"INFO: Sending request to OpenRouter with model: {MODEL_ID_ON_OPENROUTER}, max_tokens for generation: {max_gen_tokens}")
        completion = client.chat.completions.create(
            extra_headers={ "HTTP-Referer": YOUR_SITE_URL, "X-Title": YOUR_PROJECT_TITLE },
            model=MODEL_ID_ON_OPENROUTER,
            messages=[
                {"role": "system", "content": system_message_content},
                {"role": "user", "content": user_message_content}
            ],
            temperature=0.75,
            max_tokens=max_gen_tokens,
        )
        
        generated_text = completion.choices[0].message.content.strip()
        print(f"INFO: Received response from LLM. Poem snippet: '{generated_text[:150]}...'")
        
        return jsonify({'poem': generated_text})

    except Exception as e:
        error_message = f"Error during poetry generation via OpenRouter: {str(e)}"
        print(f"ERROR: {error_message}")
        traceback.print_exc()
        if hasattr(e, 'status_code'):
            if e.status_code == 401:
                 return jsonify({'error': 'خطا در احراز هویت با سرویس OpenRouter. کلید API نامعتبر است یا دسترسی لازم را ندارد.'}), 401
            elif e.status_code == 429:
                 return jsonify({'error': 'متاسفانه به دلیل محدودیت تعداد درخواست به سرویس، فعلا امکان تولید شعر وجود ندارد. لطفاً کمی بعد دوباره تلاش کنید.'}), 429
        if "AuthenticationError" in str(e) or "Incorrect API key" in str(e) or "Invalid API key" in str(e):
             return jsonify({'error': 'خطا در احراز هویت با سرویس OpenRouter. لطفاً کلید API خود را در فایل .env بررسی کنید.'}), 401
        return jsonify({'error': f'An error occurred: {error_message}'}), 500

if __name__ == '__main__':
    if not apiKeyIsValidAndClientInitialized:
        print("CRITICAL ERROR: OpenAI client for OpenRouter could not be initialized...")
    else:
        print(f"INFO: Attempting to run Flask server on port 5000. API Key is set and client initialized.")
        app.run(host='0.0.0.0', port=5000, debug=False)