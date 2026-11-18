import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* ============================================================
   ASSET URLS
   ============================================================ */
const HERO_FRONT =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/658f62c6-fdb2-41b9-aa0f-10837f9e72cb.png";
const HERO_BACK =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260914_123603_5ac5732a-900b-4919-9d9c-3c454194b0a5.png";
const MATERIAL =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/96ef2bcd-ed69-4b7e-ab83-8a18d2129d99.png";

const AVATARS = [
  {
    src: "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/caf08036-c63c-4d0c-9b81-43c5a7a49343.png",
    hue: "2",
    sat: "1.2",
    bg: "#1e3048",
    iw: "112.3%",
    il: "-5.84%",
    it: "-3.65%",
  },
  {
    src: "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/599a5a28-c9f1-44f9-b01b-adb8b22e8c12.png",
    hue: "0",
    sat: ".42",
    iw: "111.5%",
    il: "-8.82%",
    it: "-4.41%",
  },
  {
    src: "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/fc804805-b23c-40ba-97b0-9ab2ba3efb5d.png",
    hue: "6",
    sat: "1.3",
    iw: "113.1%",
    il: "-4.35%",
    it: "-0.72%",
  },
  {
    src: "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/0cb0c1f0-f84a-47bb-bfa1-43b6c7f1575d.png",
    hue: "0",
    sat: ".2",
    iw: "108.2%",
    il: "-6.82%",
    it: "0.76%",
  },
  {
    src: "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/64e651b1-a8ba-44e8-8fbe-e85fcd6e5cf0.png",
    hue: "0",
    sat: ".68",
    iw: "114.8%",
    il: "-10.71%",
    it: "-2.14%",
  },
];

/* Add intro pre-state class before first paint (client only) */
if (
  typeof window !== "undefined" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  document.documentElement.classList.add("intro");
  setTimeout(
    () => document.documentElement.classList.remove("intro"),
    5000
  );
}

/* ============================================================
   COMPLEX CSS (kept in a <style> tag for fidelity —
   Tailwind cannot express clip-paths, mask-mode, container
   queries, canvas-mask behaviours or the intro pre-state)
   ============================================================ */
