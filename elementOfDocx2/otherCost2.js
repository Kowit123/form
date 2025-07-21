
    function createotherCostParagraph(otherCostDetail,otherCostFeeFormatted) {
    const cmToTwip = (cm) => Math.round(cm * 567);
    const { Paragraph, TextRun } = window.docx;
    return new Paragraph({
        indent: { left: cmToTwip(2)},
        spacing: { after: cmToTwip(0)},
        children: [
        new TextRun({
            text: `- ${otherCostDetail} จำนวน${otherCostFeeFormatted} บาท`,
            font: "TH Sarabun New",
            size: 32,
        }),
        ],
    });
    }

    function sendOtherCostParagraph (){
    const otherCostParagraph = [];    
    const otherCostRows = document.querySelectorAll(".r_other");
    otherCostRows.forEach(row => {
    const otherCostDetail = row.querySelector('.R_other_detail')?.value || "";
    // รองรับ comma และแสดงผล fee แบบมี comma
    const otherCostFeeRow = row.querySelector('.R_other_costs')?.value || "0";
    const otherCostFee = Number(otherCostFeeRow.replace(/,/g, ''));
    const otherCostFeeFormatted = otherCostFee.toLocaleString();
    if (otherCostRows) {
    otherCostParagraph.push(createotherCostParagraph(otherCostDetail,otherCostFeeFormatted));
    }
    });
    return otherCostParagraph;
}