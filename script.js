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

// ป้องกันการรีเฟรชหน้าเว็บจากปุ่มและลิงก์ต่างๆ
document.addEventListener('DOMContentLoaded', function() {
    // ป้องกันการรีเฟรชจากปุ่มที่มี onclick
    const buttonsWithOnclick = document.querySelectorAll('button[onclick]');
    buttonsWithOnclick.forEach(button => {
        button.addEventListener('click', function(e) {
            // ไม่ต้อง preventDefault เพราะ onclick จะทำงานอยู่แล้ว
            // เพียงแค่ป้องกันการส่ง form หรือการรีเฟรช
            e.stopPropagation();
        });
    });

    // ป้องกันการรีเฟรชจากลิงก์ที่มี onclick
    const linksWithOnclick = document.querySelectorAll('a[onclick]');
    linksWithOnclick.forEach(link => {
        link.addEventListener('click', function(e) {
            // ไม่ต้อง preventDefault เพราะ onclick จะทำงานอยู่แล้ว
            // เพียงแค่ป้องกันการส่ง form หรือการรีเฟรช
            e.stopPropagation();
        });
    });

    // ป้องกันการรีเฟรชจาก form (ถ้ามี)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            return false;
        });
    });

    // ป้องกันการรีเฟรชจาก browser events
    window.addEventListener('beforeunload', function(e) {
        // ไม่ต้องทำอะไร เพียงแค่ป้องกันการรีเฟรช
    });

    // ป้องกันการรีเฟรชจาก keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // ป้องกัน Ctrl+R, F5, Ctrl+F5
        if ((e.ctrlKey && e.key === 'r') || e.key === 'F5' || (e.ctrlKey && e.key === 'F5')) {
            e.preventDefault();
            return false;
        }
    });

    // ป้องกันการรีเฟรชจาก context menu
    document.addEventListener('contextmenu', function(e) {
        // ไม่ต้อง preventDefault เพราะอาจต้องการ context menu
        // เพียงแค่ป้องกันการรีเฟรช
    });
});

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
  const ids = ["thai-datepicker1", "thai-datepicker2", "thai-datepicker3", "thai-datepicker4", "thai-datepicker5", "thai-datepicker6", "thai-datepicker7", "thai-datepicker8", "thai-datepicker9", "thai-datepicker10"];

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
          thaidate.setAttribute("placeholder", originalPlaceholder);
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
  return false;
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
  return false;
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
  return false;
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
  return false;
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
  const reignCarDriver = Array.from(document.querySelectorAll('.reign_car4412_result'))
  .reduce((sum, el) => {
    const num = parseFloat(el.textContent.replace(/,/g, '').trim()) || 0;
    return sum + num;
  }, 0);


  const grandTotal = other + allowance + Accommodation + register + vehicle + reignCarDriver;

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

//ของหน้า2
  //ของหน้า2
const input1 = document.getElementById("nrq_re");
const input2 = document.getElementById("name_re_1");
if (input1 && input2) {
  input1.addEventListener("input", function () {
    input2.value = input1.value;
  });
}

const pst_re = document.getElementById("pst_re");
const position_re_1 = document.getElementById("position_re_1");
if (pst_re && position_re_1) {
  pst_re.addEventListener("input", function () {
    position_re_1.value = pst_re.value;
  });
}

const input1_1 = document.getElementById("requesting_name");
const input2_1 = document.getElementById("name_1");
if (input1_1 && input2_1) {
  input1_1.addEventListener("input", function () {
    input2_1.value = input1_1.value;
  });
}

const requesting_position = document.getElementById("requesting_position");
const position = document.getElementById("position_1");
if (requesting_position && position) {
  requesting_position.addEventListener("input", function () {
    position.value = requesting_position.value;
  });
}

const requesting_part = document.getElementById("requesting_part");
const department_1 = document.getElementById("department_1");
if (requesting_part && department_1) {
  requesting_part.addEventListener('input', function () {
    department_1.value = requesting_part.value;
  });
}

