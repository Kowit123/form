function preparePart2TableData(data) {
  const rows = [];
  let totalAllowance = 0;
  let totalAccommodation = 0;
  let totalVehicles = 0;
  let totalOther = 0;
  let grandTotal = 0;

  data.participants_F2.forEach((person, index) => {
    const allowance = person.allowance || 0;
    const accommodation = person.accommodation || 0;
    const vehicles = person.vehicles || 0;
    const other = person.other || 0;
    const total = person.total || (allowance + accommodation + vehicles + other);

    totalAllowance += allowance;
    totalAccommodation += accommodation;
    totalVehicles += vehicles;
    totalOther += other;
    grandTotal += total;

    const row = [
      index + 1,
      person.name,
      person.position,
      allowance.toLocaleString(),
      accommodation.toLocaleString(),
      vehicles.toLocaleString(),
      other.toLocaleString(),
      total.toLocaleString(),
      "", "", ""
    ];

    rows.push(row);
  });

  const summary = [
    totalAllowance.toLocaleString(),
    totalAccommodation.toLocaleString(),
    totalVehicles.toLocaleString(),
    totalOther.toLocaleString(),
    grandTotal.toLocaleString()
  ];

  return { rows, summary };
}



function createCell(text, options = {}) {
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, VerticalAlign, ImageRun } = window.docx;
  return new TableCell({
    ...options,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text.toString(),
            font: "TH Sarabun New",
            size: 28
          })
        ],
        alignment: options?.alignment || "center"
      })
    ]
  });
}

