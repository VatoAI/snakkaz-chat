import{r as J}from"./vendor-react-CkjGjP8g.js";function je(e){var t,r,a="";if(typeof e=="string"||typeof e=="number")a+=e;else if(typeof e=="object")if(Array.isArray(e)){var n=e.length;for(t=0;t<n;t++)e[t]&&(r=je(e[t]))&&(a&&(a+=" "),a+=r)}else for(r in e)e[r]&&(a&&(a+=" "),a+=r);return a}function st(){for(var e,t,r=0,a="",n=arguments.length;r<n;r++)(e=arguments[r])&&(t=je(e))&&(a&&(a+=" "),a+=t);return a}const Ae=e=>typeof e=="boolean"?`${e}`:e===0?"0":e,qe=st,na=(e,t)=>r=>{var a;if((t==null?void 0:t.variants)==null)return qe(e,r==null?void 0:r.class,r==null?void 0:r.className);const{variants:n,defaultVariants:o}=t,s=Object.keys(n).map(h=>{const f=r==null?void 0:r[h],v=o==null?void 0:o[h];if(f===null)return null;const b=Ae(f)||Ae(v);return n[h][b]}),c=r&&Object.entries(r).reduce((h,f)=>{let[v,b]=f;return b===void 0||(h[v]=b),h},{}),u=t==null||(a=t.compoundVariants)===null||a===void 0?void 0:a.reduce((h,f)=>{let{class:v,className:b,...M}=f;return Object.entries(M).every(p=>{let[k,O]=p;return Array.isArray(O)?O.includes({...o,...c}[k]):{...o,...c}[k]===O})?[...h,v,b]:h},[]);return qe(e,s,u,r==null?void 0:r.class,r==null?void 0:r.className)};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Ge=(...e)=>e.filter((t,r,a)=>!!t&&t.trim()!==""&&a.indexOf(t)===r).join(" ").trim();/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ct={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=J.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:a,className:n="",children:o,iconNode:s,...c},u)=>J.createElement("svg",{ref:u,...ct,width:t,height:t,stroke:e,strokeWidth:a?Number(r)*24/Number(t):r,className:Ge("lucide",n),...c},[...s.map(([h,f])=>J.createElement(h,f)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=(e,t)=>{const r=J.forwardRef(({className:a,...n},o)=>J.createElement(lt,{ref:o,iconNode:t,className:Ge(`lucide-${it(e)}`,a),...n}));return r.displayName=`${e}`,r};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oa=i("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sa=i("BellRing",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}],["path",{d:"M4 2C2.8 3.7 2 5.7 2 8",key:"tap9e0"}],["path",{d:"M22 8c0-2.3-.8-4.3-2-6",key:"5bb3ad"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ia=i("Bell",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ca=i("Bitcoin",[["path",{d:"M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727",key:"yr8idg"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const la=i("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const da=i("ChartColumnIncreasing",[["path",{d:"M13 17V9",key:"1fwyjl"}],["path",{d:"M18 17V5",key:"sfb6ij"}],["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ua=i("ChartNoAxesColumnIncreasing",[["line",{x1:"12",x2:"12",y1:"20",y2:"10",key:"1vz5eb"}],["line",{x1:"18",x2:"18",y1:"20",y2:"4",key:"cun8e5"}],["line",{x1:"6",x2:"6",y1:"20",y2:"16",key:"hq0ia6"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ha=i("CheckCheck",[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ma=i("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fa=i("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ya=i("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ga=i("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pa=i("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ba=i("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ka=i("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wa=i("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xa=i("CirclePlus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const va=i("CircleX",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ma=i("Circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ca=i("ClipboardCheck",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"m9 14 2 2 4-4",key:"df797q"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sa=i("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pa=i("CloudUpload",[["path",{d:"M12 13v8",key:"1l5pq0"}],["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"m8 17 4-4 4 4",key:"1quai1"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oa=i("Code",[["polyline",{points:"16 18 22 12 16 6",key:"z7tu5w"}],["polyline",{points:"8 6 2 12 8 18",key:"1eg1df"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const za=i("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Da=i("Crown",[["path",{d:"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",key:"1vdc57"}],["path",{d:"M5 21h14",key:"11awu3"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ta=i("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Aa=i("Ellipsis",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qa=i("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wa=i("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const La=i("FileArchive",[["path",{d:"M10 12v-1",key:"v7bkov"}],["path",{d:"M10 18v-2",key:"1cjy8d"}],["path",{d:"M10 7V6",key:"dljcrl"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M15.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 .274 1.01",key:"gkbcor"}],["circle",{cx:"10",cy:"20",r:"2",key:"1xzdoj"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ea=i("FileSpreadsheet",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fa=i("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ha=i("FileUp",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"m15 15-3-3-3 3",key:"15xj92"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ra=i("File",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ya=i("Film",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M3 7.5h4",key:"zfgn84"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 16.5h4",key:"1230mu"}],["path",{d:"M17 3v18",key:"in4fa5"}],["path",{d:"M17 7.5h4",key:"myr1c1"}],["path",{d:"M17 16.5h4",key:"go4c1d"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ia=i("FolderPlus",[["path",{d:"M12 10v6",key:"1bos4e"}],["path",{d:"M9 13h6",key:"1uhe8q"}],["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Na=i("Folder",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Va=i("Gift",[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ja=i("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ga=i("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _a=i("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xa=i("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ba=i("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ua=i("KeyRound",[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qa=i("Key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $a=i("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Za=i("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ja=i("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ka=i("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const en=i("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tn=i("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rn=i("Monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const an=i("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nn=i("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const on=i("Presentation",[["path",{d:"M2 3h20",key:"91anmk"}],["path",{d:"M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3",key:"2k9sn8"}],["path",{d:"m7 21 5-5 5 5",key:"bip4we"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sn=i("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cn=i("Reply",[["polyline",{points:"9 17 4 12 9 7",key:"hvgpf2"}],["path",{d:"M20 18v-2a4 4 0 0 0-4-4H4",key:"5vmcpk"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ln=i("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dn=i("Send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const un=i("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hn=i("Share2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mn=i("ShieldAlert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fn=i("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yn=i("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gn=i("Smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pn=i("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bn=i("Star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kn=i("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wn=i("Tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xn=i("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vn=i("Trash",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mn=i("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cn=i("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sn=i("UserX",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"17",x2:"22",y1:"8",y2:"13",key:"3nzzx3"}],["line",{x1:"22",x2:"17",y1:"8",y2:"13",key:"1swrse"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pn=i("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const On=i("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zn=i("Volume2",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dn=i("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tn=i("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),ve="-",dt=e=>{const t=ht(e),{conflictingClassGroups:r,conflictingClassGroupModifiers:a}=e;return{getClassGroupId:s=>{const c=s.split(ve);return c[0]===""&&c.length!==1&&c.shift(),_e(c,t)||ut(s)},getConflictingClassGroupIds:(s,c)=>{const u=r[s]||[];return c&&a[s]?[...u,...a[s]]:u}}},_e=(e,t)=>{var s;if(e.length===0)return t.classGroupId;const r=e[0],a=t.nextPart.get(r),n=a?_e(e.slice(1),a):void 0;if(n)return n;if(t.validators.length===0)return;const o=e.join(ve);return(s=t.validators.find(({validator:c})=>c(o)))==null?void 0:s.classGroupId},We=/^\[(.+)\]$/,ut=e=>{if(We.test(e)){const t=We.exec(e)[1],r=t==null?void 0:t.substring(0,t.indexOf(":"));if(r)return"arbitrary.."+r}},ht=e=>{const{theme:t,classGroups:r}=e,a={nextPart:new Map,validators:[]};for(const n in r)ke(r[n],a,n,t);return a},ke=(e,t,r,a)=>{e.forEach(n=>{if(typeof n=="string"){const o=n===""?t:Le(t,n);o.classGroupId=r;return}if(typeof n=="function"){if(mt(n)){ke(n(a),t,r,a);return}t.validators.push({validator:n,classGroupId:r});return}Object.entries(n).forEach(([o,s])=>{ke(s,Le(t,o),r,a)})})},Le=(e,t)=>{let r=e;return t.split(ve).forEach(a=>{r.nextPart.has(a)||r.nextPart.set(a,{nextPart:new Map,validators:[]}),r=r.nextPart.get(a)}),r},mt=e=>e.isThemeGetter,ft=e=>{if(e<1)return{get:()=>{},set:()=>{}};let t=0,r=new Map,a=new Map;const n=(o,s)=>{r.set(o,s),t++,t>e&&(t=0,a=r,r=new Map)};return{get(o){let s=r.get(o);if(s!==void 0)return s;if((s=a.get(o))!==void 0)return n(o,s),s},set(o,s){r.has(o)?r.set(o,s):n(o,s)}}},we="!",xe=":",yt=xe.length,gt=e=>{const{prefix:t,experimentalParseClassName:r}=e;let a=n=>{const o=[];let s=0,c=0,u=0,h;for(let p=0;p<n.length;p++){let k=n[p];if(s===0&&c===0){if(k===xe){o.push(n.slice(u,p)),u=p+yt;continue}if(k==="/"){h=p;continue}}k==="["?s++:k==="]"?s--:k==="("?c++:k===")"&&c--}const f=o.length===0?n:n.substring(u),v=pt(f),b=v!==f,M=h&&h>u?h-u:void 0;return{modifiers:o,hasImportantModifier:b,baseClassName:v,maybePostfixModifierPosition:M}};if(t){const n=t+xe,o=a;a=s=>s.startsWith(n)?o(s.substring(n.length)):{isExternal:!0,modifiers:[],hasImportantModifier:!1,baseClassName:s,maybePostfixModifierPosition:void 0}}if(r){const n=a;a=o=>r({className:o,parseClassName:n})}return a},pt=e=>e.endsWith(we)?e.substring(0,e.length-1):e.startsWith(we)?e.substring(1):e,bt=e=>{const t=Object.fromEntries(e.orderSensitiveModifiers.map(a=>[a,!0]));return a=>{if(a.length<=1)return a;const n=[];let o=[];return a.forEach(s=>{s[0]==="["||t[s]?(n.push(...o.sort(),s),o=[]):o.push(s)}),n.push(...o.sort()),n}},kt=e=>({cache:ft(e.cacheSize),parseClassName:gt(e),sortModifiers:bt(e),...dt(e)}),wt=/\s+/,xt=(e,t)=>{const{parseClassName:r,getClassGroupId:a,getConflictingClassGroupIds:n,sortModifiers:o}=t,s=[],c=e.trim().split(wt);let u="";for(let h=c.length-1;h>=0;h-=1){const f=c[h],{isExternal:v,modifiers:b,hasImportantModifier:M,baseClassName:p,maybePostfixModifierPosition:k}=r(f);if(v){u=f+(u.length>0?" "+u:u);continue}let O=!!k,E=a(O?p.substring(0,k):p);if(!E){if(!O){u=f+(u.length>0?" "+u:u);continue}if(E=a(p),!E){u=f+(u.length>0?" "+u:u);continue}O=!1}const te=o(b).join(":"),B=M?te+we:te,I=B+E;if(s.includes(I))continue;s.push(I);const N=n(E,O);for(let F=0;F<N.length;++F){const U=N[F];s.push(B+U)}u=f+(u.length>0?" "+u:u)}return u};function vt(){let e=0,t,r,a="";for(;e<arguments.length;)(t=arguments[e++])&&(r=Xe(t))&&(a&&(a+=" "),a+=r);return a}const Xe=e=>{if(typeof e=="string")return e;let t,r="";for(let a=0;a<e.length;a++)e[a]&&(t=Xe(e[a]))&&(r&&(r+=" "),r+=t);return r};function Mt(e,...t){let r,a,n,o=s;function s(u){const h=t.reduce((f,v)=>v(f),e());return r=kt(h),a=r.cache.get,n=r.cache.set,o=c,c(u)}function c(u){const h=a(u);if(h)return h;const f=xt(u,r);return n(u,f),f}return function(){return o(vt.apply(null,arguments))}}const C=e=>{const t=r=>r[e]||[];return t.isThemeGetter=!0,t},Be=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,Ue=/^\((?:(\w[\w-]*):)?(.+)\)$/i,Ct=/^\d+\/\d+$/,St=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,Pt=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,Ot=/^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,zt=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,Dt=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,j=e=>Ct.test(e),g=e=>!!e&&!Number.isNaN(Number(e)),q=e=>!!e&&Number.isInteger(Number(e)),ge=e=>e.endsWith("%")&&g(e.slice(0,-1)),A=e=>St.test(e),Tt=()=>!0,At=e=>Pt.test(e)&&!Ot.test(e),Qe=()=>!1,qt=e=>zt.test(e),Wt=e=>Dt.test(e),Lt=e=>!l(e)&&!d(e),Et=e=>_(e,Je,Qe),l=e=>Be.test(e),R=e=>_(e,Ke,At),pe=e=>_(e,It,g),Ee=e=>_(e,$e,Qe),Ft=e=>_(e,Ze,Wt),ie=e=>_(e,et,qt),d=e=>Ue.test(e),Q=e=>X(e,Ke),Ht=e=>X(e,Nt),Fe=e=>X(e,$e),Rt=e=>X(e,Je),Yt=e=>X(e,Ze),ce=e=>X(e,et,!0),_=(e,t,r)=>{const a=Be.exec(e);return a?a[1]?t(a[1]):r(a[2]):!1},X=(e,t,r=!1)=>{const a=Ue.exec(e);return a?a[1]?t(a[1]):r:!1},$e=e=>e==="position"||e==="percentage",Ze=e=>e==="image"||e==="url",Je=e=>e==="length"||e==="size"||e==="bg-size",Ke=e=>e==="length",It=e=>e==="number",Nt=e=>e==="family-name",et=e=>e==="shadow",Vt=()=>{const e=C("color"),t=C("font"),r=C("text"),a=C("font-weight"),n=C("tracking"),o=C("leading"),s=C("breakpoint"),c=C("container"),u=C("spacing"),h=C("radius"),f=C("shadow"),v=C("inset-shadow"),b=C("text-shadow"),M=C("drop-shadow"),p=C("blur"),k=C("perspective"),O=C("aspect"),E=C("ease"),te=C("animate"),B=()=>["auto","avoid","all","avoid-page","page","left","right","column"],I=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],N=()=>[...I(),d,l],F=()=>["auto","hidden","clip","visible","scroll"],U=()=>["auto","contain","none"],y=()=>[d,l,u],D=()=>[j,"full","auto",...y()],Me=()=>[q,"none","subgrid",d,l],Ce=()=>["auto",{span:["full",q,d,l]},q,d,l],re=()=>[q,"auto",d,l],Se=()=>["auto","min","max","fr",d,l],me=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],V=()=>["start","end","center","stretch","center-safe","end-safe"],T=()=>["auto",...y()],H=()=>[j,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...y()],m=()=>[e,d,l],Pe=()=>[...I(),Fe,Ee,{position:[d,l]}],Oe=()=>["no-repeat",{repeat:["","x","y","space","round"]}],ze=()=>["auto","cover","contain",Rt,Et,{size:[d,l]}],fe=()=>[ge,Q,R],P=()=>["","none","full",h,d,l],z=()=>["",g,Q,R],ae=()=>["solid","dashed","dotted","double"],De=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],S=()=>[g,ge,Fe,Ee],Te=()=>["","none",p,d,l],ne=()=>["none",g,d,l],oe=()=>["none",g,d,l],ye=()=>[g,d,l],se=()=>[j,"full",...y()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[A],breakpoint:[A],color:[Tt],container:[A],"drop-shadow":[A],ease:["in","out","in-out"],font:[Lt],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[A],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[A],shadow:[A],spacing:["px",g],text:[A],"text-shadow":[A],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",j,l,d,O]}],container:["container"],columns:[{columns:[g,l,d,c]}],"break-after":[{"break-after":B()}],"break-before":[{"break-before":B()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:N()}],overflow:[{overflow:F()}],"overflow-x":[{"overflow-x":F()}],"overflow-y":[{"overflow-y":F()}],overscroll:[{overscroll:U()}],"overscroll-x":[{"overscroll-x":U()}],"overscroll-y":[{"overscroll-y":U()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:D()}],"inset-x":[{"inset-x":D()}],"inset-y":[{"inset-y":D()}],start:[{start:D()}],end:[{end:D()}],top:[{top:D()}],right:[{right:D()}],bottom:[{bottom:D()}],left:[{left:D()}],visibility:["visible","invisible","collapse"],z:[{z:[q,"auto",d,l]}],basis:[{basis:[j,"full","auto",c,...y()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[g,j,"auto","initial","none",l]}],grow:[{grow:["",g,d,l]}],shrink:[{shrink:["",g,d,l]}],order:[{order:[q,"first","last","none",d,l]}],"grid-cols":[{"grid-cols":Me()}],"col-start-end":[{col:Ce()}],"col-start":[{"col-start":re()}],"col-end":[{"col-end":re()}],"grid-rows":[{"grid-rows":Me()}],"row-start-end":[{row:Ce()}],"row-start":[{"row-start":re()}],"row-end":[{"row-end":re()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":Se()}],"auto-rows":[{"auto-rows":Se()}],gap:[{gap:y()}],"gap-x":[{"gap-x":y()}],"gap-y":[{"gap-y":y()}],"justify-content":[{justify:[...me(),"normal"]}],"justify-items":[{"justify-items":[...V(),"normal"]}],"justify-self":[{"justify-self":["auto",...V()]}],"align-content":[{content:["normal",...me()]}],"align-items":[{items:[...V(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...V(),{baseline:["","last"]}]}],"place-content":[{"place-content":me()}],"place-items":[{"place-items":[...V(),"baseline"]}],"place-self":[{"place-self":["auto",...V()]}],p:[{p:y()}],px:[{px:y()}],py:[{py:y()}],ps:[{ps:y()}],pe:[{pe:y()}],pt:[{pt:y()}],pr:[{pr:y()}],pb:[{pb:y()}],pl:[{pl:y()}],m:[{m:T()}],mx:[{mx:T()}],my:[{my:T()}],ms:[{ms:T()}],me:[{me:T()}],mt:[{mt:T()}],mr:[{mr:T()}],mb:[{mb:T()}],ml:[{ml:T()}],"space-x":[{"space-x":y()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":y()}],"space-y-reverse":["space-y-reverse"],size:[{size:H()}],w:[{w:[c,"screen",...H()]}],"min-w":[{"min-w":[c,"screen","none",...H()]}],"max-w":[{"max-w":[c,"screen","none","prose",{screen:[s]},...H()]}],h:[{h:["screen",...H()]}],"min-h":[{"min-h":["screen","none",...H()]}],"max-h":[{"max-h":["screen",...H()]}],"font-size":[{text:["base",r,Q,R]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[a,d,pe]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",ge,l]}],"font-family":[{font:[Ht,l,t]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[n,d,l]}],"line-clamp":[{"line-clamp":[g,"none",d,pe]}],leading:[{leading:[o,...y()]}],"list-image":[{"list-image":["none",d,l]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",d,l]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:m()}],"text-color":[{text:m()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...ae(),"wavy"]}],"text-decoration-thickness":[{decoration:[g,"from-font","auto",d,R]}],"text-decoration-color":[{decoration:m()}],"underline-offset":[{"underline-offset":[g,"auto",d,l]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:y()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",d,l]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",d,l]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:Pe()}],"bg-repeat":[{bg:Oe()}],"bg-size":[{bg:ze()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},q,d,l],radial:["",d,l],conic:[q,d,l]},Yt,Ft]}],"bg-color":[{bg:m()}],"gradient-from-pos":[{from:fe()}],"gradient-via-pos":[{via:fe()}],"gradient-to-pos":[{to:fe()}],"gradient-from":[{from:m()}],"gradient-via":[{via:m()}],"gradient-to":[{to:m()}],rounded:[{rounded:P()}],"rounded-s":[{"rounded-s":P()}],"rounded-e":[{"rounded-e":P()}],"rounded-t":[{"rounded-t":P()}],"rounded-r":[{"rounded-r":P()}],"rounded-b":[{"rounded-b":P()}],"rounded-l":[{"rounded-l":P()}],"rounded-ss":[{"rounded-ss":P()}],"rounded-se":[{"rounded-se":P()}],"rounded-ee":[{"rounded-ee":P()}],"rounded-es":[{"rounded-es":P()}],"rounded-tl":[{"rounded-tl":P()}],"rounded-tr":[{"rounded-tr":P()}],"rounded-br":[{"rounded-br":P()}],"rounded-bl":[{"rounded-bl":P()}],"border-w":[{border:z()}],"border-w-x":[{"border-x":z()}],"border-w-y":[{"border-y":z()}],"border-w-s":[{"border-s":z()}],"border-w-e":[{"border-e":z()}],"border-w-t":[{"border-t":z()}],"border-w-r":[{"border-r":z()}],"border-w-b":[{"border-b":z()}],"border-w-l":[{"border-l":z()}],"divide-x":[{"divide-x":z()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":z()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...ae(),"hidden","none"]}],"divide-style":[{divide:[...ae(),"hidden","none"]}],"border-color":[{border:m()}],"border-color-x":[{"border-x":m()}],"border-color-y":[{"border-y":m()}],"border-color-s":[{"border-s":m()}],"border-color-e":[{"border-e":m()}],"border-color-t":[{"border-t":m()}],"border-color-r":[{"border-r":m()}],"border-color-b":[{"border-b":m()}],"border-color-l":[{"border-l":m()}],"divide-color":[{divide:m()}],"outline-style":[{outline:[...ae(),"none","hidden"]}],"outline-offset":[{"outline-offset":[g,d,l]}],"outline-w":[{outline:["",g,Q,R]}],"outline-color":[{outline:m()}],shadow:[{shadow:["","none",f,ce,ie]}],"shadow-color":[{shadow:m()}],"inset-shadow":[{"inset-shadow":["none",v,ce,ie]}],"inset-shadow-color":[{"inset-shadow":m()}],"ring-w":[{ring:z()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:m()}],"ring-offset-w":[{"ring-offset":[g,R]}],"ring-offset-color":[{"ring-offset":m()}],"inset-ring-w":[{"inset-ring":z()}],"inset-ring-color":[{"inset-ring":m()}],"text-shadow":[{"text-shadow":["none",b,ce,ie]}],"text-shadow-color":[{"text-shadow":m()}],opacity:[{opacity:[g,d,l]}],"mix-blend":[{"mix-blend":[...De(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":De()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[g]}],"mask-image-linear-from-pos":[{"mask-linear-from":S()}],"mask-image-linear-to-pos":[{"mask-linear-to":S()}],"mask-image-linear-from-color":[{"mask-linear-from":m()}],"mask-image-linear-to-color":[{"mask-linear-to":m()}],"mask-image-t-from-pos":[{"mask-t-from":S()}],"mask-image-t-to-pos":[{"mask-t-to":S()}],"mask-image-t-from-color":[{"mask-t-from":m()}],"mask-image-t-to-color":[{"mask-t-to":m()}],"mask-image-r-from-pos":[{"mask-r-from":S()}],"mask-image-r-to-pos":[{"mask-r-to":S()}],"mask-image-r-from-color":[{"mask-r-from":m()}],"mask-image-r-to-color":[{"mask-r-to":m()}],"mask-image-b-from-pos":[{"mask-b-from":S()}],"mask-image-b-to-pos":[{"mask-b-to":S()}],"mask-image-b-from-color":[{"mask-b-from":m()}],"mask-image-b-to-color":[{"mask-b-to":m()}],"mask-image-l-from-pos":[{"mask-l-from":S()}],"mask-image-l-to-pos":[{"mask-l-to":S()}],"mask-image-l-from-color":[{"mask-l-from":m()}],"mask-image-l-to-color":[{"mask-l-to":m()}],"mask-image-x-from-pos":[{"mask-x-from":S()}],"mask-image-x-to-pos":[{"mask-x-to":S()}],"mask-image-x-from-color":[{"mask-x-from":m()}],"mask-image-x-to-color":[{"mask-x-to":m()}],"mask-image-y-from-pos":[{"mask-y-from":S()}],"mask-image-y-to-pos":[{"mask-y-to":S()}],"mask-image-y-from-color":[{"mask-y-from":m()}],"mask-image-y-to-color":[{"mask-y-to":m()}],"mask-image-radial":[{"mask-radial":[d,l]}],"mask-image-radial-from-pos":[{"mask-radial-from":S()}],"mask-image-radial-to-pos":[{"mask-radial-to":S()}],"mask-image-radial-from-color":[{"mask-radial-from":m()}],"mask-image-radial-to-color":[{"mask-radial-to":m()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":I()}],"mask-image-conic-pos":[{"mask-conic":[g]}],"mask-image-conic-from-pos":[{"mask-conic-from":S()}],"mask-image-conic-to-pos":[{"mask-conic-to":S()}],"mask-image-conic-from-color":[{"mask-conic-from":m()}],"mask-image-conic-to-color":[{"mask-conic-to":m()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:Pe()}],"mask-repeat":[{mask:Oe()}],"mask-size":[{mask:ze()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",d,l]}],filter:[{filter:["","none",d,l]}],blur:[{blur:Te()}],brightness:[{brightness:[g,d,l]}],contrast:[{contrast:[g,d,l]}],"drop-shadow":[{"drop-shadow":["","none",M,ce,ie]}],"drop-shadow-color":[{"drop-shadow":m()}],grayscale:[{grayscale:["",g,d,l]}],"hue-rotate":[{"hue-rotate":[g,d,l]}],invert:[{invert:["",g,d,l]}],saturate:[{saturate:[g,d,l]}],sepia:[{sepia:["",g,d,l]}],"backdrop-filter":[{"backdrop-filter":["","none",d,l]}],"backdrop-blur":[{"backdrop-blur":Te()}],"backdrop-brightness":[{"backdrop-brightness":[g,d,l]}],"backdrop-contrast":[{"backdrop-contrast":[g,d,l]}],"backdrop-grayscale":[{"backdrop-grayscale":["",g,d,l]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[g,d,l]}],"backdrop-invert":[{"backdrop-invert":["",g,d,l]}],"backdrop-opacity":[{"backdrop-opacity":[g,d,l]}],"backdrop-saturate":[{"backdrop-saturate":[g,d,l]}],"backdrop-sepia":[{"backdrop-sepia":["",g,d,l]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":y()}],"border-spacing-x":[{"border-spacing-x":y()}],"border-spacing-y":[{"border-spacing-y":y()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",d,l]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[g,"initial",d,l]}],ease:[{ease:["linear","initial",E,d,l]}],delay:[{delay:[g,d,l]}],animate:[{animate:["none",te,d,l]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[k,d,l]}],"perspective-origin":[{"perspective-origin":N()}],rotate:[{rotate:ne()}],"rotate-x":[{"rotate-x":ne()}],"rotate-y":[{"rotate-y":ne()}],"rotate-z":[{"rotate-z":ne()}],scale:[{scale:oe()}],"scale-x":[{"scale-x":oe()}],"scale-y":[{"scale-y":oe()}],"scale-z":[{"scale-z":oe()}],"scale-3d":["scale-3d"],skew:[{skew:ye()}],"skew-x":[{"skew-x":ye()}],"skew-y":[{"skew-y":ye()}],transform:[{transform:[d,l,"","none","gpu","cpu"]}],"transform-origin":[{origin:N()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:se()}],"translate-x":[{"translate-x":se()}],"translate-y":[{"translate-y":se()}],"translate-z":[{"translate-z":se()}],"translate-none":["translate-none"],accent:[{accent:m()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:m()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",d,l]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":y()}],"scroll-mx":[{"scroll-mx":y()}],"scroll-my":[{"scroll-my":y()}],"scroll-ms":[{"scroll-ms":y()}],"scroll-me":[{"scroll-me":y()}],"scroll-mt":[{"scroll-mt":y()}],"scroll-mr":[{"scroll-mr":y()}],"scroll-mb":[{"scroll-mb":y()}],"scroll-ml":[{"scroll-ml":y()}],"scroll-p":[{"scroll-p":y()}],"scroll-px":[{"scroll-px":y()}],"scroll-py":[{"scroll-py":y()}],"scroll-ps":[{"scroll-ps":y()}],"scroll-pe":[{"scroll-pe":y()}],"scroll-pt":[{"scroll-pt":y()}],"scroll-pr":[{"scroll-pr":y()}],"scroll-pb":[{"scroll-pb":y()}],"scroll-pl":[{"scroll-pl":y()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",d,l]}],fill:[{fill:["none",...m()]}],"stroke-w":[{stroke:[g,Q,R,pe]}],stroke:[{stroke:["none",...m()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}},An=Mt(Vt);function x(e){const t=Object.prototype.toString.call(e);return e instanceof Date||typeof e=="object"&&t==="[object Date]"?new e.constructor(+e):typeof e=="number"||t==="[object Number]"||typeof e=="string"||t==="[object String]"?new Date(e):new Date(NaN)}function L(e,t){return e instanceof Date?new e.constructor(t):new Date(t)}const tt=6048e5,jt=864e5,le=43200,He=1440;let Gt={};function ee(){return Gt}function K(e,t){var c,u,h,f;const r=ee(),a=(t==null?void 0:t.weekStartsOn)??((u=(c=t==null?void 0:t.locale)==null?void 0:c.options)==null?void 0:u.weekStartsOn)??r.weekStartsOn??((f=(h=r.locale)==null?void 0:h.options)==null?void 0:f.weekStartsOn)??0,n=x(e),o=n.getDay(),s=(o<a?7:0)+o-a;return n.setDate(n.getDate()-s),n.setHours(0,0,0,0),n}function ue(e){return K(e,{weekStartsOn:1})}function rt(e){const t=x(e),r=t.getFullYear(),a=L(e,0);a.setFullYear(r+1,0,4),a.setHours(0,0,0,0);const n=ue(a),o=L(e,0);o.setFullYear(r,0,4),o.setHours(0,0,0,0);const s=ue(o);return t.getTime()>=n.getTime()?r+1:t.getTime()>=s.getTime()?r:r-1}function Re(e){const t=x(e);return t.setHours(0,0,0,0),t}function he(e){const t=x(e),r=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds()));return r.setUTCFullYear(t.getFullYear()),+e-+r}function _t(e,t){const r=Re(e),a=Re(t),n=+r-he(r),o=+a-he(a);return Math.round((n-o)/jt)}function Xt(e){const t=rt(e),r=L(e,0);return r.setFullYear(t,0,4),r.setHours(0,0,0,0),ue(r)}function de(e,t){const r=x(e),a=x(t),n=r.getTime()-a.getTime();return n<0?-1:n>0?1:n}function Bt(e){return L(e,Date.now())}function Ut(e){return e instanceof Date||typeof e=="object"&&Object.prototype.toString.call(e)==="[object Date]"}function Qt(e){if(!Ut(e)&&typeof e!="number")return!1;const t=x(e);return!isNaN(Number(t))}function $t(e,t){const r=x(e),a=x(t),n=r.getFullYear()-a.getFullYear(),o=r.getMonth()-a.getMonth();return n*12+o}function Zt(e){return t=>{const a=(e?Math[e]:Math.trunc)(t);return a===0?0:a}}function Jt(e,t){return+x(e)-+x(t)}function Kt(e){const t=x(e);return t.setHours(23,59,59,999),t}function er(e){const t=x(e),r=t.getMonth();return t.setFullYear(t.getFullYear(),r+1,0),t.setHours(23,59,59,999),t}function tr(e){const t=x(e);return+Kt(t)==+er(t)}function rr(e,t){const r=x(e),a=x(t),n=de(r,a),o=Math.abs($t(r,a));let s;if(o<1)s=0;else{r.getMonth()===1&&r.getDate()>27&&r.setDate(30),r.setMonth(r.getMonth()-n*o);let c=de(r,a)===-n;tr(x(e))&&o===1&&de(e,a)===1&&(c=!1),s=n*(o-Number(c))}return s===0?0:s}function ar(e,t,r){const a=Jt(e,t)/1e3;return Zt(r==null?void 0:r.roundingMethod)(a)}function nr(e){const t=x(e),r=L(e,0);return r.setFullYear(t.getFullYear(),0,1),r.setHours(0,0,0,0),r}const or={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},sr=(e,t,r)=>{let a;const n=or[e];return typeof n=="string"?a=n:t===1?a=n.one:a=n.other.replace("{{count}}",t.toString()),r!=null&&r.addSuffix?r.comparison&&r.comparison>0?"in "+a:a+" ago":a};function be(e){return(t={})=>{const r=t.width?String(t.width):e.defaultWidth;return e.formats[r]||e.formats[e.defaultWidth]}}const ir={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},cr={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},lr={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},dr={date:be({formats:ir,defaultWidth:"full"}),time:be({formats:cr,defaultWidth:"full"}),dateTime:be({formats:lr,defaultWidth:"full"})},ur={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},hr=(e,t,r,a)=>ur[e];function $(e){return(t,r)=>{const a=r!=null&&r.context?String(r.context):"standalone";let n;if(a==="formatting"&&e.formattingValues){const s=e.defaultFormattingWidth||e.defaultWidth,c=r!=null&&r.width?String(r.width):s;n=e.formattingValues[c]||e.formattingValues[s]}else{const s=e.defaultWidth,c=r!=null&&r.width?String(r.width):e.defaultWidth;n=e.values[c]||e.values[s]}const o=e.argumentCallback?e.argumentCallback(t):t;return n[o]}}const mr={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},fr={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},yr={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},gr={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},pr={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},br={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},kr=(e,t)=>{const r=Number(e),a=r%100;if(a>20||a<10)switch(a%10){case 1:return r+"st";case 2:return r+"nd";case 3:return r+"rd"}return r+"th"},wr={ordinalNumber:kr,era:$({values:mr,defaultWidth:"wide"}),quarter:$({values:fr,defaultWidth:"wide",argumentCallback:e=>e-1}),month:$({values:yr,defaultWidth:"wide"}),day:$({values:gr,defaultWidth:"wide"}),dayPeriod:$({values:pr,defaultWidth:"wide",formattingValues:br,defaultFormattingWidth:"wide"})};function Z(e){return(t,r={})=>{const a=r.width,n=a&&e.matchPatterns[a]||e.matchPatterns[e.defaultMatchWidth],o=t.match(n);if(!o)return null;const s=o[0],c=a&&e.parsePatterns[a]||e.parsePatterns[e.defaultParseWidth],u=Array.isArray(c)?vr(c,v=>v.test(s)):xr(c,v=>v.test(s));let h;h=e.valueCallback?e.valueCallback(u):u,h=r.valueCallback?r.valueCallback(h):h;const f=t.slice(s.length);return{value:h,rest:f}}}function xr(e,t){for(const r in e)if(Object.prototype.hasOwnProperty.call(e,r)&&t(e[r]))return r}function vr(e,t){for(let r=0;r<e.length;r++)if(t(e[r]))return r}function Mr(e){return(t,r={})=>{const a=t.match(e.matchPattern);if(!a)return null;const n=a[0],o=t.match(e.parsePattern);if(!o)return null;let s=e.valueCallback?e.valueCallback(o[0]):o[0];s=r.valueCallback?r.valueCallback(s):s;const c=t.slice(n.length);return{value:s,rest:c}}}const Cr=/^(\d+)(th|st|nd|rd)?/i,Sr=/\d+/i,Pr={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},Or={any:[/^b/i,/^(a|c)/i]},zr={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},Dr={any:[/1/i,/2/i,/3/i,/4/i]},Tr={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},Ar={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},qr={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},Wr={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},Lr={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},Er={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},Fr={ordinalNumber:Mr({matchPattern:Cr,parsePattern:Sr,valueCallback:e=>parseInt(e,10)}),era:Z({matchPatterns:Pr,defaultMatchWidth:"wide",parsePatterns:Or,defaultParseWidth:"any"}),quarter:Z({matchPatterns:zr,defaultMatchWidth:"wide",parsePatterns:Dr,defaultParseWidth:"any",valueCallback:e=>e+1}),month:Z({matchPatterns:Tr,defaultMatchWidth:"wide",parsePatterns:Ar,defaultParseWidth:"any"}),day:Z({matchPatterns:qr,defaultMatchWidth:"wide",parsePatterns:Wr,defaultParseWidth:"any"}),dayPeriod:Z({matchPatterns:Lr,defaultMatchWidth:"any",parsePatterns:Er,defaultParseWidth:"any"})},at={code:"en-US",formatDistance:sr,formatLong:dr,formatRelative:hr,localize:wr,match:Fr,options:{weekStartsOn:0,firstWeekContainsDate:1}};function Hr(e){const t=x(e);return _t(t,nr(t))+1}function Rr(e){const t=x(e),r=+ue(t)-+Xt(t);return Math.round(r/tt)+1}function nt(e,t){var f,v,b,M;const r=x(e),a=r.getFullYear(),n=ee(),o=(t==null?void 0:t.firstWeekContainsDate)??((v=(f=t==null?void 0:t.locale)==null?void 0:f.options)==null?void 0:v.firstWeekContainsDate)??n.firstWeekContainsDate??((M=(b=n.locale)==null?void 0:b.options)==null?void 0:M.firstWeekContainsDate)??1,s=L(e,0);s.setFullYear(a+1,0,o),s.setHours(0,0,0,0);const c=K(s,t),u=L(e,0);u.setFullYear(a,0,o),u.setHours(0,0,0,0);const h=K(u,t);return r.getTime()>=c.getTime()?a+1:r.getTime()>=h.getTime()?a:a-1}function Yr(e,t){var c,u,h,f;const r=ee(),a=(t==null?void 0:t.firstWeekContainsDate)??((u=(c=t==null?void 0:t.locale)==null?void 0:c.options)==null?void 0:u.firstWeekContainsDate)??r.firstWeekContainsDate??((f=(h=r.locale)==null?void 0:h.options)==null?void 0:f.firstWeekContainsDate)??1,n=nt(e,t),o=L(e,0);return o.setFullYear(n,0,a),o.setHours(0,0,0,0),K(o,t)}function Ir(e,t){const r=x(e),a=+K(r,t)-+Yr(r,t);return Math.round(a/tt)+1}function w(e,t){const r=e<0?"-":"",a=Math.abs(e).toString().padStart(t,"0");return r+a}const W={y(e,t){const r=e.getFullYear(),a=r>0?r:1-r;return w(t==="yy"?a%100:a,t.length)},M(e,t){const r=e.getMonth();return t==="M"?String(r+1):w(r+1,2)},d(e,t){return w(e.getDate(),t.length)},a(e,t){const r=e.getHours()/12>=1?"pm":"am";switch(t){case"a":case"aa":return r.toUpperCase();case"aaa":return r;case"aaaaa":return r[0];case"aaaa":default:return r==="am"?"a.m.":"p.m."}},h(e,t){return w(e.getHours()%12||12,t.length)},H(e,t){return w(e.getHours(),t.length)},m(e,t){return w(e.getMinutes(),t.length)},s(e,t){return w(e.getSeconds(),t.length)},S(e,t){const r=t.length,a=e.getMilliseconds(),n=Math.trunc(a*Math.pow(10,r-3));return w(n,t.length)}},G={midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},Ye={G:function(e,t,r){const a=e.getFullYear()>0?1:0;switch(t){case"G":case"GG":case"GGG":return r.era(a,{width:"abbreviated"});case"GGGGG":return r.era(a,{width:"narrow"});case"GGGG":default:return r.era(a,{width:"wide"})}},y:function(e,t,r){if(t==="yo"){const a=e.getFullYear(),n=a>0?a:1-a;return r.ordinalNumber(n,{unit:"year"})}return W.y(e,t)},Y:function(e,t,r,a){const n=nt(e,a),o=n>0?n:1-n;if(t==="YY"){const s=o%100;return w(s,2)}return t==="Yo"?r.ordinalNumber(o,{unit:"year"}):w(o,t.length)},R:function(e,t){const r=rt(e);return w(r,t.length)},u:function(e,t){const r=e.getFullYear();return w(r,t.length)},Q:function(e,t,r){const a=Math.ceil((e.getMonth()+1)/3);switch(t){case"Q":return String(a);case"QQ":return w(a,2);case"Qo":return r.ordinalNumber(a,{unit:"quarter"});case"QQQ":return r.quarter(a,{width:"abbreviated",context:"formatting"});case"QQQQQ":return r.quarter(a,{width:"narrow",context:"formatting"});case"QQQQ":default:return r.quarter(a,{width:"wide",context:"formatting"})}},q:function(e,t,r){const a=Math.ceil((e.getMonth()+1)/3);switch(t){case"q":return String(a);case"qq":return w(a,2);case"qo":return r.ordinalNumber(a,{unit:"quarter"});case"qqq":return r.quarter(a,{width:"abbreviated",context:"standalone"});case"qqqqq":return r.quarter(a,{width:"narrow",context:"standalone"});case"qqqq":default:return r.quarter(a,{width:"wide",context:"standalone"})}},M:function(e,t,r){const a=e.getMonth();switch(t){case"M":case"MM":return W.M(e,t);case"Mo":return r.ordinalNumber(a+1,{unit:"month"});case"MMM":return r.month(a,{width:"abbreviated",context:"formatting"});case"MMMMM":return r.month(a,{width:"narrow",context:"formatting"});case"MMMM":default:return r.month(a,{width:"wide",context:"formatting"})}},L:function(e,t,r){const a=e.getMonth();switch(t){case"L":return String(a+1);case"LL":return w(a+1,2);case"Lo":return r.ordinalNumber(a+1,{unit:"month"});case"LLL":return r.month(a,{width:"abbreviated",context:"standalone"});case"LLLLL":return r.month(a,{width:"narrow",context:"standalone"});case"LLLL":default:return r.month(a,{width:"wide",context:"standalone"})}},w:function(e,t,r,a){const n=Ir(e,a);return t==="wo"?r.ordinalNumber(n,{unit:"week"}):w(n,t.length)},I:function(e,t,r){const a=Rr(e);return t==="Io"?r.ordinalNumber(a,{unit:"week"}):w(a,t.length)},d:function(e,t,r){return t==="do"?r.ordinalNumber(e.getDate(),{unit:"date"}):W.d(e,t)},D:function(e,t,r){const a=Hr(e);return t==="Do"?r.ordinalNumber(a,{unit:"dayOfYear"}):w(a,t.length)},E:function(e,t,r){const a=e.getDay();switch(t){case"E":case"EE":case"EEE":return r.day(a,{width:"abbreviated",context:"formatting"});case"EEEEE":return r.day(a,{width:"narrow",context:"formatting"});case"EEEEEE":return r.day(a,{width:"short",context:"formatting"});case"EEEE":default:return r.day(a,{width:"wide",context:"formatting"})}},e:function(e,t,r,a){const n=e.getDay(),o=(n-a.weekStartsOn+8)%7||7;switch(t){case"e":return String(o);case"ee":return w(o,2);case"eo":return r.ordinalNumber(o,{unit:"day"});case"eee":return r.day(n,{width:"abbreviated",context:"formatting"});case"eeeee":return r.day(n,{width:"narrow",context:"formatting"});case"eeeeee":return r.day(n,{width:"short",context:"formatting"});case"eeee":default:return r.day(n,{width:"wide",context:"formatting"})}},c:function(e,t,r,a){const n=e.getDay(),o=(n-a.weekStartsOn+8)%7||7;switch(t){case"c":return String(o);case"cc":return w(o,t.length);case"co":return r.ordinalNumber(o,{unit:"day"});case"ccc":return r.day(n,{width:"abbreviated",context:"standalone"});case"ccccc":return r.day(n,{width:"narrow",context:"standalone"});case"cccccc":return r.day(n,{width:"short",context:"standalone"});case"cccc":default:return r.day(n,{width:"wide",context:"standalone"})}},i:function(e,t,r){const a=e.getDay(),n=a===0?7:a;switch(t){case"i":return String(n);case"ii":return w(n,t.length);case"io":return r.ordinalNumber(n,{unit:"day"});case"iii":return r.day(a,{width:"abbreviated",context:"formatting"});case"iiiii":return r.day(a,{width:"narrow",context:"formatting"});case"iiiiii":return r.day(a,{width:"short",context:"formatting"});case"iiii":default:return r.day(a,{width:"wide",context:"formatting"})}},a:function(e,t,r){const n=e.getHours()/12>=1?"pm":"am";switch(t){case"a":case"aa":return r.dayPeriod(n,{width:"abbreviated",context:"formatting"});case"aaa":return r.dayPeriod(n,{width:"abbreviated",context:"formatting"}).toLowerCase();case"aaaaa":return r.dayPeriod(n,{width:"narrow",context:"formatting"});case"aaaa":default:return r.dayPeriod(n,{width:"wide",context:"formatting"})}},b:function(e,t,r){const a=e.getHours();let n;switch(a===12?n=G.noon:a===0?n=G.midnight:n=a/12>=1?"pm":"am",t){case"b":case"bb":return r.dayPeriod(n,{width:"abbreviated",context:"formatting"});case"bbb":return r.dayPeriod(n,{width:"abbreviated",context:"formatting"}).toLowerCase();case"bbbbb":return r.dayPeriod(n,{width:"narrow",context:"formatting"});case"bbbb":default:return r.dayPeriod(n,{width:"wide",context:"formatting"})}},B:function(e,t,r){const a=e.getHours();let n;switch(a>=17?n=G.evening:a>=12?n=G.afternoon:a>=4?n=G.morning:n=G.night,t){case"B":case"BB":case"BBB":return r.dayPeriod(n,{width:"abbreviated",context:"formatting"});case"BBBBB":return r.dayPeriod(n,{width:"narrow",context:"formatting"});case"BBBB":default:return r.dayPeriod(n,{width:"wide",context:"formatting"})}},h:function(e,t,r){if(t==="ho"){let a=e.getHours()%12;return a===0&&(a=12),r.ordinalNumber(a,{unit:"hour"})}return W.h(e,t)},H:function(e,t,r){return t==="Ho"?r.ordinalNumber(e.getHours(),{unit:"hour"}):W.H(e,t)},K:function(e,t,r){const a=e.getHours()%12;return t==="Ko"?r.ordinalNumber(a,{unit:"hour"}):w(a,t.length)},k:function(e,t,r){let a=e.getHours();return a===0&&(a=24),t==="ko"?r.ordinalNumber(a,{unit:"hour"}):w(a,t.length)},m:function(e,t,r){return t==="mo"?r.ordinalNumber(e.getMinutes(),{unit:"minute"}):W.m(e,t)},s:function(e,t,r){return t==="so"?r.ordinalNumber(e.getSeconds(),{unit:"second"}):W.s(e,t)},S:function(e,t){return W.S(e,t)},X:function(e,t,r){const a=e.getTimezoneOffset();if(a===0)return"Z";switch(t){case"X":return Ne(a);case"XXXX":case"XX":return Y(a);case"XXXXX":case"XXX":default:return Y(a,":")}},x:function(e,t,r){const a=e.getTimezoneOffset();switch(t){case"x":return Ne(a);case"xxxx":case"xx":return Y(a);case"xxxxx":case"xxx":default:return Y(a,":")}},O:function(e,t,r){const a=e.getTimezoneOffset();switch(t){case"O":case"OO":case"OOO":return"GMT"+Ie(a,":");case"OOOO":default:return"GMT"+Y(a,":")}},z:function(e,t,r){const a=e.getTimezoneOffset();switch(t){case"z":case"zz":case"zzz":return"GMT"+Ie(a,":");case"zzzz":default:return"GMT"+Y(a,":")}},t:function(e,t,r){const a=Math.trunc(e.getTime()/1e3);return w(a,t.length)},T:function(e,t,r){const a=e.getTime();return w(a,t.length)}};function Ie(e,t=""){const r=e>0?"-":"+",a=Math.abs(e),n=Math.trunc(a/60),o=a%60;return o===0?r+String(n):r+String(n)+t+w(o,2)}function Ne(e,t){return e%60===0?(e>0?"-":"+")+w(Math.abs(e)/60,2):Y(e,t)}function Y(e,t=""){const r=e>0?"-":"+",a=Math.abs(e),n=w(Math.trunc(a/60),2),o=w(a%60,2);return r+n+t+o}const Ve=(e,t)=>{switch(e){case"P":return t.date({width:"short"});case"PP":return t.date({width:"medium"});case"PPP":return t.date({width:"long"});case"PPPP":default:return t.date({width:"full"})}},ot=(e,t)=>{switch(e){case"p":return t.time({width:"short"});case"pp":return t.time({width:"medium"});case"ppp":return t.time({width:"long"});case"pppp":default:return t.time({width:"full"})}},Nr=(e,t)=>{const r=e.match(/(P+)(p+)?/)||[],a=r[1],n=r[2];if(!n)return Ve(e,t);let o;switch(a){case"P":o=t.dateTime({width:"short"});break;case"PP":o=t.dateTime({width:"medium"});break;case"PPP":o=t.dateTime({width:"long"});break;case"PPPP":default:o=t.dateTime({width:"full"});break}return o.replace("{{date}}",Ve(a,t)).replace("{{time}}",ot(n,t))},Vr={p:ot,P:Nr},jr=/^D+$/,Gr=/^Y+$/,_r=["D","DD","YY","YYYY"];function Xr(e){return jr.test(e)}function Br(e){return Gr.test(e)}function Ur(e,t,r){const a=Qr(e,t,r);if(console.warn(a),_r.includes(e))throw new RangeError(a)}function Qr(e,t,r){const a=e[0]==="Y"?"years":"days of the month";return`Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${a} to the input \`${r}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`}const $r=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,Zr=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,Jr=/^'([^]*?)'?$/,Kr=/''/g,ea=/[a-zA-Z]/;function qn(e,t,r){var f,v,b,M;const a=ee(),n=a.locale??at,o=a.firstWeekContainsDate??((v=(f=a.locale)==null?void 0:f.options)==null?void 0:v.firstWeekContainsDate)??1,s=a.weekStartsOn??((M=(b=a.locale)==null?void 0:b.options)==null?void 0:M.weekStartsOn)??0,c=x(e);if(!Qt(c))throw new RangeError("Invalid time value");let u=t.match(Zr).map(p=>{const k=p[0];if(k==="p"||k==="P"){const O=Vr[k];return O(p,n.formatLong)}return p}).join("").match($r).map(p=>{if(p==="''")return{isToken:!1,value:"'"};const k=p[0];if(k==="'")return{isToken:!1,value:ta(p)};if(Ye[k])return{isToken:!0,value:p};if(k.match(ea))throw new RangeError("Format string contains an unescaped latin alphabet character `"+k+"`");return{isToken:!1,value:p}});n.localize.preprocessor&&(u=n.localize.preprocessor(c,u));const h={firstWeekContainsDate:o,weekStartsOn:s,locale:n};return u.map(p=>{if(!p.isToken)return p.value;const k=p.value;(Br(k)||Xr(k))&&Ur(k,t,String(e));const O=Ye[k[0]];return O(c,k,n.localize,h)}).join("")}function ta(e){const t=e.match(Jr);return t?t[1].replace(Kr,"'"):e}function ra(e,t,r){const a=ee(),n=(r==null?void 0:r.locale)??a.locale??at,o=2520,s=de(e,t);if(isNaN(s))throw new RangeError("Invalid time value");const c=Object.assign({},r,{addSuffix:r==null?void 0:r.addSuffix,comparison:s});let u,h;s>0?(u=x(t),h=x(e)):(u=x(e),h=x(t));const f=ar(h,u),v=(he(h)-he(u))/1e3,b=Math.round((f-v)/60);let M;if(b<2)return r!=null&&r.includeSeconds?f<5?n.formatDistance("lessThanXSeconds",5,c):f<10?n.formatDistance("lessThanXSeconds",10,c):f<20?n.formatDistance("lessThanXSeconds",20,c):f<40?n.formatDistance("halfAMinute",0,c):f<60?n.formatDistance("lessThanXMinutes",1,c):n.formatDistance("xMinutes",1,c):b===0?n.formatDistance("lessThanXMinutes",1,c):n.formatDistance("xMinutes",b,c);if(b<45)return n.formatDistance("xMinutes",b,c);if(b<90)return n.formatDistance("aboutXHours",1,c);if(b<He){const p=Math.round(b/60);return n.formatDistance("aboutXHours",p,c)}else{if(b<o)return n.formatDistance("xDays",1,c);if(b<le){const p=Math.round(b/He);return n.formatDistance("xDays",p,c)}else if(b<le*2)return M=Math.round(b/le),n.formatDistance("aboutXMonths",M,c)}if(M=rr(h,u),M<12){const p=Math.round(b/le);return n.formatDistance("xMonths",p,c)}else{const p=M%12,k=Math.trunc(M/12);return p<3?n.formatDistance("aboutXYears",k,c):p<9?n.formatDistance("overXYears",k,c):n.formatDistance("almostXYears",k+1,c)}}function Wn(e,t){return ra(e,Bt(e),t)}export{Na as $,ua as A,sa as B,la as C,xa as D,Wa as E,Ha as F,qn as G,fa as H,Ba as I,pa as J,Qa as K,Ka as L,an as M,Ra as N,Cn as O,vn as P,Wn as Q,sn as R,un as S,xn as T,Pn as U,zn as V,Ta as W,Dn as X,hn as Y,Tn as Z,Ia as _,na as a,Ca as a0,ja as a1,Xa as a2,Ya as a3,Fa as a4,Ea as a5,on as a6,La as a7,Ua as a8,tn as a9,da as aa,ba as ab,oa as ac,ga as ad,Ga as ae,Oa as af,ca as ag,_a as ah,wn as ai,wa as aj,Va as ak,ha as al,cn as am,pn as an,za as ao,be as ap,$ as aq,Z as ar,Mr as as,Mn as at,Ja as au,ka as av,nn as aw,Pa as ax,ma as b,st as c,yn as d,kn as e,rn as f,ia as g,en as h,Za as i,gn as j,qa as k,Ma as l,$a as m,Sa as n,ya as o,On as p,bn as q,fn as r,mn as s,An as t,Da as u,dn as v,Aa as w,Sn as x,ln as y,va as z};
