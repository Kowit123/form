//  แปลงภาพให้ใช่้ได้ใน docx
//  ใช้ canvas ป้องกันปัญหา transparency
async function loadAndFixImage(url) {
  const img = new Image();
  img.crossOrigin = "anonymous"; // สำคัญถ้า host ภาพจาก server อื่น
  img.src = url;

  await new Promise((resolve) => (img.onload = resolve));

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";         // ✅ ป้องกัน transparency
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer); // ✅ ใช้ใน ImageRun
}   
    
// สร้างเอกสาร DOCX
// ใช้ docx.js เพื่อสร้างเอกสาร DOCX    
async function generateDoc() {
    // ตรวจสอบว่า docx.js และ FileSaver.js ว่าถูกโหลดแล้ว
    if (typeof window.docx === "undefined" || typeof window.saveAs === "undefined") {
        console.error("docx.js หรือ FileSaver.js ไม่ได้ถูกโหลด"); 
        return;
    }
    // นำเข้าโมดูลที่จำเป็นจาก docx.js
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, VerticalAlign, ImageRun } = window.docx;

    // โหลดและแปลงภาพ
    // ใช้ loadAndFixImage เพื่อแปลงภาพให้เหมาะสมกับ doc
    const imageData = await loadAndFixImage("https://kowit123.github.io/img/krut.jpg")

    // ฟังก์ชันแปลง cm เป็น twip (1 cm = 567 twip) เพราะ docx.js ใช้หน่วย twip สำหรับ margin และขนาดอื่นๆ
    // ใช้สำหรับกำหนดขนาด margin ของเอกสาร
    const cmToTwip = (cm) => Math.round(cm * 567);
    // สร้างเอกสารใหม่
    // กำหนดขนาด margin และสร้างตารางสำหรับส่วนหัวของเอกสาร
    const doc = new Document({
    sections: [{
        properties: {
        page: {
            margin: {
            top: cmToTwip(1.5),
            left: cmToTwip(3),
            right: cmToTwip(2.5),
            bottom: cmToTwip(2.5),
            }
        }
        },
        // กำหนดส่วนหัวของเอกสาร
        children: [
        new Table({
            rows: [
            new TableRow({
                children: [
                // ✅ คอลัมน์ภาพ
                new TableCell({
                    children: [
                    new Paragraph({
                        children: [
                        new ImageRun({
                            data: imageData,
                            transformation: {
                            height: 65,
                            width: 65
                            }
                        })
                        ]
                    })
                    ],
                    width: {
                    size: cmToTwip(2),
                    type: WidthType.DXA
                    },
                }),
                // ✅ คอลัมน์ข้อความ
                new TableCell({
                    verticalAlign: VerticalAlign.BOTTOM,
                    children: [
                    new Paragraph({
                        spacing: {
                        before: cmToTwip(1)
                        },
                        alignment: "center",
                        children: [
                        new TextRun({
                            text: "บันทึกข้อความ",
                            bold: true,
                            size: 48,
                            font: "TH Sarabun New"
                        })
                        ]
                    })
                    ]
                })
                ]
            })
            ],
            // กำหนดรูปแบบตารางให้ไม่เห็นเส้นตาราง
            width: {
            size: 100,
            type: WidthType.PERCENTAGE
            },
            borders: {
            top: { size: 0, color: "FFFFFF" },
            bottom: { size: 0, color: "FFFFFF" },
            left: { size: 0, color: "FFFFFF" },
            right: { size: 0, color: "FFFFFF" },
            insideHorizontal: { size: 0, color: "FFFFFF" },
            insideVertical: { size: 0, color: "FFFFFF" },
            }
        })
        ]
    }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "memo.docx");
}
