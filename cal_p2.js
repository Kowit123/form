let call = 1;

function addrow() {
  call++;
  const container = document.getElementById("re_cost");
  const div = document.createElement("div");
  div.className = "t_re_cost";

  div.innerHTML = `
    <div style="padding: 1%; padding-top: 0%;">
    <input type="text" id="name_re_${call}" placeholder="ชื่อ-นามสกุล"></div>
    <div style="padding: 1%; padding-top: 0%;  width: 15%;">
    <input id="position_re_${call}" type="text"></div>
    <div style="width: 10%; padding-top: 0%;">
    <input class="allowance_p2" id="allowance_p2_${call}" type="number"></div>
    <div style="width: 10%; padding-top: 0%;">
    <input class="accommodation_p2" id="accommodation_p2_${call}" type="number"></div>
    <div style="width: 10%; padding-top: 0%;">
    <input class="vehicles_p2" id="vehicles_p2_${call}" type="number"></div>
    <div style="width: 10%; padding-top: 0%;">
    <input class="Registration_p2" id="Registration_p2_${call}" type="number"></div>
    <div style="width: 10%; padding-top: 0%;">
    <input class="other_p2" id="other_p2_${call}" type="number"></div>
    <div style="width: 10%; padding-top: 0%;">
    <input class="total_p2" id="total_p2_${call}" type="text" readonly></div>
    <input class="total_p_1" id="total_p_${call}" type="text" readonly style="display: none;">
  `;
  container.appendChild(div);
    div.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", updatecall);
  });
  updatecall();

}

function removerow() {
    if (call > 1) { // ไม่ให้ลบแถวแรก
      const container = document.getElementById("re_cost");
      container.removeChild(container.lastElementChild);
      call--;
    }
    updatecall();
}

function updatecall() {
  // ดึงข้อมูล input ทั้งหมดในแต่ละ class ใหม่ทุกครั้ง
  const allowance_p2 = document.querySelectorAll(".allowance_p2");
  const accommodation_p2 = document.querySelectorAll(".accommodation_p2");
  const vehicles_p2 = document.querySelectorAll(".vehicles_p2");
  const Registration_p2 = document.querySelectorAll(".Registration_p2");
  const other_p2 = document.querySelectorAll(".other_p2");
  const total_p2 = document.querySelectorAll(".total_p2");
  const total_p_1 = document.querySelectorAll(".total_p_1");

  for (let i = 0; i < allowance_p2.length; i++) {
    const price_allowance_p2 = parseFloat(allowance_p2[i].value) || 0;
    const count_accommodation_p2 = parseFloat(accommodation_p2[i].value) || 0;
    const day_vehicles_p2 = parseFloat(vehicles_p2[i].value) || 0;
    const day_Registration_p2 = parseFloat(Registration_p2[i].value) || 0;
    const price_other_p2 = parseFloat(other_p2[i].value) || 0;

    // คำนวณรวมเฉพาะแถวนี้
    const rowTotal = price_allowance_p2 + count_accommodation_p2 + day_vehicles_p2 + price_other_p2 + day_Registration_p2;
    const cs = price_allowance_p2 + count_accommodation_p2 + day_vehicles_p2 + price_other_p2;
    // แสดงผลในช่องรวมของแถวนี้
    total_p2[i].value = rowTotal.toFixed(2);
    total_p_1[i].value = cs.toFixed(2);

    thisResultGran();
    thisResult1();
    thisResult2();
    thisResult3();
    thisResult4();
  }
}
document.getElementById("allowance_p2_1").addEventListener('input',updatecall);
document.getElementById("accommodation_p2_1").addEventListener('input',updatecall);
document.getElementById("vehicles_p2_1").addEventListener('input',updatecall);
document.getElementById("Registration_p2_1").addEventListener('input',updatecall);
document.getElementById("other_p2_1").addEventListener('input',updatecall);

function thisResultGran() {
  const inputs = document.querySelectorAll('.total_p_1');
  let total = 0;
  inputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("thisResultGran").textContent = total.toLocaleString();
  window.this = total;
  return total;
}
function thisResult1() {
  const inputs = document.querySelectorAll('.allowance_p2');
  let total = 0;
  inputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("thisResult1").textContent = total.toLocaleString();
  return total;
}
function thisResult2() {
  const inputs = document.querySelectorAll('.accommodation_p2');
  let total = 0;
  inputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("thisResult2").textContent = total.toLocaleString();
  return total;
}
function thisResult3() {
  const inputs = document.querySelectorAll('.vehicles_p2');
  let total = 0;
  inputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("thisResult3").textContent = total.toLocaleString();
  return total;
}
function thisResult4() {
  const inputs = document.querySelectorAll('.other_p2');
  let total = 0;
  inputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("thisResult4").textContent = total.toLocaleString();
  return total;
}

