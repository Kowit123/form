
async function generate_reportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        format: 'a4',
        unit: 'cm'
      });

    // ตั้งฟอนต์ไทย
        doc.addFileToVFS('THSarabunNew-normal.ttf', THSarabunNew_normal);
        doc.addFont('THSarabunNew-normal.ttf', 'THSarabunNew', 'normal');
        doc.addFileToVFS('THSarabunNew-bold.ttf', THSarabunNew_bold);
        doc.addFont('THSarabunNew-bold.ttf', 'THSarabunNew', 'bold');
        doc.setFont("THSarabunNew");

calculateDuration();


const pageWidth = doc.internal.pageSize.getWidth();
doc.text(`สัญญาเงินยืมเลขที่ ${document.getElementById("con_number").value}    วันที่ ${document.getElementById("thai-datepicker6").value}`,3,2,{align: 'left'});
doc.text(`ชื่อผู้ยืม ${document.getElementById("Borrower").value}    จำนวนเงิน ${parseFloat(document.getElementById("amount_borrow")?.value || 0).toLocaleString()} บาท`,3,2.7,{align: 'left'});
doc.text(`ส่วนที่1`,pageWidth-2,2, {align: 'right'});
doc.text(`แบบ 8708`,pageWidth-2,2.7,{align: 'right'});


doc.setFont("THSarabunNew", "bold");
doc.setFontSize(16);
doc.text(`ใบเบิกค่าใช้จ่ายในการเดินทางไปราชการ`,pageWidth / 2, 4, { align: 'center' });

doc.setFont("THSarabunNew", "normal");
doc.text(`ที่ทำการ  คณะวิศวกรรมศาสตร์ มมส.`,pageWidth-2,4.7, {align: 'right'});
doc.text(`วันที่ ${document.getElementById("thai-datepicker7").value}`,pageWidth-2,5.4,{align: 'right'});


let y = 6.1;
const topic_re = doc.splitTextToSize(`เรื่อง ${document.getElementById("topic_re").value}`, 16);
doc.setFont("THSarabunNew", "normal");
doc.text(topic_re, 3, y);
y += topic_re.length * 0.7;

doc.text (`เรียน ${document.getElementById("dear_re").value}`,3, y);
y += 1; 


// เนื้อหา
const firstLineWidth = 13;
const nextLinesWidth = 16;

const descripts = `ตามคำสั่ง/บันทึกที่ ${document.getElementById("rebd2").value} ลงวันที่ ${document.getElementById("thai-datepicker8").value} ได้อนุมัติให้ ข้าพเจ้า ${document.getElementById("nrq_re").value} ตำแหน่ง ${document.getElementById("pst_re").value} สังกัด ${document.getElementById("pt_re").value} เดินทางไปปฏิบัติราชการเพื่อ ${document.querySelector('input[name="qqee"]:checked')?.value || ''} เรื่อง ${document.getElementById("subject_re").value} ณ ${document.getElementById("lo_re").value} ออกเดินทางจาก ( )บ้านพัก ( )สำนักงาน ประเทศไทย ตั้งแต่วันที่ ${document.getElementById("thai-datepicker9").value} เวลา ${document.getElementById("timepicker3").value} น. และกลับถึง ( )บ้านพัก ( )สำนักงาน ประเทศไทย วันที่ ${document.getElementById("thai-datepicker10").value} เวลา ${document.getElementById("timepicker4").value} น. ${document.getElementById("daysresult").textContent}`;

const linesTemps = doc.splitTextToSize(descripts, firstLineWidth);

const firstLine = linesTemps[0];

const remainingText = descripts.substring(firstLine.length).trim(); // ตัดช่องว่างหน้าออก

// ตัดข้อความส่วนที่เหลือด้วยความกว้าง 16
const remainingLines = doc.splitTextToSize(remainingText, nextLinesWidth);

// รวมกัน
const allLines = [firstLine, ...remainingLines];

let lineY = y;
allLines.forEach((line, index) => {
  const x = index === 0 ? 5 : 3;
  doc.text(line, x, lineY);
  lineY += 0.7;
});
y=lineY;
y += 0.3;
doc.text(`ข้าพเจ้า ขอเบิกค่าใช้จ่ายในการเดินทางไปราชการสำหรับ ( )ข้าพเจ้า ( )คณะเดินทาง ดังนี้`, 3, y);
y += 1;
doc.text(`1.ค่าเบี้ยเลี้ยง`, 3, y);
doc.text(`เป็นเงิน ${document.getElementById("Real_GrandTotal_Allowance_Cost").textContent} บาท`, pageWidth-2, y,{align: 'right'});
y += 0.7;


