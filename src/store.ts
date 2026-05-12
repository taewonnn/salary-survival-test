import type { SurvivalInput } from './survival';

let _input: SurvivalInput | null = null;
let _retryCount = 0;

export function setInput(input: SurvivalInput): void {
  _input = input;
}

export function getInput(): SurvivalInput | null {
  return _input;
}

export function incrementRetry(): void {
  _retryCount++;
}

export function getRetryCount(): number {
  return _retryCount;
}
