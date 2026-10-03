import requests
import re
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


def scrape_amazon(query):
    """
    Amazon Scraper: Uses requests + BeautifulSoup with strong anti-bot headers.
    Falls back to empty list gracefully if Amazon blocks.
    """
    from bs4 import BeautifulSoup

    print(f"Searching Amazon for: {query}")
    results = []

    # Rotate through a few user agents to reduce blocking
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/125.0.0.0 Safari/537.36"
        ),
        "Accept": (
            "text/html,application/xhtml+xml,application/xml;"
            "q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,"
            "application/signed-exchange;v=b3;q=0.7"
        ),
        "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "Cache-Control": "max-age=0",
        "DNT": "1",
    }

    session = requests.Session()
    session.headers.update(headers)

    try:
        url = f"https://www.amazon.in/s?k={urllib.parse.quote(query)}&ref=nb_sb_noss"
        response = session.get(url, timeout=20)

        print(f"Amazon Status: {response.status_code} | Length: {len(response.text)}")

        if response.status_code != 200:
            print(f"Amazon Error: Received status {response.status_code}")
            return []

        # If Amazon returned a CAPTCHA / bot-block page, bail
        # Real block pages are tiny (<10KB) and contain specific phrases
        page_lower = response.text.lower()
        is_blocked = (
            len(response.text) < 10000 or
            ("enter the characters you see below" in page_lower) or
            ("type the characters you see in this image" in page_lower) or
            ("automated access" in page_lower and len(response.text) < 50000)
        )
        if is_blocked:
            print("Amazon: Bot-check/CAPTCHA detected. Returning empty results.")
            return []

        soup = BeautifulSoup(response.content, 'html.parser')
        items = soup.select('div[data-component-type="s-search-result"]')
        print(f"Amazon Raw Items Found: {len(items)}")

        for item in items[:20]:
            # ── Title ──────────────────────────────────────────────────────
            title_elem = (
                item.select_one('h2 a span') or
                item.select_one('.a-size-medium.a-color-base.a-text-normal') or
                item.select_one('.a-size-base-plus.a-color-base.a-text-normal') or
                item.select_one('h2 span')
            )

            # ── Price ──────────────────────────────────────────────────────
            price_elem = (
                item.select_one('span.a-price-whole') or
                item.select_one('.a-price .a-offscreen')
            )

            # ── Image ──────────────────────────────────────────────────────
            img_elem = item.select_one('img.s-image')

            # ── Link ───────────────────────────────────────────────────────
            link_elem = (
                item.select_one('h2 a') or
                item.select_one('a.a-link-normal[href*="/dp/"]') or
                item.select_one('a.a-link-normal.s-no-outline')
            )

            # ── Rating ─────────────────────────────────────────────────────
            rating_elem = item.select_one('span.a-icon-alt')

            if not price_elem:
                continue
            if not (title_elem or link_elem):
                continue

            title = title_elem.text.strip() if title_elem else (
                link_elem.get('title', '').strip() if link_elem else ""
            )
            if not title:
                continue
            if should_exclude_item(title, query):
                continue

            price = clean_price(price_elem.text)
            if price == 0:
                continue

            link = link_elem['href'] if link_elem and link_elem.get('href') else ""
            if link and not link.startswith('http'):
                link = "https://www.amazon.in" + link

            img_url = img_elem.get('src', '') if img_elem else "https://via.placeholder.com/150"

            # ── Rating as float ────────────────────────────────────────────
            rating = 4.0
            if rating_elem:
                r_match = re.search(r"(\d+\.?\d*)", rating_elem.text)
                if r_match:
                    rating = round(float(r_match.group(1)), 1)

            # ── Review count ───────────────────────────────────────────────
            reviews = 0
            # Try aria-label on star parent link
            stars_icon = item.select_one('i.a-icon-star-small, i.a-icon-star')
            if stars_icon:
                parent_a = stars_icon.find_parent('a')
                if parent_a and parent_a.get('aria-label'):
                    aria_match = re.search(r"stars\s+([\d,]+)", parent_a.get('aria-label'))
                    if aria_match:
                        reviews = int(aria_match.group(1).replace(',', ''))

            if reviews == 0:
                rev_span = item.select_one('span.a-size-base.s-underline-text')
                if rev_span:
                    rev_match = re.search(r"[\d,]+", rev_span.text)
                    if rev_match:
                        reviews = int(rev_match.group().replace(',', ''))

            results.append({
                "title": title,
                "price": price,
                "image": img_url,
                "link": link,
                "rating": rating,
                "reviews": reviews,
                "website": "Amazon",
                "is_best_seller": bool(item.select_one('.a-badge-text')),
                "is_prime": bool(item.select_one('.s-prime-label, [aria-label*="Prime"]'))
            })

        print(f"Amazon Scraper: Found {len(results)} items.")
        return results

    except Exception as e:
        print(f"Amazon Scraper Error: {e}")
        return []
