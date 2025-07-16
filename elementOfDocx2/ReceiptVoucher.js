function generateReceiptVoucherSectionDocx(data) {
  const { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, verticalAlign } = window.docx;

  const children = [];

  const cmToTwip = cm => Math.round(cm * 567); // แปลง cm เป็น twip
  const labelFontSize = 32;

  // ส่วนหัว
  children.push(new Paragraph({
    alignment: "right",
    children: [new TextRun({ text: "ที่ มหาวิทยาลัยมหาสารคาม", font: "TH Sarabun New", size: labelFontSize })]
  }));
  children.push(new Paragraph({
    alignment: "right",
    children: [new TextRun({ text: "(ส่วนราชการเป็นผู้เบิกให้)", font: "TH Sarabun New", size: labelFontSize })]
  }));
  children.push(new Paragraph({
    alignment: "center",
    children: [new TextRun({ text: "ใบสำคัญรับเงิน", font: "TH Sarabun New", bold: true, size: labelFontSize })]
  }));
  children.push(new Paragraph({
    alignment: "center",
    children: [new TextRun({ text: "วันที่ ..................................................", font: "TH Sarabun New", size: labelFontSize })]
  }));

  // ข้อมูลผู้รับเงิน
  children.push(new Paragraph({
    children: [new TextRun({ text: `ข้าพเจ้า ${data.name}`, font: "TH Sarabun New", size: labelFontSize })]
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: `บ้านเลขที่ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม ตำบลขามเรียง อำเภอกันทรวิชัย จังหวัดมหาสารคาม`, font: "TH Sarabun New", size: labelFontSize })]
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: `ได้รับเงินจาก คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม ดังรายการต่อไปนี้`, font: "TH Sarabun New", size: labelFontSize })]
  }));

  // ตาราง
  const headerRow = new TableRow({
    children: ["วัน/เดือน/ปี", "รายละเอียดการจ่ายเงิน", "จำนวนเงิน"].map(h =>
      new TableCell({
        children: [new Paragraph({ alignment: "center", children: [new TextRun({ text: h, bold: true, font: "TH Sarabun New", size: labelFontSize })] })]
      })
    )
  });

const bodyRows = data.tableData.map(row =>
  new TableRow({
    children: row.map(cell => new TableCell({
      verticalAlign: "center", 
      children: [
        new Paragraph({
          alignment: "center", // แนวนอน (horizontal center)
          children: [
            new TextRun({
              text: cell,
              font: "TH Sarabun New",
              size: labelFontSize
            })
          ]
        })
      ]
    }))
  })
);


  const summaryRow = new TableRow({
    children: [
      new TableCell({
        columnSpan: 2,
        children: [new Paragraph({ alignment: "center", children: [new TextRun({ text: "รวมทั้งสิ้น", font: "TH Sarabun New", size: labelFontSize })] })]
      }),
      new TableCell({
        children: [new Paragraph({ alignment: "center", children: [new TextRun({ text: data.totalAmount, font: "TH Sarabun New", size: labelFontSize })] })]
      })
    ]
  });

  const table = new Table({
    rows: [headerRow, ...bodyRows, summaryRow],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  children.push(table);

  // สรุปจำนวนเงินเป็นตัวอักษร
  children.push(new Paragraph({
    spacing: { before: cmToTwip(0.7) },
    children: [
      new TextRun({
        text: `จำนวนเงิน(ตัวอักษร): ${data.totalText}`,
        font: "TH Sarabun New",
        size: labelFontSize
      })
    ]
  }));

  // ลายเซ็น
  children.push(new Paragraph({
    spacing: { before: cmToTwip(1.4) },
    children: [
      new TextRun({ text: "ลงชื่อ ......................................................ผู้รับเงิน", font: "TH Sarabun New", size: labelFontSize }),
      new TextRun({ text: `\t       ลงชื่อ ......................................................ผู้จ่ายเงิน`, font: "TH Sarabun New", size: labelFontSize })
    ]
  }));
  children.push(new Paragraph({
    children: [
      new TextRun({ text: `(..........................................................................)`, font: "TH Sarabun New", size: labelFontSize }),
      new TextRun({ text: `\t       (............................................................................)`, font: "TH Sarabun New", size: labelFontSize })
    ]
  }));
  children.push(new Paragraph({
    children: [
      new TextRun({ text: `ตำแหน่ง............................................................`, font: "TH Sarabun New", size: labelFontSize }),
      new TextRun({ text: `\t       ตำแหน่ง...............................................................`, font: "TH Sarabun New", size: labelFontSize })
    ]
  }));

  return {
    properties: {
      page: { size: { orientation: "portrait" } }
    },
    children
  };
}

function getReceiptInsteadOfBillData2FromDOM() {
  const allSections = document.querySelectorAll('[id^="date-section-"]');
  const tableData = [];

  allSections.forEach((section) => {
    const date = section.querySelector('.date-header input')?.value || 'ไม่ระบุ';
    const entries = section.querySelectorAll('.entries > div');

    entries.forEach((entry) => {
      const inputs = entry.querySelectorAll('input');
      const detail = inputs[1]?.value || '-';
      const amount = inputs[3]?.value
        ? Number(inputs[3].value.replace(/,/g, '')).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '-';

      tableData.push([date, detail, amount]);
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

function sendReceiptVoucherSection(){
const data = getReceiptInsteadOfBillData2FromDOM(); // หรือข้อมูลแยกอีกชุด
const receiptVoucherSection = generateReceiptVoucherSectionDocx(data);
return receiptVoucherSection;
}