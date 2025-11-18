export const teoria = {
  zmienne: {
    tytul: "Zmienne",
    opis: "Zmienne to jak pudełka z etykietami. Możesz w nich przechowywać informacje, aby użyć ich później w swoim programie.",
    sekcje: [
      {
        naglowek: "Co to jest zmienna?",
        tresc: `Zmienna to **miejsce w pamięci komputera**, które ma swoją **nazwę** (jak etykieta na pudełku) i przechowuje jakąś **wartość** (jak zawartość pudełka).

* **Nazwa:** Służy do odwoływania się do zmiennej (np. \`wiek\`, \`punkty\`, \`imie_gracza\`). Nazwy powinny być zrozumiałe i nie mogą zawierać spacji.
* **Wartość:** To informacja, którą przechowujemy (np. liczba \`10\`, tekst \`"Ala"\`, lub wartość \`prawda\`).

W Blockly, zanim użyjesz zmiennej, musisz ją najpierw **stworzyć** za pomocą specjalnego przycisku.`,
        przyklad: {
          bloki: [
            {
              createVariableButton: {
                label: "Utwórz zmienną..."
              },
              opis: "Kliknij ten przycisk w kategorii 'Zmienne', aby nadać nazwę swojemu nowemu 'pudełku' (zmiennej)."
            }
          ]
        }
      },
      {
        naglowek: "1. Ustawianie wartości (Set)",
        tresc: `Pierwszą rzeczą, jaką robimy ze zmienną, jest włożenie czegoś do środka. Używamy do tego bloku **'ustaw na'**. 
        To tak, jakbyś wkładał do pudełka o nazwie \`imie\` karteczkę z napisem 'Ania'.`,
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" id="var1">
                  <field name="VAR">imie</field>
                  <value name="VALUE">
                    <block type="text">
                      <field name="TEXT">Ania</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Ten blok ustawia zmienną o nazwie 'imie' na wartość tekstową 'Ania'."
            },
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" id="var2">
                  <field name="VAR">wiek</field>
                  <value name="VALUE">
                    <block type="math_number">
                      <field name="NUM">8</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Ten blok ustawia zmienną 'wiek' na wartość liczbową 8."
            }
          ]
        }
      },
      {
        naglowek: "2. Odczytywanie wartości (Get)",
        tresc: `Gdy chcesz sprawdzić, co jest w pudełku (zmiennej), używasz bloku z samą jej nazwą. Ten blok **zwraca** wartość, która jest aktualnie w środku.
        Możesz go podłączyć wszędzie tam, gdzie pasuje jego kształt (np. do bloku 'drukuj' lub do bloku matematycznego).`,
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="text_print" id="print1">
                  <value name="TEXT">
                    <block type="variables_get">
                      <field name="VAR">imie</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Ten program wypisze na ekranie wartość zmiennej 'imie', czyli 'Ania'."
            },
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_get" id="var_get">
                  <field name="VAR">wiek</field>
                </block>
              </xml>`,
              opis: "To jest właśnie blok 'Get'. Sam w sobie nic nie robi, ale \"jest\" wartością, którą przechowuje (w tym przypadku liczbą 8)."
            }
          ]
        }
      },
      {
        naglowek: "3. Zmienianie wartości (Change)",
        tresc: `Wartość zmiennej można zmieniać w trakcie działania programu. To kluczowa cecha!