/* เพิ่้ม ลด แถวค่าที่พัก */
let real_accommodationRow = 1;

function addRealAccommodationRow() {
  real_accommodationRow++;
  const container = document.getElementById("Real_accommodation");
  const div = document.createElement("div");
  div.classList.add("Real_accommodation_1");

  div.innerHTML = `
    <div class="left_part">
        <input class="real_accommodation_cost" id="real_accommodation_cost_${real_accommodationRow}" type="number" placeholder="ค่าที่พัก" oninput="grandTotal()">
        <input class="real_accommodation_person" id="real_accommodation_person_${real_accommodationRow}" type="number" placeholder="จำนวนห้อง" oninput="grandTotal()">
        <input class="real_accommodation_day" id="real_accommodation_day_${real_accommodationRow}" type="number" placeholder="จำนวนวัน" oninput="grandTotal()">
        <button class="add-btn" onclick="removeRealAccommodationeRow(this)" style="text-align: center; margin: 0; background-color: red;">&minus;</button>
    </div> 
  `;
  
  container.appendChild(div);

  // เพิ่ม event listener ให้ input ในแถวใหม่ (สำคัญมาก!)
  div.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", updateRealAccommodationTotal);
  });

  // เรียก update รวมทันทีหลังเพิ่มแถวใหม่
  updateRealAccommodationTotal();
}

function removeRealAccommodationeRow(button) {
  const containerAcc = button.closest(".Real_accommodation_1");
  if (containerAcc) {
    containerAcc.remove();
    real_accommodationRow--;
  }
  updateRealAccommodationTotal();
  grandTotal();
}

/* เพิ่มลบแถว ค่าลงทะเบียน */
let Real_RegisterRow= 1;

function R_addRegisterLine() {
  Real_RegisterRow++;
  const container = document.getElementById("R_Register_detail");
  const div = document.createElement("div");
    div.classList.add("r_register");

  div.innerHTML = `
<div class="R_register_fee_cost" style="display:grid; grid-template-columns: 50% 20% 25%; margin-bottom: 1%; width:100%; gap:2%; margin-top:1%;">
  <div>
    <input class="R_register_fee_detail" name="R_register_fee_detail" type="text" placeholder="รายละเอียดค่าลงทะเบียน" style="margin: 0; display: flex; align-items: center; width:100%;">
  </div> 
  <div>
    <input class="R_register_fee_amount" name="R_register_fee_amount" type="number" placeholder="จำนวนเงิน" oninput="R_updateRegisterTotal()" style="margin: 0; display: flex; align-items: center;width:100%;"> 
  </div>  
  <div style="display: flex;">
    <input class="R_register_fee_person" name="R_register_fee_person" type="number" placeholder="จำนวนคน" oninput="R_updateRegisterTotal()" style="margin: 0; display: flex; align-items: center;width:100%;"> 
    <button class="remove-btn" onclick="R_removeRegisterLine(this)" style="margin: 0; display: flex; align-items: center; margin-left:3%; background-color:red; ">&minus;</button>
  </div>  
</div>
  `;
  container.appendChild(div);
  R_updateRegisterTotal();
}
function R_removeRegisterLine(button) {
  const containerAcc = button.closest(".r_register");
  if (containerAcc) {
    containerAcc.remove();
    Real_RegisterRow--;
  }
  R_updateRegisterTotal();
  grandTotal();
}

/* เพิ่มลบแถว ค่าลงทะเบียน */
let Real_OtherRow= 1;

function R_addOtherLine() {
  Real_OtherRow++;
  const container = document.getElementById("R_other_detail");
  const div = document.createElement("div");
    div.classList.add("r_other");

  div.innerHTML = `
    <div class="R_other_cost" style ="display:flex; margin-bottom:0.5%;">
      <div style = "margin-right:1%;width:38%;">
        <input class="R_other_detail" name="R_other_detail_${Real_OtherRow}" type="text" placeholder="รายละเอียดค่าใช้จ่ายอื่น" style = "margin: 0 ; width:96%;">
      </div>  
      <div style = "margin-right:1%; width:20%">
        <input class="R_other_costs" name="R_other_costs" type="number" placeholder="จำนวนเงิน" oninput="updateRealOthercostTotal()" style = "margin: 0 ; width:94%;">
      </div>  
        <button class="remove-btn" onclick="R_removeOtherLine(this)" style="text-align: center; margin: 0 ; background-color:red;">&minus;</button>
      
    </div> 
  `;
  container.appendChild(div);
  updateRealOthercostTotal();
}
function R_removeOtherLine(button) {
  const containerAcc = button.closest(".r_other");
  if (containerAcc) {
    containerAcc.remove();
    Real_OtherRow--;
  }
  updateRealOthercostTotal();
  grandTotal();
}


