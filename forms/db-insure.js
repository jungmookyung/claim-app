/* DB손해보험 [장기보상] 보험금 청구서(표준) 7P (2026.07.29) — 좌표 단위: pt, 원점 좌상단, 페이지 번호는 0부터
   1쪽 청구서 · 2~5쪽 [필수] 보험금 청구를 위한 상세 동의서 · 6~7쪽 지급절차 안내 */
(function(){
  var S=8.5;
  function ymd(v){ if(!v) return null; var a=v.split('-'); if(a.length<3) return null; return {y:a[0], m1:String(+a[1]), d1:String(+a[2])}; }
  // □ 네모 중심 (렌더링 화면에서 실측 — 이 PDF는 글꼴 정보 때문에 글자 좌표가 8~16pt 아래로 잡힘)
  var CB={
    medicaid:{'예':[487.2,142.6],'아니요':[523.2,142.6]},
    recv:{'계약자':[115.0,212.0],'피보험자':[171.2,212.0]},
    otherNone:[386.2,271.2],
    atype:{'상해':[128.5,344.0],'질병':[169,344.0],'교통사고':[209.5,344.0]},
    rtype:{'최초청구':[404.4,344.0],'동일사고 추가청구':[461.2,344.0]},
    autoIns:{'예':[178.5,446.0],'아니요':[206.5,446.0]},
    seat:{'운전석':[383.4,467.4],'조수석':[432.1,467.4],'뒷자리':[480.9,467.4],'보행중':[383.4,476.4],'기타':[432.1,476.4]},
    cov:{'입원':[44,508.3],'통원':[78.1,508.3],'수술':[112.4,508.3],'진단':[146.5,508.3],'사망':[180.6,508.3],'장해':[214.9,508.3],'비용':[249,508.3]},
    autopay:[140,526.0]
  };
  var CONSENT={
    collect:{page:1, no:480.0, yes:547.0, rows:{uid:[410.8],sens:[499.1],credit:[590.1]}},
    provide:{page:2, no:478.3, yes:546.7, rows:{uid:[501.7],sens:[604.1],credit:[741.9]}},
    abroad:{page:3, no:478.2, yes:546.6, rows:[497.6,597.6]},
    inquire:{page:4, no:478.2, yes:546.6, rows:{uid:[176.8],sens:[247.8],credit:[382.6]}}
  };
  // 서명란 줄 가운데: 피보험자 / 법정대리인 / 보험수익자 (1쪽, 5쪽)
  var SIGN={0:{'피보험자':688.5,'법정대리인':705.5,'보험수익자':722.5}, 4:{'피보험자':673,'법정대리인':691,'보험수익자':709}};
  function fill(d,opt){
    opt=opt||{};
    var pg={0:[],1:[],2:[],3:[],4:[]}, p1=pg[0], p5=pg[4];
    function T(arr,box,v,o){ if(v) arr.push(Object.assign({t:'text',box:box,v:String(v),s:S},o||{})); }
    function Wt(arr,box){ arr.push({t:'rect',box:box,fill:'#fff'}); }
    function C(arr,pt,sz){ if(pt) arr.push({t:'check',cx:pt[0],cy:pt[1],sz:sz||1.25}); }
    // 1. 인적사항 및 보상안내 받으실 분
    T(p1,[147,130,237,155],d.insured.name,{k:'피보험자 성명'});
    T(p1,[286,130,421,155],d.insured.rrn,{k:'주민번호'});
    C(p1,CB.medicaid[d.medicaid]);
    T(p1,[470,155.5,566,178],d.insured.job,{k:'하시는 일'});
    T(p1,[147,178,566,200.5],d.insured.addr,{k:'주소'});
    if(d.recv==='계약자'||d.recv==='피보험자') C(p1,CB.recv[d.recv]);
    T(p1,[147,223.5,237,246],d.recvTel,{k:'연락처'});
    T(p1,[286,223.5,421,246],d.insured.email,{s:7.5,k:'E-mail'});
    // 2. 다른 보험회사 가입사항
    var oth=d.others||[];
    [[158,286,264,302],[285,286,390,302],[411,286,517,302]].forEach(function(b,i){ if(i<2||oth.length<=3) T(p1,b,oth[i],{s:8,align:'center'}); });
    if(oth.length>3) T(p1,[411,286,517,302],oth.slice(2).join(', '),{s:7,align:'center'});
    // 3. 청구사항
    C(p1,CB.atype[d.atype]); C(p1,CB.rtype[d.rtype]);
    var ad=ymd(d.date);
    if(ad){ T(p1,[102,357,147,382],ad.y,{align:'right',s:9}); T(p1,[158,357,178,382],ad.m1,{align:'center',s:9}); T(p1,[190,357,210,382],ad.d1,{align:'center',s:9}); }
    if(d.time){ var hm=d.time.split(':'); T(p1,[222,357,241,382],String(+hm[0]),{align:'center',s:9}); T(p1,[253,357,273,382],hm[1],{align:'center',s:9}); }
    T(p1,[371,357,565,382],d.dx,{k:'진단명'});
    T(p1,[102,382.5,296,407.5],d.place,{k:'사고장소'});
    T(p1,[371,382.5,565,407.5],d.hospital?d.hospital+(d.dept?' ('+d.dept+')':''):'',{k:'치료병원'});
    T(p1,[102,408,565,433],d.story,{wrap:2,k:'사고경위'});
    if(d.atype==='교통사고'){
      C(p1,CB.autoIns[d.car.autoIns]);
      T(p1,[284,439,353,453],d.car.insurer,{s:7.5,k:'보험사'});
      T(p1,[420,439,554,453],d.car.contact,{s:7.5,k:'담당자/연락처'});
      T(p1,[171,459,296,484],d.car.no,{k:'본인차량번호'});
      C(p1,CB.seat[d.car.seat]);
    }
    var cv=[]; if(d.care==='입원'||d.care==='입원·통원') cv.push('입원'); if(d.care==='통원'||d.care==='입원·통원') cv.push('통원');
    (d.cov||[]).forEach(function(c){ var m={'수술비':'수술','진단비':'진단','사망':'사망','후유장해':'장해','입원일당':'입원','비용':'비용'}[c]; if(m&&cv.indexOf(m)<0) cv.push(m); });
    cv.forEach(function(c){ C(p1,CB.cov[c]); });
    // 4. 보험금 받으실 계좌
    if(d.autopay) C(p1,CB.autopay);
    T(p1,[171,538,364,562],d.acct,{k:'계좌번호'});
    T(p1,[371,538,438,562],d.bank,{k:'은행명'});
    T(p1,[471,538,566,562],d.acctHolder,{k:'예금주'});
    // 작성일 · 성명 (1쪽, 5쪽)
    var wd=ymd(d.writeDate);
    if(wd){ T(p1,[62,681,107,696],wd.y,{align:'right'}); T(p1,[128,681,158,696],wd.m1,{align:'center'}); T(p1,[180,681,209,696],wd.d1,{align:'center'});
            T(p5,[95,666,118,681],wd.y.slice(2),{align:'center'}); T(p5,[138,666,169,681],wd.m1,{align:'center'}); T(p5,[190,666,220,681],wd.d1,{align:'center'}); }
    [[p1,0],[p5,4]].forEach(function(a){ var arr=a[0], Y=SIGN[a[1]];
      T(arr,[414,Y['피보험자']-8,486,Y['피보험자']+8],d.insured.name,{k:'피보험자 성명'});
      T(arr,[414,Y['법정대리인']-8,486,Y['법정대리인']+8],d.guardian);
      T(arr,[414,Y['보험수익자']-8,486,Y['보험수익자']+8],d.beneficiary); });
    // ---- 전자서명본
    var e=opt.sign;
    if(e){
      var v=e.consents||{};
      ['collect','provide','inquire'].forEach(function(g){ var c=CONSENT[g], a=v[g]||{};
        Object.keys(c.rows).forEach(function(k){ if(a[k]===true||a[k]===false) c.rows[k].forEach(function(y){ pg[c.page].push({t:'check',cx:a[k]?c.yes:c.no,cy:y,sz:1.25}); }); }); });
      var ab=(v.provide||{}).abroad;
      if(ab===true||ab===false) CONSENT.abroad.rows.forEach(function(y){ pg[3].push({t:'check',cx:ab?CONSENT.abroad.yes:CONSENT.abroad.no,cy:y,sz:1.25}); });
      [[p1,0],[p5,4]].forEach(function(a){ var arr=a[0], Y=SIGN[a[1]];
        function put(role,img){ var y=Y[role]; Wt(arr,[549,y-6,569,y+6]); arr.push({t:'img',box:[490,y-11,568,y+11],img:img}); }
        if(e.main) put(e.mainRole==='법정대리인'?'법정대리인':'피보험자',e.main);
        if(e.bene) put('보험수익자',e.bene); });
    }
    return pg;
  }
  window.CLAIM_FORMS=window.CLAIM_FORMS||{};
  window.CLAIM_FORMS['DB손해보험']={
    id:'db',
    version:'DB손해보험 [장기보상] 보험금 청구서 (표준 · 2026.07)', checkPages:'2~5쪽',
    size:[595.28,841.89],
    pdfUrl:'forms/db-insure/claim.pdf', bg:'forms/db-insure/p1.jpg',
    docs:['forms/db-insure/p2.jpg','forms/db-insure/p3.jpg','forms/db-insure/p4.jpg','forms/db-insure/p5.jpg'],
    printPages:[0,1,2,3,4,5,6], faxPages:[0,1,2,3,4],
    signGuide:'서명 1쪽·5쪽 · 동의 체크 2~5쪽 — 고객 직접',
    fill:fill
  };
})();
