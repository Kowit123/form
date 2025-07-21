function createMainParagraphsDocx2(lines) {
    calculateDuration();
    const cmToTwip = (cm) => Math.round(cm * 567);
    const { Paragraph, TextRun } = window.docx;

    const mainParagraph = lines.split("\n").map(line => line.trim()).filter(Boolean);
    const radios1 = [
        { id: "GH", label: "บ้านพัก" },
        { id: "GS", label: "สำนักงาน" },
        { id: "GT", label: "ประเทศไทย" },
        { id: "GF", label: "ต่างประเทศ" }
    ];
    let radioText1 = radios1.map(r => {
        const checked = document.getElementById(r.id).checked;
        return ` ( ${checked ? "/" : ""} )${r.label}`;
    }).join("");

    const result = [];

    // ✅ เพิ่มย่อหน้าเนื้อหาหลัก
    mainParagraph.forEach((line, index) => {
        result.push(
            new Paragraph({
                alignment: "left",
                spacing: {
                    before: index === 0 ? cmToTwip(0.5) : 0,
                    after: cmToTwip(0),
                },
                indent: {
                    left: cmToTwip(0),
                    firstLine: index === 0 ? cmToTwip(2.5) : 0,
                },
                children: [
                    new TextRun({
                        text: line,
                        font: "TH Sarabun New",
                        size: 32,
                    }),
                ],
            })
        );
    });

    // ✅ เพิ่มย่อหน้าอื่น ๆ ต่อท้าย
    result.push(
        new Paragraph({
            children: [
                new TextRun({ text: "โดยออกเดินทางจาก", font: "TH Sarabun New", size: 32 })
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ text: `${radioText1} ตั้งแต่วันที่ ${document.getElementById("thai-datepicker9").value} เวลา ${document.getElementById("timepicker3").value} น.`, font: "TH Sarabun New", size: 32 })
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "และกลับถึง", font: "TH Sarabun New", size: 32 })
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ text: `${radioText1} วันที่ ${document.getElementById("thai-datepicker10").value} เวลา ${document.getElementById("timepicker4").value} น.`, font: "TH Sarabun New", size: 32 })
            ]
        }),
        new Paragraph({
            children:[
                new TextRun({text: `${document.getElementById("daysresult").textContent}`, font: "TH Sarabun New", size: 32 })
            ]
        })
    );

    return result;
}

    function mainParagraphLineDocx2(){
    //เนื้อหา main ที่จะใช้
    const lines =`ตามคำสั่ง/บันทึกที่ ${document.getElementById("rebd2").value} ลงวันที่ ${document.getElementById("thai-datepicker8").value} ได้อนุมัติให้ ข้าพเจ้า ${document.getElementById("nrq_re").value} ตำแหน่ง ${document.getElementById("pst_re").value} สังกัด ${document.getElementById("pt_re").value} เดินทางไปปฏิบัติราชการเพื่อ ${document.querySelector('input[name="qqee"]:checked')?.value || ''} เรื่อง ${document.getElementById("subject_re").value} ณ ${document.getElementById("lo_re").value} `;
     // นำ string มาจัด format ด้วย function createMainParagraphs()
    const mainParagraphs_F2 = createMainParagraphsDocx2(lines);
    return mainParagraphs_F2;
    }