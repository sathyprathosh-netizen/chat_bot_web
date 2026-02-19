import os
import requests
import psycopg2
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from time import time

load_dotenv()

app = Flask(__name__)
CORS(app)

# ---------------- CONFIG ----------------
HF_TOKEN = os.getenv("HUGGINGFACE_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

if not HF_TOKEN:
    raise ValueError("Hugging Face API key not found in environment variables.")

# ✅ FIXED: Switched to a proper conversational model
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

# ---------------- DATABASE ----------------
def get_db_connection():
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL not set in environment variables.")
    return psycopg2.connect(DATABASE_URL)

# ✅ NEW: Create table if it doesn't exist on startup
def init_db():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Database initialized.")
    except Exception as e:
        print(f"⚠️ DB init error: {e}")

# ---------------- FAQ ENGINE ----------------
FAQS = {
    # Project & Timeline
    "project timeline": "Most projects take 4-8 weeks from discovery to launch, depending on complexity.",
    "how long does a project take": "Most projects take 4-8 weeks from discovery to launch, depending on complexity.",
    "project duration": "Typical projects range from 4 to 8 weeks based on scope and complexity.",
    "delivery time": "We deliver most projects within 4-8 weeks from the discovery phase to launch.",
    "turnaround time": "Our typical turnaround is 4-8 weeks depending on the project's complexity.",

    # Support
    "post launch support": "Yes, we offer 24/7 technical support and periodic design audits to keep your site fresh.",
    "do you offer support": "Yes, we provide 24/7 technical support and periodic design audits post-launch.",
    "technical support": "We provide round-the-clock technical support after every project launch.",
    "ongoing support": "We offer 24/7 technical support and design audits to keep your site up to date.",
    "maintenance": "Yes, we handle post-launch maintenance with 24/7 support and regular audits.",

    # Animations
    "custom animations": "Absolutely. High-performance, jank-free animations are our specialty.",
    "do you do animations": "Yes, animations are our specialty — we build buttery-smooth 60fps visual experiences.",
    "web animations": "We build high-performance, jank-free animations that run smoothly on every device.",
    "animation performance": "Our animations run at a buttery-smooth 60fps on every device imaginable.",
    "motion design": "We craft high-end, animation-driven digital experiences tailored to your brand.",

    # Services
    "what services do you offer": "We offer UI/UX Design, Full-Stack Development, Web Animations, SEO Strategy, and Cloud Infrastructure.",
    "ui ux design": "We specialize in minimalist UI/UX design driven by user research and psychological profiling.",
    "full stack development": "We build bespoke full-stack digital solutions that are both functional and emotional.",
    "seo strategy": "We provide rigorous SEO strategies to maximize your site's visibility and reach.",
    "cloud infrastructure": "We design and manage scalable cloud infrastructure tailored to your needs.",
    "web development": "We build high-end, performance-optimized websites using vanilla technologies.",
    "design services": "Our design services include UI/UX, brand strategy, and animation-driven interfaces.",

    # About VORTEX
    "what is vortex": "VORTEX is a premium tech studio crafting high-end, animation-driven digital experiences for startups and established tech leaders.",
    "about vortex": "Founded on minimal but impactful design principles, VORTEX pushes the boundaries of what's possible with modern web technologies.",
    "vortex mission": "Our mission is to make design and technology work in perfect harmony — functional, emotional, and future-proof.",
    "vortex philosophy": "We believe in minimal but impactful design — every pixel should serve a purpose in the user journey.",
    "what does vortex do": "VORTEX crafts bespoke digital experiences including web design, full-stack development, animations, SEO, and cloud infrastructure.",
    "vortex experience": "VORTEX has over 10 years of industry experience delivering premium digital solutions.",
    "years of experience": "We have 10+ years of experience in the tech and design industry.",
    "how many projects": "We've successfully delivered 150+ projects across various industries.",
    "projects completed": "VORTEX has completed over 150 projects for startups and established tech leaders.",

    # Design Philosophy
    "design philosophy": "We believe design and technology should work in perfect harmony — functional, emotional, and built to last.",
    "design strategy": "We use rigorous user research and psychological profiling to make designs that work for your users.",
    "quality": "Every line of code is handwritten for maximum performance and maintainability.",
    "code quality": "We handwrite every line of code to ensure maximum performance and long-term maintainability.",
    "technology stack": "We specialize in vanilla technologies — clean, performant, and built to last for years.",

    # Team
    "who is the founder": "John Doe is the Founder & CEO of VORTEX, with 15+ years of industry experience.",
    "who is john doe": "John Doe is VORTEX's Founder & CEO — a veteran architect who believes every pixel should serve a purpose.",
    "who is alice smith": "Alice Smith is VORTEX's Creative Director, a pioneer in minimalist UI and multiple Awwwards winner.",
    "creative director": "Alice Smith leads creative direction at VORTEX, specializing in translating brand values into elegant interfaces.",
    "who is mike chen": "Mike Chen is VORTEX's Lead Engineer, a wizard in Vanilla JS and CSS performance.",
    "lead engineer": "Mike Chen is our Lead Engineer, ensuring all animations run at 60fps on every device.",
    "team": "VORTEX's team includes John Doe (CEO), Alice Smith (Creative Director), and Mike Chen (Lead Engineer).",
    "team size": "Our core team consists of seasoned experts in design, engineering, and strategy.",
    "awards": "Our Creative Director Alice Smith has won multiple Awwwards for pioneering minimalist UI design.",

    # Contact
    "how to contact": "You can reach us at hello@vortex.engineering, call +1 (555) 000-VORTEX, or visit us at 123 Digital Ave, Tech City.",
    "email": "You can email us at hello@vortex.engineering.",
    "phone number": "You can call us at +1 (555) 000-VORTEX.",
    "office location": "Our studio is located at 123 Digital Ave, Tech City.",
    "address": "You can find us at 123 Digital Ave, Tech City.",
    "get in touch": "Reach out via email at hello@vortex.engineering or call +1 (555) 000-VORTEX.",

    # Pricing & Process
    "how much does it cost": "Project pricing varies based on scope and complexity. Contact us at hello@vortex.engineering for a custom quote.",
    "pricing": "We offer custom pricing based on your project's needs. Reach out to discuss your requirements.",
    "how do i start a project": "Simply reach out via our contact form or email hello@vortex.engineering and we'll kick off with a discovery session.",
    "project process": "Our process starts with discovery, followed by design, development, testing, and a full launch.",
    "discovery phase": "We begin every project with a thorough discovery phase to align on goals, users, and technical requirements.",
    "do you work with startups": "Absolutely — we work with both future-thinking startups and established tech leaders.",
    "do you work with enterprise": "Yes, we work with established tech leaders and large organizations alongside startups.",
    "custom solutions": "We specialize in bespoke digital solutions tailored precisely to your brand and business needs.",
    "performance": "Performance is a core principle — we optimize every project for speed, smoothness, and scalability.",
}

# ---------------- AI CALL FUNCTION ----------------
def call_huggingface_api(user_message):
    # ✅ FIXED: Proper instruct-style prompt for Mistral
    prompt = (
        "<s>[INST] You are a professional assistant for VORTEX, a premium tech studio. "
        "Answer questions about VORTEX concisely and helpfully. "
        "If unsure, recommend contacting hello@vortex.engineering.\n\n"
        f"{user_message} [/INST]"
    )

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 150,
            "temperature": 0.6,
            "return_full_text": False,
            "stop": ["</s>", "[INST]"]  # ✅ FIXED: Stop tokens to prevent runaway output
        }
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)

        # ✅ FIXED: Handle model loading (503) gracefully
        if response.status_code == 503:
            return "Our AI assistant is warming up. Please try again in a moment."

        if response.status_code != 200:
            print(f"HF Error {response.status_code}:", response.text)
            return "AI service is temporarily unavailable. Please email hello@vortex.engineering."

        result = response.json()

        if isinstance(result, dict) and result.get("error"):
            print("HF Model Error:", result["error"])
            return "AI model is loading. Please try again in a moment."

        if isinstance(result, list) and len(result) > 0:
            text = result[0].get("generated_text", "").strip()
            return text if text else "I couldn't generate a response."

        return "I couldn't generate a response."

    # ✅ FIXED: Catch timeout separately for clearer error
    except requests.exceptions.Timeout:
        return "The request timed out. Please try again."
    except Exception as e:
        print("HF call exception:", e)
        return "Something went wrong with the AI service."

