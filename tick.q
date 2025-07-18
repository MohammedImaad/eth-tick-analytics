\p 5000
tradesETH:([] time:`timestamp$(); price:`float$(); size:`float$())
"Listening on port 5000"
saveToCSV: {`:hdb/tradesETH.csv 0: csv 0: select from tradesETH}
recalculateAnalytics: {saveToCSV[];vwapPerMin: select vwap: sum price * size % sum size by time.minute from tradesETH;stdDev: select dev price from tradesETH;mvDev: select 5 mdev price from tradesETH;vwap: select vwap: sum price * size % sum size from tradesETH;`mvDev`stdDev`vwap! (mvDev; stdDev; vwap);`:hdb/mvDev.csv 0: csv 0: mvDev;`:hdb/vwap.csv 0: csv 0: vwap;`:hdb/stdDev.csv 0: csv 0: stdDev;}
.z.ts: recalculateAnalytics
\t 30000 
