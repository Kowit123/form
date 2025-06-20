// ฟังก์ชันจัดรูปแบบตัวเลขให้มี comma และทศนิยม
function formatNumberWithCommas(value) {
    value = value.replace(/,/g, '');
    if (value === '') return '';
    // ถ้าเป็นจุดเดียวหรือจุดนำหน้า
    if (value === '.' || value === '-.' || value === '-') return value;
    // ถ้ามีจุดทศนิยม
    if (value.indexOf('.') !== -1) {
        const parts = value.split('.');
        // ส่วนหน้าคือจำนวนเต็ม, ส่วนหลังคือทศนิยม
        let intPart = parts[0];
        let decPart = parts[1];
        // ถ้าไม่มีตัวเลขหน้าจุด ให้ถือเป็น 0
        intPart = intPart === '' ? '0' : intPart;
        // ใส่ comma เฉพาะส่วนจำนวนเต็ม
        intPart = Number(intPart).toLocaleString('en-US');
        return decPart !== undefined ? intPart + '.' + decPart : intPart + '.';
    }
    // กรณีไม่มีจุด
    return Number(value).toLocaleString('en-US');
}

document.addEventListener('input', function(e) {
    if (e.target.classList.contains('comma-number')) {
        // กรองให้เหลือแต่ตัวเลขและจุดทศนิยม
        let raw = e.target.value.replace(/[^0-9.]/g, '');
        // ให้เหลือจุดทศนิยมแค่จุดเดียว
        const parts = raw.split('.');
        if (parts.length > 2) {
            raw = parts[0] + '.' + parts.slice(1).join('');
        }
        // อย่า format ถ้าจบด้วยจุด (เช่น 123.)
        if (raw.endsWith('.')) {
            e.target.value = formatNumberWithCommas(raw);
        } else {
            e.target.value = formatNumberWithCommas(raw);
        }
    }
});



let allowanceTotal = 0;
document.addEventListener("DOMContentLoaded", function () {
  // flatpickr date (แปลง พ.ศ.)
  const ids = ["thai-datepicker1", "thai-datepicker2", "thai-datepicker3", "thai-datepicker4", "thai-datepicker5", "thai-datepicker6", "thai-datepicker7", "thai-datepicker8", "thai-datepicker9", "thai-datepicker10", "thai-datepicker11"];

  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  ids.forEach(id => {
    const thaidate = document.getElementById(id);
    const originalPlaceholder = thaidate.getAttribute("placeholder") || "ว/ด/ปี";

    flatpickr(`#${id}`, {
      locale: "th",
      allowInput: true,
      altInput: true,
      altFormat: "j F Y", // j = day, F = full month, Y = year
      dateFormat: "Y-m-d", // for storing (optional)
      onChange: (_, __, instance) => convertToBE(instance),
      onReady: (_, __, instance) => {
        convertToBE(instance);
        setTimeout(() => {
          instance.thaidate.setAttribute("placeholder", originalPlaceholder);
        }, 0);
      },
      formatDate: (date, format, locale) => {
        const day = date.getDate();
        const month = thaiMonths[date.getMonth()];
        const year = date.getFullYear() + 543;
        return `${day} ${month} ${year}`;
      }
    });
  });
  function convertToBE(instance) {
    const date = instance.selectedDates[0];
    if (!date) return;

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = (date.getFullYear() + 543).toString();

    const formatted = `${day} ${month} ${year}`;
    instance.thaidate.value = formatted;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // ... flatpickr date code ...

  // flatpickr time (24 ชม.)
  ["timepicker3", "timepicker4"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      flatpickr(el, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true
      });
    }
  });
});

// เพิ่ม-ลบแถว
let entryCount1 = 1;

function addEntry1() {
  entryCount1++;
  const container = document.getElementById("form-container");
  const div1 = document.createElement("div");
  div1.className = "entry12";

  div1.innerHTML = `
    <input type="text" name="name_${entryCount1}" placeholder="ชื่อ-นามสกุล">
    <input type="text" name="position_${entryCount1}" placeholder="ตำแหน่ง">
    <input type="text" name="department_${entryCount1}" placeholder="หน่วยงาน">
    <div>
    <button class="remove-btn" onclick="removeEntry(this)" style="margin:0; background-color:red;">&minus;</button>
    </div>
  `;
  container.appendChild(div1);
}
function removeEntry(button) {
  const container = button.closest(".entry12")
  if (container) {
    container.remove();
    entryCount1--;
  }
}



//Allowance
const mc1 = document.getElementById('mc_1');
const pc1 = document.getElementById('pc_1');
const dc1 = document.getElementById('dc_1');
const mc2 = document.getElementById('mc_2');
const pc2 = document.getElementById('pc_2');
const dc2 = document.getElementById('dc_2');
const result = document.getElementById('result');