let DetailOfAllowance1 = document.getElementById("real_allowance_cost_1").value.trim();
if (DetailOfAllowance1) {
  let persons1 = document.getElementById("real_NumberOfPersons_1").value.trim() || "0";
  let days1 = document.getElementById("real_NumberOfDate_1").value.trim() || "0";
  doc.text(`ค่าเบี้ยเลี้ยง ${DetailOfAllowance1} บาท จำนวน ${persons1} คน ระยะเวลา ${days1} วัน)`, 5, y);
  y += 0.7;
}

let DetailOfAllowance2 = document.getElementById("real_allowance_cost_2").value.trim();
if (DetailOfAllowance2) {
  let persons2 = document.getElementById("real_NumberOfPersons_2").value.trim() || "0";
  let days2 = document.getElementById("real_NumberOfDate_2").value.trim() || "0";
  doc.text(`ค่าเบี้ยเลี้ยง ${DetailOfAllowance2} บาท จำนวน ${persons2} คน ระยะเวลา ${days2} วัน)`, 5, y);
  y += 0.7;
}
y+= 0.3;


doc.text(`2.ค่าที่พัก ${document.querySelector('input[name="radio_re"]:checked')?.value || ''}`, 3, y);
doc.text(`เป็นเงิน ${document.getElementById("Real_GrandTotal_Accommodation_Cost").textContent} บาท`, pageWidth-2, y,{align: 'right'});
y += 0.7;
const Accommodation_Costrows = document.querySelectorAll("#Real_accommodation .Real_accommodation_1");
Accommodation_Costrows.forEach((row) => {
  const cost = row.querySelector(".real_accommodation_cost")?.value.trim() || "0";
  const rooms = row.querySelector(".real_accommodation_person")?.value.trim() || "0";
  const days = row.querySelector(".real_accommodation_day")?.value.trim() || "0";
  
  // ถ้ามีค่าใดค่าหนึ่งไม่เป็นศูนย์ ค่อยพิมพ์
  if (cost !== "0" || rooms !== "0" || days !== "0") {
    doc.text(`ค่าที่พักราคา ${cost} บาท จำนวน ${rooms} ห้อง ระยะเวลา ${days} วัน`, 5, y);
    y += 0.7;
  }
});
y += 0.3;

doc.text(`3.ค่าพาหนะ`, 3, y);
doc.text(`เป็นเงิน ${document.getElementById("R_distance-cost_result").textContent} บาท`, pageWidth-2, y,{align: 'right'});
const checkboxes = document.querySelectorAll('input[name="type"]:checked');
const selected = Array.from(checkboxes).map(cb => cb.value);
let checkboxX = 5; // จุดเริ่มแสดงค่า checkbox
selected.forEach((value, index) => {
  const text = ` ${value}`;
  doc.text(text, checkboxX, y);

  // คำนวณความกว้างของข้อความ แล้วเว้นระยะถัดไป
  const textWidth = doc.getTextWidth(text);
  checkboxX += textWidth + 0.5; // เว้นห่างระหว่างคำ
});
y += 0.7;
const dLines1 = `${document.querySelector('input[name="type"]:checked')?.value} หมายเลขทะเบียนรถ ${document.getElementById("R_vehicle_number").value} โดยมี ${document.getElementById("R_driver").value} เป็นพนักงานขับรถ`;
if (document.getElementById("R_vehicle_number").value || document.getElementById("R_driver").value) {
  const dlines12 = doc.splitTextToSize(dLines1, 14);
  doc.text(dlines12, 5, y);
  y += 0.7;
}
y += 0.7;

doc.text(`4.ค่าพาหนะรับจ้าง`, 3, y);
doc.text(`เป็นเงิน ${document.getElementById("R_vehicles-cost_result").textContent} บาท`, pageWidth-2, y,{align: 'right'});
y += 0.7;
const rows = document.querySelectorAll("#R_Hired-vehicles_detail .R_vehicles");
rows.forEach((row) => {
  const detailInput = row.querySelector(".R_vehicles_detail");
  const costInput = row.querySelector(".R_vehicles_cost");
  const detail = detailInput?.value.trim() || "";
  const cost = costInput?.value.trim() || "";
  if (detail || cost) {
    doc.text(`${detail} เป็นเงิน ${cost} บาท`, 5, y);
    y += 0.7;
  }
});
y += 0.3;


const lineHeight1 = 0.7;
const smallGap1 = 0.3;

