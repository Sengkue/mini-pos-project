import { defineLocale } from "../composables/defineLocale.js";
export default defineLocale({
  name: "Sloven\u0161\u010Dina",
  code: "sl",
  messages: {
    inputMenu: {
      noMatch: "Ni ujemanj",
      noData: "Ni podatkov",
      create: 'Ustvari "{label}"'
    },
    calendar: {
      prevYear: "Prej\u0161nje leto",
      nextYear: "Naslednje leto",
      prevMonth: "Prej\u0161nji mesec",
      nextMonth: "Naslednji mesec"
    },
    inputNumber: {
      increment: "Povi\u0161aj",
      decrement: "Zmanj\u0161aj"
    },
    commandPalette: {
      placeholder: "Vpi\u0161i ukaz ali i\u0161\u010Di...",
      noMatch: "Ni ujemanj",
      noData: "Ni podatkov",
      close: "Zapri",
      back: "Nazaj"
    },
    selectMenu: {
      noMatch: "Ni ujemanj",
      noData: "Ni podatkov",
      create: 'Ustvari "{label}"',
      search: "I\u0161\u010Di..."
    },
    toast: {
      close: "Zapri"
    },
    carousel: {
      prev: "Nazaj",
      next: "Naprej",
      dots: "Izberite diapozitiv za prikaz",
      goto: "Pojdi na {slide}"
    },
    modal: {
      close: "Zapri"
    },
    slideover: {
      close: "Zapri"
    },
    alert: {
      close: "Zapri"
    },
    table: {
      noData: "Ni podatkov"
    },
    fileUpload: {
      removeFile: "Odstrani {filename}"
    }
  }
});
