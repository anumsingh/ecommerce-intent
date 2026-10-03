import requests
import re
import time
import urllib.parse
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


def _get_ajio_session():
    """
    Create a warmed-up session by hitting the homepage first,
    so Akamai's bot-detection assigns a valid session token.
    """
    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0",
    }
    try:
        session.get("https://www.ajio.com/", headers=headers, timeout=15)
        time.sleep(1.5)
    except Exception:
        pass
    return session


def scrape_ajio(query):
    """
    Ajio Scraper: Uses Ajio's internal JSON API with a session-warmed approach.
    Falls back gracefully if Akamai blocks the request.
    """
    print(f"Searching Ajio (JSON API) for: {query}")
    results = []

    session = _get_ajio_session()

    api_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": f"https://www.ajio.com/search/?text={urllib.parse.quote(query)}",
        "Origin": "https://www.ajio.com",
        "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
    }

    params = {
        "query": query,
        "pageSize": 20,
        "currentPage": 0,
        "format": "json",
    }

    try:
        response = session.get(
            "https://www.ajio.com/api/search",
            params=params,
            headers=api_headers,
            timeout=20
        )

        if response.status_code == 403:
            print("Ajio: Access Denied (Akamai IP block). Returning empty results.")
            return []

        if response.status_code != 200:
            print(f"Ajio API Error: status {response.status_code}")
            return []

        # Check if response is JSON
        content_type = response.headers.get("Content-Type", "")
        if "json" not in content_type:
            print(f"Ajio: Unexpected content type: {content_type}")
            return []

        data = response.json()
        products = data.get("products", [])
        
        # Fallback for category/brand redirects (like "lakme lipstick")
        if not products and data.get("currentQuery", {}).get("url"):
            print(f"Ajio Redirect Detected. Retrying with modified query to bypass curated category.")
            retry_query = query + " online"
            params["query"] = retry_query
            api_headers["Referer"] = f"https://www.ajio.com/search/?text={urllib.parse.quote(retry_query)}"
            r2 = session.get("https://www.ajio.com/api/search", params=params, headers=api_headers, timeout=20)
            if r2.status_code == 200:
                data2 = r2.json()
                products = data2.get("products", [])
            else:
                print(f"Ajio Retry failed: {r2.status_code}")
                
        print(f"Ajio Raw Items Found: {len(products)}")

        for p in products[:20]:
            # ── Title ──────────────────────────────────────────────────────
            brand = (
                p.get("fnlColorVariantData", {}).get("brandName", "") or
                p.get("brandName", "") or
                p.get("brand", {}).get("name", "") if isinstance(p.get("brand"), dict) else ""
            )
            name = p.get("name", "") or p.get("productType", "")
            title = f"{brand} {name}".strip()

            if not title:
                continue
            if should_exclude_item(title, query):
                continue

            # ── Price ──────────────────────────────────────────────────────
            price = 0
            price_data = p.get("price", {})
            if isinstance(price_data, dict):
                price = clean_price(
                    price_data.get("formattedValue", "") or
                    str(price_data.get("value", 0))
                )
            elif isinstance(price_data, (int, float)):
                price = int(price_data)

            # Fallback price fields
            if price == 0:
                price = clean_price(str(p.get("wasPriceData", {}).get("formattedValue", "0")))
            if price == 0:
                for key in ["specialPrice", "sellingPrice", "mrp"]:
                    if p.get(key):
                        price = clean_price(str(p[key]))
                        break

            if price == 0:
                continue

            # ── Link ───────────────────────────────────────────────────────
            slug = (
                p.get("url", "") or
                p.get("pdpURL", "") or
                p.get("fnlColorVariantData", {}).get("pdpURL", "")
            )
            link = f"https://www.ajio.com{slug}" if slug and not slug.startswith("http") else slug

            # ── Image ──────────────────────────────────────────────────────
            images = p.get("images", [])
            img_url = ""
            if images and isinstance(images[0], dict):
                img_url = images[0].get("url", "")
                if img_url and not img_url.startswith("http"):
                    img_url = "https://assets.ajio.com" + img_url
            if not img_url:
                img_url = "https://via.placeholder.com/150"

            # ── Rating / Reviews ───────────────────────────────────────────
            rating  = round(float(p.get("averageRating", 4.1) or 4.1), 1)
            reviews = int(p.get("numberOfReviews", 0) or p.get("ratingCount", 0) or 150)

            results.append({
                "title": title,
                "price": price,
                "image": img_url,
                "link": link,
                "rating": rating,
                "reviews": reviews,
                "website": "Ajio"
            })

        print(f"Ajio Scraper: Found {len(results)} items.")
        return results

    except Exception as e:
        print(f"Ajio Scraper Error: {e}")
        return []
