
const { Indent } = require("docx");

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

function getAllEntryData1() {
  const entries = document.querySelectorAll(".entry12");
  const data = [];
  entries.forEach((entry, idx) => {
    if (idx === 0) return; // skip first
    const name = entry.querySelector('input[name^="name_"]')?.value || "";
    const position = entry.querySelector('input[name^="position_"]')?.value || "";
    const department = entry.querySelector('input[name^="department_"]')?.value || "";
    if (name || position || department) {
      data.push({ name, position, department });
    }
  });
  return data;
}



// สร้างเอกสาร DOCX
// ใช้ docx.js เพื่อสร้างเอกสาร DOCX    
async function generateDoc() {

    const cmToTwip = (cm) => Math.round(cm * 567);

    //ดึงค่า input จาก html มาใช้
    const bookNum = document.getElementById("bookNum").value;//เลขที่หนังสือ
    const date1 = document.getElementById("thai-datepicker1").value;//วันที่ทำเอกสาร  input อยู่ข้างๆ เลขหนังสือ
    const topic = document.getElementById("topic").value;//เรื่อง
    const dear = document.getElementById("dear").value;// เรียน 
    const requesting_name = document.getElementById("requesting_name").value;
    const requesting_position = document.getElementById("requesting_position").value;
    const requesting_part = document.getElementById("requesting_part").value;
    const project = document.getElementById("project").value;
    const at = document.getElementById("at").value;
    const thai_datepicker2 = document.getElementById("thai-datepicker2").value;
    const thai_datepicker3 = document.getElementById("thai-datepicker3").value;
    const thai_datepicker4 = document.getElementById("thai-datepicker4").value;
    const thai_datepicker5 = document.getElementById("thai-datepicker5").value;

    // ตรวจสอบว่า docx.js และ FileSaver.js ว่าถูกโหลดแล้ว
    if (typeof window.docx === "undefined" || typeof window.saveAs === "undefined") {
        console.error("docx.js หรือ FileSaver.js ไม่ได้ถูกโหลด"); 
        return;
    }
    // นำเข้าโมดูลที่จำเป็นจาก docx.js
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, VerticalAlign, ImageRun } = window.docx;


    // สร้าง Paragraph จากข้อความ `lines`
    function createMainParagraphs(lines) {
    // แยกบรรทัดจากข้อความ โดยดูจาก \n หรือแบ่งเอง (เช่น 80–100 ตัวอักษร)
    const mainParagraph = lines.split("\n").map(line => line.trim()).filter(Boolean);

    // แปลงแต่ละบรรทัดเป็น Paragraph พร้อมจัด indent
    return mainParagraph.map((line, index) =>
    new Paragraph({
        alignment: "left",
        spacing: {
            before: cmToTwip(0.5)
        },
        indent: {
        left: cmToTwip(0),                 // ทุกบรรทัดเยื้องซ้าย 3 ซม.
        firstLine: index === 0 ? cmToTwip(2.5) : 0,  // บรรทัดแรกเยื้องเพิ่มอีก 2.5 = รวม 5.5 ซม.
        right: cmToTwip(2),                // ขอบขวา 2 ซม.
        },
        spacing: { after: cmToTwip(0.3) },   // ระยะบรรทัด
        children: [
        new TextRun({
            text: line,
            font: "TH Sarabun New",
            size: 32, // = 16pt
        })
        ]
    })
    );
    }

    const participantData = getAllEntryData1();
    const participantText = participantData.length > 0
    ? ` พร้อมด้วย\n` + participantData.map((p, i) =>
        `${i + 1}. ${p.name} ตำแหน่ง ${p.position}`
    ).join("\n")
    : '';

    const lines = `ด้วยข้าพเจ้า ${requesting_name} ตำแหน่ง ${requesting_position} สังกัด ${requesting_part}${participantText} ประสงค์ขออนุญาตเดินทางไปราชการเพื่อ ${document.querySelector('input[name="qqe"]:checked')?.value || ''} เรื่อง ${project} ณ ${at} ในวันที่ ${thai_datepicker2} ถึงวันที่ ${thai_datepicker3} ดังเอกสารแนบต้นเรื่อง(ถ้ามี) และขออนุมัติเดินทางในวันที่ ${thai_datepicker4} และเดินทางกลับวันที่ ${thai_datepicker5} พร้อมประมาณการค่าใช้จ่ายในการเดินทางไปราชการดังนี้`;
    const mainParagraphs = createMainParagraphs(lines);

    // โหลดและแปลงภาพ
    // ใช้ loadAndFixImage เพื่อแปลงภาพให้เหมาะสมกับ doc
    const imageData = await loadAndFixImage("./public/img/krut.jpg")

    // ฟังก์ชันแปลง cm เป็น twip (1 cm = 567 twip) เพราะ docx.js ใช้หน่วย twip สำหรับ margin และขนาดอื่นๆ
    // ใช้สำหรับกำหนดขนาด margin ของเอกสาร
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
        }),
            // ส่วนราชการ
            new Paragraph({
                spacing: { before: cmToTwip(0) },
                alignment: "left",
                children: [
                    new TextRun({
                        text: "ส่วนราชการ ",
                        font: "TH Sarabun New",
                        bold: true,
                        size: 32,
                    }),
                    new TextRun({
                        text: "คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม",
                        font: "TH Sarabun New",
                        size: 32,
                    }),
                ]
            }),
            // ส่วนราชการ
            new Paragraph({
                tabStops: [
                    {
                        type: "left",
                        position: cmToTwip(9), // ปรับระยะตามต้องการ
                    },
                ],
                children: [
                    new TextRun({ text: "ที่ ", bold: true, font: "TH Sarabun New", size: 32 }),
                    new TextRun({ text: bookNum, font: "TH Sarabun New", size: 32 }),
                    new TextRun({ text: "\t", font: "TH Sarabun New", size: 32 }), // ใช้ tab
                    new TextRun({ text: "วันที่ ", bold: true, font: "TH Sarabun New", size: 32 }),
                    new TextRun({ text: date1, font: "TH Sarabun New", size: 32 }),
                ],
            }),
            new Paragraph({
                spacing: { before: cmToTwip(0) },
                alignment: "left",
                children: [
                    new TextRun({
                        text: "เรื่อง ",
                        font: "TH Sarabun New",
                        bold: true,
                        size: 32,
                    }),
                    new TextRun({
                        text: topic,
                        font: "TH Sarabun New",
                        size: 32,
                    }),
                ]
            }),
            new Paragraph({
                spacing: { before: cmToTwip(0.5) },
                alignment: "left",
                children: [
                    new TextRun({
                        text: "เรียน ",
                        font: "TH Sarabun New",
                        bold: true,
                        size: 32,
                    }),
                    new TextRun({
                        text: dear,
                        font: "TH Sarabun New",
                        size: 32,
                    }),
                ]
            }),
            ...mainParagraphs,
        ]
    }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "document.docx");
}
