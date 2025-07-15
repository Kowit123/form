    function createAllowanceParagraph_F2(mc, pc, dc) {
    const text = `- ค่าเบี้ยเลี้ยง ${mc} บาท จำนวน ${pc} คน ระยะเวลา ${dc} วัน`;
    const cmToTwip = (cm) => Math.round(cm * 567);
    const { Paragraph, TextRun } = window.docx;
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

    //send data
    function sendAllowanceParagraphs_F2 (){
        // ดึง input ค่าเบี้ยเลี้ยง มาใช้
        const mc_1 = document.getElementById("real_allowance_cost_1").value.trim();
        const pc_1 = document.getElementById("real_NumberOfPersons_1").value.trim();
        const dc_1 = document.getElementById("real_NumberOfDate_1").value.trim();

        const mc_2 = document.getElementById("real_allowance_cost_2").value.trim();
        const pc_2 = document.getElementById("real_NumberOfPersons_2").value.trim();
        const dc_2 = document.getElementById("real_NumberOfDate_2").value.trim();

        const allowanceParagraphs = [];

        if (mc_1) {
        const formatted = Number(mc_1.replace(/,/g, '')).toLocaleString();
        allowanceParagraphs.push(createAllowanceParagraph_F2(formatted, pc_1, dc_1));
        }

        if (mc_2) {
        const formatted = Number(mc_2.replace(/,/g, '')).toLocaleString();
        allowanceParagraphs.push(createAllowanceParagraph_F2(formatted, pc_2, dc_2));
        }

        return allowanceParagraphs;
    }