const GLOBAL_CSS = `
:root{
  --ink:#06192f; --muted:#77899c; --ice:#d6e6f5;
  --white:#fff; --blue:#1169dc;
}
*{box-sizing:border-box;}
html,body{height:100%;width:100%;margin:0;padding:0;overflow:hidden;background:var(--ice);}
body{
  font-family:'Inter','Helvetica Neue',Helvetica,Arial,sans-serif;
  color:var(--ink);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
}
h1,p{margin:0;}
button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;}
a{color:inherit;text-decoration:none;}
img{display:block;max-width:none;}
:focus-visible{outline:2px solid var(--blue);outline-offset:3px;}

/* ---- viewport ---- */
.viewport{
  position:fixed;inset:0;overflow:hidden;isolation:isolate;
  background:radial-gradient(circle at 44% 28%,#e8f3fb 0 6%,#d9e9f6 30%,#d6e6f5 68%,#d4e5f4 100%);
}
.viewport:after{
  content:"";position:absolute;inset:0;z-index:2;pointer-events:none;
  opacity:.13;mix-blend-mode:soft-light;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.32'/%3E%3C/svg%3E");
  background-size:180px 180px;
}

/* ---- stage ---- */
.stage{
  container-type:inline-size;
  position:absolute;left:50%;top:50%;
  width:1536px;height:1024px;--fx:0px;
  transform-origin:center;transform:translate(-50%,-50%);
  overflow:hidden;
  background:
    radial-gradient(circle at 43% 35%,rgba(246,251,255,.74),transparent 31%),
    linear-gradient(112deg,#d6e6f5 0%,#d9e9f6 44%,#d4e5f4 100%);
}
.stage:before{
  content:"";position:absolute;inset:0;z-index:1;pointer-events:none;
  background:linear-gradient(90deg,rgba(255,255,255,.08),transparent 35%,rgba(255,255,255,.04));
}
.stage.is-fit{background:transparent;}
.stage.is-fit:before{display:none;}

/* ---- header ---- */
.header{position:absolute;inset:0 0 auto 0;height:82px;z-index:20;}
.brand{position:absolute;left:calc(var(--fx) + 46px);top:29px;width:57px;height:21px;display:block;}
.brand svg{display:block;width:57px;height:21px;}

.menu{position:absolute;left:calc(var(--fx) + 136px);top:31px;width:46px;height:19px;}
.menu span{
  position:absolute;left:0;width:45px;height:2px;background:var(--ink);transition:.25s;
}
.menu span:nth-child(1){top:2px;}
.menu span:nth-child(2){top:8px;}
.menu span:nth-child(3){top:14px;}
.stage.menu-open .menu span:nth-child(1){transform:translateY(6px) rotate(38deg);}
.stage.menu-open .menu span:nth-child(2){opacity:0;}
.stage.menu-open .menu span:nth-child(3){transform:translateY(-6px) rotate(-38deg);}

.nav{
  position:absolute;left:calc(50% - 277px);top:20px;
  width:524px;height:40px;padding:3px;display:grid;align-items:center;
  grid-template-columns:148px 125px 115px 130px;
  border:1px solid rgba(255,255,255,.5);border-radius:22px;
  background:rgba(245,249,255,.23);
  box-shadow:0 0 12px rgba(255,255,255,.7),inset 0 0 12px rgba(255,255,255,.42);
  -webkit-backdrop-filter:blur(17px);backdrop-filter:blur(17px);
}
.nav a{
  display:flex;align-items:center;justify-content:center;
  height:32px;font-size:16px;border-radius:18px;transition:.2s;
}
.nav a.active{background:rgba(255,255,255,.78);box-shadow:0 2px 12px rgba(26,48,78,.06);}
.nav a:hover,.nav a:focus-visible{background:rgba(255,255,255,.58);}

.join{
  position:absolute;right:calc(var(--fx) + 43px);top:17px;
  width:205px;height:46px;border-radius:25px;display:flex;align-items:center;padding:2px;
  background:rgba(246,250,255,.38);
  box-shadow:0 0 18px rgba(255,255,255,.46),inset 0 0 10px rgba(255,255,255,.45);
  -webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);
}
.join-icon{
  width:42px;height:42px;flex:0 0 42px;border-radius:50%;
  background:rgba(255,255,255,.82);
  display:flex;align-items:center;justify-content:center;
}
.join-label{font-size:16px;margin-left:12px;color:#5e7082;white-space:nowrap;}

/* ---- headline ---- */
.headline{
  position:absolute;left:calc(var(--fx) + 45px);top:98px;width:960px;
  font-size:var(--hf,79px);line-height:.99;letter-spacing:-.019em;
  word-spacing:.0633em;font-weight:400;z-index:8;
}
.headline-line{display:block;white-space:nowrap;}
.headline-line:first-child{letter-spacing:-.02975em;}
.headline-line2{display:flex;align-items:center;gap:.2658em;margin-top:2px;}
.chain{width:1.9114em;height:.6076em;flex:0 0 1.9114em;overflow:visible;}
.chain path{fill:var(--ink);}

/* ---- features / creator ---- */
.features{
  position:absolute;right:calc(var(--fx) + 44px);top:157px;width:190px;
  display:grid;gap:11px;z-index:10;font-size:20px;line-height:1.1;text-align:right;
}
.feature{display:flex;justify-content:flex-end;gap:18px;white-space:nowrap;}
.feature b{font-weight:400;}

.creator{
  position:absolute;right:calc(var(--fx) + 390px);top:311px;z-index:12;
  display:flex;align-items:flex-start;color:#77899b;
}
.verified{
  width:19px;height:19px;flex:0 0 19px;border-radius:50%;
  background:var(--ink);margin-right:10px;margin-top:1px;
  display:flex;align-items:center;justify-content:center;
}
.creator-copy{font-size:16px;line-height:1.25;}
.creator-copy .series{display:block;margin-top:9px;color:#8496a8;}

/* ---- glass card ---- */
.glass-card{
  position:absolute;left:calc(var(--fx) + 46px);top:344px;
  width:365px;height:211px;padding:9px 25px 18px 25px;
  border:1px solid rgba(255,255,255,.45);border-radius:24px;z-index:14;
  background:linear-gradient(135deg,rgba(255,255,255,.55),rgba(239,247,253,.42));
  box-shadow:inset 0 0 22px rgba(255,255,255,.32),0 7px 26px rgba(65,94,123,.045);
  -webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);
}
.card-top{height:60px;display:flex;align-items:flex-start;justify-content:space-between;}
.count{
  margin-left:-20px;padding:8px 21px 7px;border-radius:26px;
  color:#fff;background:linear-gradient(135deg,#0b2b50,#06192f);
  min-width:124px;text-align:center;
}
.count strong{display:block;font-size:20px;line-height:19px;font-weight:500;}
.count small{display:block;font-size:12px;margin-top:3px;}
.eye{
  width:38px;height:38px;margin-right:-6px;margin-top:10px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
}
.eye:hover{background:rgba(255,255,255,.5);}
.card-copy{margin:15px 0 0;font-size:18px;line-height:1.32;letter-spacing:-.14px;}
.card-bottom{
  position:absolute;left:25px;right:18px;bottom:15px;
  height:60px;display:flex;align-items:center;
}
.start{font-size:18px;line-height:18px;}
.start strong{font-size:21px;font-weight:500;}
.shuffle{
  width:42px;height:42px;border-radius:50%;
  margin-left:auto;margin-right:26px;
  display:flex;align-items:center;justify-content:center;
}
.shuffle:hover{background:rgba(255,255,255,.58);}
.play{
  width:58px;height:58px;border-radius:50%;background:var(--ink);
  box-shadow:0 5px 14px rgba(8,26,46,.12);transition:.25s;
  display:flex;align-items:center;justify-content:center;
}
.play:hover{transform:scale(1.05);}
.play svg{margin-left:4px;}
.play.active{box-shadow:0 0 0 7px rgba(17,105,220,.12),0 0 32px rgba(17,105,220,.38);}

/* ---- ghosts ---- */
.ghost{
  position:absolute;z-index:2;color:rgba(255,255,255,.43);
  font-weight:700;letter-spacing:-9px;line-height:.8;
  user-select:none;-webkit-user-select:none;pointer-events:none;
}
.ghost-one{left:calc(var(--fx) + 31px);top:594px;font-size:189px;transform:scaleX(1.23);transform-origin:left center;}
.o-gap{display:inline-block;width:105px;font-style:normal;}
.ghost-two{left:calc(50% - 16px);top:745px;font-size:164px;}

.robo-o-avatar{
  position:absolute;left:calc(var(--fx) + 174px);top:600px;
  width:143px;height:143px;
  border:8px solid rgba(255,255,255,.56);border-radius:50%;
  overflow:hidden;background:rgba(146,178,209,.13);
  z-index:4;pointer-events:none;
}
.robo-o-avatar img{
  position:absolute;left:-4px;top:5px;width:116px;height:147px;
  object-fit:contain;filter:drop-shadow(3px 5px 8px rgba(35,57,79,.12));
}

/* ---- material ---- */
.material{
  position:absolute;right:calc(var(--fx) + 44px);top:413px;
  width:345px;height:140px;z-index:13;
}
.material-pill{
  position:absolute;right:0;bottom:1px;width:345px;height:76px;
  border-radius:41px;background:var(--ink);
  display:flex;align-items:center;overflow:visible;
}
.material-thumb{
  position:absolute;left:0;bottom:1px;width:141px;height:180px;
  overflow:hidden;border-radius:0 0 0 38px;z-index:2;
}
.material-thumb img{
  position:absolute;left:-25px;top:35px;width:168px;height:153px;object-fit:contain;
}
.material-copy{margin-left:146px;color:#fff;font-size:17px;line-height:1.25;width:95px;}
.material-next{
  margin-left:auto;margin-right:6px;flex:0 0 65px;
  width:65px;height:65px;border-radius:50%;background:#f5f9fc;
  display:flex;align-items:center;justify-content:center;
}

/* ---- gallery ---- */
.gallery{
  position:absolute;right:calc(var(--fx) + 43px);bottom:46px;
  width:439px;height:296px;z-index:12;
}
.avatar{
  position:absolute;width:138px;height:138px;padding:0;
  border:8px solid rgba(247,251,255,.72);border-radius:50%;overflow:hidden;
  background:rgba(240,247,252,.56);
  transition:border-color .22s,box-shadow .22s;
}
.avatar img{
  width:var(--iw,112%);height:var(--iw,112%);object-fit:contain;
  transform:translate(var(--il,-6%),var(--it,-3%));
}
.avatar:hover,.avatar:focus-visible,.avatar.active{
  border-color:rgba(255,255,255,.97);
  box-shadow:0 0 0 2px rgba(17,105,220,.18),0 8px 20px rgba(46,74,101,.12);
}
.avatar:nth-child(1){left:160px;top:1px;}
.avatar:nth-child(2){left:312px;top:0;}
.avatar:nth-child(3){left:0;top:158px;}
.avatar:nth-child(4){left:155px;top:157px;}
.avatar:nth-child(5){left:310px;top:158px;}

/* ---- socials / toast ---- */
.socials{
  position:absolute;left:calc(var(--fx) + 46px);bottom:35px;
  display:flex;gap:17px;z-index:18;
}
.social{
  width:43px;height:43px;border-radius:50%;
  background:rgba(245,249,253,.55);
  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
  display:flex;align-items:center;justify-content:center;
}
.social:hover{background:#fff;outline:2px solid rgba(17,105,220,.18);}

.toast{
  position:absolute;left:50%;bottom:30px;z-index:40;
  transform:translate(-50%,18px);
  padding:11px 18px;border-radius:22px;
  color:#fff;background:rgba(6,25,47,.9);
  font-size:14px;opacity:0;pointer-events:none;transition:.24s;white-space:nowrap;
}
.toast.show{opacity:1;transform:translate(-50%,0);}

/* ---- menu panel ---- */
.menu-panel{
  position:absolute;left:calc(var(--fx) + 46px);top:86px;
  width:304px;padding:14px;display:grid;gap:6px;z-index:30;
  border:1px solid rgba(255,255,255,.6);border-radius:26px;
  background:linear-gradient(135deg,rgba(255,255,255,.94),rgba(237,246,253,.89));
  box-shadow:0 0 18px rgba(255,255,255,.5),inset 0 0 22px rgba(255,255,255,.5),0 14px 34px rgba(65,94,123,.13);
  -webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px);
  visibility:hidden;opacity:0;transform:translateY(-12px);
  transition:opacity .22s ease,transform .25s ease,visibility .25s;
}
.stage.nav-compact.menu-open .menu-panel{visibility:visible;opacity:1;transform:none;}
.menu-panel a{
  display:flex;align-items:center;height:60px;padding:0 20px;
  border-radius:20px;font-size:19px;
}
.menu-panel a.active{background:rgba(214,230,245,.85);box-shadow:0 0 0 2px rgba(17,105,220,.18);}
.menu-panel a:hover{background:rgba(214,230,245,.5);}

.menu-join{
  width:100%;height:64px;margin-top:8px;border-radius:32px;
  display:flex;align-items:center;padding:2px;
  background:rgba(246,250,255,.38);
  box-shadow:0 0 18px rgba(255,255,255,.46),inset 0 0 10px rgba(255,255,255,.45);
  -webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);
}
.menu-join .join-icon{width:48px;height:48px;flex:0 0 48px;}
.menu-join .join-icon svg{width:26px;height:26px;}
.menu-join .join-label{font-size:19px;margin-left:12px;}

.stage.nav-compact .nav,
.stage.nav-compact .join{display:none;}

/* ---- hero / spotlight ---- */
.hero{
  position:absolute;left:calc(50% - 373px);top:265px;
  width:600px;height:759px;z-index:7;pointer-events:none;
}
.hero img{width:100%;height:100%;object-fit:contain;display:block;}
.hero-stack{position:relative;width:100%;height:100%;pointer-events:auto;}
.hero-back,.hero-front{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:contain;display:block;pointer-events:none;
}
.hero-front{
  z-index:1;
  filter:drop-shadow(12px 17px 24px rgba(35,57,79,.12))
         hue-rotate(var(--hero-hue,0deg)) saturate(var(--hero-sat,1));
  transition:filter .4s ease;
}
.hero-back{
  z-index:2;
  mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat;
  mask-size:100% 100%;-webkit-mask-size:100% 100%;
  mask-mode:alpha;
}
.hero-mask-canvas{position:absolute;inset:0;pointer-events:none;display:none;}

/* ---- awake breathe ---- */
.hero.awake{animation:breathe 3.5s ease-in-out infinite;}
@keyframes breathe{50%{transform:translateY(-5px);}}
.hero.awake .hero-front{animation:breatheGlow 3.5s ease-in-out infinite;}
@keyframes breatheGlow{
  50%{
    filter:drop-shadow(10px 15px 34px rgba(16,105,220,.2))
           hue-rotate(var(--hero-hue,0deg))
           saturate(var(--hero-sat,1.08));
  }
}

/* ---- intro pre-state ---- */
html.intro .headline-line{clip-path:inset(0 -.12em 100% -.12em);}
html.intro .headline-line > *{transform:translateY(.9em);}
html.intro .brand,
html.intro .menu,
html.intro .nav,
html.intro .join,
html.intro .feature,
html.intro .hero,
html.intro .ghost,
html.intro .robo-o-avatar,
html.intro .glass-card,
html.intro .creator,
html.intro .material,
html.intro .avatar,
html.intro .social{opacity:0;}
html.intro .hero{transform:translateY(22px) scale(.99);}
html.intro .robo-o-avatar{transform:scale(.88);}
html.intro .glass-card{transform:translateY(18px);}
html.intro .creator{transform:translateY(10px);}
html.intro .material-pill{transform:translateX(16px);}
html.intro .avatar{transform:scale(.9);}
.hl-rv{display:block;}

/* ---- tier B: tablet ---- */
.stage.is-mobile{
  background:
    radial-gradient(circle at 63% 38%,rgba(249,253,255,.87),transparent 26%),
    linear-gradient(140deg,#d8e9f6,#d3e4f3);
}
.stage.is-mobile .header{height:88px;}
.stage.is-mobile .brand{left:24px;top:31px;width:56px;height:auto;}
.stage.is-mobile .brand svg{width:56px;height:auto;}
.stage.is-mobile .menu{left:96px;top:36px;width:42px;}
.stage.is-mobile .menu span{width:41px;}
.stage.is-mobile .join{right:16px;top:23px;width:120px;}
.stage.is-mobile .join-label{font-size:13px;margin-left:7px;}
.stage.is-mobile .headline{
  left:24px;top:112px;width:calc(100% - 48px);
  font-size:60px;line-height:1.02;letter-spacing:-1.8px;word-spacing:1px;
}
.stage.is-mobile .headline-line{white-space:normal;}
.stage.is-mobile .headline-line:first-child{letter-spacing:-2px;}
.stage.is-mobile .headline-line2{margin-top:14px;gap:14px;white-space:normal;}
.stage.is-mobile .chain{width:100px;height:32px;flex:0 0 100px;}
.stage.is-mobile .headline-line2 > span{display:block;width:calc(100% - 116px);}
.stage.is-mobile .features{right:24px;top:299px;width:194px;font-size:16px;gap:8px;}
.stage.is-mobile .feature{gap:13px;}
.stage.is-mobile .creator{left:24px;right:auto;top:322px;}
.stage.is-mobile .creator-copy{font-size:14px;}
.stage.is-mobile .ghost-one{left:13px;top:621px;font-size:142px;}
.stage.is-mobile .o-gap{width:79px;}
.stage.is-mobile .ghost-two{left:364px;top:804px;font-size:104px;}
.stage.is-mobile .robo-o-avatar{left:120px;top:623px;width:112px;height:112px;border-width:6px;}
.stage.is-mobile .robo-o-avatar img{left:-3px;top:4px;width:91px;height:116px;}
.stage.is-mobile .hero{left:calc(50% - 284px);top:339px;width:568px;height:719px;}
.stage.is-mobile .material{right:16px;top:775px;transform:scale(.78);transform-origin:right center;}
.stage.is-mobile .gallery{right:16px;bottom:278px;width:394px;height:132px;display:flex;gap:12px;}
.stage.is-mobile .avatar{position:relative;inset:auto;width:70px;height:70px;border-width:5px;flex:0 0 70px;}
.stage.is-mobile .glass-card{left:24px;top:auto;bottom:90px;width:calc(100% - 48px);height:214px;padding-left:27px;}
.stage.is-mobile .card-copy{font-size:17px;max-width:340px;}
.stage.is-mobile .count{margin-left:-22px;}
.stage.is-mobile .card-bottom{left:auto;right:19px;bottom:72px;width:230px;}
.stage.is-mobile .start{margin-right:auto;}
.stage.is-mobile .socials{left:24px;bottom:28px;}
.stage.is-mobile .toast{bottom:28px;}

@container (min-width:900px){
  .stage.is-mobile .glass-card{width:clamp(360px,45%,520px);padding:9px 25px 18px 25px;}
  .stage.is-mobile .card-copy{max-width:none;}
  .stage.is-mobile .card-bottom{left:25px;right:18px;bottom:15px;width:auto;}
  .stage.is-mobile .count{margin-left:-20px;}
  .stage.is-mobile .gallery{right:24px;bottom:162px;height:70px;align-items:center;}
}

/* ---- tier C: phones ---- */
@media (max-width:520px) and (orientation:portrait){
  html,body{height:auto;min-height:100%;overflow-x:hidden;overflow-y:auto;}
  .viewport{position:relative;inset:auto;min-height:100svh;overflow:visible;}
  .stage.is-phone{
    position:relative;left:auto;top:auto;width:100%;height:auto;min-height:100svh;
    transform:none;background:transparent;
    --gf:clamp(56px,16.5vw,84px);
    --gm:clamp(112px,33vw,186px);
    display:grid;grid-template-columns:1fr auto;
    grid-template-areas:"head head" "title title" "creator features" "art art"
                        "mat mat" "gal gal" "card card" "soc soc";
    align-content:start;row-gap:clamp(14px,4vw,22px);column-gap:16px;
    padding:0 clamp(16px,5vw,24px) clamp(22px,6vw,32px);
  }
  .stage.is-phone > *{position:static;inset:auto;margin:0;}
  .stage.is-phone .header{
    grid-area:head;position:relative;height:auto;
    display:flex;align-items:center;justify-content:space-between;
    padding:clamp(14px,4vw,20px) 0 0;
  }
  .stage.is-phone .brand{position:static;width:clamp(56px,16vw,68px);height:auto;aspect-ratio:58/21;}
  .stage.is-phone .brand svg{width:100%;height:auto;}
  .stage.is-phone .menu{position:relative;left:auto;top:auto;width:45px;height:19px;}
  .stage.is-phone .menu span{width:45px;}
  .stage.is-phone .menu:after{content:"";position:absolute;inset:-13px -4px;}
  .stage.is-phone .menu-panel{position:absolute;left:0;right:0;top:calc(100% + 12px);width:auto;}
  .stage.is-phone .nav,
  .stage.is-phone .join{display:none;}
  .stage.is-phone .headline{
    grid-area:title;width:auto;font-size:clamp(24px,7.3vw,38px);
    line-height:1.1;letter-spacing:-.5px;word-spacing:0;margin-top:clamp(4px,2vw,10px);
  }
  .stage.is-phone .headline-line{white-space:normal;}
  .stage.is-phone .headline-line:first-child{letter-spacing:-.8px;}
  .stage.is-phone .headline-line2{display:block;gap:0;margin-top:.04em;}
  .stage.is-phone .chain{
    display:inline-block;vertical-align:-.055em;margin-right:.2em;
    width:1.9114em;height:.6076em;flex:none;
  }
  .stage.is-phone .creator{grid-area:creator;align-self:start;left:auto;top:auto;right:auto;}
  .stage.is-phone .verified{width:17px;height:17px;flex-basis:17px;}
  .stage.is-phone .creator-copy{font-size:13px;}
  .stage.is-phone .creator-copy .series{font-size:12px;margin-top:6px;}
  .stage.is-phone .features{grid-area:features;font-size:13px;gap:7px;justify-self:end;align-self:start;right:auto;top:auto;width:auto;}
  .stage.is-phone .feature{gap:12px;}
  .stage.is-phone .hero{grid-area:art;position:relative;width:100%;height:auto;max-width:430px;justify-self:center;left:auto;top:auto;}
  .stage.is-phone .hero-stack{position:relative;height:auto;}
  .stage.is-phone .hero-front{position:relative;inset:auto;width:100%;height:auto;}
  .stage.is-phone .hero-back{position:absolute;inset:0;width:100%;height:100%;}
  .stage.is-phone .hero-mask-canvas{position:absolute;inset:0;}
  .stage.is-phone .ghost{letter-spacing:-.0476em;}
  .stage.is-phone .o-gap{width:.5556em;}
  .stage.is-phone .ghost-one{grid-area:art;font-size:var(--gf);justify-self:start;align-self:start;margin-top:var(--gm);left:auto;top:auto;}
  .stage.is-phone .ghost-two{grid-area:art;font-size:calc(var(--gf) * .87);justify-self:end;align-self:end;margin-bottom:clamp(24px,8vw,52px);left:auto;top:auto;}
  .stage.is-phone .robo-o-avatar{
    grid-area:art;position:relative;font-size:var(--gf);
    justify-self:start;align-self:start;
    margin-top:calc(var(--gm) + .0317em);margin-left:.7566em;
    width:.7566em;height:.7566em;border-width:.0423em;left:auto;top:auto;
  }
  .stage.is-phone .robo-o-avatar img{left:-.0212em;top:.0265em;width:.6138em;height:.7778em;}
  .stage.is-phone .material{grid-area:mat;width:100%;height:auto;margin-top:clamp(30px,10vw,56px);right:auto;top:auto;transform:none;}
  .stage.is-phone .material-pill{position:relative;width:100%;height:clamp(64px,18vw,76px);right:auto;bottom:auto;}
  .stage.is-phone .material-thumb{width:clamp(96px,28vw,126px);height:clamp(122px,36vw,161px);bottom:0;left:0;}
  .stage.is-phone .material-thumb img{left:-17.7%;top:19.4%;width:119.1%;height:auto;}
  .stage.is-phone .material-copy{margin-left:clamp(102px,30vw,134px);width:auto;font-size:clamp(14px,4vw,16px);}
  .stage.is-phone .material-next{width:clamp(48px,14vw,58px);height:clamp(48px,14vw,58px);flex-basis:auto;margin-right:6px;}
  .stage.is-phone .gallery{grid-area:gal;width:100%;height:auto;display:flex;gap:clamp(6px,2.2vw,12px);justify-content:space-between;right:auto;bottom:auto;}
  .stage.is-phone .avatar{position:relative;inset:auto;width:auto;height:auto;flex:1 1 0;min-width:0;aspect-ratio:1;border-width:clamp(3px,1.2vw,5px);}
  .stage.is-phone .glass-card{grid-area:card;width:auto;height:auto;padding:14px 20px 20px;left:auto;top:auto;bottom:auto;right:auto;}
  .stage.is-phone .card-top{height:auto;align-items:center;}
  .stage.is-phone .count{margin-left:-14px;min-width:0;padding:8px 18px 7px;}
  .stage.is-phone .eye{width:40px;height:40px;margin:0;}
  .stage.is-phone .card-copy{margin-top:clamp(12px,4vw,16px);font-size:clamp(14px,4.1vw,16px);max-width:none;}
  .stage.is-phone .card-bottom{position:static;height:auto;width:auto;left:auto;right:auto;bottom:auto;margin-top:clamp(14px,4.5vw,20px);}
  .stage.is-phone .start{font-size:clamp(13px,3.8vw,15px);line-height:1.2;margin-right:0;}
  .stage.is-phone .start strong{font-size:clamp(16px,4.6vw,19px);}
  .stage.is-phone .shuffle{width:40px;height:40px;margin-right:clamp(10px,4vw,18px);}
  .stage.is-phone .play{width:clamp(48px,14vw,56px);height:clamp(48px,14vw,56px);}
  .stage.is-phone .socials{grid-area:soc;display:flex;gap:clamp(12px,4vw,17px);left:auto;bottom:auto;}
  .stage.is-phone .social{width:44px;height:44px;}
  .stage.is-phone > .toast{position:absolute;left:50%;top:auto;bottom:clamp(18px,5vw,26px);}
}

@media (prefers-reduced-motion:reduce){
  *{scroll-behavior:auto !important;animation:none !important;transition:none !important;}
}
`;