const Box = document.getElementById("reign_car4412");
const reign_car_checkbox = document.querySelector('input[name="topicT"][data-id="reign_car"]');
const otherCostLabelForm = document.querySelector('.other-cost .F_line label');
if (reign_car_checkbox && Box) {
  reign_car_checkbox.addEventListener('change', function () {
    if (this.checked) {
      Box.style.display = 'flex';
      // Change label from "5. ค่าใช้จ่ายอื่นๆ" to "6. ค่าใช้จ่ายอื่นๆ"
      if (otherCostLabelForm) {
        otherCostLabelForm.textContent = '6. ค่าใช้จ่ายอื่นๆ';
      }
    } else {
      Box.style.display = 'none';
      // Change label back to "5. ค่าใช้จ่ายอื่นๆ"
      if (otherCostLabelForm) {
        otherCostLabelForm.textContent = '5. ค่าใช้จ่ายอื่นๆ';
      }
      // ล้างค่า input ข้างใน Box
      const inputs = Box.querySelectorAll('input');
      inputs.forEach(input => input.value = '');
      // ล้างผลลัพธ์การคำนวณ
      document.getElementById('reign_car4412_result').textContent = '0';
    }
  });
  // ซ่อนกล่องตอนโหลดหน้า
  Box.style.display = reign_car_checkbox.checked ? 'flex' : 'none';
  // Set initial label state
  if (otherCostLabelForm) {
    otherCostLabelForm.textContent = reign_car_checkbox.checked ? '6. ค่าใช้จ่ายอื่นๆ' : '5. ค่าใช้จ่ายอื่นๆ';
  }
}

// Function to calculate ggx1 * ggx2 and update reign_car4412_result
function calculateReignCarDriverCompensation() {
  const ggx1 = document.getElementById('ggx1');
  const ggx2 = document.getElementById('ggx2');
  const resultElement = document.getElementById('reign_car4412_result');
  
  if (ggx1 && ggx2 && resultElement) {
    const value1 = parseNumber(ggx1.value);
    const value2 = parseNumber(ggx2.value);
    const result = value1 * value2;
    resultElement.textContent = result.toLocaleString();
    updateGrandTotal(); // Update grand total when this calculation changes
  }
}

// Add event listeners for ggx1 and ggx2
const ggx1Element = document.getElementById('ggx1');
const ggx2Element = document.getElementById('ggx2');

if (ggx1Element) {
  ggx1Element.addEventListener('input', calculateReignCarDriverCompensation);
}

if (ggx2Element) {
  ggx2Element.addEventListener('input', calculateReignCarDriverCompensation);
}

document.addEventListener('DOMContentLoaded', function () {

const boxx = document.getElementById("reason_personal_car");
const personalCarCheckbox = document.querySelector('input[name="topicT"][data-id="personal_car"]');

if (personalCarCheckbox && boxx) {
  personalCarCheckbox.addEventListener('change', function () {
    if (this.checked) {
      boxx.style.display = 'flex';
    } else {
      boxx.style.display = 'none';
      // ถ้าต้องการล้างค่า input ข้างใน reason_personal_car ด้วย
      const inputs = boxx.querySelectorAll('input');
      inputs.forEach(input => input.value = '');
    }
  });
  // ซ่อนกล่องตอนโหลดหน้า
  boxx.style.display = personalCarCheckbox.checked ? 'flex' : 'none';
}

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
    const container = document.getElementById("container");

    // 🛻 คำนวณช่องรถยนต์ส่วนบุคคล × 4 หรือ ×8
    const personalCarInput = container.querySelector('#personal_car_box input.comma-number');
    const personalCarCheckbox = container.querySelector('#personal_car_box input[type="checkbox"]');
    let personalCarAmount = 0;
    if (personalCarInput) {
        let multiplier = 4;
        if (personalCarCheckbox && personalCarCheckbox.checked) {
            multiplier = 8;
        }
        personalCarAmount = parseNumber(personalCarInput.value) * multiplier;
        total += personalCarAmount;
    }
    totalPersonalCarDisplay.textContent = personalCarAmount.toLocaleString();

    // ✨ รวมกล่อง .input-box อื่น (ยกเว้น personal_car, reign_car)
    const allBoxes = container.querySelectorAll('.input-box:not(#personal_car_box):not(#reign_car_box)');
    allBoxes.forEach(box => {
        const numberInputs = box.querySelectorAll('input.comma-number');
        numberInputs.forEach(input => {
            const value = parseNumber(input.value);
            if (!isNaN(value)) {
                total += value;
            }
        });
    });

    // 🌟 รวมช่อง input[id="tth"] ด้วย
    const tthInputs = container.querySelectorAll('input.tth.comma-number');
    let tthTotal = 0;
    tthInputs.forEach(input => {
        const val = parseNumber(input.value);
        if (!isNaN(val)) {
            tthTotal += val;
        }
    });

    // รวม tth กับค่าปกติ
    total += tthTotal;

    // 🧮 แสดงผลรวมทั้งหมด
    totalDisplay.textContent = total.toLocaleString();

    // 🎯 คำนวณยอดรวมรวม
    updateGrandTotal();
}


// ➤ ติดตามทุก input
const allInputs = document.querySelectorAll('.input-box input');
allInputs.forEach(input => {
    input.addEventListener('input', calculateTotal);
});

document.addEventListener('input', function (e) {
  if (e.target.classList.contains('tth')) {
    calculateTotal();
  }
});


});
document.addEventListener('DOMContentLoaded', function() {
    // เลือก radio "อบรม/สัมมนา"
    const seminarRadio = document.querySelector('input[name="qqe"][value="อบรม/สัมมนา"]');
    // เลือก radio "เหมาจ่าย"
    const maoRadio = document.querySelector('input[name="fav_language"][value="เหมาจ่าย"]');

    // ฟังก์ชันสำหรับจัดการสถานะ disabled
    function handleSeminarChange() {
        if (seminarRadio.checked) {
            maoRadio.checked = false;
            maoRadio.disabled = true;
        } else {
            maoRadio.disabled = false;
        }
    }

    // เมื่อมีการเปลี่ยนแปลง radio group qqe
    document.querySelectorAll('input[name="qqe"]').forEach(radio => {
        radio.addEventListener('change', handleSeminarChange);
    });

    // เรียกครั้งแรกเพื่อ sync สถานะ
    handleSeminarChange();

const airplaneCheckbox = document.querySelector('input[name="topicT"][data-id="airplane"]');
const reasonAirplaneBox = document.getElementById('reason_airplane');

if (airplaneCheckbox && reasonAirplaneBox) {
  airplaneCheckbox.addEventListener('change', function () {
    if (this.checked) {
      reasonAirplaneBox.style.display = 'flex';
    } else {
      reasonAirplaneBox.style.display = 'none';
      // ล้างค่า input ข้างใน reason_airplane
      const inputs = reasonAirplaneBox.querySelectorAll('input');
      inputs.forEach(input => input.value = '');
    }
  });
  // ซ่อนกล่องตอนโหลดหน้า
  reasonAirplaneBox.style.display = airplaneCheckbox.checked ? 'flex' : 'none';
}

});

