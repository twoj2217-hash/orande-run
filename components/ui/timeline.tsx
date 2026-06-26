"use client"

import Image from "next/image"
import { useScroll, useTransform, motion, useReducedMotion } from "framer-motion"
import { useRef } from "react"
import { BalancedText } from "@/components/ui/balanced-text"
import { splitKoLines } from "@/lib/ko-text"
import { cn } from "@/lib/utils"

interface TimelineEntry {
  id: number
  image: string
  alt: string
  title: string
  description: string
  layout: "left" | "right"
}

interface TimelineProps {
  entries: TimelineEntry[]
  className?: string
}

// 러너 스토리를 좌/우 타임라인 형태로 보여주는 섹션 컴포넌트입니다.
export function Timeline({ entries, className }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-orange-200 transform -translate-x-1/2 hidden md:block" />

      {entries.map((entry, index) => (
        <TimelineItem
          key={entry.id}
          entry={entry}
          index={index}
          prefersReducedMotion={!!prefersReducedMotion}
        />
      ))}
    </div>
  )
}

interface TimelineItemProps {
  entry: TimelineEntry
  index: number
  prefersReducedMotion: boolean
}

function TimelineItem({ entry, prefersReducedMotion }: TimelineItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: itemProgress } = useScroll({
    target: itemRef,
    offset: ["start center", "end center"]
  })

  const opacity = useTransform(itemProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])
  const scale = useTransform(itemProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8])
  const isLeft = entry.layout === "left"

  const motionStyle = prefersReducedMotion ? {} : { opacity, scale }

  return (
    <motion.div ref={itemRef} style={motionStyle} className="relative mb-20 md:mb-32">
      <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block" />

      <div className="container mx-auto px-6">
        <div
          className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center", {
            "md:text-right": isLeft
          })}
        >
          <div
            className={cn("relative", {
              "md:order-2": isLeft,
              "md:order-1": !isLeft
            })}
          >
            <div className="sticky top-20">
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-orange-50">
                <Image
                  src={entry.image || "/placeholder.svg"}
                  alt={entry.alt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-orange-500/10" />
              </div>
            </div>
          </div>

          <div
            className={cn("relative", {
              "md:order-1": isLeft,
              "md:order-2": !isLeft
            })}
          >
            <div className="sticky top-32">
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <BalancedText
                  as="h3"
                  lines={splitKoLines(entry.title)}
                  className="text-3xl md:text-4xl lg:text-5xl font-black tracking-wide text-foreground"
                />
                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-lg">{entry.description}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
