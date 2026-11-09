const memory = new Map<string,string>();
const store = { getItem:(k:string)=>{try{return localStorage.getItem(k)}catch{return memory.get(k)??null}}, setItem:(k:string,v:string)=>{try{localStorage.setItem(k,v)}catch{memory.set(k,v)}} };
export const load = <T,>(key:string, fallback:T):T => { try { const x=store.getItem(key); return x ? JSON.parse(x) as T : fallback } catch { return fallback } };
export const save = <T,>(key:string,value:T) => store.setItem(key,JSON.stringify(value));