/* แสดงเมือเรือกรถราชการ */
const R_checkbox = document.getElementById('R_reign_car');
const R_inputDiv = document.getElementById('R_detail_car');

R_checkbox.addEventListener('change', function() {
  if (this.checked) {
    R_inputDiv.style.display = 'grid';
    } else {
      R_inputDiv.style.display = 'none';
    }
    });
    
const R2_checkbox = document.getElementById('R_personal_car');
R2_checkbox.addEventListener('change', function() {
  if (this.checked) {
    R_inputDiv.style.display = 'grid';
    } else {
      R_inputDiv.style.display = 'none';
    }
    });

/* คำนวนหน้า2 */

const Real_GrandTotal_Allowance_Cost = document.getElementById("Real_GrandTotal_Allowance_Cost");
let R_AllowanceTotal1 = 0;
let R_AllowanceTotal2 = 0;
function calculateRealAllowance () {
  const real_allowance_cost_1 =  parseFloat(document.getElementById("real_allowance_cost_1").value) || 0;
  const real_NumberOfPersons_1 =  parseFloat(document.getElementById("real_NumberOfPersons_1").value) || 0;
  const real_NumberOfDate_1 =  parseFloat(document.getElementById("real_NumberOfDate_1").value) || 0;
  const real_allowance_cost_2 =  parseFloat(document.getElementById("real_allowance_cost_2").value) || 0;
  const real_NumberOfPersons_2 =  parseFloat(document.getElementById("real_NumberOfPersons_2").value) || 0;
  const real_NumberOfDate_2 =  parseFloat(document.getElementById("real_NumberOfDate_2").value) || 0;

  R_AllowanceTotal1 = (real_allowance_cost_1*real_NumberOfPersons_1*real_NumberOfDate_1);
  R_AllowanceTotal2 = (real_allowance_cost_2*real_NumberOfPersons_2*real_NumberOfDate_2);
  Real_GrandTotal_Allowance_Cost.textContent = (R_AllowanceTotal1+R_AllowanceTotal2).toLocaleString();

  let total = Real_GrandTotal_Allowance_Cost;
  grandTotal();
  return total;
}
['real_allowance_cost_1', 'real_NumberOfPersons_1', 'real_NumberOfDate_1',
 'real_allowance_cost_2', 'real_NumberOfPersons_2', 'real_NumberOfDate_2'
].forEach(id => {
    document.getElementById(id).addEventListener('input', calculateRealAllowance);
});



function updateRealAccommodationTotal() {
  let totalAcc = 0;

  // ต้อง query ใหม่ทุกครั้ง เพื่อรองรับ row ใหม่ที่เพิ่มมา
  const prices_accommodation = document.querySelectorAll(".real_accommodation_cost");
  const counts_accommodation = document.querySelectorAll(".real_accommodation_person");
  const days_accommodation = document.querySelectorAll(".real_accommodation_day");

  for (let i = 0; i < prices_accommodation.length; i++) {
    const price_accommodation_ = parseFloat(prices_accommodation[i].value) || 0;
    const count_accommodation = parseFloat(counts_accommodation[i].value) || 0;
    const day_accommodation = parseFloat(days_accommodation[i].value) || 0;

    totalAcc += price_accommodation_ * count_accommodation * day_accommodation;
  }

  document.getElementById("Real_GrandTotal_Accommodation_Cost").textContent = totalAcc.toLocaleString();
  grandTotal();
  return totalAcc;
}

document.getElementById("real_accommodation_cost_1").addEventListener('input', updateRealAccommodationTotal);
document.getElementById("real_accommodation_person_1").addEventListener('input', updateRealAccommodationTotal);
document.getElementById("real_accommodation_day_1").addEventListener('input', updateRealAccommodationTotal);



function  R_updateRegisterTotal() {
  const rows = document.querySelectorAll('.r_register');
  let total = 0;

  rows.forEach(row => {
    const feeInput = row.querySelector('.R_register_fee_amount');
    const personInput = row.querySelector('.R_register_fee_person');

    const fee = parseFloat(feeInput?.value);
    const person = parseFloat(personInput?.value);

    if (!isNaN(fee) && !isNaN(person)) {
      total += fee * person;
    }
  });

  document.getElementById("R_register_cost_result").textContent = total.toLocaleString();
  window.Registration_fee = total;
  grandTotal();
  return total;
}

