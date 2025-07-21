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
    const isRoundTrip = document.getElementById("R_personal_car_roundtrip").checked;
    const roundTripText = isRoundTrip ? "x 2 (ไป-กลับ)" : "";
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
        after: cmToTwip(0),
        },
        indent: {
        left: cmToTwip(0),                 
        firstLine: index === 0 ? cmToTwip(2.5) : 0,  // บรรทัดแรกเยื้องเพิ่มอีก 2.5 = รวม 5.5 ซม.
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
        spacing: { after: cmToTwip(0) },
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
        spacing: { after: cmToTwip(0) },
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
            text: `\tระยะทาง ${personalCarDistanceFormatted} กม. ${roundTripText}  เป็นเงิน ${PersonalCarCostFormatted} บาท`,
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
                position: cmToTwip(1),
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

    const reignCarBox = document.querySelector("#reign_car_box")
    if (reignCarBox&& reignCarBox.style.display !== "none") {
    reignCarParagraph.push(createReignCarParagraph(ReignCarPlate,ReignCarDriver, ReignCarDistanceFormatted, ReignCarCostFormatted));
    }
    });

    //ค่าพาหนะ อื่นๆ
    const otherTransportParagraphs = [];
    const transportTypes = [
        { id: "airplane", label: "เครื่องบิน" },
        { id: "train", label: "รถไฟ" },
        { id: "bus", label: "รถประจำทาง" },
        { id: "vv", label: "พาหนะรับจ้าง" }
    ];

    function createTransportParagraph(type, detail, amountFormatted) {
        return new Paragraph({
            indent: { left: cmToTwip(2) },
            spacing: { after: cmToTwip(0) },
            children: [
                new TextRun({
                text: `- ${type.label} ${detail || ""} เป็นเงิน ${amountFormatted} บาท`,
                font: "TH Sarabun New",
                size: 32,
                })
            ]
        });
    }
    for (const type of transportTypes) {
    const box = document.querySelector(`#${type.id}_box`);
    if (box && box.style.display !== "none") {
        const inputs = box.querySelectorAll("input");
        const detail = inputs[0].value.trim();
        const amount = inputs[1].value.trim();
        const amountFormatted = amount ? Number(amount.replace(/,/g, '')).toLocaleString() : "0";

        if (detail || amount) {
        otherTransportParagraphs.push(
            createTransportParagraph(type, detail, amountFormatted)
        );
        }
    }
    }

    //registerParagraph
    const registerParagraph = [];
    function createregisterParagraph(registerDetail,registerFeeFormatted, registerPerson, registerCost) {
    return new Paragraph({
        indent: { left: cmToTwip(2)},
        spacing: { after: cmToTwip(0)},
        children: [
        new TextRun({
            text: `- ${registerDetail} จำนวน${registerFeeFormatted} บาท x จำนวน ${registerPerson} คน เป็นเงิน ${registerCost.toLocaleString()} บาท`,
            font: "TH Sarabun New",
            size: 32,
        }),
        ],
    });
    }
    const registerRows = document.querySelectorAll(".Registration_fee_cost");
    console.log("before forEach play normal");
    registerRows.forEach(row => {
    const registerDetail = row.querySelector('.Registration_fee_detail')?.value || "";
    // รองรับ comma และแสดงผล fee แบบมี comma
    const registerFeeRow = row.querySelector('.Registration-fee')?.value || "0";
    const registerFee = Number(registerFeeRow.replace(/,/g, ''));
    const registerFeeFormatted = registerFee.toLocaleString();
    const registerPerson = parseFloat(row.querySelector('.Registrationp-fee')?.value || 0);
    const registerCost = registerFee * registerPerson;
    console.log("forEach play normal");


    if (registerRows) {
    registerParagraph.push(createregisterParagraph(registerDetail,registerFeeFormatted, registerPerson, registerCost));
    console.log("push play normal");
    }
    });

    //ค่าตอบทนพนักงานขับรถ   
    const katopRows = document.querySelectorAll(".katoptan_row");
    const totalResult = Array.from(katopRows).reduce((sum, row) => {
    const span = row.querySelector(".reign_car4412_result");
    const value = parseFloat((span?.textContent || "0").replace(/,/g, "")) || 0;
    return sum + value;
    }, 0);

    const katoptanParagraph = [];
    function createKatoptanParagraph(driverName,money, days, total) {
    return new Paragraph({
        indent: { left: cmToTwip(2)},
        spacing: { after: cmToTwip(0)},
        children: [
        new TextRun({
            text: `- ${driverName} ${money.toLocaleString()} บาท X ${days} วัน เป็นเงิน ${total.toLocaleString()} บาท`,
            font: "TH Sarabun New",
            size: 32,
        }),
        ],
    });
    }
    const reignCarCheckbox = document.querySelector('input[name="topicT"][data-id="reign_car"]');
    if (reignCarCheckbox && reignCarCheckbox.checked){
    katopRows.forEach(row => {
    const inputs = row.querySelectorAll("input");
    const driverName = inputs[0]?.value.trim() || "-";
    const money = parseFloat(inputs[1]?.value.replace(/,/g, '') || "0");
    const days = parseFloat(inputs[2]?.value.replace(/,/g, '') || "0");
    const total = money * days;
    katoptanParagraph.push(createKatoptanParagraph(driverName,money, days, total));
    });
    }

    //otherParagraph
    const otherCostParagraph = [];
    function createotherCostParagraph(otherCostDetail,otherCostFeeFormatted) {
    return new Paragraph({
        indent: { left: cmToTwip(2)},
        spacing: { after: cmToTwip(0)},
        children: [
        new TextRun({
            text: `- ${otherCostDetail} จำนวน${otherCostFeeFormatted} บาท`,
            font: "TH Sarabun New",
            size: 32,
        }),
        ],
    });
    }
    const otherCostRows = document.querySelectorAll(".other_cost");
    otherCostRows.forEach(row => {
    const otherCostDetail = row.querySelector('.Other-cost_detail')?.value || "";
    // รองรับ comma และแสดงผล fee แบบมี comma
    const otherCostFeeRow = row.querySelector('.otherCost')?.value || "0";
    const otherCostFee = Number(otherCostFeeRow.replace(/,/g, ''));
    const otherCostFeeFormatted = otherCostFee.toLocaleString();


    if (otherCostRows) {
    otherCostParagraph.push(createotherCostParagraph(otherCostDetail,otherCostFeeFormatted));
    }
    });

    //loop ชื่อผู้ร่วมเดินทาง มาเก็บ เป็น string 
    const participantData = getAllEntryData1();
    const participantText = participantData.length > 0
    ? ` พร้อมด้วย\n` + participantData.map((p, i) =>
        `${i + 1}. ${p.name} ตำแหน่ง ${p.position}\n`
    ).join("")
    : '';

    //เนื้อหา main ที่จะใช้
    const lines = `ด้วยข้าพเจ้า ${requesting_name} ตำแหน่ง ${requesting_position} สังกัด ${requesting_part}${participantText} ประสงค์ขออนุญาตเดินทางไปราชการเพื่อ ${document.querySelector('input[name="qqe"]:checked')?.value || ''} เรื่อง ${project} ณ ${at} ในวันที่ ${thai_datepicker2} ถึงวันที่ ${thai_datepicker3} ดังเอกสารแนบต้นเรื่อง(ถ้ามี) และขออนุมัติเดินทางในวันที่ ${thai_datepicker4} และเดินทางกลับวันที่ ${thai_datepicker5} พร้อมประมาณการค่าใช้จ่ายในการเดินทางไปราชการดังนี้`;
    // นำ string มาจัด format ด้วย function createMainParagraphs()
    const mainParagraphs = createMainParagraphs(lines);

    // โหลดและแปลงภาพ
    // ใช้ loadAndFixImage เพื่อแปลงภาพให้เหมาะสมกับ doc
    const imageData = await loadAndFixImage("./public/img/krut.jpg")

    //กล่องเซ็นชื่อ
    window.signatureBox = new Table({
    width: {
        size: 35,
        type: WidthType.PERCENTAGE,
    },
    alignment: "right", // ✅ กล่องชิดขวา
    borders: {
        top: { size: 0, color: "FFFFFF" },
        bottom: { size: 0, color: "FFFFFF" },
        left: { size: 0, color: "FFFFFF" },
        right: { size: 0, color: "FFFFFF" },
        insideHorizontal: { size: 0, color: "FFFFFF" },
        insideVertical: { size: 0, color: "FFFFFF" },
    },
    rows: [
        new TableRow({
        children: [
            new TableCell({
            width: { size: cmToTwip(8), type: WidthType.DXA }, // ✅ กำหนดความกว้างกล่อง
            children: [
                new Paragraph({
                alignment: "center", // ✅ ข้อความอยู่กลางในกล่อง
                children: [
                    new TextRun({
                    text: "ลงชื่อ......................................ผู้ขอรับเงิน",
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                ],
                }),
                new Paragraph({
                alignment: "center",
                children: [
                    new TextRun({
                    text: document.getElementById("requesting_name").value,
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                ],
                }),
                new Paragraph({
                alignment: "center",
                children: [
                    new TextRun({
                    text: document.getElementById("requesting_position").value,
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                ],
                }),
            ],
            }),
        ],
        }),
    ],
    });

    //ตารางชื่อผู้ร่วมเดินทาง
    function createParticipantTable(data) {
    const { Table, TableRow, TableCell, Paragraph, TextRun, WidthType } = docx;

    // สร้างแถวหัวตาราง
    const headerRow = new TableRow({
        children: ['ชื่อ-นามสกุล', 'ตำแหน่ง', 'หน่วยงาน'].map(text =>
        new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text, bold: true, font: "TH Sarabun New", size: 32 })] })],
        })
        )
    });

    // สร้างแถวเนื้อหา
    const bodyRows = data.map(row => new TableRow({
        children: row.map(cell =>
        new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: cell, font: "TH Sarabun New", size: 32 })] })],
        })
        )
    }));

    // สร้างตารางทั้งหมด
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [headerRow, ...bodyRows],
    });
    }

