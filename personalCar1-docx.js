// airplaneSection.js
window.createPersonalCarSection = function (imageData, cmToTwip, dear, bookNum, date1, personalParagraphs) {
const personalCarBox = document.getElementById("personal_car_box")
const inputs = personalCarBox.querySelectorAll("input");
const plate = inputs[0].value.trim();
const driver = inputs[1].value.trim();
const distance = inputs[2].value.trim();
const roundTrip = inputs[3].value.trim();
const amount = document.getElementById("total_personal_car").textContent;
const Num = parseFloat(amount.replace(/,/g, '')) || 0;
const isRoundTrip = document.getElementById("R_personal_car_roundtrip").checked;
const roundTripText = isRoundTrip ? "x 2 (ไป-กลับ)" : "";
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
          new docx.TextRun({ text: "ขออนุมัติเดินทางไปราชการโดยรถยนต์ส่วนบุคคล", font: "TH Sarabun New", size: 32 }),
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
      ...personalParagraphs,
      new docx.Paragraph({
        children: [
          new docx.TextRun({text:"ดังนั้นจึงขออนุมัติงบประมาณในการเดินทางดังต่อไปนี้",font: "TH Sarabun New", size: 32})
        ]
      }),
      new docx.Paragraph({
        spacing:{before:cmToTwip(0.5)},
        children: [
          new docx.TextRun({text:`- รถยนต์ส่วนบุคคล`,font: "TH Sarabun New", size: 32})
        ]
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({text:`หมายเลขทะเบียน ${plate} โดยมี ${driver} เป็นผู้ขับรถ`,font: "TH Sarabun New", size: 32})
        ]
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({text:`ระยะทาง ${distance} กมใ ${roundTripText}  เป็นเงิน ${document.getElementById("total_personal_car").textContent}`,font: "TH Sarabun New", size: 32})
        ]
      }),
      new docx.Paragraph({
        spacing:{before:cmToTwip(0.5)},
        alignment: 'right',
        children: [
          new docx.TextRun({text:`รวมทั้งสิ้น ${document.getElementById("total_personal_car").textContent} บาท`,font: "TH Sarabun New", size: 32})
        ]
      }),
      new docx.Paragraph({
        spacing:{after:cmToTwip(0.5)},
        alignment: 'right',
        children: [
          new docx.TextRun({text:`(${numberToThaiText(Num)})`,font: "TH Sarabun New", size: 32})
        ]
      }),
      window.signatureBox,
    ],
  };
};
