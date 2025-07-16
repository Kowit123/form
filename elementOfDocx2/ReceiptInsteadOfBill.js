function generateReceiptInsteadOfBillDOCX(tableData, totalAmount, totalText, meta) {
  const { Paragraph, TextRun, Table, TableRow, TableCell, WidthType } = window.docx;
  const children = [];

  // หัวเรื่อง
  children.push(new Paragraph({
    alignment: "right",
    children: [
      new TextRun({ text: "บก 4231", font: "TH Sarabun New", size: 32 }),
    ]
  }));

  children.push(new Paragraph({
    alignment: "center",
    children: [
      new TextRun({ text: "ใบรับรองแทนใบเสร็จรับเงิน", bold: true, font: "TH Sarabun New", size: 32 }),
    ]
  }));
  children.push(new Paragraph({
    alignment: "center",
    children: [
      new TextRun({ text: "ส่วนราชการ มหาวิทยาลัยมหาสารคาม", font: "TH Sarabun New", size: 32 }),
    ]
  }));

  // สร้างตารางรายการ
  const headerRow = new TableRow({
    children: ["วัน/เดือน/ปี", "รายละเอียดการจ่ายเงิน", "ระยะทาง", "จำนวนเงิน"].map(h =>
      new TableCell({ children: [new Paragraph({  alignment: "center", children: [new TextRun({ text: h, bold: true, font: "TH Sarabun New", size: 32})] })] })
    )
  });

  const bodyRows = tableData.map(row =>
    new TableRow({
      children: row.map(text => new TableCell({
        children: [new Paragraph({  alignment: "center", children: [new TextRun({ text, font: "TH Sarabun New", size: 32 })] })]
      }))
    })
  );

  // Footer รวมเงิน
  const totalRow = new TableRow({
    children: [
      new TableCell({ columnSpan: 3,  alignment: "center", children: [new Paragraph({ alignment: "center", children: [new TextRun({ text: "รวมทั้งสิ้น", font: "TH Sarabun New", size: 32})] })] }),
      new TableCell({ children: [new Paragraph({  alignment: "center", children: [new TextRun({ text: totalAmount, font: "TH Sarabun New", size: 32 })] })] }),
    ]
  });

  const table = new Table({
    rows: [headerRow, ...bodyRows, totalRow],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  children.push(table);

  // บรรทัดท้าย
  children.push(new Paragraph({ children: [new TextRun({ text: `รวมทั้งสิ้น(ตัวอักษร): ${totalText}`, font: "TH Sarabun New", size: 32 })] }));
  children.push(new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: "หมายเหตุ: รถยนต์ส่วนบุคคล เหมาจ่ายกิโลเมตรละ 4 บาท", font: "TH Sarabun New", size: 32 })] }));

  // ถ้ามีข้อมูลรถ
  if (meta.license || meta.driver) {
    let carText = `เดินทางโดย รถยนต์ส่วนบุคคล`;
    if (meta.license) carText += ` หมายเลขทะเบียน ${meta.license}`;
    if (meta.driver) carText += ` โดยมี ${meta.driver} เป็นผู้ขับรถ`;
    children.push(new Paragraph({ children: [new TextRun({ text: carText, font: "TH Sarabun New", size: 32 })] }));
  }

  // ลายเซ็น
  children.push(new Paragraph({spacing: { before: 300 }, children: [new TextRun({ text: `ข้าพเจ้า ${meta.name} ตำแหน่ง ${meta.position}`, font: "TH Sarabun New", size: 32 })] }));
  children.push(new Paragraph({ children: [new TextRun({ text: `สังกัด กอง ${meta.department}`, font: "TH Sarabun New", size: 32 })] }));
  children.push(new Paragraph({ children: [new TextRun({ text: "ขอรับรองว่ารายจ่ายข้างต้นนี้ ไม่อาจเรียกใบเสร็จรับเงินจากผู้รับได้ และข้าพเจ้าได้จ่ายในงานของราชการโดยแท้", font: "TH Sarabun New", size: 32 })] }));

  children.push(new Paragraph({ spacing: { before: 500 }, alignment: "center", children: [new TextRun({ text: "ลงชื่อ....................................................ผู้ขอรับเงิน", font: "TH Sarabun New", size: 32 })] }));
  children.push(new Paragraph({ alignment: "center", children: [new TextRun({ text: `(${meta.name})`, font: "TH Sarabun New", size: 32 })] }));
  children.push(new Paragraph({ alignment: "center", children: [new TextRun({ text: `ตำแหน่ง ${meta.position}`, font: "TH Sarabun New", size: 32 })] }));

  return {
    properties: {
      page: { size: { orientation: "portrait" } }
    },
    children
  };
}

function getReceiptInsteadOfBillDataFromDOM() {
  const allSections = document.querySelectorAll('[id^="date-section-"]');
  const tableData = [];

  allSections.forEach((section) => {
    const date = section.querySelector('.date-header input')?.value || 'ไม่ระบุ';
    const entries = section.querySelectorAll('.entries > div');

    entries.forEach((entry) => {
      const inputs = entry.querySelectorAll('input');
      const detail = inputs[1]?.value || '-';
      const distance = inputs[2]?.value
        ? Number(inputs[2].value.replace(/,/g, '')).toLocaleString() + ' กม.'
        : '-';
      const amount = inputs[3]?.value
        ? Number(inputs[3].value.replace(/,/g, '')).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '-';

      tableData.push([date, detail, distance, amount]);
    });
  });

  // คำนวณรวมเงินทั้งหมดจาก input id="k"
  const kmTotal = document.getElementById("k")?.textContent || "0";
  const totalAmountNumber = Number(kmTotal.replace(/,/g, ''));

  // ดึงข้อมูลอื่น ๆ จากฟอร์ม
  const name = document.getElementById("nrq_re")?.value || "";
  const position = document.getElementById("pst_re")?.value || "";
  const department = document.getElementById("pt_re")?.value || "";

  // รถยนต์ส่วนตัว
  const personalCarBox = document.getElementById("R_personal_car_box");
  let license = "", driver = "";
  if (personalCarBox && personalCarBox.style.display !== "none") {
    const inputs = personalCarBox.querySelectorAll('input');
    license = inputs[0]?.value?.trim() || "";
    driver = inputs[1]?.value?.trim() || "";
  }

  return {
    tableData,
    totalAmount: totalAmountNumber.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    totalText: numberToThaiText(totalAmountNumber),
    name,
    position,
    department,
    license,
    driver,
  };
}

function sendSectionReceipt(){
const receiptData = getReceiptInsteadOfBillDataFromDOM();
const sectionReceipt = generateReceiptInsteadOfBillDOCX(
  receiptData.tableData,
  receiptData.totalAmount,
  receiptData.totalText,
  receiptData
);
return sectionReceipt;
}