const register_costrows = document.querySelectorAll("#R_Register_detail .r_register");

// นับจำนวนบรรทัดที่จะพิมพ์ (หัวข้อ 1 บรรทัด + รายละเอียดที่ไม่ว่าง)
const linesCount1 = 1 + Array.from(register_costrows).filter(row => {
  const detailInput = row.querySelector(".R_register_detail");
  const costInput = row.querySelector(".R_register_cost");
  return (detailInput?.value.trim() || costInput?.value.trim());
}).length;

// ความสูงรวมที่ต้องการ
let groupHeight = linesCount1 * lineHeight1 + smallGap1;

// เช็คพื้นที่ว่าพอไหม ถ้าไม่พอให้ขึ้นหน้าใหม่ก่อนพิมพ์ทั้งกลุ่ม
y = checkAddPageGroup(doc, y, groupHeight);

doc.text(`5.ค่าลงทะเบียน`, 3, y);
doc.text(`เป็นเงิน ${document.getElementById("R_register_cost_result").textContent} บาท`, pageWidth - 2, y, { align: 'right' });
y += lineHeight1;

register_costrows.forEach((row) => {
  const detailInput = row.querySelector(".R_register_detail");
  const costInput = row.querySelector(".R_register_cost");
  const detail = detailInput?.value.trim() || "";
  const cost = costInput?.value.trim() || "";
  if (detail || cost) {
    doc.text(`${detail} เป็นเงิน ${cost} บาท`, 5, y);
    y += lineHeight1;
  }
});

y += smallGap1;


const lineHeight = 0.7;
const smallGap = 0.3;

const R_other_cost_resultrows = document.querySelectorAll("#R_other_detail .r_other");

// คำนวณจำนวนบรรทัดที่จะพิมพ์ (บรรทัดหัวข้อ 1 บรรทัด + บรรทัด detail ที่ไม่ว่าง)
const linesCount = 1 + Array.from(R_other_cost_resultrows).filter(row => {
  const detailInput = row.querySelector(".R_other_detail");
  const costInput = row.querySelector(".R_other_cost");
  return (detailInput.value.trim() || costInput.value.trim());
}).length;

// คำนวณความสูงรวมของกลุ่มนี้
 groupHeight = linesCount * lineHeight + smallGap;

// เช็คว่าพื้นที่ในหน้านี้พอไหม ถ้าไม่พอให้ขึ้นหน้าใหม่ก่อนพิมพ์
y = checkAddPageGroup(doc, y, groupHeight); // สมมติว่า checkAddPage รองรับ parameter ความสูงกลุ่ม

// พิมพ์หัวข้อ
doc.text(`6.ค่าใช้จ่ายอื่นๆ`, 3, y);
doc.text(`เป็นเงิน ${document.getElementById("R_other_cost_result").textContent} บาท`, pageWidth-2, y, { align: 'right' });
y += lineHeight;

// พิมพ์รายละเอียด
R_other_cost_resultrows.forEach((row) => {
  const detailInput = row.querySelector(".R_other_detail");
  const costInput = row.querySelector(".R_other_cost");
  const detail = (detailInput.value || "").trim();
  const cost = (costInput.value || "").trim();
  if (detail || cost) {
    doc.text(`${detail} เป็นเงิน ${cost} บาท)`, 5, y);
    y += lineHeight;
  }
});

y += smallGap;

groupHeight = 1.7;
y = checkAddPageGroup(doc, y, groupHeight);
doc.setFont("THSarabunNew", "bold");
doc.text(`รวมทั้งสิ้น ${document.getElementById("R_GrandTotal").textContent} บาท`, pageWidth-2, y,{align: 'right'});
y += 0.7;
doc.text(`จำนวนเงิน (ตัวอักษร)`, 3, y);
doc.text(`${numberToThaiText(window.Grand)}`, pageWidth-2, y,{align: 'right'});
y += 1;

groupHeight = 0.7 * 3;
y = checkAddPageGroup(doc, y, groupHeight);
doc.setFont("THSarabunNew", "normal");
doc.text(`ข้าพเจ้าขอรับรองว่ารายการที่กล่าวมาข้างต้นเป็นความจริง และหลักฐานการจ่ายที่ส่งมาด้วย`,5,y);
y += 0.7;
doc.text(`จำนวน...........ฉบับ รวมทั้งจำนวนเงินที่ขอเบิกถูกต้องตามกฎหมายทุกประการ`,3,y);
y+= 1;

