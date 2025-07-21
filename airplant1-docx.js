// airplaneSection.js
window.createAirplaneSection = function (imageData, cmToTwip, dear, bookNum, date1, airplantParagraphs) {
const airplaneBox = document.getElementById("airplane_box")
const inputs = airplaneBox.querySelectorAll("input");
const amount = inputs[1].value.trim();
const amountFormatted = amount ? Number(amount.replace(/,/g, '')).toLocaleString() : "0";
const thaiText = parseNumber(amountFormatted);
  return {
    children: [
      new docx.Table({
        rows: [
          new docx.TableRow({
            children: [
              new docx.TableCell({
                children: [
                  new docx.Paragraph({
                    children: [
                      new docx.ImageRun({
                        data: imageData,
                        transformation: { height: 65, width: 65 },
                      }),
                    ],
                  }),
                ],
                width: { size: cmToTwip(2), type: docx.WidthType.DXA },
              }),
              new docx.TableCell({
                verticalAlign: docx.VerticalAlign.BOTTOM,
                children: [
                  new docx.Paragraph({
                    spacing: { before: cmToTwip(1) },
                    alignment: "left",
                    indent: { left: cmToTwip(3.5) },
                    children: [
                      new docx.TextRun({
                        text: "บันทึกข้อความ",
                        bold: true,
                        size: 48,
                        font: "TH Sarabun New",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
        width: { size: 100, type: docx.WidthType.PERCENTAGE },
        borders: {
          top: { size: 0, color: "FFFFFF" },
          bottom: { size: 0, color: "FFFFFF" },
          left: { size: 0, color: "FFFFFF" },
          right: { size: 0, color: "FFFFFF" },
          insideHorizontal: { size: 0, color: "FFFFFF" },
          insideVertical: { size: 0, color: "FFFFFF" },
        },
      }),
      new docx.Paragraph({
        alignment: "left",
        children: [
          new docx.TextRun({ text: "ส่วนราชการ ", bold: true, font: "TH Sarabun New", size: 32 }),
          new docx.TextRun({
            text: "คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม โทรศัพท์ 043-754316 ภายใน 3007",
            font: "TH Sarabun New",
            size: 32,
          }),
        ],
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({ text: "เรื่อง ", bold: true, font: "TH Sarabun New", size: 32 }),
          new docx.TextRun({ text: "ขออนุมัติเดินทางไปราชการโดยเครื่องบิน", font: "TH Sarabun New", size: 32 }),
        ],
      }),
      new docx.Paragraph({
        spacing:{before: cmToTwip(0.5)},
        alignment: "left",
        children: [
          new docx.TextRun({ text: "เรียน ", bold: true, font: "TH Sarabun New", size: 32 }),
          new docx.TextRun({ text: dear, font: "TH Sarabun New", size: 32 }),
        ],
      }),
      ...airplantParagraphs,
      new docx.Paragraph({
        children: [
          new docx.TextRun({text:"ดังนั้นจึงขออนุมัติงบประมาณในการเดินทางดังต่อไปนี้",font: "TH Sarabun New", size: 32})
        ]
      }),
      new docx.Paragraph({
        spacing:{before:cmToTwip(0.5)},
        children: [
          new docx.TextRun({text:`- เครื่องบิน ${document.getElementById("airplanteDetail").value} เป็นเงิน ${amountFormatted} บาท`,font: "TH Sarabun New", size: 32})
        ]
      }),
      new docx.Paragraph({
        spacing:{before:cmToTwip(0.5)},
        alignment: 'right',
        children: [
          new docx.TextRun({text:`รวมทั้งสิ้น ${amountFormatted} บาท`,font: "TH Sarabun New", size: 32})
        ]
      }),
      new docx.Paragraph({
        spacing:{after:cmToTwip(0.5)},
        alignment: 'right',
        children: [
          new docx.TextRun({text:`(${numberToThaiText(thaiText)})`,font: "TH Sarabun New", size: 32})
        ]
      }),
      window.signatureBox,
    ],
  };
};
