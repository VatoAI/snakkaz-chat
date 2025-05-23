import{k as d,r as n,o as b}from"./index-D3ydC_N7.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=d("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=d("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);function S(r){const[h,e]=n.useState(void 0);return b(()=>{if(r){e({width:r.offsetWidth,height:r.offsetHeight});const c=new ResizeObserver(s=>{if(!Array.isArray(s)||!s.length)return;const a=s[0];let o,i;if("borderBoxSize"in a){const t=a.borderBoxSize,f=Array.isArray(t)?t[0]:t;o=f.inlineSize,i=f.blockSize}else o=r.offsetWidth,i=r.offsetHeight;e({width:o,height:i})});return c.observe(r,{box:"border-box"}),()=>c.unobserve(r)}else e(void 0)},[r]),h}export{y as C,z as U,S as u};
