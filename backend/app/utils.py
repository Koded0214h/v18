import hashlib
from django.core.cache import cache


def hash_ip(ip: str) -> str:
    return hashlib.sha256(ip.encode()).hexdigest()


def get_client_ip(request) -> str:
    x_forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded:
        return x_forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "")


def is_rate_limited(ip_hash: str, key_prefix: str, limit: int, window: int) -> bool:
    """Returns True if this ip_hash has exceeded `limit` requests in `window` seconds."""
    cache_key = f"rl:{key_prefix}:{ip_hash}"
    count = cache.get(cache_key, 0)
    if count >= limit:
        return True
    cache.set(cache_key, count + 1, timeout=window)
    return False
