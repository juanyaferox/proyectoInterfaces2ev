/**
 * Función para cambiar la página a modo oscuro
 */
function setDarkMode() {
  const button = document.getElementById("fixedButton");

  document.body.style.backgroundColor = "#333333";
  const style = document.createElement('style');
  document.head.appendChild(style);
  style.sheet.insertRule("#fixedButton:hover { background-color: #333333; }", style.sheet.cssRules.length);
  button.style.color = "white";
  const footer = document.querySelector("footer");
  if (footer) {
    footer.style.backgroundColor = "#333333";
    footer.style.color = "#ffffff";
  }
  const headerParagraphs = document.querySelectorAll("header p");
  headerParagraphs.forEach(p => {
    p.style.color = "#ffffff"
  });
  const headerLinks = document.querySelectorAll("header nav ul li a");
  headerLinks.forEach(link => {
    link.style.color = "#ffffff";
  });
  const contactForm = document.querySelector(".contactForm");
  if (contactForm) {
    contactForm.style.backgroundColor = "#4b4b4b44";
  }
  const headerImages = document.querySelectorAll("header p img");
  headerImages.forEach((img) => {
    img.style.filter = "brightness(1.2) saturate(75%) drop-shadow(0 0 0 #333) drop-shadow(0 0 1px #333)";
  });

  button.removeAttribute("lightmode");
  button.textContent = "Cambiar a modo claro";

  document.querySelectorAll("nav ul li a img").forEach((img) => {
    img.style.filter = "invert(0%)";
  });

  document.cookie = "darkmode=true; path=/";
}

/**
 * Función para cambiar la página a modo claro
 */
function setLightMode() {
  const button = document.getElementById("fixedButton");

  document.body.style.backgroundColor = "#ffffff";
  const style = document.createElement('style');
  document.head.appendChild(style);
  style.sheet.insertRule("#fixedButton:hover { background-color: #ffffff; }", style.sheet.cssRules.length);
  button.style.color = "#333";
  const footer = document.querySelector("footer");
  if (footer) {
    footer.style.backgroundColor = "#ffffff";
    footer.style.color = "#333333";
  }
  const headerParagraphs = document.querySelectorAll("header p");
  headerParagraphs.forEach(p => {
    p.style.color = "#333333";
  });
  const headerLinks = document.querySelectorAll("header nav ul li a");
  headerLinks.forEach(link => {
    link.style.color = "#333333";
  });
  const contactForm = document.querySelector(".contactForm");
  if (contactForm) {
    contactForm.style.backgroundColor = "#e7e7e7a9";
  }
  const headerImages = document.querySelectorAll("header p img");
  headerImages.forEach((img) => {
    img.style.filter = "brightness(1.2) saturate(75%) drop-shadow(0 0 0 #ffffff) drop-shadow(0 0 1px #ffffff)";
  });

  button.setAttribute("lightmode", "");
  button.textContent = "Cambiar a modo oscuro";

  document.querySelectorAll("nav ul li a img").forEach((img) => {
    img.style.filter = "invert(100%)";
  });

  document.cookie = "darkmode=false; path=/";
}


/**
 *
 * @param {*} name nombre de la key a obtener el value de la cookie
 * @returns value si se encontro null si no
 */
function getCookie(name) {
  let cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");
    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

function loadCSS(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Función para cargar el head, header, el footer y el boton de hamburguesa
 */
document.addEventListener("DOMContentLoaded", function () {

  // Cargar el header y el boton de hamburguesa
  fetch("../html/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("header").innerHTML = data;

      const menuToggle = document.querySelector('.menu-toggle');
      if (menuToggle) {
        menuToggle.addEventListener('click', () => {
        document.querySelector('nav ul').classList.toggle('show');
        });
      }
    });

  // Cargar el head
  fetch('../html/head.html')
        .then(response => response.text())
        .then(data => {
          const head = document.head;
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = data;
          while (tempDiv.firstChild) {
              head.appendChild(tempDiv.firstChild);
          }
        });

  // Carga el footer
  fetch("../html/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("footer").innerHTML = data;

      // Aseguramos de actuar sobre el botón una vez el botón este cargado
      // Evalua las cookies para el tema por defecto
      getCookie("darkmode") === "true" ? setDarkMode() : setLightMode();

      // Añade la funcion al boton de de cambiar de tema
      const button = document.getElementById("fixedButton");
      button.addEventListener("click", function () {
        if (button.getAttribute("lightmode") == null) {
            console.log("a claro");
          setLightMode();
        } else {
            console.log("a oscuro");
          setDarkMode();
        }
      });
    });

    const imageContainers = document.querySelectorAll('.image-container');

    imageContainers.forEach(container => {
        const images = container.querySelectorAll('img');
        const leftArrow = container.querySelector('.arrow.left');
        const rightArrow = container.querySelector('.arrow.right');
        let currentIndex = 0;

        function showImage(index) {
            images.forEach((img, i) => {
                img.classList.remove('active', 'next');
                if (i === index) {
                    img.classList.add('active');
                } else if (i === (index + 1) % images.length) {
                    img.classList.add('next');
                }
            });
        }

        function showNextImage() {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }

        function showPreviousImage() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        }

        leftArrow.addEventListener('click', showPreviousImage);
        rightArrow.addEventListener('click', showNextImage);

        // Inicializar la primera imagen
        showImage(currentIndex);

        const imageContainers = document.querySelectorAll('.image-container img');
        const modal = document.getElementById('modal');
        const modalImg = document.getElementById('modal-img');
        const closeBtn = document.querySelector('.close');
         // Para la ventana modal
         imageContainers.forEach(img => {
          img.addEventListener('click', function() {
              modal.classList.add('show');
              modalImg.src = this.src;
          });

          closeBtn.addEventListener('click', function() {
            modal.classList.remove('show');
        });

        modal.addEventListener('click', function(event) {
          if (event.target === modal || event.target === modalImg) {
              modal.classList.remove('show');
          }
      });
      });

    });
    
});

/** API de Google para el google Maps de como llegar */
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${
  c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
      ({key: "AIzaSyAAnw3SFonUWFm5fXYhCEgiQQsoFS0BWN8", v: "weekly"});
/**
    * @license
    * Copyright 2019 Google LLC. All Rights Reserved.
    * SPDX-License-Identifier: Apache-2.0
    */
    // Initialize and add the map
    let map;
    async function initMap() {
      // The location of Uluru
      const position = { lat: 43.53366, lng: -7.04029 };
      // Request needed libraries.
      //@ts-ignore
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      map = new Map(document.getElementById("map"), {
        zoom: 12, // Set the default zoom level here
        center: position,
        mapId: "DEMO_MAP_ID",
      });
      const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "Ribadeo",
      });
    }
    initMap();