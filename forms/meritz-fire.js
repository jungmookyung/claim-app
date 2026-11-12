/* 메리츠화재 보험금 청구서 (meritzfire_claim_form.pdf) — 좌표 단위: pt, 원점 좌상단, 페이지 번호는 0부터
   1쪽 청구서 · 2~4쪽 [필수] 개인(신용)정보 처리 상세 동의서 · 5쪽 지급절차 안내 */
(function(){
  var S=8.5;
  function digits(s){ return String(s||'').replace(/[^0-9]/g,''); }
  function ymd(v){ if(!v) return null; var a=v.split('-'); if(a.length<3) return null; return {y:a[0], m:('0'+(+a[1])).slice(-2), d:('0'+(+a[2])).slice(-2), m1:String(+a[1]), d1:String(+a[2])}; }
  var BOX=22;
  var RRN=[232,256,280,304,328,352, 389,413,437,461,485,509,533];
  var TEL=[232,257,282, 319,343,367,391, 428,452,476,500];
  var ACCT=[[81,103],[105,127],[129,151],[153,175],[177,197],[199,221],[223,245],[247,269],[271,293],[295,319],[321,343],[345,367],[369,393],[395,420],[422,444],[446,469]];
  var CB={
    medicaid:{'예':[243,160],'아니요':[315,160]},
    mail:[104,237], fax:[291,237], phone:[428,237],
    otherYes:[338,281.5], otherNo:[428,281.5],
    other:{'삼성화재':[68,297.5],'현대해상':[114,297.5],'DB손해보험':[160,297.5],'KB손해보험':[206,297.5],'한화손해보험':[245,297.5],'흥국화재':[291,297.5],'롯데손해보험':[338,297.5],'NH농협손해보험':[383,297.5]}, otherEtc:[428,297.5],
    atype:{'질병':[86,366],'상해':[221,366],'교통사고':[221,366],'배상':[346,366],'재물':[476,366]},
    sub:{'입원':[81,389],'통원':[130.1,389],'수술':[179.4,389],'진단':[228.5,389],'사망':[277.6,389],'장해':[326.9,389],'운전자':[376,389]},
    autoIns:{'예':[367,491],'아니요':[408,491]},
    seat:{'운전석':[367,511],'조수석':[408,511],'뒷자리':[451,511],'보행중':[496,511],'기타':[541,511]},
    am:[476,413], pm:[528,413], autopay:[131,593]
  };
  // 동의서 네모(약 10pt) 중심 — no: 동의하지 않음, yes: 동의함
  var CONSENT={
    collect:{page:1, no:356, yes:483, rows:{uid:[284],sens:[355],credit:[446]}},
    provide:{page:2, no:352, yes:492, rows:{uid:[76],sens:[142],credit:[223],abroad:[617,715]}},
    inquire:{page:3, no:352, yes:492, rows:{uid:[230.5],sens:[283],credit:[365]}}
  };
  var SIGN={0:[476,752,554,776], 3:{'작성자':[476,413,569,443],'법정대리인':[476,468,569,502]}};

  function fill(d,opt){
    opt=opt||{};
    var pg={0:[],1:[],2:[],3:[]}, p1=pg[0], p4=pg[3];
    function T(arr,box,v,o){ if(v) arr.push(Object.assign({t:'text',box:box,v:String(v),s:S},o||{})); }
    function W(arr,box){ arr.push({t:'rect',box:box,fill:'#fff'}); }           // 회색 예시 문구 가리기
    function C(arr,pt,sz){ if(pt) arr.push({t:'check',cx:pt[0],cy:pt[1],sz:sz||1}); }
    function D(arr,xs,y0,y1,v,w){ var s=digits(v); xs.forEach(function(x,i){ var c=s[i]; if(c) arr.push({t:'text',box:Array.isArray(x)?[x[0],y0,x[1],y1]:[x,y0,x+(w||BOX),y1],v:c,s:10,align:'center'}); }); }
    // 보험계약 및 인적사항
    T(p1,[96,92,180,119],d.holder.name,{k:'계약자 성명'});
    D(p1,RRN,95,117,d.holder.rrn);
    T(p1,[96,119,180,146],d.insured.name,{k:'피보험자 성명'});
    D(p1,RRN,122,144,d.insured.rrn);
    T(p1,[432,146,568,173],d.insured.job,{k:'직장명/하시는 일'});
    C(p1,CB.medicaid[d.medicaid],2);
    T(p1,[96,200,180,227],d.recvName,{k:'보상안내 받으실 분'});
    D(p1,TEL,203,224,d.recvTel);
    var nt=d.notice||[];
    if(nt.indexOf('e-mail')>=0&&d.insured.email){ C(p1,CB.mail); var em=d.insured.email.split('@'); T(p1,[136,231,202,243],em[0],{s:7.5,k:'E-mail'}); T(p1,[213,231,281,243],em.slice(1).join('@'),{s:7.5,k:'E-mail'}); }
    if(nt.indexOf('유선(전화)')>=0){ C(p1,CB.phone); T(p1,[473,231,563,243],d.recvTel,{s:7.5}); }
    if(nt.indexOf('팩스')>=0){ C(p1,CB.fax); }
    // 다른 보험회사 계약사항
    var oth=d.others||[], etc=[];
    if(oth.length){ C(p1,CB.otherYes); oth.forEach(function(n){ if(CB.other[n]) C(p1,CB.other[n]); else etc.push(n); });
      if(etc.length){ C(p1,CB.otherEtc); W(p1,[460,291,562,304]); T(p1,[461,291,561,304],etc.join(', '),{s:7.5,k:'기타 보험회사'}); } }
    // 사고 관련사항
    C(p1,CB.atype[d.atype],2.2);
    var sub=[]; if(d.care==='입원'||d.care==='입원·통원') sub.push('입원'); if(d.care==='통원'||d.care==='입원·통원') sub.push('통원');
    (d.cov||[]).forEach(function(c){ var m={'수술비':'수술','진단비':'진단','사망':'사망','후유장해':'장해','입원일당':'입원'}[c]; if(m&&sub.indexOf(m)<0) sub.push(m); });
    sub.forEach(function(s){ C(p1,CB.sub[s]); });
    var ad=ymd(d.date);
    if(ad){ D(p1,[75,99,123,147],402,424,ad.y); D(p1,[186,210],402,424,ad.m); D(p1,[249,273],402,424,ad.d); }
    if(d.time){ var hm=d.time.split(':'), h=+hm[0], h12=h%12===0?12:h%12; D(p1,[312,336],402,424,('0'+h12).slice(-2)); D(p1,[375,399],402,424,hm[1]); C(p1,h<12?CB.am:CB.pm,2); }
    if(d.story){ W(p1,[62,432,312,460]); T(p1,[64,432,311,460],d.story,{wrap:2,k:'사고경위'}); }
    T(p1,[357,432,567,460],d.place,{k:'사고장소'});
    T(p1,[64,461,311,481],d.dx,{k:'진단명'});
    T(p1,[357,461,436,481],d.hospital,{k:'최초 내원 병원'});
    T(p1,[458,461,554,481],(d.dept||'').replace(/과$/,''),{align:'right'});
    if(d.atype==='교통사고'){
      C(p1,CB.autoIns[d.car.autoIns]);
      if(d.car.insurer){ W(p1,[499,482,569,500]); T(p1,[500,482,568,500],d.car.insurer,{s:7.5,k:'처리보험사'}); }
      T(p1,[106,501,312,521],d.car.no,{k:'본인차량번호'});
      C(p1,CB.seat[d.car.seat]);
    }
    if(d.rtype==='동일사고 추가청구'){ W(p1,[63,522,312,540]); T(p1,[64,522,311,540],'동일사고 추가청구',{s:8}); }
    if(d.exclude){ W(p1,[356,519,569,544]); T(p1,[358,521,567,541],'보상제외 요청 담보: '+d.exclude,{wrap:2,s:7.5,k:'일부청구'}); }
    // 보험금 수령 계좌
    if(d.autopay) C(p1,CB.autopay,2);
    T(p1,[66,607,148,634],d.bank,{k:'금융기관명'});
    T(p1,[190,607,271,634],d.acctHolder,{k:'예금주명'});
    if(d.acctHolder&&d.acctHolder===d.insured.name){ T(p1,[312,607,458,634],d.insured.rrn,{k:'예금주 주민번호'}); T(p1,[508,607,569,634],'본인',{align:'center'}); }
    var ac=digits(d.acct); if(ac.length&&ac.length<=16) D(p1,ACCT,637,659,ac); else T(p1,[84,637,468,659],d.acct,{k:'계좌번호'});
    // 작성일자 · 작성자
    var wd=ymd(d.writeDate);
    if(wd){ T(p1,[118,752,168,776],wd.y,{align:'right'}); T(p1,[179,752,200,776],wd.m1,{align:'center'}); T(p1,[209,752,229,776],wd.d1,{align:'center'}); }
    var signer=d.guardian||d.insured.name;
    if(d.guardian) T(p1,[277,751,336,764],d.insured.name,{s:7.5,align:'center'});
    if(signer){ W(p1,[392,755,418,773]); T(p1,[352,752,444,776],signer,{align:'center',k:'작성자 성명'}); }
    // 4쪽 동의서 작성일자 · 작성자
    if(wd){ T(p4,[40,413,90,443],wd.y,{align:'right'}); T(p4,[108,413,150,443],wd.m1,{align:'center'}); T(p4,[168,413,210,443],wd.d1,{align:'center'}); }
    if(d.guardian){ W(p4,[410,472,450,497]); T(p4,[386,468,474,502],d.guardian,{align:'center'}); }
    else if(d.insured.name){ W(p4,[410,416,450,440]); T(p4,[386,413,474,443],d.insured.name,{align:'center'}); }
    // ---- 전자서명본: 고객이 고른 동의 + 서명
    var e=opt.sign;
    if(e){
      Object.keys(CONSENT).forEach(function(g){
        var c=CONSENT[g], v=(e.consents&&e.consents[g])||{};
        Object.keys(c.rows).forEach(function(k){ if(v[k]===true||v[k]===false) c.rows[k].forEach(function(y){ pg[c.page].push({t:'check',cx:v[k]?c.yes:c.no,cy:y,sz:2.1}); }); });
      });
      if(e.main){
        W(p1,[495,755,535,773]); p1.push({t:'img',box:SIGN[0],img:e.main});
        var b=SIGN[3][e.mainRole==='법정대리인'?'법정대리인':'작성자'];
        W(p4,[500,b[1]+3,546,b[3]-3]); p4.push({t:'img',box:b,img:e.main});
      }
    }
    return pg;
  }
  window.CLAIM_FORMS=window.CLAIM_FORMS||{};
  window.CLAIM_FORMS['메리츠화재']={
    id:'meritz',
    version:'메리츠화재 보험금 청구서 (공식 서식)', checkPages:'2~4쪽',
    size:[595.28,841.89],
    pdfUrl:'forms/meritz-fire/claim.pdf', bg:'forms/meritz-fire/p1.jpg',
    docs:['forms/meritz-fire/p2.jpg','forms/meritz-fire/p3.jpg','forms/meritz-fire/p4.jpg'],
    printPages:[0,1,2,3,4], faxPages:[0,1,2,3],
    signGuide:'서명 1쪽·4쪽 · 동의 체크 2~4쪽 — 고객 직접',
    fill:fill
  };
})();
