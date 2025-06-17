
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

  // flatpickr time (24 ชม.)
  const t24 = ["timepicker1", "timepicker2", "timepicker3", "timepicker4"];
  t24.forEach(id => {
    flatpickr(`#${id}`, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true
    });
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
    <input type="text" name="department_${entryCount1}" placeholder="หน่วยงาน">
    <input type="text" name="position_${entryCount1}" placeholder="ตำแหน่ง">
    <button class="remove-btn" onclick="removeEntry(this)">&minus;</button>
  `;
  container.appendChild(div1);
}
function removeEntry(button) {
  const container = button.closest(".entry")
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

function calculateAllowance () {
  const v1 = parseFloat(mc1.value) || 0;
  const v2 = parseFloat(pc1.value) || 0;
  const v3 = parseFloat(dc1.value) || 0;
  const v1_2 = parseFloat(mc2.value) || 0;
  const v2_2 = parseFloat(pc2.value) || 0;
  const v3_2 = parseFloat(dc2.value) || 0;
  allowanceTotal = (v1 * v2 * v3) + (v1_2 * v2_2 * v3_2);
  result.textContent = allowanceTotal.toLocaleString()
 let total = allowanceTotal;
  return total;

}
mc1.addEventListener('input',calculateAllowance);
pc1.addEventListener('input',calculateAllowance);
dc1.addEventListener('input',calculateAllowance);
mc2.addEventListener('input',calculateAllowance);
pc2.addEventListener('input',calculateAllowance);
dc2.addEventListener('input',calculateAllowance);


const distance = document.getElementById('distance');
const distance_result = document.getElementById('distance-cost_result');

function calculatedistance () {
  const x = parseFloat(distance.value) || 0;

  distanceTotal = x * 4 * 2;
  distance_result.textContent = distanceTotal.toLocaleString()
 let total = distanceTotal;
 window.totald = distanceTotal;
  return total;

}
distance.addEventListener('input',calculatedistance);

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
        <input class="accommodation_cost" name="accommodation_cost_${accommodationRow}" type="text" placeholder="ค่าที่พัก">
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
    const price = parseFloat(prices[i].value) || 0;
    const count = parseFloat(counts[i].value) || 0;
    const day = parseFloat(days[i].value) || 0;

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


/*ค่าพาหนะ*/
// เพิ่ม-ลบแถว
let vehiclesRow = 1;

function addHired_vehiclesLine() {
  vehiclesRow++;
  const container = document.getElementById("Hired-vehicles_detail");
  const div = document.createElement("div");
  div.classList.add("vehicles");
  div.innerHTML = `
    <div class="vehicles-detail_cost" style ="display:grid; grid-template-columns: 60% 45% 10%; margin-bottom: 1%;">
      <div>
        <input class="vehicles_detail" name="vehicles_detail_${vehiclesRow}" type="text" placeholder="รายละเอียดค่าพาหนะรับจ้าง" style="margin: 0; display: flex; align-items: center; width:94%;">
      </div>  
      <div>
        <input class="vehicles_cost" name="vehicles_cost" type="number" placeholder="จำนวนเงิน" oninput="updateHired_vehiclesTotal()" style="margin: 0; display: flex; align-items: center;width:100%;"> 
        <button class="remove-btn" onclick="removeHired_vehiclesline(this)" style="margin: 0; display: flex; align-items: center; margin-left:3%">&minus;</button>
      </div>  
    </div>  
  `;
  container.appendChild(div);
  updateHired_vehiclesTotal();
  attachInputListeners();
  updateGrandTotal();
}
function removeHired_vehiclesline(button) {
  const vehiclesline = button.closest(".vehicles");
  if (vehiclesline) {
    vehiclesline.remove();
    vehiclesRow--;
  }
}
/*รวมเงิน*/
function updateHired_vehiclesTotal() {
  const inputs = document.querySelectorAll('.vehicles_cost');
  let total = 0;
  inputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("vehicles-cost_result").textContent = total.toLocaleString();
  window.vehicles_cost = total;
  return total;
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
    <div class="Registration_fee_cost" style ="display:grid; grid-template-columns: 60% 45% 10%; margin-bottom: 1%;">
      <div>
        <input class="Registration_fee_detail" name="Registration_fee_detail_${Registration}" type="text" placeholder="รายละเอียดค่าลงทะเบียน" style="margin: 0; display: flex; align-items: center; width:94%;">
      </div>  
      <div>
        <input class="Registration-fee" name="Registration-fee" type="number" placeholder="จำนวนเงิน" oninput="updateRegistration_fee_Total()" style="margin: 0; display: flex; align-items: center;width:100%;"> 
        <button class="remove-btn" onclick="removeRegistration_feeline(this)" style="margin: 0; display: flex; align-items: center; margin-left:3%">&minus;</button>
      </div>  
    </div> 
    
  `;
  container.appendChild(div);
  updateRegistration_fee_Total();
  attachInputListeners();
  updateGrandTotal();
}
function removeRegistration_feeline(button) {
  const feeline = button.closest(".fee_detail");
  if (feeline) {
    feeline.remove();
    Registration--;
    updateRegistration_fee_Total();
    attachInputListeners();
    updateGrandTotal();
  }
}
/*รวมเงิน*/
function updateRegistration_fee_Total() {
  const inputs = document.querySelectorAll('.Registration-fee');
  let total = 0;
  inputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      total += value;
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
    <div class="other_cost1" style ="display:grid; grid-template-columns: 60% 45% 10%; margin-bottom: 1%;">
      <div>
        <input class="Other-cost_detail" name="other-cost_detail_${other}" type="text" placeholder="รายละเอียดค่าใช้จ่ายอื่นๆ" style="margin: 0; display: flex; align-items: center; width:94%;">
      </div>  
      <div>
        <input class="otherCost" name="otherCost" type="number" placeholder="จำนวนเงิน" oninput="updateothercostTotal()" style="margin: 0; display: flex; align-items: center;width:100%;"> 
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
    const value = parseFloat(input.value);
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
  const Registration_fee = updateRegistration_fee_Total();
  const vehicles = updateHired_vehiclesTotal();
  const allowance = calculateAllowance();
  const distance = calculatedistance();
  const Accommodation = updateAccommodationTotal();

  const grandTotal = other + vehicles + Registration_fee + allowance + distance + Accommodation;

  document.getElementById("GrandTotal").textContent = grandTotal.toLocaleString();
  window.all_cost = grandTotal;
  return grandTotal;
}

function attachInputListeners() {
  document.querySelectorAll('.otherCost, .Registration-fee, .vehicles_cost, .accommodation_cost, .distance')
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

distance.addEventListener('input',attachInputListeners);
distance.addEventListener('input',updateGrandTotal);






const checkbox = document.getElementById('reign_car');
const inputDiv = document.getElementById('detail_car');

checkbox.addEventListener('change', function() {
  if (this.checked) {
    inputDiv.style.display = 'grid';
    } else {
      inputDiv.style.display = 'none';
    }
    });

const checkbox2 = document.getElementById('personal_car');
checkbox2.addEventListener('change', function() {
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