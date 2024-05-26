$(document).ready(function () {
    $("#postForm").submit(async (e) => {
      e.preventDefault();
      let usuario = $("#usuario").val();
      let url = $("#url").val();
      let descripcion = $("#descripcion").val();
  
      // Verifica que los campos no estén vacíos
      if (!usuario || !url || !descripcion) {
        alert("Todos los campos son obligatorios.");
        return;
      }
  
      try {
        const { data } = await axios.post("/post", {
          usuario,
          url,
          descripcion,
        });
        $("#creado").removeClass("d-none");
        setTimeout(() => $("#creado").addClass("d-none"), 3000);
        getPosts();
      } catch (error) {
        console.error("Error creando el post:", error);
      }
    });
  
    // Función para obtener y mostrar los posts
    async function getPosts() {
      try {
        const { data } = await axios.get("/posts");
        console.log("Datos recibidos:", data); // Registro para depuración
        $(".posts").html("");
        $.each(data, (i, u) => {
          let imageUrl = u.url ? u.url : 'https://via.placeholder.com/150';
          $(".posts").append(`
            <div class="card col-12 col-sm-4 d-inline mx-0 px-3">
              <div class="card-body p-0">
                <img class="card-img-top" src="${imageUrl}" style="width: 100%" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';" />
                <div class="p-3">
                  <h4 class="card-title">${u.usuario}</h4>
                  <p class="card-text">${u.descripcion}</p>
                  <svg id="Heart-${u.id}" class="like-btn" style="width: 50px; height: 50px" viewBox="0 0 24 24" onclick="like(${u.id})">
                    <path fill="${u.likes > 0 ? 'red' : 'currentColor'}" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                  </svg>
                  <span>${u.likes || 0}</span>
                </div>
              </div>
            </div>`);
        });
      } catch (error) {
        console.error("Error obteniendo los posts:", error);
      }
    }
  
    window.like = async function (id) {
      try {
        await axios.put(`/post/${id}/like`);
        getPosts();
      } catch (error) {
        console.error("Error al dar like:", error);
      }
    };
  
    getPosts();
  });
  