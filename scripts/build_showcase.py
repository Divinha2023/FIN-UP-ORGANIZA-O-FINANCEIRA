from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SHOWCASE = ROOT / "showcase"
OUT = SHOWCASE / "finup-portfolio-4k.png"
WIDTH, HEIGHT = 3840, 2160

COLORS = {
    "green": "#00C853",
    "green_dark": "#049A43",
    "navy": "#0B1F33",
    "petroleum": "#123A4A",
    "ice": "#F5F7FA",
    "line": "#D9E2EC",
    "muted": "#5F6C7B",
    "yellow": "#FFC857",
    "red": "#FF4D4D",
    "ink": "#071622",
}


def hex_rgb(value):
    value = value.lstrip("#")
    return tuple(int(value[index : index + 2], 16) for index in (0, 2, 4))


def lerp(a, b, amount):
    return tuple(int(a[index] + (b[index] - a[index]) * amount) for index in range(3))


def font(size, bold=False):
    preferred = "segoeuib.ttf" if bold else "segoeui.ttf"
    candidates = [
        Path("C:/Windows/Fonts") / preferred,
        Path("C:/Windows/Fonts/segoeui.ttf"),
        Path("C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(str(candidate), size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def text_width(draw, text, selected_font):
    bbox = draw.textbbox((0, 0), text, font=selected_font)
    return bbox[2] - bbox[0]


def draw_logo_mark(draw, x, y, size):
    green = hex_rgb(COLORS["green"])
    shield = [
        (x + size * 0.50, y + size * 0.05),
        (x + size * 0.86, y + size * 0.19),
        (x + size * 0.82, y + size * 0.61),
        (x + size * 0.50, y + size * 0.94),
        (x + size * 0.18, y + size * 0.61),
        (x + size * 0.14, y + size * 0.19),
    ]
    draw.polygon(shield, outline=green, fill=(0, 200, 83, 32))
    stroke = max(4, int(size * 0.055))
    draw.line(
        [
            (x + size * 0.27, y + size * 0.63),
            (x + size * 0.43, y + size * 0.50),
            (x + size * 0.58, y + size * 0.42),
            (x + size * 0.75, y + size * 0.25),
        ],
        fill=green,
        width=stroke,
        joint="curve",
    )
    draw.line(
        [(x + size * 0.62, y + size * 0.25), (x + size * 0.75, y + size * 0.25), (x + size * 0.75, y + size * 0.39)],
        fill=green,
        width=stroke,
        joint="curve",
    )
    for bar_x, bar_h in [(0.30, 0.22), (0.43, 0.34), (0.56, 0.27)]:
        draw.rounded_rectangle(
            [x + size * bar_x, y + size * (0.66 - bar_h), x + size * (bar_x + 0.055), y + size * 0.66],
            radius=int(size * 0.025),
            fill=green,
        )


def crop_phone(path):
    image = Image.open(path).convert("RGBA")
    phone_width, phone_height = 430, 700
    x = (image.width - phone_width) // 2
    y = (image.height - phone_height) // 2
    return image.crop((x, y, x + phone_width, y + phone_height))


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return mask


def paste_phone(base, phone, center, phone_width, angle=0):
    ratio = phone.height / phone.width
    size = (phone_width, int(phone_width * ratio))
    phone_image = phone.resize(size, Image.Resampling.LANCZOS)
    phone_image.putalpha(rounded_mask(size, int(phone_width * 0.08)))
    if angle:
        phone_image = phone_image.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)

    shadow = Image.new("RGBA", phone_image.size, (0, 0, 0, 0))
    shadow.putalpha(phone_image.getchannel("A").filter(ImageFilter.GaussianBlur(max(24, phone_width // 18))))
    shadow_x = int(center[0] - shadow.width / 2 + phone_width * 0.04)
    shadow_y = int(center[1] - shadow.height / 2 + phone_width * 0.06)
    base.alpha_composite(shadow, (shadow_x, shadow_y))

    x = int(center[0] - phone_image.width / 2)
    y = int(center[1] - phone_image.height / 2)
    base.alpha_composite(phone_image, (x, y))


def build_background():
    image = Image.new("RGB", (WIDTH, HEIGHT), hex_rgb(COLORS["ink"]))
    pixels = image.load()
    navy = hex_rgb(COLORS["navy"])
    petroleum = hex_rgb(COLORS["petroleum"])
    ink = hex_rgb(COLORS["ink"])
    for y in range(HEIGHT):
        vertical = y / (HEIGHT - 1)
        row = lerp(navy, ink, vertical)
        for x in range(WIDTH):
            horizontal = x / (WIDTH - 1)
            strength = max(0, 1 - abs(horizontal - 0.68) * 2.2) * 0.42
            pixels[x, y] = lerp(row, petroleum, strength)
    return image.convert("RGBA")


def main():
    canvas = build_background()
    draw = ImageDraw.Draw(canvas)

    for index in range(-500, WIDTH + 600, 320):
        draw.line([(index, 0), (index + 920, HEIGHT)], fill=(245, 247, 250, 16), width=2)
    for y in range(260, HEIGHT, 290):
        draw.line([(0, y), (WIDTH, y - 260)], fill=(0, 200, 83, 18), width=2)

    bold_148 = font(148, True)
    bold_82 = font(82, True)
    bold_56 = font(56, True)
    bold_44 = font(44, True)
    bold_40 = font(40, True)
    reg_42 = font(42)
    reg_34 = font(34)
    reg_28 = font(28)
    reg_24 = font(24)

    draw_logo_mark(draw, 190, 245, 150)
    fin_x, fin_y = 365, 255
    draw.text((fin_x, fin_y), "Fin", font=bold_148, fill=COLORS["ice"])
    up_x = fin_x + text_width(draw, "Fin", bold_148) + 10
    draw.text((up_x, fin_y), "Up", font=bold_148, fill=COLORS["green"])
    draw.text((205, 440), "Sua vida financeira no controle.", font=reg_42, fill=(245, 247, 250, 225))
    draw.text(
        (205, 555),
        "Aplicativo mobile de organizacao financeira pessoal com dashboard,\ntransacoes, metas, orcamento, cartoes e relatorios inteligentes.",
        font=reg_34,
        fill=(217, 226, 236, 215),
        spacing=16,
    )

    draw.text((205, 770), "Paleta financeira", font=bold_40, fill=COLORS["ice"])
    palette = [COLORS["green"], COLORS["navy"], COLORS["petroleum"], COLORS["ice"], COLORS["yellow"], COLORS["red"]]
    for index, color in enumerate(palette):
        x = 205 + index * 116
        draw.rounded_rectangle([x, 845, x + 82, 927], radius=22, fill=color, outline=(245, 247, 250, 70), width=2)

    features = [
        ("Visao rapida", "Saldo, receitas e despesas"),
        ("Metas visuais", "Reserva, viagem e objetivos"),
        ("Alertas simples", "Veja onde gastos subiram"),
        ("Relatorios claros", "Compare meses e categorias"),
    ]
    for index, (title, body) in enumerate(features):
        x = 205 + (index % 2) * 450
        y = 1035 + (index // 2) * 245
        draw.rounded_rectangle([x, y, x + 385, y + 175], radius=28, fill=(14, 43, 57, 238), outline=(245, 247, 250, 58), width=2)
        draw.rounded_rectangle([x + 28, y + 30, x + 82, y + 84], radius=18, fill=(0, 200, 83, 54))
        draw.line([(x + 44, y + 67), (x + 58, y + 53), (x + 73, y + 43)], fill=COLORS["green"], width=6)
        draw.text((x + 104, y + 26), title, font=bold_40, fill=COLORS["ice"])
        draw.text((x + 104, y + 86), body, font=reg_24, fill=(217, 226, 236, 198), spacing=8)

    phones = {
        "dashboard": crop_phone(SHOWCASE / "finup-dashboard.png"),
        "transacoes": crop_phone(SHOWCASE / "finup-transacoes.png"),
        "metas": crop_phone(SHOWCASE / "finup-metas.png"),
        "relatorios": crop_phone(SHOWCASE / "finup-relatorios.png"),
        "perfil": crop_phone(SHOWCASE / "finup-perfil.png"),
        "onboarding": crop_phone(SHOWCASE / "finup-onboarding.png"),
    }

    paste_phone(canvas, phones["transacoes"], (1970, 1115), 650, -8)
    paste_phone(canvas, phones["metas"], (3010, 1120), 650, 8)
    paste_phone(canvas, phones["dashboard"], (2490, 1065), 805, 0)
    paste_phone(canvas, phones["relatorios"], (1830, 1810), 410, 0)
    paste_phone(canvas, phones["perfil"], (2285, 1830), 410, 0)
    paste_phone(canvas, phones["onboarding"], (2740, 1830), 410, 0)

    draw.text((1710, 170), "Fintech pessoal premium", font=bold_82, fill=COLORS["ice"])
    draw.text((1712, 276), "Clareza para decidir melhor todos os meses.", font=reg_42, fill=(217, 226, 236, 215))

    metrics = [("R$ 5.688,90", "saldo disponivel"), ("+12%", "evolucao mensal"), ("64%", "orcamento usado")]
    for index, (value, label) in enumerate(metrics):
        x = 1710 + index * 430
        draw.rounded_rectangle([x, 390, x + 350, 520], radius=30, fill=(14, 43, 57, 242), outline=(245, 247, 250, 60), width=2)
        draw.text((x + 30, 412), value, font=bold_56, fill=COLORS["green"] if index == 1 else COLORS["ice"])
        draw.text((x + 31, 476), label, font=reg_24, fill=(217, 226, 236, 190))

    draw.rounded_rectangle([205, 1710, 1400, 1988], radius=36, fill=(0, 200, 83, 230))
    draw.text((260, 1760), "Dashboard, transacoes, metas e relatorios", font=bold_40, fill=COLORS["navy"])
    draw.text((260, 1818), "prontos para evoluir para backend real.", font=bold_40, fill=COLORS["navy"])
    draw.text((260, 1900), "React Native + Expo  |  JWT  |  PostgreSQL", font=reg_28, fill=(11, 31, 51, 230))

    canvas.convert("RGB").save(OUT, quality=95)
    print(OUT)


if __name__ == "__main__":
    main()
