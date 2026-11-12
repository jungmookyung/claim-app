/* 보험사 공식 양식별 개인(신용)정보 동의 항목 — 앱 서명 화면과 고객 원격 서명 화면이 함께 쓴다.
   키(collect/provide/inquire · uid/sens/credit/abroad, optional)는 모든 양식 공통. 각 양식 파일이 자기 동의서 칸에 옮겨 찍는다. */
window.CONSENT_SETS = {
 "삼성화재": {
  "id": "samsung",
  "ui": [
   {
    "key": "collect",
    "title": "[필수] 수집·이용에 관한 사항",
    "page": "2쪽",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 수집·이용",
      "desc": "주민등록번호, 외국인등록번호, 여권번호, 운전면허번호"
     },
     {
      "k": "sens",
      "label": "민감정보 수집·이용",
      "desc": "피보험자의 질병·상해에 관한 정보(진료기록, 상병명 등), 보험사고 조사 및 손해사정 업무 관련 정보"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 수집·이용",
      "desc": "성명, 주소, 직업, 연락처 등 일반개인정보 · 보험금 지급계좌, 보험계약·보험금 정보"
     }
    ]
   },
   {
    "key": "provide",
    "title": "[필수] 제공에 관한 사항",
    "page": "3~4쪽",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 제공 (국내)",
      "desc": "주민등록번호, 외국인등록번호, 여권번호, 운전면허번호"
     },
     {
      "k": "sens",
      "label": "민감정보 제공 (국내)",
      "desc": "질병·상해에 관한 정보, 보험사고 조사 및 손해사정 관련 정보"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 제공 (국내)",
      "desc": "일반개인정보, 신용거래정보"
     },
     {
      "k": "abroad",
      "label": "개인(신용)정보 제공 (국외)",
      "desc": "국외 재보험사 등 (동의서 4쪽 참고)"
     }
    ]
   },
   {
    "key": "inquire",
    "title": "[필수] 조회에 관한 사항",
    "page": "4~5쪽",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 조회",
      "desc": "운전면허번호"
     },
     {
      "k": "sens",
      "label": "민감정보 조회",
      "desc": "질병·상해에 관한 정보, 교통법규 위반정보, 교통사고조사기록"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 조회",
      "desc": "일반개인정보, 신용거래정보"
     }
    ]
   }
  ],
  "opt": {
   "key": "optional",
   "title": "[선택] 의료기관 진료비 이상여부 확인을 위한 정보 제공",
   "page": "6쪽",
   "desc": "제공받는 자: 피보험자가 진료받은 의료기관 · 이용목적: 진료유무 및 진료비 산정방식 이상여부 상호확인 · 보유기간: 동의일로부터 3년. 거부하시더라도 보험금 지급에 영향을 미치지 않습니다.",
   "items": [
    {
     "k": "sens",
     "label": "민감정보 제공",
     "desc": "진료기간"
    },
    {
     "k": "credit",
     "label": "개인(신용)정보 제공",
     "desc": "성명, 생년월일"
    }
   ]
  },
  "notice": "귀하는 개인(신용)정보의 수집·이용 및 조회, 제공에 관한 동의를 거부하실 수 있습니다. 다만, 본 동의는 ‘보험금 청구’를 위해 필수적인 사항이므로 동의를 거부하시는 경우 관련 업무수행이 불가능합니다.",
  "docsScript": "forms/samsung-fire.js"
 },
 "메리츠화재": {
  "id": "meritz",
  "ui": [
   {
    "key": "collect",
    "title": "[필수] 수집·이용에 관한 사항",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 수집·이용",
      "desc": "주민등록번호, 외국인등록번호, 여권번호, 운전면허번호"
     },
     {
      "k": "sens",
      "label": "민감정보 수집·이용",
      "desc": "질병·상해에 관한 정보(진료기록, 상병명 등), 보험사고 조사 및 손해사정 관련 정보"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 수집·이용",
      "desc": "성명·주소·연락처 등 일반개인정보, 보험금 지급계좌·보험계약 정보"
     }
    ]
   },
   {
    "key": "provide",
    "title": "[필수] 제공에 관한 사항",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 제공 (국내)",
      "desc": "주민등록번호, 외국인등록번호, 여권번호, 운전면허번호"
     },
     {
      "k": "sens",
      "label": "민감정보 제공 (국내)",
      "desc": "질병·상해에 관한 정보, 보험사고 조사 및 손해사정 관련 정보"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 제공 (국내)",
      "desc": "일반개인정보, 신용거래정보"
     },
     {
      "k": "abroad",
      "label": "개인(신용)정보 제공 (국외)",
      "desc": "국외 재보험사 (재보험금 청구 시)"
     }
    ]
   },
   {
    "key": "inquire",
    "title": "[필수] 조회에 관한 사항",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 조회",
      "desc": "주민등록번호, 운전면허번호 등"
     },
     {
      "k": "sens",
      "label": "민감정보 조회",
      "desc": "질병·상해에 관한 정보, 교통법규 위반정보, 교통사고조사기록"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 조회",
      "desc": "일반개인정보, 신용거래정보"
     }
    ]
   }
  ],
  "notice": "귀하는 개인(신용)정보의 수집·이용 및 조회, 제공에 관한 동의를 거부하실 수 있습니다. 다만, 본 동의는 ‘보험금 청구’를 위해 필수적인 사항이므로 동의를 거부하시는 경우 관련 업무수행이 불가능합니다.",
  "docs": [
   "forms/meritz-fire/p2.jpg",
   "forms/meritz-fire/p3.jpg",
   "forms/meritz-fire/p4.jpg"
  ]
 },
 "KB손해보험": {
  "id": "kb",
  "ui": [
   {
    "key": "collect",
    "title": "[필수] 수집·이용에 관한 사항",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 수집·이용",
      "desc": "주민등록번호, 외국인등록번호, 여권번호, 운전면허번호"
     },
     {
      "k": "sens",
      "label": "민감정보 수집·이용",
      "desc": "질병·상해에 관한 정보(진료기록, 상병명 등), 보험사고 조사 및 손해사정 관련 정보"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 수집·이용",
      "desc": "성명·주소·연락처 등 일반개인정보, 보험금 지급계좌·보험계약 정보"
     }
    ]
   },
   {
    "key": "provide",
    "title": "[필수] 제공에 관한 사항",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 제공 (국내)",
      "desc": "주민등록번호, 외국인등록번호, 여권번호, 운전면허번호"
     },
     {
      "k": "sens",
      "label": "민감정보 제공 (국내)",
      "desc": "질병·상해에 관한 정보, 보험사고 조사 및 손해사정 관련 정보"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 제공 (국내)",
      "desc": "일반개인정보, 신용거래정보"
     },
     {
      "k": "abroad",
      "label": "개인(신용)정보 제공 (국외)",
      "desc": "국외 재보험사 (재보험금 청구 시)"
     }
    ]
   },
   {
    "key": "inquire",
    "title": "[필수] 조회에 관한 사항",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 조회",
      "desc": "주민등록번호, 운전면허번호 등"
     },
     {
      "k": "sens",
      "label": "민감정보 조회",
      "desc": "질병·상해에 관한 정보, 교통법규 위반정보, 교통사고조사기록"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 조회",
      "desc": "일반개인정보, 신용거래정보"
     }
    ]
   }
  ],
  "notice": "귀하는 개인(신용)정보의 수집·이용 및 조회, 제공에 관한 동의를 거부하실 수 있습니다. 다만, 본 동의는 ‘보험금 청구’를 위해 필수적인 사항이므로 동의를 거부하시는 경우 관련 업무수행이 불가능합니다.",
  "docs": [
   "forms/kb-insure/p2.jpg",
   "forms/kb-insure/p3.jpg",
   "forms/kb-insure/p4.jpg"
  ]
 },
 "DB손해보험": {
  "id": "db",
  "ui": [
   {
    "key": "collect",
    "title": "[필수] 수집·이용에 관한 사항",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 수집·이용",
      "desc": "주민등록번호, 외국인등록번호, 여권번호, 운전면허번호"
     },
     {
      "k": "sens",
      "label": "민감정보 수집·이용",
      "desc": "질병·상해에 관한 정보(진료기록, 상병명 등), 보험사고 조사 및 손해사정 관련 정보"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 수집·이용",
      "desc": "성명·주소·연락처 등 일반개인정보, 보험금 지급계좌·보험계약 정보"
     }
    ]
   },
   {
    "key": "provide",
    "title": "[필수] 제공에 관한 사항",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 제공 (국내)",
      "desc": "주민등록번호, 외국인등록번호, 여권번호, 운전면허번호"
     },
     {
      "k": "sens",
      "label": "민감정보 제공 (국내)",
      "desc": "질병·상해에 관한 정보, 보험사고 조사 및 손해사정 관련 정보"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 제공 (국내)",
      "desc": "일반개인정보, 신용거래정보"
     },
     {
      "k": "abroad",
      "label": "개인(신용)정보 제공 (국외)",
      "desc": "국외 재보험사 (재보험금 청구 시)"
     }
    ]
   },
   {
    "key": "inquire",
    "title": "[필수] 조회에 관한 사항",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 조회",
      "desc": "주민등록번호, 운전면허번호 등"
     },
     {
      "k": "sens",
      "label": "민감정보 조회",
      "desc": "질병·상해에 관한 정보, 교통법규 위반정보, 교통사고조사기록"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 조회",
      "desc": "일반개인정보, 신용거래정보"
     }
    ]
   }
  ],
  "notice": "귀하는 개인(신용)정보의 수집·이용 및 조회, 제공에 관한 동의를 거부하실 수 있습니다. 다만, 본 동의는 ‘보험금 청구’를 위해 필수적인 사항이므로 동의를 거부하시는 경우 관련 업무수행이 불가능합니다.",
  "docs": [
   "forms/db-insure/p2.jpg",
   "forms/db-insure/p3.jpg",
   "forms/db-insure/p4.jpg",
   "forms/db-insure/p5.jpg"
  ]
 },
 "삼성생명": {
  "id": "samsunglife",
  "ui": [
   {
    "key": "collect",
    "title": "[필수] 수집·이용에 관한 사항",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 수집·이용",
      "desc": "주민등록번호, 외국인등록번호, 여권번호, 운전면허번호"
     },
     {
      "k": "sens",
      "label": "민감정보 수집·이용",
      "desc": "질병·상해에 관한 정보(진료기록, 상병명 등), 보험사고 조사 및 손해사정 관련 정보"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 수집·이용",
      "desc": "성명·주소·연락처 등 일반개인정보, 보험금 지급계좌·보험계약 정보"
     }
    ]
   },
   {
    "key": "provide",
    "title": "[필수] 제공에 관한 사항",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 제공 (국내)",
      "desc": "주민등록번호, 외국인등록번호, 여권번호, 운전면허번호"
     },
     {
      "k": "sens",
      "label": "민감정보 제공 (국내)",
      "desc": "질병·상해에 관한 정보, 보험사고 조사 및 손해사정 관련 정보"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 제공 (국내)",
      "desc": "일반개인정보, 신용거래정보"
     }
    ]
   },
   {
    "key": "inquire",
    "title": "[필수] 조회에 관한 사항",
    "items": [
     {
      "k": "uid",
      "label": "고유식별정보 조회",
      "desc": "주민등록번호, 운전면허번호 등"
     },
     {
      "k": "sens",
      "label": "민감정보 조회",
      "desc": "질병·상해에 관한 정보, 교통법규 위반정보, 교통사고조사기록"
     },
     {
      "k": "credit",
      "label": "개인(신용)정보 조회",
      "desc": "일반개인정보, 신용거래정보"
     }
    ]
   }
  ],
  "notice": "귀하는 개인(신용)정보의 수집·이용 및 조회, 제공에 관한 동의를 거부하실 수 있습니다. 다만, 본 동의는 ‘보험금 청구’를 위해 필수적인 사항이므로 동의를 거부하시는 경우 관련 업무수행이 불가능합니다.",
  "docs": [
   "forms/samsung-life/p2.jpg",
   "forms/samsung-life/p3.jpg",
   "forms/samsung-life/p4.jpg",
   "forms/samsung-life/p5.jpg",
   "forms/samsung-life/p6.jpg"
  ]
 }
};
// 고른 보험사들의 동의 항목을 하나로 합침 (같은 키는 한 번만 묻는다)
window.mergeConsents = function(names){
  var sets=(names||[]).map(function(n){ return window.CONSENT_SETS[n]; }).filter(Boolean);
  if(!sets.length) return null;
  var ui=[], opt=null;
  sets.forEach(function(S){
    S.ui.forEach(function(g){
      var G=ui.filter(function(x){ return x.key===g.key; })[0];
      if(!G){ G={key:g.key,title:g.title,desc:g.desc,items:[]}; ui.push(G); }
      g.items.forEach(function(it){ if(!G.items.some(function(x){ return x.k===it.k; })) G.items.push(it); });
    });
    if(S.opt){ if(!opt) opt={key:S.opt.key,title:S.opt.title,desc:S.opt.desc,items:[]};
      S.opt.items.forEach(function(it){ if(!opt.items.some(function(x){ return x.k===it.k; })) opt.items.push(it); }); }
  });
  var order={collect:0,provide:1,inquire:2}; var o=function(k){ return k in order?order[k]:9; }; ui.sort(function(a,b){ return o(a.key)-o(b.key); });
  return {ui:ui, opt:opt, notice:sets[0].notice, names:names.filter(function(n){ return window.CONSENT_SETS[n]; })};
};
