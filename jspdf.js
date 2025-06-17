
    async function generatePDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'cm',
        format: 'a4'
      });

      //  ใช้ฟอนต์ที่ประกาศไว้ในไฟล์ฟอนต์
        doc.addFileToVFS('THSarabunNew-normal.ttf', THSarabunNew_normal);
        doc.addFont('THSarabunNew-normal.ttf', 'THSarabunNew', 'normal');
        doc.addFileToVFS('THSarabunNew-bold.ttf', THSarabunNew_bold);
        doc.addFont('THSarabunNew-bold.ttf', 'THSarabunNew', 'bold');
        doc.setFont("THSarabunNew");



        const imgData = "data:image/png;base64,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";
      const pageWidth = doc.internal.pageSize.getWidth();
      
      doc.addImage(imgData, 'PNG', 3, 1.5, 1.5, 1.6);
      //input
      const agency = document.getElementById("agency").value;
      const bookNum = document.getElementById("bookNum").value;
      const datepicker1 = document.getElementById("thai-datepicker1").value;
      const topic = document.getElementById("topic").value;
      const dear = document.getElementById("dear").value;
      const requesting_name = document.getElementById("requesting_name").value;
      const requesting_position = document.getElementById("requesting_position").value;
      const requesting_part = document.getElementById("requesting_part").value;
      const YDUGO = document.getElementById("YDUGO").value;
      const project = document.getElementById("project").value;
      const at = document.getElementById("at").value;
      const thai_datepicker2 = document.getElementById("thai-datepicker2").value;
      const thai_datepicker3 = document.getElementById("thai-datepicker3").value;
      const thai_datepicker4 = document.getElementById("thai-datepicker4").value;
      const thai_datepicker5 = document.getElementById("thai-datepicker5").value;
      const vehicle_number = document.getElementById("vehicle_number").value;
      const driver = document.getElementById("driver").value; 
      const distance = document.getElementById("distance").value;
      const distance_result = document.getElementById("distance-cost_result").value;
      const name_1 = document.getElementsByName("name_1").value;
      

      const accommodationTotal = window.accommodationTotal || 0;
      const   vehicles_cost = window.vehicles_cost || 0;
      const Registration_fee = window.Registration_fee || 0;
      const other_cost =   window.other_cost|| 0;
      const all_cost = window.all_cost || 0;
      const totald = window.totald || 0;window.totald

      //จัดเอกสาร
      //หัว
      doc.setFont("THSarabunNew", "bold");
      doc.setFontSize(26);
      doc.text('บันทึกข้อความ', pageWidth/2, 2.5, {align:'center'});
      //ส่วนราชการ1
      doc.setFontSize(16);
      doc.text('ส่วนราชการ', 3, 3.7);
      //ส่วนราชการ2
      doc.setFont("THSarabunNew", "normal");
      doc.text(`${agency}`, 5.3, 3.7);
      //เล่มหนังสือ1
      doc.setFont("THSarabunNew", "bold");
      doc.setFontSize(16);
      doc.text('ที่', 3, 4.4);
      doc.text('วันที่', 10.5, 4.4);
      //เล่มหนังสือ2
      doc.setFont("THSarabunNew", "normal");
      doc.text(`${bookNum}`, 3.5, 4.4);
      doc.text(`${datepicker1}`, 11.5, 4.4);
      //เรื่อง1
      doc.setFont("THSarabunNew", "bold");
      doc.text('เรื่อง', 3, 5.1);
      //เรื่อง2
      doc.setFont("THSarabunNew", "normal");
      let y = 5.1; // จุดเริ่มต้น
      const topicLines = doc.splitTextToSize(topic, 16);
      doc.text(topicLines, 4, y);
      y += topicLines.length * 0.6;
      //เรียน1
      doc.setFont("THSarabunNew", "bold");
      doc.text('เรียน', 3, y);
      //เรียน2
      const dearLines = doc.splitTextToSize(dear, 16);
      doc.setFont("THSarabunNew", "normal");
      doc.text(dearLines, 4, y);
      y += dearLines.length * 0.6;

      //นื้อหา1
const firstLineWidth = 13;
const nextLinesWidth = 16;