/* ============================================================
   COMPONENT
   ============================================================ */
export default function Nival() {
  /* ---------- refs ---------- */
  const stageRef = useRef(null);
  const stackRef = useRef(null);
  const backRef = useRef(null);
  const canvasRef = useRef(null);
  const burgerRef = useRef(null);
  const panelRef = useRef(null);
  const toastTimerRef = useRef(null);

  /* ---------- state ---------- */
  const [layout, setLayout] = useState({
    isMobile: false,
    isFit: false,
    isPhone: false,
    navCompact: false,
    width: 1536,
    height: 1024,
    scale: 1,
    hf: "79px",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [joined, setJoined] = useState(false);
  const [playActive, setPlayActive] = useState(false);
  const [heroAwake, setHeroAwake] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(0);
  const [activeNav, setActiveNav] = useState("Home page");
  const [toast, setToast] = useState({ msg: "", visible: false });

  /* ---------- toast helper ---------- */
  const say = (msg) => {
    setToast({ msg, visible: true });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      1700
    );
  };
  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  /* ---------- responsive layout ---------- */
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const PHONE = window.matchMedia(
      "(max-width:520px) and (orientation:portrait)"
    );

    const update = () => {
      if (PHONE.matches) {
        setLayout((l) => ({
          ...l,
          isMobile: false,
          isFit: false,
          isPhone: true,
          navCompact: true,
        }));
        return;
      }
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w / h < 1.05;
      const bh = mobile ? 1366 : 1024;
      const ideal = Math.round((bh * w) / h);
      const lo = mobile ? 560 : 1060;
      const hi = mobile ? 1450 : 2600;
      const bw = Math.max(lo, Math.min(hi, ideal));
      const s = Math.min(w / bw, h / bh);
      const hf = Math.min(79, (79 * (bw - 295)) / 965).toFixed(2) + "px";
      const isFit = Math.abs(ideal - bw) > 1;
      const compact = mobile || s < 0.52;

      setLayout({
        isMobile: mobile,
        isFit,
        isPhone: false,
        navCompact: compact,
        width: bw,
        height: bh,
        scale: s,
        hf,
      });
      if (!compact) setMenuOpen(false);
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  /* ---------- escape / outside-click ---------- */
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onKey = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    const onPointer = (e) => {
      if (!menuOpen) return;
      if (
        panelRef.current?.contains(e.target) ||
        burgerRef.current?.contains(e.target)
      )
        return;
      setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer, true);
    };
  }, [menuOpen]);

  /* ---------- focus panel when opened in compact ---------- */
  useEffect(() => {
    if (menuOpen && layout.navCompact && panelRef.current) {
      const first = panelRef.current.querySelector("a");
      if (first) requestAnimationFrame(() => first.focus());
    }
  }, [menuOpen, layout.navCompact]);

  /* ---------- ★ spotlight ---------- */
  useEffect(() => {
    const stack = stackRef.current;
    const back = backRef.current;
    const canvas = canvasRef.current;
    if (!stack || !back || !canvas) return;

    const ctx = canvas.getContext("2d");
    const R = 185;
    const mouse = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = stack.offsetWidth || 600;
      canvas.height = stack.offsetHeight || 759;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onMove = (e) => {
      const r = stack.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const sx = stack.offsetWidth / r.width;
      const sy = stack.offsetHeight / r.height;
      mouse.x = (e.clientX - r.left) * sx;
      mouse.y = (e.clientY - r.top) * sy;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    stack.addEventListener("pointermove", onMove);
    stack.addEventListener("pointerleave", onLeave);

    const render = (x, y) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const g = ctx.createRadialGradient(x, y, 0, x, y, R);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.62, "rgba(255,255,255,1)");
      g.addColorStop(0.8, "rgba(255,255,255,0.5)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fill();
      const url = canvas.toDataURL();
      back.style.maskImage = `url(${url})`;
      back.style.webkitMaskImage = `url(${url})`;
    };

    let raf = 0;
    const loop = () => {
      smooth.x += (mouse.x - smooth.x) * 0.1;
      smooth.y += (mouse.y - smooth.y) * 0.1;
      render(smooth.x, smooth.y);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      stack.removeEventListener("pointermove", onMove);
      stack.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* ---------- ★ entrance timeline ---------- */
  useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    if (!html.classList.contains("intro")) return;
    if (typeof Element === "undefined" || !Element.prototype.animate) {
      html.classList.remove("intro");
      return;
    }

    const near = window.innerWidth < 640 ? 0.6 : 1;
    const px = (v) => (v * near).toFixed(2) + "px";
    const TYPE = "cubic-bezier(.16,1,.3,1)";
    const SOFT = "cubic-bezier(.22,.61,.36,1)";

    const anims = [];
    const q = (sel) =>
      Array.prototype.slice.call(document.querySelectorAll(sel));

    const run = (els, kf, dur, at, stagger, easing) => {
      els.forEach((el, i) => {
        if (!el || !el.animate) return;
        anims.push(
          el.animate(kf, {
            duration: dur * 1000,
            delay: (at + i * (stagger || 0)) * 1000,
            easing: easing || SOFT,
            fill: "both",
          })
        );
      });
    };
    const fade = (from) => [
      { opacity: 0, transform: from },
      { opacity: 1, transform: "none" },
    ];

    /* 1 — chrome */
    run(q(".brand"), fade("translateY(-10px)"), 0.5, 0.04, 0, SOFT);
    run(q(".menu"), fade("translateY(-10px)"), 0.5, 0.09, 0, SOFT);
    run(q(".nav"), fade("translateY(-10px)"), 0.55, 0.13, 0, SOFT);
    run(q(".join"), fade("translateY(-10px)"), 0.55, 0.18, 0, SOFT);

    /* 2 — headline lines */
    q(".headline-line").forEach((line, i) => {
      const at = 0.22 + i * 0.11;
      anims.push(
        line.animate(
          [
            { clipPath: "inset(0 -.12em 100% -.12em)" },
            { clipPath: "inset(-.34em -.12em -.34em -.12em)" },
          ],
          { duration: 950, delay: at * 1000, easing: TYPE, fill: "both" }
        )
      );
      Array.prototype.forEach.call(line.children, (child) => {
        if (!child.animate) return;
        anims.push(
          child.animate(
            [{ transform: "translateY(.9em)" }, { transform: "none" }],
            { duration: 950, delay: at * 1000, easing: TYPE, fill: "both" }
          )
        );
      });
    });

    /* 3 — hero */
    run(q(".hero"), fade(`translateY(${px(22)}) scale(.99)`), 1.05, 0.48, 0, TYPE);

    /* 4 — features */
    run(q(".feature"), fade(`translateX(${px(12)})`), 0.55, 0.52, 0.07, SOFT);

    /* 5 — ghosts + robo-o */
    run(q(".ghost"), [{ opacity: 0 }, { opacity: 1 }], 0.9, 0.62, 0.09, SOFT);
    run(q(".robo-o-avatar"), fade("scale(.88)"), 0.62, 0.8, 0, TYPE);

    /* 6 — glass card + creator */
    run(q(".glass-card"), fade(`translateY(${px(18)})`), 0.78, 0.7, 0, TYPE);
    run(q(".creator"), fade(`translateY(${px(10)})`), 0.6, 0.82, 0, SOFT);

    /* 7 — material + avatars + socials */
    run(q(".material"), [{ opacity: 0 }, { opacity: 1 }], 0.72, 0.86, 0, SOFT);
    run(
      q(".material-pill"),
      [{ transform: `translateX(${px(16)})` }, { transform: "none" }],
      0.72,
      0.86,
      0,
      TYPE
    );
    run(q(".avatar"), fade("scale(.9)"), 0.55, 0.94, 0.06, TYPE);
    run(q(".social"), fade(`translateY(${px(9)})`), 0.5, 1.08, 0.05, SOFT);

    /* teardown when the last animation ends */
    let maxEnd = -1;
    let last = null;
    anims.forEach((a) => {
      let end = 0;
      try {
        end = a.effect.getComputedTiming().endTime;
      } catch (e) {}
      if (end > maxEnd) {
        maxEnd = end;
        last = a;
      }
    });

    const teardown = () => {
      html.classList.remove("intro");
      anims.forEach((a) => {
        try {
          a.cancel();
        } catch (e) {}
      });
      anims.length = 0;
    };

    if (last && last.addEventListener) {
      last.addEventListener("finish", teardown, { once: true });
    }
    const safety = setTimeout(() => {
      if (html.classList.contains("intro")) teardown();
    }, Math.max(0, maxEnd) + 400);

    return () => {
      clearTimeout(safety);
      teardown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- derived ---------- */
  const avatar = AVATARS[currentAvatar];
  const heroStyle = {
    "--hero-hue": avatar.hue + "deg",
    "--hero-sat": avatar.sat,
  };

  const stageClassName = [
    "stage",
    layout.isMobile && "is-mobile",
    layout.isFit && "is-fit",
    layout.isPhone && "is-phone",
    layout.navCompact && "nav-compact",
    menuOpen && "menu-open",
  ]
    .filter(Boolean)
    .join(" ");

  const stageStyle = layout.isPhone
    ? undefined
    : {
        width: layout.width + "px",
        height: layout.height + "px",
        transform: `translate(-50%,-50%) scale(${layout.scale})`,
        "--hf": layout.hf,
      };

  const navItems = ["Home page", "Pricing", "About", "Contact"];

  const handleNav = (label) => (e) => {
    e.preventDefault();
    setActiveNav(label);
    if (menuOpen) setMenuOpen(false);
    say(label);
  };

  const handleJoin = () => {
    const next = !joined;
    setJoined(next);
    say(next ? "Welcome to Nival" : "See you soon");
  };

  const handlePlay = () => {
    const on = !playActive;
    setPlayActive(on);
    setHeroAwake(on);
    say(on ? "Identity activated" : "Identity paused");
  };

  const handleEye = () => {
    const on = !heroAwake;
    setHeroAwake(on);
    say(on ? "Previewing live identity" : "Preview paused");
  };

  const handleAvatar = (i) => {
    const idx = ((i % 5) + 5) % 5;
    setCurrentAvatar(idx);
    say("Identity " + String(idx + 1).padStart(2, "0"));
  };

  const handleBurger = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    say(next ? "Menu ready" : "Menu closed");
  };

  return (
    <main
      className="viewport"
      aria-label="Nival cyberspace identity experience"
    >
      <style>{GLOBAL_CSS}</style>

      <div ref={stageRef} className={stageClassName} style={stageStyle}>
        {/* ============ HEADER ============ */}
        <header className="header">
          <a className="brand" href="#home" aria-label="Nival home">
            <svg viewBox="0 0 58 21" fill="var(--ink)" aria-hidden="true">
              <path d="M0 0h7v21H0zM21 0h7v21h-7zM0 0h12l16 21H16zM30 0h8l12 21h-8zM51 0h7v21h-7z" />
            </svg>
          </a>

          <button
            ref={burgerRef}
            type="button"
            className="menu"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="menuPanel"
            onClick={handleBurger}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className="nav" aria-label="Primary">
            {navItems.map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                className={activeNav === label ? "active" : undefined}
                onClick={handleNav(label)}
              >
                {label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="join"
            aria-label={joined ? "Joined" : "Join us"}
            onClick={handleJoin}
          >
            <span className="join-icon">
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M4.5 21c.4-5 3.1-7.3 7.5-7.3s7.1 2.3 7.5 7.3" />
              </svg>
            </span>
            <span className="join-label">{joined ? "Joined" : "Join us"}</span>
          </button>

          <div
            ref={panelRef}
            className="menu-panel"
            id="menuPanel"
            aria-hidden={!menuOpen}
            aria-label="Menu"
          >
            {navItems.map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                className={activeNav === label ? "active" : undefined}
                onClick={handleNav(label)}
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              className="menu-join"
              aria-label={joined ? "Joined" : "Join us"}
              onClick={handleJoin}
            >
              <span className="join-icon">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path d="M4.5 21c.4-5 3.1-7.3 7.5-7.3s7.1 2.3 7.5 7.3" />
                </svg>
              </span>
              <span className="join-label">
                {joined ? "Joined" : "Join us"}
              </span>
            </button>
          </div>
        </header>

        {/* ============ HEADLINE ============ */}
        <h1 className="headline" id="home">
          <span className="headline-line">
            <span className="hl-rv">Cyberspace — reality</span>
          </span>
          <span className="headline-line headline-line2">
            <svg className="chain" viewBox="0 0 151 48" aria-hidden="true">
              <path
                d="M28 7A26 17 0 0 1 28 41L28 33.5A16.5 9.5 0 0 0 28 14.5ZM28 7A26 17 0 0 0 28 41L28 33.5A16.5 9.5 0 0 1 28 14.5ZM75.5 7A26 17 0 0 1 75.5 41L75.5 33.5A16.5 9.5 0 0 0 75.5 14.5ZM75.5 7A26 17 0 0 0 75.5 41L75.5 33.5A16.5 9.5 0 0 1 75.5 14.5ZM123 7A26 17 0 0 1 123 41L123 33.5A16.5 9.5 0 0 0 123 14.5ZM123 7A26 17 0 0 0 123 41L123 33.5A16.5 9.5 0 0 1 123 14.5Z"
                fill="var(--ink)"
              />
            </svg>
            <span>merge with the virtual</span>
          </span>
        </h1>

        {/* ============ FEATURES ============ */}
        <div className="features">
          <div className="feature">
            <span>Web based</span>
            <b>/01</b>
          </div>
          <div className="feature">
            <span>Collaborative</span>
            <b>/02</b>
          </div>
          <div className="feature">
            <span>Real-time</span>
            <b>/03</b>
          </div>
        </div>

        {/* ============ CREATOR ============ */}
        <div className="creator">
          <span className="verified" aria-hidden="true">
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2.2 6.2 4.7 8.5 9.8 3" />
            </svg>
          </span>
          <div className="creator-copy">
            By Nival_02
            <span className="series">Identity series · 02</span>
          </div>
        </div>

        {/* ============ GLASS CARD ============ */}
        <div className="glass-card">
          <div className="card-top">
            <div className="count">
              <strong>+105</strong>
              <small>kinds of avatars</small>
            </div>
            <button
              type="button"
              className="eye"
              aria-label="Preview live identity"
              onClick={handleEye}
            >
              <svg
                width="33"
                height="23"
                viewBox="0 0 32 22"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M1 11s5.5-8 15-8 15 8 15 8-5.5 8-15 8S1 11 1 11z" />
                <circle cx="16" cy="11" r="3.5" />
              </svg>
            </button>
          </div>

          <p className="card-copy">
            Explore digital identities, crafted
            <br />
            for a new kind of presence.
          </p>

          <div className="card-bottom">
            <div className="start">
              Start
              <br />
              <strong>creating</strong>
            </div>
            <button
              type="button"
              className="shuffle"
              aria-label="Shuffle avatar"
              onClick={() => handleAvatar(currentAvatar + 1)}
            >
              <svg
                width="27"
                height="27"
                viewBox="0 0 30 30"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 8h4.2c1.1 0 2.2.5 2.9 1.4l6.8 8.2c.7.9 1.8 1.4 2.9 1.4H24" />
                <path d="M3 22h4.2c1.1 0 2.2-.5 2.9-1.4l6.8-8.2c.7-.9 1.8-1.4 2.9-1.4H24" />
                <path d="M20 4l4 4-4 4" />
                <path d="M20 18l4 4-4 4" />
              </svg>
            </button>
            <button
              type="button"
              className={`play${playActive ? " active" : ""}`}
              aria-label="Activate identity"
              aria-pressed={playActive}
              onClick={handlePlay}
            >
              <svg
                width="24"
                height="26"
                viewBox="0 0 24 26"
                fill="#fff"
                aria-hidden="true"
              >
                <path d="m3 2 19 12L3 26z" />
              </svg>
            </button>
          </div>
        </div>

        {/* ============ GHOSTS ============ */}
        <div className="ghost ghost-one" aria-hidden="true">
          R<i className="o-gap" />
          BO
        </div>
        <div className="ghost ghost-two" aria-hidden="true">
          FORM
        </div>

        <div className="robo-o-avatar" aria-hidden="true">
          <img src={HERO_FRONT} alt="" />
        </div>

        {/* ============ HERO + SPOTLIGHT ============ */}
        <div
          className={`hero${heroAwake ? " awake" : ""}`}
          id="hero"
          style={heroStyle}
        >
          <div className="hero-stack" ref={stackRef}>
            <img
              className="hero-front"
              src={HERO_FRONT}
              alt="White and silver female android"
            />
            <img
              ref={backRef}
              className="hero-back"
              src={HERO_BACK}
              alt=""
              aria-hidden="true"
            />
            <canvas
              ref={canvasRef}
              className="hero-mask-canvas"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* ============ MATERIAL ============ */}
        <div className="material">
          <div className="material-pill">
            <div className="material-thumb">
              <img src={MATERIAL} alt="" />
            </div>
            <div className="material-copy">
              Adaptive
              <br />
              materials
            </div>
            <button
              type="button"
              className="material-next"
              aria-label="Next material"
              onClick={() => handleAvatar(currentAvatar + 1)}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 32 32"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 8 24 25M12 25h12V13" />
              </svg>
            </button>
          </div>
        </div>

        {/* ============ GALLERY ============ */}
        <div className="gallery" role="group" aria-label="Avatar gallery">
          {AVATARS.map((a, i) => (
            <button
              key={i}
              type="button"
              className={`avatar${i === currentAvatar ? " active" : ""}`}
              aria-label={`Identity ${String(i + 1).padStart(2, "0")}`}
              style={{
                "--iw": a.iw,
                "--il": a.il,
                "--it": a.it,
                ...(a.bg ? { background: a.bg } : {}),
              }}
              onClick={() => handleAvatar(i)}
            >
              <img src={a.src} alt="" />
            </button>
          ))}
        </div>

        {/* ============ SOCIALS ============ */}
        <div className="socials">
          {[
            { name: "Instagram", icon: "instagram" },
            { name: "Facebook", icon: "facebook" },
            { name: "Telegram", icon: "telegram" },
          ].map((s) => (
            <button
              key={s.name}
              type="button"
              className="social"
              aria-label={s.name}
              onClick={() => say(`${s.name} selected`)}
            >
              {s.icon === "instagram" && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="var(--ink)"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.4 2h9.2A5.4 5.4 0 0 1 22 7.4v9.2a5.4 5.4 0 0 1-5.4 5.4H7.4A5.4 5.4 0 0 1 2 16.6V7.4A5.4 5.4 0 0 1 7.4 2Zm9.2 1.9H7.4a3.5 3.5 0 0 0-3.5 3.5v9.2a3.5 3.5 0 0 0 3.5 3.5h9.2a3.5 3.5 0 0 0 3.5-3.5V7.4a3.5 3.5 0 0 0-3.5-3.5Z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 1.9a3.1 3.1 0 1 1 0 6.2 3.1 3.1 0 0 1 0-6.2Z"
                  />
                  <circle cx="17.4" cy="6.6" r="1.2" />
                </svg>
              )}
              {s.icon === "facebook" && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="var(--ink)"
                  aria-hidden="true"
                >
                  <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3-.04-1.3-.13-2.45-.13-2.42 0-4.08 1.48-4.08 4.2v2.22H7.4V13h2.77v8h3.33Z" />
                </svg>
              )}
              {s.icon === "telegram" && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="var(--ink)"
                  aria-hidden="true"
                >
                  <path d="M21.6 4.3 2.9 11.5c-.9.35-.9.85-.16 1.07l4.8 1.5 1.86 5.6c.23.63.11.88.77.88.5 0 .72-.23 1-.5l2.4-2.33 4.98 3.68c.92.5 1.58.24 1.8-.85l3.26-15.3c.33-1.34-.5-1.95-1.4-1.55Z" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* ============ TOAST ============ */}
        <div
          className={`toast${toast.visible ? " show" : ""}`}
          role="status"
          aria-live="polite"
        >
          {toast.msg}
        </div>
      </div>
    </main>
  );
}