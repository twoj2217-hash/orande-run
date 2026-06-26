"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 일반 버튼 스타일 변형입니다.
const buttonVariants = cva(
  // 버튼 공통 규칙: 44px 터치 타깃, 명확한 focus ring, 상태 전환을 기본 제공
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,color,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95",
        destructive: "bg-destructive text-primary-foreground hover:bg-destructive/90 active:bg-destructive/95",
        cool:
          "dark:inset-shadow-2xs dark:inset-shadow-white/10 bg-linear-to-t border border-b-2 border-zinc-950/40 from-primary to-primary/85 shadow-md shadow-primary/20 ring-1 ring-inset ring-white/25 transition-[filter] duration-200 hover:brightness-110 active:brightness-90 dark:border-x-0 text-primary-foreground dark:text-primary-foreground dark:border-t-0 dark:border-primary/50 dark:ring-white/5",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        // 버튼/아이콘 스케일: sm=40, md(default)=44, lg=52
        default: "h-11 rounded-[10px] px-5 py-2 [&_svg]:size-[18px]",
        sm: "h-10 rounded-[10px] px-4 text-xs [&_svg]:size-4",
        lg: "h-[52px] rounded-[12px] px-8 [&_svg]:size-5",
        icon: "h-11 w-11 rounded-[10px] p-0 [&_svg]:size-[18px]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = "Button"

// 히어로 CTA에 쓰는 유리질감 버튼 스타일입니다.
const liquidbuttonVariants = cva(
  // LiquidButton은 Hero/특수 CTA에서만 사용하고, 상태 규칙은 일반 버튼과 동일하게 맞춥니다.
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap text-sm font-medium transition-[color,background-color,transform,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[18px] shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // hover/active는 사용처에서 bg 기반으로 단일 정의 (중복 brightness 제거)
        default: "bg-transparent text-white",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        // Hero 특수 CTA를 위해 xxl은 유지하되, 기본 스케일은 sm40/md44/lg52로 통일합니다.
        default: "h-11 rounded-[10px] px-5 py-2 has-[>svg]:px-4 [&_svg]:size-[18px]",
        sm: "h-10 rounded-[10px] text-xs gap-1.5 px-4 has-[>svg]:px-4 [&_svg]:size-4",
        lg: "h-[52px] rounded-[12px] px-7 has-[>svg]:px-5 [&_svg]:size-5",
        xl: "h-14 rounded-[12px] px-8 has-[>svg]:px-6 [&_svg]:size-5",
        xxl: "h-[60px] rounded-[12px] px-10 has-[>svg]:px-8 [&_svg]:size-5",
        icon: "h-11 w-11 rounded-[10px] p-0 [&_svg]:size-[18px]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "xxl"
    }
  }
)

// 그림자·유리 장식 레이어 — 클릭을 가로채지 않도록 pointer-events-none
function LiquidButtonDecorations({ isTouchDevice }: { isTouchDevice: boolean }) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-[12px]
            shadow-[0_2px_8px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.28),0_0_0_1px_rgba(255,255,255,0.12)]
        transition-shadow duration-200
        dark:shadow-[0_2px_10px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.06)]"
      />
      {!isTouchDevice && (
        <div
          className="pointer-events-none absolute inset-0 isolate -z-10 overflow-hidden rounded-[12px]"
          style={{ backdropFilter: 'url("#container-glass")' }}
        />
      )}
      {!isTouchDevice && <GlassFilter />}
    </>
  )
}

function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  // 터치 기기에서는 무거운 SVG backdrop filter를 생략합니다.
  const [isTouchDevice, setIsTouchDevice] = React.useState(false)

  React.useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  const variantClasses = liquidbuttonVariants({ variant, size, className })

  // asChild: Slot은 단일 자식만 허용하므로 장식 레이어는 바깥 wrapper에 둡니다.
  // 단, 크기·패딩·포커스 링(variantClasses)은 실제 클릭 대상인 자식(Comp)에 붙여야
  // 좌우 패딩 영역까지 모두 탭/클릭되고 키보드 포커스 링도 정상 표시됩니다.
  if (asChild) {
    return (
      <div className="relative inline-flex">
        <LiquidButtonDecorations isTouchDevice={isTouchDevice} />
        <Comp data-slot="button" className={cn("relative z-10", variantClasses)} {...props}>
          {children}
        </Comp>
      </div>
    )
  }

  return (
    <Comp data-slot="button" className={cn("relative", variantClasses)} {...props}>
      <LiquidButtonDecorations isTouchDevice={isTouchDevice} />
      <div className="pointer-events-none relative z-10">{children}</div>
    </Comp>
  )
}

// SVG 필터로 liquid glass 왜곡 효과를 만듭니다.
function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter id="container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

type ColorVariant = "default" | "primary" | "success" | "error" | "gold" | "bronze"

interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant
}

const colorVariants: Record<
  ColorVariant,
  {
    outer: string
    inner: string
    button: string
    textColor: string
    textShadow: string
  }
