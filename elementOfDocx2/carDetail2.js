function cmToTwip(cm) {
  return Math.round(cm * 567);
}

function createPersonalCarParagraph_F2({ plate, driver, distanceFormatted, costFormatted, isRoundTrip }) {
  const { Paragraph, TextRun } = window.docx;
  const roundTripText = isRoundTrip ? "x 2 (ไป-กลับ)" : "";

  return new Paragraph({
    indent: { left: cmToTwip(2) },
    tabStops: [
      {
        type: "left",
        position: cmToTwip(1),
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
        text: `หมายเลขทะเบียน ${plate} โดยมี ${driver} เป็นผู้ขับรถ`,
        font: "TH Sarabun New",
        size: 32,
      }),
      new TextRun({ break: 1 }),
      new TextRun({
        text: `ระยะทาง ${distanceFormatted} กม. ${roundTripText}  เป็นเงิน ${costFormatted} บาท`,
        font: "TH Sarabun New",
        size: 32,
      }),
    ],
  });
}

function collectPersonalCarData() {
  const personalBox = document.querySelector("#R_personal_car_box");
  if (!personalBox || personalBox.style.display === "none") return null;

  const inputs = personalBox.querySelectorAll("input");
  const plate = inputs[0]?.value.trim() || "-";
  const driver = inputs[1]?.value.trim() || "-";
  const distance = inputs[2]?.value.trim() || "0";
  const rawDistance = distance.replace(/,/g, "");
  const distanceFormatted = !isNaN(rawDistance) ? Number(rawDistance).toLocaleString() : "-";

  const costText = document.getElementById("R_total_personal_car")?.textContent.trim() || "0";
  const rawCost = costText.replace(/,/g, "");
  const costFormatted = !isNaN(rawCost) ? Number(rawCost).toLocaleString() : "-";

  const isRoundTrip = document.getElementById("R_personal_car_roundtrip1");

  return {
    plate,
    driver,
    distanceFormatted,
    costFormatted,
    isRoundTrip,
  };
}

function sendPersonalCarParagraph_F2() {
  const PersonalCarParagraph_F2 = [];
  const carData = collectPersonalCarData();

  if (carData) {
    const paragraph = createPersonalCarParagraph_F2(carData);
    PersonalCarParagraph_F2.push(paragraph);
  }

  return PersonalCarParagraph_F2;
}


function createReignCarParagraph_F2(ReignCarPlate,ReignCarDriver, ReignCarDistanceFormatted, ReignCarCostFormatted) {
const { Paragraph, TextRun } = window.docx;
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
function sendReignCarParagraph_F2 (){
const reignCarParagraph = [];
const reignRows = document.querySelectorAll("#R_reign_car_box .R_reign_car_row");
reignRows.forEach(row => {
const inputs = row.querySelectorAll("input");
const ReignCarPlate = inputs[0]?.value.trim() || "";
const ReignCarDriver = inputs[1]?.value.trim() || "";
const ReignCarDistance = inputs[2]?.value.trim() || "";
const ReignCarCost = inputs[3]?.value.trim() || ""
const ReignCarDistanceFormatted = ReignCarDistance ? Number(ReignCarDistance.replace(/,/g, '')).toLocaleString() : "-";
const ReignCarCostFormatted = ReignCarCost ? Number(ReignCarCost.replace(/,/g, '')).toLocaleString() : "-";
const reignCarBox = document.querySelector("#R_reign_car_box")
if (reignCarBox&& reignCarBox.style.display !== "none") {
reignCarParagraph.push(createReignCarParagraph_F2(ReignCarPlate,ReignCarDriver, ReignCarDistanceFormatted, ReignCarCostFormatted));
}
});
return reignCarParagraph;
}

//ค่าพาหนะ อื่นๆ
function createTransportParagraph(type, detail, amountFormatted) {
const { Paragraph, TextRun } = window.docx;
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

function sendOtherCarParagraph_F2 () {
    const otherTransportParagraphs = [];
    const transportTypes = [
        { id: "R_airplane", label: "เครื่องบิน" },
        { id: "R_train", label: "รถไฟ" },
        { id: "R_bus", label: "รถประจำทาง" },
        { id: "R_vv", label: "พาหนะรับจ้าง" }
    ];
    for (const type of transportTypes) {
    const box = document.querySelector(`#${type.id}_box`);
    if (box && box.style.display !== "none") {
        const inputs = box.querySelectorAll("input");
        const detail = inputs[0].value.trim();
        const amount = inputs[1].value.trim();
        const amountFormatted = amount ? Number(amount.replace(/,/g, '')).toLocaleString() : "0";

        if (detail || amount) {
        otherTransportParagraphs.push(createTransportParagraph(type, detail, amountFormatted));
        }
    }
    }
    return otherTransportParagraphs;
}