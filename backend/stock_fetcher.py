import sys
import json
import traceback
import yfinance as yf


def get_stock(symbol):
    try:
        yahoo_symbol = symbol

        if symbol.isdigit():
            yahoo_symbol = f"{symbol}.KS"

        ticker = yf.Ticker(yahoo_symbol)

        info = ticker.info

        current_price = (
            info.get("currentPrice")
            or info.get("regularMarketPrice")
            or 0
        )

        previous_close = (
            info.get("previousClose")
            or current_price
        )

        change = current_price - previous_close

        change_percent = (
            (change / previous_close) * 100
            if previous_close
            else 0
        )

        result = {
            "success": True,
            "symbol": symbol,
            "marketSymbol": yahoo_symbol,
            "name": info.get("longName")
            or info.get("shortName")
            or symbol,
            "currentPrice": round(float(current_price), 2),
            "previousClose": round(float(previous_close), 2),
            "change": round(float(change), 2),
            "changePercent": round(float(change_percent), 2),
            "high": round(
                float(info.get("dayHigh") or current_price),
                2
            ),
            "low": round(
                float(info.get("dayLow") or current_price),
                2
            ),
            "currency": info.get("currency", "KRW"),
            "exchange": info.get("exchange", ""),
            "timestamp": info.get("regularMarketTime")
        }

        print(json.dumps(result))

    except Exception as error:
        print(
            json.dumps(
                {
                    "success": False,
                    "message": str(error),
                    "trace": traceback.format_exc()
                }
            )
        )


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(
            json.dumps(
                {
                    "success": False,
                    "message": "Stock symbol required"
                }
            )
        )
        sys.exit(1)

    symbol = sys.argv[1]

    get_stock(symbol)