const text1 = "ลงชื่อ...............................................ผู้ขอรับเงิน";
const marginLeft = 10.75;
const marginRight = 0.5;
const pageWidthForSignature = doc.internal.pageSize.getWidth();
const rangeWidth = pageWidthForSignature - marginLeft - marginRight;
const centerX = marginLeft + rangeWidth / 2;
doc.text(text1, centerX, y, { align: 'center' });
y+= 0.7;
const text2_1 = `${document.getElementById("nrq_re").value}`;
doc.text(text2_1, centerX-0.3, y, { align: 'center' });
y+= 0.7;
const text3_1 = `${document.getElementById("pst_re").value}`;
doc.text(text3_1, centerX-0.3, y, { align: 'center' });
y+= 0.7;
const text4_1 = `${document.getElementById("thai-datepicker7").value}`;
doc.text(text4_1, centerX-0.3, y, { align: 'center' });
y+= 0.7;


doc.addPage();

doc.setLineWidth(0.03);
// วาดกล่องซ้าย
doc.rect(1.5, 3, 9, 6); // x, y, width, height
doc.text("ได้ตรวจสอบหลักฐาน การเบิกจ่ายเงิน ที่แนบถูกต้องแล้ว", 1.85, 3.7);
doc.text("เห็นควรอนุมัติให้เบิกจ่ายได้", 4, 4.3);

doc.text("ลงชื่อ.....................................................", 3.2, 6.0);
doc.text("(.....................................................)", 3.9, 6.7);
doc.text("ตำแหน่ง....................................................", 2.7, 7.4);
doc.text("วันที่.....................................................", 3.2, 8.1);

// วาดกล่องขวา
doc.rect(10.5, 3, 9, 6);
doc.text("อนุมัติให้เบิกจ่ายได้", 13.5, 3.7);

doc.text("ลงชื่อ.....................................................", 12.2, 6.0);
doc.text("(.....................................................)", 12.9, 6.7);
doc.text("ตำแหน่ง......................................................", 11.7, 7.4);
doc.text("วันที่......................................................", 12.2, 8.1);


let y2 = 10;

doc.text(doc.splitTextToSize(`ได้รับเงินค่าใช้จ่ายในการเดินทางไปราชการ จำนวนเงิน ${document.getElementById("R_GrandTotal").textContent} บาท (${numberToThaiText(window.Grand)}) ไว้เป็นการถูกต้องแล้ว`,16.5),2,y2);
y2 += 1;

// ตั้งค่าความกว้างของ block ลายเซ็นแต่ละฝั่ง
const blockWidth = 7; // หน่วย cm

// คำนวณ X ตำแหน่งซ้ายของ block
const leftBlockX = 3.2;
const rightBlockX = 12.2;

function centerText(text, xStart, width, y) {
  const textWidth = doc.getTextWidth(text);
  const centeredX = xStart + (width - textWidth) / 2;
  doc.text(text, centeredX, y);
}

centerText("ลงชื่อ.....................................................ผู้รับเงิน", leftBlockX, blockWidth, y2);
centerText("ลงชื่อ.....................................................ผู้จ่ายเงิน", rightBlockX, blockWidth, y2);
y2 += 0.7;

const nameText = document.getElementById("nrq_re")?.value || "(......................................................)";
centerText(nameText, leftBlockX, blockWidth, y2);
centerText(nameText, rightBlockX, blockWidth, y2);
y2 += 0.7;

const positionText = document.getElementById("pst_re")?.value || "ตำแหน่ง....................................................";
centerText(positionText, leftBlockX, blockWidth, y2);
centerText(positionText, rightBlockX, blockWidth, y2);
y2 += 0.7;

centerText("วันที่.....................................................", leftBlockX, blockWidth, y2);
centerText("วันที่......................................................", rightBlockX, blockWidth, y2);
y2 += 1;


doc.text(`จากเงินตามสัญญายืมเงินเลขที่ ${document.getElementById("con_number")?.value || "......................."}  วันที่ ${document.getElementById("thai-datepicker6")?.value || "......................."}`,2,y2)

y2 += 1.4;

const ps = `หมายเหตุ: ${document.getElementById("ps")?.value || ".........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................."}`;
const linesps = doc.splitTextToSize(ps, 18); // ขนาดความกว้างในหน่วย pt หรือ mm
doc.text(linesps, 2, y2);
y2 += linesps.length * 0.7;

