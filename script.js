const initialCars = [
  { id: 1, plate: 'ABC-1234', model: 'BYD Dolphin', battery: 22, chargeTime: 45, status: 'waiting' },
  { id: 2, plate: 'DEF-5678', model: 'BYD Seal', battery: 15, chargeTime: 35, status: 'charging', progress: 62 },
  { id: 3, plate: 'GHI-9012', model: 'BYD Atto 3', battery: 40, chargeTime: 28, status: 'completed' }
];

const state = {
  cars: [...initialCars],
  nextId: 4
};

const queueList = document.getElementById('queueList');
const waitingCount = document.getElementById('waitingCount');
const chargingCount = document.getElementById('chargingCount');
const completedCount = document.getElementById('completedCount');
const avgTime = document.getElementById('avgTime');
const nextVehicle = document.getElementById('nextVehicle');
const nextVehicleDetail = document.getElementById('nextVehicleDetail');
const addCarModal = document.getElementById('addCarModal');
const carForm = document.getElementById('carForm');
const addCarBtn = document.getElementById('addCarBtn');
const simulateBtn = document.getElementById('simulateBtn');
const startNextBtn = document.getElementById('startNextBtn');
const finishCurrentBtn = document.getElementById('finishCurrentBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

function render() {
  const waiting = state.cars.filter((car) => car.status === 'waiting');
  const charging = state.cars.filter((car) => car.status === 'charging');
  const completed = state.cars.filter((car) => car.status === 'completed');
  const avg = Math.round(
    state.cars.reduce((total, car) => total + (car.chargeTime || 0), 0) / Math.max(state.cars.length, 1)
  );

  waitingCount.textContent = waiting.length;
  chargingCount.textContent = charging.length;
  completedCount.textContent = completed.length;
  avgTime.textContent = `${avg} min`;

  const nextCar = waiting[0];
  if (nextCar) {
    nextVehicle.textContent = `${nextCar.plate} · ${nextCar.model}`;
    nextVehicleDetail.textContent = `${nextCar.chargeTime} min estimado`;
  } else {
    nextVehicle.textContent = 'Nenhum';
    nextVehicleDetail.textContent = 'Aguardando chegada';
  }

  const sortedCars = [...state.cars].sort((a, b) => {
    const order = { waiting: 0, charging: 1, completed: 2 };
    return order[a.status] - order[b.status];
  });

  queueList.innerHTML = sortedCars
    .map((car) => {
      const progress = car.status === 'charging' ? `${car.progress || 0}%` : '0%';
      const progressWidth = car.status === 'charging' ? `${car.progress || 0}%` : '0%';
      return `
        <article class="queue-item">
          <div class="queue-top">
            <div>
              <strong>${car.plate}</strong>
              <div>${car.model}</div>
            </div>
            <span class="badge ${car.status}">${statusLabel(car.status)}</span>
          </div>
          <div>Bateria: ${car.battery}% · Estimativa: ${car.chargeTime} min</div>
          ${car.status === 'charging' ? `
            <div class="progress-track">
              <div class="progress-bar" style="width: ${progressWidth}"></div>
            </div>
          ` : ''}
        </article>
      `;
    })
    .join('');
}

function statusLabel(status) {
  const labels = {
    waiting: 'Na fila',
    charging: 'Carregando',
    completed: 'Concluído'
  };
  return labels[status] || status;
}

function openModal() {
  addCarModal.showModal();
}

function closeModal() {
  addCarModal.close();
  carForm.reset();
}

function addCar(event) {
  event.preventDefault();
  const formData = new FormData(carForm);
  const newCar = {
    id: state.nextId++,
    plate: formData.get('plate').toString().toUpperCase(),
    model: formData.get('model').toString(),
    battery: Number(formData.get('battery')),
    chargeTime: Number(formData.get('chargeTime')),
    status: 'waiting'
  };

  state.cars.push(newCar);
  render();
  closeModal();
}

function startNext() {
  const waitingCar = state.cars.find((car) => car.status === 'waiting');
  if (!waitingCar) return;
  waitingCar.status = 'charging';
  waitingCar.progress = 10;
  render();
}

function finishCurrent() {
  const chargingCar = state.cars.find((car) => car.status === 'charging');
  if (!chargingCar) return;
  chargingCar.status = 'completed';
  chargingCar.progress = 100;
  render();
}

function simulateArrival() {
  const models = ['BYD Dolphin', 'BYD Seal', 'BYD Atto 3', 'BYD Han'];
  const plate = `SIM-${Math.floor(1000 + Math.random() * 9000)}`;
  state.cars.push({
    id: state.nextId++,
    plate,
    model: models[Math.floor(Math.random() * models.length)],
    battery: Math.floor(10 + Math.random() * 70),
    chargeTime: 20 + Math.floor(Math.random() * 40),
    status: 'waiting'
  });
  render();
}

function tickProgress() {
  state.cars.forEach((car) => {
    if (car.status === 'charging') {
      car.progress = Math.min((car.progress || 0) + 8, 100);
      if (car.progress >= 100) {
        car.status = 'completed';
      }
    }
  });
  render();
}

addCarBtn.addEventListener('click', openModal);
simulateBtn.addEventListener('click', simulateArrival);
startNextBtn.addEventListener('click', startNext);
finishCurrentBtn.addEventListener('click', finishCurrent);
closeModalBtn.addEventListener('click', closeModal);
carForm.addEventListener('submit', addCar);
addCarModal.addEventListener('click', (event) => {
  if (event.target === addCarModal) closeModal();
});

setInterval(tickProgress, 1000);
render();
