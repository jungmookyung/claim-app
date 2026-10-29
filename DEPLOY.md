# 청구서앱 — 폰 앱(PWA) 배포 절차

> **현재 방식(2026.10.29):** 저장소 jungmookyung/claim-app(공개, 형이 직접 생성) → GitHub Pages. 업데이트는 Claude가 이 저장소에 직접 올린다. 맥미니 ~/work/claim-app은 백업. 아래 절차는 참고용.

> 형은 텔레그램으로 지시한다. 답장은 CLAUDE.md 텔레그램 규칙대로(시작 1줄 → 작업 → 결과 3~5줄).
> 이 폴더(~/work/claim-app)에는 **앱 코드·삼성화재 공식 청구서 양식·아이콘만** 있다. 고객 자료·키·로그 없음.
> 앱은 고객 정보를 어디에도 보내지 않는다(폰 화면 안에서만 처리). 팩스는 형 폰의 SK 모바일팩스로 보낸다(팝빌 안 씀).

## "청구서앱 배포" (처음 한 번)
1. 올리기 전 확인: `cd ~/work/claim-app && ls -R` — `.env`, `logs`, PDF·고객 파일이 없어야 한다. 있으면 멈추고 형에게 알린다.
2. GitHub 로그인: `gh auth status`
   - `gh`가 없으면 `brew install gh`
   - 로그인이 안 돼 있으면 `gh auth login --hostname github.com --git-protocol https --web`를 실행하고, 나오는 **8자리 코드**와 `https://github.com/login/device`를 형에게 텔레그램으로 보낸 뒤 형이 폰에서 입력할 때까지 기다린다.
3. 저장소 만들고 올리기:
   ```bash
   cd ~/work/claim-app
   git init -b main 2>/dev/null; git add -A
   git commit -m "청구서앱 v1"
   gh repo create claim-app --public --source=. --remote=origin --push --description "보험금 청구서 자동작성 (폰 앱)"
   ```
4. GitHub Pages 켜기:
   ```bash
   OWNER=$(gh api user --jq .login)
   gh api -X POST "repos/$OWNER/claim-app/pages" -f "source[branch]=main" -f "source[path]=/"
   ```
   (이미 켜져 있다는 오류면 그냥 넘어간다)
5. 1~2분 뒤 확인: `gh api "repos/$OWNER/claim-app/pages" --jq .html_url` → 그 주소로 `curl -sI <주소>`가 200인지 확인.
6. 답장: 앱 주소 + "폰 크롬으로 열고 [앱 설치] 누르기".

## "청구서앱 업데이트" (Claude가 새 파일을 이 폴더에 넣어준 뒤)
```bash
cd ~/work/claim-app && git add -A && git commit -m "청구서앱 업데이트 $(date +%y%m%d)" && git push
```
1~2분 뒤 반영된다. 폰 앱은 다음에 열 때 새 버전으로 바뀐다. 답장: 반영 여부 한 줄.

## "청구서앱 주소"
`gh api "repos/$(gh api user --jq .login)/claim-app/pages" --jq .html_url`

## 참고
- 저장소가 공개라 코드와 양식은 누구나 볼 수 있지만, 고객 정보는 앱에 들어 있지 않다(입력값은 폰 메모리에만, 앱을 닫으면 사라짐). 검색엔진 노출은 막아 둠(robots.txt, noindex).
- 팝빌 자동발송 서버(~/work/claim-fax)는 쓰지 않는다. "청구팩스 멈춤"으로 꺼 둔다.