doc.setFont("THSarabunNew", "bold");
doc.text(`คำชี้แจง`,2, y2);
y2 += 0.7;
doc.setFont("THSarabunNew", "normal");
const alert1 = `1. กรณีเดินทางเป็นหมู่คณะและจัดทำใบเบิกค่าใช้จ่ายรวมฉบับเดียวกัน หากระยะเวลาในการเริ่มต้น และสิ้นสุดการเดินทางของแต่ละบุคคลแตกต่างกัน ให้แสดงรายละเอียดของวันเวลาที่แตกต่างกัน ของบุคคลนั้นในช่องหมายเหต`;
const alertLine1 = doc.splitTextToSize(alert1,18);
doc.text(alertLine1, 2, y2)
y2 += alertLine1.length * 0.7;

const alert2 = `2. กรณียื่นขอเบิกเงินค่าใช้จ่ายรายบุคคล ให้ผู้ขอรับเงินเป็นผู้ลงลายมือชื่อผู้รับเงิน และวันเดือนปีที่รับเงิน กรณีมีการยืมเงินให้ระบุวันที่ที่ได้รับเงินยืม เลขที่สัญญายืม และวันที่อนุมัติเงินยืมด้วย`;
const alertLine2 = doc.splitTextToSize(alert2,18);
doc.text(alertLine2, 2, y2)
y2 += alertLine2.length * 0.7;

const alert3 = `3. กรณีที่ยื่นขอเบิกค่าใช้จ่ายรวมเป็นหมู่คณะ ผู้ขอรับเงินมิต้องลงลายมือชื่อในช่องผู้รับเงิน ทั้งนี้ให้ผู้มีสิทธิแต่ละคน ลงลายมือชื่อผู้รับเงินในหลักฐานการจ่ายเงิน ( ส่วนที่ 2 )`;
const alertLine3 = doc.splitTextToSize(alert3,18);
doc.text(alertLine3, 2, y2)
y2 += alertLine3.length * 0.7;


if (call > 1) {
doc.addPage('a4', 'landscape');

const pageWidth2 = doc.internal.pageSize.getWidth();

doc.text(`ส่วนที1`,pageWidth2-2,2, {align: 'right'});
doc.text(`แบบ 8708`,pageWidth2-2,2.7,{align: 'right'});

doc.setFont("THSarabunNew", "bold");
doc.text(`หลักฐานการจ่ายเงินค่าใช้จ่ายในการเดินทางไปราชการ`,pageWidth2/2,2.7,{align: 'center'});
doc.setFont("THSarabunNew", "normal");
doc.text(`ชื่อส่วนราชการ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม  จังหวัด มหาสารคาม`,pageWidth2/2,3.4,{align: 'center'});
doc.text(`ใบประกอบค่าใช้จ่ายในการเดินทางของ ${document.getElementById("nrq_re")?.value || "........................................."} ลงวันที่..........................................`,pageWidth2/2,4.1,{align: 'center'});

const head = [
  [
    { content: 'ลำดับ', rowSpan: 2 },
    { content: 'ชื่อ - นามสกุล', rowSpan: 2 },
    { content: 'ตำแหน่ง', rowSpan: 2 },
    { content: 'ค่าใช้จ่าย', colSpan: 4, styles: { halign: 'center' } },
    { content: 'รวม', rowSpan: 2 },
    { content: 'ลายมือชื่อผู้รับเงิน', rowSpan: 2 },
    { content: 'วัน เดือน ปี ที่รับเงิน', rowSpan: 2 },
    { content: 'หมายเหตุ', rowSpan: 2 }
  ],
  [
    { content: 'ค่าเบี้ยเลี้ยง' },
    { content: 'ค่าเช่าที่พัก' },
    { content: 'ค่าพาหนะ' },
    { content: 'ค่าใช้จ่ายอื่น' }
  ]
];

function generateBodyFromInputs() {
  const body = [];

  for (let i = 1; i <= call; i++) {
    const name = document.getElementById(`name_re_${i}`)?.value || "";
    const position = document.getElementById(`position_re_${i}`)?.value || "";
    const allowance = document.getElementById(`allowance_p2_${i}`)?.value || "";
    const accommodation = document.getElementById(`accommodation_p2_${i}`)?.value || "";
    const vehicles = document.getElementById(`vehicles_p2_${i}`)?.value || "";
    const other = document.getElementById(`other_p2_${i}`)?.value || "";
    const total = document.getElementById(`total_p_${i}`)?.value || "";

    const row = [
      i,              // ลำดับ
      name,
      position,
      allowance,
      accommodation,
      vehicles,
      other,
      total,
      "",             // ลายมือชื่อ
      "",             // วันที่รับเงิน
      ""              // หมายเหตุ
    ];

    body.push(row);
  }

  return body;
}


const foot = [
    [
      { content: 'รวมเงิน', colSpan: 3, styles: { halign: 'center' } },
      { content: `${document.getElementById("thisResult1").textContent}`, styles: { halign: 'right' } },
      { content: `${document.getElementById("thisResult2").textContent}`, styles: { halign: 'right' } },
      { content: `${document.getElementById("thisResult3").textContent}`, styles: { halign: 'right' } },
      { content: `${document.getElementById("thisResult4").textContent}`, styles: { halign: 'right' } },
      { content: `${document.getElementById("thisResultGran").textContent}`, styles: { halign: 'right' } },
      { content: `ตามสัญญาเงินยืมเลขที่ ${document.getElementById("con_number")?.value || "................"} วันที่......................`, colSpan: 3 }
    ]
  ];

doc.autoTable({
  head: head,
  body: generateBodyFromInputs(),
  foot: foot,
  theme: 'grid',
  styles: {
    font: 'THSarabunNew',
    fontSize: 14,
    halign: 'center',
    valign: 'middle',
    overflow: 'linebreak',
  },
  headStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
  },
  bodyStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
},
  footStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
  },
  startY: 4.8, // หน่วย pt (ประมาณ 2cm)
  pageSize: 'a4',
  orientation: 'landscape',
  pageBreak: 'avoid',
  columnStyles: {
    0: { cellWidth: 1.2 },
    1: { cellWidth: 5.0 },
    2: { cellWidth: 2.5 },
    3: { cellWidth: 2.0 },
    4: { cellWidth: 2.0 },
    5: { cellWidth: 2.0 },
    6: { cellWidth: 2.0 },
    7: { cellWidth: 2.0 },
    8: { cellWidth: 3.0 },
    9: { cellWidth: 3.0 },
    10: { cellWidth: 2.5 }
  }
});

