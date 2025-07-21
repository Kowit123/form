// Form1
function getReportDataFrom1DOM() {
  return {
    // 🧑‍💼 ข้อมูลผู้ขอ
        //Form1
        requesting_name: document.getElementById("requesting_name")?.value?.trim() || "",
        requesting_position: document.getElementById("requesting_position")?.value?.trim() || "",
        requesting_part: document.getElementById("requesting_part")?.value?.trim() || "",
        //Form2
        requesting_name: document.getElementById("nrq_re")?.value?.trim() || "",
        requesting_position: document.getElementById("pst_re")?.value?.trim() || "",
        requesting_part: document.getElementById("pt_re")?.value?.trim() || "",

    // ข้อมูลการเดินทาง 
    project: document.getElementById("project")?.value?.trim() || "",
    objective: document.querySelector('input[name="qqe"]:checked')?.value?.trim() || "",
    place: document.getElementById("at")?.value?.trim() || "",
    startDate: document.getElementById("thai-datepicker2")?.value?.trim() || "",
    endDate: document.getElementById("thai-datepicker3")?.value?.trim() || "",
    departDate: document.getElementById("thai-datepicker4")?.value?.trim() || "",
    returnDate: document.getElementById("thai-datepicker5")?.value?.trim() || "",
  };
}

//Form2
function getReportDataFrom2DOM() {
  return {
    //ส่วนหัวเอกสาร
    con_number: document.getElementById("con_number")?.value?.trim() || "",//สญ ยืมเงินเลขที่
    thai_datepicker6: document.getElementById("thai-datepicker6")?.value?.trim() || "",//วันที่ สญยืมเงิน
    Borrower: document.getElementById("Borrower")?.value?.trim() || "",//คนยืม
    amount_borrow: document.getElementById("amount_borrow")?.value?.trim() || "",//จนยืม
    thai_datepicker7: document.getElementById("thai-datepicker7")?.value?.trim() || "",//วันที่ สญยืมเงิน

    // ข้อมูลผู้ขอ
    requesting_name_F2: document.getElementById("nrq_re")?.value?.trim() || "",
    requesting_position_F2: document.getElementById("pst_re")?.value?.trim() || "",
    requesting_part_f2: document.getElementById("pt_re")?.value?.trim() || "",

    // ข้อมูลผู้ร่วมเดินทาง
    participants_F2: getParticipantsDataFromDOM(),

    // ข้อมูลการเดินทาง 
    objective_F2: document.querySelector('input[name="qqee"]:checked')?.value?.trim() || "",
    subject_F2: document.getElementById("subject_re")?.value?.trim() || "",
    at_F2: document.getElementById("lo_re")?.value?.trim() || "",

    // วันเวลาเดินทาง
    TravelDataFrom: getTravelDataFromDOM(),

    //เบิกค่าใช้จ่ายในการเดินทางไปราชการสำหรับ
    radio_F2: m(),

    //หมายเหตุ
    note_F2: document.getElementById("ps")?.value?.trim() || "",

    //expenses
      //allowance1
      allowance_cost_1_F2: document.getElementById("real_allowance_cost_1")?.value?.trim() || "",
      allowance_cost_1_F2: document.getElementById("real_NumberOfPersons_1")?.value?.trim() || "",
      allowance_cost_1_F2: document.getElementById("real_NumberOfDate_1")?.value?.trim() || "",
      //allowance2
      allowance_cost_2_F2: document.getElementById("real_allowance_cost_2")?.value?.trim() || "",
      allowance_cost_2_F2: document.getElementById("real_NumberOfPersons_2")?.value?.trim() || "",
      allowance_cost_2_F2: document.getElementById("real_NumberOfDate_2")?.value?.trim() || "",




  };
}



//รายละเอียดผู้ร่วมเดินทาง
function getParticipantsDataFromDOM() {
  const data = [];
  const rows = document.querySelectorAll(".t_re_cost");

  rows.forEach((row, index) => {
    const name = row.querySelector(`input[id^="name_re_"]`)?.value.trim() || "";
    const position = row.querySelector(`input[id^="position_re_"]`)?.value.trim() || "";
    const allowance = row.querySelector(`input[id^="allowance_p2_"]`)?.value.trim() || "0";
    const accommodation = row.querySelector(`input[id^="accommodation_p2_"]`)?.value.trim() || "0";
    const vehicles = row.querySelector(`input[id^="vehicles_p2_"]`)?.value.trim() || "0";
    const other = row.querySelector(`input[id^="other_p2_"]`)?.value.trim() || "0";
    const total = row.querySelector(`input[id^="total_p2_"]`)?.value.trim() || "0";

    data.push({
      name,
      position,
      allowance: parseFloat(allowance.replace(/,/g, '')) || 0,
      accommodation: parseFloat(accommodation.replace(/,/g, '')) || 0,
      vehicles: parseFloat(vehicles.replace(/,/g, '')) || 0,
      other: parseFloat(other.replace(/,/g, '')) || 0,
      total: parseFloat(total.replace(/,/g, '')) || 0
    });
  });

  return data;
}
//วันเวลาสถานที่ F2
function getTravelDataFromDOM() {
  // ไป
  const goDate = document.getElementById("thai-datepicker9")?.value.trim() || "";
  const goTime = document.getElementById("timepicker3")?.value.trim() || "";
  const goPlaces = Array.from(document.querySelectorAll('input[name="OO"]:checked'))
    .map(input => input.value);

  // กลับ
  const returnDate = document.getElementById("thai-datepicker10")?.value.trim() || "";
  const returnTime = document.getElementById("timepicker4")?.value.trim() || "";
  const returnPlaces = Array.from(document.querySelectorAll('input[name="OO2"]:checked'))
    .map(input => input.value);

  return {
    goDate,
    goTime,
    goPlaces,      // เป็น array เช่น ["บ้านพัก", "ประเทศไทย"]
    returnDate,
    returnTime,
    returnPlaces,  // เป็น array เช่น ["สำนักงาน"]
  };
}

function m() {
  const radios2 = [
    { id: "bb", label: "ข้าพเจ้า" },
    { id: "bb2", label: "คณะเดินทาง" },
];
let radioText2 = radios2.map(r => {
    const checked = document.getElementById(r.id).checked;
    return `( ${checked ? "/" : ""} )${r.label}`;
}).join(" ");
return radioText2;
}