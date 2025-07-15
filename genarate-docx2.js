const { Spacing } = require("docx");
const { Alignment } = require("docx");

async function generateDoc2() {
const data_f2 = getReportDataFrom2DOM();
const mainParagraphs = mainParagraphLineDocx2();
const allowanceParagraphs = sendAllowanceParagraphs_F2();
const accommodationParagraphs = sendAccommodationParagraphs_F2();
const PersonalCarParagraph = sendPersonalCarParagraph_F2();
const reignCarParagraph = sendReignCarParagraph_F2();
const otherCarParagraph = sendOtherCarParagraph_F2();

const katoptanParagraph = sendKatoptanParagraph_F2();
const katoptanTotal = sumKatoptanParagraph();
const otherCostParagraph = sendOtherCostParagraph();

const approvalTable = sendApprovalTable();
//แปลง cm เป็น twip
const cmToTwip = (cm) => Math.round(cm * 567);
const imageData = await loadAndFixImage("./public/img/krut.jpg");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, VerticalAlign, ImageRun } = window.docx;
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
            children:[
                new Paragraph({
                    tabStops: [
                        {
                            type: "right",
                            position: cmToTwip(15.5), // ปรับระยะตามต้องการ
                        },
                    ],
                    children: [
                        new TextRun({ text: "สัญญายืมเงินเลขที่ ", font: "TH Sarabun New", size: 32 }),
                        new TextRun({ text: data_f2.con_number, font: "TH Sarabun New", size: 32 }),
                        new TextRun({ text: "", font: "TH Sarabun New", size: 32 }), // ใช้ tab แทนการเว้นด้วย spacebar
                        new TextRun({ text: "   วันที่ ", font: "TH Sarabun New", size: 32 }),
                        new TextRun({ text: data_f2.thai_datepicker6, font: "TH Sarabun New", size: 32 }),
                        new TextRun({ text: "\t", font: "TH Sarabun New", size: 32 }), // ใช้ tab แทนการเว้นด้วย spacebar
                        new TextRun({ text: "ส่วนที่1", font: "TH Sarabun New", size: 32 }),
                    ],
                }),
                new Paragraph({
                    tabStops: [
                        {
                            type: "right",
                            position: cmToTwip(15.5), // ปรับระยะตามต้องการ
                        },
                    ],
                    children: [
                        new TextRun({ text: "ชื่อผู้ยืม ", font: "TH Sarabun New", size: 32 }),
                        new TextRun({ text: data_f2.Borrower, font: "TH Sarabun New", size: 32 }),  
                        new TextRun({ text: " จำนวนเงิน ", font: "TH Sarabun New", size: 32 }),
                        new TextRun({ text: data_f2.amount_borrow, font: "TH Sarabun New", size: 32 }),
                        new TextRun({ text: "\t", font: "TH Sarabun New", size: 32 }), // ใช้ tab แทนการเว้นด้วย spacebar
                        new TextRun({ text: "แบบ 8708", font: "TH Sarabun New", size: 32 }),  
                    ],
                }),
                new Paragraph({
                    spacing: {before: cmToTwip(0.5)},
                    alignment: 'center',
                    children: [
                        new TextRun({ text: "ใบเบิกค่าใช้จ่ายในการเดินทางไปราชการ ", bold: true, font: "TH Sarabun New", size: 32 }),
                    ],
                }),
                new  Paragraph({
                    alignment: 'right',
                    children: [
                        new TextRun({ text: "ที่ทำการ คณะวิศวกรรมศาสตร์ มมส.", font: "TH SaraBun New", size: 32 }),
                    ]
                }),
                new  Paragraph({
                    alignment: 'right',
                    children: [
                        new TextRun({ text: `วันที่ ${data_f2.thai_datepicker7}`, font: "TH SaraBun New", size: 32 }),
                    ]
                }),
                new  Paragraph({
                    children: [
                        new TextRun({ text: `เรื่อง ขออนุมัติเบิกค่าใช้จ่ายในการเดินทางไปราชการ`, font: "TH SaraBun New", size: 32 }),
                    ]
                }),
                new  Paragraph({
                    spacing: {before: cmToTwip(0.5), after: cmToTwip(0.5)},
                    children: [
                        new TextRun({ text: `เรียน คณบดีคณะวิศวกรรมศาสตร์`, font: "TH SaraBun New", size: 32 }),
                    ]
                }),
                ...mainParagraphs,

                new  Paragraph({
                    children: [
                        new TextRun({ text: `ข้าพเจ้า ขอเบิกค่าใช้จ่ายในการเดินทางไปราชการสำหรับ ${data_f2.radio_F2} ดังน้`, font: "TH SaraBun New", size: 32 }),
                    ]
                }),
            new Paragraph({
                spacing:{
                    before: cmToTwip(0.5),
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
                    text: "\tรวมเป็นเงิน " + `${document.getElementById("Real_GrandTotal_Allowance_Cost").textContent}` + " บาท",
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
                    text: `2.ค่าที่พัก   ${document.querySelector('input[name="radio_re"]:checked')?.value || ''}`,
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                    new TextRun({
                    text: `\tรวมเป็นเงิน ${document.getElementById("Real_GrandTotal_Accommodation_Cost").textContent} บาท`,
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
                    text: `\tรวมเป็นเงิน ${document.getElementById("R_Transportation_expenses_result").textContent} บาท`,
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                ],
            }),
            ...PersonalCarParagraph,
            ...reignCarParagraph,
            ...otherCarParagraph,

            new Paragraph({
                tabStops: [
                    {
                    type: "right",
                    position: cmToTwip(15.5), // ปรับให้ตรงขอบขวา (ขึ้นกับความกว้างหน้ากระดาษ)
                    },
                ],
                children: [
                    new TextRun({
                    text: "4.ค่าตอบแทนพนักงานขับรถ",
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                    new TextRun({
                    text: `\tรวมเป็นเงิน ${katoptanTotal} บาท`,
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
                    text: "5.ค่าใช้จ่ายอื่นๆที่จำเป็นในการเดินทางไปราชการ",
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                    new TextRun({
                    text: `\tรวมเป็นเงิน ${document.getElementById("R_other_cost_result").textContent} บาท`,
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
                text: `รวมทั้งสิ้น ${document.getElementById("R_GrandTotal").textContent} บาท`,
                font: "TH Sarabun New",
                size: 32,
            }),
            ],
            }),
            new Paragraph({
                tabStops: [
                    {
                    type: "right",
                    position: cmToTwip(15.5), // ปรับให้ตรงขอบขวา (ขึ้นกับความกว้างหน้ากระดาษ)
                    },
                ],
                children: [
                    new TextRun({
                    text: "จำนวนเงิน (ตัวอักษร)",
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                    new TextRun({
                    text: `\t${numberToThaiText(window.Grand)}`,
                    font: "TH Sarabun New",
                    size: 32,
                    }),
                ],
            }),

            new Paragraph({
                spacing:{after: cmToTwip(0.5)},
                alignment: "left", //ไม่ มี th distributed 
                indent: {
                    left: cmToTwip(0),                 
                    firstLine:cmToTwip(2.5),  // บรรทัดแรกเยื้องเพิ่มอีก 2.5 = รวม 5.5 ซม.
                },
                children: [
                    new TextRun({
                    text: `ข้าพเจ้าขอรับรองว่ารายการที่กล่าวมาข้างต้นเป็นความจริงและหลักฐานการจ่าย ที่ส่งมาด้วย`,                    
                    font: "TH Sarabun New",
                    size: 32,
                    font: "TH Sarabun New",
                    size: 32, // = 16pt
                    }),
                    new TextRun({
                    text: `จำนวน...........ฉบับ รวมทั้งจำนวนเงินที่ขอเบิกถูกต้องตามกฎหมายทุกประการ`,
                    font: "TH Sarabun New",
                    size: 32,
                    font: "TH Sarabun New",
                    size: 32, // = 16pt
                    })
                ]
            }),
            //กล่องเซ็นชื่อ
            new Table({
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
                            text: data_f2.requesting_name_F2,
                            font: "TH Sarabun New",
                            size: 32,
                            }),
                        ],
                        }),
                        new Paragraph({
                        alignment: "center",
                        children: [
                            new TextRun({
                            text: data_f2.requesting_position_F2,
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
            }),
            ],
        },
        {
        children: [
            approvalTable,
            new Paragraph({
                spacing: {before: cmToTwip(0.2)},
                children: [
                    new TextRun({
                        text: `ได้รับเงินค่าใช้จ่ายในการเดินทางไปราชการ จำนวนเงิน ${document.getElementById("R_GrandTotal").textContent} บาท (${numberToThaiText(window.Grand)}) ไว้เป็นการถูกต้องแล้ว`,
                        font: "TH Sarabun New", 
                        size: 32
                    }),
                ]
            }),
            sendSignatureGroup(),
            new Paragraph({
                spacing: {before: cmToTwip(0.2)},
                children: [
                    new TextRun({
                        text: `จากสัญญายืมเงินเลขที่ ${data_f2.con_number}   วันที่ ${data_f2.thai_datepicker6}`,
                        font: "TH Sarabun New", 
                        size: 32
                    }),
                ]
            }),
            new Paragraph({
                spacing: {before: cmToTwip(0.2)},
                children: [
                    new TextRun({
                        text: `หมายเหตุ: ${data_f2.note_F2 || "............................................................................................................................................................................................................................................................................................................................................................"}`,
                       font: "TH Sarabun New", 
                        size: 32
                    }),
                ]
            }), 
            new Paragraph({
            spacing: { before: cmToTwip(0.5) },
            children: [
                new TextRun({
                text: "คำชี้แจง",
                bold: true,
                font: "TH Sarabun New",
                size: 32,
                }),
            ],
            }),
            new Paragraph({
            children: [
                new TextRun({
                text: "1. กรณีเดินทางเป็นหมู่คณะและจัดทำใบเบิกค่าใช้จ่ายรวมฉบับเดียวกัน หากระยะเวลาในการเริ่มต้น และสิ้นสุดการเดินทางของแต่ละบุคคลแตกต่างกัน ให้แสดงรายละเอียดของวันเวลาที่แตกต่างกัน ของบุคคลนั้นในช่องหมายเหตุ",
                font: "TH Sarabun New",
                size: 28,
                }),
            ],
            }),
            new Paragraph({
            children: [
                new TextRun({
                text: "2. กรณียื่นขอเบิกเงินค่าใช้จ่ายรายบุคคล ให้ผู้ขอรับเงินเป็นผู้ลงลายมือชื่อผู้รับเงิน และวันเดือนปีที่รับเงิน กรณีมีการยืมเงินให้ระบุวันที่ที่ได้รับเงินยืม เลขที่สัญญายืม และวันที่อนุมัติเงินยืมด้วย",
                font: "TH Sarabun New",
                size: 28,
                }),
            ],
            }),
            new Paragraph({
            children: [
                new TextRun({
                text: "3. กรณีที่ยื่นขอเบิกค่าใช้จ่ายรวมเป็นหมู่คณะ ผู้ขอรับเงินมิต้องลงลายมือชื่อในช่องผู้รับเงิน ทั้งนี้ให้ผู้มีสิทธิแต่ละคน ลงลายมือชื่อผู้รับเงินในหลักฐานการจ่ายเงิน ( ส่วนที่ 2 )",
                font: "TH Sarabun New",
                size: 28,
                }),
            ],
            }),       

        ],
        },
        {
            children: [
                new Paragraph({
                    alignment: "right",
                    children: [
                        new TextRun({text: "บก 4231", font: "TH Sarabun New", size: 32}),
                    ]
                }),
                new Paragraph({
                    alignment: "center",
                    children: [
                        new TextRun({text: "ใบรับรองแทนใบเสร็จรับเงิน", font: "TH Sarabun New", size: 32}),
                    ]
                }),
                new Paragraph({
                    alignment: "center",
                    children: [
                        new TextRun({text: "ส่วนราชการ มหาวิทยาลัยมหาสารคาม", font: "TH Sarabun New", size: 32}),
                    ]
                })
            ]
        },
    ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "document.docx"); // download docx
}
