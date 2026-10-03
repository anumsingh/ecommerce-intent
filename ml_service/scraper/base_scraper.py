from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time

def get_driver():
    """Headless Chrome driver factory with stealth settings."""
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    
    # Modern User-Agent to avoid detection
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option("useAutomationExtension", False)
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    # Remove navigator.webdriver property
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    })
    
    driver.set_page_load_timeout(30)
    return driver

def wait_for_element(driver, selector, by=By.CSS_SELECTOR, timeout=15):
    """Wait explicitly for an element to appear in the DOM."""
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((by, selector))
        )
        return element
    except Exception as e:
        print(f"Wait Error: Timeout for {selector}")
        return None

def scroll_page(driver):
    """Slow scroll to trigger lazy loading of images"""
    total_height = int(driver.execute_script("return document.body.scrollHeight"))
    for i in range(1, total_height, 1000):
        driver.execute_script(f"window.scrollTo(0, {i});")
        time.sleep(0.5)

def should_exclude_item(title, query):
    """Filter out accessories and handle category relevance (Fashion, Beauty, Electronics priority)"""
    title_lower = title.lower()
    query_lower = query.lower()
    
    # Common accessory and unrelated keywords
    accessories = ["guard", "adapter", "cable", "pouch", "stand", "holder", "sticker", "decal", "mount", "backpack", "wallet", "battery", "charger", "cord"]
    
    # Category mappings with extensive synonyms
    category_map = {
        "shirt": ["shirt", "t-shirt", "top", "tee", "kurta", "kurti", "tshirt", "polo", "polos"],
        "shoe": ["shoe", "sneaker", "boot", "sandal", "footwear", "loafer", "heel", "pump", "flat", "crocs", "clog", "flip flop"],
        "watch": ["watch", "wristwatch", "timepiece", "chronograph", "smartwatch"],
        "dress": ["dress", "gown", "sari", "saree", "skirt", "frock", "lehenga", "suit"],
        "makeup": ["makeup", "beauty", "cosmetic", "lipstick", "kohl", "mascara", "polish", "palette", "blush", "foundation", "primer", "concealer", "lip", "liner", "eyeshadow", "face", "brush", "pencil", "gel", "kajal"],
        "skincare": ["cream", "lotion", "serum", "cleaner", "wash", "moisturizer", "sunscreen", "skincare", "mask", "skin", "body", "oil"],
        "toy": ["toy", "doll", "action figure", "puzzle", "game", "lego", "plush", "playing"],
        "electronics": ["laptop", "phone", "mobile", "tablet", "earphone", "headphone", "speaker", "camera", "tv", "television", "monitor", "mouse", "keyboard"]
    }
    
    allow_set_kit = ["makeup", "skincare", "toy", "electronics"]
    
    active_category = None
    for cat, synonyms in category_map.items():
        if cat in query_lower or any(syn in query_lower for syn in synonyms):
            active_category = cat
            break
            
    # RULE 1: STRICT CATEGORY ENFORCEMENT
    if active_category:
        syns = category_map[active_category] + [active_category]
        if not any(syn in title_lower for syn in syns):
            # print(f"Excluded by RULE 1 (Category): {title}")
            return True

    # RULE 2: ACCESSORY FILTERING
    for acc in accessories:
        if acc in title_lower:
            if acc not in query_lower:
                if active_category in allow_set_kit and acc in ["bag", "pouch", "case"]:
                    continue
                # print(f"Excluded by RULE 2 (Accessory '{acc}'): {title}")
                return True

    # RULE 3: NOISE BUNDLE FILTERING
    noise = ["accessory", "accessories", "combo", "pieces", "pcs"]
    for word in noise:
        if word in title_lower:
            if word not in query_lower:
                # print(f"Excluded by RULE 3 (Noise '{word}'): {title}")
                return True
                
    return False