1. Możesz użyć bloku **'ustaw na'** ponownie, aby całkowicie zastąpić starą wartość nową.
2. Jeśli zmienna przechowuje liczbę, możesz użyć bloku **'zmień o'**. Działa on jak skarbonka – dodaje (lub odejmuje) wartość do tej, która już tam jest. Jest idealny do liczenia punktów lub kroków.`,
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" id="var1">
                  <field name="VAR">punkty</field>
                  <value name="VALUE">
                    <block type="math_number">
                      <field name="NUM">0</field>
                    </block>
                  </value>
                  <next>
                    <block type="math_change" id="var2">
                      <field name="VAR">punkty</field>
                      <value name="DELTA">
                        <block type="math_number">
                          <field name="NUM">1</field>
                        </block>
                      </value>
                    </block>
                  </next>
                </block>
              </xml>`,
              opis: "Najpierw ustawiamy 'punkty' na 0. Potem blok 'zmień o' dodaje 1. Zmienna 'punkty' ma teraz wartość 1."
            },
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" id="var3">
                  <field name="VAR">imie</field>
                  <value name="VALUE">
                    <block type="text">
                      <field name="TEXT">Tomek</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Jeśli wcześniej zmienna 'imie' miała wartość 'Ania', ten blok ją nadpisuje. Teraz 'imie' ma wartość 'Tomek'."
            }
          ]
        }
      },
      {
        naglowek: "Typy danych w zmiennych",
        tresc: `Zmienne mogą przechowywać różne rodzaje informacji. Blockly samo rozpoznaje typ na podstawie bloku, który do niej podłączasz.

* **Tekst (String):** Dowolny ciąg znaków, np. "Cześć", "Kot". Używamy różowych bloków tekstowych.
* **Liczba (Number):** Liczby całkowite (5, -10) lub dziesiętne (3.14). Używamy niebieskich bloków liczbowych.
* **Prawda/Fałsz (Boolean):** Tylko dwie wartości: \`prawda\` (true) lub \`fałsz\` (false). Używane w logice i warunkach (np. 'czy gracz skoczył?').
* **Lista (List):** Specjalny rodzaj zmiennej, który jest jak pudełko z przegródkami – może przechowywać wiele wartości naraz (np. lista zakupów).`,
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" id="v_bool">
                  <field name="VAR">czyPada</field>
                  <value name="VALUE">
                    <block type="logic_boolean">
                      <field name="BOOL">TRUE</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Zmienna logiczna (Boolean). 'czyPada' ma wartość 'prawda'."
            },
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" id="v_list">
                  <field name="VAR">zakupy</field>
                  <value name="VALUE">
                    <block type="lists_create_with" id="list1">
                      <mutation items="3"></mutation>
                      <value name="ADD0">
                        <block type="text">
                          <field name="TEXT">mleko</field>
                        </block>
                      </value>
                      <value name="ADD1">
                        <block type="text">
                          <field name="TEXT">chleb</field>
                        </block>
                      </value>
                      <value name="ADD2">
                        <block type="text">
                          <field name="TEXT">jajka</field>
                        </block>
                      </value>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Zmienna przechowująca listę. 'zakupy' zawiera teraz 3 elementy."
            }
          ]
        }
      },
      {
        naglowek: "Praktyczny przykład: Suma",
        tresc: `Zmienne pozwalają nam rozbić problem na mniejsze kroki. Tutaj przechowujemy dwie liczby w zmiennych, a następnie wynik ich dodawania zapisujemy w trzeciej zmiennej.`,
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="variables_set" id="v1">
              <field name="VAR">liczba1</field>
              <value name="VALUE">
                <block type="math_number">
                  <field name="NUM">5</field>
                </block>
              </value>
              <next>
                <block type="variables_set" id="v2">
                  <field name="VAR">liczba2</field>
                  <value name="VALUE">
                    <block type="math_number">
                      <field name="NUM">3</field>
                    </block>
                  </value>
                  <next>
                    <block type="variables_set" id="v3">
                      <field name="VAR">suma</field>
                      <value name="VALUE">
                        <block type="math_arithmetic">
                          <field name="OP">ADD</field>
                          <value name="A">
                            <block type="variables_get">
                              <field name="VAR">liczba1</field>
                            </block>
                          </value>
                          <value name="B">
                            <block type="variables_get">
                              <field name="VAR">liczba2</field>
                            </block>
                          </value>
                        </block>
                      </value>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </xml>`,
          wyjasnienie: `1. Ustaw 'liczba1' na 5.
2. Ustaw 'liczba2' na 3.
3. Ustaw 'suma' na wynik działania 'liczba1' + 'liczba2'.

Po wykonaniu tych bloków, zmienna 'suma' będzie miała wartość 8.`
        }
      }
    ]
  },

  petle: {
    tytul: "Pętle",
    opis: "Pętle pozwalają powtarzać te same czynności wiele razy!",
    sekcje: [
      {
        naglowek: "Co to jest pętla?",
        tresc: `Pętla to sposób na powtarzanie tych samych instrukcji wiele razy. 

Wyobraź sobie, że musisz powiedzieć "Cześć!" 10 razy. Zamiast pisać to 10 razy, możesz użyć pętli, która zrobi to za Ciebie!`,
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="controls_repeat_ext" id="loop1">
              <value name="TIMES">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
              <statement name="DO">
                <block type="text_print">
                  <value name="TEXT">
                    <block type="text">
                      <field name="TEXT">Cześć!</field>
                    </block>
                  </value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Pętla 'powtórz' wykona instrukcję 10 razy automatycznie!"
        }
      },
      {
        naglowek: "Rodzaje pętli",
        tresc: `Istnieje kilka rodzajów pętli:

• **Pętla FOR** - gdy wiesz dokładnie, ile razy chcesz coś powtórzyć
• **Pętla WHILE** - gdy chcesz powtarzać coś, dopóki jakiś warunek jest spełniony
• **Pętla DO-WHILE** - podobna do WHILE, ale zawsze wykona się przynajmniej raz`,
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="controls_for" id="for1">
              <field name="VAR">i</field>
              <value name="FROM">
                <block type="math_number">
                  <field name="NUM">1</field>
                </block>
              </value>
              <value name="TO">
                <block type="math_number">
                  <field name="NUM">5</field>
                </block>
              </value>
              <value name="BY">
                <block type="math_number">
                  <field name="NUM">1</field>
                </block>
              </value>
              <statement name="DO">
                <block type="text_print">
                  <value name="TEXT">
                    <block type="text_join">
                      <mutation items="2"></mutation>
                      <value name="ADD0">
                        <block type="text">
                          <field name="TEXT">Liczba: </field>
                        </block>
                      </value>
                      <value name="ADD1">
                        <block type="variables_get">
                          <field name="VAR">i</field>
                        </block>
                      </value>
                    </block>
                  </value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Pętla FOR liczy od 1 do 5 i wykonuje instrukcję dla każdej liczby."
        }
      },
      {
        naglowek: "Jak działa pętla FOR?",
        tresc: `Pętla FOR składa się z trzech części:

1. **Inicjalizacja** (\`let i = 0\`) - zaczynamy od jakiejś wartości
2. **Warunek** (\`i < 10\`) - powtarzamy, dopóki warunek jest prawdziwy
3. **Krok** (\`i++\`) - zwiększamy wartość po każdym powtórzeniu`,
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="controls_for" id="for1">
              <field name="VAR">i</field>
              <value name="FROM">
                <block type="math_number">
                  <field name="NUM">0</field>
                </block>
              </value>
              <value name="TO">
                <block type="math_number">
                  <field name="NUM">4</field>
                </block>
              </value>
              <value name="BY">
                <block type="math_number">
                  <field name="NUM">1</field>
                </block>
              </value>
              <statement name="DO">
                <block type="text_print">
                  <value name="TEXT">
                    <block type="text_join">
                      <mutation items="2"></mutation>
                      <value name="ADD0">
                        <block type="text">
                          <field name="TEXT">Powtórzenie numer: </field>
                        </block>
                      </value>
                      <value name="ADD1">
                        <block type="variables_get">
                          <field name="VAR">i</field>
                        </block>
                      </value>
                    </block>
                  </value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Zmienna 'i' liczy, ile razy już wykonaliśmy pętlę - zaczyna od 0 i idzie do 4."
        }
      },
      {
        naglowek: "Praktyczne przykłady",
        tresc: `Pętle są bardzo przydatne w codziennym programowaniu:

✓ Liczenie od 1 do 100
✓ Wyświetlanie listy imion
✓ Rysowanie wielu kształtów
✓ Powtarzanie akcji w grach`,
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="controls_for" id="for1">
              <field name="VAR">i</field>
              <value name="FROM">
                <block type="math_number">
                  <field name="NUM">1</field>
                </block>
              </value>
              <value name="TO">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
              <value name="BY">
                <block type="math_number">
                  <field name="NUM">1</field>
                </block>
              </value>
              <statement name="DO">
                <block type="text_print">
                  <value name="TEXT">
                    <block type="variables_get">
                      <field name="VAR">i</field>
                    </block>
                  </value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Ta pętla wyświetli liczby od 1 do 10, każdą w osobnej linii."
        }
      },
      {
        naglowek: "Uwaga na nieskończone pętle!",
        tresc: `**Ważne:** Upewnij się, że pętla ma warunek, który kiedyś przestanie być spełniony! 

W przeciwnym razie pętla będzie działać w nieskończoność i program się zawiesi.`,
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="variables_set" id="v1">
              <field name="VAR">i</field>
              <value name="VALUE">
                <block type="math_number">
                  <field name="NUM">0</field>
                </block>
              </value>
            </block>
            <block type="controls_whileUntil" id="while1">
              <field name="MODE">WHILE</field>
              <value name="BOOL">
                <block type="logic_compare">
                  <field name="OP">LT</field>
                  <value name="A">
                    <block type="variables_get">
                      <field name="VAR">i</field>
                    </block>
                  </value>
                  <value name="B">
                    <block type="math_number">
                      <field name="NUM">10</field>
                    </block>
                  </value>
                </block>
              </value>
              <statement name="DO">
                <block type="text_print">
                  <value name="TEXT">
                    <block type="variables_get">
                      <field name="VAR">i</field>
                    </block>
                  </value>
                </block>
                <block type="variables_set" id="v2">
                  <field name="VAR">i</field>
                  <value name="VALUE">
                    <block type="math_arithmetic">
                      <field name="OP">ADD</field>
                      <value name="A">
                        <block type="variables_get">
                          <field name="VAR">i</field>
                        </block>
                      </value>
                      <value name="B">
                        <block type="math_number">
                          <field name="NUM">1</field>
                        </block>
                      </value>
                    </block>
                  </value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Zawsze upewnij się, że pętla ma sposób na zakończenie - tutaj zwiększamy 'i', więc kiedyś będzie >= 10."
        }
      }
    ]
  },

  warunki: {
    tytul: "Warunki",
    opis: "Warunki pozwalają podejmować różne decyzje w programie!",
    sekcje: [
      {
        naglowek: "Co to jest warunek?",
        tresc: `Warunek to wyrażenie logiczne, które może być prawdziwe lub fałszywe. 

Wyobraź sobie, że musisz sprawdzić, czy jakaś liczba jest większa od 10.`
      }
    ]
  }
};