const finalY = doc.lastAutoTable.finalY
doc.text(`จำนวนเงินรวมทั้งสิ้น (ตัวอักษร)   ${numberToThaiText(window.this)}`, 1.5, finalY + 1.4);
y = finalY + 1.4;
const text2 = "ลงชื่อ....................................................ผู้จ่ายเงิน";
const marginLeft1 = 20;
const marginRight1 = 0;
const pageWidthForSignature1 = doc.internal.pageSize.getWidth();
const rangeWidth1 = pageWidthForSignature1 - marginLeft1 - marginRight1;
const centerX1 = marginLeft1 + rangeWidth1 / 2;
doc.text(text2, centerX1, y+0.75, { align: 'center' });
y+= 0.7;
doc.text(`${document.getElementById("nrq_re")?.value ||"(......................................................)"}`, centerX1, y+0.75, { align: 'center' });
y+= 0.7;
doc.text(`${document.getElementById("pst_re")?.value ||"ตำแหน่ง........................................................"}`, centerX1, y+0.75, { align: 'center' });
y+= 0.7;
doc.text("วันที่......................................................", centerX1-0.6, y+0.75, { align: 'center' });
y+= 0.7;

y2 = y-2;
doc.setFont("THSarabunNew", "bold");
doc.text(`คำชี้แจง`,1.5, y2);
y2 += 0.7;
doc.setFont("THSarabunNew", "normal");
const alert1_2 = ` 1. ค่าเบี้ยเลี้ยงและค่าเช่าที่พัก ให้ระบุอัตราวันละและจำนวนวันที่ขอเบิกของแต่ละบุคคลในช่องหมายเหต`;
const alertLine1_2 = doc.splitTextToSize(alert1_2,18);
doc.text(alertLine1_2, 2, y2)
y2 += alertLine1_2.length * 0.7;

const alert2_2 = ` 2. ให้ผู้มีสิทธิแต่ละคนเป็นผู้ลงลายมือชื่อผู้รับเงินและวันเดือนปีที่ได้รับเงิน กรณีเป็นการรับจากเงินยืมให้ระบุวันที่ที่ได้รับจากเงินยืม`;
const alertLine2_2 = doc.splitTextToSize(alert2_2,18);
doc.text(alertLine2_2, 2, y2)
y2 += alertLine2_2.length * 0.7;

const alert3_2 = `3. ผู้จ่ายเงินหมายถึงผู้ที่ขอยืมเงินจากทางราชการ และจ่ายเงินยืมนั้นให้แก่ผู้เดินทางแต่ละคน เป็นผู้ลงลายมือชื่อผู้จ่ายเงิน`;
const alertLine3_2 = doc.splitTextToSize(alert3_2,18);
doc.text(alertLine3_2, 2, y2)
y2 += alertLine3_2.length * 0.7;
};