// เก็บข้อมูลก่อน
const participantData1 = [];
const entries = document.querySelectorAll(".entry12");
entries.forEach((entry, index) => {
  const name = entry.querySelector("input[name^='name_']").value;
  const pos = entry.querySelector("input[name^='position_']").value;
  const dept = entry.querySelector("input[name^='department_']").value;
  participantData1.push([name, pos, dept]);
});

// ⬅️ สร้างตาราง ถ้ามีข้อมูล
let participantTable;
if (participantData1.length > 0) {
  participantTable = createParticipantTable(participantData1);
}

//เนื้อหา ขอใช้เครื่องบิน
const airplantLines = `ด้วยข้าพเจ้า ${requesting_name} ตำแหน่ง ${requesting_position} สังกัด ${requesting_part}${participantText} ประสงค์ขออนุญาตเดินทางไปราชการเพื่อ ${document.querySelector('input[name="qqe"]:checked')?.value || ''} เรื่อง ${project} ณ ${at} ในวันที่ ${thai_datepicker2} ถึงวันที่ ${thai_datepicker3} ดังเอกสารแนบต้นเรื่อง(ถ้ามี) และขออนุมัติเดินทางในวันที่ ${thai_datepicker4} และเดินทางกลับวันที่ ${thai_datepicker5} เนื่องจาก ${document.getElementById("rea").value}`;
// นำ string มาจัด format ด้วย function createMainParagraphs()
const airplantParagraphs = createMainParagraphs(airplantLines);
const airplaneCheckbox = document.querySelector('input[name="topicT"][data-id="airplane"]');
let airplaneSection = null;
if (airplaneCheckbox?.checked && typeof window.createAirplaneSection === "function") {
airplaneSection = window.createAirplaneSection(imageData, cmToTwip, dear, bookNum, date1, airplantParagraphs);
}

