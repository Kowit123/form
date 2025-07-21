    //ค่าตอบทนพนักงานขับรถ  
function sumKatoptanParagraph (){
    const katopRows = document.querySelectorAll(".R_katoptan_row");
    const totalResult = Array.from(katopRows).reduce((sum, row) => {
    const span = row.querySelector(".reign_car4413_result");
    const value = parseFloat((span?.textContent || "0").replace(/,/g, "")) || 0;
    return sum + value;
    }, 0);
    return totalResult;
}

    function createKatoptanParagraph_F2(driverName,money, days, total) {
    const cmToTwip = (cm) => Math.round(cm * 567);
    const { Paragraph, TextRun } = window.docx;
    return new Paragraph({
        indent: { left: cmToTwip(2)},
        spacing: { after: cmToTwip(0)},
        children: [
        new TextRun({
            text: `- ${driverName} ${money.toLocaleString()} บาท X ${days} วัน เป็นเงิน ${total.toLocaleString()} บาท`,
            font: "TH Sarabun New",
            size: 32,
        }),
        ],
    });
    }
 
function sendKatoptanParagraph_F2 (){
    const katoptanParagraph = [];
    const reignCarCheckbox = document.querySelector('input[name="type"][data-id="R_reign_car"]');
    const katopRows = document.querySelectorAll(".R_katoptan_row");
    if (reignCarCheckbox && reignCarCheckbox.checked){
    katopRows.forEach(row => {
    const inputs = row.querySelectorAll("input");
    const driverName = inputs[0]?.value.trim() || "-";
    const money = parseFloat(inputs[1]?.value.replace(/,/g, '') || "0");
    const days = parseFloat(inputs[2]?.value.replace(/,/g, '') || "0");
    const total = money * days;
    katoptanParagraph.push(createKatoptanParagraph_F2(driverName,money, days, total));
    });
    }
    return katoptanParagraph;
}