function createAccommodationParagraph_F2(cost, person, unit, days) {
const cmToTwip = (cm) => Math.round(cm * 567);
const { Paragraph, TextRun } = window.docx;
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

function sendAccommodationParagraphs_F2 (){
    const accommodationParagraphs = [];// array เก็บ ข้อมูลค่าเบี้ยเลี้ยง
    const Accommodation_Costrows = document.querySelectorAll("#Real_accommodation .Real_accommodation_1"); 

    Accommodation_Costrows.forEach((row) => {
    const cost = row.querySelector(".real_accommodation_cost")?.value.trim() || "0";
    const person = row.querySelector(".real_accommodation_person")?.value.trim() || "0";
    const days = row.querySelector(".real_accommodation_day")?.value.trim() || "0";
    const costFormatted = cost ? Number(cost.replace(/,/g, '')).toLocaleString() : "-";

    if (cost !== "0" || person !== "0" || days !== "0") {
        const unitRadio = row.querySelector('input[type="radio"]:checked');
        const unit = unitRadio ? unitRadio.parentElement.textContent.trim() : ""; 
        
        accommodationParagraphs.push(createAccommodationParagraph_F2(costFormatted, person, unit, days)); // push เพิ่มข้อมูลเข้า accommodationParagraphs ที่เป็น array
    }
    });
    return accommodationParagraphs;
}