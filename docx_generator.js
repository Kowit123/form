// Import docx library
// Make sure to include: <script src="https://unpkg.com/docx@8.2.3/build/index.js"></script>

async function generateDOCX() {
  // Check if docx library is available in different possible locations
  let docxLib = null;
  
  if (typeof docx !== 'undefined') {
    docxLib = docx;
    console.log('Using global docx object');
  } else if (typeof window.docx !== 'undefined') {
    docxLib = window.docx;
    console.log('Using window.docx object');
  } else {
    console.error('docx library is not loaded. Please check the script tag.');
    console.log('Available global objects:', Object.keys(window).filter(key => key.includes('docx')));
    alert('เกิดข้อผิดพลาด: ไม่สามารถโหลดไลบรารี docx ได้ กรุณารีเฟรชหน้าเว็บและลองใหม่อีกครั้ง');
    return;
  }

  const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, PageBreak } = docxLib;

  // Check if TH Sarabun New fonts are available
  if (typeof THSarabunNew_normal === 'undefined' || typeof THSarabunNew_bold === 'undefined') {
    console.error('TH Sarabun New fonts are not loaded. Please check the font script tags.');
    alert('เกิดข้อผิดพลาด: ไม่สามารถโหลดฟอนต์ TH Sarabun New ได้ กรุณารีเฟรชหน้าเว็บและลองใหม่อีกครั้ง');
    return;
  }

  // Get form data
  const agency = document.getElementById("agency").value;
  const bookNum = document.getElementById("bookNum").value;
  const datepicker1 = document.getElementById("thai-datepicker1").value;
  const topic = document.getElementById("topic").value;
  const dear = document.getElementById("dear").value;
  const requesting_name = document.getElementById("requesting_name").value;
  const requesting_position = document.getElementById("requesting_position").value;
  const requesting_part = document.getElementById("requesting_part").value;
  const project = document.getElementById("project").value;
  const at = document.getElementById("at").value;
  const thai_datepicker2 = document.getElementById("thai-datepicker2").value;
  const thai_datepicker3 = document.getElementById("thai-datepicker3").value;
  const thai_datepicker4 = document.getElementById("thai-datepicker4").value;
  const thai_datepicker5 = document.getElementById("thai-datepicker5").value;

  const accommodationTotal = window.accommodationTotal || 0;
  const vehicles_cost = window.vehicles_cost || 0;
  const Registration_fee = window.Registration_fee || 0;
  const other_cost = window.other_cost || 0;
  const all_cost = window.all_cost || 0;

  // Helper function to convert number to Thai text
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

    let segments = [];
    while (integerPart.length > 0) {
      segments.unshift(integerPart.slice(-6));
      integerPart = integerPart.slice(0, -6);
    }

    segments.forEach((seg, index) => {
      seg = parseInt(seg).toString();
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

  // Helper function to convert base64 string to Uint8Array
  function base64ToUint8Array(base64String) {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // Helper function to create TextRun with TH Sarabun New font
  function createThaiTextRun(text, options = {}) {
    return new TextRun({
      text: text,
      font: "TH Sarabun New",
      size: options.size || 32, // 16pt = 32 half-points
      bold: options.bold || false,
      ...options
    });
  }

  // Helper function to create paragraph with Thai distributed alignment
  function createThaiParagraph(children, options = {}) {
    return new Paragraph({
      children: children,
      alignment: options.alignment || AlignmentType.JUSTIFIED, // Thai distributed alignment
      ...options
    });
  }

  // Create document sections
  const sections = [];

  // Main document content
  const mainContent = [
    // Header
    createThaiParagraph([
      createThaiTextRun("บันทึกข้อความ", { bold: true, size: 48 }),
    ], { alignment: AlignmentType.CENTER, spacing: { after: 400 } }),

    // Agency
    createThaiParagraph([
      createThaiTextRun("ส่วนราชการ", { bold: true }),
      createThaiTextRun(` ${agency}`),
    ]),

    // Document number and date
    createThaiParagraph([
      createThaiTextRun("ที่", { bold: true }),
      createThaiTextRun(` ${bookNum}`),
      createThaiTextRun("                    วันที่", { bold: true }),
      createThaiTextRun(` ${datepicker1}`),
    ]),

    // Topic
    createThaiParagraph([
      createThaiTextRun("เรื่อง", { bold: true }),
      createThaiTextRun(` ${topic}`),
    ]),

    // Dear
    createThaiParagraph([
      createThaiTextRun("เรียน", { bold: true }),
      createThaiTextRun(` ${dear}`),
    ], { spacing: { after: 400 } }),

    // Main content
    createThaiParagraph([
      createThaiTextRun(`ด้วยข้าพเจ้า ${requesting_name} ตำแหน่ง${requesting_position} สังกัด${requesting_part} ประสงค์ขออนุญาตเดินทางไปราชการเพื่อ ${document.querySelector('input[name="qqe"]:checked')?.value || ''} เรื่อง${project} ณ ${at} ในวันที่ ${thai_datepicker2} ถึงวันที่ ${thai_datepicker3} ดังเอกสารแนบต้นเรื่อง(ถ้ามี) และขออนุมัติเดินทางในวันที่ ${thai_datepicker4} และเดินทางกลับวันที่ ${thai_datepicker5} พร้อมประมาณการค่าใช้จ่ายในการเดินทางไปราชการดังนี้`),
    ], { spacing: { after: 400 } }),

    // Allowance section
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [createThaiParagraph([createThaiTextRun("1. ค่าเบี้ยเลี้ยง", { bold: true })])],
            }),
            new TableCell({
              children: [createThaiParagraph([createThaiTextRun(`รวมเป็นเงิน ${allowanceTotal.toLocaleString()} บาท`)], { alignment: AlignmentType.RIGHT })],
            }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: "none", size: 0, color: "FFFFFF" },
        bottom: { style: "none", size: 0, color: "FFFFFF" },
        left: { style: "none", size: 0, color: "FFFFFF" },
        right: { style: "none", size: 0, color: "FFFFFF" },
        insideHorizontal: { style: "none", size: 0, color: "FFFFFF" },
        insideVertical: { style: "none", size: 0, color: "FFFFFF" },
      },
    }),

    // Accommodation section
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [createThaiParagraph([createThaiTextRun(`2. ค่าที่พัก ${document.querySelector('input[name="fav_language"]:checked')?.value || ''}`, { bold: true })])],
            }),
            new TableCell({
              children: [createThaiParagraph([createThaiTextRun(`รวมเป็นเงิน ${document.getElementById("result_2").textContent} บาท`)], { alignment: AlignmentType.RIGHT })],
            }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: "none", size: 0, color: "FFFFFF" },
        bottom: { style: "none", size: 0, color: "FFFFFF" },
        left: { style: "none", size: 0, color: "FFFFFF" },
        right: { style: "none", size: 0, color: "FFFFFF" },
        insideHorizontal: { style: "none", size: 0, color: "FFFFFF" },
        insideVertical: { style: "none", size: 0, color: "FFFFFF" },
      },
    }),

    // Transportation section
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [createThaiParagraph([createThaiTextRun("3. ค่าพาหนะ", { bold: true })])],
            }),
            new TableCell({
              children: [createThaiParagraph([createThaiTextRun(`รวมเป็นเงิน ${document.getElementById("Transportation_expenses_result").textContent.trim() || "0"} บาท`)], { alignment: AlignmentType.RIGHT })],
            }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: "none", size: 0, color: "FFFFFF" },
        bottom: { style: "none", size: 0, color: "FFFFFF" },
        left: { style: "none", size: 0, color: "FFFFFF" },
        right: { style: "none", size: 0, color: "FFFFFF" },
        insideHorizontal: { style: "none", size: 0, color: "FFFFFF" },
        insideVertical: { style: "none", size: 0, color: "FFFFFF" },
      },
    }),

    // Registration fee section
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [createThaiParagraph([createThaiTextRun("4. ค่าลงทะเบียน", { bold: true })])],
            }),
            new TableCell({
              children: [createThaiParagraph([createThaiTextRun(`รวมเป็นเงิน ${Registration_fee.toLocaleString()} บาท`)], { alignment: AlignmentType.RIGHT })],
            }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: "none", size: 0, color: "FFFFFF" },
        bottom: { style: "none", size: 0, color: "FFFFFF" },
        left: { style: "none", size: 0, color: "FFFFFF" },
        right: { style: "none", size: 0, color: "FFFFFF" },
        insideHorizontal: { style: "none", size: 0, color: "FFFFFF" },
        insideVertical: { style: "none", size: 0, color: "FFFFFF" },
      },
    }),

    // Other costs section
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [createThaiParagraph([createThaiTextRun("5. ค่าใช้จ่ายอื่นๆ", { bold: true })])],
            }),
            new TableCell({
              children: [createThaiParagraph([createThaiTextRun(`รวมเป็นเงิน ${other_cost.toLocaleString()} บาท`)], { alignment: AlignmentType.RIGHT })],
            }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: "none", size: 0, color: "FFFFFF" },
        bottom: { style: "none", size: 0, color: "FFFFFF" },
        left: { style: "none", size: 0, color: "FFFFFF" },
        right: { style: "none", size: 0, color: "FFFFFF" },
        insideHorizontal: { style: "none", size: 0, color: "FFFFFF" },
        insideVertical: { style: "none", size: 0, color: "FFFFFF" },
      },
    }),

    // Total cost
    createThaiParagraph([
      createThaiTextRun(`รวมค่าใช้จ่ายเป็นเงินประมาณ ${all_cost.toLocaleString()} บาท`),
    ], { alignment: AlignmentType.RIGHT }),

    createThaiParagraph([
      createThaiTextRun(`(${numberToThaiText(all_cost)})`),
    ], { alignment: AlignmentType.RIGHT, spacing: { after: 400 } }),

    // Conclusion
    createThaiParagraph([
      createThaiTextRun("จึงเรียนมาเพื่อโปรดพิจารณา"),
    ], { spacing: { after: 600 } }),

    // Signature
    createThaiParagraph([
      createThaiTextRun("ลงชื่อ...............................................ผู้ขอรับเงิน"),
    ], { alignment: AlignmentType.CENTER }),

    createThaiParagraph([
      createThaiTextRun(requesting_name),
    ], { alignment: AlignmentType.CENTER }),

    createThaiParagraph([
      createThaiTextRun(requesting_position),
    ], { alignment: AlignmentType.CENTER, spacing: { after: 600 } }),

    // Financial section
    createThaiParagraph([
      createThaiTextRun("ความเห็นงานการเงินโดยเบิกจ่ายจาก (  )เงินงบประมาณแผ่นดิน (  )งบประมาณเงินรายได้ (  )เงินรับฝาก"),
    ]),

    createThaiParagraph([
      createThaiTextRun(`หมวดรายจ่าย..............................รหัสงบประมาณ..............................จำนวนเงิน ${document.getElementById("GrandTotal").textContent} บาท`),
    ]),

    createThaiParagraph([
      createThaiTextRun(`จำนวนเงิน(ตัวอักษร) ${numberToThaiText(all_cost)}`),
    ]),

    // Approval sections
    createThaiParagraph([
      createThaiTextRun("ความเห็นจาก งานการเงินบัญชี/งานบุคคลฯ/หัวหน้ากลุมงานฯ......................................................................"),
    ]),

    createThaiParagraph([
      createThaiTextRun("ความเห็นจาก หัวหน้าสำนักงานเลขานุการฯ........................................................................................................"),
    ]),

    createThaiParagraph([
      createThaiTextRun("ความเห็นจาก หัวหน้าสำนักวิชาฯ/หัวหน้าส่วนงานฯ............................................................................................"),
    ]),

    createThaiParagraph([
      createThaiTextRun("ความเห็นจาก รองคณบดีคณะวิศวกรรมศาสตร์ ฝ่ายบริหารฯ.............................................................................."),
    ]),

    createThaiParagraph([
      createThaiTextRun("ความเห็นจาก คณบดีคณะวิศวกรรมศาสตร์  (  )อนุมัติ     (  )ไม่อนุมัติ"),
    ]),

    createThaiParagraph([
      createThaiTextRun("ลงชื่อ..............................................ผู้อนุมัติ"),
    ], { alignment: AlignmentType.RIGHT }),

    createThaiParagraph([
      createThaiTextRun("(..............................................)"),
    ], { alignment: AlignmentType.RIGHT }),
  ];

  sections.push(...mainContent);

  // Add participants table if needed
  const entryCount1 = document.querySelectorAll(".entry12").length;
  if (entryCount1 > 1) {
    sections.push(
      new Paragraph({
        children: [new PageBreak()],
      }),
      createThaiParagraph([
        createThaiTextRun("รายชื่อผู้ร่วมเดินทาง", { bold: true, size: 48 }),
      ], { alignment: AlignmentType.CENTER, spacing: { after: 400 } })
    );

    // Create participants table
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [createThaiParagraph([createThaiTextRun("ชื่อ-นามสกุล", { bold: true })])],
            width: { size: 33, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [createThaiParagraph([createThaiTextRun("ตำแหน่ง", { bold: true })])],
            width: { size: 33, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [createThaiParagraph([createThaiTextRun("หน่วยงาน", { bold: true })])],
            width: { size: 34, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
    ];

    // Add participant data
    const entries = document.querySelectorAll(".entry12");
    entries.forEach(entry => {
      const name = entry.querySelector("input[name^='name_']").value;
      const pos = entry.querySelector("input[name^='position_']").value;
      const dept = entry.querySelector("input[name^='department_']").value;
      
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [createThaiParagraph([createThaiTextRun(name)])],
            }),
            new TableCell({
              children: [createThaiParagraph([createThaiTextRun(pos)])],
            }),
            new TableCell({
              children: [createThaiParagraph([createThaiTextRun(dept)])],
            }),
          ],
        })
      );
    });

    sections.push(
      new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        rows: tableRows,
      })
    );
  }

  // Add personal car approval page if needed
  const checkbox = document.getElementById('personal_car');
  if (checkbox && checkbox.checked) {
    sections.push(
      new Paragraph({
        children: [new PageBreak()],
      }),
      createThaiParagraph([
        createThaiTextRun("บันทึกข้อความ", { bold: true, size: 32 }),
      ], { alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
      createThaiParagraph([
        createThaiTextRun("ส่วนราชการ", { bold: true }),
        createThaiTextRun(" คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม โทรศัพท์ 043-754316  ภายใน 3007"),
      ]),
      createThaiParagraph([
        createThaiTextRun("ที่", { bold: true }),
        createThaiTextRun(" อว 0605.14/............"),
        createThaiTextRun("                    วันที่", { bold: true }),
        createThaiTextRun(` ${datepicker1}`),
      ]),
      createThaiParagraph([
        createThaiTextRun("เรื่อง", { bold: true }),
        createThaiTextRun(" ขออนุมัติเดินทางไปราชการโดยรถยนต์ส่วนบุคคล"),
      ]),
      createThaiParagraph([
        createThaiTextRun("เรียน", { bold: true }),
        createThaiTextRun(" คณบดีคณะวิศวกรรมศาสตร์"),
      ], { spacing: { after: 400 } }),
      createThaiParagraph([
        createThaiTextRun(`ด้วยข้าพเจ้า ${requesting_name} ตำแหน่ง${requesting_position} สังกัด${requesting_part} ประสงค์ขออนุญาตเดินทางไปราชการเพื่อ ${document.querySelector('input[name="qqe"]:checked')?.value || ''} เรื่อง${project} ณ ${at} ระหว่างวันที่ ${thai_datepicker2} ถึงวันที่ ${thai_datepicker3} ตามเอกสารแนบนั้น จึงขออนุมัติเดินทางไปราชการ ระหว่างวันที่ ${thai_datepicker4} ถึงวันที่ ${thai_datepicker5} เนื่องจาก ${document.getElementById("reason_personal_car_").value}`),
      ], { spacing: { after: 400 } }),
      createThaiParagraph([
        createThaiTextRun("ดังนั้นจึงขออนุมัติงบประมาณในการเดินทางดังต่อไปนี้"),
      ], { spacing: { after: 400 } }),
      createThaiParagraph([
        createThaiTextRun("ลงชื่อ....................................................ผู้ขอรับเงิน"),
      ], { alignment: AlignmentType.CENTER }),
      createThaiParagraph([
        createThaiTextRun(requesting_name),
      ], { alignment: AlignmentType.CENTER }),
      createThaiParagraph([
        createThaiTextRun(requesting_position),
      ], { alignment: AlignmentType.CENTER, spacing: { after: 400 } })
    );
  }

  // Create document with TH Sarabun New font
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: {
            width: 11906, // A4 width in twips
            height: 16838, // A4 height in twips
          },
          margin: {
            top: 1440, // 1 inch
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      },
      children: sections,
    }],
    styles: {
      default: {
        document: {
          run: {
            font: "TH Sarabun New",
            size: 32, // 16pt = 32 half-points
          },
        },
      },
    },
    fonts: [
      {
        name: "TH Sarabun New",
        family: "TH Sarabun New",
        type: "normal",
        data: base64ToUint8Array(THSarabunNew_normal),
      },
      {
        name: "TH Sarabun New",
        family: "TH Sarabun New",
        type: "bold",
        data: base64ToUint8Array(THSarabunNew_bold),
      },
    ],
  });

  // Generate and download the document
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'เอกสารขออนุมัติเดินทางไปราชการ.docx';
  link.click();
  window.URL.revokeObjectURL(url);
} 