// ข้อความเต็ม
const aLines = `ด้วยข้าพเจ้า ${requesting_name} ตำแหน่ง${requesting_position} สังกัด${requesting_part} ประสงค์ขออนุญาตเดินทางไปราชการเพื่อ${YDUGO} เรื่อง${project} ณ ${at} ในงวันที่ ${thai_datepicker2} ถึงวันที่ ${thai_datepicker3} ดังเอกสารแนบต้นเรื่อง(ถ้ามี) และขออนุมัติเดินทางในวันที่ ${thai_datepicker4} และเดินทางกลับวันที่ ${thai_datepicker5} พร้อมประมาณการค่าใช้จ่ายในการเดินทางไปราชการดังนี้`;

const linesTemp = doc.splitTextToSize(aLines, firstLineWidth);

const firstLine = linesTemp[0];

const remainingText = aLines.substring(firstLine.length).trim(); // ตัดช่องว่างหน้าออก

// ตัดข้อความส่วนที่เหลือด้วยความกว้าง 16
const remainingLines = doc.splitTextToSize(remainingText, nextLinesWidth);

// รวมกัน
const allLines = [firstLine, ...remainingLines];

let lineY = y;
allLines.forEach((line, index) => {
  const x = index === 0 ? 5.5 : 3;
  doc.text(line, x, lineY);
  lineY += 0.7;
});
lineY += 0.3;
const bLines = `1.ค่าเบี้ยเลี้ยง`;
doc.text(bLines,3,lineY);     
const b1Lines = `เป็นเงิน ${allowanceTotal.toLocaleString()} บาท`;
doc.text(b1Lines,pageWidth-2, lineY, {align: 'right'});
lineY += 0.7;

let mc_1 = document.getElementById("mc_1").value.trim();
if (mc_1) {
  let pc_1 = document.getElementById("pc_1").value.trim() || "0";
  let dc_1= document.getElementById("dc_1").value.trim() || "0";
  doc.text(`ค่าเบี้ยเลี้ยง ${mc_1} บาท จำนวน ${pc_1} คน ระยะเวลา ${dc_1} วัน)`, 5, lineY);
  lineY += 0.7;
}
let mc_2 = document.getElementById("mc_2").value.trim();
if (mc_2) {
  let pc_2 = document.getElementById("pc_2").value.trim() || "0";
  let dc_2= document.getElementById("dc_2").value.trim() || "0";
  doc.text(`ค่าเบี้ยเลี้ยง ${mc_2} บาท จำนวน ${pc_2} คน ระยะเวลา ${dc_2} วัน)`, 5, lineY);
  lineY += 0.7;
}
lineY += 0.3;


const cLines = `2.ค่าที่พัก  ${document.querySelector('input[name="fav_language"]:checked')?.value || ''}`;
doc.text(cLines,3,lineY);     
const c1Lines = `เป็นเงิน ${document.getElementById("result_2").textContent} บาท`
doc.text(c1Lines,pageWidth-2, lineY, {align: 'right'});
lineY += 0.7;

const Accommodation_Costrows = document.querySelectorAll("#accommodation .all");
Accommodation_Costrows.forEach((row) => {
  const accommodation_cost = row.querySelector(".accommodation_cost")?.value.trim() || "0";
  const accommodation_person = row.querySelector(".accommodation_person")?.value.trim() || "0";
  const accommodation_day = row.querySelector(".accommodation_day")?.value.trim() || "0";
  
  // ถ้ามีค่าใดค่าหนึ่งไม่เป็นศูนย์ ค่อยพิมพ์
  if (accommodation_cost !== "0" || accommodation_person !== "0" || accommodation_day !== "0") {
    doc.text(`ค่าที่พักราคา ${accommodation_cost} บาท จำนวน ${accommodation_person} ห้อง ระยะเวลา ${accommodation_day} วัน`, 5, lineY);
    lineY += 0.7;
  }
});
lineY += 0.3;




// ดึง checkbox ที่ถูกติ๊ก
const checkboxes = document.querySelectorAll('input[name="topicT"]:checked');
const selected = Array.from(checkboxes).map(cb => cb.value);

