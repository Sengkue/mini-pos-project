import { defineLocale } from "../composables/defineLocale.js";
export default defineLocale({
  name: "Espa\xF1ol",
  code: "es",
  messages: {
    inputMenu: {
      noMatch: "No hay datos coincidentes",
      noData: "Sin datos",
      create: 'Crear "{label}"'
    },
    calendar: {
      prevYear: "A\xF1o anterior",
      nextYear: "A\xF1o siguiente",
      prevMonth: "Mes anterior",
      nextMonth: "Mes siguiente"
    },
    inputNumber: {
      increment: "Incremento",
      decrement: "Decremento"
    },
    commandPalette: {
      placeholder: "Escribe un comando o busca...",
      noMatch: "No hay datos coincidentes",
      noData: "Sin datos",
      close: "Cerrar",
      back: "Atr\xE1s"
    },
    selectMenu: {
      noMatch: "No hay datos coincidentes",
      noData: "Sin datos",
      create: 'Crear "{label}"',
      search: "Buscar..."
    },
    toast: {
      close: "Cerrar"
    },
    carousel: {
      prev: "Anterior",
      next: "Siguiente",
      dots: "Elegir diapositiva a mostrar",
      goto: "Ir a la diapositiva {slide}"
    },
    modal: {
      close: "Cerrar"
    },
    slideover: {
      close: "Cerrar"
    },
    alert: {
      close: "Cerrar"
    },
    table: {
      noData: "Sin datos"
    },
    fileUpload: {
      removeFile: "Eliminar {filename}"
    }
  }
});
