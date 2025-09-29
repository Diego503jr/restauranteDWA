const toastEl = document.getElementById("messageContent");
const messageBody = document.getElementById("messageBody");
const toast = new bootstrap.Toast(toastEl);

let notis = JSON.parse(localStorage.getItem('notis')) || [];

notis = notis.map(noti => ({
    ...noti,
    fechaReserva: new Date(noti.fechaReserva),
    horaReserva: new Date(noti.horaReserva)
}));

document.addEventListener('DOMContentLoaded', function () {

    let contador = Number(localStorage.getItem('contador')) || 0;

    //PICKERS (FECHA Y HORA)
    const fechaPicker = flatpickr("#fechaReserva", {
        dateFormat: "d-m-y",
        minDate: "today",
        wrap: false
    });

    const horaPicker = flatpickr("#horaReserva", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        altInput: true,
        altFormat: "H:i",
        time_24hr: true,
        minuteIncrement: 5,
        minTime: "11:00",
        maxTime: "22:00"
    });

    //Variable reserva
    let nombreReserva;
    let fechaReserva;
    let horaReserva;
    let personasReserva;

    //RESERVA
    document.getElementById("reservaForm").addEventListener("submit", function (e) {
        e.preventDefault();


        nombreReserva = document.getElementById("nombreReserva");
        fechaReserva = fechaPicker.selectedDates[0];
        horaReserva = horaPicker.selectedDates[0];
        personasReserva = document.getElementById("personasReserva");
        // const fechaReserva = document.getElementById("fechaReserva");
        // const horaReserva = document.getElementById("horaReserva");

        const fechaHoraVal = validarFechaHora();

        if (nombreReserva.value.trim() === '') {
            mostrarToastError('Ingrese un nombre válido');
            return;
        }
        if (!fechaHoraVal.valido) {
            mostrarToastError(fechaHoraVal.mensaje);
            return;
        }

        notis.push({ nombreReserva: nombreReserva.value, fechaReserva, horaReserva, personasReserva: personasReserva.value });
        contador = contador + 1;
        localStorage.setItem('contador', contador);
        localStorage.setItem('notis', JSON.stringify(notis));
        updateNumber();

        toastEl.className = "toast align-items-center text-white bg-success border-0";
        messageBody.textContent = "✅ Éxito, se registró su reserva";
        toast.show();

        setTimeout(() => {
            nombreReserva.value = "";
            fechaPicker.clear();
            horaPicker.clear();
            personasReserva.value = "";
        }, 3000);
    });

    function mostrarToastError(mensaje) {
        toastEl.className = "toast align-items-center text-white bg-danger border-0";
        messageBody.textContent = "❌ " + mensaje;
        toast.show();
    }

    //Validaciones
    function validarFechaHora() {
        if (!fechaReserva || !horaReserva) {
            return { valido: false, mensaje: "Debe seleccionar fecha y hora" };
        }

        const fechaHoraReserva = new Date(
            fechaReserva.getFullYear(),
            fechaReserva.getMonth(),
            fechaReserva.getDate(),
            horaReserva.getHours(),
            horaReserva.getMinutes()
        );

        if (fechaHoraReserva <= new Date()) {
            return { valido: false, mensaje: "La fecha y hora deben ser futuras" };
        }

        return { valido: true, mensaje: "" };
    }


    //ACTUALIZAR MODAL
    function updateModal() {
        const reservasItems = document.getElementById('reservasItems');

        reservasItems.innerHTML = '';

        if (notis.length === 0) {
            reservasItems.innerHTML = `<p>No hay reservas.</p>`;
            return;
        }

        const table = document.createElement('table');
        table.classList.add('table', 'table-striped');

        table.innerHTML = `
        <thead>
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Personas</th>
                <th>Estado</th>
                <th>Eliminar</th>
            </tr>
        </thead>
        <tbody></tbody>`;

        const tbody = table.querySelector('tbody');

        notis.forEach((noti, index) => {
            const row = document.createElement('tr');
            const fechaReservaFinDia = new Date(
                noti.fechaReserva.getFullYear(),
                noti.fechaReserva.getMonth(),
                noti.fechaReserva.getDate(),
                23, 59, 59
            );

            //const fechaPrueba = new Date(2025, 8, 28, 23, 59, 59); 
            // Comparar con fecha actual
            //const estadoIcon = fechaReservaFinDia < fechaPrueba
            const estadoIcon = fechaReservaFinDia < new Date()
                ? '<i class="bi bi-check-circle-fill text-success" id="finalizado"></i>'
                : '<i class="bi bi-x-square-fill text-danger" id="programado"></i>';

            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${noti.nombreReserva}</td>
            <td>${noti.fechaReserva.toLocaleDateString()}</td>
            <td>${noti.horaReserva.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            <td>${noti.personasReserva}</td>
             <td>${estadoIcon}</td>
           <td><i class="bi bi-trash trash-icon remove-item" data-index="${index}" style="cursor:pointer"></i></td>
        `;
            tbody.appendChild(row);
        });

        reservasItems.appendChild(table);

        // Evento para eliminar registros
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.dataset.index;
                notis.splice(index, 1);
                localStorage.setItem('notis', JSON.stringify(notis));
                updateModal();
            });
        });
    }

    //ACTUALIZAR NÚMERO DE NOTIFICACIONES
    function updateNumber() {
        const numberContent = document.getElementById('numberContent');
        //const count = notis.length;
        numberContent.textContent = contador;
        numberContent.style.display = contador > 0 ? 'block' : 'none';
    }

    document.getElementById('verReservas').addEventListener('click', function () {
        //localStorage.removeItem('notis');
        contador = 0;
        localStorage.setItem('contador', contador);
        updateModal();
        updateNumber();
    });

    //ACTUALIZAR NOTIFICACIONES CUANDO SE REINICIA
    updateNumber();

    const reservasModal = document.getElementById('verReservasModal');
    reservasModal.addEventListener('show.bs.modal', function () {
        updateModal();

        const numberContent = document.getElementById('numberContent');
        numberContent.textContent = 0;
        numberContent.style.display = 'none';
    });

});


//CONTACTO
document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombreContacto = document.getElementById("nombreContacto");
    const emailContacto = document.getElementById("emailContacto");
    const mensajeContacto = document.getElementById("mensajeContacto");

    if (!nombreContacto.value.trim()) {
        mostrarToastError("Debe ingresar su nombre");
        return;
    }
    if (!emailContacto.value.trim()) {
        mostrarToastError("Debe ingresar su correo");
        return;
    }
    if (!mensajeContacto.value.trim()) {
        mostrarToastError("Debe escribir un mensaje");
        return;
    }

    toastEl.className = "toast align-items-center text-white bg-success border-0";
    messageBody.textContent = "✅ Éxito, se envió su mensaje";
    toast.show();

    setTimeout(() => {
        nombreContacto.value = "";
        emailContacto.value = "";
        mensajeContacto.value = "";
    }, 3000);
});

//Cómo llegar - API navigator.geolocation
document.addEventListener("DOMContentLoaded", () => {
    const btnRuta = document.getElementById("btnRuta");

    if (btnRuta) {
        btnRuta.addEventListener("click", () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;

                        //Prueba Ubicación actual: Metrocentro SS
                        // const lat = 13.7063597;
                        // const lng = -89.2130952;

                        // Destino Multiplaza 
                        const destinoLat = 13.6789008;
                        const destinoLon = -89.2496607;

                        // Abrir Google Maps con la ruta
                        const url = `https://www.google.com/maps/dir/${lat},${lng}/${destinoLat},${destinoLon}`;
                        window.open(url, "_blank");
                    },
                    (error) => {
                        alert("No se pudo obtener tu ubicación: " + error.message);
                    }
                );
            } else {
                alert("Tu navegador no soporta geolocalización.");
            }
        });
    }
});

