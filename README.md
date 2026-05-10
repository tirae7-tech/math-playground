# 사칙연산 놀이터

**사칙연산 놀이터**는 초등학생이 덧셈, 뺄셈, 곱셈, 나눗셈을 10문제씩 가볍게 연습할 수 있는 Vite + React 정적 웹앱입니다.

브라우저에서 바로 실행되며, 서버 기능, 로그인, 회원가입, 개인정보 입력 없이 사용할 수 있습니다.

## 주요 기능

- 연산 선택: 덧셈, 뺄셈, 곱셈, 나눗셈, 섞어서
- 난이도 선택: 쉬움, 보통, 도전
- 한 번에 10문제 풀이
- 정답/오답 피드백
- 결과 화면에서 별점과 격려 문구 표시
- 틀린 문제 보기
- 틀린 문제 다시 풀기 모드
- 현재 설정이 담긴 링크 공유

## 실행 방법

```bash
npm install
npm run dev
```

배포용 빌드:

```bash
npm run build
```

빌드 결과 미리 보기:

```bash
npm run preview
```

## Netlify 배포 방법

1. 이 폴더를 GitHub 저장소에 올립니다.
2. [Netlify](https://www.netlify.com/)에 로그인합니다.
3. `Add new site` 또는 `Import an existing project`를 선택합니다.
4. GitHub를 선택하고 저장소를 연결합니다.
5. 아래 설정을 확인합니다.
6. `Deploy`를 누릅니다.
7. 배포 완료 후 나온 `netlify.app` URL을 확인합니다.

주요 설정:

- Build Command: `npm run build`
- Publish Directory: `dist`

공유 URL 예시:

```txt
https://배포주소.netlify.app/?mode=mix&level=easy
https://배포주소.netlify.app/?mode=divide&level=normal
```

인스타그램 프로필 링크, 스토리 링크, QR코드에는 Netlify 배포 URL을 넣으면 됩니다.

## Vercel 배포 방법

1. GitHub 저장소를 [Vercel](https://vercel.com/)에 연결합니다.
2. Framework Preset은 `Vite` 또는 자동 감지를 사용합니다.
3. Build Command는 `npm run build`로 설정합니다.
4. Output Directory는 `dist`로 설정합니다.
5. 배포 완료 후 나온 URL을 확인합니다.

## GitHub Pages 주의점

GitHub Pages는 저장소 이름이 URL 경로에 포함될 수 있습니다. 이 프로젝트는 `vite.config.js`에서 `base: "./"`를 사용해 하위 경로 배포에도 대응하도록 설정했습니다.

## 개인정보 안내

이 앱은 개인정보를 수집하지 않습니다.

- 로그인 없음
- 회원가입 없음
- 이름 입력 없음
- 학교명 입력 없음
- 학년 입력 없음
- 개인정보 저장 없음
- 학습 결과 서버 저장 없음
- 브라우저 `localStorage`, `sessionStorage` 저장 없음

결과는 현재 화면에서만 보여주며, 새로고침하거나 앱을 닫으면 사라집니다.

## 공유 URL 예시

```txt
/?mode=mix&level=easy
/?mode=add&level=normal
/?mode=multiply&level=challenge
```

사용 가능한 값:

- `mode`: `add`, `subtract`, `multiply`, `divide`, `mix`
- `level`: `easy`, `normal`, `challenge`

잘못된 값이 들어오면 기본값인 `mode=mix`, `level=easy`가 사용됩니다.

## 인스타그램 공유 문구

설치 없이 바로 시작하는 사칙연산 10문제 연습.

덧셈, 뺄셈, 곱셈, 나눗셈을 아이가 부담 없이 풀어볼 수 있어요.

링크 하나로 가볍게 공유해보세요.