function updateRealOthercostTotal() {
  const inputs = document.querySelectorAll('.R_other_costs');
  let total = 0;
  inputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("R_other_cost_result").textContent = total.toLocaleString();
  window.other_cost = total;
  grandTotal();
  return total;
}


function grandTotal() {
  function parseNumber(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const raw = el.textContent || "0"; // ใช้ textContent เพราะเป็น <span>
    return parseFloat(raw.replace(/,/g, '')) || 0;
  }

  const G_1 = parseNumber("Real_GrandTotal_Allowance_Cost");
  const G_2 = parseNumber("Real_GrandTotal_Accommodation_Cost");
  const G_3 = parseNumber("R_distance-cost_result");
  const G_4 = parseNumber("R_Transportation_expenses_result");
  const G_5 = parseNumber("R_register_cost_result");
  const G_6 = parseNumber("R_other_cost_result");

  const total = G_1 + G_2 + G_3 + G_4 + G_5 + G_6;
  document.getElementById("R_GrandTotal").textContent = total.toLocaleString();
  window.Grand = total;
  return total;
}

//function คำนวนเวลาที่ใช้ โดย อิงเวลา ไป กลับ
function convertThaiFullDateToISO(thaiFullDateStr) {
  const thaiMonths = {
    "มกราคม": "01", "กุมภาพันธ์": "02", "มีนาคม": "03", "เมษายน": "04",
    "พฤษภาคม": "05", "มิถุนายน": "06", "กรกฎาคม": "07", "สิงหาคม": "08",
    "กันยายน": "09", "ตุลาคม": "10", "พฤศจิกายน": "11", "ธันวาคม": "12"
  };

  const parts = thaiFullDateStr.trim().split(" ");
  if (parts.length !== 3) return null;

  const [day, thaiMonth, yearBE] = parts;
  const month = thaiMonths[thaiMonth];
  const year = parseInt(yearBE) - 543;

  if (!day || !month || isNaN(year)) return null;

  return `${year}-${month}-${day.padStart(2, '0')}`;
}


function calculateDuration() {
  const startDateRaw = document.getElementById("thai-datepicker9").value;
  const startTime = document.getElementById("timepicker3").value;
  const endDateRaw = document.getElementById("thai-datepicker10").value;
  const endTime = document.getElementById("timepicker4").value;

  if (!startDateRaw || !startTime || !endDateRaw || !endTime) {
    document.getElementById("daysresult").textContent = "❗ กรุณากรอกวันและเวลาให้ครบ";
    return;
  }

  // แปลงวันที่ไทยเป็น ISO
const startDate = convertThaiFullDateToISO(startDateRaw);
const endDate = convertThaiFullDateToISO(endDateRaw);


  // ตรวจสอบการแปลงวันที่
  if (!startDate || !endDate) {
    document.getElementById("daysresult").textContent = "❗ รูปแบบวันที่ไม่ถูกต้อง (ควรเป็น ว/ด/ป)";
    return;
  }

  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);

  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    document.getElementById("daysresult").textContent = "❗ วันที่หรือเวลาไม่ถูกต้อง";
    return;
  }

  const diffMs = endDateTime - startDateTime;
  if (diffMs <= 0) {
    document.getElementById("daysresult").textContent = "❗ เวลาไปต้องมาก่อนเวลากลับ";
    return;
  }

  const totalMinutes = diffMs / (1000 * 60);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = Math.floor(totalMinutes % 60);

  document.getElementById("daysresult").textContent =
    `รวมเวลาไปราชการครั้งนี้ ${days} วัน ${hours} ชั่วโมง ${minutes} นาที`;
}



    
    let dateId = 1;

  function addDateSection() {
    const form_container1 = document.getElementById("form-container1");
    const div = document.createElement("div");
    div.id = `date-section-${dateId}`; // เพื่ออ้างอิงได้ง่าย
    div.innerHTML = `
      <div class="date-header">
        📅 วันที่: <input type="text" placeholder="ว/ด/ปี เช่น 16/พ.ค./68">
        <button onclick="addEntry(${dateId})">&plus; เพิ่มรายละเอียด</button>
        <button onclick="removeDateSection(${dateId})" style="margin-left: auto; background-color:rgb(223, 3, 3);">🗑 ลบวันที่</button>
      </div>
      <div class="entries" id="entries-${dateId}"></div>
    `;
    form_container1.appendChild(div);
    dateId++;
  }

  // ฟังก์ชันคำนวณจำนวนเงินจากระยะทาง