function parseNumber(val) {
    if (!val) return 0;
    return parseFloat(val.replace(/,/g, '')) || 0;
}

function calculateAllowance () {
  const v1 = parseNumber(mc1.value);
  const v2 = parseNumber(pc1.value);
  const v3 = parseNumber(dc1.value);
  const v1_2 = parseNumber(mc2.value);
  const v2_2 = parseNumber(pc2.value);
  const v3_2 = parseNumber(dc2.value);
  allowanceTotal = (v1 * v2 * v3) + (v1_2 * v2_2 * v3_2);
  result.textContent = allowanceTotal.toLocaleString();
  let total = allowanceTotal;
  return total;
}
mc1.addEventListener('input',calculateAllowance);
pc1.addEventListener('input',calculateAllowance);
dc1.addEventListener('input',calculateAllowance);
mc2.addEventListener('input',calculateAllowance);
pc2.addEventListener('input',calculateAllowance);
dc2.addEventListener('input',calculateAllowance);



/*ค่าที่พัก*/
// เพิ่ม-ลบแถว
let accommodationRow = 1;

function addAccommodationLine() {
  accommodationRow++;
  const container = document.getElementById("accommodation");
  const div = document.createElement("div");
    div.classList.add("all");

  div.innerHTML = `
    <div class="detail_cost">
        <input class="accommodation_cost comma-number" name="accommodation_cost_${accommodationRow}" type="text" placeholder="ค่าที่พัก">
        <input class="accommodation_person" name="accommodation_person_${accommodationRow}" type="number" placeholder="จำนวนคน">
        <input class="accommodation_day" name="accommodation_day_${accommodationRow}" type="number" placeholder="จำนวนวัน">
        <button class="remove-btn" onclick="removeAccommodationline(this)" style = "margin:0;">&minus;</button>
    </div>
    <!-- ยอดรวมเงิน -->
    <div class="tatal-cost_accommodation" id="top-right-total" style="display:none;">
        <p>เป็นจำนวนเงิน&nbsp;</p>
        <span id="result">&nbsp;0</span>
        <p>&nbsp;บาท</p>
    </div> 
  `;
  container.appendChild(div);
  bindAccommodationEvents(); 
}
function removeAccommodationline(button) {
  const container = button.closest(".all");
  if (container) {
    container.remove();
    accommodationRow--;
    updateAccommodationTotal();
    updateGrandTotal();
  }
}
/*รวมเงิน*/
function updateAccommodationTotal() {
  const prices = document.querySelectorAll(".accommodation_cost");
  const counts = document.querySelectorAll(".accommodation_person");
  const days = document.querySelectorAll(".accommodation_day");

  let totalAcc = 0;

  for (let i = 0; i < prices.length; i++) {
    const price = parseNumber(prices[i].value) || 0;
    const count = parseNumber(counts[i].value) || 0;
    const day = parseNumber(days[i].value) || 0;

    totalAcc += price * count * day;
  }

  document.getElementById("result_2").textContent = totalAcc.toLocaleString();
  let total = totalAcc;
  return total;
}


  const prices = document.querySelectorAll(".accommodation_cost");
  const counts = document.querySelectorAll(".accommodation_person");
  const days = document.querySelectorAll(".accommodation_day");

  prices.forEach(input => input.addEventListener("input", updateAccommodationTotal));
  counts.forEach(input => input.addEventListener("input", updateAccommodationTotal));
  days.forEach(input => input.addEventListener("input", updateAccommodationTotal));

  prices.forEach(input => input.addEventListener("input", updateGrandTotal));
  counts.forEach(input => input.addEventListener("input", updateGrandTotal));
  days.forEach(input => input.addEventListener("input", updateGrandTotal));
  
  prices.forEach(input => input.addEventListener("input", attachInputListeners));
  counts.forEach(input => input.addEventListener("input", attachInputListeners));
  days.forEach(input => input.addEventListener("input", attachInputListeners));

function bindAccommodationEvents() {
  const prices = document.querySelectorAll(".accommodation_cost");
  const counts = document.querySelectorAll(".accommodation_person");
  const days = document.querySelectorAll(".accommodation_day");

  prices.forEach(input => input.removeEventListener("input", updateAccommodationTotal));
  counts.forEach(input => input.removeEventListener("input", updateAccommodationTotal));
  days.forEach(input => input.removeEventListener("input", updateAccommodationTotal));

  prices.forEach(input => input.removeEventListener("input", attachInputListeners));
  counts.forEach(input => input.removeEventListener("input", attachInputListeners));
  days.forEach(input => input.removeEventListener("input", attachInputListeners));

  prices.forEach(input => input.removeEventListener("input", updateGrandTotal));
  counts.forEach(input => input.removeEventListener("input", updateGrandTotal));
  days.forEach(input => input.removeEventListener("input", updateGrandTotal));

  prices.forEach(input => input.addEventListener("input", updateGrandTotal));
  counts.forEach(input => input.addEventListener("input", updateGrandTotal));
  days.forEach(input => input.addEventListener("input", updateGrandTotal));
  
  prices.forEach(input => input.addEventListener("input", attachInputListeners));
  counts.forEach(input => input.addEventListener("input", attachInputListeners));
  days.forEach(input => input.addEventListener("input", attachInputListeners));
}


