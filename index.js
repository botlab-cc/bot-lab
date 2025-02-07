const clientId = "de850a88-2b15-45b1-995d-38b94860dfaf"; // Client ID de Genesys
const redirectUri = "https://botlab-cc.github.io/bot-lab/"; // Tu URL de GitHub Pages
const authUrl = `https://login.mypurecloud.ie/oauth/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&state=12345`;

// Función para redirigir al usuario al login de Genesys y obtener el token de acceso
function authorizeUser() {
    window.location.href = authUrl;
}

// Función para extraer el token de la URL después de redirigir
function getAccessTokenFromUrl() {
    const hash = window.location.hash;
    console.log("Hash de la URL: ", hash); // Depuración: verificar el contenido del hash

    if (hash.includes("access_token")) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        
        console.log("Token de acceso obtenido: ", accessToken); // Depuración: mostrar el token

        return accessToken;
    } else {
        console.error("No se encontró ningún token en la URL.");
        return null;
    }
}

// Función para crear un contacto en la API de Genesys Cloud
async function createContact(name, surname, phone, email) {
    const accessToken = getAccessTokenFromUrl(); // Obtiene el token de la URL

    if (!accessToken) {
        alert("No se pudo obtener el token de acceso.");
        return;
    }

    const apiUrl = "https://api.mypurecloud.ie/api/v2/outbound/contactlists/74832173-7c59-4e01-8844-b4ab999fe103/contacts"; // URL de tu lista de contactos en Genesys

    const contactData = [
        {
            data: {
                NOMBRE: name,
                APELLIDO1: surname,
                TELEFONO: phone,
                MAIL: email
            },
            callable: true
        }
    ];

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert(`Error al crear el contacto: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        //alert("Contacto creado exitosamente: " + JSON.stringify(data));
    } catch (error) {
        console.error("Error en createContact:", error);
        alert("Ocurrió un error al crear el contacto.");
    }
}

// Lógica para abrir el modal
document.getElementById("toggleButton").onclick = function() {
    document.getElementById("myModal").style.display = "block";
};

document.getElementsByClassName("close")[0].onclick = function() {
    document.getElementById("myModal").style.display = "none";
};

window.onclick = function(event) {
    if (event.target == document.getElementById("myModal")) {
        document.getElementById("myModal").style.display = "none";
    }
};

// Manejo del envío del formulario
document.getElementById("callbackForm").onsubmit = function(event) {
    event.preventDefault(); // Evita el envío del formulario
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const surname = document.getElementById("surname").value;
    const email = document.getElementById("email").value;

    createContact(name, surname, phone, email); // Llama a la función para crear el contacto
};

// Verificar si ya hay un token en la URL
window.onload = function() {
    if (!window.location.hash.includes("access_token")) {
        authorizeUser(); // Redirige al usuario si no tiene un token
    } else {
        const token = getAccessTokenFromUrl();
        if (!token) {
            console.error("No se ha obtenido el token de acceso. Redirigiendo nuevamente.");
            authorizeUser(); // Si no obtuvimos el token, forzamos la redirección
        }
    }
};
