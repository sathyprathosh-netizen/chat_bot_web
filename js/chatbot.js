document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById("chatToggle");
    const container = document.getElementById("chatContainer");
    const closeBtn = document.getElementById("chatClose");
    const input = document.getElementById("chatInput");
    const messages = document.getElementById("chatMessages");

    if (!toggle || !container || !closeBtn || !input || !messages) return;

    // --- KNOWLEDGE BASE (Standalone) ---
    const KNOWLEDGE_BASE = {
        // Expertise & Services (Supported)
        "ui design": "Yes, UI/UX Design is one of our core expertise areas, and we actively work on designing user-friendly and visually appealing interfaces.",
        "ux design": "Yes, UI/UX Design is one of our core expertise areas, and we actively work on designing user-friendly and visually appealing interfaces.",
        "ui/ux": "Yes, UI/UX Design is one of our core expertise areas, and we actively work on designing user-friendly and visually appealing interfaces.",
        "user interface": "Yes, UI/UX Design is one of our core expertise areas, and we actively work on designing user-friendly and visually appealing interfaces.",
        "user experience": "Yes, UI/UX Design is one of our core expertise areas, and we actively work on designing user-friendly and visually appealing interfaces.",
        "expertise": "Our core expertise includes high-performance Web Development, UI/UX Design, Web Animations, Cloud Infrastructure, and Digital Strategy.",
        "expert": "We are experts in building scalable digital systems, custom UI designs, and performance-optimized web applications.",

        "full stack": "Full-Stack Development is part of our services, covering both frontend and backend development.",
        "backend": "Full-Stack Development is part of our services, covering both frontend and backend development.",
        "frontend": "Full-Stack Development is part of our services, covering both frontend and backend development.",
        "full stack development": "Full-Stack Development is part of our services, covering both frontend and backend development.",
        "web development": "Full-Stack Development is part of our services, covering both frontend and backend development.",

        "web animations": "We provide Web Animation services to create engaging and interactive user experiences.",
        "motion design": "We provide Web Animation services to create engaging and interactive user experiences.",
        "interactive animations": "We provide Web Animation services to create engaging and interactive user experiences.",

        "search engine optimization": "SEO Strategy is included in our offerings to help improve visibility and search engine performance.",
        "seo strategy": "SEO Strategy is included in our offerings to help improve visibility and search engine performance.",
        "website ranking": "SEO Strategy is included in our offerings to help improve visibility and search engine performance.",

        "cloud infrastructure": "Cloud Infrastructure is one of our supported services, helping businesses scale securely and efficiently.",
        "aws": "Cloud Infrastructure is one of our supported services, helping businesses scale securely and efficiently.",
        "azure": "Cloud Infrastructure is one of our supported services, helping businesses scale securely and efficiently.",
        "cloud services": "Cloud Infrastructure is one of our supported services, helping businesses scale securely and efficiently.",

        // Locations
        "london": "Yes, London is one of our active locations and serves as our headquarters.",
        "uk": "Yes, London is one of our active locations and serves as our headquarters.",
        "united kingdom": "Yes, London is one of our active locations and serves as our headquarters.",
        "new york": "We operate in New York as a regional hub for North America.",
        "ny": "We operate in New York as a regional hub for North America.",
        "usa": "We operate in New York as a regional hub for North America.",
        "united states": "We operate in New York as a regional hub for North America.",
        "tokyo": "Tokyo is one of our regional hubs serving the Asia-Pacific region.",
        "japan": "Tokyo is one of our regional hubs serving the Asia-Pacific region.",
        "asia pacific": "Tokyo is one of our regional hubs serving the Asia-Pacific region.",
        "apac": "Tokyo is one of our regional hubs serving the Asia-Pacific region.",

        // Generic Location
        "location": "VORTEX operates through three main global hubs: London (HQ), New York (North America), and Tokyo (Asia-Pacific).",
        "office": "We have active operational hubs in London, New York, and Tokyo.",
        "offices": "We have active operational hubs in London, New York, and Tokyo.",
        "where are you": "VORTEX is located in London, New York, and Tokyo.",

        // Greetings
        "what is vortex": "VORTEX is a premium digital engineering studio delivering high-performance web and tech solutions.",
        "who are you": "VORTEX is a premium digital engineering studio delivering high-performance web and tech solutions.",

        // Services & Offerings
        "services": "We offer web development, UI/UX design, animations, cloud solutions, and digital strategy.",
        "what you offer": "We offer web development, UI/UX design, animations, cloud solutions, and digital strategy.",
        "custom design": "Yes, every project is custom-designed.",
        "templates": "No, all our designs and code are handcrafted.",
        "responsive": "Yes, all websites are fully responsive.",
        "mobile": "Yes, all websites are fully responsive.",
        "animations": "Yes, animations are one of our core strengths.",
        "fast": "Yes, performance optimization is a top priority.",
        "performance": "Yes, performance optimization is a top priority.",
        "seo": "Yes, we implement SEO best practices.",
        "redesign": "Yes, we modernize and improve existing websites.",
        "maintenance": "Yes, maintenance plans are available.",
        "support": "Yes, we provide ongoing technical support.",
        "technologies": "We use modern frontend, backend, and cloud technologies.",
        "tech stack": "We use modern frontend, backend, and cloud technologies.",
        "spa": "Yes, we build both SPA and multi-page apps.",
        "single page": "Yes, we build both SPA and multi-page apps.",
        "api": "Yes, we handle third-party API integrations.",
        "security": "Yes, we follow strict security practices.",
        "secure": "Yes, we follow strict security practices.",
        "nda": "Yes, NDAs are supported.",
        "ownership": "Yes, you receive full ownership of the source code.",
        "source code": "Yes, you receive full ownership of the source code.",

        // Business & Startup Focus
        "who can work": "Startups, enterprises, and tech-driven businesses can work with us.",
        "global": "Yes, we collaborate with clients across the globe.",
        "worldwide": "Yes, we collaborate with clients across the globe.",
        "admin dashboard": "Yes, we create custom dashboards.",
        "mvp": "Yes, we help startups build MVPs.",
        "startups": "Yes, startups are a key focus.",
        "consultation": "Yes, initial consultation is free.",
        "free": "Yes, initial consultation is free.",
        "pricing": "Pricing depends on project scope.",
        "cost": "Pricing depends on project scope.",
        "fixed pricing": "Yes, fixed pricing is available.",
        "revisions": "Yes, revisions are included.",
        "testing": "Yes, rigorous testing is done before launch.",
        "deployment": "Yes, we manage deployment.",
        "scale": "Yes, scalability is built-in to our architecture.",
        "analytics": "Yes, analytics tools can be integrated.",
        "migrate": "Yes, secure migrations are supported.",
        "accessibility": "Yes, we follow accessibility guidelines.",
        "chatbot": "Yes, AI chatbots can be integrated.",
        "payment": "Yes, secure payment integrations are supported.",
        "branding": "Yes, branding and identity services are offered.",
        "industries": "We work with fintech, SaaS, AI, and enterprise clients.",
        "deadlines": "Yes, timelines can be adjusted to meet tight deadlines.",
        "documentation": "Yes, full documentation is provided.",
        "communication": "We provide regular updates and meetings during projects.",
        "hours": "We provide 24/7 services and support to our clients. Feel free to call us or reach out via the contact form for immediate assistance.",
        "working hours": "VORTEX operates on a 24/7 schedule to support our global clients across different time zones.",
        "24/7": "Yes, we provide 24/7 services and technical support.",

        // Technical & Future Proof
        "future upgrades": "Yes, future-proof architecture is used.",
        "cloud services": "Yes, cloud infrastructure support is available.",
        "maps": "Yes, interactive maps can be added.",
        "multilingual": "Yes, multilingual support is available.",
        "ui ux": "Yes, we enhance usability and design through UI/UX improvements.",
        "long term": "Yes, long-term partnerships are available.",
        "custom integrations": "Yes, fully custom integrations are supported.",
        "how to start": "Contact us through the website.",
        "headless cms": "Yes, headless CMS integrations are supported.",
        "landing pages": "Yes, conversion-focused landing pages are built.",
        "a/b testing": "Yes, A/B testing can be implemented.",
        "conversion": "Yes, UX optimization improves conversion rates.",
        "coding standards": "Yes, clean and maintainable code is used.",
        "teams": "Yes, we collaborate with internal teams.",
        "enterprise": "Yes, enterprise-grade systems are supported.",
        "real-time": "Yes, real-time systems can be built.",
        "dashboards": "Yes, analytics dashboards are supported.",
        "consulting": "Yes, technical and design consulting is offered.",
        "backups": "Yes, backup strategies can be implemented.",
        "training": "Yes, handover and training are provided.",
        "crm": "Yes, CRM integrations are supported.",
        "agile": "Yes, agile development practices are followed.",
        "database": "Yes, database performance optimization is available.",
        "saas": "Yes, SaaS development is supported.",
        "version control": "Yes, version control is used.",
        "authentication": "Yes, secure authentication can be implemented.",
        "role based": "Yes, role-based access systems are supported.",
        "ai features": "Yes, AI-powered features can be added.",
        "cross-browser": "Yes, cross-browser compatibility is ensured.",
        "monitoring": "Yes, monitoring tools are used post-launch.",
        "reports": "Yes, performance reports can be provided.",
        "loading times": "Yes, load-time optimization is done.",
        "cdn": "Yes, CDN can be integrated.",
        "microservices": "Yes, microservices architecture is supported.",
        "audits": "Yes, technical audits are available.",
        "error tracking": "Yes, error tracking is supported.",
        "refactoring": "Yes, code refactoring services are offered.",
        "notifications": "Yes, email and push notifications are supported.",

        // Featured Work Specific FAQs
        "kind of work": "Our website features selected projects that demonstrate design quality, technical execution, and real-world application across different digital products.",
        "type of projects": "The featured work highlights completed projects that focus on user experience, system functionality, and performance-driven outcomes.",
        "featured work represent": "Each featured project represents a practical solution delivered for real use cases, emphasizing clarity, usability, and scalability.",
        "real implementations": "Yes, the projects displayed as featured work are based on real implementations and completed deliverables.",
        "aspects of your projects": "The featured work highlights structure, interaction quality, system flow, and measurable improvements achieved through the project.",
        "design or functionality": "The featured projects balance both design and functionality, showing how visual decisions and technical execution work together.",
        "learn by reviewing": "By reviewing the featured work, visitors can understand our approach to problem-solving, execution quality, and attention to detail.",
        "complete solutions": "The featured works represent complete solutions rather than isolated components, covering the full scope of the project outcome.",
        "how detailed": "The featured work provides a clear overview of each project, focusing on the outcome, structure, and overall impact.",
        "work stand out": "What distinguishes the featured work is the emphasis on practical execution, clean implementation, and user-focused results.",
        "measurable results": "Where applicable, the featured work reflects improvements in usability, performance, or operational efficiency achieved through the project.",
        "experimental or production-ready": "The projects shown as featured work are production-ready implementations designed for real-world use.",
        "industries do your featured projects": "The featured work spans multiple digital use cases, focusing on adaptable solutions rather than industry-specific constraints.",
        "how recent": "The featured work includes projects that reflect current design and development standards used at the time of completion.",
        "demonstrate scalability": "Yes, scalability is a visible consideration in the architecture and structure of the featured projects.",
        "problem-solving approach": "The featured work demonstrates a structured problem-solving approach, moving from challenge identification to refined implementation.",
        "collaborative projects": "The featured projects represent collaborative efforts aligned with defined goals and structured execution.",
        "performance-focused projects": "Yes, performance optimization and efficiency improvements are key elements visible in several featured projects.",
        "level of complexity": "The featured work demonstrates the ability to handle both moderate and complex project requirements effectively.",
        "main takeaway": "The main takeaway is a clear demonstration of how thoughtful execution leads to reliable and effective digital solutions.",

        // Location Specific FAQs
        "locations mentioned": "Our website highlights a limited set of locations where our presence and operations are represented.",
        "headquarters": "Yes, the website identifies London as the primary headquarters location.",
        "regional offices": "The website showcases regional hubs that support operations in different global regions.",
        "london location play": "London is presented as the central location associated with leadership and primary operations.",
        "new york listed": "Yes, New York appears on the website as a regional hub supporting North America.",
        "new york represent": "The New York location represents regional operations and coordination within North America.",
        "presence in the asia-pacific": "Yes, the website highlights Tokyo as a regional hub serving the Asia-Pacific region.",
        "purpose of the tokyo location": "Tokyo is presented as a regional hub supporting activities within the Asia-Pacific area.",
        "active or symbolic": "The locations shown on the website represent active operational or regional presences.",
        "global coverage": "The listed locations indicate a focused global presence rather than worldwide coverage.",
        "only locations": "Only the locations displayed on the website are officially represented.",
        "support different regions": "Yes, each listed location is associated with supporting a specific geographic region.",
        "location details explained": "The website provides a clear overview of each location without going into extensive operational detail.",
        "operational structure": "Yes, the locations shown align with how regional and central operations are structured.",
        "client-facing offices": "The website presents locations as operational hubs rather than explicitly client-facing offices.",
        "regional leadership": "The regional hubs shown imply structured coordination and leadership within their respective areas.",
        "permanent or temporary": "The website represents these locations as established presences.",
        "local teams": "The locations suggest regional operational support, though team size and structure are not detailed.",
        "expansion plans": "The website focuses on current locations rather than future expansion.",
        "takeaway from your locations": "The main takeaway is a focused and structured presence across key global regions.",

        // Basic & Identity FAQs
        "where are you located": "Our locations are highlighted on the website, including our headquarters and regional hubs.",
        "operate from": "We operate from a limited number of locations that are officially listed on our website.",
        "works available": "Our website presents featured projects that demonstrate our approach, execution quality, and outcomes.",
        "past projects": "Yes, the website includes featured work representing completed and implemented projects.",
        "vision": "Our vision is to build meaningful digital solutions that focus on clarity, usability, and long-term value.",
        "mission": "Our mission is to consistently deliver well-structured, reliable, and impactful digital outcomes.",
        "aim to achieve": "We aim to create solutions that solve real problems through thoughtful design and execution.",
        "overall focus": "Our overall focus is on delivering quality-driven digital work with attention to detail and performance.",
        "expect to find": "Visitors can explore information about our work, locations, team, and overall approach.",
        "goals": "Yes, the website outlines our vision, mission, and the principles that guide our work.",
        "showcase services or work": "The website primarily focuses on showcasing our work, approach, and organizational presence.",
        "intended for": "The website is intended for visitors who want to understand our work, structure, and direction.",
        "explain what you do": "Yes, the website provides a clear overview of what we do and how our work is presented.",
        "main purpose": "The main purpose of the website is to present our identity, featured work, and operational presence.",

        // Greetings
        "hi": "Welcome to VORTEX! How can I help you today?",
        "hello": "Welcome to VORTEX! How can I help you today?",
        "hey": "Welcome to VORTEX! How can I help you today?",

        // Process & Timeline (User Specific)
        "process": "Our 6-step work process is:\n1. Discovery: Defining the roadmap.\n2. Design: High-fidelity layouts.\n3. Development: Clean, performant code.\n4. Deployment: Seamless launch.\n5. Optimization: Refining performance.\n6. Scaling: Automated infrastructure growth.",
        "step by step": "Our 6-step work process is:\n1. Discovery: Defining the roadmap.\n2. Design: High-fidelity layouts.\n3. Development: Clean, performant code.\n4. Deployment: Seamless launch.\n5. Optimization: Refining performance.\n6. Scaling: Automated infrastructure growth.",
        "how long": "Typical projects take between 4 to 8 weeks.",
        "timeline": "Typical projects take between 4 to 8 weeks.",

        // Clients
        "clients": "Yeah sure! Let me show you our client reviews and ratings.",
        "client": "Yeah sure! Let me show you our client reviews and ratings.",
        "testimonials": "Yeah sure! Scrolling you to our client success stories now.",

        // Contact
        "contact": "You can contact us via email, phone, or the website contact form.",
        "how can i contact": "You can contact us via email, phone, or the website contact form."
    };

    // Restore chat history
    messages.innerHTML = localStorage.getItem("chatHistory") ||
        '<div class="message bot-message">👋 Hi! How can I help you today?</div>';
    messages.scrollTop = messages.scrollHeight;

    toggle.addEventListener("click", () => {
        container.classList.toggle("active");
    });

    closeBtn.addEventListener("click", () => {
        container.classList.remove("active");
    });

    function saveHistory() {
        localStorage.setItem("chatHistory", messages.innerHTML);
    }

    function scrollIntoView(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function getResponse(userText) {
        const text = userText.toLowerCase();

        // Priority 1: Specific Work Process / Steps
        if (text.includes("process") || text.includes("step by step") || text.includes("how we work") || (text.includes("work") && text.includes("process"))) {
            scrollIntoView('#process');
            return KNOWLEDGE_BASE["process"];
        }

        // Priority 1.5: Service Hours
        if (text.includes("service hour") || text.includes("working hour") || text.includes("24/7") || (text.includes("how many") && text.includes("hour"))) {
            return KNOWLEDGE_BASE["hours"];
        }

        // Priority 2: Project Counts / Achievements
        if ((text.includes("how many") && text.includes("project")) || text.includes("how much projects") || text.includes("completed projects")) {
            return "At VORTEX, we have successfully completed more than 150 projects over our 10+ years of operation.";
        }

        // Priority 3: Specific Section Selection (Direct Scrolling)
        if (text.includes("contact") || text.includes("hire") || text.includes("email")) {
            scrollIntoView('#contact');
            if (text.includes("how") || text.includes("can i")) return KNOWLEDGE_BASE["contact"];
        }
        if (text.includes("client") || text.includes("testimonial") || text.includes("rating")) {
            scrollIntoView('#testimonials');
            return KNOWLEDGE_BASE["clients"];
        }
        if (text.includes("team") || text.includes("founder")) {
            scrollIntoView('#team');
            return KNOWLEDGE_BASE["team"] || "Meet our world-class team of engineers and designers.";
        }
        if (text.includes("featured work") || text.includes("portfolio") || text.includes("projects") || text.includes("works") || (text.includes("work") && !text.includes("process") && !text.includes("hour"))) {
            scrollIntoView('#portfolio');
            return KNOWLEDGE_BASE["projects"];
        }
        if (text.includes("location") || text.includes("where are you") || text.includes("office") || text.includes("headquarter") || text.includes("hub") || text.includes("available in") || text.includes("available on")) {
            scrollIntoView('#map-hub');
            // Check for specific location hub names will happen in the loop below
        }
        if (text.includes("about vortex") || text === "vortex" || text.includes("who is vortex") || text.includes("what is vortex")) {
            scrollIntoView('#about');
            return KNOWLEDGE_BASE["vortex"];
        }

        // Specific Location Hub Keywords check (if not caught by loop)
        if (text.includes("london") || text.includes("tokyo") || text.includes("new york")) {
            scrollIntoView('#map-hub');
            // The loop will provide the specific answer.
        }

        // Search KNOWLEDGE_BASE for generic keywords
        const keys = Object.keys(KNOWLEDGE_BASE);
        // Sort keys by length DESC to match longer phrases first
        keys.sort((a, b) => b.length - a.length);

        for (const key of keys) {
            if (text.includes(key)) {
                return KNOWLEDGE_BASE[key];
            }
        }

        // Location Fallback (Only if no specific location was matched above)
        const locationKeywords = ["location", "office", "where are you", "headquarter", "hub", "available in", "available on"];
        if (locationKeywords.some(kw => text.includes(kw))) {
            return "That information is not currently included in the locations shown on our website.";
        }

        // Featured Work Fallback
        if (text.includes("featured work")) {
            return "The requested information is not currently available within our featured work section.";
        }

        // Friendly fallback
        return "That information is not currently covered on our website. However, I can still help you find our 'team', 'work', or show you how to 'contact' us! You can also email us directly at hello@vortex.engineering.";
    }

    window.sendMessage = function () {
        const text = input.value.trim();
        if (!text) return;

        // User message
        const userMsg = document.createElement("div");
        userMsg.className = "message user-message";
        userMsg.textContent = text;
        messages.appendChild(userMsg);

        input.value = "";
        messages.scrollTop = messages.scrollHeight;
        saveHistory();

        showTyping();

        // Simulate "thinking" time for a better UX
        setTimeout(() => {
            removeTyping();

            const reply = getResponse(text);
            const botMsg = document.createElement("div");
            botMsg.className = "message bot-message";
            botMsg.textContent = reply;
            messages.appendChild(botMsg);

            messages.scrollTop = messages.scrollHeight;
            saveHistory();
        }, 600);
    };

    function showTyping() {
        const typingDiv = document.createElement("div");
        typingDiv.className = "message bot-message typing";
        typingDiv.id = "typingIndicator";
        typingDiv.innerHTML = "<span></span><span></span><span></span>";
        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById("typingIndicator");
        if (typing) typing.remove();
    }

    input.addEventListener("keypress", e => {
        if (e.key === "Enter") sendMessage();
    });
});
