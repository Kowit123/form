// ฟังก์ชันแปลงค่าตัวเลขที่มี comma เป็นตัวเลข
function parseNumber(val) {
    if (!val) return 0;
    return parseFloat(val.replace(/,/g, '')) || 0;
}

// ฟังก์ชันอัปเดตค่าใน Transportation_expenses_result
function updateTransportationTotal() {
    if (typeof calculateTotal === 'function') {
        calculateTotal();
    }
}

let reign_car_count = 1;

function addReignCarLine() {
  reign_car_count++;

  const reignRow = document.createElement("div");
  reignRow.className = "reign_car_row";
  reignRow.dataset.index = reign_car_count;
  reignRow.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 8px;">
      <label style="display: flex; justify-content: space-between; align-items: center; width: 75%;">
        รถยนต์ของทางราชการ:
        <input type="text" id="reign_plate_${reign_car_count}" placeholder="หมายเลขทะเบียนรถ" style="width: 20%; margin: 0;">
        <input type="text" id="reign_driver_${reign_car_count}" placeholder="พนักงานขับรถ" style="width: 25%; margin: 0;">
        <input type="text" id="reign_distance_${reign_car_count}" class="comma-number" placeholder="ระยะทาง" style="width: 10%; margin: 0;">
        <input type="text" id="reign_amount_${reign_car_count}" class="comma-number" placeholder="จำนวนเงิน" style="width: 10%; margin: 0;">
      </label>
      <button type="button" class="add-btn" onclick="removerow(this)" style="background-color: red; color: #fff; margin: 0; margin-right: 16.8%; width: 6.2%;">&minus;</button>
    </div>
  `;
  document.getElementById("reign_car_rows").appendChild(reignRow);

  const compRow = document.createElement("div");
  compRow.className = "katoptan_row";
  compRow.dataset.index = reign_car_count;
  compRow.innerHTML = `
    <div style="width: 100%; display: flex; justify-content: space-between;">
      <div>
        <input type="text" id="comp_name_${reign_car_count}" placeholder="ชื่อ-นามสกุล">
        <input id="ggx1_${reign_car_count}" type="text" class="comma-number" placeholder="ค่าตอบแทนพนักงานขับรถ" style="margin: 0;"> X 
        <input id="ggx2_${reign_car_count}" type="text" class="comma-number" placeholder="จำนวนวัน" style="margin: 0;">
      </div>
      <div class="cost_display" style="align-items: center; margin: 0; margin-bottom: 1%;" >
        <p style="margin: 0; display: flex; align-items: center;">เป็นจำนวนเงิน&nbsp;</p>
        <span id="reign_car4412_result_${reign_car_count}" style="margin: 0; display: flex; align-items: center;">0</span>
        <p style="margin: 0; display: flex; align-items: center;">&nbsp;บาท</p>
      </div>
    </div>
  `;
  document.getElementById("katoptan").appendChild(compRow);

  // Sync driver name
  const driverInput = document.getElementById(`reign_driver_${reign_car_count}`);
  const nameInput = document.getElementById(`comp_name_${reign_car_count}`);
  if (driverInput && nameInput) {
    driverInput.addEventListener("input", () => nameInput.value = driverInput.value);
    nameInput.addEventListener("input", () => driverInput.value = nameInput.value);
  }

  // Add event for auto-calc compensation
  document.getElementById(`ggx1_${reign_car_count}`).addEventListener("input", calculateReignCarDriverCompensation);
  document.getElementById(`ggx2_${reign_car_count}`).addEventListener("input", calculateReignCarDriverCompensation);
  
  // เพิ่ม event listeners สำหรับ input ใหม่เพื่ออัปเดต Transportation_expenses_result
  const newInputs = reignRow.querySelectorAll('input');
  newInputs.forEach(input => {
    input.addEventListener('input', updateTransportationTotal);
  });
  
  // เพิ่ม event listeners สำหรับ input ในแถวค่าตอบแทน
  const compInputs = compRow.querySelectorAll('input');
  compInputs.forEach(input => {
    input.addEventListener('input', updateTransportationTotal);
  });
}

function removerow(button) {
  let row = button.parentElement;
  while (row && !row.classList.contains("reign_car_row")) {
    row = row.parentElement;
  }

  if (!row) return;

  const index = row.dataset.index;
  if (!index) return;

  const reignRow = document.querySelector(`.reign_car_row[data-index="${index}"]`);
  const compRow = document.querySelector(`.katoptan_row[data-index="${index}"]`);

  reignRow?.remove();
  compRow?.remove();

}