function generatePart2Table({ rows, summary, contractNumber, contractDate }) {
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, VerticalAlign, ImageRun } = window.docx;
  const tableRows = [];

  // ✅ Header row 1
  tableRows.push(new TableRow({
    children: [
    createCell("ลำดับ", { rowSpan: 2, width: { size: 500, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER }),
    createCell("ชื่อ - นามสกุล", { rowSpan: 2, width: { size: 2700, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER}), 
    createCell("ตำแหน่ง", { rowSpan: 2, width: { size: 2000, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER }),         
    createCell("ค่าใช้จ่าย", { columnSpan: 4 }),
    createCell("รวม", { rowSpan: 2, width: { size: 900, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER }),
    createCell("ลายมือชื่อผู้รับเงิน", { rowSpan: 2, width: { size: 1400, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER }),  
    createCell("วัน เดือน ปี ที่รับเงิน", { rowSpan: 2, width: { size: 1400, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER }), 
    createCell("หมายเหตุ", { rowSpan: 2, width: { size: 1400, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER }) 
    ]
  }));

  // ✅ Header row 2
  tableRows.push(new TableRow({
    children: [
      createCell("ค่าเบี้ยเลี้ยง", { width: { size: 900, type: WidthType.DXA }}),
      createCell("ค่าเช่าที่พัก", { width: { size: 900, type: WidthType.DXA }}),
      createCell("ค่าพาหนะ", { width: { size: 900, type: WidthType.DXA }}),
      createCell("ค่าใช้จ่ายอื่น", { width: { size: 900, type: WidthType.DXA }})
    ]
  }));

  // ✅ Body
  rows.forEach(rowData => {
    const cells = rowData.map(text => createCell(text));
    tableRows.push(new TableRow({ children: cells }));
  });

  // ✅ Footer row (รวมเงิน)
  const summaryRow = new TableRow({
    children: [
      createCell("รวมเงิน", { columnSpan: 3, verticalAlign: VerticalAlign.CENTER }),
      ...summary.slice(0, 4).map(val => createCell(val, { alignment: "center" })),
      createCell(summary[4], { alignment: "center" }),
      createCell(`ตามสัญญาเงินยืมเลขที่ ${contractNumber || "................"} วันที่${convertThaiFullDateTo(contractDate) || "................"}`, { columnSpan: 3, alignment: "center" })
    ]
  });
  tableRows.push(summaryRow);

  // ✅ สร้าง table
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    rows: tableRows
  });
}

function generatePart2Section(data) {
const data_f2 = getReportDataFrom2DOM();
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, VerticalAlign, ImageRun } = window.docx;
const children = [];

const makeParagraph = (text, bold = false, align = "right") =>
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

  // ✅ ใส่หัวข้อ Section ทดสอบ
children.push(new Paragraph({
  tabStops: [
    {
      type: "right",
      position: cmToTwip(16.5), // ✅ ปรับให้ตรงกับขอบขวา A4 แนวนอน
    },
  ],
  alignment: "right", // ✅ สำคัญ! ไม่ใช้ center
  children: [
    new TextRun({
      text: "หลักฐานการจ่ายเงินค่าใช้จ่ายในการเดินทางไปราชการ",
      font: "TH Sarabun New",
      bold: true,
      size: 32
    }),
    new TextRun({
      text: "\tส่วนที่ 2", // ✅ ใช้ \t ดันไปขวาสุด
      font: "TH Sarabun New",
      size: 32
    })
  ]
}),
new Paragraph({
  tabStops: [
    {
      type: "right",
      position: cmToTwip(17.5), // ✅ ปรับให้ตรงกับขอบขวา A4 แนวนอน
    },
  ],
  alignment: "right", // ✅ สำคัญ! ไม่ใช้ center
  children: [
    new TextRun({
      text: "ชื่อส่วนราชการ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม จังหวัด มหาสารคาม",
      font: "TH Sarabun New",
      size: 28
    }),
    new TextRun({
      text: "\tแบบ 8708", // ✅ ใช้ \t ดันไปขวาสุด
      font: "TH Sarabun New",
      size: 32
    })
  ]
}),
new Paragraph({
  alignment: "center", // ✅ สำคัญ! ไม่ใช้ center
  children: [
    new TextRun({
      text: `ใบประกอบค่าใช้จ่ายในการเดินทางไปราชการ เรื่อง ${data_f2.subject_F2} ณ ${data_f2.at_F2}`,
      font: "TH Sarabun New",
      size: 28
    }),
  ]
}),
new Paragraph({
  alignment: "center", // ✅ สำคัญ! ไม่ใช้ center
  children: [
    new TextRun({
      text: `ระหว่างวันที่ ${data_f2.TravelDataFrom.goDate} ถึงวันที่ ${data_f2.TravelDataFrom.returnDate} `,
      font: "TH Sarabun New",
      size: 28
    }),
  ]
}),
);

  // ✅ ตาราง
  children.push(generatePart2Table({
    rows: data.rows,
    summary: data.summary,
    contractNumber: data.contractNumber,
    contractDate: data.contractDate
  }));

  children.push(new Paragraph({
    children:[
      new TextRun({text: `จำนวนเงินรวมทั้งสิ้น (ตัวอักษร) ${numberToThaiText(parseNumber(document.getElementById("summary-total").value))}`,   
      font: "TH Sarabun New",
      size: 28})
    ]
  }),
  makeParagraph(""),
  makeParagraph("ลงชื่อ ......................................................ผู้จ่ายเงิน"),
  makeParagraph(`(${data.name || ".........................................................................."})`),
  makeParagraph(`ตำแหน่ง ${data.position || "............................................................."}`),
  makeParagraph(`วันที่ ${data.date || "..................................................................."}`),
);


  return {
    properties: {
      page: { size: { orientation: "landscape" } },
      width: {
      size: 100,
      type: WidthType.PERCENTAGE
      },

    },
    children
  };
}


function sendEachotherCost () {
const data_f2 = getReportDataFrom2DOM();
const { rows, summary } = preparePart2TableData(data_f2);
const sections = [];
if (rows.length > 1) {
  const section2 = generatePart2Section({
    subject: data_f2.subject_F2,
    location: data_f2.at_F2,
    dateStart: data_f2.TravelDataFrom.startDate,
    dateEnd: data_f2.TravelDataFrom.endDate,
    contractNumber: data_f2.con_number,
    contractDate: data_f2.thai_datepicker6,
    totalText: numberToThaiText(summary[4]),
    signName: data_f2.requesting_name_F2,
    signPosition: data_f2.requesting_position_F2,
    rows,
    summary
  });
  sections.push(section2);
}
return sections;
}
