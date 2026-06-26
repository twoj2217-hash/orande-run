import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Tailwind 클래스 충돌을 정리하기 위한 유틸 함수입니다.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
