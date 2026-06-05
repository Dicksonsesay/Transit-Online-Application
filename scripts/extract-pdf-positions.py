import fitz

doc = fitz.open(
    r"d:\Transit Online Admission\transit-admission-system\public\templates\offer-of-admission-template.pdf"
)
page = doc[0]
h = page.rect.height
targets = ["Date:", "Augustine", "Dear ", "Programme:", "NLe", "Tuition"]

for block in page.get_text("dict")["blocks"]:
    for line in block.get("lines", []):
        for span in line["spans"]:
            t = span["text"]
            if not any(k in t for k in targets):
                continue
            x0, y0, x1, y1 = span["bbox"]
            print(
                f"yTop={h - y1:6.1f} x={x0:6.1f} size={span['size']:4.1f} font={span['font'][:24]} | {t[:72]}"
            )
