/* 삼성생명 보험금 청구서(개인) 2025.03.07 — 좌표 단위: pt, 원점 좌상단, 페이지 번호는 0부터
   1쪽 청구서 · 2~3쪽 [필수] 요약 동의서 · 4~6쪽 상세 동의서(참고) · 7~10쪽 고객 안내 */
(function(){
  var S=8.5;
  function digits(s){ return String(s||'').replace(/[^0-9]/g,''); }
  function ymd(v){ if(!v) return null; var a=v.split('-'); if(a.length<3) return null; return {y:a[0], m1:String(+a[1]), d1:String(+a[2])}; }
  var CB={
    medicaid:{'예':[529.9,116.9],'아니요':[529.9,133.9]},
    kind:{'질병':[125.4,152.4],'재해':[125.5,166.5]},
    sub:{'사망':[313.9,152.4],'장해':[362.9,152.4],'진단':[410.9,152.4],'수술':[451.9,152.4],'입원':[491.9,152.4],'통원':[531.9,152.4],'실손입원':[314.0,166.5],'실손통원':[362.9,166.5],'기타':[410.9,166.5]},
    autoIns:{'예':[443.1,185.0],'아니요':[486.1,185.0]},
    smsYes:[125.4,526.9], smart:[242.9,535.2], mail:[354.9,535.2], post:[409.9,535.2],
    confirm:[493.9,624.2]
  };
  // 요약 동의서: '동의함' 네모만 있음 (피보험자 · 수익자 열)
  var CONSENT={
    collect:{page:1, rows:{uid:404.4,sens:464.4,credit:557.4}},
    provide:{page:2, rows:{uid:145.9,sens:210.9,credit:303.9}},
    inquire:{page:2, rows:{uid:490.9,sens:535.9,credit:628.9}}
  };
  var COL={ins:410.3, bene:519.45};
  function fill(d,opt){
    opt=opt||{};
    var pg={0:[],1:[],2:[]}, p1=pg[0], p3=pg[2];
    function T(arr,box,v,o){ if(v) arr.push(Object.assign({t:'text',box:box,v:String(v),s:S},o||{})); }
    function Wt(arr,box){ arr.push({t:'rect',box:box,fill:'#fff'}); }
    function C(arr,pt,sz){ if(pt) arr.push({t:'check',cx:pt[0],cy:pt[1],sz:sz||1.4}); }
    // 1. 피보험자 및 청구 사유
    T(p1,[104,108.5,186,142],d.insured.name,{k:'피보험자 성명'});
    T(p1,[224,108.5,336,142],d.insured.rrn,{k:'주민번호'});
    T(p1,[367,108.5,466,142],d.insured.tel,{k:'휴대폰'});
    C(p1,CB.medicaid[d.medicaid]);
    var injury=d.atype==='상해'||d.atype==='교통사고';
    C(p1,CB.kind[injury?'재해':'질병']);
    var care=d.care||'', cov=d.cov||[], inpat=/입원/.test(care), outpat=/통원/.test(care), sub=[];
    if(cov.indexOf('사망')>=0) sub.push('사망'); if(cov.indexOf('후유장해')>=0) sub.push('장해');
    if(cov.indexOf('진단비')>=0) sub.push('진단'); if(cov.indexOf('수술비')>=0) sub.push('수술');
    if(inpat&&(cov.indexOf('입원일당')>=0||cov.indexOf('실손의료비')<0)) sub.push('입원');
    if(outpat&&cov.indexOf('실손의료비')<0) sub.push('통원');
    if(cov.indexOf('실손의료비')>=0){ if(inpat) sub.push('실손입원'); if(outpat) sub.push('실손통원'); }
    if(cov.indexOf('비용')>=0){ sub.push('기타'); T(p1,[444,160,566,171],'비용',{s:7.5}); }
    sub.forEach(function(s){ C(p1,CB.sub[s]); });
    if(injury){
      var ad=ymd(d.date);
      if(ad){ T(p1,[145,177,195,192],ad.y,{align:'right'}); T(p1,[206,177,229,192],ad.m1,{align:'center'}); T(p1,[239,177,262,192],ad.d1,{align:'center'}); }
      if(d.time) T(p1,[272,177,295,192],String(+d.time.split(':')[0]),{align:'center'});
      if(d.atype==='교통사고') C(p1,CB.autoIns[d.car.autoIns]);
      T(p1,[191,193,566,209],[d.place,d.story].filter(Boolean).join(' / '),{s:8,k:'사고장소 및 경위'});
    }
    if(cov.indexOf('실손의료비')>=0&&outpat) T(p1,[145,245,375,277],d.dx,{k:'실손 통원 병명'});
    // 2. 수령 정보 및 안내 방법 — 수익자: 입력한 보험수익자, 없으면 피보험자
    var bn=d.beneficiary||d.insured.name, self=!d.beneficiary||d.beneficiary===d.insured.name;
    T(p1,[104,322.5,186,356.3],bn,{k:'수익자 성명'});
    if(self){ T(p1,[224,322.5,336,356.3],d.insured.rrn); T(p1,[367,322.5,466,356.3],d.insured.tel);
      T(p1,[104,356.5,336,390.3],d.insured.addr,{wrap:2,s:8,k:'수익자 주소'}); T(p1,[367,357,466,373],d.insured.email,{s:7.5}); }
    T(p1,[153,446,240,470],d.bank,{k:'은행명'});
    T(p1,[276,446,362,470],d.acctHolder,{k:'예금주'});
    T(p1,[407,446,563,463],d.acct,{k:'계좌번호'});
    var nt=d.notice||[];
    if(nt.indexOf('문자메시지')>=0||nt.indexOf('알림톡')>=0){ C(p1,CB.smsYes); C(p1,CB.smart); }
    if(nt.indexOf('e-mail')>=0) C(p1,CB.mail);
    if(nt.indexOf('우편')>=0) C(p1,CB.post);
    // 신청일 · 수익자(대리인)
    var wd=ymd(d.writeDate);
    if(wd){ T(p1,[268,716,302,733],wd.y,{align:'right'}); T(p1,[313,716,327,733],wd.m1,{align:'center'}); T(p1,[338,716,352,733],wd.d1,{align:'center'});
            T(p3,[212,729,250,743],wd.y,{align:'right',s:10}); T(p3,[264,729,291,743],wd.m1,{align:'center',s:10}); T(p3,[305,729,332,743],wd.d1,{align:'center',s:10}); }
    T(p1,[437,716,496,733],d.guardian||bn,{k:'수익자(대리인) 성명'});
    if(d.guardian) T(p1,[437,735,540,748],'법정대리인(친권자)',{s:7.5});
    // 요약 동의서 성명
    if(!d.guardian&&d.insured.name){ Wt(p3,[97,659,128,673]); T(p3,[100,656,160,676],d.insured.name); }
    if(!self){ Wt(p3,[97,685,128,699]); T(p3,[100,682,160,702],d.beneficiary); }
    // ---- 전자서명본
    var e=opt.sign;
    if(e){
      var v=e.consents||{};
      Object.keys(CONSENT).forEach(function(g){ var c=CONSENT[g], a=v[g]||{};
        Object.keys(c.rows).forEach(function(k){ if(a[k]===true){ pg[c.page].push({t:'check',cx:COL.ins,cy:c.rows[k],sz:1.6}); if(e.bene&&!self) pg[c.page].push({t:'check',cx:COL.bene,cy:c.rows[k],sz:1.6}); } }); });
      C(p1,CB.confirm);
      if(e.main){
        Wt(p1,[523,719,541,731]); p1.push({t:'img',box:[497,707,552,742],img:e.main});
        if(e.mainRole!=='법정대리인') p3.push({t:'img',box:[160,653,228,679],img:e.main});
      }
      if(e.bene&&!self) p3.push({t:'img',box:[160,679,228,705],img:e.bene});
    }
    return pg;
  }
  window.CLAIM_FORMS=window.CLAIM_FORMS||{};
  window.CLAIM_FORMS['삼성생명']={
    id:'samsunglife',
    version:'삼성생명 보험금 청구서(개인 · 2025.03)', checkPages:'2~3쪽',
    size:[595,842],
    pdfUrl:'forms/samsung-life/claim.pdf', bg:'forms/samsung-life/p1.jpg',
    docs:['forms/samsung-life/p2.jpg','forms/samsung-life/p3.jpg','forms/samsung-life/p4.jpg','forms/samsung-life/p5.jpg','forms/samsung-life/p6.jpg'],
    printPages:[0,1,2,6,7,8,9], faxPages:[0,1,2],
    signGuide:'서명 1쪽 · 요약 동의서 2~3쪽(동의함 체크·성명) — 고객 직접. 미성년자는 친권자(부/모) 칸 직접 작성',
    fill:fill
  };
})();