/*ค่าลงทะเบียน*/
// เพิ่ม-ลบแถว
let Registration = 1;

function addRegistrationfeeLine() {
  Registration++;
  const container = document.getElementById("Registration_fee_detail");
  const div = document.createElement("div");
  div.classList.add("fee_detail");
  div.innerHTML = `
    <div class="Registration_fee_cost" style ="display:grid; grid-template-columns: 50% 20% 25%; margin-bottom: 1%; width:100%; gap:1%;">
      <div>
        <input class="Registration_fee_detail" name="Registration_fee_detail_${Registration}" type="text" placeholder="รายละเอียดค่าลงทะเบียน" style="margin: 0; display: flex; align-items: center; width:100%;">
      </div> 
      <div>
        <input class="Registration-fee comma-number" name="Registration-fee" type="text" placeholder="จำนวนเงิน" oninput="updateRegistration_fee_Total()" style="margin: 0; display: flex; align-items: center;width:100%;"> 
      </div>  
      <div>
        <input class="Registrationp-fee" name="Registrationp-fee" type="number" placeholder="จำนวนคน" oninput="updateRegistration_fee_Total()" style="margin: 0; display: flex; align-items: center;width:100%;"> 
        <button class="remove-btn" onclick="removeRegistration_feeline(this)" style="margin: 0; display: flex; align-items: center; margin-left:3%">&minus;</button>
      </div>  
    </div> 
    
  `;
  container.appendChild(div);
  updateRegistration_fee_Total();
  attachInputListeners();
}
function removeRegistration_feeline(button) {
  const feeline = button.closest(".fee_detail");
  if (feeline) {
    feeline.remove();
    Registration--;
    updateRegistration_fee_Total();
    attachInputListeners();
  }
}
/*รวมเงิน*/
function updateRegistration_fee_Total() {
  const rows = document.querySelectorAll('.Registration_fee_cost');
  let total = 0;

  rows.forEach(row => {
    const feeInput = row.querySelector('.Registration-fee');
    const personInput = row.querySelector('.Registrationp-fee');

    const fee = parseNumber(feeInput?.value);
    const person = parseNumber(personInput?.value);

    if (!isNaN(fee) && !isNaN(person)) {
      total += fee * person;
    }
  });

  document.getElementById("Registration-fee_result").textContent = total.toLocaleString();
  window.Registration_fee = total;
  return total;
}

/*ค่าใช้จ่ายอื่นๆ*/
// เพิ่ม-ลบแถว
let other = 1;

