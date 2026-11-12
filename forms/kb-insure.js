/* KB손해보험 보험금 청구서 (인보험用, reqdoc_genal.pdf) — 좌표 단위: pt, 원점 좌상단, 페이지 번호는 0부터
   1쪽 청구서 · 2~4쪽 [필수] 보험금 청구를 위한 상세 동의서 · 5쪽 지급 절차 안내문 */
(function(){
  var S=8.5, W1=21.5;
  function digits(s){ return String(s||'').replace(/[^0-9]/g,''); }
  function ymd(v){ if(!v) return null; var a=v.split('-'); if(a.length<3) return null; return {y:a[0], yy:a[0].slice(2), m:('0'+(+a[1])).slice(-2), d:('0'+(+a[2])).slice(-2), m1:String(+a[1]), d1:String(+a[2])}; }
  var RRN=[226.4,251.1,275.6,300.0,324.8,349.5, 388.1,413.0,437.5,462.4,487.2,511.9,536.2];
  var TEL=[128.7,153.7,178.2, 220.8,245.8,270.2,295.1, 336.6,361.6,386.1,410.7];
  var CB={
    medicaid:[526.5,163.3],
    recv:{'계약자':[97.5,223.4],'피보험자':[209.1,223.4],'기타':[320.4,223.4]},
    fax:[32.9,303.3], mail:[107.2,303.3], post:[189.3,303.3],
    otherYes:[323.6,328.6], otherNo:[390.9,328.6],
    other:{'삼성화재':[83.4,352.8],'현대해상':[131.6,352.8],'DB손해보험':[180.8,352.8],'메리츠화재':[225.3,352.8],'한화손해보험':[283.2,352.8],'흥국화재':[330.8,352.8],'롯데손해보험':[381.4,352.8],'NH농협손해보험':[432.3,352.8]}, otherEtc:[483,352.8],
    atype:{'상해':[95.9,393.3],'질병':[175.2,393.3],'교통사고':[250.3,393.3]}, extra:[358.9,393.3],
    autoIns:{'아니요':[169.5,503.6],'예':[252.4,503.6]},
    seat:{'운전석':[287.5,526.9],'조수석':[323.6,526.9],'뒷자리':[361.6,526.9],'보행중':[399.7,526.9],'기타':[438.5,526.9]},
    autopay:[93.4,633.5]
  };
  // 동의서 네모 중심 — no: 동의하지 않음, yes: 동의함
  var CONSENT={
    collect:{page:1, no:436.6, yes:532.6, rows:{uid:[328.5],sens:[405.5],credit:[490.5]}},
    provide:{page:2, no:435.0, yes:530.8, rows:{uid:[138.5],sens:[218.5],credit:[306.5],abroad:[641.5,717.5]}},
    inquire:{page:3, no:432.8, yes:528.6, rows:{uid:[252.5],sens:[279.5],credit:[390.5]}}
  };
  function fill(d,opt){
    opt=opt||{};
    var pg={0:[],1:[],2:[],3:[]}, p1=pg[0], p4=pg[3];
    function T(arr,box,v,o){ if(v) arr.push(Object.assign({t:'text',box:box,v:String(v),s:S},o||{})); }
    function Wt(arr,box){ arr.push({t:'rect',box:box,fill:'#fff'}); }
    function C(arr,pt,sz){ if(pt) arr.push({t:'check',cx:pt[0],cy:pt[1],sz:sz||1.7}); }
    function D(arr,xs,y0,y1,v){ var s=digits(v); xs.forEach(function(x,i){ var c=s[i]; if(c) arr.push({t:'text',box:[x,y0,x+W1,y1],v:c,s:10,align:'center'}); }); }
    // 1. 인적사항 및 보상안내
    T(p1,[99,92,184,120],d.insured.name,{k:'피보험자 성명'});
    D(p1,RRN,96,114.6,d.insured.rrn);
    D(p1,TEL,126,145.2,d.insured.tel);
    T(p1,[504,121,578,151],d.insured.job,{wrap:2,s:8,k:'직장명/하시는 일'});
    T(p1,[99,151,458,176],d.insured.addr,{k:'주소'});
    if(d.medicaid==='예') C(p1,CB.medicaid);
    T(p1,[99,180,184,207],d.holder.name,{k:'계약자 성명'});
    D(p1,RRN,184,202.9,d.holder.rrn);
    C(p1,CB.recv[d.recv==='계약자'?'계약자':'피보험자']);
    D(p1,TEL,242,261.1,d.recvTel);
    var nt=d.notice||[], det=[];
    if(nt.indexOf('팩스')>=0) C(p1,CB.fax);
    if(nt.indexOf('e-mail')>=0&&d.insured.email){ C(p1,CB.mail); det.push(d.insured.email); }
    if(nt.indexOf('우편')>=0&&d.insured.addr){ C(p1,CB.post); det.push(d.insured.addr); }
    if(det.length){ Wt(p1,[262,296,578,311]); T(p1,[264,296,577,311],det.join(' / '),{s:7.5,k:'추가안내 기재'}); }
    // 2. 다른 보험회사 계약사항
    var oth=d.others||[], etc=[];
    if(oth.length){ C(p1,CB.otherYes); oth.forEach(function(n){ if(CB.other[n]) C(p1,CB.other[n]); else etc.push(n); });
      if(etc.length){ C(p1,CB.otherEtc); T(p1,[516,347,563,363],etc.join(', '),{s:7,k:'기타 보험회사'}); } }
    // 3. 사고사항
    C(p1,CB.atype[d.atype]);
    if(d.rtype==='동일사고 추가청구') C(p1,CB.extra);
    var ad=ymd(d.date);
    if(ad){ D(p1,[77.6,106.0,133.5,162.0],413,432.2,ad.y); D(p1,[204.5,233.0],413,432.2,ad.m); D(p1,[276.0,304.4],413,432.2,ad.d); }
    T(p1,[405,406,578,437],d.place,{wrap:2,k:'사고장소'});
    T(p1,[412,442,502,466],d.hospital,{k:'병원명'});
    T(p1,[510,442,564,466],(d.dept||'').replace(/과$/,''),{align:'right'});
    T(p1,[64,441,350,474],d.story,{wrap:2,k:'사고(내원) 경위'});
    T(p1,[400,468,578,491],d.dx,{k:'진단명'});
    if(d.atype==='교통사고'){
      C(p1,CB.autoIns[d.car.autoIns]);
      T(p1,[366,499,440,512],d.car.insurer,{s:7.5,k:'처리보험사'});
      T(p1,[511,499,578,512],d.car.contact,{s:7.5,k:'담당자 및 연락처'});
      T(p1,[130,524,195,538],d.car.no,{s:8,k:'본인차량번호'});
      C(p1,CB.seat[d.car.seat]);
    }
    // 4. 보험금 수령 계좌
    if(d.autopay) C(p1,CB.autopay);
    T(p1,[102,651,196,676],d.bank,{k:'은행명'});
    T(p1,[238,651,465,676],d.acct,{k:'계좌번호'});
    T(p1,[497,651,578,676],d.acctHolder,{k:'예금주'});
    // 5. 작성일자 · 청구자
    var wd=ymd(d.writeDate);
    if(wd){ T(p1,[20,752,67,778],wd.y,{align:'right'}); T(p1,[80,752,106,778],wd.m1,{align:'center'}); T(p1,[117,752,141,778],wd.d1,{align:'center'}); }
    T(p1,[185,752,282,778],d.insured.name,{align:'center',k:'청구자 성명'});
    if(d.guardian) T(p1,[436,752,520,778],d.guardian,{align:'center',k:'법정대리인 성명'});
    // 4쪽 동의자 · 동의일자
    if(d.guardian){ Wt(p4,[238,514,262,528]); T(p4,[258,510,332,532],d.guardian,{align:'center'}); }
    else if(d.insured.name){ Wt(p4,[52,527,84,545]); T(p4,[22,500,122,575],d.insured.name,{align:'center'}); }
    if(wd){ T(p4,[404,600,446,622],wd.yy,{align:'center',s:11}); T(p4,[462,600,505,622],wd.m1,{align:'center',s:11}); T(p4,[521,600,564,622],wd.d1,{align:'center',s:11}); }
    // ---- 전자서명본
    var e=opt.sign;
    if(e){
      Object.keys(CONSENT).forEach(function(g){
        var c=CONSENT[g], v=(e.consents&&e.consents[g])||{};
        Object.keys(c.rows).forEach(function(k){ if(v[k]===true||v[k]===false) c.rows[k].forEach(function(y){ pg[c.page].push({t:'check',cx:v[k]?c.yes:c.no,cy:y,sz:1.9}); }); });
      });
      if(e.main){
        if(e.mainRole==='법정대리인'){ Wt(p1,[530,757,568,774]); p1.push({t:'img',box:[522,752,576,778],img:e.main});
          Wt(p4,[355,511,398,528]); p4.push({t:'img',box:[334,503,402,537],img:e.main}); }
        else { Wt(p1,[304,757,341,774]); p1.push({t:'img',box:[284,752,346,778],img:e.main});
          Wt(p4,[150,527,205,546]); p4.push({t:'img',box:[127,503,229,572],img:e.main}); }
      }
    }
    return pg;
  }
  window.CLAIM_FORMS=window.CLAIM_FORMS||{};
  window.CLAIM_FORMS['KB손해보험']={
    id:'kb',
    version:'KB손해보험 보험금 청구서 (인보험用 · 공식 서식)', checkPages:'2~4쪽',
    size:[595.28,841.89],
    pdfUrl:'forms/kb-insure/claim.pdf', bg:'forms/kb-insure/p1.jpg',
    docs:['forms/kb-insure/p2.jpg','forms/kb-insure/p3.jpg','forms/kb-insure/p4.jpg'],
    printPages:[0,1,2,3,4], faxPages:[0,1,2,3],
    signGuide:'서명 1쪽·4쪽 · 동의 체크 2~4쪽 — 고객 직접',
    fill:fill
  };
})();
