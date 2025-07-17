\p 5000
tradesETH:([] time:`timestamp$(); price:`float$(); size:`float$())
"Listening on port 5000"
saveToCSV: {`:hdb/tradesETH.csv 0: csv 0: select from tradesETH}
recalculateAnalytics: {vwapPerMin: select vwap: sum price * size % sum size by time.minute from tradesETH;stdDev: select dev price from tradesETH;mvDev: select 5 mdev price from tradesETH;vwap: select vwap: sum price * size % sum size from tradesCSV;analyticsResult: `mvDev`stdDev`vwap! (mvDev; stdDev; vwap);}
.z.ts: recalculateAnalytics
\t 30000 