// แสดงใน PDF
doc.text(`3. ค่าพาหนะ`, 3, lineY);
doc.text(`เป็นเงิน ${totald} บาท`,pageWidth-2, lineY, {align: 'right'}); 
doc.text(`(`,5.1,lineY);
let checkboxX = 5.2; // จุดเริ่มแสดงค่า checkbox
selected.forEach((value, index) => {
  const text = ` ${value}`;
  doc.text(text, checkboxX, lineY);

  // คำนวณความกว้างของข้อความ แล้วเว้นระยะถัดไป
  const textWidth = doc.getTextWidth(text);
  checkboxX += textWidth + 0.5; // เว้นห่างระหว่างคำ
});
doc.text(`)`,(checkboxX - 0.4 ),lineY);
lineY += 0.7;

const dLines = `หมายเลขทะเบียน ${vehicle_number} โดยมี ${driver} เป็นพนักงานขับรถ`;
if (vehicle_number && driver) {
  const dlines1 = doc.splitTextToSize(dLines, 15);
  doc.text(dlines1, 4, lineY);
  lineY += 0.7;
}
const dLines2 = `ระยะทาง ${distance} กิโลเมตร`;
doc.text(dLines2,4, lineY)
lineY += 0.7;

const eLines1  = `4.ค่าพาหนะรับจ้าง`;
doc.text(eLines1,3, lineY)
doc.text(`เป็นเงิน ${vehicles_cost.toLocaleString()} บาท`,pageWidth-2, lineY, {align: 'right'});
lineY += 0.7;

const rows = document.querySelectorAll("#Hired-vehicles_detail .vehicles");
rows.forEach((row) => {
  const detailInput = row.querySelector(".vehicles_detail");
  const costInput = row.querySelector(".vehicles_cost");
  const detail = detailInput?.value.trim() || "";
  const cost = costInput?.value.trim() || "";
  if (detail || cost) {
    doc.text(`ค่า ${detail} เป็นเงิน ${cost} บาท`,5, lineY);
    lineY += 0.7;
  }
});
lineY += 0.3;

const fLines1  = `5.ค่าลงทะเบียน`;
doc.text(fLines1,3, lineY)
doc.text(`เป็นเงิน ${Registration_fee.toLocaleString()} บาท`,pageWidth-2, lineY, {align: 'right'});
lineY += 0.7;

const rows1 = document.querySelectorAll("#Registration_fee_detail .fee_detail");
rows1.forEach((row) => {
  const detailInput = row.querySelector(".Registration_fee_detail");
  const costInput = row.querySelector(".Registration-fee");
  const detail = detailInput?.value.trim() || "";
  const cost = costInput?.value.trim() || "";
  if (detail || cost) {
    doc.text(`ค่า ${detail} เป็นเงิน ${cost} บาท`,5, lineY);
    lineY += 0.7;
  }
});
lineY += 0.3;


const gLines1  = `6.ค่าใช้จ่ายอื่นๆที่จำเป็นในการเดินทางไปราชการ`;
doc.text(gLines1,3, lineY)
doc.text(`เป็นเงิน ${other_cost.toLocaleString()} บาท`,pageWidth-2, lineY, {align: 'right'});
lineY += 1;

const rows2 = document.querySelectorAll("#other-cost_detail .other_cost");
rows2.forEach((row,index) => {
  const detailInput = row.querySelector(".Other-cost_detail");
  const costInput = row.querySelector(".otherCost");
  const detail = detailInput?.value.trim() || "";
  const cost = costInput?.value.trim() || "";
  console.log(`Row ${index + 1}:`, detail, cost);
  if (detail || cost ) {
    doc.text(`ค่า ${detail} เป็นเงิน ${cost} บาท`,5, lineY);
    lineY += 0.7;
  }
});
lineY += 0.3;


doc.text(`รวมค่าใช้จ่ายเป็นเวงินประมาณ ${all_cost.toLocaleString()} บาท`,pageWidth-2, lineY, {align: 'right'});
lineY += 0.7;
doc.text(`(${numberToThaiText(all_cost)})`,pageWidth-2, lineY, {align: 'right'});
lineY += 1;

