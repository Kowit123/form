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

// loop ดึง input ชื่อผู้ร่วมเดินทาง
function getAllEntryData1() {
  const entries = document.querySelectorAll(".entry12");
  const data = [];
  entries.forEach((entry, idx) => {
    if (idx === 0) return; // skip first ชื่อแรกเป็น ของผู้ขออนุมัติ เลย ข้าม
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
    //แปลง cm เป็น twip
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
    //ตัวแปรไว้เก็บยอดรวม

    // ตรวจสอบว่า docx.js และ FileSaver.js ว่าถูกโหลดแล้ว
    if (typeof window.docx === "undefined" || typeof window.saveAs === "undefined") {
        console.error("docx.js หรือ FileSaver.js ไม่ได้ถูกโหลด"); 
        return;
    }
    // นำเข้าโมดูลที่จำเป็นจาก docx.js
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, VerticalAlign, ImageRun } = window.docx;

///////////////////////////////////////////////////////////// SETUP TEXT ///////////////////////////////////////////////////////////// 

    // สร้าง Paragraph จากข้อความ `lines`
    function createMainParagraphs(lines) {
    // แยกบรรทัดจากข้อความ โดยดูจาก \n หรือแบ่งเอง (เช่น 80–100 ตัวอักษร)
    const mainParagraph = lines.split("\n").map(line => line.trim()).filter(Boolean);

    // แปลงแต่ละบรรทัดเป็น Paragraph พร้อมจัด indent
    return mainParagraph.map((line, index) =>
    new Paragraph({
        alignment: "left", //ไม่ มี th distributed 
        spacing: {
        before: index === 0 ? cmToTwip(0.5) : 0, // ให้เฉพาะย่อหน้าแรกห่างจาก "เรียน"
        after: cmToTwip(0.3),
        },
        indent: {
        left: cmToTwip(0),                 
        firstLine: index === 0 ? cmToTwip(2.5) : 0,  // บรรทัดแรกเยื้องเพิ่มอีก 2.5 = รวม 5.5 ซม.
        right: cmToTwip(2),                // ขอบขวา 2 ซม.
        },
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

    // สร้างข้อมูลค่าเบี้ยเลี้ยง
    function createAllowanceParagraph(mc, pc, dc) {
    const text = `- ค่าเบี้ยเลี้ยง ${mc} บาท จำนวน ${pc} คน ระยะเวลา ${dc} วัน`;
    return new Paragraph({
        indent: { left: cmToTwip(2) },
        spacing: { after: cmToTwip(0.3) },
        children: [
        new TextRun({
            text,
            font: "TH Sarabun New",
            size: 32,
        }),
        ],
    });
    }

    // ดึง input ค่าเบี้ยเลี้ยง มาใช้
    const mc_1 = document.getElementById("mc_1").value.trim();
    const pc_1 = document.getElementById("pc_1").value.trim();
    const dc_1 = document.getElementById("dc_1").value.trim();

    const mc_2 = document.getElementById("mc_2").value.trim();
    const pc_2 = document.getElementById("pc_2").value.trim();
    const dc_2 = document.getElementById("dc_2").value.trim();

    const allowanceParagraphs = [];

    if (mc_1) {
    const formatted = Number(mc_1.replace(/,/g, '')).toLocaleString();
    allowanceParagraphs.push(createAllowanceParagraph(formatted, pc_1, dc_1));
    }

    if (mc_2) {
    const formatted = Number(mc_2.replace(/,/g, '')).toLocaleString();
    allowanceParagraphs.push(createAllowanceParagraph(formatted, pc_2, dc_2));
    }

    // รายละเอียดค่าเบบี้ยเลี้ยง
    function createAccommodationParagraph(cost, person, unit, days) {
    const text = `- ค่าที่พัก ${cost} บาท จำนวน ${person} ${unit} ระยะเวลา ${days} วัน`;
    return new Paragraph({
        indent: { left: cmToTwip(2) },
        spacing: { after: cmToTwip(0.3) },
        children: [
        new TextRun({
            text,
            font: "TH Sarabun New",
            size: 32,
        }),
        ],
    });
    }

    const accommodationParagraphs = [];// array เก็บ ข้อมูลค่าเบี้ยเลี้ยง
    const Accommodation_Costrows = document.querySelectorAll("#accommodation .all"); 

    Accommodation_Costrows.forEach((row) => {
    const cost = row.querySelector(".accommodation_cost")?.value.trim() || "0";
    const person = row.querySelector(".accommodation_person")?.value.trim() || "0";
    const days = row.querySelector(".accommodation_day")?.value.trim() || "0";
    const costFormatted = cost ? Number(cost.replace(/,/g, '')).toLocaleString() : "-";

    if (cost !== "0" || person !== "0" || days !== "0") {
        const unitRadio = row.querySelector('input[type="radio"]:checked');
        const unit = unitRadio ? unitRadio.parentElement.textContent.trim() : ""; 
        
        accommodationParagraphs.push(createAccommodationParagraph(costFormatted, person, unit, days)); // push เพิ่มข้อมูลเข้า accommodationParagraphs ที่เป็น array
    }
    });
    // ส่วนพาหนะ
    // ข้อมูลรายละเอียดรถยนต์ส่วนบบุคคล
    const PersonalCarParagraph = [];//เก็บรายละเอียดใว้ใช้
    const personalBox = document.querySelector("#personal_car_box");
    const inputs = personalBox.querySelectorAll("input");
    const personalCarPlate = inputs[0].value.trim();
    const personalCarDriver = inputs[1].value.trim();
    const personalCarDistance = inputs[2].value.trim();
    const PersonalCarCost = document.getElementById("total_personal_car").textContent.trim();
    const personalCarDistanceFormatted = personalCarDistance ? Number(personalCarDistance.replace(/,/g, '')).toLocaleString() : "-";
    const PersonalCarCostFormatted = PersonalCarCost ? Number(PersonalCarCost.replace(/,/g, '')).toLocaleString() : "-";
    
    function createPersonalCarParagraph(personalCarPlate, personalCarDriver, personalCarDistanceFormatted, PersonalCarCostFormatted) {
    return new Paragraph({
        indent: { left: cmToTwip(2)},
        tabStops: [
            {
                type: "left",
                position: cmToTwip(1), // ปรับระยะตามต้องการ
            },
        ],
        spacing: { after: cmToTwip(0) },
        children: [
        new TextRun({
            text: "- รถยนต์ส่วนบุคคล",
            font: "TH Sarabun New",
            size: 32,
        }),
        new TextRun({ break: 1 }),
        new TextRun({
            text: `\tหมายเลขทะเบียน ${personalCarPlate} โดยมี ${personalCarDriver} เป็นผู้ขับรถ`,
            font: "TH Sarabun New",
            size: 32,
        }),
        new TextRun({ break: 1 }),
        new TextRun({
            text: `\tระยะทาง ${personalCarDistanceFormatted} กม. (${personalBox.querySelector('input[type="checkbox"]:checked').parentElement.textContent.trim()}) เป็นเงิน ${PersonalCarCostFormatted} บาท`,
            font: "TH Sarabun New",
            size: 32,
        }),
        ],
    });
    }
    if (personalBox && personalBox.style.display !== "none") {
        PersonalCarParagraph.push(createPersonalCarParagraph(personalCarPlate, personalCarDriver, personalCarDistanceFormatted, PersonalCarCostFormatted));
    }


    const reignCarParagraph = [];
    function createReignCarParagraph(ReignCarPlate,ReignCarDriver, ReignCarDistanceFormatted, ReignCarCostFormatted) {
    return new Paragraph({
        indent: { left: cmToTwip(2)},
        tabStops: [
            {
                type: "left",
                position: cmToTwip(1), // ปรับระยะตามต้องการ
            },
        ],
        spacing: { after: cmToTwip(0) },
        children: [
        new TextRun({
            text: "- รถยนต์ของทางราชการ",
            font: "TH Sarabun New",
            size: 32,
        }),
        new TextRun({ break: 1 }),
        new TextRun({
            text: `\tหมายเลขทะเบียน ${ReignCarPlate} โดยมี ${ReignCarDriver} เป็นพนักงานขับรถ`,
            font: "TH Sarabun New",
            size: 32,
        }),
        new TextRun({ break: 1 }),
        new TextRun({
            text: `\tระยะทาง ${ReignCarDistanceFormatted} กม. เป็นเงิน ${ReignCarCostFormatted} บาท`,
            font: "TH Sarabun New",
            size: 32,
        }),
        ],
    });
    }
    const reignRows = document.querySelectorAll("#reign_car_box .reign_car_row");
    reignRows.forEach(row => {
    const inputs = row.querySelectorAll("input");
    const ReignCarPlate = inputs[0]?.value.trim() || "";
    const ReignCarDriver = inputs[1]?.value.trim() || "";
    const ReignCarDistance = inputs[2]?.value.trim() || "";
    const ReignCarCost = inputs[3]?.value.trim() || ""
    const ReignCarDistanceFormatted = ReignCarDistance ? Number(ReignCarDistance.replace(/,/g, '')).toLocaleString() : "-";
    const ReignCarCostFormatted = ReignCarCost ? Number(ReignCarCost.replace(/,/g, '')).toLocaleString() : "-";

  if (reignRows) {
    reignCarParagraph.push(createReignCarParagraph(ReignCarPlate,ReignCarDriver, ReignCarDistanceFormatted, ReignCarCostFormatted));
  }
});



    //loop ชื่อผู้ร่วมเดินทาง มาเก็บ เป็น string 
    const participantData = getAllEntryData1();
    const participantText = participantData.length > 0
    ? ` พร้อมด้วย\n` + participantData.map((p, i) =>
        `${i + 1}. ${p.name} ตำแหน่ง ${p.position}\n`
    ).join("")
    : '';

    // รวม string ที่จะใช้
    const lines = `ด้วยข้าพเจ้า ${requesting_name} ตำแหน่ง ${requesting_position} สังกัด ${requesting_part}${participantText} ประสงค์ขออนุญาตเดินทางไปราชการเพื่อ ${document.querySelector('input[name="qqe"]:checked')?.value || ''} เรื่อง ${project} ณ ${at} ในวันที่ ${thai_datepicker2} ถึงวันที่ ${thai_datepicker3} ดังเอกสารแนบต้นเรื่อง(ถ้ามี) และขออนุมัติเดินทางในวันที่ ${thai_datepicker4} และเดินทางกลับวันที่ ${thai_datepicker5} พร้อมประมาณการค่าใช้จ่ายในการเดินทางไปราชการดังนี้`;
    // นำ string มาจัด format ด้วย function createMainParagraphs()
    const mainParagraphs = createMainParagraphs(lines);

    // โหลดและแปลงภาพ
    // ใช้ loadAndFixImage เพื่อแปลงภาพให้เหมาะสมกับ doc
    const imageData = await loadAndFixImage("./public/img/krut.jpg")

///////////////////////////////////////////////////////////// SETUP TEXT ///////////////////////////////////////////////////////////// 

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
        // กำหนดส่วนหัวของเอกสาร ใช้ตารางเพื่อให้อยู่แนวเดียวกันได้
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
                        alignment: "left", 
                        indent: { left: cmToTwip(3.5) }, // เยื้องเข้าไปทางขวาประมาณ 1.5 ซม. ปรับได้ตามต้องการ
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
            // เลขที่ และวันที่ในการทำหนังสือ
            new Paragraph({
                tabStops: [
                    {
                        type: "left",
                        position: cmToTwip(7), // ปรับระยะตามต้องการ
                    },
                ],
                children: [
                    new TextRun({ text: "ที่ ", bold: true, font: "TH Sarabun New", size: 32 }),
                    new TextRun({ text: bookNum, font: "TH Sarabun New", size: 32 }),
                    new TextRun({ text: "\t", font: "TH Sarabun New", size: 32 }), // ใช้ tab แทนการเว้นด้วย spacebar
                    new TextRun({ text: "วันที่ ", bold: true, font: "TH Sarabun New", size: 32 }),
                    new TextRun({ text: date1, font: "TH Sarabun New", size: 32 }),
                ],
            }),
            //เรื่อง
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
            //เรียน
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
            ...mainParagraphs,// เนื่อหาหลัก ก่อน เข้า part ค่าใช้จ่าย // หมายเหตุสำคัญ การนำตัวแปรมาใช้ กับ ribarry docx.js ต้องมี ...นำหน้าทุกครั้งไม่งั้นเวลาเปิด word  จะขึ้น error!

            new Paragraph({
                tabStops: [
                    {
                    type: "right",
                    position: cmToTwip(15.5), // ปรับให้ตรงขอบขวา (ขึ้นกับความกว้างหน้ากระดาษ)
                    },
                ],
                children: [
                    new TextRun({
                    text: "1.ค่าเบี้ยเลี้ยง",
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                    new TextRun({
                    text: "\tรวมเป็นเงิน " + allowanceTotal.toLocaleString() + " บาท",
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                ],
            }),
            ...allowanceParagraphs,

            new Paragraph({
                tabStops: [
                    {
                    type: "right",
                    position: cmToTwip(15.5), // ปรับให้ตรงขอบขวา (ขึ้นกับความกว้างหน้ากระดาษ)
                    },
                ],
                children: [
                    new TextRun({
                    text: "2.ค่าที่พัก",
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                    new TextRun({
                    text: `\tรวมเป็นเงิน ${document.getElementById("result_2").textContent} บาท`,
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                ],
            }),
            ...accommodationParagraphs,

            new Paragraph({
                tabStops: [
                    {
                    type: "right",
                    position: cmToTwip(15.5), // ปรับให้ตรงขอบขวา (ขึ้นกับความกว้างหน้ากระดาษ)
                    },
                ],
                children: [
                    new TextRun({
                    text: "3.ค่าพาหนะ",
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                    new TextRun({
                    text: `\tรวมเป็นเงิน ${document.getElementById("Transportation_expenses_result").textContent} บาท`,
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                ],
            }),
            ...PersonalCarParagraph,
            ...reignCarParagraph,

        ]
    }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "document.docx"); // download docx
}
