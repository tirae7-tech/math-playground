# 사칙연산 놀이터

**사칙연산 놀이터**는 초등학생이 학년과 수준을 선택해 사칙연산 10문제를 풀어보는 Vite + React 정적 웹앱입니다.

브라우저에서 바로 실행되며, 서버 기능, 로그인, 회원가입, 개인정보 입력 없이 사용할 수 있습니다.

## 주요 기능

- 1~6학년 선택
- 기초/표준/도전 수준 선택
- 연산 선택: 덧셈, 뺄셈, 곱셈, 나눗셈, 섞어서
- 10문제 랜덤 생성
- 정답/오답 피드백
- 결과 화면에서 별점과 격려 문구 표시
- 틀린 문제 복습
- 틀린 문제 다시 풀기 모드
- 설정 공유 URL
- QR코드 보기

## 학년별 연산 범위

- 1학년: 덧셈, 뺄셈
- 2학년: 덧셈, 뺄셈, 곱셈
- 3~4학년: 자연수 덧셈, 뺄셈, 곱셈, 나눗셈
- 5~6학년: 자연수 사칙계산과 혼합계산

이번 버전에서는 분수와 소수 문제는 제외합니다. 나눗셈은 나머지가 없도록 생성하고, 뺄셈은 답이 0 이상이 되도록 생성합니다.

## 수준 설명

- 기초: 차근차근 연습
- 표준: 학년 수준 연습
- 도전: 조금 더 어려운 문제

## 공유 URL 예시

```txt
/?grade=1&tier=low&mode=mix
/?grade=2&tier=middle&mode=multiply
/?grade=3&tier=middle&mode=divide
/?grade=5&tier=high&mode=mix
```

사용 가능한 값:

- `grade`: `1`, `2`, `3`, `4`, `5`, `6`
- `tier`: `low`, `middle`, `high`
- `mode`: `add`, `subtract`, `multiply`, `divide`, `mix`

잘못된 값이 들어오면 기본값인 `grade=1`, `tier=low`, `mode=mix`가 사용됩니다. 학년에 맞지 않는 연산이 들어오면 `mode=mix`로 처리합니다.

## 개인정보 안내

이 앱은 개인정보를 수집하지 않습니다.

- 로그인 없음
- 회원가입 없음
- 이름 입력 없음
- 학교명 입력 없음
- 개인정보 저장 없음
- `localStorage`, `sessionStorage` 사용 없음
- 학습 결과 서버 저장 없음

학년 선택값은 문제 수준 설정에만 사용하며 개인정보로 저장하지 않습니다. 결과는 현재 화면에서만 보여주며, 새로고침하거나 앱을 닫으면 사라집니다.

## 교육과정 관련 안내

공식 초등 수학 성취기준은 주로 1~2학년군, 3~4학년군, 5~6학년군처럼 학년군 중심으로 제시됩니다.

이 앱의 1~6학년 구분은 학년군 성취기준을 바탕으로 만든 연습용 난이도 구분입니다. 공식 평가 도구가 아니라 가정과 수업에서 가볍게 활용할 수 있는 보조 연습 도구입니다.

## 실행 방법

```bash
npm install
npm run dev
npm run build
npm run preview
```

자주 쓰는 흐름:

```bash
npm install
npm run dev
```

배포 전 확인:

```bash
npm run build
npm run preview
```

## 배포 방법

### Vercel

1. GitHub 저장소를 [Vercel](https://vercel.com/)에 연결합니다.
2. Framework Preset은 `Vite` 또는 자동 감지를 사용합니다.
3. Build Command는 `npm run build`로 설정합니다.
4. Output Directory는 `dist`로 설정합니다.
5. 배포 완료 후 나온 URL을 확인합니다.

예시:

```txt
https://배포주소.vercel.app/?grade=1&tier=low&mode=mix
https://배포주소.vercel.app/?grade=3&tier=middle&mode=divide
```

### Netlify

1. 이 폴더를 GitHub 저장소에 올립니다.
2. [Netlify](https://www.netlify.com/)에 로그인합니다.
3. `Add new site` 또는 `Import an existing project`를 선택합니다.
4. GitHub 저장소를 연결합니다.
5. Build Command는 `npm run build`로 설정합니다.
6. Publish Directory는 `dist`로 설정합니다.
7. `Deploy`를 누른 뒤 배포 URL을 확인합니다.

예시:

```txt
https://배포주소.netlify.app/?grade=2&tier=middle&mode=multiply
https://배포주소.netlify.app/?grade=5&tier=high&mode=mix
```

### GitHub Pages

GitHub Pages는 저장소 이름이 URL 경로에 포함될 수 있습니다. 이 프로젝트는 `vite.config.js`에서 `base: "./"`를 사용해 하위 경로 배포에도 대응하도록 설정했습니다.

GitHub Pages에 배포할 때는 빌드 결과물인 `dist`를 Pages가 읽을 수 있도록 별도 설정하거나, GitHub Actions 배포 흐름을 구성하면 됩니다.

## 인스타그램 공유 문구

### 부모님 대상

설치 없이 바로 열 수 있는 사칙연산 10문제 연습이에요.  
아이가 학년과 수준을 고르고 덧셈, 뺄셈, 곱셈, 나눗셈을 가볍게 풀어볼 수 있어요.  
로그인이나 이름 입력 없이 부담 없이 사용해보세요.

### 선생님 대상

수업 전후 짧은 계산 연습용으로 활용할 수 있는 사칙연산 놀이터입니다.  
학년, 수준, 연산을 고른 뒤 공유 링크나 QR코드로 학생들에게 바로 안내할 수 있어요.  
개인정보 입력 없이 현재 화면에서만 결과를 확인합니다.

### 짧은 홍보 문구

학년과 수준을 고르고 10문제만 가볍게!  
설치 없이 바로 시작하는 사칙연산 놀이터.