doc.addPage('a4', 'portrait');

let y3 = 3;
doc.text(`บก 4231`,pageWidth-2,2, {align: 'right'});
doc.setFont("THSarabunNew", "bold");
doc.text(`ใบรับรองแทนใบเสร็จรับเงิน`, pageWidth/2,y3,{align: 'center'});
y3 += 0.7;
doc.text(`ส่วนราชการ มหาวิทยาลัยมหาสารคาม`,pageWidth/2,y3,{align: 'center'});
y3 += 0.7;
doc.setFont("THSarabunNew", "normal");

  const allSections = document.querySelectorAll('[id^="date-section-"]');

  const allData = [];

  allSections.forEach((section) => {
    const date = section.querySelector('.date-header input').value || 'ไม่ระบุ';
    const entries = section.querySelectorAll('.entries > div');

    entries.forEach((entry) => {
      const inputs = entry.querySelectorAll('input');
      const detail = inputs[0].value || '-';
      const amount = inputs[1].value || '-';
      const distance = inputs[2].value || '-';

      allData.push([date, detail, amount, distance]);
    });
  });

const foot1 = [
    [
      { content: 'รวมทั้งสิ้น', colSpan: 3, styles: { halign: 'center' } },
      { content: `${document.getElementById("k").textContent}`, styles: { halign: 'center' } },
      { content: ''}
    ]
  ];
  doc.autoTable({
    head: [['วัน/เดือน/ปี', 'รายละเอียดการจ่ายเงิน', 'ระยะทาง', 'จำนวนเงิน']],
    body: allData,
    foot: foot1,
    startY: y3,
  theme: 'grid',
  styles: {
    font: 'THSarabunNew',
    fontSize: 14,
    halign: 'center',
    valign: 'middle',
    overflow: 'linebreak',
  },
  columnStyles: {
    1: { halign: 'left' }, // คอลัมน์ที่ 2 (เริ่มนับจาก 0)
  },

  headStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
  },
  bodyStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0],
},
  footStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
  },
  });
const finalY2 = doc.lastAutoTable.finalY
doc.text(`รวมทั้งสิ้น   ${numberToThaiText(document.getElementById("k").textContent)}`,1.5,finalY2 + 1.4);
y3 += finalY2-2.3;
doc.text(`ข้าพเจ้า ${document.getElementById("nrq_re").value}  ตำแหน่ง ${document.getElementById("pst_re").value}`,1.5,y3)
y3 += 0.7;
doc.text(`สังกัด ${document.getElementById("pt_re").value}`,1.5,y3)
y3 += 0.7;
doc.text(`ขอรับรองว่ารายจ่ายข้างต้นนี้ ไม่อาจเรียกใบเสร็จรับเงินจากผู้รับได้ และข้าพเจ้าได้จ่ายในงานของราชการโดยแท้`,1.5,y3)
y3 += 2.1;
doc.text("ลงชื่อ....................................................ผู้ขอรับเงิน",pageWidth/2,y3, {align: 'center'});
y3 += 0.7;
doc.text(`${document.getElementById("nrq_re").value}`,pageWidth/2,y3,{align: 'center'});
y3 += 0.7;
doc.text(`${document.getElementById("pst_re").value}`,pageWidth/2,y3,{align: 'center'});


doc.addPage();
let y4 = 2;
doc.text(`ที่ มหาวิทยาลัยมหาสารคาม`,pageWidth-2,y4,{align: 'right'});
y4 += 0.7;
doc.text(`(ส่วนราชการเป็นผผู้เบิกให้)`,pageWidth-2,y4,{align: 'right'});
y4 += 0.7;
doc.setFont("THSarabunNew", "bold");
doc.text(`ใบสำคัญรับเงิน`,pageWidth/2,y4,{align: 'center'});
y4 += 0.7;
doc.setFont("THSarabunNew", "normal");
doc.text(`วันที่...................................`,pageWidth/2,y4,{align: 'center'});
y4 += 0.7;
doc.text(`ข้าพเจ้า ${document.getElementById("nrq_re").value}`,1.5,y4);
y4 += 0.7;
doc.text(`บ้านเลขที่............................................................................................................................................................................`,1.5,y4);
y4 += 0.7;
doc.text(`ได้รับเงินจาก คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม ดังรายการต่อไปนี้`,1.5,y4);
y4 += 0.7;


  const allSections1 = document.querySelectorAll('[id^="date-section-"]');

  const allData1 = [];

  allSections1.forEach((section) => {
    const date = section.querySelector('.date-header input').value || 'ไม่ระบุ';
    const entries = section.querySelectorAll('.entries > div');

    entries.forEach((entry) => {
      const inputs = entry.querySelectorAll('input');
      const detail = inputs[0].value || '-';
      const amount = inputs[2].value || '-';

      allData1.push([date, detail, amount,]);
    });
  });