// Logic for report form (container2) - show/hide driver compensation when R_reign_car is checked
const reportDriverBox = document.getElementById("reign_car4413");
const reportReignCarCheckbox = document.querySelector('input[name="type"][data-id="R_reign_car"]');
const otherCostLabel = document.querySelector('.R_Other .left_part p');

if (reportReignCarCheckbox && reportDriverBox) {
  reportReignCarCheckbox.addEventListener('change', function () {
    if (this.checked) {
      reportDriverBox.style.display = 'flex';
      // Change the number from 4 to 5 in the "ค่าใช้จ่ายอื่นๆ" label
      if (otherCostLabel) {
        otherCostLabel.textContent = '5. ค่าใช้จ่ายอื่นๆ';
      }
    } else {
      reportDriverBox.style.display = 'none';
      // Clear inputs inside the box
      const inputs = reportDriverBox.querySelectorAll('input');
      inputs.forEach(input => input.value = '');
      // Clear calculation result
      document.getElementById('reign_car4413_result').textContent = '0';
      // Change the number back from 5 to 4 in the "ค่าใช้จ่ายอื่นๆ" label
      if (otherCostLabel) {
        otherCostLabel.textContent = '4. ค่าใช้จ่ายอื่นๆ';
      }
    }
  });
  // Initial state on page load
  reportDriverBox.style.display = reportReignCarCheckbox.checked ? 'flex' : 'none';
  // Set initial label text based on checkbox state
  if (otherCostLabel) {
    otherCostLabel.textContent = reportReignCarCheckbox.checked ? '5. ค่าใช้จ่ายอื่นๆ' : '4. ค่าใช้จ่ายอื่นๆ';
  }
}