> = {
  default: {
    outer: "bg-gradient-to-b from-[#000] to-[#A0A0A0]",
    inner: "bg-gradient-to-b from-[#FAFAFA] via-[#3E3E3E] to-[#E5E5E5]",
    button: "bg-gradient-to-b from-[#B9B9B9] to-[#969696]",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(80_80_80_/_100%)]"
  },
  primary: {
    outer: "bg-gradient-to-b from-[#000] to-[#A0A0A0]",
    inner: "bg-gradient-to-b from-primary via-secondary to-muted",
    button: "bg-gradient-to-b from-primary to-primary/40",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(30_58_138_/_100%)]"
  },
  success: {
    outer: "bg-gradient-to-b from-[#005A43] to-[#7CCB9B]",
    inner: "bg-gradient-to-b from-[#E5F8F0] via-[#00352F] to-[#D1F0E6]",
    button: "bg-gradient-to-b from-[#9ADBC8] to-[#3E8F7C]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(6_78_59_/_100%)]"
  },
  error: {
    outer: "bg-gradient-to-b from-[#5A0000] to-[#FFAEB0]",
    inner: "bg-gradient-to-b from-[#FFDEDE] via-[#680002] to-[#FFE9E9]",
    button: "bg-gradient-to-b from-[#F08D8F] to-[#A45253]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(146_64_14_/_100%)]"
  },
  gold: {
    outer: "bg-gradient-to-b from-[#917100] to-[#EAD98F]",
    inner: "bg-gradient-to-b from-[#FFFDDD] via-[#856807] to-[#FFF1B3]",
    button: "bg-gradient-to-b from-[#FFEBA1] to-[#9B873F]",
    textColor: "text-[#FFFDE5]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(178_140_2_/_100%)]"
  },
  bronze: {
    outer: "bg-gradient-to-b from-[#864813] to-[#E9B486]",
    inner: "bg-gradient-to-b from-[#EDC5A1] via-[#5F2D01] to-[#FFDEC1]",
    button: "bg-gradient-to-b from-[#FFE3C9] to-[#A36F3D]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(124_45_18_/_100%)]"
  }
}

const metalButtonVariants = (variant: ColorVariant = "default", isPressed: boolean, isHovered: boolean, isTouchDevice: boolean) => {
  const colors = colorVariants[variant]
  const transitionStyle = "all 250ms cubic-bezier(0.1, 0.4, 0.2, 1)"

  return {
    wrapper: cn("relative inline-flex transform-gpu rounded-md p-[1.25px] will-change-transform", colors.outer),
    wrapperStyle: {
      transform: isPressed ? "translateY(2.5px) scale(0.99)" : "translateY(0) scale(1)",
      boxShadow: isPressed
        ? "0 1px 2px rgba(0, 0, 0, 0.15)"
        : isHovered && !isTouchDevice
          ? "0 4px 12px rgba(0, 0, 0, 0.12)"
          : "0 3px 8px rgba(0, 0, 0, 0.08)",
      transition: transitionStyle,
      transformOrigin: "center center"
    },
    inner: cn("absolute inset-[1px] transform-gpu rounded-lg will-change-transform", colors.inner),
    innerStyle: {
      transition: transitionStyle,
      transformOrigin: "center center",
      filter: isHovered && !isPressed && !isTouchDevice ? "brightness(1.05)" : "none"
    },
    button: cn(
      "relative z-10 m-[1px] rounded-md inline-flex h-11 transform-gpu cursor-pointer items-center justify-center overflow-hidden rounded-md px-6 py-2 text-sm leading-none font-semibold will-change-transform outline-none",
      colors.button,
      colors.textColor,
      colors.textShadow
    ),
    buttonStyle: {
      transform: isPressed ? "scale(0.97)" : "scale(1)",
      transition: transitionStyle,
      transformOrigin: "center center",
      filter: isHovered && !isPressed && !isTouchDevice ? "brightness(1.02)" : "none"
    }
  }
}

const ShineEffect = ({ isPressed }: { isPressed: boolean }) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-300",
        isPressed ? "opacity-20" : "opacity-0"
      )}
    >
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-neutral-100 to-transparent" />
    </div>
  )
}

export const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(({ children, className, variant = "default", ...props }, ref) => {
  const [isPressed, setIsPressed] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isTouchDevice, setIsTouchDevice] = React.useState(false)

  React.useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  const buttonText = children || "Button"
  const variants = metalButtonVariants(variant, isPressed, isHovered, isTouchDevice)

  return (
    <div className={variants.wrapper} style={variants.wrapperStyle}>
      <div className={variants.inner} style={variants.innerStyle} />
      <button
        ref={ref}
        className={cn(variants.button, className)}
        style={variants.buttonStyle}
        {...props}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => {
          setIsPressed(false)
          setIsHovered(false)
        }}
        onMouseEnter={() => {
          if (!isTouchDevice) setIsHovered(true)
        }}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onTouchCancel={() => setIsPressed(false)}
      >
        <ShineEffect isPressed={isPressed} />
        {buttonText}
        {isHovered && !isPressed && !isTouchDevice && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t rounded-lg from-transparent to-white/5" />
        )}
      </button>
    </div>
  )
})

MetalButton.displayName = "MetalButton"

export { Button, buttonVariants, liquidbuttonVariants, LiquidButton }
