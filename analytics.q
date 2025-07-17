read0 `:hdb/tradesETH.csv
lines: read0 `:hdb/tradesETH.csv
header: "," vs first lines
data: "," vs/: 1 _ lines
toTimestamp:{"D"$"."sv("/"vs x)2 0 1}
toFloat:{[x] :$[x~""; enlist 0n; `float$x] }
timeCol: "Z" $ data@\:0;
priceCol: "F"$ data@\:1;
sizeCol: "F"$ data@\:2;
tradesCSV: flip `time`price`size! (timeCol; priceCol; sizeCol);
vwapPerMin: select vwap: sum price * size % sum size by time.minute from tradesCSV;
ohlc: select open: first price, high: max price, low: min price, close: last price by time.minute from tradesCSV;
stdDev: select dev price from tradesCSV;
mvDev: select 5 mdev price from tradesCSV;
vwap: select vwap: sum price * size % sum size from tradesCSV;
vwap
