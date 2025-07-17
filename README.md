
# 🪙 ETH Tick Analytics in KDB+/q

A real-time Ethereum trade analytics system using KDB+. It captures tick data, performs rolling analytics like VWAP and standard deviation, and optionally saves data to CSV.

---

## 📂 Project Structure

```
eth-tick-analytics/
├── tick.q               # Main real-time ingestion + analytics script
├── tradesETH.csv        # Auto-exported trade data (optional)
├── analytics.q          # Manual analytics and visual exploration
├── README.md            # Project documentation
```

---

## 🚀 Getting Started

1. **Install KDB+**  
   Download from [https://kx.com/download/](https://kx.com/download/)

2. **Run the system**

```bash
q tick.q
```

You’ll see:
```
"Listening on port 5000"
```

---

## 💾 Sample Data Format

```q
en[`trade; (`time`price`size)! (.z.p; 2985.3; 0.014)]
```

---

## 📊 Available Analytics

Calculated every 30 seconds:

- VWAP (Volume Weighted Average Price)
- Standard Deviation (price)
- Moving Std Dev (5-trade window)
- OHLC per minute

---

## 📝 Manual Export

```q
saveToCSV: {`:hdb/tradesETH.csv 0: csv 0: select from tradesETH}
```

---

## 🧪 Sample Queries

```q
/ VWAP
select vwap: sum price * size % sum size by time.minute from tradesETH

/ OHLC
select open: first price, high: max price, low: min price, close: last price by time.minute from tradesETH

/ Moving Std Dev
select 5 mdev price from tradesETH
```

---

## 🌐 API (Optional)

To serve data via API in q (if `.qsp.q` is available):

```q
.qsp.use[`GET; `/analytics; getAnalytics]
```

Then query using:

```bash
curl http://localhost:5000/analytics
```

---

## 🛠 To-Do

- ✅ Real-time ingestion
- ✅ Auto-saving to CSV
- ✅ Rolling analytics
- [ ] Visualization in React
- [ ] Python integration
- [ ] Docker setup (optional)

---

## 🤝 Contributions

Pull requests are welcome. Let's build cool tools for crypto data.