// ...existing code...
document.addEventListener('DOMContentLoaded', function () {
    const addBtn = document.getElementById('addReignCarBtn');
    const reignContainer = document.getElementById('reign_car_box');
    const katopContainer = document.getElementById('katoptan_row');

    if (addBtn && reignContainer && katopContainer) {
        addBtn.addEventListener('click', () => {
            const reignRow = createReignCarRow();
            const katopRow = createKatopRow();

            // ผูกกันด้วย property เพื่อให้ลบพร้อมกัน
            reignRow.dataset.partner = katopRow.dataset.id;
            katopRow.dataset.partner = reignRow.dataset.id;

            reignContainer.appendChild(reignRow);
            katopContainer.appendChild(katopRow);

            syncReignAndKatopInput(reignRow, katopRow);
        });
    }

    

    // 👑 ฟังก์ชันสร้างแถว "รถยนต์ของทางราชการ"
    function createReignCarRow() {
        const div = document.createElement('div');
        div.className = 'reign_car_row';
        div.style.display = 'flex';
        div.dataset.id = crypto.randomUUID();

        div.innerHTML = `
          <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1%; margin-right: 1%; width: 76%;">
              รถยนต์ของทางราชการ:
              <input type="text" placeholder="หมายเลขทะเบียนรถ" style="margin: 0; margin-left: 0%; width: 20%;">
              <input type="text" placeholder="พนักงานขับรถ" style="margin: 0; width: 25%;">
              <input type="text" class="comma-number" placeholder="ระยะทาง" style="margin: 0; width: 10%;">
              <input type="text" class="comma-number tth" placeholder="จำนวนเงิน" style="margin: 0; width: 10%;">
          </label>
          <button type="button" class="remove-btn" style="background-color:red; color: white; margin: 0; margin-bottom: 1%; width: 6.2%;">&minus;</button>
        `;
        // ลบทั้งแถวตัวเองและแถวพาร์ทเนอร์
        div.querySelector('.remove-btn').addEventListener('click', function () {
            const partnerId = div.dataset.partner;
            const partner = document.querySelector(`[data-id="${partnerId}"]`);
            if (partner) partner.remove();
            div.remove();
            updateGrandTotal();
        });

        div.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', updateGrandTotal);
        });

        return div;
    }

    // 🚗 ฟังก์ชันสร้างกล่องคำนวณค่าตอบแทน
    function createKatopRow() {
        const div = document.createElement('div');
        div.className = 'katoptan_row';
        div.dataset.id = crypto.randomUUID();

        div.style = "width: 100%; display: flex; justify-content: space-between; text-align: center; align-items: center;";

        div.innerHTML = `
            <div style="width:75%;">
                <input type="text" placeholder="ชื่อพนักงานขับรถ" style="margin: 0; width: 33%;">
                <input type="text" class="comma-number money" placeholder="จำนวนเงิน" style="margin: 0;"> X 
                <input type="text" class="comma-number days" placeholder="จำนวนวัน" style="margin: 0;">
            </div>
            <div class="cost_display" style="align-items: center; margin: 0; margin-bottom: 1%; text-align: center; margin-top: 1.2%;">
                <p style="margin: 0; display: flex; align-items: center; justify-content: center;">เป็นจำนวนเงิน&nbsp;</p>
                <span class="reign_car4412_result comma-number" style="margin: 0; display: flex; align-items: center;">0</span>
                <p style="margin: 0; display: flex; align-items: center;">&nbsp;บาท</p>
            </div>
        `;
        // คำนวณทันทีเมื่อพิมพ์
        const moneyInput = div.querySelector('.money');
        const daysInput = div.querySelector('.days');
        const resultSpan = div.querySelector('.reign_car4412_result');

        [moneyInput, daysInput].forEach(input => {
            input.addEventListener('input', () => {
                const money = parseFloat(moneyInput.value.replace(/,/g, '')) || 0;
                const days = parseFloat(daysInput.value.replace(/,/g, '')) || 0;
                const total = money * days;
                resultSpan.textContent = total.toLocaleString();
                updateGrandTotal();
            });
        });

        return div;
    }

  const container = document.getElementById("container");
  if (container) {
    const observer = new MutationObserver(() => {
      calculateTotal();
    });

    observer.observe(container, { childList: true, subtree: true });
  }

});



function syncReignAndKatopInput(reignRow, katopRow) {
  const reignInput = reignRow.querySelectorAll('input')[1]; // input[1] = ชื่อพนักงานขับรถ
  const katopInput = katopRow.querySelectorAll('input')[0]; // input[0] = ชื่อพนักงานขับรถค่าตอบแทน

  // ถ้าแก้ฝั่งราชการ → ไปอัปเดตค่าตอบแทน
  reignInput.addEventListener('input', () => {
    katopInput.value = reignInput.value;
  });

  // ถ้าแก้ฝั่งค่าตอบแทน → ไปอัปเดตรถราชการ
  katopInput.addEventListener('input', () => {
    reignInput.value = katopInput.value;
  });
}

const cn = document.getElementById('cn');
const cn1 = document.getElementById('cn1');

if (cn && cn1) {
  // เมื่อกรอกใน #cn → อัปเดต #cn1
  cn.addEventListener('input', () => {
    cn1.value = cn.value;
  });

  // เมื่อกรอกใน #cn1 → อัปเดต #cn
  cn1.addEventListener('input', () => {
    cn.value = cn1.value;
  });
}


document.getElementById("uploadPDF").addEventListener("change", function () {
  const fileList = Array.from(this.files);
  const preview = fileList.map((f, i) => `📄 ${i + 1}. ${f.name}`).join("<br>");
  document.getElementById("fileNameList").innerHTML = preview || "ยังไม่ได้เลือกไฟล์";
});

document.getElementById("uploadPDF").value = "";

function clearFiles() {
  const input = document.getElementById("uploadPDF");
  input.value = ""; // ✅ ล้างไฟล์
}
