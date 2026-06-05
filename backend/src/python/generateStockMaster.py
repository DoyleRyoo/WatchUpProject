import csv
import os
import sys

import FinanceDataReader as fdr


MARKETS = [
    ("KRX", "KR"),
    ("NASDAQ", "US"),
    ("NYSE", "US"),
    ("AMEX", "US"),
]


def normalize_symbol(code, market):
    symbol = str(code).strip()

    if market == "KRX" and not symbol.endswith(".KS"):
        return f"{symbol}.KS"

    return symbol


def generate(output_path):
    rows = []

    for market, country in MARKETS:
        print(f"[STOCK MASTER] Fetching {market} listings...", flush=True)
        listing = fdr.StockListing(market)

        for _, stock in listing.iterrows():
            code = stock.get("Code")
            name = stock.get("Name")

            if not code or not name:
                continue

            rows.append(
                {
                    "symbol": normalize_symbol(code, market),
                    "name": str(name).strip(),
                    "market": market,
                    "country": country,
                }
            )

        print(f"[STOCK MASTER] {market} listings loaded.", flush=True)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, "w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(
            csv_file,
            fieldnames=["symbol", "name", "market", "country"],
        )
        writer.writeheader()
        writer.writerows(rows)

    print(f"[STOCK MASTER] CSV generated: {output_path} ({len(rows)} rows)", flush=True)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("[STOCK MASTER] Output path is required.", file=sys.stderr)
        sys.exit(1)

    try:
        generate(sys.argv[1])
    except Exception as error:
        print(f"[STOCK MASTER] Failed to generate CSV: {error}", file=sys.stderr)
        sys.exit(1)
