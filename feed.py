import pykx as kx
import requests
import datetime
import time

# Connect to q process on port 5000
q = kx.QConnection(host='localhost', port=5000)

# Convert milliseconds to q timestamp (nanoseconds since 2000.01.01)
def to_q_timestamp(ms):
    dt = datetime.datetime.utcfromtimestamp(ms / 1000.0)
    return kx.TimestampAtom(dt)

# Fetch latest ETH trades and insert into KDB
def fetch_and_send():
    url = "https://api.binance.com/api/v3/trades?symbol=ETHUSDT&limit=10"
    try:
        resp = requests.get(url)
        trades = resp.json()

        for t in trades:
            ts = to_q_timestamp(t['time'])          # q timestamp
            price = float(t['price'])               # q float
            size = float(t['qty'])                  # q float

            # Insert into tradesETH
            q('`tradesETH insert', [ts, price, size])

        print("Batch sent.")

        #print(q('select from tradesETH').pd())

    except Exception as e:
        print(f"Error: {e}")

# Poll every 5 seconds
while True:
    fetch_and_send()
    time.sleep(5)