const foot2 = [
    [
      { content: 'รวมทั้งสิ้น', colSpan: 2, styles: { halign: 'center' } },
      { content: `${document.getElementById("k").textContent}`, styles: { halign: 'center' } },
      { content: ''}
    ]
  ];
  doc.autoTable({
    head: [['วัน/เดือน/ปี', 'รายละเอียดการจ่ายเงิน', 'จำนวนเงิน']],
    body: allData1,
    foot: foot2,
    startY: y4,
  theme: 'grid',
  styles: {
    font: 'THSarabunNew',
    fontSize: 14,
    halign: 'center',
    valign: 'middle',
    overflow: 'linebreak',
  },
  columnStyles: {
    1: { halign: 'left' }, // คอลัมน์ที่ 2 (เริ่มนับจาก 0)
  },

  headStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
  },
  bodyStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0],
},
  footStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
  },
  });

const finalY3 = doc.lastAutoTable.finalY
doc.text(`ตัวอักษร   ${numberToThaiText(document.getElementById("k").textContent)}`,1.5,finalY3 + 1.4);
y3 += finalY2-4;

centerText("ลงชื่อ.....................................................ผู้รับเงิน", leftBlockX, blockWidth, y3);
centerText("ลงชื่อ.....................................................ผู้จ่ายเงิน", rightBlockX, blockWidth, y3);
y3 += 0.7;

const nameText1 = document.getElementById("nrq_re")?.value || "(......................................................)";
centerText(nameText1, leftBlockX, blockWidth, y3);
centerText(`(......................................................)`, rightBlockX-0.3, blockWidth, y3);
y3 += 0.7;

const positionText1 = document.getElementById("pst_re")?.value || "ตำแหน่ง....................................................";
centerText(positionText1, leftBlockX, blockWidth, y3);
centerText(`ตำแหน่ง.....................................................`, rightBlockX-0.9, blockWidth, y3);
y3 += 0.7;


    doc.save("รายงานการเดินทาง.pdf");

}

function numberToThaiText(number) {
  const numberText = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const positionText = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  if (isNaN(number)) return "ศูนย์บาทถ้วน";

  let [integerPart, decimalPart] = Number(number).toFixed(2).split(".");
  let bahtText = "";

  function convert(num) {
    let result = "";
    let len = num.length;

    for (let i = 0; i < len; i++) {
      const digit = parseInt(num.charAt(i));
      const pos = len - i - 1;

      if (digit === 0) continue;

      if (pos === 1 && digit === 1) {
        result += "สิบ";
      } else if (pos === 1 && digit === 2) {
        result += "ยี่สิบ";
      } else if (pos === 1) {
        result += numberText[digit] + "สิบ";
      } else if (pos === 0 && digit === 1 && len > 1) {
        result += "เอ็ด";
      } else {
        result += numberText[digit] + positionText[pos];
      }
    }
    return result;
  }

  // รองรับจำนวนหลักล้านขึ้นไป
  let segments = [];
  while (integerPart.length > 0) {
    segments.unshift(integerPart.slice(-6));
    integerPart = integerPart.slice(0, -6);
  }

  segments.forEach((seg, index) => {
    seg = parseInt(seg).toString(); // ลบ 0 ข้างหน้า
    if (seg !== "0") {
      bahtText += convert(seg);
      if (index < segments.length - 1) {
        bahtText += "ล้าน";
      }
    }
  });

  bahtText += "บาท";

  if (decimalPart === "00") {
    bahtText += "ถ้วน";
  } else {
    bahtText += convert(decimalPart) + "สตางค์";
  }

  return bahtText;
}

// cut the page if it is overpage
function checkAddPageGroup(doc, y, groupHeight) {
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 2; // สมมติขอบล่าง
  if (y + groupHeight > pageHeight - marginBottom) {
    doc.addPage();
    return 2.5; // สมมติระยะห่างบนหน้ากระดาษใหม่ (margin top)
  }
  return y;
}