# ---------------- ROUTES ----------------
@app.route("/")
def home():
    return render_template("chatbot.html", timestamp=int(time()))


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        # ✅ FIXED: Gracefully handle missing/malformed JSON body
        if not data:
            return jsonify({"reply": "Invalid request. Please send a JSON body."}), 400

        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"reply": "Please enter a message."})

        # ✅ FIXED: Basic length guard to prevent prompt injection / abuse
        if len(user_message) > 500:
            return jsonify({"reply": "Your message is too long. Please keep it under 500 characters."})

        lower_message = user_message.lower()

        # 1️⃣ FAQ Match First (exact substring)
        for key, value in FAQS.items():
            if key in lower_message:
                return jsonify({"reply": value})

        # 2️⃣ Navigation Hints
        # ✅ NOTE: Your HTML frontend must handle these "action" keys in JS
        if "contact" in lower_message:
            return jsonify({
                "reply": "You can reach us at hello@vortex.engineering or scroll to the contact section below!",
                "action": "contact"
            })

        if "team" in lower_message:
            return jsonify({
                "reply": "Meet our amazing team below 👇",
                "action": "team"
            })

        # 3️⃣ Lead Capture Trigger
        # ✅ NOTE: Your HTML frontend must handle the "lead" flag to show a form
        if any(word in lower_message for word in ["hire", "collaborate", "work with you", "get started"]):
            return jsonify({
                "reply": "We'd love to work with you! Please share your name, email, and project details.",
                "lead": True
            })

        # 4️⃣ AI Fallback
        ai_reply = call_huggingface_api(user_message)
        return jsonify({"reply": ai_reply})

    except Exception as e:
        print("Server Error:", e)
        return jsonify({"reply": "Something went wrong. Please try again."}), 500


@app.route("/save-lead", methods=["POST"])
def save_lead():
    try:
        data = request.get_json()

        # ✅ FIXED: Validate all required fields before DB insert
        if not data:
            return jsonify({"status": "error", "message": "No data received."}), 400

        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        message = data.get("message", "").strip()

        if not name or not email or not message:
            return jsonify({"status": "error", "message": "Name, email, and message are required."}), 400

        # ✅ FIXED: Basic email format check
        if "@" not in email or "." not in email:
            return jsonify({"status": "error", "message": "Invalid email address."}), 400

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO leads (name, email, message) VALUES (%s, %s, %s)",
            (name, email, message)
        )
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"status": "success", "message": "Thanks! We'll be in touch soon."})

    except Exception as e:
        print("DB Error:", e)
        return jsonify({"status": "error", "message": "Database error. Please try again."}), 500


# ✅ FIXED: Run DB init before starting the server
if __name__ == "__main__":
    init_db()
    app.run(debug=True)