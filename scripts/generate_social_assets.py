"""OranDe Run SNS 이미지 배경 자동 생성 스크립트.

이 스크립트는 텍스트 없는 배경 이미지를 생성합니다.
운영 시 한글 카피는 Canva/Figma에서 후처리로 올려 사용합니다.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw


# 브랜드 기본 컬러를 한곳에서 관리합니다.
CREAM = (253, 249, 245)
ORANGE = (249, 115, 22)
ORANGE_SOFT = (255, 182, 123)
CHARCOAL = (45, 42, 38)


def lerp_color(start: tuple[int, int, int], end: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    """두 RGB 색상을 선형 보간해 중간색을 계산합니다."""
    return tuple(int(start[i] + (end[i] - start[i]) * t) for i in range(3))


def create_gradient_canvas(width: int, height: int, direction: str = "vertical") -> Image.Image:
    """크림-오렌지 계열의 부드러운 그라데이션 배경을 만듭니다."""
    image = Image.new("RGB", (width, height), CREAM)
    draw = ImageDraw.Draw(image)
    steps = height if direction == "vertical" else width

    for i in range(steps):
        t = i / max(1, steps - 1)
        # 너무 진하지 않게 오렌지를 섞어 텍스트 가독성을 확보합니다.
        blend = min(0.45, t * 0.5)
        color = lerp_color(CREAM, ORANGE_SOFT, blend)
        if direction == "vertical":
            draw.line([(0, i), (width, i)], fill=color)
        else:
            draw.line([(i, 0), (i, height)], fill=color)

    return image


def draw_soft_orbs(draw: ImageDraw.ImageDraw, width: int, height: int, variant: int) -> None:
    """포스터 느낌을 내기 위한 부드러운 원형 포인트를 추가합니다."""
    # blur 장식 대신 경계가 분명한 소프트 원을 제한적으로 사용합니다.
    orb_specs = [
        (int(width * 0.15), int(height * 0.2), int(min(width, height) * 0.22)),
        (int(width * 0.82), int(height * 0.18), int(min(width, height) * 0.17)),
        (int(width * 0.78), int(height * 0.8), int(min(width, height) * 0.24)),
    ]
    shift = variant * 11
    for x, y, r in orb_specs:
        x2 = min(width, x + shift)
        y2 = min(height, y + shift // 2)
        fill = (255, 226, 194) if (x + y + shift) % 2 == 0 else (255, 214, 172)
        draw.ellipse((x2 - r, y2 - r, x2 + r, y2 + r), fill=fill, outline=None)


def draw_route_line(draw: ImageDraw.ImageDraw, width: int, height: int, variant: int) -> None:
    """러닝 루트 느낌의 곡선을 그려 역동성을 만듭니다."""
    points: list[tuple[int, int]] = []
    amplitude = int(height * 0.06) + variant * 3
    baseline = int(height * 0.7)
    for x in range(0, width + 1, 24):
        wave = int(math.sin((x / width) * math.pi * (1.4 + variant * 0.05)) * amplitude)
        points.append((x, baseline + wave))
    draw.line(points, fill=(244, 130, 41), width=max(6, width // 140))


def draw_runner(draw: ImageDraw.ImageDraw, cx: int, cy: int, scale: float = 1.0) -> None:
    """단순 실루엣 러너 아이콘을 그립니다."""
    # 머리
    head_r = int(14 * scale)
    draw.ellipse((cx - head_r, cy - 55 * scale - head_r, cx + head_r, cy - 55 * scale + head_r), fill=CHARCOAL)

    # 몸통/팔다리 (굵은 선으로 심플하게 표현)
    stroke = max(4, int(6 * scale))
    draw.line((cx, cy - 40 * scale, cx - 10 * scale, cy - 10 * scale), fill=CHARCOAL, width=stroke)
    draw.line((cx - 10 * scale, cy - 10 * scale, cx + 20 * scale, cy + 8 * scale), fill=CHARCOAL, width=stroke)
    draw.line((cx - 5 * scale, cy - 25 * scale, cx + 22 * scale, cy - 35 * scale), fill=CHARCOAL, width=stroke)
    draw.line((cx - 10 * scale, cy - 10 * scale, cx - 32 * scale, cy + 24 * scale), fill=CHARCOAL, width=stroke)
    draw.line((cx - 10 * scale, cy - 10 * scale, cx + 36 * scale, cy + 32 * scale), fill=CHARCOAL, width=stroke)


def draw_keycap_keyring(draw: ImageDraw.ImageDraw, x: int, y: int, size: int) -> None:
    """키캡키링 모티프를 간단한 아이콘으로 배치합니다."""
    cap_w = size
    cap_h = int(size * 0.78)
    draw.rounded_rectangle((x, y, x + cap_w, y + cap_h), radius=int(size * 0.12), fill=(255, 158, 76), outline=CHARCOAL, width=3)
    # 키링 고리
    ring_r = int(size * 0.23)
    ring_x = x + cap_w + ring_r + 10
    ring_y = y + int(cap_h * 0.35)
    draw.ellipse((ring_x - ring_r, ring_y - ring_r, ring_x + ring_r, ring_y + ring_r), outline=CHARCOAL, width=4)
    draw.line((x + cap_w, y + int(cap_h * 0.35), ring_x - ring_r, ring_y), fill=CHARCOAL, width=4)


def render_theme_background(width: int, height: int, theme: str, variant: int) -> Image.Image:
    """테마별 시각 요소를 합성해 최종 배경을 만듭니다."""
    image = create_gradient_canvas(width, height, direction="vertical")
    draw = ImageDraw.Draw(image)

    draw_soft_orbs(draw, width, height, variant)
    draw_route_line(draw, width, height, variant)

    # 테마별 포인트 오브젝트를 다르게 배치해 이미지 중복 느낌을 줄입니다.
    if theme == "cover":
        draw_runner(draw, int(width * 0.76), int(height * 0.73), 1.2)
        draw_keycap_keyring(draw, int(width * 0.1), int(height * 0.76), int(width * 0.15))
    elif theme == "virtual":
        draw_runner(draw, int(width * 0.2), int(height * 0.74), 1.0)
        draw_runner(draw, int(width * 0.78), int(height * 0.72), 1.0)
    elif theme == "everyone":
        draw_runner(draw, int(width * 0.22), int(height * 0.76), 0.9)
        draw_runner(draw, int(width * 0.72), int(height * 0.74), 1.2)
    elif theme == "together":
        draw_runner(draw, int(width * 0.3), int(height * 0.74), 0.95)
        draw_runner(draw, int(width * 0.64), int(height * 0.7), 1.05)
        # 연결감을 보여주기 위한 점선 경로
        for i in range(12):
            px = int(width * 0.35 + i * width * 0.025)
            py = int(height * 0.54 + math.sin(i * 0.8) * 10)
            draw.ellipse((px - 4, py - 4, px + 4, py + 4), fill=(242, 129, 46))
    elif theme == "reward":
        draw_keycap_keyring(draw, int(width * 0.48), int(height * 0.64), int(width * 0.19))
        draw_keycap_keyring(draw, int(width * 0.18), int(height * 0.72), int(width * 0.13))
    elif theme == "schedule":
        # 캘린더 프레임을 단순 카드 형태로 표현
        left = int(width * 0.58)
        top = int(height * 0.62)
        right = left + int(width * 0.3)
        bottom = top + int(height * 0.22)
        draw.rounded_rectangle((left, top, right, bottom), radius=20, fill=(255, 236, 214), outline=CHARCOAL, width=4)
        draw.line((left, top + 44, right, top + 44), fill=CHARCOAL, width=4)
        draw_runner(draw, int(width * 0.22), int(height * 0.75), 1.0)
    elif theme == "cta":
        draw_runner(draw, int(width * 0.74), int(height * 0.72), 1.18)
        # 앞으로 가는 화살표 느낌
        arrow = [
            (int(width * 0.11), int(height * 0.79)),
            (int(width * 0.38), int(height * 0.79)),
            (int(width * 0.35), int(height * 0.74)),
            (int(width * 0.47), int(height * 0.82)),
            (int(width * 0.35), int(height * 0.9)),
            (int(width * 0.38), int(height * 0.85)),
            (int(width * 0.11), int(height * 0.85)),
        ]
        draw.polygon(arrow, fill=(247, 136, 52))
    elif theme == "announce_open":
        draw_runner(draw, int(width * 0.74), int(height * 0.75), 1.1)
        draw_keycap_keyring(draw, int(width * 0.1), int(height * 0.76), int(width * 0.13))
    elif theme == "announce_d3":
        draw_runner(draw, int(width * 0.23), int(height * 0.74), 1.0)
        # 카운트다운 느낌 원형 포인트
        r = int(min(width, height) * 0.09)
        cx, cy = int(width * 0.8), int(height * 0.22)
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 170, 96), outline=CHARCOAL, width=4)
    elif theme == "announce_start":
        draw_runner(draw, int(width * 0.18), int(height * 0.74), 0.95)
        draw_runner(draw, int(width * 0.74), int(height * 0.7), 1.15)
    elif theme == "announce_verify":
        draw_keycap_keyring(draw, int(width * 0.12), int(height * 0.72), int(width * 0.14))
        draw_runner(draw, int(width * 0.76), int(height * 0.73), 1.05)

    return image


def save_image(path: Path, width: int, height: int, theme: str, variant: int) -> None:
    """테마 배경을 생성해서 PNG 파일로 저장합니다."""
    image = render_theme_background(width=width, height=height, theme=theme, variant=variant)
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG", optimize=True)


def main() -> None:
    """선언문 7장 + 공지 8장 이미지를 생성합니다."""
    repo_root = Path(__file__).resolve().parents[1]
    declaration_dir = repo_root / "public" / "images" / "social" / "declaration"
    announce_dir = repo_root / "public" / "images" / "social" / "announce"

    # 선언문 카드뉴스용 4:5 배경 (1080x1350)
    declaration_specs = [
        ("01-cover.png", "cover"),
        ("02-why-virtual.png", "virtual"),
        ("03-everyone-pace.png", "everyone"),
        ("04-together.png", "together"),
        ("05-reward-keycap.png", "reward"),
        ("06-schedule.png", "schedule"),
        ("07-cta.png", "cta"),
    ]
    for idx, (filename, theme) in enumerate(declaration_specs, start=1):
        save_image(declaration_dir / filename, 1080, 1350, theme, idx)

    # 공지용 배경 4종 x 2비율 (피드/스토리)
    announce_specs = [
        ("announce-recruitment-open-feed.png", 1080, 1080, "announce_open"),
        ("announce-recruitment-open-story.png", 1080, 1920, "announce_open"),
        ("announce-recruitment-d3-feed.png", 1080, 1080, "announce_d3"),
        ("announce-recruitment-d3-story.png", 1080, 1920, "announce_d3"),
        ("announce-run-start-feed.png", 1080, 1080, "announce_start"),
        ("announce-run-start-story.png", 1080, 1920, "announce_start"),
        ("announce-verification-feed.png", 1080, 1080, "announce_verify"),
        ("announce-verification-story.png", 1080, 1920, "announce_verify"),
    ]
    for idx, (filename, width, height, theme) in enumerate(announce_specs, start=1):
        save_image(announce_dir / filename, width, height, theme, idx)

    print("Generated 15 social background images successfully.")


if __name__ == "__main__":
    main()
