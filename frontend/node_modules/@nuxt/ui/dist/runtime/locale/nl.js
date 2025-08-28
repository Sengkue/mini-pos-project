import { defineLocale } from "../composables/defineLocale.js";
export default defineLocale({
  name: "Nederlands",
  code: "nl",
  messages: {
    inputMenu: {
      noMatch: "Geen overeenkomende gegevens",
      noData: "Geen gegevens",
      create: '"{label}" cre\xEBren'
    },
    calendar: {
      prevYear: "Vorig jaar",
      nextYear: "Volgend jaar",
      prevMonth: "Vorige maand",
      nextMonth: "Volgende maand"
    },
    inputNumber: {
      increment: "Verhogen",
      decrement: "Verlagen"
    },
    commandPalette: {
      placeholder: "Typ een commando of zoek...",
      noMatch: "Geen overeenkomende gegevens",
      noData: "Geen gegevens",
      close: "Sluiten",
      back: "Terug"
    },
    selectMenu: {
      noMatch: "Geen overeenkomende gegevens",
      noData: "Geen gegevens",
      create: '"{label}" cre\xEBren',
      search: "Zoeken..."
    },
    toast: {
      close: "Sluiten"
    },
    carousel: {
      prev: "Vorige",
      next: "Volgende",
      dots: "Kies dia om weer te geven",
      goto: "Ga naar dia {slide}"
    },
    modal: {
      close: "Sluiten"
    },
    slideover: {
      close: "Sluiten"
    },
    alert: {
      close: "Sluiten"
    },
    table: {
      noData: "Geen gegevens"
    },
    fileUpload: {
      removeFile: "{filename} verwijderen"
    }
  }
});