function addothercostLine() {
  other++;
  const container = document.getElementById("other-cost_detail");
  const div = document.createElement("div");
  div.classList.add("other_cost");
  div.innerHTML = `
    <div class="other_cost1" style ="display:grid; grid-template-columns: 99% 51% 10%; margin-bottom: 1%; margin-top: 1%;">
      <div>
        <input class="Other-cost_detail" name="other-cost_detail_${other}" type="text" placeholder="รายละเอียดค่าใช้จ่ายอื่นๆ" style="margin: 0; display: flex; align-items: center; width:100%; margin-right:2%;">
      </div>  
      <div>
        <input class="otherCost comma-number" name="otherCost" type="text" placeholder="จำนวนเงิน" oninput="updateothercostTotal()" style="margin: 0; display: flex; align-items: center;width:100%;"> 
        <button class="remove-btn" onclick="removeothercostline(this)" style="margin: 0; display: flex; align-items: center; margin-left:3%">&minus;</button>
      </div>  
    </div> 
    
  `;
  container.appendChild(div);
  updateothercostTotal();
  attachInputListeners();
  updateGrandTotal();
}
function removeothercostline(button) {
  const costLine = button.closest(".other_cost");
  if (costLine) {
    costLine.remove();
    other--;
    updateothercostTotal();
    attachInputListeners();
    updateGrandTotal();
  }
}
/*รวมเงิน*/
function updateothercostTotal() {
  const inputs = document.querySelectorAll('.otherCost');
  let total = 0;
  inputs.forEach(input => {
    const value = parseNumber(input.value); // ใช้ parseNumber เพื่อรองรับ comma และทศนิยม
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("other-cost_result").textContent = total.toLocaleString();
  window.other_cost = total;
  return total;
}
//รวมเงินทั้งหมด
function updateGrandTotal() {
  const other = updateothercostTotal();
  const allowance = calculateAllowance();
  const Accommodation = updateAccommodationTotal();
  const register = updateRegistration_fee_Total();
  const vehicle = parseFloat(document.getElementById("Transportation_expenses_result").textContent.replace(/,/g, '').trim());

  const grandTotal = other + allowance + Accommodation + register + vehicle;

  document.getElementById("GrandTotal").textContent = grandTotal.toLocaleString();
  window.all_cost = grandTotal;
  return grandTotal;
}

function attachInputListeners() {
  document.querySelectorAll('.otherCost, .accommodation_cost, .Registration-fee, .Registrationp-fee')
    .forEach(input => {
      input.addEventListener('input', updateGrandTotal);
    });
}

mc1.addEventListener('input',attachInputListeners);
pc1.addEventListener('input',attachInputListeners);
dc1.addEventListener('input',attachInputListeners);
mc2.addEventListener('input',attachInputListeners);
pc2.addEventListener('input',attachInputListeners);
dc2.addEventListener('input',attachInputListeners);

mc1.addEventListener('input',updateGrandTotal);
pc1.addEventListener('input',updateGrandTotal);
dc1.addEventListener('input',updateGrandTotal);
mc2.addEventListener('input',updateGrandTotal);
pc2.addEventListener('input',updateGrandTotal);
dc2.addEventListener('input',updateGrandTotal);







const checkbox = document.getElementById('personal_car');
const inputDiv = document.getElementById('personal_car_detail');

checkbox.addEventListener('change', function() {
  if (this.checked) {
    inputDiv.style.display = 'grid';
    } else {
      inputDiv.style.display = 'none';
    }
    });


//ของหน้า2
  const input1 = document.getElementById("nrq_re");
  const input2 = document.getElementById("name_re_1");

  input1.addEventListener("input", function () {
    input2.value = input1.value;
  });

  const pst_re = document.getElementById("pst_re");
  const position_re_1 = document.getElementById("position_re_1");

  pst_re.addEventListener("input", function () {
    position_re_1.value = pst_re.value;
  });

  const input1_1 = document.getElementById("requesting_name");
  const input2_1 = document.getElementById("name_1");

  input1_1.addEventListener("input", function () {
    input2_1.value = input1_1.value;
  });

  const requesting_position = document.getElementById("requesting_position");
  const position = document.getElementById("position_1");

  requesting_position.addEventListener("input", function () {
    position.value = requesting_position.value;
  });


  const requesting_part = document.getElementById("requesting_part");
  const department_1 = document.getElementById("department_1");

  requesting_part.addEventListener("input", function () {
    department_1.value = requesting_part.value;
  });

document.addEventListener('DOMContentLoaded', function () {

const checkboxess = document.querySelectorAll('input[name="topicT"]');

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

const totalDisplay = document.querySelector('#Transportation_expenses_result');
const totalPersonalCarDisplay = document.querySelector('#total_personal_car');
const totalReignCarDisplay = document.querySelector('#total_reign_car');

function parseNumber(val) {
    if (!val) return 0;
    return parseFloat(val.replace(/,/g, '')) || 0;
}

function calculateTotal() {
    let total = 0;

    // รถยนต์ส่วนบุคคล × 8
const personalCarInput = document.querySelector('#personal_car_box input.comma-number');
console.log(personalCarInput); // ตรวจสอบค่าที่อ่านได้
console.log(personalCarInput.value);
let personalCarAmount = 0;
if (personalCarInput) {
    personalCarAmount = parseNumber(personalCarInput.value) * 8;
    total += personalCarAmount;
}
totalPersonalCarDisplay.textContent = personalCarAmount.toLocaleString();

    // รถยนต์ราชการ × 8
    const reignCarInput = document.querySelector('#reign_car_box input.comma-number');
    let reignCarAmount = 0;
    if (reignCarInput) {
        reignCarAmount = parseNumber(reignCarInput.value) * 8;
        total += reignCarAmount;
    }
    totalReignCarDisplay.textContent = reignCarAmount.toLocaleString();

    // input-box อื่นๆ
    const allBoxes = document.querySelectorAll('.input-box:not(#personal_car_box):not(#reign_car_box)');
    allBoxes.forEach(box => {
        const numberInputs = box.querySelectorAll('input.comma-number');
        numberInputs.forEach(input => {
            const value = parseNumber(input.value);
            if (!isNaN(value)) {
                total += value;
            }
        });
    });

    totalDisplay.textContent = total.toLocaleString();
    updateGrandTotal();
}

// ➤ ติดตามทุก input
const allInputs = document.querySelectorAll('.input-box input');
allInputs.forEach(input => {
    input.addEventListener('input', calculateTotal);
});


});