groupHeight = 3.1;
lineY = checkAddPageGroup(doc, lineY, groupHeight);
const text1 = "ลงชื่อ...............................................ผู้ขอรับเงิน";
const marginLeft = 10.75;
const marginRight = 0.5;
const pageWidthForSignature = doc.internal.pageSize.getWidth();
const rangeWidth = pageWidthForSignature - marginLeft - marginRight;
const centerX = marginLeft + rangeWidth / 2;
doc.text(text1, centerX, lineY, { align: 'center' });
lineY+= 0.7;
const text2_1 = `${document.getElementById("requesting_name").value}`;
doc.text(text2_1, centerX-0.3, lineY, { align: 'center' });
lineY+= 0.7;
const text3_1 = `${document.getElementById("requesting_position").value}`;
doc.text(text3_1, centerX-0.3, lineY, { align: 'center' });
lineY+= 1;

groupHeight = 7.3;
lineY = checkAddPageGroup(doc, lineY, groupHeight);
const last_paragraph = `โดยเบิกจ่าายจากงบประมาณรายได้คณะวิศวกรรมศาสตร์ปี................หมวดเงินใช้สอยรหัส...............................เป็นเงิน ${all_cost.toLocaleString()} บาท (${numberToThaiText(all_cost)})`
const last = doc.splitTextToSize(last_paragraph, 16);
doc.text(last,3, lineY);
lineY += 1.4;
doc.text(`ความคิดเห็นจาก งานการเงินบัญชี/งานบุคคลฯ/หัวหน้ากลุมงานฯ.......................................................................`,3, lineY);
lineY += 0.7;
doc.text(`ความเห็นจาก หัวหน้าสำนักงานเลขานุการ............................................................................................................`,3, lineY);
lineY += 0.7;
doc.text(`ความเห็นจาก หัวหน้าสำนักวิชาฯ/หัวหน้าส่วนงานฯ.............................................................................................`,3, lineY);
lineY += 0.7;
doc.text(`ความเห็นจาก รองคณบดีคณะวิศวกรรมศาสตร์ ฝ่ายบริหารฯ...............................................................................`,3, lineY);
lineY += 0.7;
doc.text(`ความเห็นจาก คณบดีคณะวิศวกรรมศาสตร์  ( )อนุมัติ      ( )ไม่อนุมัติ`,3, lineY);
lineY += 1;

doc.text(`ลงชื่อ..............................................ผู้อนุมัติ`,pageWidth-2, lineY, {align: 'right'});
lineY += 0.7;
doc.text(`(..............................................)`,pageWidth-3, lineY, {align: 'right'});
lineY += 0.7;


doc.addPage();

    // เตรียมข้อมูลจาก input
    const entries = document.querySelectorAll(".entry12");
    const data = [];

    entries.forEach(entry => {
      const name = entry.querySelector("input[name^='name_']").value;
      const dept = entry.querySelector("input[name^='position_']").value;
      const pos = entry.querySelector("input[name^='department_']").value;
      data.push([name, pos, dept]);
    });

    // สร้างตารางในหน้าแรก
    doc.setFont("THSarabunNew", "bold");
    doc.setFontSize(26);
    doc.text("รายชื่อผู้ร่วมเดินทาง", pageWidth/2, 2.5, {align:'center'});
    doc.setFont("THSarabunNew", "normal");
    doc.setFontSize(16);
    doc.autoTable({
      head: [['ชื่อ-นามสกุล', 'ตำแหน่ง', 'หน่วยงาน']],
      body: data,
      startY: 3,
      theme: 'grid',
      styles: {
        font: 'THSarabunNew',
        fontSize: 14,
        halign: 'center',
        valign: 'middle',
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
doc.save("document.pdf");
}








function numberToThaiText(number) {
  const numberText = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const positionText = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  if (isNaN(number)) return "ไม่ใช่ตัวเลข";

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

function checkAddPageGroup(doc, lineY, groupHeight) {
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 2; // สมมติขอบล่าง
  if (lineY + groupHeight > pageHeight - marginBottom) {
    doc.addPage();
    return 2.5; // สมมติระยะห่างบนหน้ากระดาษใหม่ (margin top)
  }
  return y;
}


