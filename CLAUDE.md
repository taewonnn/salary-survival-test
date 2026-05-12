# CLAUDE.md

## Project
월급생존테스트

## Repository
salary-survival-test

## Product Summary
이 프로젝트는 Apps in Toss 환경에서 동작하는 React Native Granite 앱이다.

사용자가 세후 월급, 소비 성향, 주거 스타일, 차량 여부를 입력하면  
지역별로 “내 월급으로 생존 가능한지”를 계산해 보여주는 금융 밈형 테스트 앱이다.

정확한 부동산/금융 계산기가 아니라,  
가볍고 빠르게 결과를 확인하고 공유할 수 있는 생활비 시뮬레이터를 목표로 한다.

---

## Core Product Direction

이 앱은 게임처럼 보이면 안 된다.

목표 느낌:
- 토스 실험실 기능
- 생활비 계산기
- 금융 밈 테스트
- 짧고 공유하기 쉬운 결과 앱

사용자는 20초 안에:
1. 월급 입력
2. 소비 성향 선택
3. 주거 스타일 선택
4. 차량 여부 선택
5. 결과 확인
6. 공유

까지 완료할 수 있어야 한다.

---

## Tech Stack

- React Native
- Granite
- Apps in Toss
- TypeScript
- `@granite-js/react-native`
- `@apps-in-toss/framework`

---

## Routing

Granite Router를 사용한다.

기본 페이지는:

```txt
pages/index.tsx