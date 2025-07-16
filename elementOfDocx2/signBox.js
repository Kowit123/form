function createApprovalSignatureTableFixed(dataLeft, dataRight) {
  const cmToTwip = (cm) => Math.round(cm * 567); // Helper แปลง cm เป็น twip
  const {
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    VerticalAlign,
    BorderStyle,
  } = window.docx;

  // สร้างข้อความธรรมดาแบบชิดซ้ายหรือกลาง
  const makeParagraph = (text, bold = false, align = "left") =>
    new Paragraph({
      alignment: align,
      children: [
        new TextRun({
          text,
          bold,
          font: "TH Sarabun New",
          size: 32,
        }),
      ],
    });

  // ฝั่งซ้ายของตาราง
  const makeCellLeft = (data) =>
    new TableCell({
      verticalAlign: VerticalAlign.TOP,
      borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
      },
      children: [
        makeParagraph(data.titleLine1, false, "center"),
        makeParagraph(data.titleLine2, false, "center"),
        makeParagraph(data.titleLine3, false, "center"),
        new Paragraph({ spacing: { before: 200 } }), // เว้นระยะก่อนเซ็นชื่อ
        makeParagraph("ลงชื่อ ......................................................", false, "center"),
        makeParagraph(`(..............................................................)`, false, "center"),
        makeParagraph(`ตำแหน่ง..................................................`, false, "center"),
        makeParagraph(`วันที่.........................................................`, false, "center"),
      ],
    });

  // ฝั่งขวาของตาราง
  const makeCellRight = (data) =>
    new TableCell({
      verticalAlign: VerticalAlign.TOP,
      borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
      },
      children: [
        makeParagraph(data.title, false, "center"),
        makeParagraph(data.title1, false, "center"),
        makeParagraph(data.title2, false, "center"),
        makeParagraph(data.title3, false, "center"),
        new Paragraph({ spacing: { before: 350 } }),
        makeParagraph("ลงชื่อ ......................................................", false, "center"),
        makeParagraph(`(..............................................................)`, false, "center"),
        makeParagraph(`ตำแหน่ง..................................................`, false, "center"),
        makeParagraph(`วันที่.........................................................`, false, "center"),
      ],
    });

  // 🔧 สร้างตารางพร้อมขอบและความกว้างคอลัมน์
  return new Table({
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
    width: {
    size: 0,
    type: WidthType.auto
    },
    tableLook: {
    noVBand: true,
    noHBand: true,
    },
    columnWidths: [cmToTwip(8.5), cmToTwip(8.5)], // ตั้งความกว้างเท่ากัน
    rows: [
      new TableRow({
        children: [makeCellLeft(dataLeft), makeCellRight(dataRight)],
      }),
    ],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
      insideVertical: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
    },
    layout: "fixed",
  });
}

function sendApprovalTable(){
    const approvalTable = createApprovalSignatureTableFixed(
  {
    titleLine1: "ได้ตรวจสอบหลักฐานฯ",
    titleLine2: "การเบิกจ่ายเงิน ที่แนบถูกต้องแล้ว",
    titleLine3: "เห็นควรอนุมัติให้เบิกจ่ายได้",
    name: document.getElementById("nrq_re").value, position: document.getElementById("pst_re").value, date: ""
  },
  {
    title: "อนุมัติให้เบิกจ่ายได้",
    title1: "",
    title2: "",
    name: "", position: "", date: ""
  }
);
return approvalTable;

}


function createApprovalSignaturegroup(dataLeft, dataRight) {
  const cmToTwip = (cm) => Math.round(cm * 567); // Helper แปลง cm เป็น twip
  const {
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    VerticalAlign,
    BorderStyle,
    Alignment,
  } = window.docx;

  // สร้างข้อความธรรมดาแบบชิดซ้ายหรือกลาง
  const makeParagraph = (text, bold = false, align = "left") =>
    new Paragraph({
      alignment: align,
      children: [
        new TextRun({
          text,
          bold,
          font: "TH Sarabun New",
          size: 32,
        }),
      ],
    });

  // ฝั่งซ้ายของตาราง
  const makeCellLeft = (data) =>
    new TableCell({
      spacing: {before: cmToTwip(0.5)},
      verticalAlign: VerticalAlign.TOP,
      children: [
        makeParagraph("ลงชื่อ ......................................................ผู้รับเงิน", false, "center"),
        makeParagraph(`(${data.name || ".........................................................................."})`, false, "center"),
        makeParagraph(`ตำแหน่ง ${data.position || "............................................................"}`, false, "center"),
        makeParagraph(`วันที่ ${data.date || "..................................................................."}`, false, "center"),
      ],
    });

  // ฝั่งขวาของตาราง
  const makeCellRight = (data) =>
    new TableCell({
      spacing: {before: cmToTwip(0.5)},
      verticalAlign: VerticalAlign.TOP,
      children: [
        makeParagraph("ลงชื่อ ......................................................ผู้จ่ายเงิน", false, "center"),
        makeParagraph(`(${data.name || "............................................................................"})`, false, "center"),
        makeParagraph(`ตำแหน่ง ${data.position || "..............................................................."}`, false, "center"),
        makeParagraph(`วันที่ ${data.date || "....................................................................."}`, false, "center"),
      ],
    });

  // 🔧 สร้างตารางพร้อมขอบและความกว้างคอลัมน์
  return new Table({
    spacing: {before: cmToTwip(0.5)},
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 200, bottom: 200, left: 200, right: 200 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: "ffffff" },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: "ffffff" },
      left: { style: BorderStyle.SINGLE, size: 8, color: "ffffff" },
      right: { style: BorderStyle.SINGLE, size: 8, color: "ffffff" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 8, color: "ffffff" },
      insideVertical: { style: BorderStyle.SINGLE, size: 8, color: "ffffff" },
    },
    layout: "fixed",
    width: {
    size: 0,
    type: WidthType.auto
    },
    tableLook: {
    noVBand: true,
    noHBand: true,
    },
    columnWidths: [cmToTwip(8.5), cmToTwip(8.5)], // ตั้งความกว้างเท่ากัน
    rows: [
      new TableRow({
        children: [makeCellLeft(dataLeft), makeCellRight(dataRight)],
      }),
    ],
  });
}

function sendSignatureGroup (){
  const signatureGroup = createApprovalSignaturegroup(
{
  name: document.getElementById("nrq_re").value, position: document.getElementById("pst_re").value, date: ""
},
{
  name: "", position: "", date: ""
}
);
return signatureGroup;

}