
function F() {
const nnoChecked = document.getElementById('nno')?.checked;
if (nnoChecked) {
const cmToTwip = (cm) => Math.round(cm * 567);
const { Paragraph, TextRun } = window.docx;
return new Paragraph({
    spacing: { after: cmToTwip(0)},
    children: [
    new TextRun({
        text: `( / )โดยไม่ขอเบิกจ่ายจากคณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม`,
        font: "TH Sarabun New",
        size: 32,
    }),
    ],
});
}
}