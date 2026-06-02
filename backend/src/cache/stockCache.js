import NodeCache from "node-cache";

const stockCache = new NodeCache({
  stdTTL: 60,
  checkperiod: 120,
});

export default stockCache;