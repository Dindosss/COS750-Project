export interface Player { index:number; playing:boolean; speed:number }
export const initialPlayer: Player = { index:0, playing:false, speed:800 };
export const clampStep = (index:number, length:number) => Math.max(0,Math.min(index,length-1));