function updateAmount(uniqueId) {
  const distanceInput = document.getElementById(`distance-${uniqueId}`);
  const amountInput = document.getElementById(`amount-${uniqueId}`);
  const distance = parseFloat(distanceInput.value);

  if (!isNaN(distance)) {
    amountInput.value = (distance * 4).toFixed(2);
  } else {
    amountInput.value = '';
  }

  calculateTotalAmount();
}


  function removeDateSection(id) {
  const section = document.getElementById(`date-section-${id}`);
  if (section) section.remove();
}

function calculateTotalAmount() {
  let total = 0;
  const amountInputs = document.querySelectorAll('input[placeholder="จำนวนเงิน (บาท)"]');
  amountInputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("k").textContent = total.toLocaleString();
}

function addEntry(id) {
  const entriesDiv = document.getElementById(`entries-${id}`);
  const entry = document.createElement("div");
  const uniqueId = Date.now(); // ใช้สำหรับอ้างอิงเฉพาะแต่ละ input

  entry.innerHTML = `
    <div style="display:grid; grid-template-columns: 60% 15.5% 15.5% auto; margin-bottom:1%;">
      <input type="text" placeholder="รายละเอียด เช่น เดินทางไปประชุมที่ อ.เมือง อุดรธานี..." style="margin:0; margin-right:1%;">

      <input 
        type="number" 
        id="distance-${uniqueId}"
        placeholder="ระยะทาง (กม.)" 
        style="margin:0; margin-right:1.5%;" 
        oninput="updateAmount(${uniqueId})">

      <input 
        type="number" 
        id="amount-${uniqueId}"
        placeholder="จำนวนเงิน (บาท)" 
        style="margin:0; margin-right:1.5%;" 
        readonly>

      <button 
        class="remove-btn" 
        onclick="this.parentElement.remove(); calculateTotalAmount();" 
        style="background-color:rgb(223, 3, 3);margin:1%;">
        🗑
      </button>
    </div>  
  `;

  entriesDiv.appendChild(entry);
}



document.addEventListener('DOMContentLoaded', function () {

const checkboxess = document.querySelectorAll('input[name="type"]');

checkboxess.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const id = checkbox.dataset.id;
    const box = document.getElementById(id + '_box');

    if (checkbox.checked) {
      box.style.display = 'flex';
    } else {
      box.style.display = 'none';
      // เคลียร์ input ข้างใน
      const input = box.querySelectorAll('input');
      input.forEach(input => input.value = '');
      calculateTotal();
    }
  });
});

    const totalDisplay = document.querySelector('#R_Transportation_expenses_result');
    const totalPersonalCarDisplay = document.querySelector('#R_total_personal_car');
    const totalReignCarDisplay = document.querySelector('#R_total_reign_car');

    function calculateTotal() {
        let total = 0;

        // ➤ รถยนต์ส่วนบุคคล × 8
        const personalCarInput = document.querySelector('#R_personal_car_box input[type="number"]');
        let personalCarAmount = 0;
        if (personalCarInput && !isNaN(parseFloat(personalCarInput.value))) {
            personalCarAmount = parseFloat(personalCarInput.value) * 8;
            total += personalCarAmount;
        }
        totalPersonalCarDisplay.textContent = personalCarAmount.toLocaleString();

        // ➤ รถยนต์ราชการ × 8
        const reignCarInput = document.querySelector('#R_reign_car_box input[type="number"]');
        let reignCarAmount = 0;
        if (reignCarInput && !isNaN(parseFloat(reignCarInput.value))) {
            reignCarAmount = parseFloat(reignCarInput.value) * 8;
            total += reignCarAmount;
        }
        totalReignCarDisplay.textContent = reignCarAmount.toLocaleString();

        // ➤ จำนวนเงินจาก input-box อื่นๆ
        const allBoxes = document.querySelectorAll('.input-box:not(#R_personal_car_box):not(#R_reign_car_box)');
        allBoxes.forEach(box => {
            const numberInputs = box.querySelectorAll('input[type="number"]');
            numberInputs.forEach(input => {
                const value = parseFloat(input.value);
                if (!isNaN(value)) {
                    total += value;
                }
            });
        });

        totalDisplay.textContent = total.toLocaleString();
        grandTotal();
    }

    // ➤ ติดตามทุก input number
    const allInputs = document.querySelectorAll('.input-box input[type="number"]');
    allInputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
    });
});