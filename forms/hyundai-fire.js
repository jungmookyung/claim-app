/* 현대해상 보험금청구서 (질병·상해) 8P (정보보호파트 승인 2026.04.16) — 좌표 단위: pt, 원점 좌상단, 페이지 번호는 0부터
   1쪽 청구서 · 2~5쪽 [필수] 개인(신용)정보 처리 상세 동의서 · 6쪽 작성 예시 · 7쪽 지급절차 안내 · 8쪽 서류 안내 */
(function(){
  var S=9, W1=19.2;
  function digits(s){ return String(s||'').replace(/[^0-9]/g,''); }
  function ymd(v){ if(!v) return null; var a=v.split('-'); if(a.length<3) return null; return {y:a[0], yy:a[0].slice(2), m:('0'+(+a[1])).slice(-2), d:('0'+(+a[2])).slice(-2), m1:String(+a[1]), d1:String(+a[2])}; }
  // 주민번호 13칸(왼쪽 끝), 연락처 11칸(3-4-4)
  var RRN=[254.75,278.5,302.5,326.25,350,374, 401.5,425.25,449.25,473,496.75,520.75,544.5];
  var TEL=[[254.5,278,301.75],[332.25,356.25,380,403.75],[433.75,457.75,481.5,505.25]];
  var CB={
    medicaid:{'예':[289.82,253.2],'아니요':[330.14,253.2]},
    recv:{'피보험자':[135.96,321.02],'계약자':[212.42,321.02],'기타':[278.81,321.02]},
    how:{'문자':[135.09,344.13],'전화':[181.97,344.13],'우편':[228.84,344.13],'E-MAIL':[276.07,344.13],'거부':[337.99,344.13]},
    planner:{'예':[492.74,362.56],'아니오':[529.03,362.56]},
    rtype:{'최초청구':[392.71,404.47],'동일사고 추가청구':[454.99,404.47]},
    atype:{'질병':[96.29,427.08],'상해':[173.83,427.08],'교통사고':[251.37,427.08]},
    care:{'입원':[392.71,427.08],'통원':[455.49,427.08]},
    seat:{'운전석':[257.21,482.01],'조수석':[295.37,482.01],'뒷자리':[333.53,482.01],'보행중':[371.69,482.01],'기타':[371.69,482.01]},
    autoIns:{'아니요':[141.43,506.13],'예':[196.58,506.13]},
    cov:{'실손의료비':[88.68,526.79],'입원일당':[141.52,526.79],'진단비':[186.31,526.79],'수술비':[223.03,526.79],'후유장해':[261.4,526.79],'사망':[307.84,526.79]}, covEtc:[338.16,526.79],
    exclude:[445.22,529.67],
    other:{'삼성화재':[88.75,549.83],'DB손해보험':[131.52,549.83],'KB손해보험':[169.25,549.83],'메리츠화재':[206.25,549.83],'삼성생명':[241.46,549.83],'한화생명':[284.23,549.83],'교보생명':[327.0,549.83]}, otherEtc:[369.76,549.83],
    autopay:[140.08,601.88]
  };
  // 동의서 네모 중심 — no: 동의하지 않음, yes: 동의함 (네모 한 변 약 20pt)
  var CONSENT={
    collect:{page:1, no:418.5, yes:516.0, rows:{uid:[430.6],sens:[535.8],credit:[658.4]}},
    provide:{page:2, no:419.0, yes:513.4, rows:{uid:[559.6],sens:[659.0]}},
    provide2:{page:3, no:417.2, yes:511.8, rows:{credit:[202.0]}},
    abroad:{page:3, no:417.9, yes:512.2, rows:[621.1,713.4]},
    inquire:{page:4, no:416.8, yes:514.3, rows:{uid:[282.5],sens:[328.9],credit:[418.0]}}
  };
  var BEIGE='#fdf3e6';
  function birth(rrn){ var s=digits(rrn); if(s.length<6) return '';
    var c={'1':'19','2':'19','5':'19','6':'19','3':'20','4':'20','7':'20','8':'20','9':'18','0':'18'}[s[6]]||'';
    var b=(c?c+s.slice(0,2):s.slice(0,2))+'.'+s.slice(2,4)+'.'+s.slice(4,6);
    return s.length>=7 ? b+' / '+(+s[6]%2?'남':'여') : b; }
  function telParts(t){ var p=String(t||'').split(/[^0-9]+/).filter(Boolean); if(p.length===3) return p;
    var s=digits(t); if(!s) return null;
    if(s.length===11) return [s.slice(0,3),s.slice(3,7),s.slice(7)];
    if(s.length===10) return s.indexOf('02')===0?[s.slice(0,2),s.slice(2,6),s.slice(6)]:[s.slice(0,3),s.slice(3,6),s.slice(6)];
    if(s.length===9&&s.indexOf('02')===0) return [s.slice(0,2),s.slice(2,5),s.slice(5)];
    return null; }
  function fill(d,opt){
    opt=opt||{};
    var pg={0:[],1:[],2:[],3:[],4:[]}, p1=pg[0], p5=pg[4];
    function T(arr,box,v,o){ if(v) arr.push(Object.assign({t:'text',box:box,v:String(v),s:S},o||{})); }
    function Wt(arr,box,fill){ arr.push({t:'rect',box:box,fill:fill||'#fff'}); }
    function C(arr,pt,sz){ if(pt) arr.push({t:'check',cx:pt[0],cy:pt[1],sz:sz||1.25}); }
    function D(arr,xs,y0,y1,v){ var s=digits(v); xs.forEach(function(x,i){ var c=s[i]; if(c) arr.push({t:'text',box:[x,y0,x+W1,y1],v:c,s:10,align:'center'}); }); }
    function TELD(arr,y0,y1,v){ var p=telParts(v); if(!p){ T(arr,[254,y0,566,y1],v); return; }
      p.forEach(function(g,i){ D(arr,TEL[i].slice(0,g.length),y0,y1,g); }); }
    // ① 인적사항 및 보상 안내 받으실 분
    T(p1,[122,219.2,204,241.8],d.insured.name,{align:'center',k:'피보험자 성명'});
    D(p1,RRN,219.2,241.8,d.insured.rrn);
    T(p1,[122,241.8,204,264.5],d.insured.job,{wrap:2,s:8,align:'center',k:'직장/직무'});
    C(p1,CB.medicaid[d.medicaid]);
    T(p1,[122,264.5,204,287.1],d.holder.name,{align:'center',k:'계약자 성명'});
    D(p1,RRN,264.5,287.1,d.holder.rrn);
    T(p1,[122,287.1,204,309.7],d.recvName,{align:'center',k:'처리안내 성명'});
    TELD(p1,287.1,309.7,d.recvTel);
    C(p1,CB.recv[d.recv]);
    var nt=d.notice||[], det=[];
    if(nt.indexOf('문자메시지')>=0||nt.indexOf('알림톡')>=0) C(p1,CB.how['문자']);
    if(nt.indexOf('유선(전화)')>=0) C(p1,CB.how['전화']);
    if(nt.indexOf('우편')>=0){ C(p1,CB.how['우편']); if(d.insured.addr) det.push(d.insured.addr); }
    if(nt.indexOf('e-mail')>=0){ C(p1,CB.how['E-MAIL']); if(d.insured.email) det.push(d.insured.email); }
    if(nt.indexOf('알림톡')>=0) det.unshift('카카오 알림톡');
    if(nt.indexOf('팩스')>=0) det.push('팩스 안내 희망');
    if(det.length){ Wt(p1,[405,317,566,346]); T(p1,[406,311,566,354],det.join(' / '),{wrap:2,s:8,align:'center',k:'E-MAIL/주소 상세'}); }
    C(p1,CB.planner['예']);
    // ② 청구사항
    var ad=ymd(d.date);
    if(ad){ T(p1,[104,392.1,140,414.7],ad.yy,{align:'center'}); T(p1,[152,392.1,192,414.7],ad.m,{align:'center'}); T(p1,[203,392.1,246,414.7],ad.d,{align:'center'}); }
    if(d.time){ var hm=d.time.split(':'); T(p1,[258,392.1,302,414.7],String(+hm[0])+(+hm[1]?':'+hm[1]:''),{align:'center'}); }
    C(p1,CB.rtype[d.rtype]);
    C(p1,CB.atype[d.atype]);
    if(d.care==='입원'||d.care==='입원·통원') C(p1,CB.care['입원']);
    if(d.care==='통원'||d.care==='입원·통원') C(p1,CB.care['통원']);
    var st=[]; if(d.dx) st.push('진단명: '+d.dx); if(d.atype!=='질병'&&d.place) st.push('장소: '+d.place); if(d.story) st.push(d.story);
    if(st.length){ Wt(p1,[140,441,270,465.5]); T(p1,[84,438.5,331,468.5],st.join(' / '),{wrap:2,s:8.5,align:'center',k:'치료경위'}); }
    var hp=[d.hospital,d.dept].filter(Boolean).join(' / ');
    if(hp){ Wt(p1,[436,447,508,460]); T(p1,[384,438.5,566,468.5],hp,{wrap:2,align:'center',k:'병원명/진료과'}); }
    if(d.atype==='교통사고'){
      T(p1,[122,469.4,205,494.5],d.car.no,{s:8,align:'center',k:'본인차량번호'});
      C(p1,CB.seat[d.car.seat]);
      C(p1,CB.autoIns[d.car.autoIns]);
      if(d.car.autoIns==='예'){
        T(p1,[262,499,308,513],d.car.insurer,{s:7.5,k:'자동차보험 보험사'});
        var ct=d.car.contact||'', m=ct.match(/0\d[\d\-\s]{6,}\d/), ph=m?m[0].trim():'', who=ct.replace(ph,'').replace(/[\/,·]/g,' ').trim();
        T(p1,[361,499,420,513],who,{s:7.5,k:'담당자명'}); T(p1,[460,499,560,513],ph,{s:7.5,k:'담당자 연락처'});
      }
    }
    var etc=[]; (d.cov||[]).forEach(function(c){ if(CB.cov[c]) C(p1,CB.cov[c]); else etc.push(c); });
    if(etc.length){ C(p1,CB.covEtc); T(p1,[363.5,520,402.5,533],etc.join(', '),{s:7.5,align:'center'}); }
    if(d.exclude){ C(p1,CB.exclude); T(p1,[470,542,546,556],d.exclude,{s:7.5,k:'보상제외 담보'}); }
    var oth=d.others||[], oe=[];
    oth.forEach(function(n){ if(CB.other[n]) C(p1,CB.other[n]); else oe.push(n.replace('손해보험','손보')); });
    if(oe.length){ C(p1,CB.otherEtc); Wt(p1,[418.4,544,422.6,555.5]); T(p1,[394,543,430.5,557],oe.join(', '),{s:7,align:'center',k:'타보험 기타'}); T(p1,[430.5,543.3,435,554.3],')',{s:9}); }
    // ③ 보험금 수령계좌
    if(d.autopay) C(p1,CB.autopay);
    T(p1,[87,613.3,185,635.9],d.bank,{align:'center',k:'금융기관명'});
    T(p1,[237,613.3,428,635.9],d.acct,{align:'center',k:'계좌번호'});
    T(p1,[479,613.3,566,635.9],d.acctHolder,{align:'center',k:'예금주'});
    // ④ 작성일자 · 보험금청구인(대리인)
    var wd=ymd(d.writeDate);
    if(wd){ T(p1,[108,698.9,140,721.5],wd.yy,{align:'center'}); T(p1,[152,698.9,186,721.5],wd.m,{align:'center'}); T(p1,[198,698.9,232,721.5],wd.d,{align:'center'}); }
    var who1=d.guardian?d.guardian+' (법정대리인)':d.insured.name;
    if(who1){ Wt(p1,[400,703,427,717]); T(p1,[360,698.9,472,721.5],who1,{align:'center',k:'보험금청구인 성명'}); }
    // 동의서 머리말 (2~5쪽) · 5쪽 동의일자 · 동의자 성명
    var bt=birth(d.insured.rrn);
    [1,2,3,4].forEach(function(i){ T(pg[i],[75,85.5,158,101.5],d.insured.name,{s:8.5,k:'동의서 피보험자'}); T(pg[i],[278,85.5,412,101.5],bt,{s:8.5}); });
    if(wd){ var y4=wd.y.split('');
      [[110.5,145],[149,183.5],[187.75,222.25],[226.75,261.25]].forEach(function(b,i){ T(p5,[b[0],449.25,b[1],483.75],y4[i],{align:'center',s:12}); });
      [[295,329.5],[333.5,368]].forEach(function(b,i){ T(p5,[b[0],449.25,b[1],483.75],wd.m[i],{align:'center',s:12}); });
      [[401.25,436],[440.75,475.5]].forEach(function(b,i){ T(p5,[b[0],449.25,b[1],483.75],wd.d[i],{align:'center',s:12}); }); }
    if(d.insured.name){ Wt(p5,[280,500,319,515.5]); T(p5,[215,488,386,526],d.insured.name,{align:'center',s:11,k:'동의자(본인) 성명'}); }
    if(d.guardian){ Wt(p5,[280,538,319,553]); T(p5,[215,527,386,565.5],d.guardian,{align:'center',s:11,k:'법정대리인 성명'}); }
    // ---- 전자서명본
    var e=opt.sign;
    if(e){
      var v=e.consents||{};
      ['collect','provide','provide2','inquire'].forEach(function(g){ var c=CONSENT[g], a=v[g==='provide2'?'provide':g]||{};
        Object.keys(c.rows).forEach(function(k){ if(a[k]===true||a[k]===false) c.rows[k].forEach(function(y){ pg[c.page].push({t:'check',cx:a[k]?c.yes:c.no,cy:y,sz:1.9}); }); }); });
      var ab=(v.provide||{}).abroad;
      if(ab===true||ab===false) CONSENT.abroad.rows.forEach(function(y){ pg[3].push({t:'check',cx:ab?CONSENT.abroad.yes:CONSENT.abroad.no,cy:y,sz:1.9}); });
      if(e.main){
        Wt(p1,[474,700,565,719],BEIGE); p1.push({t:'img',box:[474,697,566,723],img:e.main});
        if(e.mainRole==='법정대리인'){ Wt(p5,[452,532,530,559],BEIGE); p5.push({t:'img',box:[440,528,542,564],img:e.main}); }
        else { Wt(p5,[452,494,530,520.5],BEIGE); p5.push({t:'img',box:[440,490,542,525],img:e.main}); }
      }
    }
    return pg;
  }
  window.CLAIM_FORMS=window.CLAIM_FORMS||{};
  window.CLAIM_FORMS['현대해상']={
    id:'hyundai',
    version:'현대해상 보험금청구서 (질병·상해 · 공식 서식 2026.04)', checkPages:'2~5쪽',
    size:[595.44,841.68],
    pdfUrl:'forms/hyundai-fire/claim.pdf', bg:'forms/hyundai-fire/p1.jpg',
    docs:['forms/hyundai-fire/p2.jpg','forms/hyundai-fire/p3.jpg','forms/hyundai-fire/p4.jpg','forms/hyundai-fire/p5.jpg'],
    printPages:[0,1,2,3,4,6,7], faxPages:[0,1,2,3,4],
    signGuide:'서명 1쪽·5쪽 · 동의 체크 2~5쪽 — 고객 직접',
    fill:fill
  };
})();
