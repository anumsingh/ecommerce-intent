import requests
from bs4 import BeautifulSoup
import re
import urllib.parse
import json
from .base_scraper import should_exclude_item

def clean_price(price_str):
    try:
        no_commas = str(price_str).replace(",", "")
        match = re.search(r"(\d+(?:\.\d+)?)", no_commas)
        if match:
            return int(float(match.group(1)))
        return 0
    except:
        return 0

def scrape_myntra(query):
    """
    Myntra Scraper: Enhanced JSON extraction from window.__myx script.
    """
    print(f"Searching Myntra (JSON) for: {query}")
    results = []
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.myntra.com/",
    }

    try:
        url = f"https://www.myntra.com/{urllib.parse.quote(query)}"
        response = requests.get(url, headers=headers, timeout=15)
        
        if response.status_code != 200:
            print(f"Myntra Error: Received status {response.status_code}")
            return []

        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract data from script tag
        script_tag = soup.find('script', string=re.compile(r'window\.__myx\s*='))
        if not script_tag:
            print("Myntra Error: window.__myx script not found.")
            return []
            
        # Use more robust regex to capture the entire JSON object
        match = re.search(r'window\.__myx\s*=\s*({.*})', script_tag.string)
        if not match:
            print("Myntra Error: Could not match JSON in script.")
            return []
            
        json_text = match.group(1)
        data = json.loads(json_text)
        
        # Access search results in the JSON structure
        products = data.get('searchData', {}).get('results', {}).get('products', [])
        print(f"Myntra Raw JSON Items Found: {len(products)}")
        
        for p in products[:20]:
            title = f"{p.get('brand', '')} {p.get('productName', '')}".strip()
            if should_exclude_item(title, query): continue
            
            price = clean_price(p.get('price', 0))
            if price == 0: continue
            
            link = p.get('landingPageUrl', '')
            if link and not link.startswith('http'):
                link = "https://www.myntra.com/" + link.lstrip('/')
            
            # Image usually requires a base URL or is a full URL
            # Myntra images in JSON often look like "assets/..."
            img_id = p.get('searchImage', '')
            img_url = img_id if img_id.startswith('http') else f"https://assets.myntassets.com/h_600,q_90,w_450/v1/assets/{img_id}"

            # Rating and Reviews
            rating = round(float(p.get('rating', 4.2)), 1)
            reviews = int(p.get('ratingCount', 0))

            results.append({
                "title": title,
                "price": price,
                "image": img_url,
                "link": link,
                "rating": rating,
                "reviews": reviews,
                "website": "Myntra"
            })
                
        print(f"Myntra Scraper: Found {len(results)} items.")
        return results
    except Exception as e:
        print(f"Myntra Scraper Error: {e}")
        return []
