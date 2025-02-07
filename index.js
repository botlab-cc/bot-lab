<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario de Contacto Genesys</title>
    <style>
        /* Estilos para el modal */
        #myModal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.4);
        }

        .modal-content {
            background-color: white;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 50%;
        }

        .close {
            float: right;
            font-size: 28px;
            cursor: pointer;
        }

        /* Ocultar campos */
        .hidden-field {
            display: none;
        }
    </style>
</head>
<body>

    <button id="toggleButton">Abrir Formulario</button>

    <div id="myModal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Formulario de Contacto</h2>
            <form id="callbackForm">
                <label for="name">Nombre:</label>
                <input type="text" id="name" required><br><br>

                <label for="phone">Teléfono:</label>
                <input type="tel" id="phone" required><br><br>

                <!-- Campos ocultos -->
                <input type="hidden" id="surname" value="">
                <input type="hidden" id="email" value="">

                <button type="submit">Enviar</button>
            </form>
        </div>
    </div>

    <script>
        const clientId = "de850a88-2b15-45b1-995d-38b94860dfaf"; // Client ID de Genesys
        const redirectUri = "https://botlab-cc.github.io/bot-lab/"; // Tu URL de GitHub Pages
        const authUrl = `https://login.mypurecloud.ie/oauth/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&state=12345`;

        function authorizeUser() {
            window.location.href = authUrl;
        }

        function getAccessTokenFromUrl() {
            const hash = window.location.hash;
            if (hash.includes("access_token")) {
                const params = new URLSearchParams(hash.substring(1));
                return params.get("access_token");
            } else {
                alert("No se encontró ningún token en la URL.");
                return null;
            }
        }

        async function createContact(name, phone) {
            const accessToken = getAccessTokenFromUrl();
            if (!accessToken) {
                alert("No se pudo obtener el token de acceso.");
                return;
            }

            const apiUrl = "https://api.mypurecloud.ie/api/v2/outbound/contactlists/74832173-7c59-4e01-8844-b4ab999fe103/contacts";

            const contactData = [
                {
                    data: {
                        NOMBRE: name,
                        APELLIDO1: "",  // Enviado en blanco
                        TELEFONO: phone,
                        MAIL: ""  // Enviado en blanco
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

                alert("Contacto creado exitosamente");
            } catch (error) {
                console.error("Error en createContact:", error);
                alert("Ocurrió un error al crear el contacto.");
            }
        }

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

        document.getElementById("callbackForm").onsubmit = function(event) {
            event.preventDefault();
            const name = document.getElementById("name").value;
            const phone = document.getElementById("phone").value;

            createContact(name, phone);
        };

        window.onload = function() {
            if (!window.location.hash.includes("access_token")) {
                authorizeUser();
            }
        };
    </script>

</body>
</html>