//CHATBOT
document.addEventListener("DOMContentLoaded", () => {
    const chatbotBtn = document.getElementById("chatbotBtn");
    const chatbotWindow = document.getElementById("chatbotWindow");
    const closeChatbot = document.getElementById("closeChatbot");
    const chatbotMessages = document.getElementById("chatbotMessages");
    const chatbotInput = document.getElementById("chatbotInput");
    const sendMessage = document.getElementById("sendMessage");

    const respuestas = {
        "hola": "¡Hola! Soy DeliBot. ¿Cómo puedo ayudarte?.",
        "horario": "Nuestro horario es de lunes a domingo, de 11:00 AM a 10:00 PM.",
        "dirección": "Estamos en el segundo nivel de Las Terrazas, Multiplaza. Antiguo Cuscatlán , El Salvador.",
        "direccion": "Estamos en el segundo nivel de Las Terrazas, Multiplaza. Antiguo Cuscatlán , El Salvador.",
        "ubicación": "Estamos en el segundo nivel de Las Terrazas, Multiplaza. Antiguo Cuscatlán , El Salvador.",
        "ubicacion": "Estamos en el segundo nivel de Las Terrazas, Multiplaza. Antiguo Cuscatlán , El Salvador.",
        "promoción": "Tenemos 2x1 en bebidas todos los viernes de 6:00 a 8:00 PM.",
        "promocion": "Tenemos 2x1 en bebidas todos los viernes de 6:00 a 8:00 PM.",
        "reserva": "Puedes hacer una reservación en el formulario de resrva o llamando al +503 1234 5678.",
        "gracias": "¡Con gusto! Ten un excelente día"
    };

    // Mostrar / ocultar ventana del chatbot
    chatbotBtn.addEventListener("click", () => {
        chatbotWindow.classList.toggle("d-none");
    });

    closeChatbot.addEventListener("click", () => {
        chatbotWindow.classList.add("d-none");
    });

    // Enviar mensaje
    function enviarMensaje() {
        const texto = chatbotInput.value.trim();
        if (texto === "") return;

        // Mostrar mensaje del usuario
        chatbotMessages.innerHTML += `
      <div class="text-end mb-2">
        <span class="badge bg-primary">${texto}</span>
      </div>`;

        chatbotInput.value = "";

        // Respuesta del bot
        const lowerText = texto.toLowerCase();
        let respuesta = "Lo siento, no entendí tu pregunta. Intenta con: horario, dirección, promoción, reservar.";

        for (let clave in respuestas) {
            if (lowerText.includes(clave)) {
                respuesta = respuestas[clave];
                break;
            }
        }

        setTimeout(() => {
            chatbotMessages.innerHTML += `
        <div class="text-start mb-2">
          <span class="badge bg-secondary">${respuesta}</span>
        </div>`;
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 500);
    }

    sendMessage.addEventListener("click", enviarMensaje);
    chatbotInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") enviarMensaje();
    });
});





