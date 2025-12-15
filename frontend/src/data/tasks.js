// Przykłady użycia required:
// - "text_print" - wymaga przynajmniej 1 bloku text_print
// - { type: "variables_set", count: 2 } - wymaga przynajmniej 2 bloków variables_set
// - Można mieszać: ["text_print", { type: "variables_set", count: 2 }]
export const zadania = {
  // ========== ZMIENNE (5 zadań) ==========
  zmienne_1: {
    kategoria: "zmienne",
    tytul: "Zmienne 1: Moja ulubiona gra",
    opis: "Stwórz zmienną i zapisz w niej nazwę 'Minecraft'. Następnie wypisz wartość tej zmiennej w konsoli.",
    required: ["variables_set", "variables_get", "text_print"],
    rozwiazanie: "Minecraft",
  },
  zmienne_2: {
    kategoria: "zmienne",
    tytul: "Zmienne 2: Ile mam lat?",
    opis: "Stwórz zmienną i ustaw ją na 10. Następnie wypisz tekst 'Mam 10 lat!' używając bloku 'połącz', aby połączyć tekst 'Mam ' z wartością zmiennej i tekstem ' lat!'.",
    required: ["variables_set", "variables_get", "text_print", "text_join"],
    rozwiazanie: "Mam 10 lat!",
  },
  zmienne_3: {
    kategoria: "zmienne",
    tytul: "Zmienne 3: Licznik punktów",
    opis: "Stwórz zmienną i ustaw ją na 0. Następnie użyj bloku 'zmień ... o', aby zwiększyć ją o 100 i wypisz nową wartość.",
    required: ["variables_set", "math_change", "variables_get", "text_print"],
    rozwiazanie: "100",
  },
  zmienne_4: {
    kategoria: "zmienne",
    tytul: "Zmienne 4: Moje dane",
    opis: "Stwórz dwie zmienne: pierwszą ustaw na tekst 'Ola', drugą ustaw na tekst 'Warszawa'. Wypisz tekst 'Nazywam się Ola i mieszkam w Warszawie' używając bloku 'połącz' z wartościami tych zmiennych.",
    required: [
      { type: "variables_set", count: 2 }, // Wymaga 2 bloków ustaw zmienną
      "variables_get",
      "text_print",
      "text_join"
    ],
    rozwiazanie: "Nazywam się Ola i mieszkam w Warszawie",
  },
  zmienne_5: {
    kategoria: "zmienne",
    tytul: "Zmienne 5: Obliczenia ze zmiennymi",
    opis: "Stwórz dwie zmienne: pierwszą ustaw na 7, drugą ustaw na 5. Dodaj je do siebie i wynik zapisz w trzeciej zmiennej, a następnie wypisz wartość tej trzeciej zmiennej.",
    required: [
      { type: "variables_set", count: 3 }, // 2 zmienne + 1 do zapisania wyniku
      { type: "variables_get", count: 2 }, // użycie 2 zmiennych w obliczeniach
      "math_arithmetic",
      "text_print"
    ],
    rozwiazanie: "12",
  },

  // ========== PĘTLE (5 zadań) ==========
  petle_1: {
    kategoria: "petle",
    tytul: "Pętle 1: Powitanie 5 razy",
    opis: "Użyj pętli 'powtórz', aby wypisać słowo 'Cześć!' 5 razy. Każde powitanie w nowej linii.",
    required: ["controls_repeat_ext", "text_print"],
    rozwiazanie: "Cześć!\nCześć!\nCześć!\nCześć!\nCześć!",
  },
  petle_2: {
    kategoria: "petle",
    tytul: "Pętle 2: Liczenie do 10",
    opis: "Użyj pętli FOR, aby wypisać liczby od 1 do 10. W pętli FOR użyj zmiennej licznika i wypisz jej wartość w każdej iteracji.",
    required: ["controls_for", "variables_get", "text_print"],
    rozwiazanie: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
  },
  petle_3: {
    kategoria: "petle",
    tytul: "Pętle 3: Liczby podzielne przez 3",
    opis: "Użyj pętli FOR, aby wypisać liczby podzielne przez 3 od 3 do 15 (3, 6, 9, 12, 15). Ustaw krok pętli na 3.",
    required: ["controls_for", "text_print"],
    rozwiazanie: "3\n6\n9\n12\n15",
  },
  petle_4: {
    kategoria: "petle",
    tytul: "Pętle 4: Odliczanie",
    opis: "Użyj pętli WHILE, aby wypisać liczby od 5 do 1 (odliczanie wstecz). Stwórz zmienną i ustaw ją na 5, a następnie zmniejszaj ją w pętli, dopóki jest większa od 0.",
    required: ["controls_whileUntil", "variables_set", "math_arithmetic", "text_print", "variables_get", "logic_compare"],
    rozwiazanie: "5\n4\n3\n2\n1",
  },
  petle_5: {
    kategoria: "petle",
    tytul: "Pętle 5: Gwiazdki",
    opis: "Użyj pętli 'powtórz', aby wypisać 8 gwiazdek w jednej linii: ******** (Wskazówka: użyj bloku 'połącz' w pętli, aby łączyć gwiazdki)",
    required: ["controls_repeat_ext", "text_print", "text_join"],
    rozwiazanie: "********",
  },

  // ========== WARUNKI (5 zadań) ==========
  warunki_1: {
    kategoria: "warunki",
    tytul: "Warunki 1: Parzysta czy nieparzysta?",
    opis: "Sprawdź, czy liczba 9 jest parzysta (czy reszta z dzielenia przez 2 równa się 0). Jeśli tak, wypisz 'parzysta', jeśli nie, wypisz 'nieparzysta'.",
    required: ["controls_if", "logic_compare", "math_modulo", "text_print"],
    rozwiazanie: "nieparzysta",
  },
  warunki_2: {
    kategoria: "warunki",
    tytul: "Warunki 2: Czy mogę iść do kina?",
    opis: "Masz 25 zł, a bilet do kina kosztuje 20 zł. Sprawdź, czy 25 jest większe od 20. Jeśli tak, wypisz 'Mogę iść do kina!', w przeciwnym razie wypisz 'Muszę oszczędzać'.",
    required: ["controls_if", "logic_compare", "text_print"],
    rozwiazanie: "Mogę iść do kina!",
  },
  warunki_3: {
    kategoria: "warunki",
    tytul: "Warunki 3: Właściwa temperatura",
    opis: "Sprawdź, czy temperatura 22 stopnie jest większa od 15 I mniejsza od 30. Jeśli oba warunki są spełnione, wypisz 'Idealna temperatura!', w przeciwnym razie wypisz 'Za zimno lub za gorąco'.",
    required: ["controls_if", "logic_compare", "logic_operation", "text_print"],
    rozwiazanie: "Idealna temperatura!",
  },
  warunki_4: {
    kategoria: "warunki",
    tytul: "Warunki 4: Która liczba większa?",
    opis: "Stwórz dwie zmienne: pierwszą ustaw na 13, drugą ustaw na 12. Sprawdź, czy pierwsza zmienna jest większa lub równa drugiej zmiennej. Jeśli tak, wypisz 'Możesz wejść', w przeciwnym razie wypisz 'Jesteś za młody'.",
    required: ["variables_set", "controls_if", "logic_compare", "variables_get", "text_print"],
    rozwiazanie: "Możesz wejść",
  },

  // ========== TEKST (4 zadania) ==========
  tekst_1: {
    kategoria: "tekst",
    tytul: "Tekst 1: Moje ulubione zwierzę",
    opis: "Wypisz nazwę 'Pies' w konsoli używając bloku 'wypisz'.",
    required: ["text_print", "text"],
    rozwiazanie: "Pies",
  },
  tekst_2: {
    kategoria: "tekst",
    tytul: "Tekst 2: Powitanie",
    opis: "Użyj bloku 'połącz', aby połączyć słowa 'Cześć' i '! Jestem programistą.' (zauważ spację!) i wypisz wynik.",
    required: ["text_print", "text_join"],
    rozwiazanie: "Cześć! Jestem programistą.",
  },
  tekst_3: {
    kategoria: "tekst",
    tytul: "Tekst 3: Zdanie z trzech części",
    opis: "Użyj bloku 'połącz', aby połączyć trzy części: 'Dzisiaj', ' jest' i ' piękny dzień!' (zauważ spacje!). Wypisz wynik.",
    required: ["text_print", "text_join"],
    rozwiazanie: "Dzisiaj jest piękny dzień!",
  },
  tekst_4: {
    kategoria: "tekst",
    tytul: "Tekst 4: Długie zdanie",
    opis: "Użyj bloku 'połącz', aby połączyć cztery części: 'Programowanie', ' to', ' super' i ' zabawa!' (zauważ spacje!). Wypisz wynik.",
    required: ["text_print", "text_join"],
    rozwiazanie: "Programowanie to super zabawa!",
  },
  tekst_5: {
    kategoria: "tekst",
    tytul: "Tekst 5: Ile liter ma słowo?",
    opis: "Użyj bloku 'długość', aby sprawdzić ile liter ma słowo 'Krokodyl'. Wypisz wynik.",
    required: ["text_length", "text_print"],
    rozwiazanie: "8",
  },
  tekst_6: {
    kategoria: "tekst",
    tytul: "Tekst 6: Wielkie litery",
    opis: "Użyj bloku 'zmiana wielkości liter', aby zmienić tekst 'cicho sza' na wielkie litery i wypisz wynik.",
    required: ["text_changeCase", "text_print"],
    rozwiazanie: "CICHO SZA",
  },

  // ========== MATEMATYCZNE (5 zadań) ==========
  matematyczne_1: {
    kategoria: "matematyczne",
    tytul: "Matematyczne 1: Reszta z dzielenia",
    opis: "Dzielisz 17 cukierków między 5 przyjaciół. Oblicz ile cukierków zostanie (reszta z dzielenia 17 przez 5) używając bloku modulo i wypisz wynik.",
    required: ["math_modulo", "text_print"],
    rozwiazanie: "2",
  },
  matematyczne_2: {
    kategoria: "matematyczne",
    tytul: "Matematyczne 2: Obliczenia ze zmiennymi",
    opis: "Stwórz dwie zmienne: pierwszą ustaw na 20, drugą ustaw na 3. Oblicz ile zapłacisz (pierwsza * druga) i wynik zapisz w trzeciej zmiennej, a następnie wypisz wartość tej trzeciej zmiennej.",
    required: [
      { type: "variables_set", count: 3 }, // 2 zmienne + 1 do zapisania wyniku
      { type: "variables_get", count: 2 }, // użycie 2 zmiennych w obliczeniach
      "math_arithmetic",
      "text_print"
    ],
    rozwiazanie: "60",
  },
  matematyczne_3: {
    kategoria: "matematyczne",
    tytul: "Matematyczne 3: Zaokrąglanie",
    opis: "Zaokrąglij liczbę 3.7 do najbliższej liczby całkowitej używając bloku 'zaokrąglij' i wypisz wynik.",
    required: ["math_round", "text_print"],
    rozwiazanie: "4",
  },
  matematyczne_4: {
    kategoria: "matematyczne",
    tytul: "Matematyczne 4: Rzut kostką",
    opis: "Użyj bloku 'losowa liczba', aby wylosować liczbę od 1 do 6 (jak rzut kostką) i wypisz wynik. (Uwaga: wynik może być różny za każdym razem, ale powinien być w zakresie 1-6)",
    required: ["math_random_int", "text_print"],
    rozwiazanie: "", // Nie sprawdzamy dokładnej wartości, bo jest losowa
    logicCheck: ({ output }) => {
      const num = parseInt(output.trim());
      if (isNaN(num)) {
        return "Wynik musi być liczbą od 1 do 6";
      }
      if (num >= 1 && num <= 6) {
        return true;
      }
      return "Wylosowana liczba musi być w zakresie 1-6";
    },
  },

  // ========== KOMBINOWANE (5 zadań) ==========
  kombinowane_1: {
    kategoria: "kombinowane",
    tytul: "Kombinowane 1: Parzyste liczby w pętli",
    opis: "Użyj pętli FOR od 1 do 10. W każdej iteracji sprawdź, czy licznik jest parzysty (reszta z dzielenia przez 2 = 0). Jeśli tak, wypisz licznik.",
    required: ["controls_for", "controls_if", "math_modulo", "variables_get", "text_print"],
    rozwiazanie: "2\n4\n6\n8\n10",
  },
  kombinowane_2: {
    kategoria: "kombinowane",
    tytul: "Kombinowane 2: Suma w pętli",
    opis: "Stwórz zmienną i ustaw ją na 0. Użyj pętli FOR od 1 do 5. W każdej iteracji dodaj licznik do tej zmiennej. Na końcu wypisz tekst 'Suma wynosi: ' połączony z wartością tej zmiennej.",
    required: ["variables_set", "controls_for", "variables_get", "math_arithmetic", "text_print", "text_join"],
    rozwiazanie: "Suma wynosi: 15",
  },
  kombinowane_3: {
    kategoria: "kombinowane",
    tytul: "Kombinowane 3: Warunek z obliczeniami",
    opis: "Stwórz dwie zmienne: pierwszą ustaw na 50, drugą ustaw na 10. Oblicz różnicę (pierwsza - druga) i zapisz w trzeciej zmiennej. Sprawdź, czy trzecia zmienna jest mniejsza od 45. Jeśli tak, wypisz 'Tania!', w przeciwnym razie wypisz 'Droga'.",
    required: ["variables_set", "variables_get", "math_arithmetic", "controls_if", "logic_compare", "text_print"],
    rozwiazanie: "Droga",
  },
  kombinowane_4: {
    kategoria: "kombinowane",
    tytul: "Kombinowane 4: Licznik w pętli WHILE",
    opis: "Stwórz zmienną i ustaw ją na 1. Użyj pętli WHILE, aby wypisywać wartość tej zmiennej, dopóki jest mniejsza od 4. W każdej iteracji zwiększ zmienną o 1. Wypisz tekst 'Liczba: ' połączony z wartością zmiennej w każdej iteracji.",
    required: ["variables_set", "controls_whileUntil", "variables_get", "math_change", "text_print", "text_join", "logic_compare"],
    rozwiazanie: "Liczba: 1\nLiczba: 2\nLiczba: 3",
  },
  kombinowane_5: {
    kategoria: "kombinowane",
    tytul: "Kombinowane 5: Warunek z modulo w pętli",
    opis: "Użyj pętli FOR od 10 do 20. W każdej iteracji sprawdź, czy licznik jest podzielny przez 3 (reszta z dzielenia przez 3 = 0). Jeśli tak, wypisz tekst 'Liczba X jest podzielna przez 3', gdzie X to wartość licznika. Użyj bloku 'połącz' do stworzenia tego tekstu.",
    required: ["controls_for", "controls_if", "math_modulo", "logic_compare", "variables_get", "text_print", "text_join"],
    rozwiazanie: "Liczba 12 jest podzielna przez 3\nLiczba 15 jest podzielna przez 3\nLiczba 18 jest podzielna przez 3",
  },
  kombinowane_6: {
    kategoria: "kombinowane",
    tytul: "Kombinowane 6: Długość słowa w pętli",
    opis: "Stwórz zmienną i ustaw ją na tekst 'Programowanie'. Użyj pętli 'powtórz' 3 razy. W każdej iteracji wypisz tekst 'Długość słowa: ' połączony z długością tego słowa (użyj bloku 'długość').",
    required: ["variables_set", "controls_repeat_ext", "text_length", "text_join", "text_print", "variables_get"],
    rozwiazanie: "Długość słowa: 14\nDługość słowa: 14\nDługość słowa: 14",
  },

  // ========== GRAFICZNE (ze sceną) ==========
  graficzne_1: {
    kategoria: "graficzne",
    tytul: "Graficzne 1",
    opis: "xxxx",
  },
};