//เนื้อหา ขอใช้รถยนต์ส่วนบุคคล
const personalCarLines = `ด้วยข้าพเจ้า ${requesting_name} ตำแหน่ง ${requesting_position} สังกัด ${requesting_part}${participantText} ประสงค์ขออนุญาตเดินทางไปราชการเพื่อ ${document.querySelector('input[name="qqe"]:checked')?.value || ''} เรื่อง ${project} ณ ${at} ในวันที่ ${thai_datepicker2} ถึงวันที่ ${thai_datepicker3} ดังเอกสารแนบต้นเรื่อง(ถ้ามี) และขออนุมัติเดินทางในวันที่ ${thai_datepicker4} และเดินทางกลับวันที่ ${thai_datepicker5} เนื่องจาก ${document.getElementById("reason_personal_car_").value}`;
// นำ string มาจัด format ด้วย function createMainParagraphs()
const personalParagraphs = createMainParagraphs(personalCarLines);
const personalCarCheckbox = document.querySelector('input[name="topicT"][data-id="personal_car"]');
let personalSection = null;
if (personalCarCheckbox?.checked && typeof window.createPersonalCarSection === "function") {
personalSection = window.createPersonalCarSection(imageData, cmToTwip, dear, bookNum, date1, personalParagraphs);
}


    
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
            ...mainParagraphs,// เนื่อหาหลัก ก่อน เข้า part ค่าใช้จ่าย // หมายเหตุสำคัญ การนำตัวแปร array มาใช้ กับ ribarry docx.js ต้องมี ...นำหน้าทุกครั้งไม่งั้นเวลาเปิด word  จะขึ้น error!

            new Paragraph({
                spacing:{
                    before: cmToTwip(0.5),
                    after: cmToTwip(0)
                },
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
                    text: `2.ค่าที่พัก   ${document.querySelector('input[name="fav_language"]:checked')?.value || ''}`,
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
            ...otherTransportParagraphs,

            new Paragraph({
                tabStops: [
                    {
                    type: "right",
                    position: cmToTwip(15.5), // ปรับให้ตรงขอบขวา (ขึ้นกับความกว้างหน้ากระดาษ)
                    },
                ],
                children: [
                    new TextRun({
                    text: "4.ค่าลงทะเบียน",
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                    new TextRun({
                    text: `\tรวมเป็นเงิน ${document.getElementById("Registration-fee_result").textContent} บาท`,
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                ],
            }),            
            ...registerParagraph,

            new Paragraph({
                tabStops: [
                    {
                    type: "right",
                    position: cmToTwip(15.5), // ปรับให้ตรงขอบขวา (ขึ้นกับความกว้างหน้ากระดาษ)
                    },
                ],
                children: [
                    new TextRun({
                    text: "5.ค่าตอบแทนพนักงานขับรถ",
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                    new TextRun({
                    text: `\tรวมเป็นเงิน ${totalResult} บาท`,
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                ],
            }),
            ...katoptanParagraph, 

            new Paragraph({
                tabStops: [
                    {
                    type: "right",
                    position: cmToTwip(15.5), // ปรับให้ตรงขอบขวา (ขึ้นกับความกว้างหน้ากระดาษ)
                    },
                ],
                children: [
                    new TextRun({
                    text: "6.ค่าใช้จ่ายอื่นๆที่จำเป็นในการเดินทางไปราชการ",
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                    new TextRun({
                    text: `\tรวมเป็นเงิน ${document.getElementById("other-cost_result").textContent} บาท`,
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                ],
            }),
            ...otherCostParagraph,

            new Paragraph({
            spacing:{
                before:cmToTwip(0.5),
            },
            alignment: "right", 
            children: [
            new TextRun({
                text: `รวมค่าใช้จ่ายเป็นเงินประมาณ ${document.getElementById("GrandTotal").textContent} บาท`,
                font: "TH Sarabun New",
                size: 32,
            }),
            ],
            }),
            new Paragraph({
            alignment: "right", 
            children: [
            new TextRun({
                text: `(${numberToThaiText(parseNumber(document.getElementById("GrandTotal").textContent))})`,
                font: "TH Sarabun New",
                size: 32,
            }),
            ],
            }),
            F(),
            new Paragraph({
            children: [
            new TextRun({
                text: `จึงเรียนมาเพื่อโปรดพิจารณา`,
                font: "TH Sarabun New",
                size: 32,
            }),
            ],
            }),

            signatureBox,

            new Paragraph({
            children: [
            new TextRun({
                text: `ความเห็นงานการเงินโดยเบิกจ่ายจาก (  )เงินงบประมาณแผ่นดิน (  )งบประมาณเงินรายได้ (  )เงินรับฝาก`,
                font: "TH Sarabun New",
                size: 32,
            }),
            ],
            }),
            new Paragraph({
            children: [
            new TextRun({
                text: `หมวดรายจ่าย..............................รหัสงบประมาณ..............................จำนวนเงิน ${document.getElementById("GrandTotal").textContent} บาท`,
                font: "TH Sarabun New",
                size: 32,
            }),
            ],
            }),
            new Paragraph({
            children: [
            new TextRun({
                text: `จำนวนเงิน(ตัวอักษร) ${numberToThaiText(parseNumber(document.getElementById("GrandTotal").textContent))}`,
                font: "TH Sarabun New",
                size: 32,
            }),
            ],
            }),
            new Paragraph({
            children: [
            new TextRun({
                text: `ความคิดเห็นจาก งานการเงินบัญชี/งานบุคคลฯ/หัวหน้ากลุมงานฯ................................................................`,
                font: "TH Sarabun New",
                size: 32,
            }),
            ],
            }),
            new Paragraph({
            children: [
            new TextRun({
                text: `ความเห็นจาก หัวหน้าสำนักงานเลขานุการฯ..................................................................................................`,
                font: "TH Sarabun New",
                size: 32,
            }),
            ],
            }),
            new Paragraph({
            children: [
            new TextRun({
                text: `ความเห็นจาก หัวหน้าสำนักวิชาฯ/หัวหน้าส่วนงานฯ......................................................................................`,
                font: "TH Sarabun New",
                size: 32,
            }),
            ],
            }),
            new Paragraph({
            children: [
            new TextRun({
                text: `ความเห็นจาก รองคณบดีคณะวิศวกรรมศาสตร์ ฝ่ายบริหารฯ........................................................................`,
                font: "TH Sarabun New",
                size: 32,
            }),
            ],
            }),
            new Paragraph({
            children: [
            new TextRun({
                text: `ความเห็นจาก คณบดีคณะวิศวกรรมศาสตร์  (  )อนุมัติ     (  )ไม่อนุมัติ`,
                font: "TH Sarabun New",
                size: 32,
            }),
            ],
            }),
            new Paragraph({
                alignment: "right", // จัดให้ข้อความชิดขวา
                spacing: { before: cmToTwip(0.5) }, // ระยะห่างบรรทัด (ประมาณ 0.7 ใน jsPDF)
                children: [
                new TextRun({
                    text: "ลงชื่อ..............................................ผู้อนุมัติ",
                    font: "TH Sarabun New",
                    size: 32,
                }),
                ],
            }),
            new Paragraph({
                alignment: "right",
                spacing: { after: cmToTwip(0.3) },
                children: [
                new TextRun({
                    text: "(................................................................)",
                    font: "TH Sarabun New",
                    size: 32,
                }),
                ],
            }),
        ],
    },

        {
        //หน้าใหม่สำหรับ "ผู้อนุมัติ"
        children: [
        new Paragraph({
            alignment: "center",
            spacing: { after: cmToTwip(0.5) },
            children: [
            new TextRun({
                text: "รายชื่อผู้ร่วมเดินทาง",
                bold: true,
                font: "TH Sarabun New",
                size: 36,
            }),
            ],
        }),
        participantTable,
        ]
        },
        ...(airplaneSection ? [airplaneSection] : []),
        ...(personalSection ? [personalSection] : []),
        
    ],

    
});

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "document.docx"); // download docx
}
